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
  const cfg = { responsive: true, displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d"] };

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
      Plotly.newPlot(divId, [{
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
      Plotly.newPlot(divId, [{
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

  window.NursingCharts = { roomsHeatmap, facilitiesTable, walkingDistanceScatter };
})();
