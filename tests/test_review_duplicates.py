import copy
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from review_duplicates import group_duplicates, same_paper

PAPER = {'title': 'A sufficiently long research paper title', 'authorNames': ['Ada Example'], 'doi': '', 'url': '', 'status': 'preprint'}


class DuplicateTests(unittest.TestCase):
    def test_response_rounds_are_not_collapsed_by_title(self):
        p = {**PAPER, 'title': 'Author response for a sufficiently long paper title'}
        self.assertFalse(same_paper({**p, 'doi': '10.1234/v2/response'}, {**p, 'doi': '10.1234/v3/response'}))

    def test_rejection_and_verified_rename_survive_regrouping(self):
        q = {'verifiedDuplicateGroups': [{'candidateIds': ['original', 'renamed']}], 'candidates': [
            {'id': 'original', 'status': 'rejected', 'observed': PAPER},
            {'id': 'renamed', 'status': 'pending', 'observed': {**PAPER, 'title': 'Completely different title'}}]}
        group_duplicates(q)
        self.assertEqual(q['candidates'][1]['duplicateOf'], 'original')
        self.assertEqual(group_duplicates(copy.deepcopy(q)), q)

    def test_same_arxiv_with_different_title_or_version(self):
        self.assertTrue(same_paper({**PAPER, 'url': 'https://arxiv.org/abs/2501.12345v2'},
                                   {**PAPER, 'title': 'Revised title', 'doi': '10.48550/arXiv.2501.12345'}))

    def test_matching_title_needs_matching_full_author_list(self):
        self.assertTrue(same_paper(PAPER, {**PAPER, 'title': PAPER['title'].upper()}))
        self.assertFalse(same_paper(PAPER, {**PAPER, 'authorNames': ['Different Author']}))
        self.assertFalse(same_paper(PAPER, {**PAPER, 'title': PAPER['title'] + ' extended study'}))

    def test_published_version_preferred_and_observations_preserved(self):
        q={'candidates': [
            {'id': 'preprint', 'status': 'pending', 'observed': PAPER},
            {'id': 'published', 'status': 'pending', 'observed': {**PAPER, 'status': 'published', 'doi': '10.1234/example'}}]}
        before=copy.deepcopy(q)
        group_duplicates(q)
        self.assertEqual(q['candidates'][0]['duplicateOf'], 'published')
        self.assertEqual(q['candidates'][1]['alternateRecordIds'], ['preprint'])
        self.assertEqual([c['observed'] for c in q['candidates']], [c['observed'] for c in before['candidates']])
        self.assertEqual(group_duplicates(copy.deepcopy(q)), q)
