import sys
import copy
import json
from pathlib import Path
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from publication_policy import (acceptance_review, assess, load_people,
                                validate_assessment, validate_recorded_review)

POLICY = {'version': 2, 'piPersonId': 'tim', 'requirePiAuthor': True,
          'minimumLabAuthors': 2, 'preprintPolicy': 'include-labeled'}
WORK = {'publication_date': '2025-06-01'}
PEOPLE = [
    {'id': 'one', 'status': 'member', 'memberships': [{'start': '2024-01-01'}]},
    {'id': 'two', 'status': 'alumni', 'memberships': [{'start': '2023-01-01', 'end': '2025-06-01'}]},
    {'id': 'later', 'status': 'member', 'memberships': [{'start': '2026-01-01'}]},
    {'id': 'unknown', 'status': 'member'},
]


class PolicyTests(unittest.TestCase):
    def test_inclusive_year_boundaries_and_returning_membership_gap(self):
        people = [{'id': 'returning', 'memberships': [
            {'start': '2019', 'end': '2022', 'endStatus': 'known'},
            {'start': '2026', 'end': None, 'endStatus': 'ongoing'}]}]
        for published, expected in [('2018-12-31', 'does-not-meet-rule'),
                                    ('2019-01-01', 'meets-rule'),
                                    ('2022-12-31', 'meets-rule'),
                                    ('2023', 'does-not-meet-rule'),
                                    ('2025-12-31', 'does-not-meet-rule'),
                                    ('2026', 'meets-rule')]:
            with self.subTest(published=published):
                self.assertEqual(assess({'publication_date': published},
                                       ['tim', 'returning'], people, POLICY)['status'], expected)
        self.assertEqual(assess({'publication_year': 2026}, ['tim', 'returning'],
                                people, POLICY)['status'], 'meets-rule')

    def test_unknown_end_does_not_mean_ongoing_and_missing_year_requires_review(self):
        people = [{'id': 'past', 'status': 'member', 'memberships': [
            {'start': '2019', 'end': None, 'endStatus': 'unknown'}]}]
        self.assertEqual(assess(WORK, ['tim', 'past'], people, POLICY)['status'],
                         'needs-membership-review')
        self.assertEqual(assess({'publication_date': '2018'}, ['tim', 'past'], people,
                                POLICY)['status'], 'does-not-meet-rule')
        self.assertEqual(assess({'publication_date': '2025-02-30'}, ['tim', 'past'], people,
                                POLICY)['status'], 'needs-membership-review')

    def test_reviewed_evidence_overrides_unselected_historical_claims(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'content').mkdir()
            (root / 'maintenance').mkdir()
            (root / 'content/people.json').write_text(json.dumps([
                {'id': 'known'}, {'id': 'omitted', 'memberships': [{'start': '2019-01-01'}]}]))
            evidence = {'datePrecision': 'year', 'sources': {'cv': {'url': 'https://example.org/cv'}},
                        'records': [
                            {'personId': 'known', 'status': 'confirmed', 'periods': [
                                {'start': '2019', 'end': '2022', 'endStatus': 'known',
                                 'sourceIds': ['cv']}]},
                            {'personId': 'omitted', 'status': 'omitted', 'periods': [],
                             'historicalSourceClaims': [{'reportedPeriod': '2019–2022'}]}]}
            path = root / 'maintenance/membership-evidence.json'
            path.write_text(json.dumps(evidence))
            people = load_people(root)
            self.assertEqual(people[0]['memberships'][0]['start'], '2019')
            self.assertEqual(people[1]['memberships'], [])
            self.assertEqual(assess(WORK, ['tim', 'omitted'], people, POLICY)['status'],
                             'needs-membership-review')
            evidence['records'][0]['periods'][0]['sourceIds'] = ['unknown-source']
            path.write_text(json.dumps(evidence))
            with self.assertRaisesRegex(ValueError, 'recorded evidence'):
                load_people(root)

    def test_reassessment_preserves_a_valid_historical_human_decision(self):
        candidate = {'matchedPersonIds': ['one', 'tim'], 'identityReviewPersonIds': [],
                     'labRelevance': {'policyVersion': 2, 'status': 'needs-membership-review'},
                     'reviewedOn': '2026-09-09'}
        candidate['policyReview'] = {**acceptance_review(
            candidate, ['one', 'tim'], POLICY, 'Membership confirmed by maintainer',
            ['https://example.org/evidence']), 'reviewedOn': candidate['reviewedOn']}
        before = copy.deepcopy(candidate['policyReview'])
        candidate['labRelevance']['status'] = 'meets-rule'
        validate_recorded_review(candidate, POLICY)
        self.assertEqual(candidate['policyReview'], before)
        candidate['policyReview']['personIds'] = ['one']
        with self.assertRaises(ValueError):
            validate_recorded_review(candidate, POLICY)

    def status(self, ids, work=WORK):
        return assess(work, ids, PEOPLE, POLICY)['status']

    def test_pi_alone_does_not_qualify(self):
        self.assertEqual(self.status(['tim']), 'does-not-meet-rule')

    def test_pi_with_current_or_past_member(self):
        self.assertEqual(self.status(['tim', 'one']), 'meets-rule')
        self.assertEqual(self.status(['tim', 'two']), 'meets-rule')
        self.assertEqual(self.status(['tim', 'unknown']), 'needs-membership-review')
        self.assertEqual(self.status(['tim', 'later']), 'does-not-meet-rule')

    def test_two_non_pi_members_do_not_qualify(self):
        self.assertEqual(self.status(['one', 'two']), 'does-not-meet-rule')
        self.assertEqual(self.status(['one', 'one']), 'does-not-meet-rule')

    def test_current_membership_does_not_count_before_joining(self):
        self.assertEqual(self.status(['tim', 'later']), 'does-not-meet-rule')

    def test_unknown_membership_or_publication_date_needs_review(self):
        self.assertEqual(self.status(['tim', 'unknown']), 'needs-membership-review')
        self.assertEqual(self.status(['tim', 'two'], {}), 'needs-membership-review')

    def test_single_non_pi_member_does_not_qualify(self):
        self.assertEqual(self.status(['unknown']), 'does-not-meet-rule')

    def test_acceptance_requires_current_policy_and_two_matched_people(self):
        candidate = {'matchedPersonIds': ['one', 'tim'], 'identityReviewPersonIds': [],
                     'labRelevance': {'policyVersion': 2, 'status': 'meets-rule'}}
        review = acceptance_review(candidate, ['one', 'tim'], POLICY)
        self.assertEqual(review['personIds'], ['one', 'tim'])
        with self.assertRaises(ValueError):
            acceptance_review(candidate, ['tim'], POLICY)
        with self.assertRaises(ValueError):
            acceptance_review(candidate, ['one', 'unknown'], POLICY)
        no_pi = {'matchedPersonIds': ['one', 'two'], 'identityReviewPersonIds': [],
                 'labRelevance': {'policyVersion': 2, 'status': 'does-not-meet-rule'}}
        with self.assertRaises(ValueError):
            acceptance_review(no_pi, ['one', 'two'], POLICY, 'Requested exception',
                              ['https://example.org/evidence'])

    def test_unresolved_acceptance_requires_reason_and_public_evidence(self):
        candidate = {'matchedPersonIds': ['one', 'tim'], 'identityReviewPersonIds': ['one'],
                     'labRelevance': {'policyVersion': 2, 'status': 'needs-membership-review'}}
        with self.assertRaises(ValueError):
            acceptance_review(candidate, ['one', 'tim'], POLICY)
        review = acceptance_review(candidate, ['one', 'tim'], POLICY, 'Membership verified',
                                   ['https://example.org/evidence'])
        self.assertEqual(review['overrideReason'], 'Membership verified')

    def test_policy_assessment_cannot_be_edited_to_bypass_the_rule(self):
        candidate = {'matchedPersonIds': ['tim'], 'labRelevance':
                     assess(WORK, ['tim'], PEOPLE, POLICY)}
        validate_assessment(candidate, PEOPLE, POLICY)
        candidate['labRelevance']['status'] = 'meets-rule'
        with self.assertRaises(ValueError):
            validate_assessment(candidate, PEOPLE, POLICY)
