<link rel="stylesheet" href="./assets/charts.css">

# Singapore Shopping Centres & Shops — Dataset Report

_Generated 2026-05-27._

← [back to shopping](./) · [back to the index](../)

## Coverage

- **Shopping centres identified:** 87 (across 23 corporate owner groups)
- **Centres with full store listings:** 59
- **Total shops catalogued:** 8,869
- **F&B outlets:** 3,234 (36% of catalogued shops)
- **Halal-certified outlets (where flagged):** 413

## Shops by scope of business

The unified 14-category scope-of-business taxonomy applied to all 8,869 catalogued shops:

<div id="scope-bar" class="chart-wrap"></div>

## Shopping centres by corporate owner group

Total shop count is dominated by CapitaLand's portfolio; Far East's footprint is the largest by mall count.

<div id="owners-bar" class="chart-wrap"></div>

## All identified malls by planning region

<div id="region-donut" class="chart-wrap"></div>

## Catalogued malls — shop count

Every fully-listed mall, ranked by total shops. The colour scale shows F&B share — bluer means more F&B-heavy. Hover for owner / region details.

<div id="malls-shopcount" class="chart-wrap"></div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  Charts.scopeBar("scope-bar");
  Charts.ownersBar("owners-bar");
  Charts.regionDonut("region-donut");
  Charts.mallsByShopCount("malls-shopcount");
</script>
