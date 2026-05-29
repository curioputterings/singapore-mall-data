# Singapore Shopping Centres & Shops

An open dataset that identifies Singapore shopping centres, their corporate owners, geography/transit, and the shops inside them — including the main **scope of business** of each shop and whether it's **F&B**. A second, independent dataset catalogues **nursing / baby-care rooms** in those malls.

All data comes from publicly-available sources: each operator's own store-directory and mall-info pages, public REIT filings, and (where flagged on individual rows) community-curated directories. Common, widely-available techniques were used to compile it.

<a href="https://buymeacoffee.com/curioputterings" target="_blank"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>

> **Before reading any chart or table:** please see the [**Disclaimer**](./DISCLAIMER.md) and [**Licence**](./LICENSE). In short — this is a descriptive open-data snapshot of what was publicly discoverable, not an audit, ranking, or scorecard of any mall, operator, or brand. Operator corrections are welcome and updated promptly with citation.

## Browse the two projects

| | |
| :--- | :--- |
| 🛍️ **[Shopping →](./shopping/)** | 87 shopping centres · 9,158 stores · 6 analytical reports (chain ubiquity, mall similarity, cuisine mix, brand provenance, REIT financials) plus [**10 fun questions**](./shopping/FUN.md) |
| 🍼 **[Nursing-room facilities →](./nursing/)** | 145+ nursing/baby-care rooms across 57 malls · interactive [**facilities report**](./nursing/FACILITIES_REPORT.html) with rooms-per-floor heatmap + walking-distance scatter |

> **Repo layout.** Two sibling sub-projects: [`shopping/`](./shopping/) (malls + stores + REIT financials) and [`nursing/`](./nursing/) (nursing-room facilities). The published Pages site mirrors that split.
>
> **Repo contents.** This repository publishes only the data outputs and analytical reports. Compilation tooling is kept private. If you spot anything out of date, please raise an issue — corrections are welcome.

## What's published in `shopping/data/` and `nursing/data/`

| File | Rows | Description |
| --- | ---: | --- |
| `shopping/data/malls.json` / `malls.csv` | 75 | Every shopping centre: corporate owner, owner group & type, address, postal code, planning region, nearest MRT, lat/long, shop & F&B counts |
| `shopping/data/stores.json` / `stores.csv` | 4,258 | Every catalogued shop: name, mall, owner group, unit, level, scope of business, F&B flag, halal flag, description, website |
| `shopping/REPORT.md` | — | Summary: coverage, shops by scope, malls by shop count, owners |
| `shopping/data/malls_registry.json` | 73 | Owner / geo / transit registry assembled from public REIT filings before merge |
| `nursing/data/nursing_rooms.json` | 145 | One record per nursing/baby-care room: mall, floor, location, nearest unit, status, capacity, amenities, source, source_confidence, source_last_modified, and (where coordinate data was publicly available) x/y position + walking distance to nearest entrance |
| `nursing/data/nursing_rooms_mappedin.json` | 46 | Coordinate-enabled rooms (Frasers and others) with (x, y) positions + walking distance to nearest entrance |
| `nursing/data/nursing_rooms_summary.json` | 57 | Per-mall facility stats: rooms per floor, capacity, walking + vertical distance, source confidence |
| `nursing/FACILITIES_REPORT.md` | — | Nursing-room facilities report (rooms/floor, capacity, distance caveats) |
| `shopping/data/*_stores.json`, `*_malls.json` | — | Per-operator intermediate outputs |

### `stores` schema
`store_name, mall, owner_group, unit, level, scope_of_business, raw_category,
subcategory, is_fnb, is_halal, description, website, source`

`scope_of_business` is a unified 14-category taxonomy (Food & Beverage, Fashion &
Accessories, Beauty & Wellness, Services, Department/Value/Outlet, Hobbies/
Leisure/Entertainment, Health & Pharmacy, Sports & Fitness, Home & Living,
Electronics & Technology, Kids & Children, Supermarket & Convenience, Jewellery
& Watches, Books & Stationery). `raw_category` keeps the operator's original label.

## Coverage

- **86 shopping centres** identified across **22 corporate owner groups** — the
  full landscape (CICT/CapitaLand, FCT/Frasers, Far East, Mapletree/MPACT,
  Lendlease, CDL, Allgreen, Paragon REIT, UOL, Suntec REIT, Starhill, SingLand,
  Link REIT, MBS, Jewel, etc.), each with owner, address, region and transit.
- **59 centres have full shop-level listings** (8,869 shops; 3,234 F&B):
  - **CapitaLand** — 14 malls, 2,428 shops (Plaza Singapura, Raffles City,
    Westgate, IMM, Bugis Junction, Bedok Mall, Funan, Junction 8, Tampines Mall,
    Lot One, Bugis+, Aperia, CQ@Clarke Quay, Sengkang Grand)
  - **Frasers (FCT)** — 10 malls, 1,741 shops (Causeway Point, Northpoint City,
    Waterway Point, Tampines 1, Century Square, Hougang Mall, Tiong Bahru Plaza,
    White Sands, The Centrepoint, Valley Point)
  - **Far East Organization** — 15 malls, 831 shops (Orchard Central, Clarke Quay
    Central, Square 2, West Coast Plaza, One Holland Village, Katong V, HillV2,
    Junction 10, Hougang 1, Icon Village, Lucky Chinatown, Far East Square, …)
  - **Link REIT** — 3 malls, 640 shops (Jurong Point, AMK Hub, Swing By @ Thomson Plaza)
  - **ION Orchard** (CapitaLand × Sun Hung Kai JV) — 278 shops
  - **Jewel Changi Airport** (Changi Airport Group × CapitaLand) — 261 shops
  - **City Square Mall** (CDL) — 209 shops
  - **Suntec City** (Suntec REIT) — 396 shops
  - **Lendlease** — 313@somerset (138) + Jem (252) + PLQ Mall (196) = 586 shops
  - **Paragon** (Paragon REIT) — 196 shops
  - **Great World** (Allgreen) — 218 shops
  - **Wisma Atria** (Starhill Global REIT) — 100 shops
  - **The Shoppes at Marina Bay Sands** (Las Vegas Sands) — 214 shops (luxury)
  - **Mandarin Gallery** (OUE; luxury Orchard) — 77 shops
  - **Ngee Ann City / Takashimaya** (Starhill Global REIT) — 148 shops
  - **Marina Square** (SingLand) — 216 shops
  - **United Square** (UOL) — 118 shops
  - **Velocity @ Novena Square** (UOL) — 123 shops
  - **VivoCity (Mapletree)** — 378 shops
- The remaining ~40 centres are catalogued at the **registry level** (owner +
  geo + transit) but without shop lists yet — see *Extending* below.

## Data sources

All data on this site comes from publicly-available sources:

- Each mall's own public **store-directory pages** for tenant listings
- Each mall's own public **mall-info / concierge / facilities pages** for nursing-room data
- Public **REIT filings** and factsheets for the corporate-owner, geography and financials registries
- **Community-curated directories** (Little Day Out, babyment.com) used only as gap-fills for malls without operator-published facility data, cited per record

Common, widely-available techniques were used to compile the dataset. Implementation specifics are not published in this repository.

### Access policy

- We use only **publicly-discoverable** pages — the same URLs a visitor to each operator's website would see.
- We do not bypass paywalls, authentication, or any restriction that requires login. Where a site requires authentication, that operator is recorded as "not catalogued."
- Requests are made at low rates with full local caching; we do not re-fetch unnecessarily.
- **Operator opt-out is available on request** — if you are an operator and prefer your records not to be included, please open an issue at https://github.com/curioputterings/singapore-mall-data/issues or contact the maintainer. We will remove your records from the dataset promptly and document the removal.

### Nursing-room facilities (a different axis from store directories)

Store listings cover *tenants*; nursing rooms live on each mall's separate Mall-Info / Concierge / Facilities page. Coverage and detail vary widely by operator — some publish room locations as readable text; some publish them as coordinate data through their in-mall mapping service; some publish neither online. For the malls where coordinate data is publicly available, we compute the real horizontal walking distance from each nursing room to the nearest mall entrance. For the rest we record what is published (rooms per floor, nearest-unit anchor) and use a vertical floor-distance proxy. See [`nursing/FACILITIES_REPORT.md`](./nursing/FACILITIES_REPORT.md).

## Limitations & notes

- **Snapshot dated 2026-05-27.** Tenant mixes change frequently; the registry reflects ownership moves (e.g. Seletar Mall → Allgreen, KINEX divested by UOL) as of the research date.
- **City Square** has full name + unit but per-shop category only for F&B.
- **Other registry-only malls** (Clarke Quay Central and smaller heartland malls) are catalogued at the owner / geography / transit level but without per-shop listings yet.
- All sources are **public store directories and mall-info pages**; see the Access policy above for details.

## Support
If this dataset is useful to you, you can support continued maintenance: [Buy me a coffee ☕](https://buymeacoffee.com/curioputterings).
