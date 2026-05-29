# Singapore Shopping Centres & Shops

A web-scraping pipeline that identifies Singapore shopping centres, their
corporate owners, geography/transit, and the shops inside them — including the
main **scope of business** of each shop and whether it's **F&B**. A second,
independent pipeline catalogues **nursing / baby-care rooms** in those malls.

Built collaboratively with Gemini (deep research for the corporate-owner /
geography registry, and for normalizing scraped nursing-room text) and direct
API scraping (for the shop-level data).

<a href="https://buymeacoffee.com/curioputterings" target="_blank"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>

> **Before reading any chart or table:** please see the [**Disclaimer**](./DISCLAIMER.md) and [**Licence**](./LICENSE). In short — this is a descriptive open-data snapshot of what was publicly discoverable, not an audit, ranking, or scorecard of any mall, operator, or brand. Operator corrections are welcome and updated promptly with citation.

## Browse the two projects

| | |
| :--- | :--- |
| 🛍️ **[Shopping →](./shopping/)** | 87 shopping centres · 9,158 stores · 6 analytical reports (chain ubiquity, mall similarity, cuisine mix, brand provenance, REIT financials) plus [**10 fun questions**](./shopping/FUN.md) |
| 🍼 **[Nursing-room facilities →](./nursing/)** | 145+ nursing/baby-care rooms across 57 malls · interactive [**facilities report**](./nursing/FACILITIES_REPORT.html) with rooms-per-floor heatmap + walking-distance scatter |

> **Repo layout.** Two sibling sub-projects: [`shopping/`](./shopping/) (malls + stores + REIT financials) and [`nursing/`](./nursing/) (nursing-room facilities). The published Pages site mirrors that split.
>
> **Scraper code is intentionally not in this public repo.** The per-operator scrapers live locally under `shopping/scrapers/` and `nursing/scrapers/` and are gitignored. This README documents the techniques because they explain *how the data was obtained*, but the executables themselves and their HTTP caches (`raw/`) are kept private.

## What's published in `shopping/data/` and `nursing/data/`

| File | Rows | Description |
| --- | ---: | --- |
| `shopping/data/malls.json` / `malls.csv` | 75 | Every shopping centre: corporate owner, owner group & type, address, postal code, planning region, nearest MRT, lat/long, shop & F&B counts |
| `shopping/data/stores.json` / `stores.csv` | 4,258 | Every catalogued shop: name, mall, owner group, unit, level, scope of business, F&B flag, halal flag, description, website |
| `shopping/REPORT.md` | — | Summary: coverage, shops by scope, malls by shop count, owners |
| `shopping/data/malls_registry.json` | 73 | Raw Gemini-researched registry (owner / geo / transit) before merge |
| `nursing/data/nursing_rooms.json` | 145 | One record per nursing/baby-care room: mall, floor, location, nearest unit, status, capacity, amenities, source, source_confidence, source_last_modified, (Mappedin) x/y + walking distance to nearest entrance |
| `nursing/data/nursing_rooms_mappedin.json` | 46 | Mappedin-sourced rooms w/ coordinates + walking distance (Frasers malls) |
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
  - **Suntec City** (Suntec REIT) — 396 shops (via headless browser; see below)
  - **Lendlease** — 313@somerset (138) + Jem (252) + PLQ Mall (196) = 586 shops
  - **Paragon** (Paragon REIT) — 196 shops (via headless browser)
  - **Great World** (Allgreen) — 218 shops
  - **Wisma Atria** (Starhill Global REIT) — 100 shops
  - **The Shoppes at Marina Bay Sands** (Las Vegas Sands) — 214 shops (luxury)
  - **Mandarin Gallery** (OUE; luxury Orchard) — 77 shops
  - **Ngee Ann City / Takashimaya** (Starhill Global REIT) — 148 shops
  - **Marina Square** (SingLand) — 216 shops
  - **United Square** (UOL) — 118 shops
  - **Velocity @ Novena Square** (UOL) — 123 shops
  - **VivoCity (Mapletree)** — 378 shops (full sitemap walk)
- The remaining ~40 centres are catalogued at the **registry level** (owner +
  geo + transit) but without shop lists yet — see *Extending* below.

## Data sources & method

| Operator | Source | Technique |
| --- | --- | --- |
| Corporate owners + geography + transit | Gemini deep research | `gemini-deep-research`, parsed to `malls_registry.json` |
| CapitaLand (CICT/CLAR) | `www.capitaland.com/api-v1/sg/en/tenants/ALL.json` + `properties/ALL.json` (Adobe AEM Sling JSON) | One call returns all 2,428 store instances with mall, unit, level, category, description; categories mapped via the site's `tenant-categories` taxonomy |
| Frasers (FCT) | `frasersexperience.com/bin/frasers/storesearch` (AEM servlet) | POST per mall (browser headers + session cookie); rich fields incl. halal |
| Far East | `fareastmalls.com.sg/feorbg_api/Search/ShopSearchLoadMore` (Sitecore) | POST per mall (JSON body, HTML cards) — name, unit, category |
| Link REIT | `api-sg.linkreit.com/live/searchapi/stores/query` | GET per mall+category, `api_key` header — name, unit, halal |
| ION Orchard | `ionorchard.com/graphql/execute.json/ion/GetStoresByType` (AEM GraphQL) | Persisted query, storeType=Shop/Dine — name, category, unit, level, halal |
| Jewel | `jewelchangiairport.com/.../tenant_listing*.results` (AEM Sling) | Shop + Dine JSON listings — name, unit, category tags |
| City Square (CDL) | `citysquaremall.com.sg/shops/all-shops/` (WordPress) | HTML card parse — name, unit; F&B from the F&B category page |
| Suntec City | `sunteccity.com.sg/Prod/v1/directories` (same-origin proxy, auth added server-side) | **Headless browser (Playwright)** loads the category pages and the directory JSON is captured off the network — name, unit, zone, sub-category, halal |
| Lendlease (313, Jem) | Vue store-directory SPA (no bulk endpoint) | **Headless browser** clicks "Load More" to full load, then reads each `.directory-card` — name, category, unit (Jem) |
| Lendlease (PLQ) | `payalebarquarter.com/directory/mall/` | Store directory embedded as a JSON island in static HTML — name, unit, category |
| Paragon | WordPress `load_more_stores` (nonce-gated admin-ajax) | **Headless browser** clicks "Load More" (#load_more_button) to full load, reads `.paragon-store-*` cards — name, unit, category |
| Mandarin Gallery | `mandaringallery.com.sg/api/directory.json` | Clean JSON API — name, unit, level, category |
| Wisma Atria | WordPress category facet pages | Fetch each `/store-directory/<cat>/` page, parse `.store-name` cards — name, unit, category |
| Great World | `shop.greatworld.com.sg` + `shop-sitemap1.xml` | Enumerate sitemap, parse each shop detail page's `.shopdetailbox` — name, unit, level, category (cached to raw/) |
| United Square | WordPress `/stores-category/<cat>/page/N/` | Walk numbered pagination per category, parse `.us-stores-archive-*` cards |
| Velocity @ Novena Square | `velocitynovena.com/tenant-category/<cat>/` | WordPress; parse `.velocity-taxonomy-tenant-*` cards per category — name, unit |
| Marina Square | `marinasquare.com.sg/stores/` | Full store list embedded as a `stores: [ … ]` JSON island — name, level, unit, categories |
| Ngee Ann City | `ngeeanncity.com.sg/shopdirectory/body_shopdirectory.html` (legacy frameset) | Fetch the data frame with a standard `Referer` header, parse the categorised table |
| The Shoppes @ MBS | `marinabaysands.com/shopping/store-directory.html` | Fetch via the system `curl` binary; 214 stores embedded as JSON in the `data-payload` attribute |
| VivoCity | WordPress Algolia index `vc_tenants` | Direct Algolia query with the site's public search key |

Raw API responses are cached locally under `shopping/raw/` and `nursing/raw/` so
re-runs are cheap and reproducible. Those caches are not committed.

## Running (locally — scrapers not in this repo)

The scraper modules live locally under `shopping/scrapers/` and
`nursing/scrapers/` and are gitignored. 

### Nursing-room facilities (a different axis from store directories)

Store scrapers list *tenants*; nursing rooms live on each mall's **Mall Info /
Concierge** page instead. `facilities.py` scrapes CapitaLand's concierge pages
(`/sg/malls/<slug>/en/concierge.html`, same AEM stack as the tenant API) and
**isolates the raw nursing-room text** — handling both the FAQ-accordion form
("Nursing rooms are located at: - Level 2, ...") and the rich-text form
("Nursing Room → Located at Level 2 (near Lobby D)").

That raw text is messy: the same room is usually printed twice (a highlight
block *and* an FAQ), floor *ranges* appear ("Levels 1 to 7"), some rooms are
closed for works, and diaper-change stations / water dispensers sit alongside.
So — exactly like the registry's Gemini deep-research step — the raw text is
handed to **Gemini (flash)** which de-dupes, expands ranges into one room per
floor, drops non-nursing amenities, and flags closed rooms. Its output is saved
to `raw/facilities/capitaland_nursing_normalized.json` (reproducible artifact),
which `facilities.py` flattens into `data/nursing_rooms.json`. The split is
deliberate: deterministic fetch/isolation in Python, fuzzy normalization in
Gemini, grounded only on the fetched text (no hallucinated locations).

CapitaLand's 13 malls give **32 rooms** (CQ@Clarke Quay publishes none). Other
operators render facilities via JS SPAs, so `facilities_browser.py` renders each
site with Playwright, finds the facilities page, and harvests the nursing-room
text; Gemini then normalizes it into `raw/facilities/other_nursing_normalized.json`
(per-mall `operator`/`source_url`), which `facilities.py` folds in. That adds
**VivoCity, ION Orchard, City Square, United Square, Velocity** (+12 rooms).
Malls whose pages confirm the amenity but publish no floor (Jewel, Mandarin
Gallery, MBS, Suntec, Link REIT + Lendlease SPAs) are recorded as not-covered
rather than guessed. **Grand total: 27 malls / 90 rooms.**

#### Distance to the nearest entrance — via the Mappedin wayfinder

Many malls (all the Frasers ones, and others) embed a **Mappedin** interactive
map. Its public API (`api-gateway.mappedin.com/public/1/...`, authed with the
public key/secret the SPA ships) exposes the coordinate layer: a "Nursing Room"
*location* whose `nodes` each sit on a `map` (floor) at an (x, y) point, a "Mall
Entrances & Exits" location, the walkway graph (`node.paths`) and the
lift/escalator links (`vortex`). `facilities_mappedin.py` pulls these and runs a
**multi-source Dijkstra from every entrance** over the path graph (same-floor
edges weighted in metres via each floor's `x_scale`; vertical transfers free) to
get the **real horizontal walking distance** from each nursing room to the
nearest mall entrance — plus exact rooms-per-floor from the node positions. This
is what makes the headline "average distance to nearest entrance" answerable
(e.g. Causeway Point: 10 rooms across B1–L5, avg ~113 m walk to an entrance).

For malls with **no** scrapable coordinate layer (CapitaLand's concierge pages
are text-only), metres can't be computed; `facilities_report.py` falls back to
rooms-per-floor, the nearest-unit text anchor, and a **vertical** floor-distance
proxy (avg floors from any retail floor to the nearest nursing-room floor, from
store `level` data). See `nursing/FACILITIES_REPORT.md`.

## Limitations & notes

- **Snapshot dated 2026-05-27.** Tenant mixes change frequently; the registry
  reflects recent ownership moves (e.g. Seletar Mall → Allgreen, KINEX divested
  by UOL) as of the research date.
- **VivoCity now full** — earlier the Algolia index gave only ~89 of ~300+ shops;
  the current scraper walks `store-sitemap.xml` and parses each `/stores/<slug>/`
  detail page, yielding 378 records with name, unit, level, category, halal flag,
  and description.
- **City Square** has full name+unit but category only for F&B (per-shop category
  isn't exposed on the all-shops page).
- **Static HTML vs rendered DOM.** Most malls expose data in the static HTML or a
  plain JSON API (scraped with `requests`). Suntec is a JS SPA whose data only
  appears after JavaScript runs *and* whose API is auth-proxied server-side — so
  it's scraped with a **headless browser** (Playwright) that runs the JS and lets
  us capture the resulting JSON. Run `playwright install chromium` once first.
- **Other registry-only malls** (Clarke Quay Central and smaller heartland malls)
  — each would need its own scraper; the framework folds new ones in automatically.

- **Client compatibility** — a small number of mall sites only respond consistently to standard system HTTP tooling (e.g. the `curl` binary that ships with macOS), not to default Python HTTP libraries. We use whichever standard client a given site responds to; we do not modify, spoof, or manipulate request signatures.
- All sources are **public store directories**; access uses standard browser headers, respects each site's caching, and operates at low request rates.

## Extending to more operators

Each scraper is self-contained and writes `*_stores.json` with the common store
shape; add a new module, then `consolidate.py` will fold it into the unified
datasets and report automatically. Suntec (Nuxt `/api`) and the Frasers
`storesearch` mall list are the highest-value next targets.

## Support
If this dataset is useful to you, you can support continued maintenance: [Buy me a coffee ☕](https://buymeacoffee.com/curioputterings).
