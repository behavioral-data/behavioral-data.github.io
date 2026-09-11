"""Validate public maintenance configuration and review state without network access."""
from datetime import date
import re
from discovery import ROOT, MANAGED_FIELDS, fingerprint, read, validate_authors, work_id
from publication_policy import (acceptance_review, load_people, validate_assessment,
                                validate_policy, validate_recorded_review)


def validate(root=ROOT):
    config = read(root / 'maintenance/config.json')
    if not isinstance(config['enabled'], bool) or config['provider'] != 'openalex':
        raise ValueError('Invalid discovery configuration')
    for field, maximum in [('maxRequests',1000),('lookbackDays',365),('reconcileDays',365),('maxRunAgeDays',365),('maxReviewAgeDays',365)]:
        if type(config[field]) is not int or not 1 <= config[field] <= maximum:
            raise ValueError('Invalid maintenance setting: ' + field)
    people = load_people(root)
    policy_path = root / 'maintenance/publication-policy.json'
    if not policy_path.exists():
        raise ValueError('Missing maintenance/publication-policy.json')
    policy = read(policy_path)
    validate_policy(policy, people)
    authors = read(root / 'maintenance/authors.json')
    validate_authors(authors, people)
    if config['enabled'] and not authors:
        raise ValueError('Enabled discovery needs a verified author roster')
    queue = read(root / 'maintenance/review.json')
    if queue.get('version') != 1 or not isinstance(queue.get('candidates'), list):
        raise ValueError('Unsupported review queue')
    seen = set()
    ids = {p['id'] for p in people}
    papers = {p['id'] for p in read(root / 'content/publications.json')}
    for c in queue['candidates']:
        if c['id'] in seen or not re.fullmatch(r'openalex-w\d+', c['id']):
            raise ValueError('Invalid or duplicate candidate ID')
        seen.add(c['id'])
        if c['status'] not in ('pending','accepted','rejected','deferred'):
            raise ValueError('Invalid review status')
        date.fromisoformat(c['firstSeen'])
        if c['status'] == 'deferred':
            date.fromisoformat(c['deferUntil'])
        if not re.fullmatch(r'[a-f0-9]{64}', c['fingerprint']):
            raise ValueError('Invalid observation fingerprint')
        if c['fingerprint'] != fingerprint({'observed': c['observed'],
                                            'personIds': c['matchedPersonIds']}):
            raise ValueError('Candidate observation or matched identities changed without recollection')
        wid = work_id(c['observed']['openalexId'])
        if c['sourceUrl'] != 'https://openalex.org/' + wid or c['id'] != 'openalex-' + wid.lower():
            raise ValueError('Candidate source and ID mismatch')
        if not c['matchedPersonIds'] or not set(c['matchedPersonIds']) <= ids:
            raise ValueError('Unknown matched people')
        validate_assessment(c, people, policy)
        if c['targetId'] and c['targetId'] not in papers:
            raise ValueError('Unknown candidate target')
        if not set(c['possibleDuplicates']) <= papers:
            raise ValueError('Unknown duplicate candidate')
        if not set(c['changes']) <= set(MANAGED_FIELDS) or not set(c['conflicts']) <= set(MANAGED_FIELDS):
            raise ValueError('Unsupported proposed fields')
        if c['status'] == 'accepted':
            validate_recorded_review(c, policy)
    by_id = {c['id']: c for c in queue['candidates']}
    for c in queue['candidates']:
        if c.get('duplicateOf'):
            canonical = by_id.get(c['duplicateOf'])
            if not canonical or canonical.get('duplicateOf') or c['id'] not in canonical.get('alternateRecordIds', []):
                raise ValueError('Invalid duplicate reference')
        for alternate in c.get('alternateRecordIds', []):
            if alternate not in by_id or by_id[alternate].get('duplicateOf') != c['id']:
                raise ValueError('Invalid alternate record reference')
    for group in queue.get('verifiedDuplicateGroups', []):
        if len(set(group['candidateIds'])) < 2 or not set(group['candidateIds']) <= seen:
            raise ValueError('Invalid verified duplicate group')
        if not group.get('reason') or not group.get('sourceUrls') or not all(re.match(r'^https?://', url) for url in group['sourceUrls']):
            raise ValueError('Verified duplicate group needs evidence')
        date.fromisoformat(group['verifiedOn'])
    supplement_path = root / 'maintenance/scholar-supplement.json'
    if supplement_path.exists():
        supplements = read(supplement_path)
        date.fromisoformat(supplements['checkedOn'])
        supplement_ids = set()
        for candidate in supplements.get('candidates', []):
            if (candidate['id'] in supplement_ids
                    or not re.fullmatch(r'manual-[a-z0-9-]+', candidate['id'])):
                raise ValueError('Invalid or duplicate manual supplement ID')
            supplement_ids.add(candidate['id'])
            if candidate['status'] not in ('pending', 'accepted', 'rejected', 'deferred'):
                raise ValueError('Invalid manual supplement status')
            if (not re.match(r'^https?://', candidate.get('sourceUrl', ''))
                    or len(set(candidate.get('matchedPersonIds', []))) < policy['minimumLabAuthors']
                    or not set(candidate['matchedPersonIds']) <= ids):
                raise ValueError('Invalid manual supplement evidence or lab identities')
            if candidate['status'] == 'accepted':
                recorded = candidate.get('policyReview') or {}
                review_candidate = {
                    'matchedPersonIds': candidate['matchedPersonIds'],
                    'identityReviewPersonIds': [],
                    'labRelevance': {
                        'policyVersion': recorded.get('policyVersion'),
                        'status': recorded.get('labRelevanceStatus'),
                    },
                }
                expected = acceptance_review(
                    review_candidate, recorded.get('personIds'), policy,
                    recorded.get('overrideReason'), recorded.get('evidenceUrls'))
                if any(recorded.get(field) != value for field, value in expected.items()):
                    raise ValueError('Accepted manual supplement has an invalid policy review')
                if (candidate.get('targetId') not in papers
                        or recorded.get('reviewedOn') != candidate.get('reviewedOn')):
                    raise ValueError('Accepted manual supplement has an invalid target or review date')
                date.fromisoformat(recorded['reviewedOn'])
    return len(queue['candidates'])


if __name__ == '__main__':
    print(f'Validated maintenance settings, verified identities and {validate()} review candidates.')
