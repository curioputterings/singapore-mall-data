# Nursing-Room Facilities — Data & Report

A catalogue of nursing / baby-care rooms inside Singapore malls — which floor each one sits on, capacity where the mall publishes it, and (for malls that publish coordinate data online) the real walking metres to the nearest mall entrance.

← [back to the index](../)

> **Please note.** This entire sub-site describes only what is discoverable through public digital channels at the time of our snapshot. A mall showing few rooms / no capacity in our data may have more rooms and richer info on **physical signage at the mall itself** — we just couldn't see it through digital channels. Nothing here is an audit, ranking, or scorecard of any operator. If you spot anything out of date, please get in touch — we'll update with a citation. Full terms: [Disclaimer](../DISCLAIMER.md) · [Licence (CC BY 4.0)](../LICENSE).

<a href="https://buymeacoffee.com/curioputterings" target="_blank"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>

## Reports

| Page | What it shows |
| --- | --- |
| **[Facilities Report →](./FACILITIES_REPORT.html)** | The raw catalogue — rooms-per-floor heatmap, walking-distance scatter, sortable per-mall summary. |
| **[Analytics →](./ANALYTICS.html)** | Derived views — rooms per shop, floor-coverage gap, a family-friendly composite ranking, and a note on online capacity disclosure. |

## Data

| File | Rows | Description |
| --- | ---: | --- |
| [`data/nursing_rooms.json`](./data/nursing_rooms.json) | 145 | One record per room: mall, operator, floor, location, nearest unit, status, capacity, amenities, source, source confidence, source-last-modified |
| [`data/nursing_rooms_mappedin.json`](./data/nursing_rooms_mappedin.json) | 46 | Rooms from coordinate-enabled malls (Frasers and others) with (x, y) positions + walking distance to nearest entrance |
| [`data/nursing_rooms_summary.json`](./data/nursing_rooms_summary.json) | 57 | Per-mall aggregates: rooms per floor, capacity, walking + vertical distance, source confidence |

## Sources & confidence

Every record is tagged `source_confidence`:

- **official** — taken from the operator's own publicly-published facility page or coordinate data
- **community-curated** — Little Day Out blog articles and babyment.com directory, used **only** to gap-fill malls with no operator-side facility page. Cited per row with URL and `dateModified` (babyment publishes no date — recorded as `null`). Cross-validation shows community sources undercount by 60–90% on malls where operator data also exists, so treat their counts as a *lower bound* of floor presence.

## Distance to nearest entrance — two methods

**Coordinate-enabled malls** (Frasers and others that publish per-floor coordinate data online): each nursing room and each mall entrance is positioned on its floor, with a walkway graph linking them and lift/escalator transfers recorded. We use that graph to compute the **real horizontal walking distance** from each room to the nearest entrance (same-floor edges in metres; vertical transfers free).

**Everyone else** (CapitaLand concierge pages list rooms textually with no coordinates): real metres can't be computed. We fall back to a **vertical** floor-distance proxy — for each retail floor (taken from `shopping/data/stores.json`), the number of floors to the nearest floor that has an open nursing room. Defensible accessibility proxy, not a true distance.

## Coverage

- **27 malls / 90+ rooms** with floor-level data
- Coordinate-enabled coverage adds exact walking distance for the Frasers portfolio and other malls that publish per-floor coordinate data
- Malls that confirm the amenity but publish no floor (Jewel, Mandarin Gallery, MBS, Suntec, Link REIT, Lendlease SPAs) are recorded as not-covered rather than guessed

## Snapshot date

Snapshot dated **2026-05-27**. Tenant mixes change frequently; nursing-room counts are more stable but capacity and exact locations should be re-verified before relying on them operationally.

## Support
If this dataset is useful to you, you can support continued maintenance: [Buy me a coffee ☕](https://buymeacoffee.com/curioputterings).
