"""Explain and enforce lab relevance using verified identities, never name guesses."""
from datetime import date
import re


def validate_policy(policy, people):
    if (type(policy.get('version')) is not int
            or policy['version'] < 1
            or policy.get('piPersonId') not in {p['id'] for p in people}
            or policy.get('requirePiAuthor') is not True
            or type(policy.get('minimumLabAuthors')) is not int
            or policy['minimumLabAuthors'] < 2
            or policy.get('membershipBasis') != 'publication-date'
            or policy.get('humanReviewRequired') is not True):
        raise ValueError('Invalid publication relevance policy')


def assess(work, matched, people, policy):
    matched = sorted(set(matched))
    result = {'policyVersion': policy['version'], 'matchedPersonIds': matched,
              'publicationDate': work.get('publication_date'), 'memberPersonIds': [],
              'uncertainPersonIds': []}
    try:
        published = date.fromisoformat(work.get('publication_date') or '')
    except ValueError:
        published = None
    by_id = {p['id']: p for p in people}
    for pid in matched:
        if pid == policy['piPersonId']:
            result['memberPersonIds'].append(pid)
            continue
        periods = by_id.get(pid, {}).get('memberships')
        if not periods or published is None:
            result['uncertainPersonIds'].append(pid)
        elif any(date.fromisoformat(m['start']) <= published
                 and (not m.get('end') or published <= date.fromisoformat(m['end']))
                 for m in periods):
            result['memberPersonIds'].append(pid)
    confirmed = len(result['memberPersonIds'])
    possible = confirmed + len(result['uncertainPersonIds'])
    minimum = policy['minimumLabAuthors']
    if policy['requirePiAuthor'] and policy['piPersonId'] not in matched:
        status, reason = 'does-not-meet-rule', 'The required PI author is not on this paper.'
    elif confirmed >= minimum:
        status, reason = 'meets-rule', f'At least {minimum} distinct coauthors were lab members on the publication date.'
    elif possible >= minimum:
        status, reason = 'needs-membership-review', 'Enough lab identities match, but publication-time membership needs confirmation.'
    else:
        status, reason = 'does-not-meet-rule', f'Fewer than {minimum} matching authors with possible publication-time lab membership; Tim alone does not qualify.'
    return {**result, 'status': status, 'reason': reason}


def validate_assessment(candidate, people, policy):
    recorded = candidate.get('labRelevance') or {}
    expected = assess({'publication_date': recorded.get('publicationDate')},
                      candidate.get('matchedPersonIds', []), people, policy)
    if recorded != expected:
        raise ValueError('Candidate policy assessment is missing, stale, or edited; reassess or collect again')


def acceptance_review(candidate, person_ids, policy, override_reason=None, evidence_urls=None):
    """Validate the human-reviewed policy gate and return its durable audit record."""
    person_ids = list(dict.fromkeys(person_ids or []))
    matched = set(candidate.get('matchedPersonIds', []))
    relevance = candidate.get('labRelevance') or {}
    evidence_urls = list(dict.fromkeys(evidence_urls or []))
    if relevance.get('policyVersion') != policy['version']:
        raise ValueError('Candidate policy assessment is missing or stale; reassess or collect again before accepting')
    if policy['requirePiAuthor'] and policy['piPersonId'] not in person_ids:
        raise ValueError('Acceptance requires the PI author on the paper; this rule cannot be overridden')
    if len(person_ids) < policy['minimumLabAuthors']:
        raise ValueError(f"Acceptance requires at least {policy['minimumLabAuthors']} reviewed lab authors")
    if not set(person_ids) <= matched:
        raise ValueError('Reviewed --person IDs must be verified matches on this candidate')
    if any(not re.match(r'^https?://', url) for url in evidence_urls):
        raise ValueError('Review evidence must use public HTTP(S) URLs')
    identity_review = set(person_ids) & set(candidate.get('identityReviewPersonIds', []))
    needs_override = relevance.get('status') != 'meets-rule' or bool(identity_review)
    if needs_override and (not (override_reason or '').strip() or not evidence_urls):
        raise ValueError('Unresolved membership or identity needs --reason and at least one --evidence URL')
    if bool(override_reason) != bool(evidence_urls):
        raise ValueError('--reason and --evidence must be supplied together')
    review = {
        'policyVersion': policy['version'],
        'labRelevanceStatus': relevance['status'],
        'personIds': person_ids,
        'evidenceUrls': evidence_urls,
    }
    if override_reason:
        review['overrideReason'] = override_reason.strip()
    return review
