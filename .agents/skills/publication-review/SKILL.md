---
name: publication-review
description: Find, vet, record, and publish Behavioral Data Science Lab paper candidates through the repository's recurring OpenAlex and human-review workflow. Use for publication scans, weekly paper review, include/exclude decisions, duplicate reconciliation, or preparing the publication review pull request.
---

# Publication review

Apply the user's instructions first. Keep discovery, editorial judgment, and publication as separate stages so a source record never becomes site content without a recorded human decision.

## Establish the current state

Read these repository files before deciding anything:

- `maintenance/publication-policy.json` for enforceable thresholds.
- `docs/PUBLICATION_POLICY.md` for the interpretation of membership, identity, and version rules.
- `maintenance/authors.json` and `content/people.json` for verified identities and membership intervals.
- `maintenance/recent-review.md` for the concise current batch; consult `maintenance/review.json` for complete provenance and prior decisions.

Run `python3 scripts/publication_pipeline.py status` and report the counts before collecting or editing.

## Collect

When the user asks for a new scan, run `python3 scripts/publication_pipeline.py collect`. Treat OpenAlex as candidate discovery, not ground truth. The command must leave `content/publications.json` unchanged. If the provider fails or returns a partial result, preserve the previous queue and report the failure.

Use Google Scholar as a coverage cross-check when requested or when recent expected work is missing. Verify a candidate with a primary paper, proceedings, publisher, DOI, or arXiv page. Add source-only gaps to `maintenance/scholar-supplement.json`; never invent an OpenAlex ID.

Supplement entries can have incomplete provider metadata and are not accepted by the OpenAlex decision command. Vet them with the same rule, then use the documented manual content workflow and record the decision in the supplement.

## Vet each candidate

Apply all of these checks:

1. Confirm the full author list from primary evidence. Do not infer identity from a name or initial.
2. Require Tim as an author plus at least one other distinct verified lab author. Tim alone is insufficient, and papers without Tim are ineligible even if they contain multiple lab members. Evaluate past members against membership at the publication date.
3. Treat `needs-membership-review`, `identityReviewPersonIds`, missing dates, and mixed provider profiles as unresolved. Resolve them with evidence or keep the candidate pending.
4. Compare DOI, arXiv ID, normalized title, complete author list, and existing site records. Prefer the final published version while retaining all source observations. Do not collapse datasets, responses, corrections, or errata solely by title.
5. Review venue, year, publication state, ordered authors, URL, and whether the work belongs to the lab. Handle preprints case by case; do not silently replace a published record with a preprint.

Map reviewer language as follows: include → `accept`, exclude → `reject`, unsure → leave pending or `defer` to an explicit future date. Rejections and deferrals stay in the durable queue.

Record an OpenAlex decision with `python3 scripts/publication_pipeline.py decide CANDIDATE DECISION`. Acceptance requires repeated `--person PERSON_ID` arguments, including Tim's person ID. If membership or identity remains unresolved but the user explicitly approves an evidence-backed exception, also supply a concise `--reason` and one or more `--evidence URL` arguments. The pipeline stores that audit record and rejects undocumented overrides. An exception cannot waive the requirement that Tim be an author.

## Validate and present

Run `python3 scripts/publication_pipeline.py check` after decisions. Inspect the diff and summarize included, excluded, deferred, unresolved, and duplicate/version outcomes. Never describe a pending candidate as published.

## Push a reviewed batch

Pushing changes and opening a pull request are external mutations. Do this only when the user explicitly asks to push or open the review PR. Use the dedicated `codex/weekly-publication-review` branch and run:

```sh
python3 scripts/publication_pipeline.py publish --base BASE_BRANCH --confirm-push
```

The command must refuse unrelated working-tree or staged changes, run the full check, commit only review artifacts and approved publications, push the dedicated branch, and create or update one draft PR. It must never merge the PR or deploy the site.
