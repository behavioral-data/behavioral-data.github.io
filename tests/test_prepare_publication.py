import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location("prepare_publication", Path(__file__).parents[1] / "scripts/prepare_publication.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ProposalTests(unittest.TestCase):
    def test_url_and_identifier_normalize_to_same_doi(self):
        self.assertEqual(module.normalize_doi("HTTPS://doi.org/10.1234/ABC"), "10.1234/abc")
        with self.assertRaises(ValueError):
            module.normalize_doi("https://example.com/not-a-doi")

    def test_candidate_is_stable_and_does_not_invent_highlights_or_awards(self):
        message = {"title": ["Example paper"], "author": [{"given": "Ada", "family": "Lovelace"}], "published": {"date-parts": [[2025, 2]]}, "container-title": ["Example Journal"], "type": "journal-article"}
        a = module.proposal(message, "10.1234/example")
        self.assertEqual(a, module.proposal(message, "10.1234/example"))
        self.assertEqual(a["authorNames"], ["Ada Lovelace"])
        self.assertEqual(a["year"], 2025)
        self.assertFalse(a["highlight"])
        self.assertEqual(a["award"], "")

    def test_missing_authors_or_year_requires_manual_review(self):
        with self.assertRaises(ValueError):
            module.proposal({"title": ["Incomplete"]}, "10.1234/example")
