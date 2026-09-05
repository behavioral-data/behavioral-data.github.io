"""Read-only health check. Run from an independent scheduler to catch missed GitHub runs."""
import argparse
from datetime import datetime, timezone, timedelta
import json
import subprocess
from discovery import ROOT, read


def problems(runs, prs, config, now):
    errors = []
    successes = [r for r in runs if r.get('conclusion') == 'success']
    if not successes or now - datetime.fromisoformat(successes[0]['updated_at'].replace('Z','+00:00')) > timedelta(days=config['maxRunAgeDays']):
        errors.append('No recent successful publication collection')
    if runs and runs[0].get('conclusion') in ('failure','timed_out','cancelled','action_required'):
        errors.append('Latest publication collection did not succeed')
    for pr in prs:
        if now - datetime.fromisoformat(pr['createdAt'].replace('Z','+00:00')) > timedelta(days=config['maxReviewAgeDays']):
            errors.append('Review batch is overdue: ' + pr['url'])
    return errors


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', default='behavioral-data/behavioral-data.github.io')
    args = parser.parse_args()
    config = read(ROOT / 'maintenance/config.json')
    if not config['enabled']:
        print('Maintenance is disabled; no active-run expectation.')
        raise SystemExit(0)
    def gh(*args):
        return json.loads(subprocess.check_output(['gh', *args], text=True))
    runs = gh('api',f'repos/{args.repo}/actions/workflows/discover.yml/runs?per_page=30')['workflow_runs']
    # Ignore skipped jobs on unrelated branches and fixture runs; production runs use the default branch.
    default = gh('api',f'repos/{args.repo}')['default_branch']
    runs = [r for r in runs if r['head_branch'] == default and r['event'] in ('schedule','workflow_dispatch')]
    for run in runs:
        if run.get('conclusion') == 'success':
            jobs = gh('api', f"repos/{args.repo}/actions/runs/{run['id']}/jobs")['jobs']
            steps = [step for job in jobs for step in job.get('steps', [])]
            if not all(any(step['name'] == name and step.get('conclusion') == 'success' for step in steps) for name in ('Discover candidates', 'Publish review branch and request checks')):
                run['conclusion'] = 'skipped'
    prs = gh('pr','list','--repo',args.repo,'--head','codex/weekly-publication-review','--state','open','--json','createdAt,url')
    issues = problems(runs,prs,config,datetime.now(timezone.utc))
    if issues:
        raise SystemExit('\n'.join(issues))
    print('Collection and review are within the configured age limits.')
