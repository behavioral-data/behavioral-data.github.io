# Modern website tooling assessment

**Historical audit/research:** See [NEXT_STEPS.md](NEXT_STEPS.md) for the current React implementation roadmap and issue tracker. Earlier Jekyll/Astro recommendations and delivery phases below are superseded.

**Selected stack:** React + Next.js, plain CSS, JSON/Markdown content, Python maintenance helpers, and GitHub Pages. The React migration is implemented locally; automated weekly discovery and production deployment remain pending. Earlier framework comparisons below are historical research.
Research memo, September 4, 2026. Proposals only; no packages installed, site rebuilt, services connected, or hosting changed. Based on the existing feature spec, repository audit, and a dedicated research sub-agent's findings.

## Recommended direction

**Preference update:** The user prioritizes a simple, familiar stack that future lab members can maintain and has not accepted Astro. The Astro recommendation below is retained as a researched option, not a selected stack. Reassess Jekyll modernization for Git-comfortable maintainers and managed WordPress for editors who need a graphical interface. React/Next.js is an alternative if maintainers already know React, but familiarity alone does not reduce its dependency and build requirements.

Rebuild the public website with **Astro and TypeScript**, store approved people/paper/award records as schema-validated content in Git, add **Pagefind** for search, and build a separate **Python ingestion service** that proposes **one GitHub pull request per weekly review batch**. Keep GitHub Pages as the production host initially. Add a browser-based content editor only if the reviewers need it.

This replaces the old presentation stack while preserving the repository, public address, assets, citation links and editorial history. The automation service handles content collection; changing the page framework alone will not keep papers or awards current.

## Current dependencies and build environment

Verified from source:

- `Gemfile.lock`: `github-pages` 231, pinning Jekyll 3.9.5.
- Loaded Bootstrap asset: 3.3.6.
- `_includes/footer.html` loads jQuery 1.11.3 from a CDN. A separate jQuery 3.3.1 asset exists locally; it is not the footer's loaded version.
- Markdown/YAML collections and manually maintained BibTeX helpers.
- No tracked custom `.github` workflows in the audited commit.
- Host tools: Node 23.6.1, Python 3.12.4, system Ruby 2.6.10. These are local tool versions, not a claim about GitHub's deployment runtime.

For the new build, pin a supported Node LTS release with the package lockfile. Node's current release table lists 24 as LTS and 23 as end of life. Do not build on the host's default Node 23 simply because it is already installed. [Node releases](https://nodejs.org/en/about/previous-releases)

## Framework comparison

| Option | Fit for this lab | Tradeoff | Recommendation |
| --- | --- | --- | --- |
| Astro + TypeScript | Public research site with structured collections, generated profiles, papers, projects and selective interactive UI. | Templates and content references need migration; weekly review and discovery remain custom work. | Preferred rebuild. |
| Next.js | Stronger fit if the product becomes a substantial signed-in application with a custom dashboard and server-side features. | More runtime/application concerns when using server features; static export cannot provide those features by itself. | Choose only if the editorial application becomes a central requirement. |
| Modernize existing Jekyll | Retain existing templates and add search/import/review independently. | Least migration, but retains Liquid/Ruby tooling and requires deliberate theme cleanup. | Valid lower-effort alternative. |

Astro provides typed content schemas and relationships between collections. Its official migration guide covers translating Jekyll content/templates, and its deployment guide supports static output on GitHub Pages. These capabilities are a good fit for the existing Markdown/YAML source. [Content collections](https://docs.astro.build/en/guides/content-collections/), [Jekyll migration](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/), [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)

Use a maintained stable release verified at implementation time, rather than targeting an unverified newest patch. Record runtime compatibility in the project and CI configuration.

Next.js documents the features unavailable in [static export mode](https://nextjs.org/docs/pages/guides/static-exports). Jekyll remains a maintained option; the older version pinned here should not be confused with the entire framework being obsolete. [Jekyll documentation](https://jekyllrb.com/docs/github-pages/)

## Feature-to-tool mapping

| Needed capability | Proposed tool | What it supplies | What we still build/configure |
| --- | --- | --- | --- |
| Fast, responsive public pages | Astro, TypeScript, modern CSS | Page generation, components, typed data access. | Lab visual design, navigation, layout, mobile behavior. |
| People, papers, projects, awards | Astro content collections + Markdown/YAML/JSON | Schemas, validation and content references. | Lab schema, migration, author identity mapping, cross-linked views. |
| Search and filters | Pagefind | Static search index, browser UI/API, metadata facets. | Person/year/topic/venue metadata, index boundaries, result design and empty states. |
| Weekly review | GitHub PRs and required checks | Diffs, review history, branches, controlled merging. | Importer-generated batch, evidence summary, edits/rejections/defer actions, rejection memory. |
| Browser-based manual editing | Optional Decap CMS | Forms over Git content and an editorial workflow. | Authentication, content schemas and previews. Its per-entry workflow is distinct from our multi-record batch. |
| Paper discovery | OpenAlex or Semantic Scholar; Crossref; arXiv | Publication metadata, author lookup, DOI/preprint records. | Identity verification, lab-relevance policy, deduplication, version linkage and reconciliation. |
| Awards and news | Source feeds/pages plus member submissions | Raw evidence and announcements. | Selected sources, extraction, exact recipients/award category, human approval. |
| Deployment | GitHub Actions + GitHub Pages | Build and publish approved static output. | CI checks, permissions, old-route preservation, rollback, separate review previews if desired. |
| Scheduled maintenance | Actions plus independent health check, or lab-owned external scheduler | Job execution. | Source state, retries, missed-run detection, owner and notification destination. |
| Quality | Playwright + axe-core, schema checks, link checks | Browser assertions and automated accessibility checks. | Meaningful interaction tests, redirects, manual keyboard/visual review, content correctness tests. |
| Release notifications | Preserve existing IdioFID integration initially | Existing signup flow. | Verify ownership, operation and whether it should be replaced; keep addresses outside the public content repository. |

Pagefind indexes rendered HTML and ships a static search bundle, so it does not require a hosted search database. The site must emit searchable content and filter metadata correctly. [Pagefind](https://pagefind.app/)

Playwright documents axe-core integration, while noting that automated checks cannot detect every accessibility problem. Include manual keyboard navigation and responsive review. [Accessibility testing](https://playwright.dev/docs/accessibility-testing)

## Editing tools: the distinction that matters

The user has chosen a weekly batch reviewed before publication. Start with a bot-generated GitHub PR that covers the entire batch, plus a readable change summary. This aligns with the current repository and needs no separate CMS account.

Decap CMS is a candidate for convenient manual edits to people, news or opportunities. Its editorial mode creates a PR for each unpublished entry; it does not implement a weekly batch spanning multiple papers, people and awards. Keep those two paths explicit and do not promise that installing a CMS supplies the ingestion/reconciliation system. Direct saving is the default, so configure editorial mode if using Decap. [Decap editorial workflow](https://decapcms.org/docs/editorial-workflows/)

A hosted CMS becomes worthwhile if nontechnical editors need a richer shared workspace and the lab accepts another service, access configuration and possible recurring costs. It should replace the relevant editing path rather than create competing authoritative copies of publication data.

Decap's [GitHub backend](https://decapcms.org/docs/github-backend/) requires an OAuth server/service and repository push access for editors. [Keystatic GitHub mode](https://keystatic.com/docs/github-mode) is another credible Git-backed editing option, but introduces a GitHub App, secrets and collaborator access. Choose at most one editor after the pilot rather than layering several onto the same records.

## External service choices

- OpenAlex is the recommended first discovery provider. Current documentation describes a free API key with a daily usage allowance, so budget and instrument queries rather than assuming unlimited access. [Pricing](https://help.openalex.org/access/pricing/), [example costs](https://help.openalex.org/access/example-costs/)
- Crossref supports DOI metadata lookup without signup. Use it to normalize publisher records. [REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- Semantic Scholar is a secondary coverage option; verify access and rate limits when configuring it. [API](https://www.semanticscholar.org/product/api)
- Healthchecks.io is a candidate for independent detection of missed jobs; an existing lab monitor can fill the same role. [How monitoring works](https://healthchecks.io/docs/)
- Cloudflare Pages can provide branch previews if needed. Preview access must be configured deliberately, and per-file asset limits matter for existing PDFs. [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [platform limits](https://developers.cloudflare.com/pages/platform/limits/)

These services need separate setup where chosen. The recommended public site and search can remain static; recurring costs are most likely to arise from optional editing, preview, monitoring, API or AI services. Assess quotas using a real import batch before committing to paid plans.

## Hosting, previews and reliability

Keep the existing `behavioral-data.github.io` address and Git repository. GitHub Pages can host Astro output, so framework migration does not require a production hosting migration. Preserve all existing routes and PDF links with a tested migration map.

GitHub Pages production deployment and per-PR previews are separate requirements. Start with local previews or CI build artifacts; if reviewers need clickable previews for every batch, configure a preview service explicitly and check access. Public-repository branches and PR descriptions are public even when unpublished on the production website. Private submissions and reviewer notes need separate storage.

GitHub scheduled jobs can be disabled after 60 days without repository activity. Add a missed-run monitor independent of the scheduled job, or use an external lab-owned scheduler. No-content-change runs must still record health somewhere appropriate. [GitHub workflow inactivity](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows)

When implementing the bot, test automated PR checks and deployment triggers end to end. GitHub documents special behavior for events created by `GITHUB_TOKEN`, including approval requirements for some automated PR workflows. Select explicit dispatch or a suitably scoped GitHub App when needed; do not assume all generated events trigger downstream checks. [Workflow triggering](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)

## Available implementation capabilities

This workspace already has code/file editing, Git and GitHub tooling, current-web research, Python and Node runtimes, and built-in browser inspection. Additional project dependencies would be installed only during implementation.

Sites building/hosting tools are also available for deployment previews and hosted applications. Their local documentation supports static output and Cloudflare Workers-backed capabilities, with managed database/object-storage options. The current repository has no Sites hosting configuration; those capabilities are alternatives, not an existing production integration. A separate hosted editor could use such a runtime if needed, but the public site does not currently need a database.

No extra plugin is necessary to evaluate or start the rebuild. Hosted CMS access, scholarly API credentials, preview hosting, and lab-owned scheduling must be configured when selected; availability of a development tool does not imply those external accounts are connected.

## Scope of custom work

The largest custom component is the content maintenance pipeline: verified roster IDs, historical membership rules, merging preprints and final versions, field-level overrides, award evidence, suppression of rejected candidates, and a readable weekly review batch. A framework, CMS or AI service does not supply these lab-specific rules automatically.

Preserve the existing papers, photos, PDFs, verified editorial text and repository history. Replace the Bootstrap/jQuery presentation layer, modernize the build tooling, and migrate records with count/link checks. Avoid adding a database, visitor accounts, a large React application, or AI-based search until a concrete requirement justifies them.

## Proposed first implementation milestone

The framework choice remains open under the simplicity preference above; the following Astro milestone is conditional, not authorized implementation.

Build a local Astro proof of concept containing the homepage, one member profile, a searchable publication archive, one paper page, and a sample weekly review batch. Use existing content and a mock import fixture; establish that approve/reject and duplicate handling work before enabling live scheduled imports. Pin runtime/dependencies, preserve public URLs, and compare against the spec before replacing the live site.
