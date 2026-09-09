# Lab publication attribution

Confirmed direction from the lab maintainer, September 5, 2026: require at least two distinct lab authors. Tim alone is insufficient. Tim plus a current or past member can qualify, as can two other lab authors.

For historical attribution, use membership when the work was published, rather than someone's current role. Past members count during their recorded membership interval. Tim is counted as the PI when his verified author identity appears, but never qualifies a paper alone. Unknown membership dates require human review; current status does not establish historical membership. Publication date is a screening proxy for when the work happened. Continuing collaborations after departure, publication delays, and work predating the lab require a documented reviewer judgment.

`maintenance/publication-policy.json` configures the rule. Each discovery candidate receives a `labRelevance` assessment:

- `meets-rule`: at least two distinct lab authors with supported publication-time membership.
- `needs-membership-review`: enough identities match, but membership or publication dates are missing.
- `does-not-meet-rule`: fewer than two qualifying identities in the configured registry. This is a screening result, not proof that no other lab author exists in the paper.

All candidates remain available for review. Discovery does not automatically accept, reject, delete, or publish papers. Existing approved publications are unchanged. Human review must confirm authorship, lab relevance, publication/version metadata, and duplicate matches before acceptance. Reviewers can handle exceptions in the content PR with an explanation.

The acceptance command enforces this policy. It requires at least two explicitly reviewed, provider-matched person IDs. A candidate whose publication-time membership or author identity remains unresolved can be accepted only with an explicit reviewer reason and at least one public evidence URL. The queue retains that policy version, reason, evidence, reviewed people, and review date as an audit record. A stale or missing policy assessment must be recollected before acceptance.

## Identity quality and coverage

Google Scholar profiles are identity references, recorded in `maintenance/scholar-profiles.json`. OpenAlex IDs are retrieval handles, not guarantees that every paper in an author profile belongs to that person. The first pull found apparent namesake contamination in Yige, Cheng, Deniz, and Margaret's records, and split profiles for Tim and Ashish. Known-paper anchors are recorded as `evidenceWorkIds` in `maintenance/authors.json`.

`requiresWorkVerification: true` flags a profile for per-paper checks. Candidates outside its known-paper anchors list `identityReviewPersonIds`; a relevance label does not override that warning. A person counts only once even when multiple OpenAlex IDs map to them.

The initial registry fetches the eight current members' primary records. It also recognizes anchored identities for seven past members (Ashish Sharma, Galen Weld, Joy He-Yueya, Ken Gu, Mike Merrill, Xinyi Zhou, and Yasaman Sefidgar). These entries use `discover: false`: they match coauthors in retrieved papers without fetching their entire subsequent careers. Additional past members and split IDs still need verification. Coverage is preliminary, so papers with too few matches remain visible.

## First local batch

The initial September 5 pull retrieved 383 OpenAlex work records. A follow-up check of the newest Scholar entries for all eight current members recovered missing records and author aliases. The queue now retains 390 source records, with 68 alternate versions grouped into canonical review items. Of the 322 canonical records, 61 need membership review and 261 do not meet the rule with the current registry. The recent review sheet contains 12 OpenAlex papers dated 2025 onward plus SynthWorlds, a manually sourced ICLR 2026 candidate. These are suggestions, not approved publications.

Start with `maintenance/recent-review.md`; the full queue is in `maintenance/batch.md` and `maintenance/review.json`. Scholar findings and source links are recorded in `_planning/SCHOLAR_LATEST_REVIEW.md`. The existing 47 approved publications have not changed. No live-sync checkpoint was written, and discovery and scheduled workflows remain disabled during this pilot. Preprint inclusion, complete historical coverage, and membership intervals remain review tasks.
