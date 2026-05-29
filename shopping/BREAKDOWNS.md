<link rel="stylesheet" href="./assets/charts.css">

# Singapore Mall Shops — Breakdowns

← [back to shopping](./) · [back to the index](../)

> **Please note.** Owner and region rollups are based on store directory data captured at our snapshot date. "Anchor chains" reflects how often a brand appeared across the malls in each portfolio in public directories — it is not a ranking of strategic importance, lease tenure, or revenue contribution. Operators are welcome to flag any missing or out-of-date entries; we will update with a citation.

## 1. Anchor chains per owner's portfolio

_For each owner, the brands found in the most of their fully-listed malls. CapitaLand's portfolio is anchored by Watsons (10 of 11), Frasers' by kcuts (9 of 10)._

<div id="owner-anchors" class="chart-wrap"></div>

## 2. Anchor chains per region

_Orchard belt vs Downtown vs Suburban/Heartland — the top brands by mall-presence in each region bucket._

<div id="region-anchors" class="chart-wrap"></div>

## 3. Grocery networks compared

| Parent network | Malls reached | Brands |
| --- | ---: | --- |
| DFI Retail / Dairy Farm | **34** | 7-Eleven (28), CS Fresh (8), Cold Storage (6), Jasons (3), Marketplace (1), Giant (1) |
| NTUC FairPrice (NTUC Enterprise) | **27** | FairPrice (25), Cheers (5) |
| Scarlett (budget independent) | **13** | Scarlett Supermarket (13) |
| Pan Pacific (Don Don Donki) | **13** | Don Don Donki (13) |
| Premium / independent grocers | **2** | Meidi-Ya (1), Little Farms (1) |
| Sheng Siong | **1** | Sheng Siong (1) |
| Other independents | **1** | Hao Mart (1) |

### Supermarket/grocery brands by reach

| Brand | Malls | Network |
| --- | ---: | --- |
| 7-Eleven (convenience) | 28 | DFI Retail / Dairy Farm |
| FairPrice | 25 | NTUC FairPrice (NTUC Enterprise) |
| Scarlett Supermarket | 13 | Scarlett (budget independent) |
| Don Don Donki | 13 | Pan Pacific (Don Don Donki) |
| CS Fresh | 8 | DFI Retail / Dairy Farm |
| Cold Storage | 6 | DFI Retail / Dairy Farm |
| Cheers (convenience) | 5 | NTUC FairPrice (NTUC Enterprise) |
| Jasons | 3 | DFI Retail / Dairy Farm |
| Giant | 1 | DFI Retail / Dairy Farm |
| Marketplace | 1 | DFI Retail / Dairy Farm |
| Little Farms | 1 | Premium / independent grocers |
| Sheng Siong | 1 | Sheng Siong |
| Meidi-Ya | 1 | Premium / independent grocers |
| Hao Mart | 1 | Other independents |

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  Charts.ownerAnchors("owner-anchors");
  Charts.regionAnchors("region-anchors");
</script>
