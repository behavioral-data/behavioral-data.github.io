"""OpenAlex observations -> review queue. No site content is changed by discovery."""
import argparse
import copy
from datetime import date, datetime, timedelta, timezone
from difflib import SequenceMatcher
import hashlib
import json
import os
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
MANAGED_FIELDS = ('title', 'authors', 'authorNames', 'year', 'venue', 'doi', 'url', 'status', 'openalexId', 'type')


def read(path):
    return json.loads(path.read_text())


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    temp.replace(path)


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def doi(value):
    return re.sub(r'^https?://(?:dx\.)?doi\.org/', '', value or '', flags=re.I).strip().lower()


def title_key(value):
    return re.sub(r'[^\w]', '', value.casefold())


def work_id(value):
    short = (value or '').rsplit('/', 1)[-1]
    if not re.fullmatch(r'W\d+', short):
        raise ValueError('Invalid OpenAlex work ID')
    return short


def normalize(work, authors):
    wid = work_id(work.get('id'))
    authorships = work.get('authorships', [])
    names = [a.get('author', {}).get('display_name', '') for a in authorships]
    matched = sorted({a['personId'] for a in authors if any(
        item.get('author', {}).get('id', '').rsplit('/', 1)[-1] == a['openalexId'] for item in authorships)})
    if not matched:
        raise ValueError(f'{wid}: response contains no configured author identity')
    if not work.get('title') or not names or any(not name for name in names) or not isinstance(work.get('publication_year'), int):
        raise ValueError(f'{wid}: incomplete bibliographic metadata')
    location = work.get('primary_location') or {}
    kind = work.get('type', 'other')
    status = 'retracted' if work.get('is_retracted') else ('preprint' if kind == 'preprint' else 'published')
    normalized = {
        'id': 'openalex-' + wid.lower(), 'title': work['title'], 'authors': ' and '.join(names), 'authorNames': names,
        'year': work['publication_year'], 'venue': (location.get('source') or {}).get('display_name', ''),
        'doi': doi(work.get('doi')), 'url': location.get('landing_page_url') or work['id'],
        'status': status, 'type': {'article':'article','preprint':'preprint','book':'book','dataset':'dataset'}.get(kind,'other'),
        'openalexId': wid,
    }
    return normalized, matched


def validate_authors(authors, people):
    ids = {p['id'] for p in people}
    seen = set()
    for row in authors:
        if row.get('personId') not in ids or not re.fullmatch(r'A\d+', row.get('openalexId', '')):
            raise ValueError('Author configuration requires a known personId and OpenAlex A… ID')
        if row['openalexId'] in seen:
            raise ValueError('An OpenAlex identity cannot be assigned twice')
        seen.add(row['openalexId'])
        if row.get('verified') is not True or not re.match(r'^https?://', row.get('sourceUrl','')):
            raise ValueError('Every discovery author needs explicit verification and evidence')
        date.fromisoformat(row['verifiedOn'])


class OpenAlex:
    def __init__(self, max_requests=100, cache_dir=None, api_key=None, opener=urlopen, sleep=time.sleep):
        self.remaining = max_requests
        self.cache_dir = cache_dir
        self.api_key = api_key
        self.opener = opener
        self.sleep = sleep

    def get(self, params):
        # Cache keys never include credentials; response files are ignored by Git.
        key = fingerprint(params)
        path = self.cache_dir / (key + '.json') if self.cache_dir else None
        if path and path.exists() and time.time() - path.stat().st_mtime < 21600:
            return read(path)
        for attempt in range(3):
            if self.remaining <= 0:
                raise RuntimeError('OpenAlex request budget exhausted; run was not checkpointed')
            self.remaining -= 1
            query = {**params, **({'api_key': self.api_key} if self.api_key else {})}
            request = Request('https://api.openalex.org/works?' + urlencode(query), headers={'User-Agent': 'BDataWebsite/1.0'})
            try:
                with self.opener(request, timeout=30) as response:
                    result = json.load(response)
                if not isinstance(result.get('results'), list) or not isinstance(result.get('meta'), dict):
                    raise ValueError('OpenAlex returned an invalid page')
                if path:
                    save(path, result)
                self.sleep(0.2)
                return result
            except HTTPError as error:
                if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                    # Never serialize HTTP exception URLs: they may include an API key.
                    raise RuntimeError(f'OpenAlex HTTP {error.code}; run was not checkpointed') from None
                delay = error.headers.get('Retry-After', '') if error.headers else ''
                self.sleep(min(30, int(delay)) if delay.isdigit() else 2 ** attempt)
            except (URLError, TimeoutError):
                if attempt == 2:
                    raise RuntimeError('OpenAlex network failure; run was not checkpointed') from None
                self.sleep(2 ** attempt)

    def works(self, author, since=None):
        filters = 'author.id:' + author
        if since:
            filters += ',from_publication_date:' + since
        cursor = '*'
        seen = set()
        while cursor:
            if cursor in seen:
                raise RuntimeError('OpenAlex repeated a cursor; refusing an incomplete sync')
            seen.add(cursor)
            page = self.get({'filter': filters, 'per_page': 100, 'cursor': cursor})
            if 'next_cursor' not in page['meta']:
                raise RuntimeError('OpenAlex omitted the cursor; refusing an incomplete sync')
            yield from page['results']
            cursor = page['meta'].get('next_cursor')


def collect(client, authors, since=None):
    # Finish every author/page before changing the durable queue or checkpoint.
    works = {}
    for author in authors:
        for work in client.works(author['openalexId'], since):
            works[work_id(work.get('id'))] = work
    return list(works.values())


def merge_candidates(works, papers, authors, queue, today):
    result = copy.deepcopy(queue)
    by_id = {c['id']: c for c in result['candidates']}
    for work in sorted(works, key=lambda w: w['id']):
        observed, matched = normalize(work, authors)
        cid = observed['id']
        old = by_id.get(cid)
        if observed['doi'] and any(c['status'] == 'rejected' and doi(c['observed'].get('doi')) == observed['doi'] for c in result['candidates']):
            continue
        digest = fingerprint({'observed': observed, 'personIds': matched})
        if old and old['status'] == 'rejected':
            continue
        if old and old['fingerprint'] == digest:
            if old['status'] == 'deferred' and old.get('deferUntil', '9999') <= today:
                old['status'] = 'pending'
            continue
        exact = [p for p in papers if (observed['doi'] and doi(p.get('doi')) == observed['doi']) or p.get('openalexId') == observed['openalexId']]
        similar = [p['id'] for p in papers if SequenceMatcher(None, title_key(p['title']), title_key(observed['title'])).ratio() >= .9 and p not in exact]
        target = exact[0] if len(exact) == 1 else None
        changes = {}
        conflicts = []
        for field in MANAGED_FIELDS:
            if target and target.get(field) == observed[field]:
                continue
            # Once reviewed, only changed source fields become new proposals.
            if old and old['status'] == 'accepted' and old['observed'].get(field) == observed[field]:
                continue
            changes[field] = observed[field]
            if old and target and old['status'] == 'accepted' and target.get(field) != old['observed'].get(field):
                conflicts.append(field)
        if target and not changes and not (old and old['status'] in ('pending','deferred')):
            continue
        candidate = {
            'id': cid, 'status': 'pending', 'firstSeen': old['firstSeen'] if old else today,
            'fingerprint': digest, 'sourceUrl': 'https://openalex.org/' + observed['openalexId'],
            'observed': observed, 'matchedPersonIds': matched,
            'targetId': target['id'] if target else None, 'base': {f: target.get(f) for f in changes} if target else {},
            'changes': changes, 'possibleDuplicates': sorted(set(similar + ([p['id'] for p in exact] if len(exact) > 1 else []))),
            'conflicts': conflicts,
        }
        if old and old['status'] in ('pending','deferred'):
            # A reviewer may have edited this candidate. Keep edits and expose newer source separately.
            old['latestObservation'] = {'observed': observed, 'matchedPersonIds': matched, 'fingerprint': digest}
            continue
        if old:
            result['candidates'][result['candidates'].index(old)] = candidate
        else:
            result['candidates'].append(candidate)
        by_id[cid] = candidate
    result['candidates'].sort(key=lambda c: c['id'])
    return result


def report(queue):
    lines = ['# Publication review batch', '', 'Edit decisions with `python3 scripts/review.py`; approval changes local content for PR review, never the live site.', '']
    active = [c for c in queue['candidates'] if c['status'] == 'pending']
    if not active:
        lines += ['No pending candidates.', '']
    for c in active:
        # Provider strings are data, not executable Markdown or workflow expressions.
        title = re.sub(r'[\r\n<>`\[\]]', ' ', c['observed']['title'])
        lines += [f"## {c['id']}", '', title, '', f"Source: {c['sourceUrl']}", '',
                  f"Matched people (lab relevance still needs review): {', '.join(c['matchedPersonIds'])}", '',
                  f"Target: {c['targetId'] or 'new record'}", '', 'Proposed fields: ' + ', '.join(c['changes']), '']
        if c['possibleDuplicates']:
            lines += ['Possible duplicates: ' + ', '.join(c['possibleDuplicates']), '']
        if c['conflicts']:
            lines += ['Manual/source conflicts: ' + ', '.join(c['conflicts']), '']
        if c.get('latestObservation'):
            lines += ['A newer source observation is attached; reconcile it before accepting.', '']
    return '\n'.join(lines)


def run(root=ROOT, fixture=None, today=None, client=None):
    today = today or date.today().isoformat()
    config = read(root / 'maintenance/config.json')
    if not config['enabled'] and fixture is None:
        print('Discovery is disabled. Configure verified identities before enabling it.')
        return
    authors = read(root / 'maintenance/authors.json')
    validate_authors(authors, read(root / 'content/people.json'))
    if not authors:
        raise ValueError('No verified author identities configured')
    if not 1 <= config['maxRequests'] <= 1000 or not 1 <= config['lookbackDays'] <= 365 or not 1 <= config['reconcileDays'] <= 365:
        raise ValueError('Invalid request budget or sync intervals')
    state_path = root / '.cache/discovery-state.json'
    state = read(state_path) if state_path.exists() else {'lastSuccess': None, 'lastFullSync': None}
    full = not state['lastFullSync'] or (date.fromisoformat(today) - date.fromisoformat(state['lastFullSync'])).days >= config['reconcileDays']
    since = None if full or not state['lastSuccess'] else (date.fromisoformat(state['lastSuccess']) - timedelta(days=config['lookbackDays'])).isoformat()
    client = client or OpenAlex(config['maxRequests'], root / '.cache/openalex', os.environ.get('OPENALEX_API_KEY'))
    works = read(fixture) if fixture is not None else collect(client, authors, since)
    queue_path = root / 'maintenance/review.json'
    queue = merge_candidates(works, read(root / 'content/publications.json'), authors, read(queue_path), today)
    save(queue_path, queue)
    (root / 'maintenance/batch.md').write_text(report(queue))
    # Fixtures must not masquerade as a successful live sync.
    if fixture is None:
        save(state_path, {'lastSuccess': today, 'lastFullSync': today if full else state['lastFullSync']})
    print(f"Observed {len(works)} works; {sum(c['status'] == 'pending' for c in queue['candidates'])} pending candidates. Approved content unchanged.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--fixture', type=Path, help='Test-only records; use a temporary --root')
    args = parser.parse_args()
    try:
        run(args.root, args.fixture)
    except (ValueError, RuntimeError, KeyError) as error:
        raise SystemExit(str(error)) from None
