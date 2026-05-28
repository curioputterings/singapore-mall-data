# How cookie-cutter are Singapore's malls?

_Tenant-mix similarity across 59 malls with ≥15 listed brands. Brands normalised + alias-merged; similarity = Jaccard on brand sets._

## Cookie-cutter-ness

- **Overall mean pairwise Jaccard:** 0.038 — two random malls share ~4% of their combined tenant set.
- **Chain-share** = fraction of a mall's brands that also appear in ≥1 other mall. High = templated; low = distinctive.

**Most distinctive (lowest chain-share):**
| Mall | Owner | Region | Chain-share | Mean Jaccard |
| --- | --- | --- | ---: | ---: |
| Lucky Chinatown | Far East | Downtown / Central | 7% | 0.002 |
| CQ @ Clarke Quay | CapitaLand | Downtown / Central | 8% | 0.003 |
| Pacific Plaza | Far East | Orchard belt | 9% | 0.004 |
| Riverside Point | Far East | Downtown / Central | 11% | 0.004 |
| Icon Village | Far East | Downtown / Central | 16% | 0.003 |
| Mandarin Gallery | OUE | Orchard belt | 23% | 0.002 |
| Far East Square | Far East | Downtown / Central | 24% | 0.003 |
| Clarke Quay Central | Far East | Downtown / Central | 25% | 0.016 |

**Most cookie-cutter (highest chain-share):**
| Mall | Owner | Region | Chain-share | Mean Jaccard |
| --- | --- | --- | ---: | ---: |
| Junction 8 | CapitaLand | Suburban / Heartland | 89% | 0.077 |
| Lot One Shoppers' Mall | CapitaLand | Suburban / Heartland | 88% | 0.076 |
| Hougang Mall | Frasers | Suburban / Heartland | 87% | 0.068 |
| Causeway Point | Frasers | Suburban / Heartland | 86% | 0.076 |
| Waterway Point | Frasers | Suburban / Heartland | 86% | 0.084 |
| Bedok Mall | CapitaLand | Suburban / Heartland | 86% | 0.076 |
| White Sands | Frasers | Suburban / Heartland | 85% | 0.076 |
| Sengkang Grand Mall | CDL | Suburban / Heartland | 85% | 0.048 |

## Homogeneity by positioning

| Region bucket | Malls | Avg chain-share |
| --- | ---: | ---: |
| Suburban / Heartland | 34 | 69% |
| Unknown | 3 | 62% |
| Orchard belt | 10 | 49% |
| Downtown / Central | 12 | 34% |

## Does the *owner* predict the tenant cluster?

Comparing **owner** vs **region/positioning** as predictors of tenant mix:

| Predictor | Within-group sim | Between-group sim | Lift | Nearest-neighbour same-group | Cluster agreement (ARI) |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Owner** | 0.046 | 0.037 | 1.24× | 39% | -0.047 |
| **Region** | 0.057 | 0.027 | 2.12× | 59% | 0.051 |

_Within-group sim = avg Jaccard between malls sharing the label; lift = within/between. ARI: cluster the malls (avg-linkage on Jaccard distance) and score agreement with the labelling (0 = chance, 1 = perfect)._

See `mall_dendrogram.png` and `mall_heatmap.png` for the visual clustering, and `data/mall_similarity.csv` for the full matrix.

