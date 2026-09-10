# Explicit publication attribution review — September 10, 2026

Issue #22. All 66 approved papers now have explicit profile links; 23 imported records previously relied on name matching. These changes record authorship without reconsidering archive inclusion or the nine rejected candidate updates. The new-candidate requirement (Tim plus another lab author) does not retroactively remove grandfathered papers.

The stored paper title pages were checked against the existing author lists and verified roster identities. Mike’s Homekit2020 authorship is also confirmed on [his bibliography](https://mikemerrill.io/). Yasaman’s GLOBEM authorship is confirmed in the [author-hosted final paper](https://micohan.github.io/assets/pdf/GLOBEM.pdf), [her CV](https://sefyas.github.io/files/2411-YSSCV.pdf), and the [UbiComp award record](https://ubicomp.hosting.acm.org/ubicompiswc2023_wp/awards/ubicomp-iswc-2023-awards/). The older locally stored GLOBEM PDF lacks her on the title page; the final author-hosted version supplies the evidence for the existing approved author list. That PDF/version discrepancy is recorded here; the previously rejected metadata update is not reopened.

| Existing paper ID | Explicit person IDs | Primary source |
| --- | --- | --- |
| xu2023globemimwut | yasamansefidgar, timalthoff | [Paper](https://micohan.github.io/assets/pdf/GLOBEM.pdf) |
| merrillHomekit2020BenchmarkTime2023 | mikemerrill, timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/merrillHomekit2020BenchmarkTime2023.pdf) |
| zech2023mhatsengagement | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/zech2023mhatsengagement.pdf) |
| miner2022computational | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/miner2022computational.pdf) |
| mezlini2021estimating | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/mezlini2021estimating.pdf) |
| althoff2022diet | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2022diet.pdf) |
| hicks2022leveraging | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/hicks2022leveraging.pdf) |
| althoffModeration | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoffModeration.pdf) |
| liupaths2020 | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/liupaths2020.pdf) |
| gordonactivity2019 | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/gordonactivity2019.pdf) |
| xuleveraging2019 | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/xuleveraging2019.pdf) |
| sefidgarpassively2020 | yasamansefidgar, timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/sefidgarpassively2020.pdf) |
| kurashima2018tipas | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/kurashima2018tipas.pdf) |
| althoff2018psychomotor | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2018psychomotor.pdf) |
| althoff2016onlineappendix | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2016onlineappendix.pdf) |
| shameli2017gamification | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/shameli2017gamification.pdf) |
| althoff2017large | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2017large.pdf) |
| althoff2017onlineactions | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2017onlineactions.pdf) |
| althoff2017population | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2017population.pdf) |
| althoff2016pokemon | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2016pokemon.pdf) |
| althoff2016counseling | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2016counseling.pdf) |
| althoff2015donor | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2015donor.pdf) |
| althoff2014ask | timalthoff | [Paper](https://behavioral-data.github.io/resources/pubpdfs/althoff2014ask.pdf) |

Yasaman’s 2019 and GLOBEM entries remain approved historical collaborations despite her later recorded 2025–2026 lab affiliation. Profile authorship and automatic eligibility for new additions serve different purposes. Names shared by unrelated coauthors (including other Lius, Lins, Xus, and Zhangs) are not converted into lab identities.

The screening code reads the existing `maintenance/membership-evidence.json` directly, uses inclusive joining/leaving years, preserves Jina’s 2023–2025 gap, and treats omitted or unknown intervals as requiring review. It does not infer ongoing affiliation from current roster status or a null end. Reassessment updates screening labels while preserving the original human-decision receipts, IDs, targets, and rejected/deferred state.
