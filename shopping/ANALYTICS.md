<link rel="stylesheet" href="./assets/charts.css">

# Singapore Mall Shops — Most Common Chains

_Across 8,869 shop listings in 59 malls with full directories._

← [back to shopping](./) · [back to the index](../)

## Headline

- **Distinct brands:** 4,341 (1,440 F&B, 2,901 retail)
- **Chains in 2+ malls:** 1,279 · **single-mall brands:** 3,062
- **Most ubiquitous F&B:** Starbucks (34 malls)
- **Most ubiquitous retail:** Watsons (39 malls)

## Top 30 retail chains (by number of malls)

<div id="top-retail-bar" class="chart-wrap"></div>

## Top 30 F&B chains (by number of malls)

<div id="top-fnb-bar" class="chart-wrap"></div>

## All chains — searchable

Every chain that appears in 2+ malls. Click "n malls" in the last column to expand the mall list. Sort any column.

### Retail

<div id="top-retail-table" class="chart-wrap"></div>

### F&B

<div id="top-fnb-table" class="chart-wrap"></div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  Charts.topShopsBar("top-retail-bar", "./data/top_shops_retail.csv", "Top 30 retail chains across SG malls", "#0366d6");
  Charts.topShopsBar("top-fnb-bar",    "./data/top_shops_fnb.csv",    "Top 30 F&B chains across SG malls",    "#d62728");
  Charts.topShopsTable("top-retail-table", "./data/top_shops_retail.csv");
  Charts.topShopsTable("top-fnb-table",    "./data/top_shops_fnb.csv");
</script>
