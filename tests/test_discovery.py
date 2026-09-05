import copy
from datetime import datetime, timezone
import io
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from discovery import OpenAlex, collect, merge_candidates, normalize, read, run, save, validate_authors
from review import decide
from monitor import problems

WORK = json.loads((ROOT / 'tests/fixtures/openalex.json').read_text())[0]
AUTHORS = [{'personId':'p1','openalexId':'A123456','verified':True,'verifiedOn':'2024-01-01','sourceUrl':'https://example.org/person'}]


class DiscoveryTests(unittest.TestCase):
    def queue(self, work=None, papers=None, previous=None, today='2026-01-01'):
        return merge_candidates([work or WORK], papers or [], AUTHORS, previous or {'version':1,'candidates':[]}, today)

    def test_repeat_and_rejected_candidates_are_stable(self):
        q=self.queue(); self.assertEqual(q,self.queue(previous=q))
        q['candidates'][0]['status']='rejected'
        updated=copy.deepcopy(WORK);updated['title']='New source title'
        self.assertEqual(q,self.queue(updated,previous=q))

    def test_rejection_survives_provider_id_change_for_same_doi(self):
        q=self.queue();q['candidates'][0]['status']='rejected'
        changed=copy.deepcopy(WORK);changed['id']='https://openalex.org/W999999'
        self.assertEqual(q,self.queue(changed,previous=q))

    def test_missing_cursor_fails_instead_of_silently_truncating(self):
        def opener(req,timeout): return io.BytesIO(json.dumps({'results':[WORK],'meta':{}}).encode())
        with self.assertRaises(RuntimeError):collect(OpenAlex(opener=opener,sleep=lambda _:None),AUTHORS)

    def test_only_verified_ids_can_match(self):
        bad=copy.deepcopy(WORK);bad['authorships'][0]['author']['id']='https://openalex.org/A999'
        with self.assertRaises(ValueError): normalize(bad,AUTHORS)
        with self.assertRaises(ValueError): validate_authors([{**AUTHORS[0],'verified':False}],[{'id':'p1'}])

    def test_exact_doi_matches_and_similar_titles_need_review(self):
        observed,_=normalize(WORK,AUTHORS)
        q=self.queue(papers=[{**observed,'id':'original','year':2023}])
        c=q['candidates'][0];self.assertEqual(c['targetId'],'original');self.assertEqual(c['changes'],{'year':2024})
        q=self.queue(papers=[{**observed,'id':'similar','doi':'10.1234/another','openalexId':'W999'}])
        self.assertEqual(q['candidates'][0]['possibleDuplicates'],['similar'])
        self.assertIsNone(q['candidates'][0]['targetId'])

    def test_review_edits_survive_a_new_observation(self):
        q=self.queue();q['candidates'][0]['changes']['title']='Reviewer title'
        changed=copy.deepcopy(WORK);changed['title']='New source title'
        nextq=self.queue(changed,previous=q)
        self.assertEqual(nextq['candidates'][0]['changes']['title'],'Reviewer title')
        self.assertEqual(nextq['candidates'][0]['latestObservation']['observed']['title'],'New source title')

    def test_manual_overrides_and_retractions_are_proposals(self):
        q=self.queue();q['candidates'][0]['status']='accepted'
        observed,_=normalize(WORK,AUTHORS)
        paper={**observed,'title':'Manual title','description':'Keep this'}
        changed=copy.deepcopy(WORK);changed['is_retracted']=True
        nextq=self.queue(changed,papers=[paper],previous=q)
        self.assertNotIn('title',nextq['candidates'][0]['changes'])
        self.assertEqual(nextq['candidates'][0]['changes']['status'],'retracted')
        changed['title']='Source revised title'
        self.assertIn('title',self.queue(changed,papers=[paper],previous=q)['candidates'][0]['conflicts'])
        self.assertEqual(paper['description'],'Keep this')

    def test_deferred_candidate_reappears_when_due(self):
        q=self.queue();q['candidates'][0].update(status='deferred',deferUntil='2026-02-01')
        self.assertEqual(self.queue(previous=q,today='2026-01-30')['candidates'][0]['status'],'deferred')
        self.assertEqual(self.queue(previous=q,today='2026-02-01')['candidates'][0]['status'],'pending')

    def test_cursor_pagination_and_duplicate_author_results(self):
        calls=[]
        def opener(req,timeout):
            calls.append(req.full_url)
            return io.BytesIO(json.dumps({'results':[WORK] if len(calls)==1 else [],'meta':{'next_cursor':'next' if len(calls)==1 else None}}).encode())
        works=collect(OpenAlex(opener=opener,sleep=lambda _:None),AUTHORS)
        self.assertEqual(len(works),1);self.assertEqual(len(calls),2)
        self.assertIn('cursor=next',calls[1])

    def test_retry_and_budget_redact_credentials(self):
        def failure(req,timeout): raise HTTPError(req.full_url,429,'limited',{},None)
        with self.assertRaises(RuntimeError) as error:
            OpenAlex(max_requests=2,api_key='DO-NOT-LOG',opener=failure,sleep=lambda _:None).get({'cursor':'*'})
        self.assertNotIn('DO-NOT-LOG',str(error.exception));self.assertIn('budget',str(error.exception))

    def test_monthly_full_sync_catches_old_metadata_and_failure_keeps_checkpoint(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);prepare_root(root)
            save(root/'.cache/discovery-state.json',{'lastSuccess':'2026-02-28','lastFullSync':'2026-02-01'})
            class Client:
                def works(self, author, since):
                    self.since=since
                    return [WORK]
            client=Client();run(root,today='2026-03-02',client=client)
            self.assertEqual(client.since,'2026-01-14')
            run(root,today='2026-03-05',client=client);self.assertIsNone(client.since)
            original=(root/'maintenance/review.json').read_bytes();state=(root/'.cache/discovery-state.json').read_bytes()
            class Failed:
                def works(self,*args):
                    yield WORK
                    raise RuntimeError('partial source failure')
            with self.assertRaises(RuntimeError):run(root,today='2026-03-06',client=Failed())
            self.assertEqual(original,(root/'maintenance/review.json').read_bytes())
            self.assertEqual(state,(root/'.cache/discovery-state.json').read_bytes())

    def test_fixture_never_changes_content_or_live_checkpoint(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);prepare_root(root)
            before=(root/'content/publications.json').read_bytes()
            run(root,ROOT/'tests/fixtures/openalex.json')
            self.assertEqual(before,(root/'content/publications.json').read_bytes())
            self.assertFalse((root/'.cache/discovery-state.json').exists())

    def test_accept_reject_and_defer_lifecycle(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);prepare_root(root);save(root/'maintenance/review.json',self.queue())
            cid='openalex-w123456'
            with self.assertRaises(ValueError):decide(root,cid,'accept')
            decide(root,cid,'accept',['p1'])
            papers=read(root/'content/publications.json');self.assertEqual(papers[0]['personIds'],['p1'])
            self.assertEqual(read(root/'maintenance/review.json')['candidates'][0]['status'],'accepted')
            with self.assertRaises(ValueError):decide(root,cid,'accept',['p1'])
            decide(root,cid,'reopen');decide(root,cid,'defer',until='2099-01-01')
            self.assertEqual(read(root/'maintenance/review.json')['candidates'][0]['status'],'deferred')
            decide(root,cid,'reject');self.assertEqual(read(root/'maintenance/review.json')['candidates'][0]['status'],'rejected')

    def test_invalid_accepted_content_rolls_back(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);prepare_root(root);q=self.queue();q['candidates'][0]['changes']['url']='javascript:bad';save(root/'maintenance/review.json',q)
            before=(root/'content/publications.json').read_bytes()
            with self.assertRaises(ValueError):decide(root,'openalex-w123456','accept',['p1'])
            self.assertEqual(before,(root/'content/publications.json').read_bytes())
            self.assertEqual(read(root/'maintenance/review.json')['candidates'][0]['status'],'pending')

    def test_health_detects_missed_runs_failures_and_overdue_reviews(self):
        cfg={'maxRunAgeDays':9,'maxReviewAgeDays':14};now=datetime(2026,3,20,tzinfo=timezone.utc)
        runs=[{'conclusion':'failure','updated_at':'2026-03-19T00:00:00Z'},{'conclusion':'success','updated_at':'2026-03-01T00:00:00Z'}]
        prs=[{'createdAt':'2026-03-01T00:00:00Z','url':'https://example.org/review'}]
        self.assertEqual(len(problems(runs,prs,cfg,now)),3)
        self.assertEqual(problems([{'conclusion':'success','updated_at':'2026-03-19T00:00:00Z'}],[],cfg,now),[])


def prepare_root(root):
    for path in ['scripts','lib','content','maintenance']:(root/path).mkdir()
    shutil.copy(ROOT/'scripts/validate-content.mjs',root/'scripts')
    shutil.copy(ROOT/'lib/content-validation.mjs',root/'lib')
    for name in ['publications','alumni','sponsors','news','awards','projects','gallery','opportunities']:save(root/f'content/{name}.json',[])
    save(root/'content/people.json',[{'id':'p1','name':'Ada Example','role':'Researcher','status':'member','priority':1,'topics':[]}])
    save(root/'content/pages.json',{k:'' for k in ['home','recruitment','idiofid','research','pictures','about']})
    save(root/'content/site.json',{'name':'Fixture','url':'https://example.org','repository':'https://example.org/repo','signupUrl':'https://example.org/signup'})
    save(root/'maintenance/config.json',{'enabled':True,'maxRequests':10,'lookbackDays':45,'reconcileDays':30})
    save(root/'maintenance/authors.json',AUTHORS)
    save(root/'maintenance/review.json',{'version':1,'candidates':[]})


if __name__ == '__main__': unittest.main()
