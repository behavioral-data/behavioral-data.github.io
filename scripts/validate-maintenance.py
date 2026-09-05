"""Validate public maintenance configuration and review state without network access."""
from datetime import date
import re
from discovery import ROOT, MANAGED_FIELDS, read, validate_authors, work_id


def validate(root=ROOT):
    config = read(root / 'maintenance/config.json')
    if not isinstance(config['enabled'], bool) or config['provider'] != 'openalex':
        raise ValueError('Invalid discovery configuration')
    for field, maximum in [('maxRequests',1000),('lookbackDays',365),('reconcileDays',365),('maxRunAgeDays',365),('maxReviewAgeDays',365)]:
        if type(config[field]) is not int or not 1 <= config[field] <= maximum:
            raise ValueError('Invalid maintenance setting: ' + field)
    people = read(root / 'content/people.json')
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
        wid = work_id(c['observed']['openalexId'])
        if c['sourceUrl'] != 'https://openalex.org/' + wid or c['id'] != 'openalex-' + wid.lower():
            raise ValueError('Candidate source and ID mismatch')
        if not c['matchedPersonIds'] or not set(c['matchedPersonIds']) <= ids:
            raise ValueError('Unknown matched people')
        if c['targetId'] and c['targetId'] not in papers:
            raise ValueError('Unknown candidate target')
        if not set(c['possibleDuplicates']) <= papers:
            raise ValueError('Unknown duplicate candidate')
        if not set(c['changes']) <= set(MANAGED_FIELDS) or not set(c['conflicts']) <= set(MANAGED_FIELDS):
            raise ValueError('Unsupported proposed fields')
    return len(queue['candidates'])


if __name__ == '__main__':
    print(f'Validated maintenance settings, verified identities and {validate()} review candidates.')
