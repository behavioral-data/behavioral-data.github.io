# Maintaining content

## Add or correct a record

Edit the appropriate JSON file in `content/`, run `npm test` and `npm run build`, and open a GitHub pull request. Use an existing record as a starting point. Preserve IDs and original author order. Add assets under `public/resources/` and reference them with a leading `/resources/` path.

## Prepare a paper from a DOI

```sh
python3 scripts/prepare_publication.py 10.1234/example
```

Replace the example with a real DOI. The helper queries Crossref and creates `_review/doi-<identifier>.json`. It does not change published content. `_review/` is ignored by Git and is not included in the website.

Review author identity, lab relevance, venue/year, links, and whether a preprint or final version already exists. If approved, copy the `publication` object into `content/publications.json`, add any curated links/description, then run the checks and submit a PR. If it updates an existing paper, retain that paper's ID rather than adding a duplicate. This initial helper catches exact DOI duplicates only; title-based or preprint/final matching needs human review.

Existing proposals are never overwritten, so running the helper again preserves reviewer edits. Rejected/deferred decisions in a fully automated weekly workflow are future work. This command alone is not an automatic literature-monitoring service.

## People and news

Set a person's status to `member`, `visitor`, or `alumni`; use ISO dates (`YYYY-MM-DD`) for news. Add award text only after checking the official award source. People records may retain historical roles, so verify role changes before publishing them.
