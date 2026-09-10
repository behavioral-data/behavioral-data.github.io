# Awards and news review — September 9, 2026

Issue: [#24](https://github.com/behavioral-data/behavioral-data.github.io/issues/24).

The [expanded awards audit](AWARDS_AUDIT.md) covers all 26 people and 66 site publications, with 109 additional candidates and source-access gaps. The maintainer excluded 35 candidates and approved applying the remaining verified honors. The website now includes 59 additional honors (69 total); 15 unresolved records remain deferred. The ten initial records below remain included, with Yasaman’s GLOBEM recipient link corrected.

The homepage combines recent people honors plus Ashish’s ACM and William Chan dissertation awards, the latest news item and two awarded papers. The 2026 news item records Jina’s return as a principal researcher. The Ken/xAI news item was removed at the maintainer’s request. Year ranges are preserved where the award source specifies a tenure or academic year.

## Paper awards

| Year | Paper | Award | Evidence |
| --- | --- | --- | --- |
| 2025 | Perceptions of Moderators as a Large-Scale Measure of Online Community Governance | Best Paper Honorable Mention, CSCW | [ACM CSCW announcement](https://medium.com/acm-cscw/announcing-the-best-of-cscw-2025-a95517e67ba3), under Honorable Mentions; also in [Galen's May 2026 CV](https://static1.squarespace.com/static/59c1330ae9bfdfe92e1c9bb9/t/69f8e3ae1d22812fb8de21b4/1777918894553/galen_weld_cv_for_web_may_2026.pdf). |
| 2025 | Reddit Rules and Rulers | Best Paper Award, ICWSM | [UW announcement](https://news.cs.washington.edu/2025/09/10/allen-school-researchers-receive-icwsm-best-paper-award-for-analyzing-reddit-rules/). |
| 2023 | Cognitive Reframing of Negative Thoughts through Human-Language Model Interaction | Outstanding Paper Award, ACL | [Official award list](https://2023.aclweb.org/program/best_papers/), under Outstanding Papers. |
| 2023 | GLOBEM: Cross-Dataset Generalization of Longitudinal Human Behavior Modeling | Distinguished Paper Award, UbiComp / IMWUT | [Official award list](https://www.ubicomp.org/ubicomp-iswc-2023/awards/ubicomp-iswc-2023-awards/), IMWUT DPA #8. This is the modeling paper, not the NeurIPS dataset paper. |
| 2021 | Political Bias and Factualness in News Sharing across more than 100,000 Online Communities | Outstanding Paper (Analysis), ICWSM | [Official list](https://icwsm.org/awards/) places this under Outstanding Papers; [Galen's publication list](https://galenweld.com/publications) identifies the Analysis category. |
| 2021 | The Effect of Moderation on Online Mental Health Conversations | Outstanding Paper (Study Design), ICWSM | [Official list](https://icwsm.org/awards/) places this under Outstanding Papers; [Tim's CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf) and the imported award identify Study Design. |
| 2021 | Leveraging Community and Author Context to Explain the Performance and Bias of Text-Based Deception Detection Models | Best Paper Award, NLP4IF at NAACL | [PNNL announcement](https://www.pnnl.gov/news-media/pnnl-team-wins-best-paper-two-conferences). This resolves the missing fourth award in the existing 2021 news item. |
| 2021 | Towards Facilitating Empathic Conversations in Online Mental Health Support | Best Paper Award, The Web Conference | [Organizers' conference report](https://sigir.org/wp-content/uploads/2021/09/p13.pdf). The imported “single award across all 1736 submissions” wording remains in `legacy.award`, corroborated by Tim's CV. |

The two 2021 ICWSM labels are corrected to Outstanding Paper, preserving the Analysis/Study Design distinctions. The conference lists a separate overall Best Paper winner. All three original award strings remain verbatim in publication `legacy.award`; top-level duplicate strings are cleared so shared records supply the rendered labels.

## Individual honors

| Year | Recipient | Honor | Evidence |
| --- | --- | --- | --- |
| 2022 | Tim Althoff | NSF CAREER Award | [UW announcement](https://news.cs.washington.edu/2023/06/30/super-8-how-the-allen-schools-nsf-career-award-winning-faculty-are-reimagining-the-future-of-computing/) verifies the award. [Tim's CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf) dates award IIS-2142794 to 2022; the announcement's 2023 publication date is not used as the award year. |
| 2019 | Tim Althoff | ACM SIGKDD Doctoral Dissertation Award | [Awarding organization's winner record](https://www.kdd.org/awards/view/2019-sigkdd-dissertation-award-winners). |

Individual honors have no publication links and do not enter the homepage highlights. Paper records link to lab recipients and to the publication, whose author list credits all coauthors; the lab profile links are not a complete list of external recipients.

## Highlights and news

The maintainer requested the latest award-winning papers for highlights. The homepage now selects two papers from verified shared award links, ordered by publication year descending and then title alphabetically. Multiple awards occupy one slot. Honorable mentions and outstanding/distinguished paper awards qualify. This initial set selects **Perceptions of Moderators** and **Reddit Rules and Rulers**, both 2025.

Imported `highlight` flags remain historical metadata. Existing titles and author text are reused; no new descriptions or artwork have been invented. Missing illustrations no longer produce empty year tiles.

All three imported news headlines and dates are preserved. The 2021 four-award announcement now links to the four shared records; these relationships also connect it to the relevant paper and member pages. Its original “Best Paper” umbrella wording remains unchanged even though the two ICWSM records now use the conference's more precise category. No duplicate announcements or newly written news prose were added. The News page already renders the shared awards below the news archive.

Award dates are stored as `YYYY`, per the maintainer's precision preference. Full dates remain supported for events with known days. Review timestamps and operational deadlines still require exact dates.

## Remaining review

- Review and approve this initial backfill before considering #24 complete or publishing these changes.
- Decide whether to include additional service, teaching, fellowship, and team honors. For example, [UW verifies the 2024 CREATE Accessible Data Science and STEM Lecture Team award](https://www.washington.edu/accesstech/get-involved/events/awards/2024-digital-accessibility-awards/). Tim's CV lists it, but the team should be credited as the recipient rather than presenting Tim as its sole recipient. It has not been added in this pass.
- Tim's CV lists a spotlight for “Are Language Models Actually Useful for Time Series Forecasting?” A spotlight presentation is not automatically a paper award; it is omitted. The CV also has a year discrepancy for this entry. Do not infer an award or alter the verified NeurIPS 2024 publication year from that claim.
- Other member honors and new lab announcements remain open for a subsequent focused review. New announcement prose requires approval; the existing archive is not represented as a complete news history.

## Validation

`npm run check` passed: formatting, 20 JavaScript tests, 37 Python tests, content/maintenance validation, production build, and 106 exported-page checks. The export check exposed and helped fix a heading-level gap on the formerly empty Awards page. All 10 award source links were checked on their linked profiles and papers, and all four 2021 news links were checked. The homepage highlights and Awards page were visually inspected in the local browser.
