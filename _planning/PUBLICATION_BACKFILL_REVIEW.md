# Publication backfill review — September 9, 2026

Issue #23. First historical backfill pass, using the saved September 5 queue and primary-source checks on September 9. No new collection was run. The maintainer approved the five proposed additions plus Margaret’s two papers, using a verified journal record where available and otherwise the preprint. All seven decisions are recorded in `maintenance/review.json`; the changes are local and have not been deployed.

## Scope and triage

- Site baseline: 59 publications, including the 12 additions from the first reviewed batch.
- Queue before this pass: 390 source records, 322 canonical candidates; 11 accepted, 310 pending, one rejected, plus one accepted manual supplement.
- Of the 46 pending membership-review candidates, four have direct existing-site targets, 27 have possible existing-site matches, and 15 have neither. These are candidate classifications, not 46 missing papers.
- This pass accepts seven distinct additions from the 15 unmatched candidates and groups one further preprint under its accepted final paper. The site now has 66 publications. The queue retains all 390 source records: 321 canonical candidates, 18 accepted, 302 pending and one rejected, plus the accepted manual supplement. Of the pending canonical candidates, 38 need membership review and 264 do not meet the screening rule. Complete coverage remains unverified.
- Use inclusive year boundaries from `maintenance/membership-evidence.json`. Screening still reads exact-date memberships from people records, so its current labels remain unresolved until the separate year-support work or a documented reviewer decision.

## Accepted additions

| # | Paper | Year | Venue | Qualifying lab authors |
| --- | --- | --- | --- | --- |
| 1 | [Are Language Models Actually Useful for Time Series Forecasting?](https://proceedings.neurips.cc/paper_files/paper/2024/hash/6ed5bf446f59e2c6646d23058c86424b-Abstract-Conference.html) | 2024 | NeurIPS | Mike Merrill, Vinayak Gupta, Tim Althoff |
| 2 | [Rethinking technology innovation for mental health: framework for multi-sectoral collaboration](https://www.nature.com/articles/s44220-024-00232-2) | 2024 | Nature Mental Health | Ashish Sharma, Tim Althoff |
| 3 | [Cognitive Reframing of Negative Thoughts through Human-Language Model Interaction](https://aclanthology.org/2023.acl-long.555/) | 2023 | ACL | Ashish Sharma, Inna Lin, Tim Althoff |
| 4 | [CORAL: COde RepresentAtion learning with weakly-supervised transformers for analyzing data analysis](https://link.springer.com/article/10.1140/epjds/s13688-022-00327-9) | 2022 | EPJ Data Science | Mike Merrill, Tim Althoff |
| 5 | [Leveraging Community and Author Context to Explain the Performance and Bias of Text-Based Deception Detection Models](https://aclanthology.org/2021.nlp4if-1.5/) | 2021 | NLP4IF | Galen Weld, Tim Althoff |
| 6 | [Branch-Train-Merge](https://arxiv.org/abs/2208.03306) | 2022 | arXiv preprint | Margaret Li, Tim Althoff |
| 7 | [Scaling Expert Language Models](https://arxiv.org/abs/2303.14177) | 2023 | arXiv preprint | Margaret Li, Tim Althoff |

### 1. Are Language Models Actually Useful for Time Series Forecasting?

- Candidate: `openalex-w4415797292`; accepted target: new record with the same ID.
- Metadata: 2024; `NeurIPS`; type `conference`; status `published`; DOI `10.52202/079017-1922`.
- Ordered authors: Mingtian Tan; Mike A. Merrill; Vinayak Gupta; Tim Althoff; Thomas Hartvigsen.
- Primary source: https://proceedings.neurips.cc/paper_files/paper/2024/hash/6ed5bf446f59e2c6646d23058c86424b-Abstract-Conference.html
- Review finding: Mike’s 2019–2024 membership covers 2024. The proceedings confirm all five authors and DOI. Vinayak Gupta is also an author and has a supported 2023–2024 lab interval; his work-specific provider identity was verified against his CV and the proceedings, and his internal author link was added. The two existing forecasting source records were rematched from the saved raw OpenAlex works with the new identity; their bibliographic observations remain unchanged. Use the final conference record, not its grouped preprint.
- Code link from the proceedings: https://github.com/BennyTMT/LLMsForTimeSeries.

### 2. Rethinking technology innovation for mental health: framework for multi-sectoral collaboration

- Candidate: `openalex-w4396615168`; accepted target: new record with the same ID.
- Metadata: 2024; `Nature Mental Health`; type `article`; status `published`; DOI `10.1038/s44220-024-00232-2`.
- Ordered authors: Jina Suh; Sachin R. Pendse; Robert Lewis; Esther Howe; Koustuv Saha; Ebele Okoli; Judith Amores; Gonzalo Ramos; Jenny Shen; Judith Borghouts; Ashish Sharma; Paola Pedrelli; Liz Friedman; Charmain Jackman; Yusra Benhalim; Desmond C. Ong; Sameer Segal; Tim Althoff; Mary Czerwinski.
- Primary source: https://www.nature.com/articles/s44220-024-00232-2
- Review finding: Ashish’s 2019–2024 membership covers 2024. The publisher lists Ashish and Tim at UW. Jina is also an author, but her MSR-period authorship is not needed to meet the lab threshold; preserve her in the complete author list.

### 3. Cognitive Reframing of Negative Thoughts through Human-Language Model Interaction

- Candidate: `openalex-w4385572158`; accepted target: new record with the same ID.
- Metadata: 2023; `ACL`; type `conference`; status `published`; DOI `10.18653/v1/2023.acl-long.555`.
- Ordered authors: Ashish Sharma; Kevin Rushton; Inna Wanyin Lin; David Wadden; Khendra G. Lucas; Adam S. Miner; Theresa Nguyen; Tim Althoff.
- Primary source: https://aclanthology.org/2023.acl-long.555/
- Review finding: The final ACL paper confirms Ashish, Inna and Tim at UW, within their recorded membership years. Corrected the missing venue and source type “other”. The PDF supplies Khendra G. Lucas’s full name. Grouped the 2023 preprint `openalex-w4372272612` with this final record using a verified duplicate group. The arXiv page explicitly identifies ACL 2023 acceptance and the PDF confirms the complete author list.
- Author-name authority: https://aclanthology.org/2023.acl-long.555.pdf (p. 1); code/data link in paper: https://github.com/behavioral-data/Cognitive-Reframing.

### 4. CORAL: COde RepresentAtion learning with weakly-supervised transformers for analyzing data analysis

- Candidate: `openalex-w3082736604`; accepted target: new record with the same ID.
- Metadata: 2022; `EPJ Data Science`; type `article`; status `published`; DOI `10.1140/epjds/s13688-022-00327-9`.
- Ordered authors: Ge Zhang; Mike A. Merrill; Yang Liu; Jeffrey Heer; Tim Althoff.
- Primary source: https://link.springer.com/article/10.1140/epjds/s13688-022-00327-9
- Review finding: The publisher confirms the full author list and 2022 publication. Mike’s 2019–2024 membership covers the year. Ge Zhang is a coauthor, but no membership range is inferred for Ge. The existing queue already groups the arXiv version under this journal record.

### 5. Leveraging Community and Author Context to Explain the Performance and Bias of Text-Based Deception Detection Models

- Candidate: `openalex-w3158487127`; accepted target: new record with the same ID.
- Metadata: 2021; `NLP4IF`; type `conference`; status `published`; DOI `10.18653/v1/2021.nlp4if-1.5`.
- Ordered authors: Galen Weld; Ellyn Ayton; Tim Althoff; Maria Glenski.
- Primary source: https://aclanthology.org/2021.nlp4if-1.5/
- Review finding: The ACL Anthology and paper confirm the full author list and NLP4IF 2021 venue. Galen’s 2019–2026 membership covers the year. Corrected the missing venue and source type “other”; the queue already groups its alternate record.
- Full paper: https://aclanthology.org/2021.nlp4if-1.5.pdf.

### 6. Branch-Train-Merge: Embarrassingly Parallel Training of Expert Language Models

- Accepted candidate and site ID: `openalex-w4300886482`.
- Metadata: 2022; `arXiv`; type and status `preprint`; DOI `10.48550/arxiv.2208.03306`.
- Ordered authors: Margaret Li; Suchin Gururangan; Tim Dettmers; Mike Lewis; Tim Althoff; Noah A. Smith; Luke Zettlemoyer.
- Primary source: https://arxiv.org/abs/2208.03306
- Margaret’s 2020–present affiliation covers 2022. The arXiv page verifies authorship with Tim; corrected the provider’s inverted “Lewis, Mike” name.
- Tim’s CV lists JMLR 2025, while Margaret’s profile says under review. No journal record was verified. Per the maintainer’s decision, use the verified preprint instead of holding the paper back or inventing journal metadata. The NeurIPS 2022 INTERPOLATE workshop poster is another presentation of this work, not a second site entry.

### 7. Scaling Expert Language Models with Unsupervised Domain Discovery

- Accepted candidate and site ID: `openalex-w4361021241`.
- Metadata: 2023; `arXiv`; type and status `preprint`; DOI `10.48550/arxiv.2303.14177`.
- Ordered authors: Suchin Gururangan; Margaret Li; Mike Lewis; Weijia Shi; Tim Althoff; Noah A. Smith; Luke Zettlemoyer.
- Primary source: https://arxiv.org/abs/2303.14177
- Margaret’s 2020–present affiliation covers 2023. The arXiv page verifies authorship with Tim; corrected “Lewis, Mike” and retained all seven authors, including Weijia Shi.
- Author profiles disagree on the journal year: [Margaret’s profile](https://margs.li/) lists JMLR without a year, [Suchin’s profile](https://saching.net/) lists 2024, and [Tim’s CV](https://homes.cs.washington.edu/~althoff/docs/CV_Tim_Althoff.pdf) lists 2023. No journal record was verified, so the approved fallback is the verified preprint.

For both Margaret papers, title searches and checks of the official JMLR [2023](https://jmlr.org/papers/v24/), [2024](https://jmlr.org/papers/v25/) and [2025](https://jmlr.org/papers/v26/) indexes did not establish a journal record on September 9. This is a verification limit, not proof that a journal version does not exist. Upgrade the existing site record if a journal record is confirmed later; retain the preprint as an alternate source and do not display both.

## Remaining unmatched candidates

- **Transformer-Based Behavioral Representation Learning** (`openalex-w3177990722`): [arXiv 2021](https://arxiv.org/abs/2107.06097) confirms Mike and Tim. Relationship to the already-listed CHIL 2023 transfer-learning paper is unresolved; do not add or collapse solely on shared authors and related subject matter.
- **Special Report: Are You Ready for Generative AI in Psychiatric Practice?** (`openalex-w4403586205`): 2024 Jina/Tim work during Jina’s MSR interval; lab attribution and report eligibility need an explicit judgment.
- **Toward Tailoring Just-in-Time Adaptive Intervention Systems for Workplace Stress Reduction** (`openalex-w4400732558`, `openalex-w4402484013`): possible final/preprint pair; publication during Jina’s MSR interval. Verify relationship and historical lab attribution before adding.
- **GLOBEM** (`openalex-w4319837253`): generic provider title; inspect against the existing GLOBEM article and separate dataset. Never collapse the dataset into the article.
- **Population-Scale Study of Human Needs** (`openalex-w3114914047`): likely shortened-title version of existing `suh2020populationscale`; verify DOI and complete authors before linking.
- **Assessing the relationship between routine and schizophrenia symptoms** (`openalex-w3109432658`): Joy’s range was intentionally omitted. Leave attribution pending rather than reconstructing that range again.

## Remaining work

The subsequent [existing-publication reconciliation](PUBLICATION_RECONCILIATION_REVIEW.md) completed 24 updates and five version groups. The Population-Scale Study final record is now accepted against the existing site ID; GLOBEM’s original DOI is linked as a possible match but remains pending. The original triage below is preserved as the first-pass record.

1. Review the four direct targets and 27 possible matches for metadata corrections and final-version upgrades while preserving stable page IDs and editorial descriptions.
2. Resolve the held versions where possible, then cross-check remaining provider matches and scholarly bibliographies for missed work. The 264 other pending candidates are not automatically rejected.
3. Review highlights with the maintainer after bibliography reconciliation. The two existing homepage highlights have not changed.

## Validation

`python3 scripts/publication_pipeline.py check` passed with Node 24: formatting, 18 JavaScript tests, 37 Python tests, content/maintenance validation and the static build. The export checker verified 106 pages and their local links/assets. All 59 prior publication records remain unchanged and the 66 records have no duplicate DOIs. Browser checks confirmed both preprints on Margaret’s profile, two results under her author filter, compact preprint badges, correct detail-page links/BibTeX, and the homepage total of 66. No commit, push or deployment was performed.
