# Website maintenance runbook

## Status

The infrastructure is implemented on `codex/react-website-migration`. Real content verification, author identity configuration, the maintenance pilot, and production deployment are still pending. No live schedule, signup test, or publication was triggered by this implementation.

The site stays static: React/Next.js renders JSON and Markdown at build time. Python's standard library handles discovery and decisions. GitHub provides contribution forms, review branches, checks, artifacts, and deployment. There is no admin service or database to maintain.

## Normal development

Use Node 24 (`nvm use`) and Python 3.12 (CI's version; helpers also work on current local Python). Then:

```sh
npm ci
npm run dev
npm run check
```

`check` runs JS/Python tests, validates all collections and relationships, builds static pages, creates legacy aliases, and checks exported routes, links, assets, signup action, and draft-directory exclusion. CI uploads `out/` as a downloadable preview artifact. `npm run preview` serves that export on port 3000 after the dev server is stopped.

Use `npm run test:skeleton` to build a temporary copy containing synthetic records for every future section and verify their rendered pages. It does not modify repository content or call external services.

## Submissions and content editing

GitHub issue forms collect publication DOIs/URLs, award/news evidence, and profile/site corrections. These are public submissions for a maintainer to triage; they do not run code or publish anything when opened. No `pull_request_target` or untrusted issue-body execution is used.

For a one-off DOI, `python3 scripts/prepare_publication.py DOI` prepares a Crossref proposal under `_review/`. Review and copy its approved fields into a content PR; this helper is separate from the OpenAlex batch queue. Awards, news, opportunities and other editorial records are edited directly according to `CONTENT_MODEL.md` and reviewed in a PR. Discovery imports no abstracts, images, or promotional summaries.

## Discovery and review

1. Complete `maintenance/authors.json` with verified identities and settle the lab-relevance and preprint policies.
2. Set `enabled: true` in `maintenance/config.json` in a reviewed PR. Keep it false during the skeleton/content preparation phase.
3. Run `python3 scripts/discovery.py` locally. `OPENALEX_API_KEY` is optional and read only from the environment. Check current provider access/budget before enabling scheduled retrieval.
4. Inspect `maintenance/batch.md` and `maintenance/review.json`. Candidates show public evidence, matched identities, proposed fields, possible duplicates and manual/source conflicts. The site content has not changed.
5. Record decisions with the CLI. Substitute actual candidate and person IDs:

```sh
python3 scripts/review.py openalex-w123456 accept --person existing-person-id
python3 scripts/review.py openalex-w123456 accept --target existing-paper-id --person existing-person-id
python3 scripts/review.py openalex-w123456 accept --target new --person existing-person-id
python3 scripts/review.py openalex-w123456 reject
python3 scripts/review.py openalex-w123456 defer --until 2027-01-01
python3 scripts/review.py openalex-w123456 reopen
```

Acceptance edits local JSON and validates it; invalid content is rolled back. It does not merge a PR or deploy. Repeat `--person` for each lab author whose attribution was reviewed. Use `--target new` only after checking a flagged similar-title match; exact DOI/OpenAlex duplicates are still rejected. Stable target IDs, descriptions, images, code, award and other editorial fields are retained.

For a conflict, edit the candidate's `changes` after comparing the current record, `base`, and `observed`, then clear only resolved `conflicts`. A changed source received while a candidate is being edited is retained under `latestObservation`; reconcile `observed`, `fingerprint`, and `changes` against that observation, then remove `latestObservation`. To intentionally retain a current field, remove it from `changes` and `base`. The next identical source observation will not re-propose an accepted override.

Reject is a durable suppression, including the same DOI returned under a different provider record. Use reopen to reconsider it. Deferrals re-enter the queue once due. Never delete queue history to suppress a candidate. Discovery never removes approved content because a source stopped returning it, and marks retractions as proposals for review.

6. Run `npm run check`, inspect the site preview and the Git diff, commit the decisions, and request human PR review. Pending candidates may remain pending across weeks. Merge only approved content and intentional review decisions.

## Scheduled batches

After the content and identity pass, merge the infrastructure to the default branch and configure:

- `maintenance/config.json`: `enabled: true`, lookback, monthly reconciliation interval, per-run request budget, and age thresholds.
- Repository variable `WEBSITE_MAINTENANCE_ENABLED=true` to enable the collection and health jobs. Both are currently gated off.
- Optional repository secret `OPENALEX_API_KEY` from a lab-owned account.
- GitHub repository Actions permission allowing the workflow to create pull requests. Apply branch protection requiring human review and successful checks on the production branch.
- A primary maintainer and backup to review each weekly batch and receive actionable workflow failures using their GitHub notification settings.

The collector is scheduled weekly and can also be dispatched manually. It starts from the default branch, continues `codex/weekly-publication-review` if it exists, and merges in the default branch without force-pushing or overwriting reviewer edits. Merge conflicts or concurrent remote edits fail visibly rather than discarding work. There is at most one open review PR. It is created as a draft, and the bot never merges it.

Each collection completes every configured author/page before writing the queue and checkpoint. Retries and the total request budget are bounded. A lookback window finds recent papers; periodic full author reconciliation catches older records and changed metadata. HTTP cache responses expire after six hours. Checkpoints live in an Actions cache, so cache loss safely causes a full reconciliation rather than a skipped interval.

The job validates and builds before pushing, then explicitly dispatches the check workflow on the review branch. Depending on GitHub's current bot-event rules and repository settings, PR check runs may still need a maintainer to approve running them. Confirm successful checks for the reviewed commit before merge; do not assume an automatically opened PR has passed CI.

## Monitoring and pilot

`health.yml` provides a daily GitHub check. `python3 scripts/monitor.py` is a read-only check that can also run on an independent lab-owned scheduler with an authenticated `gh` CLI and Actions/PR read access. It detects missed or failed collections, skipped collection steps, and overdue review PRs, exits nonzero on actionable problems, and has no notification destination hardcoded.

Configure that external scheduler to alert the primary/backup maintainer on failure and to monitor its own missed executions. A daily workflow in the same GitHub repository is not an independent missed-run monitor; both workflows could stop when the repository is inactive. This external service hookup remains an activation task and has not been created.

Run two weekly cycles before calling maintenance operational. Record false matches, missed papers, duplicate/version conflicts, failed-provider recovery, and review effort. Keep automatic publication disabled; enabling it would require a new policy decision.

## Production switch and rollback

`deploy.yml` remains manual. Creating/pushing a migration or review branch does not deploy it.

1. Finish the content pass and launch QA, including the IdioFid endpoint's ownership and one separately authorized test signup.
2. Review the migration PR and clean CI build; record the currently live revision and Pages settings.
3. Coordinate the approved merge with changing Pages Source to GitHub Actions. Run **Deploy React website** on the approved default branch.
4. Verify production routes, PDFs, logos, canonical URLs and the signup endpoint. Retain the old deployment revision/settings as a rollback reference.
5. For a bad React content change, revert the offending commit in a reviewed PR, merge, and manually redeploy. For failure of the initial Jekyll-to-React switch, restore the known-good pre-migration revision and prior Pages configuration together.

After launch, deployment on approved merges can be enabled by a small reviewed workflow change. Time-based content such as an expiring opportunity is filtered at build time; trigger a rebuild when its status/date changes or deadline arrives. A daily rebuild can be added after the lab approves production automation.

## Recovery

- Provider error/budget exhaustion: no queue/checkpoint advancement for an incomplete collection. Fix access or budget and rerun; last good site remains online.
- Review branch merge conflict: resolve it normally with the default branch, preserving queue decisions; rerun collection. Do not reset the branch or force-push over a reviewer's work.
- Invalid approval: validator restores the prior publication file. Correct the candidate and retry.
- Cached checkpoint missing: expected safe full reconciliation; increase the request budget if the verified roster requires it.
- Bot cannot open a PR/checks are awaiting approval: fix repository workflow permissions or approve the check run; never bypass human merge review.
- Stale roster/opening/sponsor: handle as a content PR with evidence and a review date; the collector does not infer membership or availability.

## Integration references

Implementation follows the provider's [API reference](https://help.openalex.org/api/), [cursor pagination](https://help.openalex.org/api/paging/), and [date/author filters](https://help.openalex.org/api/filtering/). Authentication, limits, and access should be rechecked before activation. GitHub documents [workflow triggering and bot events](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow) and [Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository).
