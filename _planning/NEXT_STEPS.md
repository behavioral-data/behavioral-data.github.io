# Completing the new lab website

Current implementation: React + Next.js, plain CSS, JSON content, optional Python helpers, and static export for GitHub Pages. Jekyll has been removed. The initial migration preserves 47 papers, 21 people records, 12 legacy alumni entries, three news items, seven sponsors, and the original assets. The UI uses original lab prose and branding with minimal functional labels.

This is the current implementation roadmap. WEBSITE_SPEC.md and MODERN_STACK_OPTIONS.md retain the earlier audit and research history; this document supersedes their old stack and delivery recommendations.

## Decisions already made

- Keep the website barebones. Use original prose; obtain approval for factual corrections or new wording.
- Keep the stack familiar and simple: React/Next.js, plain CSS, structured files, Python where helpful, GitHub Pages.
- Review one weekly batch before publishing. Automatic publication is not enabled or planned for this phase.
- Keep the production switch separate from migration development. The existing live website is unchanged.

## Delivery order

**Updated direction: finish infrastructure and skeletons first; review and backfill content last.** The branch now includes structured content and relationship validation, related awards/news/projects, opportunity and gallery skeletons, explicit publication attribution fields, issue forms, OpenAlex collection, deduplication, review decisions, gated weekly draft-PR and health workflows, legacy export checks, and a maintainer runbook.

The roster now reflects the maintainer-confirmed eight current members. Scholar profiles are confirmed; OpenAlex identities and a local review batch are available. The latest Scholar check yields 13 recent review papers after version grouping; see `maintenance/recent-review.md`. Publication attribution requires at least two lab authors, including Tim plus a current/past member; Tim alone is insufficient. A repository skill and single pipeline command now make collection, status, decisions, validation, and draft-PR publication repeatable; acceptance enforces the policy and records evidence-backed overrides. Resolve membership dates and remaining identity ambiguities before accepting candidates. Verified duplicate versions are grouped; source records are preserved. Awards, projects, opportunities, and gallery collections remain empty. Fixture tests exercise future sections in a temporary checkout; activation and two weekly review cycles, browser/signup QA, external monitoring setup, and production deployment remain pending. See [Publication policy](../docs/PUBLICATION_POLICY.md).

Next, complete the content pass under issues #22–#25; configure real identities/owners and run the #27–#28 pilot; finish #26 launch QA; then perform the approved #29 production switch. The issues remain open because infrastructure alone does not complete their content or live-operation acceptance criteria. See [Maintenance runbook](../docs/MAINTENANCE.md) and [Content model](../docs/CONTENT_MODEL.md).

## Work items

| Work item | GitHub issue |
| --- | --- |
| 1. Verify the lab roster and publication attribution rules | [#22](https://github.com/behavioral-data/behavioral-data.github.io/issues/22) |
| 2. Backfill missing publications and reconcile existing metadata | [#23](https://github.com/behavioral-data/behavioral-data.github.io/issues/23) |
| 3. Verify and backfill awards and news with shared records | [#24](https://github.com/behavioral-data/behavioral-data.github.io/issues/24) |
| 4. Review original page content, recruitment, sponsors, and barebones layout | [#25](https://github.com/behavioral-data/behavioral-data.github.io/issues/25) |
| 5. Complete browser, accessibility, route, and signup checks | [#26](https://github.com/behavioral-data/behavioral-data.github.io/issues/26) |
| 6. Implement publication discovery, normalization, and deduplication | [#27](https://github.com/behavioral-data/behavioral-data.github.io/issues/27) |
| 7. Create weekly review batches, contributor intake, and monitoring | [#28](https://github.com/behavioral-data/behavioral-data.github.io/issues/28) |
| 8. Launch React on GitHub Pages and document maintainer handoff | [#29](https://github.com/behavioral-data/behavioral-data.github.io/issues/29) |

### 1. Verify the lab roster and publication attribution rules

GitHub: [#22](https://github.com/behavioral-data/behavioral-data.github.io/issues/22)

September 9 membership research: [21 usable year-level timelines](MEMBERSHIP_REVIEW.md) are recorded. Jina’s return in 2026 is confirmed; five alumni ranges are intentionally omitted at the maintainer’s request. The dates use the maintainer-requested year precision in `maintenance/membership-evidence.json`; explicit author links on the 47 legacy papers remain outstanding.

Phase: Before launch. Dependencies: none.

The imported roster has 21 people records plus 12 legacy alumni entries. These are historical records, not a verified current membership list. Profile publications currently use name matching.

- [ ] Have a lab maintainer confirm current members, alumni, visitors, roles, websites, headshots, ordering, and membership dates; reconcile duplicate alumni representations.
- [ ] Record verified scholarly author IDs and aliases with source links; do not resolve identities from names alone.
- [ ] Decide whether preprints are included and how pre-joining, post-departure, and continuing-collaboration work should be attributed.
- [ ] Add explicit internal person links to reviewed publications and use those on profiles instead of relying on name matching.
- [ ] Validate the new fields and check ambiguous names, visitors, and alumni against reviewed examples.

Done when the roster and attribution policy are approved and each profile lists the intended lab work.

### 2. Backfill missing publications and reconcile existing metadata

GitHub: [#23](https://github.com/behavioral-data/behavioral-data.github.io/issues/23)

September 9 publication passes: [seven historical additions](PUBLICATION_BACKFILL_REVIEW.md) bring the local site to 66 papers, and [reconciliation of 24 existing entries](PUBLICATION_RECONCILIATION_REVIEW.md) adds 20 missing DOIs, restores complete author lists and groups five preprint/final pairs. The maintainer declined all nine remaining candidate additions/updates; existing approved entries are preserved. This completes the current review pass. The other 264 pending candidates have not been individually rejected, and exhaustive coverage is not claimed. Next planned issue: #24, awards and news. Margaret’s two papers remain verified preprints until journal records are confirmed. Publication changes were pushed as `3fcf3fb`; production deployment is still separate.

Phase: Before launch. Dependencies: 1.

The migrated archive contains 47 papers spanning 2014–2024. It needs a verified backfill, beginning with 2025 onward and then older omissions.

- [ ] Reconcile publications for every verified member and relevant alumnus against authoritative author records, publisher pages, and personal bibliographies.
- [ ] Submit candidates for human review with sources, lab-author links, ordered authors, dates, venue, DOI/arXiv IDs, and publication state.
- [ ] Reconcile preprint/published versions and existing duplicates while retaining stable URLs and editorial descriptions.
- [ ] Add available PDF, code, dataset, and project links; ordinary papers must not require a local PDF or thumbnail.
- [x] Select the latest award-winning papers as homepage highlights (maintainer direction, September 9). The approved #24 pass selects the two papers with the latest verified award dates: Perceptions of Moderators and Reddit Rules and Rulers (2025). Existing prose is preserved; the backfill is approved and published.

Done when an agreed bibliography has been reconciled, omissions or conflicts are recorded, and approved papers appear consistently in the archive and profiles.

### 3. Verify and backfill awards and news with shared records

GitHub: [#24](https://github.com/behavioral-data/behavioral-data.github.io/issues/24)

Phase: Before launch. Dependencies: 1, 2.

The [awards review](AWARDS_NEWS_REVIEW.md) and [expanded audit](AWARDS_AUDIT.md) are published on the website: 69 honors total, including 59 additional verified records. All 35 maintainer exclusions remain excluded; 15 candidates are deferred for missing dates, source access or attribution. Yasaman is linked to GLOBEM. The homepage order is Latest news, People awards, then Paper awards. People highlights include the latest two honors plus Ashish’s ACM and William Chan dissertation awards. The 2026 news item covers Jina’s return; the Ken/xAI item was removed at the maintainer’s request. Review records retain exact sources, decisions and public award IDs. No additional paper awards were eligible. Source-access gaps remain documented for 26 publisher attempts and Twitter/X timelines.

Homepage highlight selection is part of this step: after verifying the awards, choose the latest award-winning papers. This resolves the deferred highlight work from #23.

- [ ] Collect missing paper awards, individual honors, and lab news from conference/award organizations, UW announcements, or member-submitted evidence.
- [x] Add structured award records with exact title, awarding body, date, recipients, optional paper link, and source URL.
- [x] Review the original award fields and news entries; migrate without changing their meaning or duplicating announcements.
- [x] Render approved awards consistently on relevant paper/profile pages and the news/awards view from shared records.
- [ ] Require approval for new wording; do not generate promotional summaries or infer awards from citations.

Done when the lab approves the initial backfill and editing one award updates all associated views.

### 4. Review original page content, recruitment, sponsors, and barebones layout

GitHub: [#25](https://github.com/behavioral-data/behavioral-data.github.io/issues/25)

Phase: Before launch. Dependencies: none.

The React draft intentionally uses original site prose and logos. Some original claims are old, including recruiting availability and research themes. Research, pictures, and about-website routes currently have only titles.

- [ ] Ask the lab to verify the existing overview, postdoc document, PhD guidance, affiliation, and seven sponsor entries.
- [ ] Remove or explicitly approve corrections to stale claims; add no new prose or taglines without approval.
- [ ] Decide whether empty routes should remain, be hidden, or redirect; retain necessary template attribution in repository documentation.
- [ ] Add an owner and review/expiry date for opportunities and other time-sensitive content.
- [ ] Confirm page order, original logo variants, highlight selection, and which archive sections belong on the homepage.

Done when the lab has approved the minimal content and navigation and no unverified current opening is advertised.

### 5. Complete browser, accessibility, route, and signup checks

GitHub: [#26](https://github.com/behavioral-data/behavioral-data.github.io/issues/26)

Phase: Before launch. Dependencies: 4.

Production builds, content validation, unit tests, and an internal exported-link check pass locally. Comprehensive browser and integration QA is still pending.

- [ ] Exercise desktop/mobile layouts, original logos, keyboard navigation, focus, contrast, headings, alt text, and zoom in the built-in browser.
- [ ] Check publication search, combined filters, reset/empty states, profiles, awards, and missing optional assets.
- [ ] Build a legacy URL inventory from the original site and verify every required page/download. Include /team/, /publications/, /allnews/, /vacancies, /idiofid/, /aboutwebsite.html, and linked PDFs; add redirects or exported aliases for gaps.
- [ ] Check canonical URLs, sitemap, robots, favicon, social/search metadata, and 404 behavior on a static Pages-like server.
- [ ] Confirm ownership of the IdioFid Google Apps Script endpoint and coordinate one authorized test signup; verify the response without storing addresses in the repository.
- [ ] Add durable automated checks for actual regressions found, especially URL preservation and content relationships.

Done when launch-critical routes and interactions pass, the signup flow is verified, and remaining nonblocking defects are recorded.

### 6. Implement publication discovery, normalization, and deduplication

GitHub: [#27](https://github.com/behavioral-data/behavioral-data.github.io/issues/27)

Phase: Maintenance pilot. Dependencies: 1, 2.

scripts/prepare_publication.py currently prepares a local proposal from one Crossref DOI. It does not discover papers or edit approved content.

- [ ] Choose one primary scholarly provider after checking current access, coverage, limits, and costs; query verified author IDs.
- [ ] Implement paginated incremental retrieval with lookback, periodic reconciliation, caching, retries, and a request budget.
- [ ] Normalize source IDs and metadata; use exact IDs for deduplication and send fuzzy matches or version conflicts to review.
- [ ] Store candidates and provenance separately from approved content. Preserve manual corrections, rejected candidates, and deferrals across runs.
- [ ] Flag withdrawals, corrections, missing source records, and changed metadata for review; never silently delete approved papers.
- [ ] Test repeat runs, same-name researchers, preprint-to-publication transitions, source failures, and partial results.

Done when fixture and live pilot runs produce evidence-backed candidates, repeat runs produce no duplicate changes, and no candidate publishes automatically.

### 7. Create weekly review batches, contributor intake, and monitoring

GitHub: [#28](https://github.com/behavioral-data/behavioral-data.github.io/issues/28)

Phase: Maintenance pilot. Dependencies: 3, 6.

The agreed policy is one weekly batch for human review before publication. No scheduled discovery or review automation is enabled yet.

- [ ] Add a simple member submission path for DOI/URL, award evidence, and profile corrections; GitHub issue forms are sufficient initially.
- [ ] Prepare one review pull request per weekly batch with additions, changed fields, source links, matched people, and conflicts; update an existing batch instead of duplicating it.
- [ ] Support approve/edit/reject/defer and retain those decisions on subsequent imports; keep private reviewer notes and signup addresses outside the public repo.
- [ ] Run content checks and provide a preview/artifact. Publish only after a maintainer approves and merges.
- [ ] Assign primary and backup reviewers and select a lab-owned scheduler and notification destination.
- [ ] Track last successful fetch, review, and deploy; detect missed runs independently and notify on actionable failures or overdue review, staying quiet on no-change runs.
- [ ] Run at least two weekly review cycles and record missed papers, false matches, duplicates, failure recovery, and reviewer time.

Done when the pilot demonstrates reliable collection and human-reviewed publication, with a documented operating owner. Automatic publication remains out of scope.

### 8. Launch React on GitHub Pages and document maintainer handoff

GitHub: [#29](https://github.com/behavioral-data/behavioral-data.github.io/issues/29)

Phase: Launch. Dependencies: 1, 2, 3, 4, 5.

The migration exports a static Next.js/React site. The existing live site remains on its old deployment; the new Pages workflow is manual-only.

- [ ] Open and review the migration PR; run CI from a clean checkout with the documented Node version and validate the exported artifact.
- [ ] Confirm the intended production branch/domain and record a known-good rollback revision and deployment procedure.
- [ ] Obtain lab approval for the production switch, coordinate merging with changing Pages Source to GitHub Actions, and run the first React deployment.
- [ ] Verify production routes, PDFs, assets, canonical domain, and signup behavior; confirm the rollback procedure is usable.
- [ ] Enable deployment on approved merges only after the initial switch is verified, if agreed.
- [ ] Give a primary and backup CS PhD maintainer a short runbook covering content edits, preview, validation, deployment, rollback, dependencies, and lab-owned credentials.

Done when the approved React site is live and a second maintainer can make and roll back an update. The maintenance pilot can follow launch; do not imply that launch alone enables automatic discovery.
