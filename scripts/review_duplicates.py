"""Group duplicate review records while retaining source observations and decisions."""
import re
import unicodedata


def key(value):
    value = unicodedata.normalize('NFKD', value).casefold().replace('\\n', ' ')
    return ''.join(c for c in value if c.isalnum())


def identifiers(paper):
    values = set()
    doi = re.sub(r'^https?://(?:dx\.)?doi\.org/', '', paper.get('doi') or '', flags=re.I).lower()
    if doi:
        values.add('doi:' + doi)
    for value in [paper.get('url') or '', doi]:
        match = re.search(r'(?:arxiv\.org/(?:abs|pdf)/|arxiv\.)(\d{4}\.\d{4,5})(?:v\d+)?', value, re.I)
        if match:
            values.add('arxiv:' + match[1])
    return values


def same_paper(left, right):
    if identifiers(left) & identifiers(right):
        return True
    if any(p.get('type') in ('dataset', 'book') or
           p['title'].casefold().startswith(('author response', 'correction', 'erratum', 'peer review'))
           for p in (left, right)):
        return False
    # Never collapse papers solely because a fuzzy title or one author matches.
    authors_left = sorted(key(n) for n in left.get('authorNames', []))
    authors_right = sorted(key(n) for n in right.get('authorNames', []))
    return (len(key(left['title'])) >= 20 and key(left['title']) == key(right['title'])
            and bool(authors_left) and authors_left == authors_right)


def group_duplicates(queue):
    candidates = queue['candidates']
    verified_groups = [set(g['candidateIds']) for g in queue.get('verifiedDuplicateGroups', [])]
    def matches(left, right):
        return (same_paper(left['observed'], right['observed']) or
                any({left['id'], right['id']} <= ids for ids in verified_groups))
    for c in candidates:
        c.pop('duplicateOf', None)
        c.pop('alternateRecordIds', None)
    groups = []
    for c in candidates:
        matching_groups = [g for g in groups if any(matches(c, x) for x in g)]
        group = [c]
        for match in matching_groups:
            group.extend(match)
            groups.remove(match)
        groups.append(group)
    for group in groups:
        if len(group) < 2:
            continue
        def preference(c):
            p = c['observed']
            return ({'accepted': 0, 'rejected': 1, 'deferred': 2, 'pending': 3}[c['status']], not bool(c.get('targetId')),
                    p.get('status') == 'preprint', not bool(p.get('doi')), c['id'])
        canonical = min(group, key=preference)
        canonical['alternateRecordIds'] = sorted(c['id'] for c in group if c is not canonical)
        for c in group:
            if c is not canonical:
                c['duplicateOf'] = canonical['id']
    return queue
