# Visual layout review — September 9, 2026

Review of the rendered site at commit `2ade94e`: Home, Team, Publications, News and Join us at 1280×900 and 390×900, plus the homepage member grid at 842px. This is a fresh heuristic review of the current design; it does not change the implementation. Working assumption: visitors primarily want to understand the research, identify the people, find papers, or explore opportunities.

The review uses scale, hierarchy, balance, contrast and proximity as described by [Nielsen Norman Group](https://www.nngroup.com/articles/principles-visual-design/). Recommendations below are judgments based on this site's screenshots and measurements, not findings from a user study. Local screenshots and measurements are in `_review/visual-review/` (ignored by Git).

The restrained purple palette, clear text, compact homepage member grid and spacing-based section separation work well. All eight current members remain visible with names and roles. None of the ten page/viewport combinations showed horizontal overflow. The biggest opportunities concern information priority and scanning, especially on phones.

| Order | Recommendation | Principle | Impact / effort |
| --- | --- | --- | --- |
| 1 | Shorten and update the homepage introduction | Hierarchy and information priority | High / small, needs editorial review |
| 2 | Make mobile publication filters expandable | Progressive disclosure | High / medium |
| 3 | Give News and Awards distinct archive views | Grouping and navigation | High / small–medium |
| 4 | Establish a consistent heading scale | Scale and visual hierarchy | Medium / small |
| 5 | Group people honors by recipient | Proximity and scanning | Medium / medium |
| 6 | Shorten displayed venue labels | Signal-to-noise ratio | Medium / small, verify labels |
| 7 | Strengthen mobile navigation and secondary links | Legibility and target size | Medium / small |
| 8 | Refine portrait framing and recruitment action alignment | Consistency and balance | Low / small |

**1. Bring the lab's identity into focus sooner.** The 84-word introduction fills most of the first phone screen; portraits only begin near the bottom of the 900px capture. It also repeats the group name and lists older research themes. Aim for one concise opening of roughly 35–50 words covering the research focus and UW affiliation, with approved detail farther down if needed. Shorten the welcome heading as part of the same editorial pass. Preserve the current order of members and highlights. Success: visitors can understand the lab and see the start of the member grid within the first phone screen without making body text smaller. Evidence: `home-390.png`, `home-1280.png`.

**2. Let visitors reach publications before confronting every filter.** On the 390px capture, the filter panel occupies approximately 330px; the first paper's title begins near y=697. Keep search and the result count visible, and put the additional selectors behind an accessible “Filters” control on phones. Indicate active filters and provide a clear reset action. Desktop can retain the full control row. This changes initial presentation, not available filtering. Success: the first result appears materially earlier, and active filters remain apparent when the panel closes. Evidence: `publications-390.png`, `publications-1280.png`.

**3. Separate news chronology from the honors archive.** News currently contains four news records followed by all 69 honors. It measures about 15,400px on desktop and 18,900px on phone, including the footer. Length alone is not a defect, but two different kinds of content are being presented as one long destination. Use clear News/Awards links between the existing routes, keeping recent news on News and the full honors collection on Awards. Group the latter by year and provide year jump links; consider a recipient filter only if year grouping is insufficient. Remove redundant related-person links when the same person is already linked in the headline: Jina currently appears twice in her news entry. Preserve useful related award links on the 2021 announcement. Evidence: `news-1280.png`, `news-390.png`; implementation: `app/news/page.jsx` and `components/news-list.jsx`.

**4. Make heading sizes reflect their role consistently.** At 390px the homepage H1 is 28px while “Our Group” is 31px. Other page titles are 42px on phones and 56px on desktop. The home title can be quieter than an archive title, but a subordinate heading should not accidentally dominate it. Start with a shared scale around 32–36px for mobile page titles, 26–28px for section titles, and 18–20px for subsection/card titles. Keep the member-name scale tailored to the compact grid. Review the actual wraps before settling on values. Use a small set of spacing values alongside the scale so section gaps and within-item gaps have clear, repeatable roles. Evidence: `measurements.json`, `home-390.png`, `team-1280.png`.

**5. Make People awards read as recognition of people.** Award titles carry the strongest weight, while the recipient appears after the organization in smaller text. Ashish appears in three separate cards. Try two recipient groups: Jina and Ashish, with each award and its year listed beneath the person's name. Keep all three of Ashish's dissertation honors, including the ACM award, visible without expansion. Distinguish the recipient heading, award title and supporting organization through type weight and spacing. This is a recommendation to prototype, since the existing four-card arrangement is already approved. Success: a quick scan answers “who, what, when” and still exposes every selected honor. Evidence: `highlights-1280.png`.

**6. Reduce the visual weight of publication metadata.** Long uppercase proceedings names often span multiple lines above a title, particularly in the awarded-paper highlights. Use verified short venue names such as “CSCW” and “ICWSM” in cards, retaining full names on paper detail pages and in citation metadata. Keep the title primary, authors secondary, and the award label clearly associated with its paper. Full titles and complete author lists should remain available; there is no need to truncate the scientific record to achieve this. Evidence: `highlights-1280.png`, `publications-1280.png`.

**7. Improve mobile navigation comfort while reclaiming empty header space.** Phone navigation is 12px with link boxes about 30px high. Consider 14px labels and 40–44px hit areas, recovering the added height by reducing the generous gap between navigation and page title. Keep the navigation simple and test the five links at 320px before choosing wrapping behavior. Secondary links such as “All awards” can receive a similarly deliberate size and hit area. These are usability recommendations, not a finding that the measured navigation fails WCAG: its boxes exceed the 24px minimum. W3C also permits spacing and inline exceptions, so other links require individual evaluation. [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Evidence: `measurements.json`, `home-390.png`.

**8. Apply two smaller consistency refinements.** Keep the newly approved responsive grid. Within it, eye lines and apparent face sizes differ substantially because the source portraits use different framing. Review per-person crop positions where source resolution permits, retaining the originals and avoiding distortion. On Join us, the main buttons sit on different desktop baselines because one card has an additional guidance link. Align the primary action row and place secondary guidance consistently beneath it. The current clear primary buttons and generous mobile hit areas are worth retaining. Evidence: `members-842.png`, `team-1280.png`, `join-1280.png`, `join-390.png`.

Recommended sequence: address the homepage introduction with issue #25, then prototype the mobile publication controls and separate News/Awards navigation. Follow with the type scale and recipient grouping. Review each change independently on desktop and phone before proceeding to the next.

This pass did not perform keyboard, screen-reader, browser-zoom or comprehensive contrast testing; those remain part of issue #26. No application code, public content, or deployment was changed by this review.

## Implementation — September 9, 2026

The maintainer approved all eight recommendations. They are now implemented in the local preview:

- A shorter homepage introduction and shared page/section heading scale bring the member grid into the first phone screen.
- Publication filters collapse on phones, with search, result count, removable active filters, and reset controls visible. Desktop selectors remain visible and wrap as space decreases.
- News and Awards have separate archives with shared navigation. All 69 awards remain available, grouped by year with jump links and stable individual anchors. The redundant Jina profile link is removed from her news entry.
- People highlights group the selected honors under Jina and Ashish; all three selected Ashish honors, including ACM, remain expanded.
- Publication cards use short venue labels while detail pages and citations retain the full venue. Venue filtering and search recognize the displayed names.
- Mobile navigation has 14px labels and 44px hit areas; section links also have larger hit areas. Section and item spacing uses a shared scale without adding separators.
- Shared per-person CSS framing preserves source images and the approved responsive member grid. Recruitment primary buttons align, with guidance below.

Verification: `npm run check` passed (26 JavaScript tests, 37 Python tests, content/maintenance validation, production build and 106 exported-page link/asset checks). After final CSS/test refinements, formatting, JavaScript tests and the production build passed again. Browser checks covered seven routes at 320, 390, 658, 842, 1280 and 1600px with no horizontal overflow or page errors, including expanded filters and long active-filter labels. Keyboard activation of the filter disclosure, combined filters, individual removal, reset, empty results, venue normalization, year jumps and cross-page award anchors passed. The 390px first publication title starts at y=378 rather than approximately y=697; mobile page titles are 32px and section headings 26px. Both desktop recruitment buttons start at the same y-position.

Screenshots and interaction measurements are in `_review/visual-review/after/` (ignored). This implements the visual recommendations; the broader accessibility audit in issue #26 remains separate. Push and deployment authorized on September 10, 2026, together with restoring Rongwu Danny Xu as a current member.
