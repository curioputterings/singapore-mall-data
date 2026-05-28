# Singapore Malls — Data & Analytics

Two open datasets on Singapore shopping centres, plus analytical reports on top of them.

<a href="https://buymeacoffee.com/curioputterings" target="_blank"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>

| Project | What it covers |
| --- | --- |
| **[Shopping](./shopping/)** | 86 shopping centres, their corporate owners, geography, transit access, and **8,800+ shops** with a unified 14-category scope-of-business taxonomy. Reports on chain ubiquity, mall similarity, F&B cuisine mix, brand provenance (Singapore vs. foreign), and REIT financials. |
| **[Nursing-room facilities](./nursing/)** | 145+ nursing / baby-care rooms across 27 malls — floor, capacity, source, and (for malls with a Mappedin wayfinder) the real walking distance to the nearest mall entrance. |

## Snapshot
Data dated **2026-05-27**. Tenant mixes change frequently; the registry reflects ownership moves around that date (e.g. Seletar Mall → Allgreen, KINEX divested by UOL).

## What's published here
- All data files in `shopping/data/` and `nursing/data/` (JSON + CSV)
- All analytical reports as markdown — see each project's landing page for the full list
- Visualisations (mall dendrogram, similarity heatmap) as PNG

## What's *not* published here
- The scrapers themselves (kept private)
- HTTP response caches in `raw/`
- Per-conversation tooling

## Method (short version)
- **Corporate-owner / geography / transit registry** — assembled via Gemini deep research over public REIT/operator filings and joined to OneMap for postal/region/MRT data.
- **Per-mall store directories** — fetched from each operator's public store-directory page (AEM JSON, WordPress, GraphQL, Algolia, JSON-island, or headless-browser depending on the site). The raw categories are mapped to a unified 14-category scope-of-business taxonomy in a single consolidate step.
- **Nursing-room facilities** — scraped from each mall's concierge / mall-info page (CapitaLand) or its Mappedin wayfinder coordinate layer (Frasers and others), with community-curated sources (Little Day Out, babyment) gap-filling malls that publish none.

## License
Data is derived from public store directories and public REIT disclosures; redistribute with attribution. No warranty — treat as a research snapshot.

## Support
If this dataset is useful to you, you can support continued maintenance: [Buy me a coffee ☕](https://buymeacoffee.com/curioputterings).
