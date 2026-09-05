# Codebase map

- `app/`: Next.js routes, metadata and plain CSS; exported as static HTML.
- `components/`: reusable React navigation, paper cards and publication filters.
- `content/`: editable JSON datasets. These are the source of truth for the public website.
- `lib/`: content access, filtering and citation formatting.
- `public/`: original assets at their historical URL paths.
- `scripts/validate-content.mjs`: content and asset checks, run before every build.
- `scripts/prepare_publication.py`: DOI lookup that creates a local review proposal.
- `tests/`: focused publication filtering, citation and proposal tests.
- `.github/workflows/`: pull-request checks and a manual production deployment.
- `_planning/`: inventory, migration report and future maintenance specification.

See README.md for commands and contribution instructions. There is no Jekyll or Ruby build path.
