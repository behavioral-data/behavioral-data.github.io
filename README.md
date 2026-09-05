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
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
npm run build
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
| Page layout and text | `app/` |
| Shared interface components | `components/` |
| All styling | `app/globals.css` |
| Images, PDFs and downloads | `public/` |

See `scripts/README.md` for a DOI metadata helper and the review workflow. Keep stable IDs when editing existing records: they determine page URLs. Ordinary papers do not require a thumbnail or local PDF. Do not modify the `legacy` metadata unless correcting an import; it preserves original bibliographic details.

People's archive publications are matched from stored author names, not live author identities. Check ambiguous names when adding records. The future discovery service will require verified author IDs and membership dates.

## Review and deploy

Create a branch and pull request. The check workflow runs content validation, tests and the production build, then saves the exported site as a downloadable artifact. Review the content and preview before merging.

The React deployment workflow is **manual-only** until the lab approves the production switch. In the GitHub repository, set Pages → Source to GitHub Actions, then run “Deploy React website” after approval. It deploys `out/` at the existing organization site address. No production settings were changed during local migration. Once the lab wants automatic deployment, add a `push` trigger for `master`.

Do not push the migration to the production branch while the old Pages branch-based Jekyll deployment remains enabled. Use a PR and coordinate the Pages source switch with the first React deployment.

## Migration and remaining work

See [Next steps and GitHub issues](_planning/NEXT_STEPS.md) for the current delivery plan and completion criteria.

All 47 publication records, 21 people records, 12 legacy alumni entries, three news records, seven sponsors and original asset files were preserved. Old route names remain available, including `/team/`, `/publications/`, `/allnews/`, `/vacancies/` and `/idiofid/`. A duplicated PDF path in the old GLOBEM entry was repaired.

The existing dataset still needs a roster review and publication/award backfill. No new papers, honors or current job titles were inferred. The IdioFID form retains its existing Google Apps Script endpoint; a signup was not submitted during migration.

The migration backup location and inventory are recorded in `_planning/migration-backup.json`. It includes the pre-migration legacy source and staged/unstaged Git patches. Generated Jekyll output and installed Ruby dependencies were not archived. Git's existing commit history is intact.

**Weekly automatic discovery is not enabled yet.** The DOI helper only prepares local proposals. The next phase is a verified author roster, source discovery, deduplication, one weekly review batch, and independent missed-run monitoring. Private reviewer notes, credentials and signup addresses must stay out of this public repository.

## Credits

The original website was based on the Allan Lab at Leiden University template. Its content and historical assets are retained with their existing attribution. The current implementation uses React and Next.js.
