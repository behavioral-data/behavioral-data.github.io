# Final browser and content QA

September 10, 2026. Checked the static export served at `http://127.0.0.1:3100/`, using Chrome and Playwright. This covers the September 10 completion branch; it is not a claim that these final fixes have already deployed.

## Results

- Nine representative routes at five viewport sizes: home, team, publication archive, news, awards, Join us, IdioFid, Tim’s profile, and a publication detail page. Viewports: 1280×900, 390×844, 320×800, 640×450, and 1280×600.
- All 45 route/viewport combinations had zero axe-core WCAG 2 A/AA, 2.1 A/AA, or 2.2 AA violations, no horizontal page overflow, and no browser page errors. Automated checks do not establish complete accessibility conformance.
- The custom overflow check found a clipped sidebar footer at 1280×600. The sidebar now scrolls vertically when needed. All nine routes passed the short-window recheck, and keyboard focus brings the footer link into view.
- The skip link needed an explicitly focusable destination. `main` now has `tabIndex=-1`; activating “Skip to content” with Enter moves focus to `main` without adding a normal tab stop. The export checker guards this requirement.
- At phone width, keyboard activation opens and closes Filters, the expanded state updates, hidden filters are unavailable, combined 2026/Tim filters give the expected count, an unmatched query gives the empty state, and keyboard Clear filters restores all 66 papers.
- All 22 profile publication counts match the reviewed explicit `personIds`. Unit checks cover the underlying relationship and rejection of implicit name-only attribution.
- Browser navigation verifies the empty-page redirects: Research → Publications, Pictures → Team, About website and its `.html` legacy URL → Home. Canonical URLs and visible fallback links remain in the exported aliases.
- The future-content fixture build confirms that populated Research and Pictures pages retain their records and sitemap entries instead of redirecting. Closed recruitment records use the neutral empty state.
- The static export checker verifies all 106 HTML pages, internal assets/downloads, legacy URLs, anchors, heading order, signup action, and exclusion of review/configuration files. Existing production route and metadata checks are recorded in the launch runbook.
- After restoring the longer original hero description, repeated the homepage check at all five viewport sizes. It remained readable with no overflow, clipping, browser errors, or automated accessibility violations.

## Manual follow-up to automated checks

Axe could not evaluate text over the animated SVG, some headshot-adjacent names, and decorative middle-dot separators. Inspected desktop, narrow-phone, and tablet screenshots and checked the specified text/background colors. Ordinary dark text and purple links have contrast ratios of 15.90:1 and 10.41:1 against white; muted text is 5.59:1. The hero’s 85% white overlay gives a conservative lower bound of 11.26:1 for its dark copy and 7.37:1 for its purple link even over black artwork, before the additional text shadow/fade. The low-contrast middle dot is decorative; adjacent year and venue text conveys the information.

The 640px and 320px reflow checks correspond to the available layout widths at 200% and 400% zoom from a 1280px viewport. Native browser zoom, other browser engines, screen-reader operation, and physical touch devices were not tested in this pass. Reduced-motion mode was used; the unchanged animation pause and movement behavior has separate coverage in the visual review.

## Approved content decisions

- Restore the original two-paragraph hero description at the maintainer’s request. Only correct the Allen School name and use its current HTTPS link; substantive research-description changes need Tim’s approval. The original text is retained in pre-migration `_pages/home.md`.
- Use **Past and present support** for Adobe, AI2, the Gates Foundation, Microsoft Research, NIH, NSF, and ONR (maintainer reply, September 10).
- Keep the smaller aligned sidebar and the approved **Allen School** wording.
- Keep the reviewed recruitment guidance and its existing Tim-owned review dates; no new opening was invented during QA.
- Keep empty sections out of navigation and the sitemap while preserving useful legacy destinations and the Allan Lab template credit in README.

## Deferred integration

The maintainer explicitly said to leave the IdioFid signup test. No live submission was sent, no address was stored, and endpoint ownership/delivery remain unverified. Preservation of the form action only confirms the exported form configuration.

## Repeating the checks

Run `npm run check` and `npm run test:skeleton`, serve `out/`, then repeat the viewport matrix above with an accessibility scanner. In a 600px-tall desktop window, tab to the sidebar footer and ensure it is visible. At phone width, exercise Filters and Clear filters using the keyboard. Start a new page load with Tab then Enter and verify that the skip link moves focus into the main content. Browser screenshots and machine-readable audit output from this pass are local QA artifacts, not shipped website assets.
