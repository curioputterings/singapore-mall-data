<link rel="stylesheet" href="./assets/charts.css">

# Nursing-Room Facilities — Analytics

_Derived analytics on top of [`data/nursing_rooms_summary.json`](./data/nursing_rooms_summary.json), joined to mall-level store data from the [shopping pipeline](../shopping/). 45 of 57 nursing-data malls join to the store registry; only those are charted here._

← [back to nursing](./) · [back to the index](../)

> ## ⚠️ Important — read before interpreting any chart on this page
>
> **Every number here describes only what is discoverable through public digital channels** (operator websites, public APIs, community blogs, the Mappedin wayfinder where exposed) at the time of our snapshot. It is **not a measurement of the underlying facilities**.
>
> In particular:
>
> - A mall showing **few rooms, low coverage, or no capacity** in our data may have **more rooms, better coverage, and published capacity on physical signage at the mall itself** — we simply could not see it through digital channels.
> - A column or row showing a **blank, low value, or no operator-published data online** is **not a comment on the mall, the operator, or the facility quality**. It reflects what the operator chose to publish digitally (or what their CMS / wayfinder vendor happens to expose to the public web), which varies widely for reasons unrelated to room provision.
> - None of this page is a ranking, a scorecard, an audit, or a recommendation. It is a descriptive view of an open dataset built from publicly-available sources.
>
> If you are an operator and any of this data is out of date or incomplete, please get in touch — we will update with a citation. Treat the entire page through this lens.

## 1. Normalised provision — rooms per shop, not raw counts

Raw room counts favour big malls. Per-shop normalisation makes provision visible in context. The right-hand column shows, for each mall, how many of its retail floors had at least one nursing room when we last looked online. _Reads as the dataset only — see top-of-page caveat._

<div id="provision-table" class="chart-wrap"></div>

## 2. Floor-coverage gap

For each mall where we have both nursing-room and store-level data, the share of retail floors with at least one nursing room that we could find online. Higher coloured bars = more floors covered in the data; shorter bars do **not** mean fewer rooms physically exist — only that fewer were surfaced through digital channels at the time of our snapshot. _See top-of-page caveat._

<div id="floor-coverage" class="chart-wrap"></div>

## 3. Family-friendly composite — top 25

A simple sum-of-four-signals view a parent might find useful when shortlisting malls, each capped so a single outlier doesn't dominate:

- **Nursing rooms** — total rooms in the dataset, capped at 10
- **Kids stores** — shops in the Kids & Children scope, capped at 12
- **Halal F&B share** — share of F&B that's halal-certified, capped at 50%
- **Supermarket on-site** — FairPrice / Cold Storage / Don Don Donki etc. present

Each component scales 0–1; the composite is just the sum (so 4.0 is the theoretical max). Hover a bar for the underlying numbers. _Built entirely from data discoverable online — see top-of-page caveat._

<div id="family-score" class="chart-wrap"></div>

_Methodology note — this is intentionally a thin ranking, not a recommendation. Real "family-friendly" judgement depends on stroller access, playground proximity, breastfeeding-friendly seating, change-table location and many other things — none of which we can scrape. Treat this as a first-pass shortlist drawn from public digital sources, not a verdict on any mall._

## 4. By owner group — what the dataset shows at the portfolio level

The per-mall figures above, rolled up to the owner level. This is **a view of what's catalogued in the dataset**, not a comparison or ranking of operators against each other. Owners are shown if they have ≥2 malls with any nursing-room data in the catalogue.

> **Please read this section as a description of the dataset, not of the operators.** Low numbers in any column reflect what's discoverable through public digital channels at the time of our snapshot — not the underlying facilities. The "% with operator-published data online" column in particular only measures whether we found a facility page on the operator's public website; many operators publish the same information at the mall itself or through customer-service channels we cannot scrape. _See top-of-page caveat._

<div id="operator-league" class="chart-wrap"></div>

_The Mappedin walking-distance column shows values only where the mall embeds the Mappedin wayfinder with a publicly accessible API. Many other operators run perfectly good wayfinders we simply can't read coordinates from (different vendor, native app only, no public API, etc.) — so a blank here is not a comment on the mall._

## 5. Information availability — capacity (a note, not a critique)

A small note on data completeness rather than facility quality. The summary shows that 9 of 57 malls publish nursing-room **capacity** on their public website or app. The remaining 48 may well display capacity on physical signage at the room itself — we simply can't see it through digital channels, so we record it as `null` rather than guess. **This chart is not about whether capacity exists; only about whether it was discoverable online.**

<div id="capacity-pie" class="chart-wrap"></div>

_If you're an operator and your capacity is published somewhere we missed, please get in touch — we'll update the record with a citation._

## Caveats applicable to the whole page

- **The blanket "discoverable digitally" caveat at the top of the page applies to every chart, every column, and every row below it.** Nothing here is an audit of physical facilities.
- **Mall-name joins** are normalised (lowercase, strip punctuation) — a couple of edge-case malls (Parkway Parade, NEX, Compass One etc.) appear in the nursing dataset via community-curated sources but are not in the shopping registry, so they're absent from charts 1–3.
- **Composite cap thresholds** (10 rooms, 12 kids stores, 50% halal share) are judgement calls — change them and the ranking shifts. Don't read too much into individual positions.
- **Source-confidence mixing** — the table treats operator-verified and community-curated counts identically. The field exists on every row in the underlying summary, so you can re-filter; we did not pre-filter because community sources are sometimes the only available signal.
- **No warranty** — data is provided as-is, reflecting public sources at the time of capture. Operators are welcome to contact us with corrections; we will update with citations.

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  NursingCharts.provisionTable("provision-table");
  NursingCharts.floorCoverageBars("floor-coverage");
  NursingCharts.familyFriendlyScore("family-score");
  NursingCharts.operatorLeagueTable("operator-league");
  NursingCharts.capacityDisclosure("capacity-pie");
</script>
