<link rel="stylesheet" href="./assets/charts.css">

# How profitable are these malls for their owners?

Retail data linked to owners' financial disclosures (FY2023/24), from SGX-listed
REIT annual reports / acquisition circulars. NPI = net property income (the property-
level profit after running costs). Developers (CDL, UOL, Far East, OUE) and LVS
don't disclose per-mall figures, so their malls are absent below.

← [back to shopping](./) · [back to the index](../)

> ## ⚠️ Important — please read before interpreting any figure on this page
>
> - **Many figures here are estimates**, derived from publicly-disclosed REIT/aggregate segment data and our own shop counts. The `npi_src` and `rev_src` columns in [`data/mall_financials.csv`](./data/mall_financials.csv) flag each value as **D**isclosed by the owner vs **E**stimated by us.
> - **Estimation methodology is documented** in the caveats paragraph below; reasonable people will get different numbers using different assumptions.
> - **Nothing on this page is financial advice, investment guidance, a valuation, or an audit.** It is a descriptive view of public disclosures, processed for comparability. Do not make investment or business decisions on this alone.
> - **Owners are welcome to flag corrections** — if a disclosed figure has been mis-extracted, an estimate is materially off, or a more recent FY filing supersedes ours, please get in touch. We will update with citation.

**Caveats:** CICT NPI is margin-estimated (~69% portfolio proxy applied to
disclosed gross revenue); MPACT/LREIT/Suntec/Paragon figures are derived from
disclosed segment-contribution ratios; some assets are integrated office+retail
(Raffles City, Funan, Jem). `npi_src`/`rev_src` columns in [`data/mall_financials.csv`](./data/mall_financials.csv)
flag disclosed (D) vs estimated (E).

## Shops × NPI — bubble plot

Each bubble is a mall; size = NPI yield, colour = owner. The cluster up-right (Raffles City, VivoCity, Paragon) earns the most absolute profit; the suburban heartland sits middle-left at high yields.

<div id="financials-scatter" class="chart-wrap"></div>

## Property-level economics — sortable

Click any column to sort. NPI margin is in %; valuation and NPI are in S$m.

<div id="financials-table" class="chart-wrap"></div>

## What it says about owner profitability

1. **Retail is a high-margin, defensive cash machine.** NPI margins run **69–79%** — owners keep ~70–80¢ of every rental dollar after property costs — at **98–100% occupancy** almost everywhere (only CQ@Clarke Quay lower, mid-AEI). Master-leased Orchard assets (Wisma/Ngee Ann via Toshin) post the **highest margins (~79%)** because the master tenant bears opex.
2. **The Orchard-vs-heartland yield paradox.** Prime Orchard malls earn **lower** NPI yields — Paragon 4.3%, 313@somerset 4.1%, Plaza Singapura 4.5% — because prestige/scarcity bids their **valuations** up, compressing yield. Suburban heartland malls earn **higher** yields — Causeway 5.2%, Bugis Junction 5.1%, Tampines 4.9%, Jurong Point 4.7% — valued on resilient cash flow, not prestige. **For the owner, heartland = higher cash return; Orchard = capital value + tourist upside.**
3. **Rent extracted per tenant tracks positioning, not size.** Luxury/prime malls squeeze far more rent per shop — **Paragon ~S$855k/shop/yr**, Tampines Mall ~S$555k, Wisma ~S$535k — vs value malls full of small standard chains (Bedok ~S$299k, Plaza Singapura ~S$319k, Westgate ~S$309k). This is the financial mirror of the cookie-cutter finding: heartland = many standardised chains paying moderate rent; distinctive prime = fewer, higher-paying tenants.
4. **Per-sqft, small prime floorplates win; mega-malls win on absolute profit.** Wisma Atria earns **~S$423/sqft/yr** (densest), vs big-box Suntec ~S$126 and VivoCity ~S$218 — yet VivoCity's sheer size still makes it a **~S$170m NPI** giant. Biggest profit pools: VivoCity, Raffles City, Paragon, Jurong Point, Jem.
5. **Profits are still growing.** Rental reversions are strongly positive — VivoCity +14–17%, Suntec +23%, Causeway +8.8%, FCT portfolio +7.7% — so owners are re-pricing leases upward; tenants compete for the space.

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  Charts.financialsScatter("financials-scatter");
  Charts.financialsTable("financials-table");
</script>
