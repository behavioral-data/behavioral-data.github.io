# Content model

All public page data lives in `content/`. JSON strings may contain Markdown where noted. Existing imported records remain unchanged until the content review. Stable IDs determine URLs; changing an ID requires an exported alias. Run `npm run validate` after edits.

| File | Required fields | Optional fields and behavior |
| --- | --- | --- |
| `pages.json` | Markdown strings: `home`, `recruitment`, `idiofid`, `research`, `pictures`, `about` | Empty strings render no prose. Existing words have only been moved out of JSX. |
| `site.json` | `name`, `url`, `repository`, `signupUrl`, `description` | Canonical site URL and IdioFid endpoint are configured here. |
| `people.json` | `id`, `name`, `role`, `status`, `priority`, `topics` | `website`, local `image`, `aliases`, `memberships: [{start, end?}]`, `reviewedOn`; status is member/visitor/alumni. |
| `publications.json` | `id`, `title`, `authors`, integer `year` | Ordered `authorNames`, explicit `personIds`, `venue`, DOI, `openalexId`, `arxivId`, `status`, `type`, `topics`, `description` (Markdown), `highlight`, local/external `pdf`, local `image`, `url`, `code`, `dataset`, `reviewedOn`, preserved `legacy`. |
| `awards.json` | `id`, `title`, `organization`, `date`, `sourceUrl`, at least one recipient or paper | `personIds`, `publicationIds`; one record supplies badges and related profile, publication, and news views. |
| `news.json` | `id`, `headline` (Markdown), `date` | `personIds`, `publicationIds`, `projectIds`, `awardIds`, `sourceUrl`. Related profiles and paper pages display linked news. |
| `projects.json` | `id`, `title` | `description` (Markdown), local `image`, `personIds`, `publicationIds`, `url`, `code`, `dataset`. Appears on Research and linked profile/paper pages. |
| `opportunities.json` | `id`, `title`, `ownerId`, `url`, `status`, `reviewOn` | `description` (Markdown), `closesOn`; status is open/closed/draft. Open entries past their closing date are excluded at build time. |
| `gallery.json` | `id`, local `image`, `alt` | `caption`, `date`, `personIds`; renders on Pictures. |
| `sponsors.json` | `name`, `path` relative to `/resources` | `url`, `reviewOn`; existing logo paths are preserved. |
| `alumni.json` | `name` | `site`; historical list retained pending roster reconciliation. |

The validator in `lib/content-validation.mjs` enforces dates, IDs, links, assets and relationships. Cross-record references must point to existing records. Public content requires no API key, database or server.

Publication status: `preprint`, `accepted`, `published`, `withdrawn`, `retracted`. Type: `article`, `conference`, `preprint`, `book`, `dataset`, `other`. These fields are optional for imported records; verify them during backfill. Explicit `personIds`, including an empty list, supersede legacy name matching. Do not generate those links solely from names.

Awards are not converted into invented news text. An approved news record can link to an award; its exact title is shown where related. Existing paper-level `award` strings remain supported until reviewed migration into the structured collection. Avoid duplicating an award across old and new records.

Recruitment retains its original Markdown while `opportunities.json` is empty. Once structured opportunities exist, they are the source for the recruitment page. Closed or draft entries remain in the data but are hidden. Expiration is evaluated when the static site is built, so changing a date or reaching a deadline requires a rebuild; the deployment runbook covers this.

Research and Pictures navigation entries appear when their respective collections contain records. Their routes remain valid while empty. No example record is shipped in public content; synthetic test records are isolated under `tests/fixtures/` or temporary directories.

## Verified discovery identities

`maintenance/authors.json` maps verified OpenAlex identities to people. Start with an empty array; no real identity was inferred during infrastructure work.

```json
[
  {
    "personId": "existing-person-id",
    "openalexId": "A123456",
    "verified": true,
    "verifiedOn": "2026-09-05",
    "sourceUrl": "https://example.org/evidence"
  }
]
```

The sample is illustrative, not a real lab identity. Add actual IDs only after checking known papers and membership. Provider identity and lab relevance are separate: acceptance requires a reviewer to select lab person IDs explicitly.

## Public and private material

`maintenance/review.json` is a public review queue, committed on a review branch. It contains public bibliographic observations, source links, decisions, and proposed field changes. It is not a private inbox. Avoid private reviewer notes or unpublished submissions in issues, PRs, or this file.

API credentials belong in environment variables or GitHub Actions secrets. `.cache/` holds local HTTP responses and sync checkpoints and is ignored by Git. `_review/` holds the original one-off Crossref helper output and is also ignored. None of these paths is exported into the site.
