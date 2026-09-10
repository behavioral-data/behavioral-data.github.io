"""Explain and enforce lab relevance using verified identities, never name guesses."""
from datetime import date
import json
import re


def load_people(root):
    """Use the reviewed year evidence without copying it into public profile data."""
    people = json.loads((root / 'content/people.json').read_text())
    path = root / 'maintenance/membership-evidence.json'
    if not path.exists():
        return people
    evidence = json.loads(path.read_text())
    if evidence.get('datePrecision') != 'year':
        raise ValueError('Membership evidence must use year precision')
    by_id = {p['id']: p for p in people}
    seen = set()
    for record in evidence['records']:
        pid = record.get('personId')
        if pid is None:
            continue  # Alumni-only evidence does not create a public identity.
        if pid not in by_id or pid in seen:
            raise ValueError('Unknown or duplicate membership identity: ' + pid)
        seen.add(pid)
        periods = record.get('periods', [])
        for period in periods:
            for field in ('start', 'end'):
                value = period.get(field)
                if value is not None and (not isinstance(value, str)
                                          or not re.fullmatch(r'[1-9]\d{3}', value)):
                    raise ValueError('Membership boundaries must be YYYY or null: ' + pid)
            start, end = period.get('start'), period.get('end')
            state = period.get('endStatus')
            if (state not in ('known', 'ongoing', 'unknown')
                    or (state == 'known') != (end is not None)
                    or (start and end and start > end)):
                raise ValueError('Invalid membership interval: ' + pid)
            if not period.get('sourceIds') or not set(period['sourceIds']) <= evidence['sources'].keys():
                raise ValueError('Membership interval needs recorded evidence: ' + pid)
        # Omitted or disputed source claims must not be promoted to selected dates.
        by_id[pid]['memberships'] = (periods if record.get('status') in
                                    ('confirmed', 'reconstructed', 'partial') else [])
    return people


def publication_year(value):
    if isinstance(value, int) and not isinstance(value, bool) and 1000 <= value <= 9999:
        return value
    if isinstance(value, str) and re.fullmatch(r'[1-9]\d{3}', value):
        return int(value)
    try:
        return date.fromisoformat(value).year
    except (TypeError, ValueError):
        return None


def membership_in_year(period, year):
    """Return True, False or None (unresolved); a missing end is not proof of continuity."""
    start, end = publication_year(period.get('start')), publication_year(period.get('end'))
    if (start is not None and year < start) or (end is not None and year > end):
        return False
    if start is None:
        return None
    if end is not None or period.get('endStatus') == 'ongoing':
        return True
    # Retain support for the original exact-date schema's open intervals.
    if 'endStatus' not in period and len(str(period.get('start', ''))) == 10:
        return True
    return None


def validate_policy(policy, people):
    if (type(policy.get('version')) is not int
            or policy['version'] < 1
            or policy.get('piPersonId') not in {p['id'] for p in people}
            or policy.get('requirePiAuthor') is not True
            or type(policy.get('minimumLabAuthors')) is not int
            or policy['minimumLabAuthors'] < 2
            or policy.get('preprintPolicy') != 'include-labeled'
            or policy.get('membershipBasis') != 'publication-date'
            or policy.get('humanReviewRequired') is not True):
        raise ValueError('Invalid publication relevance policy')


def assess(work, matched, people, policy):
    matched = sorted(set(matched))
    published_value = work.get('publication_date') or work.get('publication_year')
    result = {'policyVersion': policy['version'], 'matchedPersonIds': matched,
              'publicationDate': str(published_value) if published_value is not None else None,
              'memberPersonIds': [],
              'uncertainPersonIds': []}
    published = publication_year(published_value)
    by_id = {p['id']: p for p in people}
    for pid in matched:
        if pid == policy['piPersonId']:
            result['memberPersonIds'].append(pid)
            continue
        periods = by_id.get(pid, {}).get('memberships')
        if not periods or published is None:
            result['uncertainPersonIds'].append(pid)
        else:
            states = [membership_in_year(m, published) for m in periods]
            if True in states:
                result['memberPersonIds'].append(pid)
            elif None in states:
                result['uncertainPersonIds'].append(pid)
    confirmed = len(result['memberPersonIds'])
    possible = confirmed + len(result['uncertainPersonIds'])
    minimum = policy['minimumLabAuthors']
    if policy['requirePiAuthor'] and policy['piPersonId'] not in matched:
        status, reason = 'does-not-meet-rule', 'The required PI author is not on this paper.'
    elif confirmed >= minimum:
        status, reason = 'meets-rule', f'At least {minimum} distinct coauthors were lab members in the publication year.'
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


def validate_recorded_review(candidate, policy):
    """A historical human decision keeps its original assessment when evidence improves."""
    recorded = candidate.get('policyReview') or {}
    status = recorded.get('labRelevanceStatus')
    if status not in ('meets-rule', 'needs-membership-review', 'does-not-meet-rule'):
        raise ValueError('Accepted candidate has an invalid historical assessment')
    reviewed_candidate = {**candidate, 'labRelevance': {
        'policyVersion': recorded.get('policyVersion'), 'status': status}}
    expected = acceptance_review(reviewed_candidate, recorded.get('personIds'), policy,
                                 recorded.get('overrideReason'), recorded.get('evidenceUrls'))
    if any(recorded.get(field) != value for field, value in expected.items()):
        raise ValueError('Accepted candidate has an invalid policy review')
    if recorded.get('reviewedOn') != candidate.get('reviewedOn'):
        raise ValueError('Accepted candidate policy review date does not match its decision')
    date.fromisoformat(recorded['reviewedOn'])
