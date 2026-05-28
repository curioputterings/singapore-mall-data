# How profitable are these malls for their owners?

Retail data linked to owners' financial disclosures (FY2023/24), from SGX-listed
REIT annual reports / acquisition circulars (deep-research; sources in
`raw/reit_financials_research.json`). NPI = net property income (the property-
level profit after running costs). Developers (CDL, UOL, Far East, OUE) and LVS
don't disclose per-mall figures, so their malls are absent below.

**Caveats:** CICT NPI is margin-estimated (~69% portfolio proxy applied to
disclosed gross revenue); MPACT/LREIT/Suntec/Paragon figures are derived from
disclosed segment-contribution ratios; some assets are integrated office+retail
(Raffles City, Funan, Jem). Revenue-per-shop uses our shop counts (VivoCity's is
partial, so omitted). `npi_src`/`rev_src` columns in `data/mall_financials.csv`
flag disclosed (D) vs estimated (E).

## Property-level economics (sorted by NPI = annual profit to owner)

| Mall | Owner | Gross rev S$m | NPI S$m | NPI margin | Valuation S$m | NPI yield | Occ. | Shops | Rev/shop S$k | Rev/sqft S$ |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Raffles City* | CICT | 248.3 | ~171 | 69% | — | — | 99.3% | 262 | 948 | — |
| VivoCity | MPACT | 226.1 | 170.3 | 75% | ~3,200 | 5.3% | 100% | — | — | 218 |
| Paragon | Paragon REIT | 167.5 | ~121 | 72% | 2,903 | 4.3% | 100% | 196 | 855 | — |
| Jurong Point | Link REIT | 142.3 | 99.6 | 70% | 2,120 | 4.7% | 97.8% | 380 | 374 | 197 |
| Jem* | LREIT | 125.0 | 94.1 | 75% | 2,188 | 4.3% | 100% | 252 | 496 | 140 |
| Suntec City (retail) | Suntec REIT | 111.2 | ~78 | 70% | — | — | 99.5% | 396 | 281 | 126 |
| Causeway Point | FCT | 97.7 | 69.4 | 71% | 1,336 | 5.2% | 99.6% | 222 | 440 | 233 |
| Plaza Singapura | CICT | 93.7 | ~65 | 69% | 1,441 | 4.5% | 99.7% | 294 | 319 | 193 |
| IMM Building | CICT | 89.4 | ~62 | 69% | — | — | 98% | 229 | 390 | — |
| Waterway Point | FCT | 87.0 | 61.8 | 71% | 1,315 | 4.7% | 100% | 226 | 385 | 223 |
| Bugis Junction | CICT | 83.7 | ~58 | 69% | 1,130 | 5.1% | 100% | 241 | 347 | 213 |
| Tampines Mall | CICT | 82.7 | ~57 | 69% | 1,133 | 4.9% | 100% | 149 | 555 | 232 |
| Westgate | CICT | 75.5 | ~52 | 69% | — | — | 98% | 244 | 309 | — |
| Funan* | CICT | 64.6 | ~45 | 69% | — | — | 98% | 190 | 340 | — |
| Bugis+ | CICT | 63.4 | ~44 | 69% | 359 | (12%†) | 100% | 94 | 674 | 296 |
| Junction 8 | CICT | 61.0 | ~42 | 69% | — | — | 98% | 171 | 357 | — |
| Bedok Mall | CICT | 58.1 | ~40 | 69% | — | — | 98% | 194 | 299 | — |
| 313@somerset | LREIT | 55.3 | 41.5 | 75% | 1,008 | 4.1% | 98.8% | 138 | 401 | 192 |
| Wisma Atria (retail) | Starhill | 53.5 | ~42 | 79% | — | — | 100% | 100 | 535 | 423 |
| Lot One | CICT | 46.5 | ~32 | 69% | — | — | 98% | 145 | 321 | — |
| CQ @ Clarke Quay | CICT | 30.0 | ~21 | 69% | — | — | 85% | 60 | 500 | — |
| Ngee Ann City (retail) | Starhill | — | — | 79% | 1,148 | — | 100% | 148 | — | — |

\*integrated office+retail (valuation/yield not retail-only). †Bugis+ yield is a data
artefact (its S$359m valuation looks partial); ignore.

## What it says about owner profitability
1. **Retail is a high-margin, defensive cash machine.** NPI margins run **69–79%** — owners keep ~70–80¢ of every rental dollar after property costs — at **98–100% occupancy** almost everywhere (only CQ@Clarke Quay lower, mid-AEI). Master-leased Orchard assets (Wisma/Ngee Ann via Toshin) post the **highest margins (~79%)** because the master tenant bears opex.
2. **The Orchard-vs-heartland yield paradox.** Prime Orchard malls earn **lower** NPI yields — Paragon 4.3%, 313@somerset 4.1%, Plaza Singapura 4.5% — because prestige/scarcity bids their **valuations** up, compressing yield. Suburban heartland malls earn **higher** yields — Causeway 5.2%, Bugis Junction 5.1%, Tampines 4.9%, Jurong Point 4.7% — valued on resilient cash flow, not prestige. **For the owner, heartland = higher cash return; Orchard = capital value + tourist upside.**
3. **Rent extracted per tenant tracks positioning, not size.** Luxury/prime malls squeeze far more rent per shop — **Paragon ~S$855k/shop/yr**, Tampines Mall ~S$555k, Wisma ~S$535k — vs value malls full of small standard chains (Bedok ~S$299k, Plaza Singapura ~S$319k, Westgate ~S$309k). This is the financial mirror of the cookie-cutter finding: heartland = many standardised chains paying moderate rent; distinctive prime = fewer, higher-paying tenants.
4. **Per-sqft, small prime floorplates win; mega-malls win on absolute profit.** Wisma Atria earns **~S$423/sqft/yr** (densest), vs big-box Suntec ~S$126 and VivoCity ~S$218 — yet VivoCity's sheer size still makes it a **~S$170m NPI** giant. Biggest profit pools: VivoCity, Raffles City, Paragon, Jurong Point, Jem.
5. **Profits are still growing.** Rental reversions are strongly positive — VivoCity +14–17%, Suntec +23%, Causeway +8.8%, FCT portfolio +7.7% — so owners are re-pricing leases upward; tenants compete for the space.

_Full table + source flags: `data/mall_financials.csv`._
