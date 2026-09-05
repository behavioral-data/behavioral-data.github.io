"""CI-only: push an additive review commit and open/update a draft PR. Never merge."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

BRANCH = 'codex/weekly-publication-review'
FILES = ['maintenance/review.json', 'maintenance/batch.md']


def command(*args):
    return subprocess.check_output(args, text=True).strip()


def main():
    repo = os.environ['GITHUB_REPOSITORY']
    base = os.environ['BASE_BRANCH']
    branch = command('git','branch','--show-current')
    if branch != BRANCH:
        raise SystemExit('Refusing to publish outside the dedicated review branch')
    command('git','add','--',*FILES)
    changed = command('git','diff','--cached','--name-only')
    if set(changed.splitlines()) - set(FILES):
        raise SystemExit('Unexpected staged files; review batch was not pushed')
    if changed:
        command('git','commit','-m','Prepare publication candidates for weekly review')
        command('git','push','origin',f'HEAD:refs/heads/{BRANCH}')
    diff = command('git','diff','--name-only',f'origin/{base}...HEAD','--',*FILES)
    if not diff:
        print('No review changes. No PR created.')
        return
    prs = json.loads(command('gh','pr','list','--repo',repo,'--head',BRANCH,'--base',base,'--state','open','--json','number,url'))
    if prs:
        print('Existing review batch: ' + prs[0]['url'])
    else:
        with tempfile.NamedTemporaryFile('w', suffix='.md') as body:
            body.write('Publication candidates collected for human review. This draft does not add papers to the site.\n\nReview `maintenance/batch.md` and `maintenance/review.json`, then use `scripts/review.py` to accept, reject, or defer each candidate. Verify lab relevance and duplicate/version matches. Run the documented checks before marking this PR ready and merging.\n\nCollection preserves manual decisions; it never merges or deploys.\n')
            body.flush()
            print(command('gh','pr','create','--repo',repo,'--base',base,'--head',BRANCH,'--draft','--title','Review weekly publication candidates','--body-file',body.name))
    # Explicit dispatch ensures validation is requested even when bot PR events need approval.
    # The collection workflow also validates before this script runs.
    command('gh','workflow','run','check.yml','--repo',repo,'--ref',BRANCH)


if __name__ == '__main__':
    main()
