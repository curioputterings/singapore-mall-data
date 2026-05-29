<link rel="stylesheet" href="./assets/charts.css">

# How Singaporean is the tenant mix?

_Brands classified as SG-homegrown vs foreign via curated dictionaries of recognisable chains. The **Unknown** band is the long tail of one-off shops/eateries — in a Singapore mall these are predominantly SG-domiciled SMEs, so treat SG% as a band: **strict** (named SG brands only) to **incl. residual** (SG + Unknown)._

← [back to shopping](./) · [back to the index](../)

## Outlets by provenance

Stacked outlets per segment — Singaporean brands (red), foreign chains (blue), and the long-tail Unknown band (grey).

<div id="provenance-stack" class="chart-wrap"></div>

| Segment | Outlets | SG-homegrown | Foreign chain | Unknown (long tail) | SG range* |
| --- | ---: | ---: | ---: | ---: | --- |
| **Retail** | 5,635 | 958 (17%) | 839 (15%) | 3,838 (68%) | **17%–85%** |
| **F&B** | 3,234 | 675 (21%) | 662 (20%) | 1,896 (59%) | **21%–79%** |
| **All** | 8,869 | 1,633 (18%) | 1,501 (17%) | 5,734 (65%) | **18%–83%** |

*SG range = strict lower bound (confirmed SG brands) to upper bound (confirmed SG + the predominantly-local Unknown tail).

## Of the *classified* (chain) outlets only

| Segment | SG share of classified | Foreign share of classified |
| --- | ---: | ---: |
| Retail | 53% | 47% |
| F&B | 50% | 50% |
| All | 52% | 48% |

## Method & caveats

- **SG-homegrown** = founded & HQ-domiciled in Singapore (Ya Kun, BreadTalk, Old Chang Kee, Charles & Keith, FairPrice, Challenger, Eu Yan Sang, OSIM, kcuts…).
- **Foreign** = HQ outside SG (Uniqlo/Muji/Daiso/Donki=JP; Watsons/Giordano/Miniso=HK/China; Cotton On/Lovisa=AU; Starbucks/McDonald's=US; Zara/H&M/Sephora=EU).
- Ambiguous brands judged by current domicile: Crystal Jade & Golden Village kept SG (SG-founded; GV now under SG-listed mm2), Eu Yan Sang SG (privatised by SG consortium); Watsons/Guardian/7-Eleven/Cold Storage = foreign (HK/DFI groups).
- The **Unknown** tail is mostly independent single-outlet local businesses (SG-domiciled) plus a few foreign one-offs — hence the range rather than a point.

_Per-brand labels: [`data/provenance.csv`](./data/provenance.csv)._

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="./assets/charts.js"></script>
<script>
  Charts.provenanceStack("provenance-stack");
</script>
