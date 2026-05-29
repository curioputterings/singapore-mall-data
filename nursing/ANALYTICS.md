<link rel="stylesheet" href="./assets/charts.css">

# Nursing-Room Facilities — Analytics

_Derived analytics on top of [`data/nursing_rooms_summary.json`](./data/nursing_rooms_summary.json), joined to mall-level store data from the [shopping pipeline](../shopping/). 45 of 57 nursing-data malls join to the store registry; only those are charted here._

← [back to nursing](./) · [back to the index](../)

## 1. Normalised provision — rooms per shop, not raw counts

Raw room counts favour big malls. Per-shop normalisation shows which malls actually punch above their weight on baby-care provision. The second column on the right shows how many of each mall's retail floors have at least one room.

<div id="provision-table" class="chart-wrap"></div>

## 2. Floor-coverage gap

For each mall where we have both nursing-room and store-level data, the share of retail floors that have at least one nursing room. Red = under 30% of floors covered (a parent may have to change floors); green = 60%+.

<div id="floor-coverage" class="chart-wrap"></div>

## 3. Family-friendly composite — top 25

A simple ranking that mixes four signals a parent might care about when picking a mall, each capped so a single outlier doesn't dominate:

- **Nursing rooms** — total rooms, capped at 10
- **Kids stores** — shops in the Kids & Children scope, capped at 12
- **Halal F&B share** — share of F&B that's halal-certified, capped at 50%
- **Supermarket on-site** — FairPrice / Cold Storage / Don Don Donki etc. present

Each component scales 0–1; the composite is just the sum (so 4.0 is the theoretical max). Hover a bar for the underlying numbers.

<div id="family-score" class="chart-wrap"></div>

_Methodology note — this is intentionally a thin ranking, not a recommendation. Real "family-friendly" judgement depends on stroller access, playground proximity, breastfeeding-friendly seating, change-table location etc. — none of which we can scrape. Treat this as a first-pass shortlist, not a verdict._

## 4. By owner group — what the dataset shows at the portfolio level

The per-mall figures above, rolled up to the owner level. This is **a view of what's catalogued in the dataset**, not a comparison or ranking of operators against each other. Owners are shown if they have ≥2 malls with any nursing-room data in the catalogue.

> **Please read this section as a description of the dataset, not of the operators.** Low numbers in any column typically reflect what's discoverable through public digital channels at the time of our snapshot — not the underlying facilities. Several columns (e.g. "% with operator-published data online") depend on the operator's own website surfacing the information, which varies for many reasons unrelated to room quality.

<div id="operator-league" class="chart-wrap"></div>

_The Mappedin walking-distance column shows values only where the mall embeds the Mappedin wayfinder with a publicly accessible API. Many other operators run perfectly good wayfinders we simply can't read coordinates from (different vendor, native app only, etc.) — so a blank here is not a comment on the mall._

## 5. Information availability — capacity

A small note on data completeness rather than facility quality. The summary already shows that 9 of 57 malls publish nursing-room **capacity** on their public website or app. The remaining 48 may well display capacity on physical signage at the room itself — we just can't see it through digital channels, so we record it as `null` rather than guess.

<div id="capacity-pie" class="chart-wrap"></div>

_If you're an operator and would like to flag that your capacity is published somewhere we missed, please get in touch — we'll update the record with a citation._

## Caveats applicable to the whole page

- **Mall-name joins** are normalised (lowercase, strip punctuation) — a couple of edge-case malls (Parkway Parade, NEX, Compass One etc.) appear in the nursing dataset via community-curated sources but are not in the shopping registry, so they're absent from charts 1–3.
- **Composite cap thresholds** (10 rooms, 12 kids stores, 50% halal share) are judgement calls — change them and the ranking shifts. Don't read too much into individual positions; the broader pattern (heartland family-mall mega-anchors at the top, downtown/Orchard malls lower) is robust to tweaking.
- **Source-confidence mixing** — the table treats operator-verified and community-curated counts identically. That's deliberate (the field already exists on every row in the underlying summary) but means a community undercount could rank a mall lower than it really should be.

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  NursingCharts.provisionTable("provision-table");
  NursingCharts.floorCoverageBars("floor-coverage");
  NursingCharts.familyFriendlyScore("family-score");
  NursingCharts.operatorLeagueTable("operator-league");
  NursingCharts.capacityDisclosure("capacity-pie");
</script>
