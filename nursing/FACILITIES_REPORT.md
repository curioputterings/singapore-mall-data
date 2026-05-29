<link rel="stylesheet" href="./assets/charts.css">

# Mall Nursing-Room Facilities — Report

← [back to nursing](./) · [back to the index](../)

- **Malls with nursing-room data:** 57
- **Total nursing rooms catalogued:** 145 (141 open, 4 closed/under works)
- **Malls publishing capacity:** 9 — Alexandra Retail Centre (2), Compass One (2), Great World (1), Jewel Changi Airport (2), Ngee Ann City (4), Sengkang Grand Mall (2), Suntec City (2), The Clementi Mall (3), The Seletar Mall (2)
- **Malls with real distance-to-entrance:** 9 (via Mappedin wayfinder coordinates)
- **Source split:** 32 operator-sourced (official) · 25 community-curated (Little Day Out, gap-fill only)

## Was a physical map / floor plan obtained?

**Partly — yes for the malls that use the Mappedin wayfinder.** Mappedin's public API exposes the coordinate layer (each nursing room and mall entrance as an (x, y) node on a specific floor, plus the walkway graph and lift/escalator links). For those malls we compute the **real horizontal walking distance** from each nursing room to the nearest mall entrance (multi-source Dijkstra over the path network; lift/escalator transfers free).

For malls **without** a scrapable coordinate layer (e.g. CapitaLand, whose concierge pages list rooms textually), distance in metres can't be computed; we fall back to rooms-per-floor, the nearest-unit text anchor, and a **vertical** floor-distance proxy from store `level` data.

## Rooms per floor — every mall in one heatmap

Each row is a mall, each column a floor (B2…L8). Darker = more rooms on that floor. Hover for exact counts.

<div id="rooms-heatmap" class="chart-wrap"></div>

## Mappedin malls — walking distance to nearest entrance

Bubble size = total rooms in the mall. Diagonal = worst-case ≈ average; high-Y = uneven (a few rooms are far from the door).

<div id="walking-scatter" class="chart-wrap"></div>

## Per-mall summary — sortable

Click any column to sort; type to filter. Source colour: official (green) · mixed (yellow) · community-curated (red).

<div id="facilities-table" class="chart-wrap"></div>

## Distance-to-entrance: method & coverage

For the **9 Mappedin malls**, distance is the real horizontal walking distance from each nursing room to the nearest mall entrance, computed by multi-source Dijkstra over the mall's own walkway graph (same-floor edges weighted in metres via each floor's `x_scale`; lifts/escalators modelled as free vertical transfers). Across these malls the per-mall average ranges 25–113 m.

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
