# Existing-publication reconciliation — September 9, 2026

Issue #23. The maintainer authorized this pass after requesting final records in preference to preprints and one entry per paper. This updates existing approved site records; no new publication pages are added. The original scope was four direct targets and 27 possible matches. The final Population-Scale Study record was also identified in the otherwise-unmatched queue.

## Decisions and evidence

Twenty-four existing entries are reconciled below. Full ordered authors, final metadata, reviewed person IDs, source URLs and decisions are recorded in `maintenance/review.json` and `content/publications.json`. All original source observations are retained. Saved raw source records were rematched for four candidates after verifying Ashish’s split identity for the CHI paper and Vinayak’s identity for the time-series paper. No new provider collection or live-sync checkpoint was made.

Membership uses the maintainer-approved inclusive years from `maintenance/membership-evidence.json`: Ashish 2019–2024, Inna 2020–present, Jina 2019–2022 and 2026–present, Galen 2019–2026, Ken 2021–2026, Mike 2019–2024, Vinayak 2023–2024, and Xinyi 2023–2025. Tim must coauthor every accepted record. These are documented human decisions because the screening model does not yet consume year-only evidence. Jina’s MSR-period authorship and Yasaman’s pre-2025 authorship are retained in complete author lists but are not used to satisfy historical lab membership.

| Existing site ID | Year / venue | Outcome |
| --- | --- | --- |
| `althoffTalklifeEngagement` | 2020 / ICWSM | Confirmed final ICWSM 2020 publication and four authors; add DOI/status/type. |
| `althoffPocketskills` | 2020 / EAI Pervasive Health | Local final PDF verifies DOI, venue and all seven authors; do not import the provider-only middle initial for Chelsey. |
| `suh2020populationscale` | 2021 / WSDM | Verified final DOI and full title, preserving the subtitle missing in the provider record. Group the preprint. |
| `sharma2020computational` | 2020 / EMNLP | Publisher verifies final EMNLP 2020 DOI; author manuscript confirms complete authors and UW affiliations. |
| `weld2022adjusting_confounders` | 2022 / ICWSM | Final ICWSM metadata and complete six-author list verified; restore Ryan A. Rossi’s middle initial. |
| `sharma2021facilitating` | 2021 / WWW | Local final WWW 2021 PDF prints DOI and confirms authors. Preserve best-paper award; do not replace with the 2022 IJCAI extended abstract. |
| `Weld_Glenski_Althoff_2021` | 2021 / ICWSM | Final ICWSM 2021 record matches all three authors; preserve award. |
| `merrill_multiverse_2021` | 2021 / KDD | Final PDF confirms full MULTIVERSE title, three authors and DOI. Discard truncated title and empty-venue proposal. |
| `weld2024making` | 2024 / ICWSM | Final ICWSM 2024 record confirms three authors, DOI and year. |
| `weld2022community_values` | 2022 / ICWSM | Final ICWSM 2022 record confirms three authors and DOI. |
| `merrillSelfsupervisedPretrainingTransfer2023` | 2023 / Conference on Health, Inference, and Learning | Final PMLR PDF confirms Mike A. Merrill and Tim Althoff, correcting the landing page’s Mika typo. Preserve publication year 2023 rather than preprint year 2022; replace anonymous draft PDF link with final paper. |
| `xu2022GLOBEM` | 2022 / NeurIPS | The NeurIPS Datasets and Benchmarks paper is published, not a preprint or the separate GLOBEM modeling article. Final PDF verifies sixteen authors; Tim and Mike qualify without counting Yasaman’s pre-lab affiliation. |
| `suhDisparateImpactsOnline2022` | 2022 / Nature Communications | Published journal record and archived publisher PDF agree on all four authors, DOI and 2022 year; add explicit article type/status. |
| `sharma2023human` | 2023 / Nature Machine Intelligence | Verified journal DOI/year and five-author manuscript; retain the existing description and highlight. |
| `Gu2022UnderstandingAS` | 2023 / CHI | Camera-ready paper verifies 2023 CHI venue, DOI and three authors; stable legacy ID retains 2022 in its name. |
| `lin-etal-2022-gendered` | 2022 / EMNLP | Final PDF verifies all seven authors including Inna Wanyin Lin; add final DOI/type/status. |
| `sharma2024facilitating` | 2024 / CHI | Camera-ready PDF prints the final CHI DOI. Restore full Inna name, retain five authors and group preprint. Ashish’s split provider identity is work-verified. |
| `sharma2024computational` | 2024 / arXiv | No final publication record verified; retain 2024 preprint, complete four-author list and arXiv identifier. Equal contribution remains documented in the paper. |
| `zhou2024correcting` | 2024 / arXiv | No final publication record verified; retain initial 2024 preprint year rather than the 2026 revision year. Correct Amy X. Zhang’s full name. |
| `merrill2024language` | 2024 / Findings of EMNLP | Final Findings paper verifies five authors, including Thomas Hartvigsen and Vinayak Gupta; correct venue from main-conference proceedings. Group preprint. |
| `gu2024how_understand` | 2024 / CHI | Local final PDF verifies DOI, CHI 2024 and all five authors. |
| `gu2024how_analysts` | 2024 / CHI | Local final PDF verifies DOI and all five authors; use Andrew McNutt as printed in that paper. |
| `lin2024imbue` | 2024 / ACL | Final PDF verifies full names and DOI. Group preprint. Jina is retained in full authorship, but MSR-period authorship is not counted as lab membership. |
| `gu2024blade` | 2024 / Findings of EMNLP | Final PDF confirms sixteen authors; restore ten missing coauthors and group preprint. Add official final PDF and project code. |

## Per-paper sources

### Engagement Patterns of Peer-to-Peer Interactions on Mental Health Platforms

Candidate: `openalex-w3015278215` → existing `althoffTalklifeEngagement`. Reviewed lab authors: ashishsharma, timalthoff.

- https://ojs.aaai.org/index.php/ICWSM/article/view/7328
- https://behavioral-data.github.io/resources/pubpdfs/althoffTalklifeEngagement.pdf

### Data-Driven Implications for Translating Evidence-Based Psychotherapies into Technology-Delivered Interventions

Candidate: `openalex-w3016071931` → existing `althoffPocketskills`. Reviewed lab authors: jinasuh, timalthoff.

- https://doi.org/10.1145/3421937.3421975
- https://behavioral-data.github.io/resources/pubpdfs/althoffPocketskills.pdf

### Population-Scale Study of Human Needs During the COVID-19 Pandemic: Analysis and Implications

Candidate: `openalex-w3114914047` → existing `suh2020populationscale`. Reviewed lab authors: jinasuh, timalthoff.

- https://doi.org/10.1145/3437963.3441788
- https://behavioral-data.github.io/resources/pubpdfs/suh2020populationscale.pdf
- https://erichorvitz.com/Human_needs_pandemic_WSDM.pdf

### A Computational Approach to Understanding Empathy Expressed in Text-Based Mental Health Support

Candidate: `openalex-w3084867291` → existing `sharma2020computational`. Reviewed lab authors: ashishsharma, timalthoff.

- https://aclanthology.org/2020.emnlp-main.425/
- https://behavioral-data.github.io/resources/pubpdfs/sharma2020computational.pdf
- https://aclanthology.org/2020.emnlp-main.425.pdf

### Adjusting for Confounders with Text: Challenges and an Empirical Evaluation Framework for Causal Inference

Candidate: `openalex-w3088597222` → existing `weld2022adjusting_confounders`. Reviewed lab authors: galenweld, timalthoff.

- https://ojs.aaai.org/index.php/ICWSM/article/view/19362
- https://behavioral-data.github.io/resources/pubpdfs/weld2022adjusting_confounders.pdf

### Towards Facilitating Empathic Conversations in Online Mental Health Support: A Reinforcement Learning Approach

Candidate: `openalex-w3125287435` → existing `sharma2021facilitating`. Reviewed lab authors: ashishsharma, innalin, timalthoff.

- https://doi.org/10.1145/3442381.3450097
- https://behavioral-data.github.io/resources/pubpdfs/sharma2021facilitating.pdf

### Political Bias and Factualness in News Sharing across more than 100,000 Online Communities

Candidate: `openalex-w3131477973` → existing `Weld_Glenski_Althoff_2021`. Reviewed lab authors: galenweld, timalthoff.

- https://ojs.aaai.org/index.php/ICWSM/article/view/18104
- https://behavioral-data.github.io/resources/pubpdfs/Weld_Glenski_Althoff_2021.pdf

### MULTIVERSE: Mining Collective Data Science Knowledge from Code on the Web to Suggest Alternative Analysis Approaches

Candidate: `openalex-w3167036993` → existing `merrill_multiverse_2021`. Reviewed lab authors: mikemerrill, timalthoff.

- https://doi.org/10.1145/3447548.3467455
- https://behavioral-data.github.io/resources/pubpdfs/merrill_multiverse_2021.pdf

### Making Online Communities ‘Better’: A Taxonomy of Community Values on Reddit

Candidate: `openalex-w3199811133` → existing `weld2024making`. Reviewed lab authors: galenweld, timalthoff.

- https://ojs.aaai.org/index.php/ICWSM/article/view/31413
- https://behavioral-data.github.io/resources/pubpdfs/weldMakingOnlineCommunities2024.pdf

### What Makes Online Communities ‘Better’? Measuring Values, Consensus, and Conflict across Thousands of Subreddits

Candidate: `openalex-w3213416073` → existing `weld2022community_values`. Reviewed lab authors: galenweld, timalthoff.

- https://ojs.aaai.org/index.php/ICWSM/article/view/19363
- https://behavioral-data.github.io/resources/pubpdfs/weld2022community_values.pdf

### Self-supervised Pretraining and Transfer Learning Enable Flu and COVID-19 Predictions in Small Mobile Sensing Datasets

Candidate: `openalex-w4281786927` → existing `merrillSelfsupervisedPretrainingTransfer2023`. Reviewed lab authors: mikemerrill, timalthoff.

- https://proceedings.mlr.press/v209/merrill23a.html
- https://behavioral-data.github.io/resources/pubpdfs/merrillSelfsupervisedPretrainingTransfer2023.pdf
- https://proceedings.mlr.press/v209/merrill23a/merrill23a.pdf

### GLOBEM Dataset: Multi-Year Datasets for Longitudinal Human Behavior Modeling Generalization

Candidate: `openalex-w4308610353` → existing `xu2022GLOBEM`. Reviewed lab authors: mikemerrill, timalthoff.

- https://proceedings.neurips.cc/paper_files/paper/2022/hash/9c7e8a0821dfcb58a9a83cbd37cc8131-Abstract-Datasets_and_Benchmarks.html
- https://behavioral-data.github.io/resources/pubpdfs/xu2022GLOBEM.pdf
- https://proceedings.neurips.cc/paper_files/paper/2022/file/9c7e8a0821dfcb58a9a83cbd37cc8131-Paper-Datasets_and_Benchmarks.pdf

### Disparate impacts on online information access during the Covid-19 pandemic

Candidate: `openalex-w4309564255` → existing `suhDisparateImpactsOnline2022`. Reviewed lab authors: jinasuh, timalthoff.

- https://www.nature.com/articles/s41467-022-34592-z
- https://behavioral-data.github.io/resources/pubpdfs/suhDisparateImpactsOnline2022.pdf

### Human–AI collaboration enables more empathic conversations in text-based peer-to-peer mental health support

Candidate: `openalex-w4317757464` → existing `sharma2023human`. Reviewed lab authors: ashishsharma, innalin, timalthoff.

- https://www.nature.com/articles/s42256-022-00593-2
- https://behavioral-data.github.io/resources/pubpdfs/sharma2023human.pdf

### Understanding and Supporting Debugging Workflows in Multiverse Analysis

Candidate: `openalex-w4366547794` → existing `Gu2022UnderstandingAS`. Reviewed lab authors: kengu, timalthoff.

- https://doi.org/10.1145/3544548.3581099
- https://behavioral-data.github.io/resources/pubpdfs/Gu2022UnderstandingAS.pdf

### Gendered Mental Health Stigma in Masked Language Models

Candidate: `openalex-w4385572715` → existing `lin-etal-2022-gendered`. Reviewed lab authors: ashishsharma, innalin, timalthoff.

- https://aclanthology.org/2022.emnlp-main.139/
- https://behavioral-data.github.io/resources/pubpdfs/lin-etal-2022-gendered.pdf
- https://aclanthology.org/2022.emnlp-main.139.pdf

### Facilitating Self-Guided Mental Health Interventions Through Human-Language Model Interaction: A Case Study of Cognitive Restructuring

Candidate: `openalex-w4396832979` → existing `sharma2024facilitating`. Reviewed lab authors: ashishsharma, innalin, timalthoff.

- https://doi.org/10.1145/3613904.3642761
- https://behavioral-data.github.io/resources/pubpdfs/sharmaFacilitatingSelf-Guided2024.pdf

### A Computational Framework for Behavioral Assessment of LLM Therapists

Candidate: `openalex-w4390529402` → existing `sharma2024computational`. Reviewed lab authors: ashishsharma, innalin, timalthoff.

- https://arxiv.org/abs/2401.00820
- https://behavioral-data.github.io/resources/pubpdfs/sharma2024computational.pdf

### Correcting misinformation on social media with a large language model

Candidate: `openalex-w4392972281` → existing `zhou2024correcting`. Reviewed lab authors: ashishsharma, timalthoff, xinyizhou.

- https://arxiv.org/abs/2403.11169
- https://behavioral-data.github.io/resources/pubpdfs/zhouCorrectingMisinformation2024.pdf
- https://arxiv.org/pdf/2403.11169

### Language Models Still Struggle to Zero-shot Reason about Time Series

Candidate: `openalex-w4404782449` → existing `merrill2024language`. Reviewed lab authors: mikemerrill, timalthoff, vinayakgupta.

- https://aclanthology.org/2024.findings-emnlp.201/
- https://behavioral-data.github.io/resources/pubpdfs/merrillLanguageModelsStill2024.pdf
- https://aclanthology.org/2024.findings-emnlp.201.pdf

### How Do Analysts Understand and Verify AI-Assisted Data Analyses?

Candidate: `openalex-w4396832076` → existing `gu2024how_understand`. Reviewed lab authors: kengu, timalthoff.

- https://doi.org/10.1145/3613904.3642497
- https://behavioral-data.github.io/resources/pubpdfs/guHowDoAnalystsUnderstand2024.pdf

### How Do Data Analysts Respond to AI Assistance? A Wizard-of-Oz Study

Candidate: `openalex-w4396832182` → existing `gu2024how_analysts`. Reviewed lab authors: kengu, timalthoff.

- https://doi.org/10.1145/3613904.3641891
- https://behavioral-data.github.io/resources/pubpdfs/guHowDoDataAnalysts2024.pdf

### IMBUE: Improving Interpersonal Effectiveness through Simulation and Just-in-time Feedback with Human-Language Model Interaction

Candidate: `openalex-w4402667122` → existing `lin2024imbue`. Reviewed lab authors: ashishsharma, innalin, timalthoff.

- https://aclanthology.org/2024.acl-long.47/
- https://behavioral-data.github.io/resources/pubpdfs/linIMBUE2024.pdf
- https://aclanthology.org/2024.acl-long.47.pdf

### BLADE: Benchmarking Language Model Agents for Data-Driven Science

Candidate: `openalex-w4404781154` → existing `gu2024blade`. Reviewed lab authors: kengu, mikemerrill, timalthoff.

- https://aclanthology.org/2024.findings-emnlp.815/
- https://behavioral-data.github.io/resources/pubpdfs/guBLADEBenchmarkingLanguage2024a.pdf
- https://aclanthology.org/2024.findings-emnlp.815.pdf

## Version groups

Five verified groups link preprints to final records: Population-Scale Study (WSDM), Cognitive Restructuring (CHI), IMBUE (ACL), BLADE (Findings of EMNLP), and Language Models Still Struggle (Findings of EMNLP). The queue retains every alternate observation and its original DOI. Accepted site entries use the final metadata and preserve the arXiv identifier as an alternate link.

GLOBEM Dataset remains the NeurIPS 2022 Datasets and Benchmarks paper, with its final DOI and PDF. The separate GLOBEM modeling article and its GetMobile coverage are not merged into the dataset paper. The CHIL 2023 transfer-learning paper uses the final PMLR record and PDF rather than its 2022 preprint observation or the anonymous draft previously linked by the site. PMLR’s landing-page typo “Mika” is corrected from the PDF, which prints Mike A. Merrill.

BOLT (A Computational Framework for Behavioral Assessment of LLM Therapists) and MUSE (Correcting misinformation on social media with a large language model) have verified preprints but no verified final publication record in this pass. Both retain the original publication year 2024, complete authors and explicit preprint status/type. MUSE’s 2026 revision does not change its first-publication year.

## Cases kept pending

- `openalex-w2986671035` → existing `sefidgarpassively2020`: same DOI and paper verified by the archived final PDF. The proposed author change “E.A. Riskin” is inferior to the paper’s Eve Riskin. Yasaman’s 2019 authorship precedes the maintainer-confirmed 2025–2026 lab interval. Preserve the existing approved paper without accepting a new historical attribution exception. Source: https://behavioral-data.github.io/resources/pubpdfs/sefidgarpassively2020.pdf.
- `openalex-w4285605790`: the [IJCAI 2022 extended abstract](https://www.ijcai.org/proceedings/2022/747) is a Sister Conferences Best Papers presentation, with a distinct DOI and five-page record. It must not replace the original full WWW 2021 paper. Separate inclusion or a presentation link remains an editorial choice; no duplicate was added.
- `openalex-w4401161039`: [GetMobile 2024](https://doi.org/10.1145/3686138.3686147) is an eight-page highlights article that cites the original 34-page IMWUT article, DOI `10.1145/3569485`. It is not a final-version upgrade of the same archive record. Yasaman’s 2024 authorship also precedes the confirmed lab interval. Preserve the existing IMWUT entry.
- `openalex-w4319837253`: the otherwise-unmatched provider title “GLOBEM” has the original IMWUT DOI `10.1145/3569485`, matching the archived PDF. Link it as a possible match for the next review, but do not apply the provider’s truncated title or infer Yasaman’s historical lab membership. The local PDF and provider also disagree on the complete author list, so this record needs further verification.

## Preservation and validation

Existing stable IDs, editorial descriptions, awards, highlights, thumbnails and legacy metadata are preserved. Historical PDF assets remain in the repository; eight links now point to verified final PDFs and MUSE links to its current arXiv PDF. No commit, push or deployment is authorized by this local review.

Validation passed with Node 24: formatting, 18 JavaScript tests, 37 Python tests, content/maintenance validation and the static build. The export checker verified 106 pages and local links/assets. Comparison against the pre-pass snapshot confirmed exactly 24 changed entries, all 66 stable IDs preserved, all editorial/legacy fields preserved, no duplicate DOIs and all 390 original source observations unchanged. DOI coverage increased from 24 to 44 records. Browser checks verified BLADE’s sixteen authors, final links and BibTeX, one search result, and readable layout. Final queue: 316 canonical items, 42 accepted, 273 pending and one rejected; nine pending items need membership/version review.

## Maintainer decision on the nine remaining cases

On September 9, the maintainer reviewed the nine remaining queue entries and said they do not need to be included. All nine candidate additions/updates are now durably rejected: `openalex-w2986671035`, `openalex-w3109432658`, `openalex-w3177990722`, `openalex-w4285605790`, `openalex-w4319837253`, `openalex-w4400732558`, `openalex-w4401161039`, `openalex-w4402484013`, and `openalex-w4403586205`. The earlier pending explanations above remain as review history. Existing site publications are unchanged; no record was deleted. Queue after this decision: 42 accepted, 264 pending, ten rejected; no pending membership-review candidates. The 264 other candidates were not part of this exclusion decision. Next planned work is issue #24, awards and news.
