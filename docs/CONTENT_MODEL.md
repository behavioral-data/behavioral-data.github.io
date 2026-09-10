# Content model

All public page data lives in `content/`. JSON strings may contain Markdown where noted. Existing imported records remain unchanged until the content review. Stable IDs determine URLs; changing an ID requires an exported alias. Run `npm run validate` after edits.

| File | Required fields | Optional fields and behavior |
| --- | --- | --- |
| `pages.json` | Markdown strings: `home`, `recruitment`, `idiofid`, `research`, `pictures`, `about` | Empty strings render no prose. Existing words have only been moved out of JSX. |
| `site.json` | `name`, `url`, `repository`, `signupUrl`, `description` | Canonical site URL and IdioFid endpoint are configured here. |
| `people.json` | `id`, `name`, `role`, `status`, `priority`, `topics` | `website`, local `image`, optional `photoCrop: {scale, x, y}`, `aliases`, `memberships: [{start, end?}]`, `reviewedOn`; status is member/visitor/alumni. |
| `publications.json` | `id`, `title`, `authors`, integer `year`, explicit `personIds` | Ordered `authorNames`, `venue`, optional `venueShort`, DOI, `openalexId`, `arxivId`, `status`, `type`, `topics`, `description` (Markdown), `highlight`, local/external `pdf`, local `image`, `url`, `code`, `dataset`, `reviewedOn`, preserved `legacy`. |
| `awards.json` | `id`, `title`, `organization`, `date`, `sourceUrl`, at least one recipient or paper | `personIds`, `publicationIds`, `recipientNames` for alumni without profiles, `recipientLabel` for team attribution, `kind`, `highlight` for an explicitly selected people honor, and `dateLabel` for a verified year range; one record supplies award labels and related profile, publication, and news views. |
| `news.json` | `id`, `headline` (Markdown), `date` | `personIds`, `publicationIds`, `projectIds`, `awardIds`, `sourceUrl`. Related profiles and paper pages display linked news. |
| `projects.json` | `id`, `title` | `description` (Markdown), local `image`, `personIds`, `publicationIds`, `url`, `code`, `dataset`. Appears on Research and linked profile/paper pages. |
| `opportunities.json` | `id`, `title`, `ownerId`, `url`, `status`, `description`, `actionLabel`, `reviewedOn`, `reviewOn` | `meta` (short display facts), `sourceUrl`, `sourceLabel`, `closesOn`; status is open/closed/draft. Open entries past their closing date are excluded at build time. |
| `gallery.json` | `id`, local `image`, `alt` | `caption`, `date`, `personIds`; renders on Pictures. |
| `sponsors.json` | `name`, `path` relative to `/resources` | `url`, `reviewOn`; existing logo paths are preserved. |
| `alumni.json` | `name` | `site`, preserved `legacy.name` when an imported display name changes; historical list retained pending roster reconciliation. |

The validator in `lib/content-validation.mjs` enforces dates, IDs, links, assets and relationships. Cross-record references must point to existing records. Public content requires no API key, database or server.

`maintenance/membership-evidence.json` is the source for automatic membership screening. The pipeline loads its reviewed ranges directly without copying dates into public profiles. Dates use inclusive `YYYY` ranges, preserve unresolved boundaries and conflicting claims, and distinguish an unknown departure from ongoing membership. Direct maintainer confirmations take precedence over public profiles; `omitted` records have no selected range. Differences within the same year do not block screening. Do not convert years into invented calendar days. See [Membership review](../_planning/MEMBERSHIP_REVIEW.md) and [attribution completion](../_planning/ATTRIBUTION_REVIEW.md).

`photoCrop` applies the same CSS framing on the homepage, Team, and profile pages, preserving original image assets. When present, it requires `scale` (1–2) and transform-origin percentages `x` and `y` (0–100). Without `photoCrop`, framing defaults to scale 1 and origin 50%, 50%.

Publication cards and venue filters use known short venue labels, or an explicit `venueShort` when the journal name alone does not identify the conference. Full `venue` values remain on detail pages and in citations. Search accepts both full names and displayed abbreviations. Phone filters expand from a disclosure button; selected filters remain visible as removable controls when collapsed.

Publication status: `preprint`, `accepted`, `published`, `withdrawn`, `retracted`. Type: `article`, `conference`, `preprint`, `book`, `dataset`, `other`. These fields are optional for imported records; verify them during backfill. Explicit `personIds` are required; use an empty list for a paper that belongs to no profile. Profiles never fall back to name matching. Verify author identity against primary evidence before adding a link.

News and Awards have separate archive routes with shared navigation. The Awards archive groups all records by year and provides year jump links; stable individual award anchors remain available. News omits a redundant related-person link when the headline already links to that profile. Awards are not converted into invented news text. An approved news record can link to an award; its title and organization are shown where related. The three imported paper-level `award` strings have been migrated into the structured collection; original wording remains in each publication's `legacy.award`. The rendered award label comes from the shared record. Avoid duplicating an award across old and new records.

Paper awards are eligible only when Tim Althoff is a verified coauthor of the awarded paper (maintainer decision, September 9, 2026). Exclude awards on other papers even when a current or past member is a recipient. This rule does not decide eligibility for individual honors or change publication inclusion policy. Preserve exclusions in the awards research audit. For the September 2026 backfill, the maintainer also excluded all demo awards, the researched honors for Joy He-Yueya, Vinayak Gupta and Xinyi Zhou, and Tim’s 2017 recognitions (including the IMIA paper selection as too old). This is a selection decision, not a general age cutoff.

Award and news event dates may be either `YYYY` or a real `YYYY-MM-DD`. Use year precision when that is all the evidence establishes; never invent January 1. Operational dates such as `reviewedOn`, `reviewOn`, and deadlines still require exact days.

The homepage has separate Latest news, Latest people awards, Latest paper awards, and Latest publications sections. Each has a link to its complete archive; the publications link includes the current paper count. The `#highlights` anchor remains on Latest news for existing links. The homepage shows the latest news record first, then two recent people honors plus explicitly selected people awards grouped by recipient, followed by two papers with the latest award dates. All selected honors remain visible within each recipient group. Paper links and team honors are excluded from people-honor selection; multiple awards for one paper occupy one paper slot. Ties use award/paper title alphabetically. Imported `highlight` flags are historical metadata and do not control selection. A conference spotlight or citation count does not establish a paper award. Cards without an illustration show text without an empty image placeholder.

Verified award tenures and academic-year ranges use `dateLabel: "YYYY–YYYY"`, with `date` set to the first year for ordering. This preserves source precision without inventing a day or collapsing the displayed range. `recipientNames` supports named alumni who have no profile; team records retain the team name and identify the linked member as a participant.

`opportunities.json` is the sole source for the Join us page. Closed, draft, and expired entries remain in the data but are hidden. If none are open, the page renders a neutral empty state rather than a historical recruitment claim. `reviewedOn` is the last human verification date; `reviewOn` is the next date the listing owner should check the record. Expiration is evaluated when the static site is built, so changing a date or reaching a deadline requires a rebuild; the deployment runbook covers this.

Research and Pictures navigation entries appear when their respective collections contain records. While empty, the static export redirects Research to Publications, Pictures to Team, and About website to Home, with canonical URLs and visible fallback links. Empty sections are omitted from the sitemap; populated future sections retain their own content. Template attribution remains in repository documentation. No example record is shipped in public content; synthetic test records are isolated under `tests/fixtures/` or temporary directories.

The homepage describes the seven sponsor records as **Past and present support**, confirmed by the maintainer on September 10, 2026. Their presence does not assert that every sponsor is funding the lab currently.

## Verified discovery identities

`maintenance/authors.json` maps OpenAlex identities to people using known-paper anchors. The initial registry is populated; mixed profiles still require per-paper authorship verification. Optional `evidenceWorkIds` record confirmed work IDs, `requiresWorkVerification` flags mixed or incompletely audited profiles, and `discover: false` enables coauthor recognition without fetching that person's complete publication list. See [Publication policy](PUBLICATION_POLICY.md).

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
