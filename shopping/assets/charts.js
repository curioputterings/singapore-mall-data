/* Shared chart helpers for the singapore-mall-data Pages site.
   Depends on Plotly (loaded from CDN). */
(function () {
  "use strict";

  // ---------- tiny RFC-4180-ish CSV parser ----------
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else q = false;
        } else field += c;
      } else {
        if (c === '"') q = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n" || c === "\r") {
          if (field.length || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
          if (c === "\r" && text[i + 1] === "\n") i++;
        } else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    if (!rows.length) return [];
    const header = rows[0];
    return rows.slice(1).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
  }

  function fetchCSV(path) { return fetch(path).then(r => r.text()).then(parseCSV); }
  function fetchText(path) { return fetch(path).then(r => r.text()); }
  function fetchJSON(path) { return fetch(path).then(r => r.json()); }

  // ---------- sortable / filterable table ----------
  function smartTable(containerId, rows, columns, opts) {
    opts = opts || {};
    const el = document.getElementById(containerId);
    if (!el) return;
    const wrap = document.createElement("div");

    if (opts.search !== false) {
      const ctrls = document.createElement("div");
      ctrls.className = "smart-controls";
      const inp = document.createElement("input");
      inp.placeholder = "Filter…";
      const cnt = document.createElement("span");
      cnt.className = "count";
      ctrls.appendChild(inp); ctrls.appendChild(cnt);
      wrap.appendChild(ctrls);

      let allRows = rows.slice();
      inp.addEventListener("input", () => {
        const q = inp.value.toLowerCase();
        const filt = allRows.filter(r => columns.some(c => String(r[c.key] ?? "").toLowerCase().includes(q)));
        rebuild(filt);
      });
      var setCount = n => { cnt.textContent = n + " of " + rows.length; };
      var rebuild = filt => {
        body.innerHTML = "";
        filt.forEach(r => body.appendChild(rowEl(r)));
        setCount(filt.length);
      };
      var initial = rows;
    }

    const table = document.createElement("table");
    table.className = "smart";
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    columns.forEach((c, idx) => {
      const th = document.createElement("th");
      th.textContent = c.label;
      if (c.num) th.classList.add("num");
      th.addEventListener("click", () => sortBy(idx));
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const body = document.createElement("tbody");
    function rowEl(r) {
      const tr = document.createElement("tr");
      columns.forEach(c => {
        const td = document.createElement("td");
        if (c.num) td.classList.add("num");
        const v = r[c.key];
        if (c.render) td.innerHTML = c.render(v, r);
        else td.textContent = v == null ? "" : v;
        tr.appendChild(td);
      });
      return tr;
    }

    let sortIdx = opts.sortIdx == null ? -1 : opts.sortIdx;
    let sortDir = opts.sortDir || "desc";

    function sortBy(idx) {
      if (sortIdx === idx) sortDir = sortDir === "asc" ? "desc" : "asc";
      else { sortIdx = idx; sortDir = columns[idx].num ? "desc" : "asc"; }
      const key = columns[idx].key;
      const isNum = columns[idx].num;
      const dir = sortDir === "asc" ? 1 : -1;
      rows.sort((a, b) => {
        const av = a[key], bv = b[key];
        if (isNum) return (parseFloat(av) - parseFloat(bv)) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
      trh.querySelectorAll("th").forEach((th, i) => {
        th.classList.toggle("sort-asc",  i === idx && sortDir === "asc");
        th.classList.toggle("sort-desc", i === idx && sortDir === "desc");
      });
      body.innerHTML = "";
      rows.forEach(r => body.appendChild(rowEl(r)));
    }

    rows.forEach(r => body.appendChild(rowEl(r)));
    table.appendChild(body);
    wrap.appendChild(table);
    el.appendChild(wrap);

    if (opts.sortIdx != null) sortBy(opts.sortIdx);
    if (opts.search !== false) setCount(rows.length);
  }

  // ---------- chart builders ----------
  const layoutBase = {
    font: { family: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", size: 12 },
    margin: { l: 80, r: 30, t: 40, b: 60 },
    paper_bgcolor: "white",
    plot_bgcolor: "#fafbfc",
  };
  // NB: responsive:false — we drive resizes ourselves via ResizeObserver below.
  // Plotly's built-in responsive handler reacts to every window resize event,
  // which on iOS/Android Safari fires repeatedly as the URL bar shows/hides
  // and can momentarily measure a 0-height parent, collapsing the chart.
  const cfg = { responsive: false, displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d"] };

  // Wrapper around Plotly.newPlot that auto-attaches a ResizeObserver so the
  // chart stays correctly sized through mobile-browser reflows (iOS URL-bar
  // show/hide, Android orientation change, etc.) — instead of using Plotly's
  // built-in responsive listener which fires on every window resize event.
  function plot(divId, traces, layout, config) {
    const el = typeof divId === "string" ? document.getElementById(divId) : divId;
    if (!el) return Promise.resolve();
    return Plotly.newPlot(el, traces, layout, config || cfg).then(() => attachResize(el));
  }

  // Re-fit a Plotly chart to its container ONLY when the container's width
  // actually changes (orientation flip, viewport resize). We deliberately
  // ignore height changes because every Plotly.Plots.resize() can nudge the
  // SVG height by a pixel or two (label wrap, automargin), and observing
  // height would create a runaway feedback loop where the chart grows on
  // every redraw. Debounced via rAF.
  function attachResize(divId) {
    const el = typeof divId === "string" ? document.getElementById(divId) : divId;
    if (!el || !window.ResizeObserver) return;
    let lastWidth = el.clientWidth;
    let pending = false;
    const obs = new ResizeObserver(entries => {
      const w = Math.round(entries[0].contentRect.width);
      // Width-only trigger, with a small threshold to ignore noise.
      if (Math.abs(w - lastWidth) < 4) return;
      lastWidth = w;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (w > 50) {
          try { Plotly.Plots.resize(el); } catch (_) { /* not yet plotted */ }
        }
      });
    });
    obs.observe(el);
  }

  function similarityHeatmap(divId) {
    fetchText("./data/mall_similarity.csv").then(text => {
      const rows = text.trim().split(/\r?\n/).map(r => {
        // straightforward split — mall names have no commas in the matrix CSV header
        return r.split(",");
      });
      const labels = rows[0].slice(1);
      const z = rows.slice(1).map(r => r.slice(1).map(parseFloat));
      plot(divId, [{
        z, x: labels, y: labels, type: "heatmap",
        colorscale: [[0, "#fff7ec"], [0.05, "#fee8c8"], [0.15, "#fdbb84"], [0.3, "#e34a33"], [1, "#b30000"]],
        zmin: 0, zmax: 0.35,
        hovertemplate: "<b>%{y}</b> × <b>%{x}</b><br>Jaccard: %{z:.3f}<extra></extra>",
        colorbar: { title: "Jaccard", thickness: 14, len: 0.8 }
      }], Object.assign({}, layoutBase, {
        title: { text: "Tenant-mix similarity (59 malls, Jaccard on brand sets)", font: { size: 14 } },
        margin: { l: 180, r: 30, t: 50, b: 180 },
        xaxis: { tickangle: -55, tickfont: { size: 9 }, automargin: true, side: "bottom" },
        yaxis: { tickfont: { size: 9 }, automargin: true, autorange: "reversed" },
        height: 850,
      }), cfg);
    });
  }

  function cookieCutterTable(divId) {
    fetchCSV("./data/mall_cookiecutter.csv").then(rows => {
      // chain_share is 0..1 — render as %
      const data = rows.map(r => ({
        mall: r.mall, owner: r.owner, region: r.region,
        chain_share: r.chain_share ? +r.chain_share : null,
        mean_jaccard: r.mean_jaccard_to_others ? +r.mean_jaccard_to_others : null,
      }));
      smartTable(divId, data, [
        { key: "mall", label: "Mall" },
        { key: "owner", label: "Owner" },
        { key: "region", label: "Region" },
        { key: "chain_share", label: "Chain-share", num: true,
          render: v => v == null ? "—" : pctHeat(v) },
        { key: "mean_jaccard", label: "Mean Jaccard", num: true,
          render: v => v == null ? "—" : v.toFixed(3) },
      ], { sortIdx: 3, sortDir: "desc" });
    });
  }

  // Neutral single-hue blue wash 0..1 — used for descriptive percentage cells
  // (e.g. cookie-cutter chain-share). Deliberately not red/amber/green: a high
  // value on these tables is descriptive, not "bad", and shouldn't read as a
  // red flag against the mall.
  function pctHeat(v) {
    const pct = (v * 100).toFixed(0) + "%";
    const light = 92 - Math.min(v, 1) * 22;
    return `<span class="cell-heat" style="background:hsl(210,45%,${light}%)">${pct}</span>`;
  }
  function numHeat(v, vmax) {
    const ratio = vmax ? Math.min(1, v / vmax) : 0;
    const hue = 220 - ratio * 220;
    const light = 92 - ratio * 25;
    return `<span class="cell-heat" style="background:hsl(${hue},70%,${light}%)">${v}</span>`;
  }

  function topShopsBar(divId, csvPath, title, color) {
    fetchCSV(csvPath).then(rows => {
      const data = rows.slice(0, 30).reverse();
      plot(divId, [{
        type: "bar", orientation: "h",
        x: data.map(r => +r.num_malls),
        y: data.map(r => r.shop),
        text: data.map(r => `${r.num_malls} malls · ${r.num_outlets} outlets`),
        hovertemplate: "<b>%{y}</b><br>In %{x} malls<extra></extra>",
        marker: { color: color || "#0366d6" },
      }], Object.assign({}, layoutBase, {
        title: { text: title, font: { size: 14 } },
        height: Math.max(600, data.length * 22),
        margin: { l: 200, r: 30, t: 50, b: 50 },
        xaxis: { title: "Number of malls", gridcolor: "#eee" },
        yaxis: { automargin: true, tickfont: { size: 11 } },
      }), cfg);
    });
  }

  function topShopsTable(divId, csvPath) {
    fetchCSV(csvPath).then(rows => {
      const data = rows.map(r => ({
        shop: r.shop, type: r.type,
        num_malls: +r.num_malls, num_outlets: +r.num_outlets, malls: r.malls,
      }));
      smartTable(divId, data, [
        { key: "shop", label: "Shop" },
        { key: "num_malls",   label: "Malls",   num: true },
        { key: "num_outlets", label: "Outlets", num: true },
        { key: "malls", label: "Found in",
          render: v => `<details><summary>${(v||"").split(",").length} malls</summary>${v}</details>` },
      ], { sortIdx: 1, sortDir: "desc" });
    });
  }

  function scopeBar(divId) {
    fetchJSON("./data/stores.json").then(stores => {
      const c = {};
      stores.forEach(s => { const k = s.scope_of_business || "Unclassified"; c[k] = (c[k]||0) + 1; });
      const sorted = Object.entries(c).sort((a, b) => a[1] - b[1]);
      plot(divId, [{
        type: "bar", orientation: "h",
        x: sorted.map(e => e[1]),
        y: sorted.map(e => e[0]),
        text: sorted.map(e => e[1].toLocaleString()),
        textposition: "outside",
        marker: { color: sorted.map((_, i) => `hsl(${210 - i * 12}, 70%, ${55 - i}%)`) },
        hovertemplate: "<b>%{y}</b>: %{x} shops<extra></extra>",
      }], Object.assign({}, layoutBase, {
        title: { text: "All catalogued shops by scope of business", font: { size: 14 } },
        height: 500,
        margin: { l: 220, r: 80, t: 50, b: 40 },
        xaxis: { gridcolor: "#eee" },
        yaxis: { automargin: true },
      }), cfg);
    });
  }

  function mallsByShopCount(divId) {
    fetchJSON("./data/malls.json").then(malls => {
      const data = malls.filter(m => m.num_stores).sort((a, b) => a.num_stores - b.num_stores);
      plot(divId, [{
        type: "bar", orientation: "h",
        x: data.map(m => m.num_stores),
        y: data.map(m => m.mall_name),
        customdata: data.map(m => [m.num_fnb || 0, m.owner_group || "—", m.planning_region || "—"]),
        hovertemplate: "<b>%{y}</b><br>%{x} shops (F&B: %{customdata[0]})<br>Owner: %{customdata[1]}<br>Region: %{customdata[2]}<extra></extra>",
        marker: { color: data.map(m => m.num_fnb ? m.num_fnb / m.num_stores : 0),
                  colorscale: "Viridis", reversescale: true,
                  colorbar: { title: "F&B share", thickness: 10, len: 0.6 } },
        text: data.map(m => m.num_stores),
        textposition: "outside",
      }], Object.assign({}, layoutBase, {
        title: { text: "Catalogued malls by shop count (colour = F&B share)", font: { size: 14 } },
        height: Math.max(600, data.length * 18),
        margin: { l: 240, r: 60, t: 50, b: 40 },
        xaxis: { gridcolor: "#eee" },
        yaxis: { automargin: true, tickfont: { size: 10 } },
      }), cfg);
    });
  }

  function ownersBar(divId) {
    fetchJSON("./data/malls.json").then(malls => {
      const byOwner = {};
      malls.forEach(m => {
        const o = m.owner_group || "Other";
        if (!byOwner[o]) byOwner[o] = { malls: 0, shops: 0 };
        byOwner[o].malls++;
        byOwner[o].shops += m.num_stores || 0;
      });
      const data = Object.entries(byOwner).sort((a, b) => a[1].shops - b[1].shops);
      plot(divId, [{
        type: "bar", orientation: "h",
        x: data.map(e => e[1].shops), y: data.map(e => e[0]),
        text: data.map(e => `${e[1].shops.toLocaleString()} shops · ${e[1].malls} malls`),
        textposition: "outside",
        hovertemplate: "<b>%{y}</b><br>%{x} shops<br>%{text}<extra></extra>",
        marker: { color: "#28a745" },
      }], Object.assign({}, layoutBase, {
        title: { text: "Shops by owner group", font: { size: 14 } },
        height: Math.max(400, data.length * 26),
        margin: { l: 220, r: 140, t: 50, b: 40 },
        xaxis: { gridcolor: "#eee" }, yaxis: { automargin: true },
      }), cfg);
    });
  }

  function regionDonut(divId) {
    fetchJSON("./data/malls.json").then(malls => {
      const c = {};
      malls.forEach(m => { const k = m.planning_region || "Unknown"; c[k] = (c[k]||0) + 1; });
      const labels = Object.keys(c), values = Object.values(c);
      plot(divId, [{
        type: "pie", labels, values, hole: 0.5,
        textinfo: "label+percent", textposition: "outside",
        hovertemplate: "<b>%{label}</b>: %{value} malls (%{percent})<extra></extra>",
      }], Object.assign({}, layoutBase, {
        title: { text: "All identified malls by planning region", font: { size: 14 } },
        height: 460,
        showlegend: false,
      }), cfg);
    });
  }

  function cuisineBars(divId) {
    fetchCSV("./data/fnb_cuisine.csv").then(rows => {
      const buckets = {};
      rows.forEach(r => {
        const b = r.bucket || "Other";
        buckets[b] = (buckets[b] || 0) + (+r.outlets || 0);
      });
      const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
      const total = sorted.reduce((s, e) => s + e[1], 0);
      plot(divId, [{
        type: "bar", orientation: "h",
        x: sorted.map(e => e[1]).reverse(),
        y: sorted.map(e => e[0]).reverse(),
        text: sorted.map(e => `${e[1]} (${(100 * e[1] / total).toFixed(0)}%)`).reverse(),
        textposition: "outside",
        marker: {
          color: ["#d62728", "#9467bd", "#1f77b4", "#ff7f0e", "#2ca02c", "#8c564b"].slice(0, sorted.length).reverse(),
        },
        hovertemplate: "<b>%{y}</b>: %{x} outlets<extra></extra>",
      }], Object.assign({}, layoutBase, {
        title: { text: "F&B outlets by cultural cuisine bucket", font: { size: 14 } },
        height: 380, margin: { l: 220, r: 90, t: 50, b: 40 },
        xaxis: { gridcolor: "#eee" }, yaxis: { automargin: true },
      }), cfg);
    });
  }

  function cuisineByMall(divId, topN) {
    topN = topN || 15;
    Promise.all([fetchJSON("./data/stores.json"), fetchCSV("./data/fnb_cuisine.csv")]).then(([stores, cuisine]) => {
      const brandBucket = {};
      cuisine.forEach(r => brandBucket[r.brand] = r.bucket);
      const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
      const brandByNorm = {};
      Object.keys(brandBucket).forEach(b => brandByNorm[norm(b)] = brandBucket[b]);

      const malls = {};
      stores.filter(s => s.is_fnb).forEach(s => {
        const b = brandByNorm[norm(s.store_name)] || "Other / Mixed";
        const m = s.mall;
        if (!malls[m]) malls[m] = {};
        malls[m][b] = (malls[m][b] || 0) + 1;
      });
      const mallList = Object.entries(malls)
        .map(([m, b]) => ({ m, total: Object.values(b).reduce((a, c) => a + c, 0), b }))
        .sort((a, b) => b.total - a.total).slice(0, topN);

      const buckets = ["Local / Immediate-Regional", "East Asian (KR/JP/CN/TW)", "European / Western",
                       "Other Asian", "Indian", "Other / Mixed"];
      const colors = ["#2ca02c", "#d62728", "#1f77b4", "#ff7f0e", "#9467bd", "#8c564b"];
      const traces = buckets.map((b, i) => ({
        type: "bar", orientation: "h", name: b,
        x: mallList.map(d => d.b[b] || 0),
        y: mallList.map(d => d.m),
        marker: { color: colors[i] },
        hovertemplate: `<b>%{y}</b><br>${b}: %{x}<extra></extra>`,
      }));
      plot(divId, traces, Object.assign({}, layoutBase, {
        title: { text: `Top ${topN} malls — F&B cultural mix`, font: { size: 14 } },
        barmode: "stack",
        height: Math.max(420, topN * 28),
        margin: { l: 220, r: 30, t: 50, b: 40 },
        legend: { orientation: "h", y: -0.08 },
        xaxis: { gridcolor: "#eee", title: "F&B outlets" },
        yaxis: { automargin: true },
      }), cfg);
    });
  }

  function provenanceStack(divId) {
    fetchCSV("./data/provenance.csv").then(rows => {
      const tally = {};   // segment -> {Singaporean, Foreign, Unknown}
      rows.forEach(r => {
        const seg = r.segment || "Other";
        const p = r.provenance || "Unknown";
        const n = +r.outlets || 0;
        if (!tally[seg]) tally[seg] = {};
        tally[seg][p] = (tally[seg][p] || 0) + n;
      });
      const segs = Object.keys(tally);
      const types = ["Singaporean", "Foreign", "Unknown"];
      const colors = { Singaporean: "#dc3545", Foreign: "#0d6efd", Unknown: "#adb5bd" };
      const traces = types.map(t => ({
        type: "bar", name: t,
        x: segs,
        y: segs.map(s => tally[s][t] || 0),
        marker: { color: colors[t] },
        text: segs.map(s => {
          const tot = types.reduce((a, k) => a + (tally[s][k] || 0), 0);
          const v = tally[s][t] || 0;
          return tot ? `${v} (${Math.round(100 * v / tot)}%)` : "";
        }),
        textposition: "inside",
        hovertemplate: "<b>%{x}</b><br>" + t + ": %{y}<extra></extra>",
      }));
      plot(divId, traces, Object.assign({}, layoutBase, {
        title: { text: "Outlets by provenance (Singaporean / Foreign / Unknown long tail)", font: { size: 14 } },
        barmode: "stack",
        height: 460,
        yaxis: { title: "Outlets", gridcolor: "#eee" },
      }), cfg);
    });
  }

  function financialsScatter(divId) {
    fetchCSV("./data/mall_financials.csv").then(rows => {
      const pts = rows.filter(r => r.shops && r.npi_Sm).map(r => ({
        mall: r.mall, owner: r.owner,
        shops: +r.shops, npi: +r.npi_Sm,
        yield: r.npi_yield_pct ? +r.npi_yield_pct : null,
        margin: r.npi_margin_pct ? +r.npi_margin_pct : null,
        revPerShop: r.rev_per_shop_k ? +r.rev_per_shop_k : null,
      }));
      const owners = [...new Set(pts.map(p => p.owner))];
      const palette = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];
      const traces = owners.map((o, i) => {
        const pp = pts.filter(p => p.owner === o);
        return {
          type: "scatter", mode: "markers+text", name: o,
          x: pp.map(p => p.shops),
          y: pp.map(p => p.npi),
          text: pp.map(p => p.mall),
          textposition: "top center",
          textfont: { size: 9 },
          marker: { size: pp.map(p => p.yield ? Math.max(8, p.yield * 4) : 10),
                    color: palette[i % palette.length], opacity: 0.8, line: { width: 1, color: "white" } },
          hovertemplate: "<b>%{text}</b><br>Owner: " + o +
            "<br>Shops: %{x}<br>NPI: S$%{y:.1f}m<extra></extra>",
        };
      });
      plot(divId, traces, Object.assign({}, layoutBase, {
        title: { text: "Mall economics — shops × NPI (bubble = NPI yield)", font: { size: 14 } },
        height: 580,
        xaxis: { title: "Number of shops", gridcolor: "#eee" },
        yaxis: { title: "NPI (S$m)", gridcolor: "#eee" },
        legend: { orientation: "h", y: -0.15 },
      }), cfg);
    });
  }

  function financialsTable(divId) {
    fetchCSV("./data/mall_financials.csv").then(rows => {
      const data = rows.map(r => ({
        mall: r.mall, owner: r.owner,
        shops: r.shops ? +r.shops : null,
        gross: r.gross_rev_Sm ? +r.gross_rev_Sm : null,
        npi: r.npi_Sm ? +r.npi_Sm : null,
        margin: r.npi_margin_pct ? +r.npi_margin_pct : null,
        valuation: r.valuation_Sm ? +r.valuation_Sm : null,
        yield_: r.npi_yield_pct ? +r.npi_yield_pct : null,
        occ: r.occupancy_pct ? +r.occupancy_pct : null,
        revPerShop: r.rev_per_shop_k ? +r.rev_per_shop_k : null,
      }));
      smartTable(divId, data, [
        { key: "mall", label: "Mall" },
        { key: "owner", label: "Owner" },
        { key: "shops",      label: "Shops",         num: true, render: v => v == null ? "—" : v },
        { key: "gross",      label: "Gross S$m",     num: true, render: v => v == null ? "—" : v.toFixed(1) },
        { key: "npi",        label: "NPI S$m",       num: true, render: v => v == null ? "—" : v.toFixed(1) },
        { key: "margin",     label: "Margin %",      num: true, render: v => v == null ? "—" : v + "%" },
        { key: "valuation",  label: "Valuation S$m", num: true, render: v => v == null ? "—" : v.toFixed(0) },
        { key: "yield_",     label: "NPI yield %",   num: true, render: v => v == null ? "—" : v + "%" },
        { key: "occ",        label: "Occ %",         num: true, render: v => v == null ? "—" : v + "%" },
        { key: "revPerShop", label: "Rev/shop S$k",  num: true, render: v => v == null ? "—" : v.toFixed(0) },
      ], { sortIdx: 4, sortDir: "desc" });
    });
  }

  function ownerAnchors(divId) {
    fetchJSON("./data/stores.json").then(stores => {
      const owners = {};
      stores.forEach(s => {
        if (!s.owner_group) return;
        if (!owners[s.owner_group]) owners[s.owner_group] = { mallSet: new Set(), brandMallSet: {} };
        owners[s.owner_group].mallSet.add(s.mall);
        const k = s.store_name;
        if (!k) return;
        if (!owners[s.owner_group].brandMallSet[k]) owners[s.owner_group].brandMallSet[k] = new Set();
        owners[s.owner_group].brandMallSet[k].add(s.mall);
      });
      const sortedOwners = Object.entries(owners)
        .map(([o, v]) => ({ o, malls: v.mallSet.size, brands: v.brandMallSet }))
        .filter(d => d.malls >= 2)
        .sort((a, b) => b.malls - a.malls);

      const traces = sortedOwners.slice(0, 6).map((d, i) => {
        const top = Object.entries(d.brands)
          .map(([brand, set]) => [brand, set.size])
          .sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
        return {
          type: "bar", orientation: "h", name: `${d.o} (${d.malls} malls)`,
          x: top.map(t => t[1]),
          y: top.map(t => t[0]),
          xaxis: "x" + (i + 1), yaxis: "y" + (i + 1),
          showlegend: false,
          marker: { color: "#0366d6" },
          hovertemplate: "<b>%{y}</b><br>In %{x} of " + d.malls + " malls<extra></extra>",
        };
      });

      const layout = Object.assign({}, layoutBase, {
        title: { text: "Top 10 anchor chains per owner (max of their portfolio)", font: { size: 14 } },
        height: 900,
        grid: { rows: 3, columns: 2, pattern: "independent" },
        annotations: sortedOwners.slice(0, 6).map((d, i) => ({
          text: `<b>${d.o}</b> · ${d.malls} malls`,
          showarrow: false, xref: "x" + (i + 1) + " domain", yref: "y" + (i + 1) + " domain",
          x: 0, y: 1.12, xanchor: "left",
        })),
        margin: { l: 50, r: 30, t: 50, b: 30 },
      });
      sortedOwners.slice(0, 6).forEach((_, i) => {
        layout["xaxis" + (i + 1)] = { gridcolor: "#eee" };
        layout["yaxis" + (i + 1)] = { automargin: true, tickfont: { size: 10 } };
      });
      plot(divId, traces, layout, cfg);
    });
  }

  function regionAnchors(divId) {
    fetchJSON("./data/stores.json").then(stores => {
      const regions = {};   // region -> {brand -> mallSet}
      // need a mall->region map
      fetchJSON("./data/malls.json").then(malls => {
        const region = {};
        malls.forEach(m => { region[m.mall_name] = m.planning_region || "Unknown"; });
        stores.forEach(s => {
          const r = region[s.mall] || "Unknown";
          if (!regions[r]) regions[r] = {};
          if (!regions[r][s.store_name]) regions[r][s.store_name] = new Set();
          regions[r][s.store_name].add(s.mall);
        });
        const rs = Object.entries(regions)
          .map(([r, brands]) => ({ r, brands, malls: new Set(stores.filter(s => (region[s.mall] || "Unknown") === r).map(s => s.mall)).size }))
          .filter(d => d.malls >= 2).slice(0, 4);

        const traces = rs.map((d, i) => {
          const top = Object.entries(d.brands).map(([b, ms]) => [b, ms.size])
            .sort((a, b) => b[1] - a[1]).slice(0, 10).reverse();
          return {
            type: "bar", orientation: "h", name: `${d.r} (${d.malls} malls)`,
            x: top.map(t => t[1]), y: top.map(t => t[0]),
            xaxis: "x" + (i + 1), yaxis: "y" + (i + 1),
            showlegend: false,
            marker: { color: "#6f42c1" },
            hovertemplate: "<b>%{y}</b><br>In %{x} of " + d.malls + " " + d.r + " malls<extra></extra>",
          };
        });
        const layout = Object.assign({}, layoutBase, {
          title: { text: "Top 10 anchor chains per region", font: { size: 14 } },
          height: 720,
          grid: { rows: 2, columns: 2, pattern: "independent" },
          annotations: rs.map((d, i) => ({
            text: `<b>${d.r}</b> · ${d.malls} malls`,
            showarrow: false, xref: "x" + (i + 1) + " domain", yref: "y" + (i + 1) + " domain",
            x: 0, y: 1.12, xanchor: "left",
          })),
          margin: { l: 30, r: 30, t: 50, b: 30 },
        });
        rs.forEach((_, i) => {
          layout["xaxis" + (i + 1)] = { gridcolor: "#eee" };
          layout["yaxis" + (i + 1)] = { automargin: true, tickfont: { size: 10 } };
        });
        plot(divId, traces, layout, cfg);
      });
    });
  }

  // Expose
  window.Charts = {
    parseCSV, fetchCSV, fetchText, fetchJSON, smartTable,
    similarityHeatmap, cookieCutterTable,
    topShopsBar, topShopsTable,
    scopeBar, mallsByShopCount, ownersBar, regionDonut,
    cuisineBars, cuisineByMall,
    provenanceStack,
    financialsScatter, financialsTable,
    ownerAnchors, regionAnchors,
    numHeat, pctHeat,
  };
})();
