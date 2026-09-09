"""Run the repeatable publication workflow from collection through a draft PR."""
import argparse
from datetime import date
import json
from pathlib import Path
import subprocess

from discovery import ROOT, read, report, run as collect, save
from publication_policy import assess, validate_policy
from review import decide
from review_duplicates import group_duplicates
from render_recent_review import render as render_recent

REVIEW_BRANCH = 'codex/weekly-publication-review'
REVIEW_FILES = {
    'content/publications.json',
    'maintenance/batch.md',
    'maintenance/recent-review.md',
    'maintenance/review.json',
    'maintenance/scholar-supplement.json',
}


def command(root, *args, capture=True):
    result = subprocess.run(args, cwd=root, check=True, text=True,
                            capture_output=capture)
    return result.stdout.strip() if capture else ''


def summary(root=ROOT):
    queue = read(root / 'maintenance/review.json')
    canonical = [c for c in queue['candidates'] if not c.get('duplicateOf')]
    counts = {}
    for candidate in canonical:
        status = candidate['status']
        counts[status] = counts.get(status, 0) + 1
    relevance = {}
    for candidate in canonical:
        if candidate['status'] != 'pending':
            continue
        label = candidate.get('labRelevance', {}).get('status', 'unassessed')
        relevance[label] = relevance.get(label, 0) + 1
    supplement_path = root / 'maintenance/scholar-supplement.json'
    supplements = read(supplement_path).get('candidates', []) if supplement_path.exists() else []
    supplement_counts = {}
    for candidate in supplements:
        status = candidate['status']
        supplement_counts[status] = supplement_counts.get(status, 0) + 1
    first_year = date.today().year - 1
    recent = sum(c['status'] == 'pending' and c['observed']['year'] >= first_year
                 and c.get('labRelevance', {}).get('status') in
                 ('meets-rule', 'needs-membership-review') for c in canonical)
    recent += sum(c['status'] == 'pending' and c['year'] >= first_year for c in supplements)
    return {
        'sourceRecords': len(queue['candidates']),
        'canonicalCandidates': len(canonical),
        'decisions': counts,
        'pendingByPolicy': relevance,
        'supplementDecisions': supplement_counts,
        'recentReviewCandidates': recent,
    }


def print_summary(root=ROOT, as_json=False):
    data = summary(root)
    if as_json:
        print(json.dumps(data, indent=2, sort_keys=True))
        return
    print(f"{data['sourceRecords']} source records; "
          f"{data['canonicalCandidates']} canonical candidates; "
          f"{data['recentReviewCandidates']} in the recent review.")
    decisions = ', '.join(f'{key}={value}' for key, value in sorted(data['decisions'].items()))
    policy = ', '.join(f'{key}={value}' for key, value in sorted(data['pendingByPolicy'].items()))
    supplements = ', '.join(f'{key}={value}' for key, value in sorted(data['supplementDecisions'].items()))
    print('Decisions: ' + (decisions or 'none'))
    print('Manual supplements: ' + (supplements or 'none'))
    print('Pending policy labels: ' + (policy or 'none'))


def reassess(root=ROOT):
    """Apply the current policy to saved observations without contacting a provider."""
    queue = read(root / 'maintenance/review.json')
    people = read(root / 'content/people.json')
    policy = read(root / 'maintenance/publication-policy.json')
    validate_policy(policy, people)
    outdated_accepted = [c['id'] for c in queue['candidates']
                         if c['status'] == 'accepted'
                         and (c.get('policyReview') or {}).get('policyVersion') != policy['version']]
    if outdated_accepted:
        raise ValueError('Reopen and review accepted candidates under the new policy first: '
                         + ', '.join(outdated_accepted))
    for candidate in queue['candidates']:
        publication_date = (candidate.get('labRelevance') or {}).get('publicationDate')
        candidate['labRelevance'] = assess(
            {'publication_date': publication_date}, candidate['matchedPersonIds'], people, policy)
    group_duplicates(queue)
    save(root / 'maintenance/review.json', queue)
    (root / 'maintenance/batch.md').write_text(report(queue))
    (root / 'maintenance/recent-review.md').write_text(render_recent(root))


def changed_files(root):
    tracked = command(root, 'git', 'diff', '--name-only', 'HEAD').splitlines()
    untracked = command(root, 'git', 'ls-files', '--others', '--exclude-standard').splitlines()
    return {path for path in tracked + untracked if path}


def publish(root, base, confirm_push=False):
    if not confirm_push:
        raise ValueError('Publishing requires --confirm-push after human review')
    branch = command(root, 'git', 'branch', '--show-current')
    if branch != REVIEW_BRANCH:
        raise ValueError(f'Refusing to publish outside {REVIEW_BRANCH}')
    base_ref = f'origin/{base}'
    command(root, 'git', 'rev-parse', '--verify', f'{base_ref}^{{commit}}')
    unexpected = changed_files(root) - REVIEW_FILES
    if unexpected:
        raise ValueError('Unrelated working-tree changes must be moved out of the review branch: '
                         + ', '.join(sorted(unexpected)))
    staged = set(command(root, 'git', 'diff', '--cached', '--name-only').splitlines())
    if staged - REVIEW_FILES:
        raise ValueError('Unrelated staged changes must be removed before publishing')
    command(root, 'npm', 'run', 'check', capture=False)
    command(root, 'git', 'add', '--', *sorted(REVIEW_FILES))
    staged = set(command(root, 'git', 'diff', '--cached', '--name-only').splitlines())
    if staged - REVIEW_FILES:
        raise ValueError('Unexpected staged files; review was not published')
    if staged:
        command(root, 'git', 'commit', '-m', 'Review weekly publication candidates')
    review_delta = set(command(root, 'git', 'diff', '--name-only',
                               f'{base_ref}...HEAD').splitlines())
    if review_delta - REVIEW_FILES:
        raise ValueError('Review branch contains unrelated committed changes: '
                         + ', '.join(sorted(review_delta - REVIEW_FILES)))
    if not review_delta:
        print('No review changes. Nothing was pushed.')
        return
    command(root, 'git', 'push', 'origin', f'HEAD:refs/heads/{REVIEW_BRANCH}', capture=False)
    repo = command(root, 'gh', 'repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner')
    prs = json.loads(command(root, 'gh', 'pr', 'list', '--repo', repo, '--head', REVIEW_BRANCH,
                             '--base', base, '--state', 'open', '--json', 'url'))
    if prs:
        print('Updated draft review PR: ' + prs[0]['url'])
        return
    body = ('Publication candidates and reviewer decisions prepared by the repository publication-review '
            'workflow. Review `maintenance/recent-review.md`, the policy audit records, and the website '
            'preview. This PR does not merge or deploy itself.')
    url = command(root, 'gh', 'pr', 'create', '--repo', repo, '--base', base,
                  '--head', REVIEW_BRANCH, '--draft', '--title',
                  'Review weekly publication candidates', '--body', body)
    print(url)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    commands = parser.add_subparsers(dest='command', required=True)
    collect_parser = commands.add_parser('collect', help='Collect candidates without changing approved content')
    collect_parser.add_argument('--fixture', type=Path, help='Test-only source records')
    status_parser = commands.add_parser('status', help='Summarize the durable review queue')
    status_parser.add_argument('--json', action='store_true')
    commands.add_parser('reassess', help='Reapply the current policy without contacting the provider')
    decide_parser = commands.add_parser('decide', help='Record one human review decision')
    decide_parser.add_argument('id')
    decide_parser.add_argument('decision', choices=['accept', 'reject', 'defer', 'reopen'])
    decide_parser.add_argument('--person', action='append', default=[])
    decide_parser.add_argument('--target')
    decide_parser.add_argument('--until')
    decide_parser.add_argument('--reason')
    decide_parser.add_argument('--evidence', action='append', default=[])
    commands.add_parser('check', help='Run the complete local validation and static build')
    publish_parser = commands.add_parser('publish', help='Commit and push the reviewed batch to a draft PR')
    publish_parser.add_argument('--base', required=True)
    publish_parser.add_argument('--confirm-push', action='store_true')
    args = parser.parse_args()
    try:
        if args.command == 'collect':
            collect(args.root, args.fixture)
            print_summary(args.root)
        elif args.command == 'status':
            print_summary(args.root, args.json)
        elif args.command == 'reassess':
            reassess(args.root)
            print_summary(args.root)
        elif args.command == 'decide':
            decide(args.root, args.id, args.decision, args.person, args.target, args.until,
                   args.reason, args.evidence)
            print_summary(args.root)
        elif args.command == 'check':
            command(args.root, 'npm', 'run', 'check', capture=False)
        elif args.command == 'publish':
            publish(args.root, args.base, args.confirm_push)
    except (ValueError, RuntimeError, KeyError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from None


if __name__ == '__main__':
    main()
