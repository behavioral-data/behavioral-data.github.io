"""Record a review decision; accepted changes stay local until a human merges the PR."""
import argparse
import copy
from datetime import date
from pathlib import Path
import subprocess
from discovery import ROOT, MANAGED_FIELDS, read, save, doi, report


def decide(root, cid, decision, person_ids=None, target_id=None, until=None):
    queue_path = root / 'maintenance/review.json'
    paper_path = root / 'content/publications.json'
    queue = read(queue_path)
    candidate = next((c for c in queue['candidates'] if c['id'] == cid), None)
    if candidate is None:
        raise ValueError('Unknown candidate ID')
    if decision == 'reopen':
        candidate['status'] = 'pending'
    elif decision == 'reject':
        candidate['status'] = 'rejected'
    elif decision == 'defer':
        if not until or date.fromisoformat(until) <= date.today():
            raise ValueError('Deferral needs a future --until YYYY-MM-DD')
        candidate.update(status='deferred', deferUntil=until)
    elif decision == 'accept':
        if candidate['status'] != 'pending':
            raise ValueError('Only pending candidates can be accepted; reopen it first')
        if candidate.get('latestObservation'):
            raise ValueError('Reconcile latestObservation with changes and observed, then remove latestObservation before accepting')
        if candidate.get('conflicts'):
            raise ValueError('Review conflicting fields, edit changes, and clear conflicts before accepting')
        known = {p['id'] for p in read(root / 'content/people.json')}
        if not person_ids or len(person_ids) != len(set(person_ids)) or not set(person_ids) <= known:
            raise ValueError('Acceptance requires explicitly reviewed --person IDs')
        if set(candidate['changes']) - set(MANAGED_FIELDS):
            raise ValueError('Proposal contains an unsupported field')
        if candidate['possibleDuplicates'] and not target_id:
            raise ValueError('Resolve possible duplicates with --target ID, or --target new after checking')
        papers = read(paper_path)
        target = target_id if target_id and target_id != 'new' else candidate.get('targetId')
        if target_id == 'new':
            target = None
        if target:
            index = next((i for i,p in enumerate(papers) if p['id'] == target), None)
            if index is None:
                raise ValueError('Unknown target publication')
            paper = copy.deepcopy(papers[index])
            if target == candidate.get('targetId'):
                for field, base in candidate['base'].items():
                    if paper.get(field) != base:
                        raise ValueError(f'{field} changed since discovery; reconcile the proposal first')
            paper.update(candidate['changes'])
        else:
            paper = {**candidate['observed'], **candidate['changes'], 'description':'', 'highlight':False, 'award':'', 'pdf':'', 'image':'', 'code':'', 'legacy':{}}
            if any(p['id'] == paper['id'] for p in papers):
                raise ValueError('Publication ID already exists; choose an update target')
        paper['personIds'] = person_ids
        paper['reviewedOn'] = date.today().isoformat()
        for p in papers:
            if p['id'] != paper['id'] and ((paper.get('doi') and doi(p.get('doi')) == doi(paper['doi'])) or (paper.get('openalexId') and p.get('openalexId') == paper['openalexId'])):
                raise ValueError('Exact duplicate identifier already exists')
        if target:
            papers[index] = paper
        else:
            papers.append(paper)
        original = paper_path.read_bytes()
        save(paper_path, papers)
        try:
            # Run the same schema, relationship and asset checks used by the site build.
            subprocess.run(['node', 'scripts/validate-content.mjs'], cwd=root, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as error:
            paper_path.write_bytes(original)
            raise ValueError('Content validation failed: ' + error.stderr) from None
        except Exception:
            paper_path.write_bytes(original)
            raise
        candidate.update(status='accepted', targetId=paper['id'], reviewedOn=paper['reviewedOn'])
    else:
        raise ValueError('Unknown review decision')
    save(queue_path, queue)
    (root / 'maintenance/batch.md').write_text(report(queue))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('id')
    parser.add_argument('decision', choices=['accept','reject','defer','reopen'])
    parser.add_argument('--person', action='append', default=[])
    parser.add_argument('--target')
    parser.add_argument('--until')
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    try:
        decide(args.root, args.id, args.decision, args.person, args.target, args.until)
        print('Decision saved locally. Inspect the diff, run checks, and submit it for PR review.')
    except (ValueError, KeyError) as error:
        raise SystemExit(str(error)) from None
