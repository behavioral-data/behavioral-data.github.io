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

Run `npm run format` after editing JavaScript, JSX, CSS, or root configuration files. The pinned Prettier version keeps source formatting consistent; `npm run check` enforces it locally and in CI. Content, maintenance records, Markdown, and Python files retain their existing formatting.

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

All 66 publications have reviewed `personIds`, which determine profile paper lists. The discovery pipeline queries nine current-member identities and recognizes anchored past-member and split-profile identities as coauthors. Reviewed membership evidence uses inclusive calendar years; uncertain identities and dates remain human-review cases.

## Review and deploy

Create a branch and pull request. The check workflow runs content validation, tests and the production build, then saves the exported site as a downloadable artifact. Review the content and preview before merging.

The React site is live at <https://behavioral-data.github.io/> from `master`, using GitHub Actions for Pages. Deployment remains **manual-only**: after reviewing and merging a change, run “Deploy React website” on `master`. Pushing a branch or merging a PR does not deploy it. The [runbook](docs/MAINTENANCE.md) covers verification and rollback without rewriting history.

## Migration and remaining work

See [Next steps and GitHub issues](_planning/NEXT_STEPS.md) for the current delivery plan and completion criteria.

The reviewed website contains 66 publications, 22 people records (nine current members), 11 legacy alumni entries, four news records, seven sponsors, and 69 honors. Sponsors are described as **Past and present support**, as confirmed by the maintainer. Original assets and stable publication URLs remain available. Empty Research, Pictures, and About website routes redirect to relevant live sections; historical news, recruitment, and IdioFid URLs are preserved.

The content and layout passes are complete. Keyboard, responsive, accessibility, and route checks are recorded in [final QA](_planning/FINAL_QA.md). The IdioFid form retains its existing Google Apps Script endpoint; the maintainer explicitly deferred a live signup test.

The migration backup location and inventory are recorded in `_planning/migration-backup.json`. It includes the pre-migration legacy source and staged/unstaged Git patches. Generated Jekyll output and installed Ruby dependencies were not archived. Git's existing commit history is intact.

**Recurring maintenance remains disabled.** The isolated live discovery pilot passed; see [pilot evidence](_planning/MAINTENANCE_PILOT.md). Primary maintainer: [advaitmb](https://github.com/advaitmb). Activation still requires review safeguards, alert routing, an independent missed-run monitor, and two actual weekly review cycles. Automatic publication is out of scope. Private reviewer notes, credentials, and signup addresses stay outside this public repository.

## Credits

The original website was based on the Allan Lab at Leiden University template. Its content and historical assets are retained with their existing attribution. The current implementation uses React and Next.js.
