/* Shared chart helpers for the nursing-room facilities reports. */
(function () {
  "use strict";

  function fetchJSON(p) { return fetch(p).then(r => r.json()); }

  const layoutBase = {
    font: { family: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", size: 12 },
    margin: { l: 80, r: 30, t: 40, b: 60 },
    paper_bgcolor: "white",
    plot_bgcolor: "#fafbfc",
  };
  // responsive:false — see shopping/assets/charts.js for rationale. We drive
  // chart resizes via ResizeObserver to avoid the iOS/Android "load then
  // collapse" bug caused by Plotly responding to URL-bar reflow events.
  const cfg = { responsive: false, displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d"] };

  function plot(divId, traces, layout, config) {
    const el = typeof divId === "string" ? document.getElementById(divId) : divId;
    if (!el) return Promise.resolve();
    return Plotly.newPlot(el, traces, layout, config || cfg).then(() => attachResize(el));
  }

  function attachResize(el) {
    if (!el || !window.ResizeObserver) return;
    let pending = false;
    new ResizeObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (el.clientWidth > 50 && el.clientHeight > 50) {
          try { Plotly.Plots.resize(el); } catch (_) { /* not yet plotted */ }
        }
      });
    }).observe(el);
  }

  // simple smart-table reused from shopping/assets/charts.js — kept local so this file is self-contained
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
      var setCount = n => { cnt.textContent = n + " of " + rows.length; };
      var rebuild = filt => {
        body.innerHTML = "";
        filt.forEach(r => body.appendChild(rowEl(r)));
        setCount(filt.length);
      };
      inp.addEventListener("input", () => {
        const q = inp.value.toLowerCase();
        rebuild(rows.filter(r => columns.some(c => String(r[c.key] ?? "").toLowerCase().includes(q))));
      });
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
        if (isNum) return ((parseFloat(av) || 0) - (parseFloat(bv) || 0)) * dir;
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
    if (opts.search !== false && setCount) setCount(rows.length);
  }

  // Heat map: malls (rows) × floors (cols), z = rooms count
  function roomsHeatmap(divId) {
    fetchJSON("./data/nursing_rooms_summary.json").then(summary => {
      // determine floor ordering: B2,B1,GF,L1..L8
      function fi(label) {
        if (!label) return 99;
        const s = label.toUpperCase();
        if (s === "GF" || s === "G") return 0;
        let m = s.match(/^B(\d+)$/); if (m) return -parseInt(m[1]);
        m = s.match(/^L?0*(\d+)$/);  if (m) return parseInt(m[1]);
        return 99;
      }
      const floorSet = new Set();
      summary.forEach(s => Object.keys(s.rooms_per_floor || {}).forEach(f => floorSet.add(f)));
      const floors = [...floorSet].filter(f => fi(f) !== 99).sort((a, b) => fi(a) - fi(b));
      // order malls by total rooms desc
      const malls = summary.slice().sort((a, b) => b.total_rooms - a.total_rooms);
      const z = malls.map(s => floors.map(f => (s.rooms_per_floor || {})[f] || 0));
      const text = malls.map(s => floors.map(f => {
        const v = (s.rooms_per_floor || {})[f] || 0;
        return v ? String(v) : "";
      }));
      plot(divId, [{
        type: "heatmap",
        z, x: floors, y: malls.map(s => s.mall),
        text, texttemplate: "%{text}",
        colorscale: [[0, "#f7fbff"], [0.001, "#deebf7"], [0.25, "#9ecae1"], [0.5, "#4292c6"], [1, "#08306b"]],
        zmin: 0, zmax: 4,
        hovertemplate: "<b>%{y}</b><br>Floor %{x}: %{z} room(s)<extra></extra>",
        colorbar: { title: "Rooms", thickness: 12, len: 0.6 },
        xgap: 1, ygap: 1,
      }], Object.assign({}, layoutBase, {
        title: { text: "Nursing rooms per floor, per mall (sorted by total rooms)", font: { size: 14 } },
        height: Math.max(700, malls.length * 18),
        margin: { l: 240, r: 30, t: 50, b: 60 },
        xaxis: { title: "Floor", side: "top", tickfont: { size: 11 } },
        yaxis: { automargin: true, tickfont: { size: 10 } },
      }), cfg);
    });
  }

  function facilitiesTable(divId) {
    fetchJSON("./data/nursing_rooms_summary.json").then(summary => {
      const data = summary.map(s => ({
        mall: s.mall,
        operator: s.operator || "—",
        total: s.total_rooms || 0,
        open: s.open_rooms || 0,
        closed: s.closed_rooms || 0,
        floors: (s.floors_with_a_room || []).join(", ") || "—",
        capacity: s.capacity_published || null,
        avg_walk: s.avg_walk_m_to_entrance,
        max_walk: s.max_walk_m_to_entrance,
        avg_vert: s.avg_vertical_floors_to_nearest_room,
        confidence: s.source_confidence || "—",
      }));
      smartTable(divId, data, [
        { key: "mall",      label: "Mall" },
        { key: "operator",  label: "Operator" },
        { key: "total",     label: "Rooms",   num: true },
        { key: "open",      label: "Open",    num: true },
        { key: "closed",    label: "Closed",  num: true },
        { key: "floors",    label: "Floors with a room" },
        { key: "capacity",  label: "Capacity",  num: true, render: v => v == null ? "—" : v },
        { key: "avg_walk",  label: "Avg walk (m)", num: true, render: v => v == null ? "—" : v },
        { key: "max_walk",  label: "Max walk (m)", num: true, render: v => v == null ? "—" : v },
        { key: "avg_vert",  label: "Avg floors to room", num: true, render: v => v == null ? "—" : v },
        { key: "confidence", label: "Source",
          render: v => `<span class="cell-heat" style="background:${
            v === "official" ? "#d4edda" : v === "mixed" ? "#fff3cd" : "#f8d7da"}">${v}</span>` },
      ], { sortIdx: 2, sortDir: "desc" });
    });
  }

  // Bubble plot: capacity vs avg walking distance (for Mappedin malls)
  function walkingDistanceScatter(divId) {
    fetchJSON("./data/nursing_rooms_summary.json").then(summary => {
      const mp = summary.filter(s => s.avg_walk_m_to_entrance != null);
      plot(divId, [{
        type: "scatter", mode: "markers+text",
        x: mp.map(s => s.avg_walk_m_to_entrance),
        y: mp.map(s => s.max_walk_m_to_entrance),
        text: mp.map(s => s.mall),
        textposition: "top center", textfont: { size: 10 },
        marker: { size: mp.map(s => Math.max(10, s.total_rooms * 3)),
                  color: "#0d6efd", opacity: 0.75, line: { width: 1, color: "white" } },
        hovertemplate: "<b>%{text}</b><br>Avg: %{x} m · Max: %{y} m<br>%{marker.size} rooms<extra></extra>",
      }], Object.assign({}, layoutBase, {
        title: { text: "Mappedin malls — avg vs worst-case walking metres to nearest entrance", font: { size: 14 } },
        height: 480,
        xaxis: { title: "Avg walking metres", gridcolor: "#eee" },
        yaxis: { title: "Max walking metres", gridcolor: "#eee" },
      }), cfg);
    });
  }

  // ---------- analytics page: derived metrics from per_mall_context.json ----------

  function provisionTable(divId) {
    fetchJSON("./data/per_mall_context.json").then(ctx => {
      const rows = ctx.filter(r => r.num_stores && r.total_rooms).map(r => ({
        mall: r.mall,
        owner: r.owner_group || "—",
        rooms: r.total_rooms,
        shops: r.num_stores,
        rooms_per_100: +(r.total_rooms / r.num_stores * 100).toFixed(2),
        floors_covered: r.retail_floors_with_room || 0,
        floors_total: r.retail_floors_in_data || 0,
        floor_pct: r.retail_floors_in_data
          ? Math.round(100 * (r.retail_floors_with_room || 0) / r.retail_floors_in_data)
          : null,
      }));
      const maxRp = Math.max(...rows.map(r => r.rooms_per_100));
      smartTable(divId, rows, [
        { key: "mall",  label: "Mall" },
        { key: "owner", label: "Owner" },
        { key: "rooms", label: "Rooms",        num: true },
        { key: "shops", label: "Shops",        num: true },
        { key: "rooms_per_100", label: "Rooms / 100 shops", num: true,
          render: v => {
            const ratio = v / maxRp;
            const hue = 90 + ratio * 100;          // yellow → green
            const light = 92 - ratio * 18;
            return `<span class="cell-heat" style="background:hsl(${hue},70%,${light}%)">${v}</span>`;
          } },
        { key: "floor_pct", label: "Retail floors covered %", num: true,
          render: (v, r) => v == null ? "—" :
            `<span class="cell-heat" style="background:hsl(${v * 1.2},65%,${92 - v * 0.18}%)">${v}% (${r.floors_covered}/${r.floors_total})</span>` },
      ], { sortIdx: 4, sortDir: "desc" });
    });
  }

  function floorCoverageBars(divId) {
    fetchJSON("./data/per_mall_context.json").then(ctx => {
      const rows = ctx.filter(r => r.retail_floors_in_data && r.retail_floors_in_data > 0)
                      .map(r => ({
                        mall: r.mall,
                        pct: Math.round(100 * (r.retail_floors_with_room || 0) / r.retail_floors_in_data),
                        cov: r.retail_floors_with_room || 0,
                        tot: r.retail_floors_in_data,
                      }))
                      .sort((a, b) => a.pct - b.pct);
      const colors = rows.map(r =>
        r.pct >= 60 ? "#28a745" : r.pct >= 30 ? "#fd7e14" : "#dc3545");
      plot(divId, [{
        type: "bar", orientation: "h",
        x: rows.map(r => r.pct),
        y: rows.map(r => r.mall),
        text: rows.map(r => `${r.pct}% (${r.cov}/${r.tot} floors)`),
        textposition: "outside",
        marker: { color: colors },
        hovertemplate: "<b>%{y}</b><br>%{text}<extra></extra>",
      }], Object.assign({}, layoutBase, {
        title: { text: "Retail floors with a nursing room — coverage % per mall", font: { size: 14 } },
        height: Math.max(420, rows.length * 22),
        margin: { l: 220, r: 110, t: 50, b: 50 },
        xaxis: { title: "% of retail floors with at least one room", range: [0, 110], gridcolor: "#eee" },
        yaxis: { automargin: true, tickfont: { size: 11 } },
      }));
    });
  }

  function familyFriendlyScore(divId) {
    fetchJSON("./data/per_mall_context.json").then(ctx => {
      // include malls that have at least nursing data + store-level join
      const rows = ctx.filter(r => r.store_mall_name).map(r => {
        const halal_share = r.fnb ? r.halal_fnb / r.fnb : 0;
        // cap room/kids scores so a single mega-mall doesn't dominate
        const rooms_score = Math.min(r.total_rooms || 0, 10) / 10;
        const kids_score  = Math.min(r.kids_stores || 0, 12) / 12;
        const halal_score = Math.min(halal_share, 0.5) / 0.5;    // 50% halal F&B saturates the score
        const super_score = r.has_supermarket ? 1 : 0;
        const composite = (rooms_score + kids_score + halal_score + super_score) / 4;
        return {
          mall: r.mall,
          composite: +composite.toFixed(3),
          rooms_score: +rooms_score.toFixed(3),
          kids_score:  +kids_score.toFixed(3),
          halal_score: +halal_score.toFixed(3),
          super_score,
          rooms: r.total_rooms || 0,
          kids: r.kids_stores || 0,
          halal: r.halal_fnb || 0,
          fnb: r.fnb || 0,
          supermarket: r.has_supermarket,
        };
      }).sort((a, b) => b.composite - a.composite).slice(0, 25);
      const components = [
        { key: "rooms_score", label: "Nursing rooms (cap 10)", color: "#0d6efd" },
        { key: "kids_score",  label: "Kids stores (cap 12)",   color: "#fd7e14" },
        { key: "halal_score", label: "Halal F&B share (cap 50%)", color: "#198754" },
        { key: "super_score", label: "Supermarket on-site",    color: "#6f42c1" },
      ];
      const traces = components.map(c => ({
        type: "bar", orientation: "h", name: c.label,
        x: rows.map(r => r[c.key]).reverse(),
        y: rows.map(r => r.mall).reverse(),
        marker: { color: c.color },
        hovertemplate: rows.slice().reverse().map(r =>
          `<b>${r.mall}</b><br>${c.label}: ${r[c.key]}<br>` +
          `Rooms: ${r.rooms} · Kids: ${r.kids} · Halal F&B: ${r.halal}/${r.fnb} · Supermarket: ${r.supermarket ? "yes" : "no"}<extra></extra>`),
        hovertext: rows.slice().reverse().map(r => r.mall),
      }));
      plot(divId, traces, Object.assign({}, layoutBase, {
        title: { text: "Family-friendly composite — top 25 malls (4 capped components, each 0–1)", font: { size: 14 } },
        barmode: "stack",
        height: Math.max(500, rows.length * 24),
        margin: { l: 220, r: 30, t: 50, b: 60 },
        xaxis: { title: "Composite score (4 of 4 = max)", range: [0, 4.05], gridcolor: "#eee" },
        yaxis: { automargin: true },
        legend: { orientation: "h", y: -0.08 },
      }));
    });
  }

  function capacityDisclosure(divId) {
    fetchJSON("./data/per_mall_context.json").then(ctx => {
      const total = ctx.length;
      const published = ctx.filter(r => r.capacity_published).length;
      const unpublished = total - published;
      plot(divId, [{
        type: "pie",
        labels: ["Published on operator's digital channels", "Not surfaced online"],
        values: [published, unpublished],
        hole: 0.55,
        marker: { colors: ["#0d6efd", "#e9ecef"] },
        textinfo: "label+value",
        textposition: "outside",
        hovertemplate: "%{label}<br>%{value} of " + total + " malls<extra></extra>",
      }], Object.assign({}, layoutBase, {
        title: { text: `Capacity disclosed online: ${published} of ${total} malls`, font: { size: 14 } },
        height: 380,
        showlegend: false,
        annotations: [{ text: `${Math.round(100*published/total)}%`, x: 0.5, y: 0.5,
          showarrow: false, font: { size: 22 } }],
      }));
    });
  }

  function operatorLeagueTable(divId) {
    fetchJSON("./data/per_mall_context.json").then(ctx => {
      const byOwner = {};
      ctx.forEach(r => {
        const o = r.owner_group;
        if (!o) return;
        if (!byOwner[o]) byOwner[o] = {
          owner: o, malls: 0, rooms: 0, official: 0,
          capPublished: 0, floorPctSum: 0, floorPctN: 0,
          walkSum: 0, walkN: 0,
        };
        const b = byOwner[o];
        b.malls += 1;
        b.rooms += r.total_rooms || 0;
        if (r.source_confidence === "official") b.official += 1;
        if (r.capacity_published) b.capPublished += 1;
        if (r.retail_floors_in_data) {
          b.floorPctSum += 100 * (r.retail_floors_with_room || 0) / r.retail_floors_in_data;
          b.floorPctN += 1;
        }
        if (r.avg_walk_m_to_entrance != null) {
          b.walkSum += r.avg_walk_m_to_entrance;
          b.walkN += 1;
        }
      });
      const rows = Object.values(byOwner).filter(b => b.malls >= 2).map(b => ({
        owner: b.owner,
        malls: b.malls,
        rooms: b.rooms,
        avg_rooms: +(b.rooms / b.malls).toFixed(2),
        avg_floor_cov: b.floorPctN ? Math.round(b.floorPctSum / b.floorPctN) : null,
        pct_official: Math.round(100 * b.official / b.malls),
        pct_cap_published: Math.round(100 * b.capPublished / b.malls),
        avg_walk: b.walkN ? Math.round(b.walkSum / b.walkN) : null,
      }));
      // Neutral single-hue wash so no row reads as a red flag — this is a
      // descriptive view of the dataset, not a scorecard of operators.
      const wash = v => v == null ? "—" :
        `<span class="cell-heat" style="background:hsl(210,45%,${96 - Math.min(v, 100) * 0.18}%)">${v}${typeof v === "number" && v <= 100 ? "%" : ""}</span>`;
      smartTable(divId, rows, [
        { key: "owner",            label: "Owner group" },
        { key: "malls",            label: "Malls in dataset",   num: true },
        { key: "rooms",            label: "Total rooms",        num: true },
        { key: "avg_rooms",        label: "Avg rooms / mall",   num: true,
          render: v => `<span class="cell-heat" style="background:hsl(210,45%,${96 - Math.min(v*4, 18)}%)">${v}</span>` },
        { key: "avg_floor_cov",    label: "Avg floor coverage %", num: true, render: wash },
        { key: "pct_official",     label: "% with operator-published data online", num: true, render: wash },
        { key: "pct_cap_published", label: "% capacity online",   num: true, render: wash },
        { key: "avg_walk",         label: "Avg walk (m, Mappedin only)", num: true,
          render: v => v == null ? "—" : v + " m" },
      ], { sortIdx: 3, sortDir: "desc", search: false });
    });
  }

  window.NursingCharts = {
    roomsHeatmap, facilitiesTable, walkingDistanceScatter,
    provisionTable, floorCoverageBars, familyFriendlyScore, capacityDisclosure,
    operatorLeagueTable,
  };
})();
