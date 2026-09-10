# Lab publication attribution

Confirmed direction from the lab maintainer, clarified September 9, 2026: Tim must be an author, together with at least one distinct current or past lab member. Tim alone is insufficient. Papers without Tim do not qualify even if two other lab members are authors, because they may belong to another lab.

For historical attribution, use membership when the work was published, rather than someone's current role. Past members count during their recorded membership interval. Tim is counted as the PI when his verified author identity appears, but never qualifies a paper alone. Unknown membership dates require human review; current status does not establish historical membership. Publication date is a screening proxy for when the work happened. Continuing collaborations after departure, publication delays, and work predating the lab require a documented reviewer judgment.

Screening uses inclusive calendar years from `maintenance/membership-evidence.json`. Joining and leaving years both count; Jina’s separate 2019–2022 and 2026–present periods retain the intervening gap. Omitted ranges, unknown starts, and unknown departure years require review. A null end is open only when explicitly marked ongoing. Source records with only a publication year can be screened without inventing a month or day.

All 66 approved archive entries have explicit profile author links. The 23 remaining imported records were checked against paper title pages and author evidence; see [attribution review](../_planning/ATTRIBUTION_REVIEW.md). Their existing inclusion is preserved, including Tim’s earlier work and historical collaborations. The new-candidate rule does not retrospectively remove approved records. Current screening assessments can change as evidence improves; a recorded human decision retains its original assessment, reason, sources, date, and selected authors.

`maintenance/publication-policy.json` configures the rule. Each discovery candidate receives a `labRelevance` assessment:

- `meets-rule`: Tim and at least one other distinct lab author have supported publication-time membership.
- `needs-membership-review`: Tim is an author and another identity matches, but membership or publication dates are missing.
- `does-not-meet-rule`: Tim is absent, or fewer than two qualifying identities appear in the configured registry. This is a screening result, not proof that no other lab author exists in the paper.

All candidates remain available for review. Discovery does not automatically accept, reject, delete, or publish papers. Existing approved publications are unchanged. Human review must confirm authorship, lab relevance, publication/version metadata, and duplicate matches before acceptance. Reviewers can handle exceptions in the content PR with an explanation.

Qualifying arXiv papers are eligible for inclusion. They must retain `status: preprint` and `type: preprint`, which produces a visible preprint label on the website. When a final conference or journal version exists, prefer that record and group the preprint as an alternate rather than displaying both.

The acceptance command enforces this policy. It requires Tim and at least one other explicitly reviewed, provider-matched person ID. Missing membership dates or unresolved identity can be handled only with an explicit reviewer reason and at least one public evidence URL; the Tim requirement cannot be overridden. The queue retains that policy version, reason, evidence, reviewed people, and review date as an audit record. A stale or missing policy assessment must be reassessed or recollected before acceptance.

## Identity quality and coverage

Google Scholar profiles are identity references, recorded in `maintenance/scholar-profiles.json`. OpenAlex IDs are retrieval handles, not guarantees that every paper in an author profile belongs to that person. The first pull found apparent namesake contamination in Yige, Cheng, Deniz, and Margaret's records, and split profiles for Tim and Ashish. Known-paper anchors are recorded as `evidenceWorkIds` in `maintenance/authors.json`.

`requiresWorkVerification: true` flags a profile for per-paper checks. Candidates outside its known-paper anchors list `identityReviewPersonIds`; a relevance label does not override that warning. A person counts only once even when multiple OpenAlex IDs map to them.

The initial registry fetches the eight current members' primary records. It also recognizes anchored identities for seven past members (Ashish Sharma, Galen Weld, Joy He-Yueya, Ken Gu, Mike Merrill, Xinyi Zhou, and Yasaman Sefidgar). These entries use `discover: false`: they match coauthors in retrieved papers without fetching their entire subsequent careers. Additional past members and split IDs still need verification. Coverage is preliminary, so papers with too few matches remain visible in the full durable queue, but only candidates containing Tim can enter the focused review set.

## First local batch

The initial September 5 pull retrieved 383 OpenAlex work records. A follow-up check of the newest Scholar entries for all eight current members recovered missing records and author aliases. At the end of that batch, the queue retained 390 source records, with 68 alternate versions grouped into 322 canonical review items. After the September 9 policy clarification and completed first review, 46 pending candidates need membership review and 264 do not meet the rule. Eleven OpenAlex papers and the manually sourced SynthWorlds record were accepted; Artificial Hivemind is durably rejected because Tim is not an author. The focused recent-review sheet was empty.

Start with `maintenance/recent-review.md`; the full queue is in `maintenance/batch.md` and `maintenance/review.json`. Scholar findings and source links are recorded in `_planning/SCHOLAR_LATEST_REVIEW.md`. The existing 47 approved publications were unchanged by discovery. The first reviewed content batch adds 12 records: eight published papers, three visibly labeled preprints, and one accepted ICLR workshop poster that retains its arXiv identifier. No live-sync checkpoint was written, and discovery and scheduled workflows remain disabled during this pilot. Complete historical coverage and membership intervals remain review tasks.

## September 9 historical backfill

The maintainer approved seven further papers: five published records and Margaret Li’s two preprints, bringing the local site to 66 publications. Prefer a verified journal record over its preprint; if the journal record cannot be verified, include the verified preprint and upgrade that same site entry when the final record is confirmed. Conflicting journal claims on author profiles are not sufficient to invent a journal year or DOI.

The queue retains 390 observations grouped into 321 canonical candidates: 18 accepted, 302 pending and one rejected, plus one accepted manual supplement. Pending screening labels are 38 membership-review and 264 does-not-meet-rule. The Cognitive Reframing preprint is now grouped under its accepted ACL record. Vinayak Gupta’s identity is anchored to the forecasting paper and its preprint, with career-wide discovery disabled. Acceptance audits use the maintainer-approved year-level membership evidence; this does not change the exact-date screening model. Full evidence and remaining work are in `_planning/PUBLICATION_BACKFILL_REVIEW.md`.

## Existing-record reconciliation

The subsequent September 9 pass updates 24 existing entries without adding pages: 20 missing DOIs, complete author lists, verified final PDF links and five preprint/final groups. The bibliography remains at 66 papers. The queue retains 390 observations in 316 canonical items: 42 accepted, 273 pending and one rejected, plus the accepted manual supplement. Nine pending canonical items need membership/version review; 264 retain the other screening label. `_planning/PUBLICATION_RECONCILIATION_REVIEW.md` records the sources, decisions and unresolved cases. The original metadata and all alternate source observations remain available for audit.

The maintainer subsequently declined all nine remaining membership/version cases. Their candidate additions/updates are recorded as rejected, with existing approved site entries preserved. Current canonical decisions: 42 accepted, 264 pending and ten rejected, plus one accepted manual supplement. This closes the current focused review pass, not an exhaustive audit of the remaining provider matches.
