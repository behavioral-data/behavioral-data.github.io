# Behavioral Data Science website

A static React website built with Next.js and plain CSS. Content is stored in JSON; the optional DOI helper uses Python's standard library. No Ruby, Jekyll, database, or application server is needed in production.

## Run locally

Use Node 24 LTS (`nvm use` if you use nvm):

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js (normally http://127.0.0.1:3000).

## Build and check

```sh
npm run check
npm run test:skeleton
npm run preview
```

The build validates the content and referenced assets, then exports static files into `out/`. Stop the development server before starting the static preview because both default to port 3000.

## Update content

| What to edit | Where |
| --- | --- |
| Publications | `content/publications.json` |
| People, roles, status and interests | `content/people.json` |
| Alumni from the original site | `content/alumni.json` |
| News, newest date first | `content/news.json` |
| Sponsors | `content/sponsors.json` |
| Existing page prose (Markdown strings) | `content/pages.json` |
| Awards, projects, opportunities, photos | `content/awards.json`, `projects.json`, `opportunities.json`, `gallery.json` |
| Site domain and signup endpoint | `content/site.json` |
| Page layout | `app/` |
| Shared interface components | `components/` |
| All styling | `app/globals.css` |
| Images, PDFs and downloads | `public/` |

See [Content model](docs/CONTENT_MODEL.md) for field definitions and [Maintenance runbook](docs/MAINTENANCE.md) for submissions, discovery, review, activation and recovery. Keep stable IDs when editing existing records: they determine page URLs. Ordinary papers do not require a thumbnail or local PDF. Do not modify the `legacy` metadata unless correcting an import; it preserves original bibliographic details.

Publications support explicit `personIds`; existing imports retain name matching until the roster/content pass supplies verified links. The discovery pipeline uses only the explicitly verified identities in `maintenance/authors.json`, which is currently empty.

## Review and deploy

Create a branch and pull request. The check workflow runs content validation, tests and the production build, then saves the exported site as a downloadable artifact. Review the content and preview before merging.

The React deployment workflow is **manual-only** until the lab approves the production switch. In the GitHub repository, set Pages → Source to GitHub Actions, then run “Deploy React website” after approval. It deploys `out/` at the existing organization site address. No production settings were changed during local migration. Once the lab wants automatic deployment, add a `push` trigger for `master`.

Do not push the migration to the production branch while the old Pages branch-based Jekyll deployment remains enabled. Use a PR and coordinate the Pages source switch with the first React deployment.

## Migration and remaining work

See [Next steps and GitHub issues](_planning/NEXT_STEPS.md) for the current delivery plan and completion criteria.

All 47 publication records, 21 people records, 12 legacy alumni entries, three news records, seven sponsors and original asset files were preserved. Old route names remain available, including `/team/`, `/publications/`, `/allnews/`, `/vacancies/` and `/idiofid/`. A duplicated PDF path in the old GLOBEM entry was repaired.

The existing dataset still needs a roster review and publication/award backfill. No new papers, honors or current job titles were inferred. The IdioFID form retains its existing Google Apps Script endpoint; a signup was not submitted during migration.

The migration backup location and inventory are recorded in `_planning/migration-backup.json`. It includes the pre-migration legacy source and staged/unstaged Git patches. Generated Jekyll output and installed Ruby dependencies were not archived. Git's existing commit history is intact.

**Infrastructure first; content last.** Structured collections and related page skeletons, submission forms, OpenAlex discovery, deduplication, persistent review decisions, weekly draft-PR workflows, health checks, and deployment validation are implemented. Empty future collections contain no invented lab records.

**Live maintenance remains disabled.** Activation requires a verified author roster, configuration and reviewer ownership, repository permissions, and an independent scheduler/notification hookup. Two real weekly review cycles and the approved production switch remain to be done after the content pass. Private reviewer notes, credentials and signup addresses must stay out of this public repository.

## Credits

The original website was based on the Allan Lab at Leiden University template. Its content and historical assets are retained with their existing attribution. The current implementation uses React and Next.js.
