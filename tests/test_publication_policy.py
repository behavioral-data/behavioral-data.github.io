import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from publication_policy import acceptance_review, assess, validate_assessment

POLICY = {'version': 2, 'piPersonId': 'tim', 'requirePiAuthor': True,
          'minimumLabAuthors': 2}
WORK = {'publication_date': '2025-06-01'}
PEOPLE = [
    {'id': 'one', 'status': 'member', 'memberships': [{'start': '2024-01-01'}]},
    {'id': 'two', 'status': 'alumni', 'memberships': [{'start': '2023-01-01', 'end': '2025-06-01'}]},
    {'id': 'later', 'status': 'member', 'memberships': [{'start': '2026-01-01'}]},
    {'id': 'unknown', 'status': 'member'},
]


class PolicyTests(unittest.TestCase):
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
