# Website issue status

Updated September 10, 2026. This document replaces the pre-launch roadmap. The React site is already live at <https://behavioral-data.github.io/>; deployment remains manual.

## Completed content and engineering work

| Issue | Result | Evidence |
| --- | --- | --- |
| [#22](https://github.com/behavioral-data/behavioral-data.github.io/issues/22) · Roster and attribution | Nine current members, 22 profiles, explicit author links on all 66 papers, inclusive membership-year screening with separate affiliation periods. Omitted alumni ranges remain omitted. | [Attribution review](ATTRIBUTION_REVIEW.md), [membership review](MEMBERSHIP_REVIEW.md) |
| [#23](https://github.com/behavioral-data/behavioral-data.github.io/issues/23) · Publications | Approved backfill and metadata reconciliation complete. Final publication records take precedence over preprints. All nine declined cases stay excluded; 264 other pending matches are not treated as reviewed rejections. Issue closed. | [Backfill](PUBLICATION_BACKFILL_REVIEW.md), [reconciliation](PUBLICATION_RECONCILIATION_REVIEW.md) |
| [#24](https://github.com/behavioral-data/behavioral-data.github.io/issues/24) · Awards and news | Approved honors and homepage highlights published. Requested exclusions, Jina wording, and removal of the Ken/xAI news item retained. Issue closed. | [Awards audit](AWARDS_AUDIT.md) |
| [#25](https://github.com/behavioral-data/behavioral-data.github.io/issues/25) · Page content | Approved layout, dated recruitment records, “Past and present support” sponsor label, useful redirects for empty legacy sections. | [Content model](../docs/CONTENT_MODEL.md), [visual review](VISUAL_REVIEW.md) |
| [#26](https://github.com/behavioral-data/behavioral-data.github.io/issues/26) · Browser QA | Responsive, accessibility, keyboard, filters, profile relationships, and legacy route checks; short-window sidebar and skip-link focus fixed. Live signup test explicitly deferred by the maintainer. | [Final QA](FINAL_QA.md) |
| [#27](https://github.com/behavioral-data/behavioral-data.github.io/issues/27) · Discovery | Nine current discovery identities, isolated live full/incremental/repeat pilot, bounded anonymous API access, preserved decisions and content. | [Maintenance pilot](MAINTENANCE_PILOT.md) |

The September 10 issue-completion branch still needs the normal PR review/merge and manual deployment. Implementation completion does not mean its newest changes are already in production.

## Remaining operating work

### #28 · Weekly review and monitoring

Primary maintainer: **advaitmb**. Backup reviewer and failure-alert destination have not yet been confirmed. Both scheduling gates remain off. Complete review safeguards and notification routing, connect a lab-owned independent missed-run monitor, then enable the weekly workflow. Record **two actual weekly review cycles** before declaring maintenance operational. Same-day pilot reruns do not satisfy that requirement. No paper is published automatically.

### #29 · Handoff

Production launch is complete. Retain manual deployment and the documented rollback procedure. The primary maintainer is named; a backup maintainer and their practical update/rollback exercise remain outstanding. The IdioFid signup test is deferred, not a launch blocker or a claimed success.

See the [maintenance runbook](../docs/MAINTENANCE.md) for operating instructions and the [pilot log](MAINTENANCE_PILOT.md) for activation and review-cycle records.

## Deferred content

The five omitted alumni year ranges, the 15 unresolved award candidates, and documented source-access gaps remain deferred. The approved historical bibliography is preserved even where the newer candidate policy would require an exception. Discovery labels are screening aids, not evidence of complete coverage.
