<link rel="stylesheet" href="./assets/charts.css">

# Mall Nursing-Room Facilities — Report

← [back to nursing](./) · [back to the index](../)

> ## ⚠️ Important — read before interpreting this report
>
> **Every number, heatmap cell, and table row here describes only what was discoverable through public digital channels** (operator websites and community blogs) at the time of our snapshot.
>
> - A mall showing **few rooms, no capacity, or no floor coverage** in our data may have **more rooms and clearer information on physical signage at the mall itself** — we just couldn't see it through digital channels.
> - "No walking-distance value" is **not a comment on the mall**; it only means the mall's online materials did not surface the coordinate data we'd need to compute one.
> - Community-curated rows (Little Day Out, babyment) are known to **undercount** by 60–90% on malls where operator data also exists; treat them as a *lower bound* of presence, not a count.
> - This report is **not an audit, ranking, or scorecard of any operator** — it is a descriptive view of an open dataset built from publicly-available sources.
>
> If you are an operator and any of this data is out of date or incomplete, please get in touch — we will update with a citation.

- **Malls with nursing-room data:** 57
- **Total nursing rooms catalogued:** 145 (141 open, 4 closed/under works)
- **Malls publishing capacity:** 9 — Alexandra Retail Centre (2), Compass One (2), Great World (1), Jewel Changi Airport (2), Ngee Ann City (4), Sengkang Grand Mall (2), Suntec City (2), The Clementi Mall (3), The Seletar Mall (2)
- **Malls with real distance-to-entrance:** 9 (where coordinate data was publicly available)
- **Source split:** 32 operator-sourced (official) · 25 community-curated (Little Day Out, gap-fill only)

## Was a physical map / floor plan obtained?

**Partly — yes for the 9 malls that publish coordinate data online.** For those malls each nursing room and each mall entrance is positioned on its floor, the walkway graph between them is known, and lift/escalator links are recorded — enabling us to compute the **real horizontal walking distance** from each nursing room to the nearest mall entrance.

For malls **without** a scrapable coordinate layer (e.g. CapitaLand, whose concierge pages list rooms textually), distance in metres can't be computed; we fall back to rooms-per-floor, the nearest-unit text anchor, and a **vertical** floor-distance proxy from store `level` data.

## Rooms per floor — every mall in one heatmap

Each row is a mall, each column a floor (B2…L8). Darker = more rooms on that floor. Hover for exact counts.

<div id="rooms-heatmap" class="chart-wrap"></div>

## Coordinate-enabled malls — walking distance to nearest entrance

Bubble size = total rooms in the mall. Diagonal = worst-case ≈ average; high-Y = uneven (a few rooms are far from the door).

<div id="walking-scatter" class="chart-wrap"></div>

## Per-mall summary — sortable

Click any column to sort; type to filter. Source colour: official (green) · mixed (yellow) · community-curated (red).

<div id="facilities-table" class="chart-wrap"></div>

## Distance-to-entrance: method & coverage

For the **9 coordinate-enabled malls**, distance is the real horizontal walking distance from each nursing room to the nearest mall entrance, computed over the mall's own walkway graph (same-floor edges weighted in metres; lift/escalator transfers free). Across these malls the per-mall average ranges 25–113 m.

For malls without a scrapable coordinate layer (CapitaLand et al.), true metres can't be computed; the `nearest_unit` text anchor and the vertical floor-distance proxy are the best available.

## Community-curated sources

The 25 community-curated rows come from:

- **littledayout** — per-mall blog articles, dated 2020-2024. Cross-validation against operator-truth malls showed consistent **60–90% undercounting**, so treat counts as a *lower bound* of floor presence.
- **babyment** — structured nursing-room directory. **Publishes no last-modified date on any page; freshness unknown.** Each record cites the per-room babyment URL.

Per-row citations and source-modified dates are available in [`data/nursing_rooms.json`](./data/nursing_rooms.json) (the raw per-room records) and [`data/nursing_rooms_summary.json`](./data/nursing_rooms_summary.json) (the per-mall aggregates this page renders).

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  NursingCharts.roomsHeatmap("rooms-heatmap");
  NursingCharts.walkingDistanceScatter("walking-scatter");
  NursingCharts.facilitiesTable("facilities-table");
</script>
