# Codebase map

- `app/`: static Next.js pages, metadata, responsive CSS, and legacy route aliases.
- `components/`: React navigation, publication filters/cards, related awards, news and projects.
- `content/`: public JSON records, Markdown page prose, and site configuration. New editorial collections start empty.
- `lib/`: content loading, relationship resolution, filters, citation formatting, and validation.
- `public/`: original assets at historical URL paths; only public files belong here.
- `maintenance/`: verified identity/configuration slots and a public review queue; discovery starts disabled.
- `scripts/discovery.py`: paginated OpenAlex retrieval, normalization, deduplication and review proposals.
- `scripts/review.py`: local accept/reject/defer/reopen decisions; no publishing.
- `scripts/publish_batch.py`: CI review-branch/draft-PR handoff, with no merge operation.
- `scripts/monitor.py`: read-only health check suitable for an independent scheduler.
- `scripts/prepare_publication.py`: separate one-off Crossref DOI helper.
- `scripts/validate-*`, `check-export.py`, `export-aliases.mjs`: build-time contracts and URL preservation.
- `scripts/test-skeleton.py`: isolated fixture build for future sections without modifying content.
- `tests/`: content/relationship tests and review/provider failure cases using synthetic fixtures.
- `.github/`: contribution forms, PR template, CI, gated discovery/health and manual deployment workflows.
- `docs/`: content model and operational/activation/rollback runbook.
- `_planning/`: roadmap, issues, migration report, and historical research.

Start with README.md. No Jekyll, Ruby runtime, database, or production application server is required.
