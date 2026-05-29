<link rel="stylesheet" href="./assets/charts.css">

# How cookie-cutter are Singapore's malls?

_Tenant-mix similarity across 59 malls with ≥15 listed brands. Brands normalised + alias-merged; similarity = Jaccard on brand sets._

← [back to shopping](./) · [back to the index](../)

- **Overall mean pairwise Jaccard:** 0.038 — two random malls share ~4% of their combined tenant set.
- **Chain-share** = fraction of a mall's brands that also appear in ≥1 other mall. High = templated; low = distinctive.

## Tenant-mix similarity heatmap

Each cell is the Jaccard similarity between two malls' brand sets. Darker = more shared brands. Hover for exact values.

<div id="similarity-heatmap" class="chart-wrap"></div>

## Chain-share by mall — sortable

Click any column to sort; type to filter. The colour wash on the chain-share column highlights heartland templates (red) vs distinctive malls (green).

<div id="cookie-table" class="chart-wrap"></div>

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

See [`mall_dendrogram.png`](./mall_dendrogram.png) and [`mall_heatmap.png`](./mall_heatmap.png) for the static clustering visuals, and [`data/mall_similarity.csv`](./data/mall_similarity.csv) for the raw matrix.

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  Charts.similarityHeatmap("similarity-heatmap");
  Charts.cookieCutterTable("cookie-table");
</script>
