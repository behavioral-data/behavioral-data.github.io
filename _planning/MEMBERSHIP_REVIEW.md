# Membership reconstruction — September 9, 2026

Issue [#22](https://github.com/behavioral-data/behavioral-data.github.io/issues/22). Reviewed all 22 structured people and the four additional alumni-only names. Using the maintainer-requested year precision, there are 21 usable timelines (16 reconstructed and five completed by the maintainer) and five intentionally omitted ranges.

The detailed evidence, source locations, competing accounts, and unresolved boundaries are recorded in [membership-evidence.json](../maintenance/membership-evidence.json). The [maintainer-confirmed roster](ROSTER_REVIEW.md) governs current/past status, even when a public CV still describes a past member as current.

## Recorded timelines

All ranges below use **year precision**, with inclusive joining and leaving years. Differences within a year do not block reconstruction. “Current” means membership confirmed in the September 5 roster. These are advising/appointment windows; an internship can precede PhD enrollment. Tim's row describes his UW faculty appointment only. Yige's joining year is an inference, identified below.

| Person | Start | End | Evidence |
| --- | --- | --- | --- |
| Advait Bhat | 2024 | Current | [Personal CV](https://advaitmb.com/cv/cv.pdf), p. 1 |
| Cheng Li | 2025 | Current | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 11 |
| Deniz Nazar | 2024 | Current | [Personal CV](https://gonzoden.github.io/files/CV_Deniz_Nazar_short.pdf), p. 1 |
| Jina Suh | 2019; 2026 | 2022; Current | Advisor CV for PhD co-advising; maintainer confirms return as Principal Researcher in 2026 |
| Inna Lin | 2020 | Current | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 11; includes summer internship |
| Margaret Li | 2020 | Current | [Personal profile](https://margs.li/), Education |
| Tim Althoff | 2019 | Current | [CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 1 |
| Ashish Sharma | 2019 | 2024 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 12; [personal CV](https://ash-shar.github.io/cv/) corroborates years |
| Bret Nestor | 2023 | 2024 | [Personal profile](https://www.cs.toronto.edu/~bretnestor/), Experience |
| Melih Yilmaz | 2020 | 2021 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 12; PhD rotation |
| Mickel Liu | 2024 | 2025 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 11; [personal CV](https://mickel-liu.github.io/files/misc/short-cv.pdf) corroborates start |
| Mike Merrill | 2019 | 2024 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 12; [personal CV](https://mikemerrill.io/resources/Mike_Merrill_CV.pdf) corroborates start |
| Remy Deshayes | 2020 | 2020 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 12; [personal profile](https://remydeshayes.github.io/) corroborates a September UW talk |
| Xinyi Zhou | 2023 | 2025 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 11 |
| Vinayak Gupta | 2023 | 2024 | [Personal CV](https://gvinayak.github.io/assets/Vinayak_Gupta_PhD.pdf) and advisor CV agree on years |
| Yige Yuan | 2026 | Current | Inferred from the [2026 appointment announcement](https://yuanyige.github.io/) and September 2026 roster confirmation |
| Galen Weld | 2019 | 2026 | Advisor CV start; maintainer-confirmed end and PhD/postdoc transition |
| Ken Gu | 2021 | 2026 | Advisor CV start; maintainer confirms PhD leave in 2026 |
| Rongwu Danny Xu | 2025 | 2026 | Advisor CV start; maintainer-confirmed end |
| Yasaman Sefidgar | 2025 | 2026 | Maintainer confirmation |
| Chris Rytting | 2023 | 2024 | [Advisor CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf), p. 12; alumni-only record |

## Maintainer-confirmed corrections

The maintainer supplied these corrections directly in chat on September 9, 2026. They take precedence over older public profiles.

- **Galen Weld:** completed the PhD in 2025, then remained as a postdoc through 2026.
- **Ken Gu:** took a break from the PhD in 2026 to start a job at xAI. This is leave, not PhD completion.
- **Rongwu Danny Xu:** lab affiliation ends in 2026.
- **Yasaman Sefidgar:** lab membership was 2025–2026.
- **Jina Suh:** worked at Microsoft Research after the PhD and returned as Principal Researcher in 2026. Her historical PhD co-advising interval (2019–2022) and returning researcher affiliation (2026–current) are recorded separately.
- **Joy He-Yueya, Jacopo Mocellin, Ethan Hsu, Ge Zhang, and Antonia Saravanou:** omit membership ranges. Their alumni listings retain names and roles without dates. Historical source claims are archival evidence only, not selected ranges.

## Date review status

No date questions remain for the selected timelines. The five intentionally omitted ranges need no further reconstruction unless requested.

## Effect on publication review

The evidence file stores `YYYY` boundaries separately from `content/people.json` and is not consumed by publication screening. The existing `memberships` field still uses exact dates. Year-level support in that checker is a separate implementation step; the evidence should be used as inclusive calendar years, without requiring month-level confirmation. Unknown departure years remain explicitly unknown rather than implying ongoing membership.

No publication decisions, author links, roles, or current/past statuses were changed. The requested alumni date ranges were removed from displayed names, with original import strings retained under `legacy.name`. Issue #22 remains open for explicit author links on the 47 legacy publications; omitted ranges need no further reconstruction unless requested. This pass does not reopen the approved initial batch.
