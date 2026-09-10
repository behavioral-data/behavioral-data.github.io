# Publication maintenance pilot

September 10, 2026. Primary maintainer: **advaitmb**. This was an isolated readiness test, not an activated recurring service or a completed weekly human-review cycle.

## Provider and identity coverage

OpenAlex anonymous access worked. No API key, paid plan, or production secret was used. Current provider documentation allows basic anonymous access; a lab-owned free API key can increase the budget if needed. The client uses 100 works per page, a maximum of 100 requests per run, bounded retries, a six-hour cache, 45-day lookback, and 30-day full reconciliation. See [authentication](https://help.openalex.org/api/authentication/) and [paging](https://help.openalex.org/api/paging/).

All nine current members now have configured discovery identities. Rongwu’s personal website links his [Scholar profile](https://scholar.google.com/citations?user=HyjNrDMAAAAJ). His [ACL 2024 paper](https://aclanthology.org/2024.acl-long.858/) and [EMNLP 2024 survey](https://aclanthology.org/2024.emnlp-main.486/) anchor OpenAlex `A5101295876` and four final/preprint work IDs. Other work from that profile still requires per-paper identity review. The retrieved Scholar page was stale and was used only as an identity cross-check, not evidence of complete current coverage.

Namesake contamination and split identities remain documented. Anchored past-member identities can match coauthors without collecting their full later careers. A relevance label is not acceptance, and unrecognized coauthors can still cause false negatives.

## Live runs

Enabled discovery only in a temporary copy of `content/` and `maintenance/`. The repository’s scheduling gates stayed off. Queried all pages to completion and checked full, incremental, and cached repeat behavior.

| Pass | Unique works returned | Network requests | Result |
| --- | ---: | ---: | --- |
| Initial eight-member full collection | 384 | 10 | Complete; one new source record |
| Eight-member incremental lookback | 9 | 8 | Same queue |
| Eight-member cached repeat | 9 | 0 | Same queue |
| Nine-member full collection, adding Rongwu | 402 | 1 additional; other responses cached | Complete; 19 new source records relative to repository |
| Nine-member incremental lookback | 9 | 1 additional; other responses cached | Same queue |
| Nine-member cached repeat | 9 | 0 | Same queue |

The nine-member result retained 409 observations grouped into 330 canonical candidates: 42 accepted, 278 pending, and ten rejected. All three nine-member queues had SHA-256 `01242752f1edddd0e965c100f66327be1d96598a12fd735b068e4ab8ba7d66c2`. Existing observations include manually recovered records that need not appear in each live provider fetch.

All 19 newly observed source records (14 canonical items) lacked the required Tim identity and screened as `does-not-meet-rule`. They consist of Rongwu profile records and Jina’s FrankenReport preprint. They remain pilot observations, not approved content or newly recorded human rejections. No eligible paper was added. The repeat produced no duplicate or metadata changes. Provider coverage is not exhaustive.

Verified byte-for-byte preservation of the repository bibliography, review queue, and disabled configuration. In the isolated queue, every prior status and all ten rejections remained unchanged. The approved website still has 66 papers; its durable review queue still has 390 observations and 316 canonical decisions (42 accepted, 264 pending, ten rejected), plus one accepted manual supplement. Pilot observations were not copied over editorial decisions.

## Recovery evidence

The existing discovery tests exercise cursor pagination, missing cursors, provider retries and budget exhaustion, source-field changes, retractions, namesakes, rejected DOI aliases, deferred decisions, and preservation of the queue/checkpoint after partial failure. The live repeat adds real-provider idempotency evidence; fixtures do not count as successful scheduled runs.

## Activation checklist

- [x] Name primary maintainer: advaitmb.
- [x] Verify current provider access and bounded request budget.
- [x] Finish inclusive year-level membership screening and current-member discovery coverage.
- [ ] Confirm backup reviewer or explicit sole-maintainer operating policy.
- [ ] Confirm failure-alert destination and configure actionable notifications.
- [ ] Require passing website checks and an appropriate human-review policy on `master`. Existing protection has no required checks or required PR reviews; do not assume those safeguards are active.
- [ ] Merge the reviewed infrastructure and enable both the file gate and `WEBSITE_MAINTENANCE_ENABLED` repository variable.
- [ ] Connect an independent lab-owned missed-run monitor and verify delivery. The same-repository daily health workflow is not independent monitoring.
- [ ] Complete two actual weekly review cycles.

The configured GitHub schedule is Monday 15:17 UTC for collection and daily 16:43 UTC for health. No new automation or external service was created by this local pilot. Production deployment remains manual; automatic publication is out of scope.

## Weekly operating log

After activation, add one row per actual cycle. Record no-change weeks as well; do not replace a week with repeated same-day test runs.

| Cycle/date | Collection run and review PR | Missed papers / false matches / duplicates | Recovery and reviewer effort | Human reviewer / outcome |
| --- | --- | --- | --- | --- |
| First actual week | Pending activation | — | — | — |
| Second actual week | Pending activation | — | — | — |

A backup maintainer’s practical content update, preview/check, and rollback exercise is still required for the handoff issue. An agent’s local rehearsal does not establish that another person has completed the handoff.
