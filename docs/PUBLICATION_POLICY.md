# Lab publication attribution

Confirmed direction from the lab maintainer, clarified September 9, 2026: Tim must be an author, together with at least one distinct current or past lab member. Tim alone is insufficient. Papers without Tim do not qualify even if two other lab members are authors, because they may belong to another lab.

For historical attribution, use membership when the work was published, rather than someone's current role. Past members count during their recorded membership interval. Tim is counted as the PI when his verified author identity appears, but never qualifies a paper alone. Unknown membership dates require human review; current status does not establish historical membership. Publication date is a screening proxy for when the work happened. Continuing collaborations after departure, publication delays, and work predating the lab require a documented reviewer judgment.

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

The initial September 5 pull retrieved 383 OpenAlex work records. A follow-up check of the newest Scholar entries for all eight current members recovered missing records and author aliases. The queue now retains 390 source records, with 68 alternate versions grouped into 322 canonical review items. After the September 9 policy clarification and reassessment, 57 pending candidates need membership review and 264 do not meet the rule; Artificial Hivemind is durably rejected because Tim is not an author. The recent review sheet contains 11 OpenAlex papers dated 2025 onward plus SynthWorlds, a manually sourced ICLR 2026 candidate. These are suggestions, not approved publications.

Start with `maintenance/recent-review.md`; the full queue is in `maintenance/batch.md` and `maintenance/review.json`. Scholar findings and source links are recorded in `_planning/SCHOLAR_LATEST_REVIEW.md`. The existing 47 approved publications were unchanged by discovery. The first review set proposes 12 records, including four preprints, but those additions belong to a separate reviewed content change and are not part of this migration branch. No live-sync checkpoint was written, and discovery and scheduled workflows remain disabled during this pilot. Complete historical coverage and membership intervals remain review tasks.
