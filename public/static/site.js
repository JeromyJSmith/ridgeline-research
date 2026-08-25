/*
  Ridgeline OpenBIM — Investor Site behavior.
  Reads canonical data from window.RIDGELINE (assets/numbers.js).
*/
(function () {
  "use strict";
  const R = window.RIDGELINE;
  if (!R) { console.error("RIDGELINE numbers not loaded"); return; }

  // ── Utilities ──
  const fmtUsd = (v, opts = {}) => {
    if (v == null) return "—";
    const abs = Math.abs(v);
    if (abs >= 1e9) return (opts.sign ? (v < 0 ? "−" : "") : "") + "$" + (abs / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
    if (abs >= 1e6) return "$" + (abs / 1e6).toFixed(abs / 1e6 >= 100 ? 0 : (abs / 1e6 >= 10 ? 1 : 2)).replace(/\.?0+$/, "") + "M";
    if (abs >= 1e3) return "$" + (abs / 1e3).toFixed(0) + "K";
    return "$" + v.toLocaleString();
  };
  const fmtUsdFull = (v) => "$" + v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const fmtPct = (v) => (v * 100).toFixed(1) + "%";
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ── Boot on DOM ready ──
  function boot () {
    initScrollSpy();
    initGlossary();
    initWedge();
    initCompetitorTable();
    initInvestorTable();
    initFilterChips();
    initExpandAll();
    initCopyMath();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // ── Nav scroll-spy ──
  function initScrollSpy () {
    const links = $$(".nav-links a");
    const linkMap = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    const sections = $$("section[id]").filter(s => linkMap.has(s.id));
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      // Pick the topmost visible section
      const visible = entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) {
        links.forEach(a => a.classList.remove("active"));
        const first = visible[0].target.id;
        linkMap.get(first)?.classList.add("active");
      }
    }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  // ── Glossary tooltip ──
  function initGlossary () {
    const gloss = R.glossary;
    let tooltip = null;

    // Auto-wrap first mention of each acronym in prose
    // We do this cautiously — only within .prose and .card p elements to avoid mangling tables.
    const seen = new Set();
    const acronyms = Object.keys(gloss).sort((a, b) => b.length - a.length); // longest first
    const rxParts = acronyms.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    const rx = new RegExp("(?<![A-Za-z0-9])(" + rxParts + ")(?![A-Za-z0-9])", "g");

    const walk = (node) => {
      if (node.nodeType === 3) {
        const text = node.nodeValue;
        if (!text || text.length < 3) return;
        rx.lastIndex = 0;
        if (!rx.test(text)) return;
        rx.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let last = 0, m;
        while ((m = rx.exec(text)) !== null) {
          const key = m[1];
          if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          if (seen.has(key)) {
            frag.appendChild(document.createTextNode(m[0]));
          } else {
            seen.add(key);
            const span = document.createElement("span");
            span.className = "acronym";
            span.dataset.key = key;
            span.textContent = m[0];
            frag.appendChild(span);
          }
          last = m.index + m[0].length;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        const tag = node.tagName;
        if (tag === "A" || tag === "CODE" || tag === "SCRIPT" || tag === "STYLE") return;
        if (node.classList && node.classList.contains("acronym")) return;
        if (node.classList && node.classList.contains("kicker")) return;
        Array.from(node.childNodes).forEach(walk);
      }
    };

    $$("[data-glossary]").forEach(root => walk(root));

    // Tooltip on hover
    function makeTip () {
      if (tooltip) return tooltip;
      tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      document.body.appendChild(tooltip);
      return tooltip;
    }

    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest(".acronym");
      if (!t) return;
      const key = t.dataset.key;
      const def = gloss[key];
      if (!def) return;
      const tip = makeTip();
      tip.innerHTML = `<span class="tt-key">${key}</span>${def}`;
      tip.classList.add("visible");
      const r = t.getBoundingClientRect();
      tip.style.left = Math.max(8, Math.min(window.innerWidth - 300, r.left)) + "px";
      tip.style.top = (r.bottom + 6) + "px";
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest && e.target.closest(".acronym") && tooltip) tooltip.classList.remove("visible");
    });
  }

  // ── EV wedge click-to-expand ──
  function initWedge () {
    $$(".wedge-row").forEach(row => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        row.classList.toggle("open");
      });
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); row.classList.toggle("open"); }
      });
    });
  }

  // ── Competitor table (sortable, filterable, pinned Ridgeline) ──
  function initCompetitorTable () {
    const wrap = $("#competitor-table");
    if (!wrap) return;
    const { columns, rows } = R.competitors;

    // Render
    const boolCell = (v, key) => {
      if (v === true)      return `<span class="bool yes"    title="Yes"></span>`;
      if (v === false)     return `<span class="bool no"     title="No"></span>`;
      if (v === "partial") return `<span class="bool partial" title="Partial"></span>`;
      if (v === "self")    return `<span class="bool self"   title="This is the host itself"></span>`;
      if (v === "via CEF") return `<span class="bool via"    title="Available via CEF Web-Palette"></span>`;
      return String(v);
    };

    const render = (data) => {
      const thead = `<thead><tr>${columns.map((c, i) => `<th class="sortable" data-col="${c.key}">${c.label}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${data.map(r => `
        <tr class="${r.isRidgeline ? "ridgeline" : ""}">
          ${columns.map(c => {
            const v = r[c.key];
            if (c.kind === "bool") return `<td>${boolCell(v, c.key)}</td>`;
            return `<td>${v == null ? "—" : v}</td>`;
          }).join("")}
        </tr>`).join("")}</tbody>`;
      wrap.innerHTML = `<table class="data">${thead}${tbody}</table>`;
      bindSort(wrap.querySelector("table.data"), data);
    };

    let sortKey = null, sortDir = 1;
    const boolWeight = (v) => v === true ? 3 : v === "partial" || v === "via CEF" || v === "self" ? 2 : v === false ? 0 : 1;
    function bindSort (table, data) {
      $$("th.sortable", table).forEach(th => {
        th.addEventListener("click", () => {
          const key = th.dataset.col;
          if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = 1; }
          $$("th", table).forEach(x => x.classList.remove("sort-asc", "sort-desc"));
          th.classList.add(sortDir === 1 ? "sort-asc" : "sort-desc");
          const col = columns.find(c => c.key === key);
          // Ridgeline row always stays pinned at top
          const pinned = data.filter(r => r.isRidgeline);
          const rest = data.filter(r => !r.isRidgeline);
          rest.sort((a, b) => {
            const av = a[key], bv = b[key];
            if (col.kind === "bool") return (boolWeight(bv) - boolWeight(av)) * sortDir;
            const as = String(av ?? "").toLowerCase(), bs = String(bv ?? "").toLowerCase();
            return as < bs ? -1 * sortDir : as > bs ? 1 * sortDir : 0;
          });
          render([...pinned, ...rest]);
        });
      });
    }

    render(rows);

    // Search filter
    const search = $("#competitor-search");
    if (search) {
      search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        if (!q) return render(rows);
        const filtered = rows.filter(r => {
          if (r.isRidgeline) return true; // always show reference
          return columns.some(c => String(r[c.key] ?? "").toLowerCase().includes(q));
        });
        render(filtered);
      });
    }
  }

  // ── Investor table (sortable by fit) ──
  function initInvestorTable () {
    const wrap = $("#investor-table");
    if (!wrap) return;
    const rows = R.investors;
    const typeFilter = $("#investor-type-filter");

    let filter = "all";
    let sortKey = "fit", sortDir = -1;

    const fitStars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
    const typeClass = (t) => {
      if (/CVC/i.test(t)) return "gold";
      if (/Accelerator/i.test(t)) return "warn";
      return "";
    };

    const render = () => {
      let data = rows.slice();
      if (filter === "thematic")   data = data.filter(r => !/CVC|Accelerator/i.test(r.type));
      if (filter === "cvc")        data = data.filter(r =>  /CVC/i.test(r.type));
      if (filter === "unverified") data = data.filter(r => /unverified/i.test(r.thesis));

      data.sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "number") return (av - bv) * sortDir;
        return String(av).localeCompare(String(bv)) * sortDir;
      });

      const table = `
        <table class="data">
          <thead><tr>
            <th class="sortable" data-col="name">Fund</th>
            <th class="sortable" data-col="type">Type</th>
            <th class="sortable" data-col="stage">Stage</th>
            <th class="sortable" data-col="checkUsd">Check ($M)</th>
            <th class="sortable" data-col="fit">Fit</th>
            <th>Thesis</th>
            <th>Ref</th>
          </tr></thead>
          <tbody>
          ${data.map(r => `
            <tr class="${/unverified/i.test(r.thesis) ? "warn" : ""}">
              <td><strong>${r.name}</strong></td>
              <td><span class="pill ${typeClass(r.type)}">${r.type}</span></td>
              <td class="mono">${r.stage}</td>
              <td class="num">${r.checkUsd}</td>
              <td class="num" style="color:var(--gold-600);letter-spacing:1px">${fitStars(r.fit)}</td>
              <td>${r.thesis}</td>
              <td class="mono"><span style="color:var(--n-300)">${r.publication}</span></td>
            </tr>`).join("")}
          </tbody>
        </table>`;
      wrap.innerHTML = table;

      $$("th.sortable", wrap).forEach(th => {
        th.addEventListener("click", () => {
          const key = th.dataset.col;
          if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = key === "fit" ? -1 : 1; }
          $$("th", wrap).forEach(x => x.classList.remove("sort-asc", "sort-desc"));
          th.classList.add(sortDir === 1 ? "sort-asc" : "sort-desc");
          render();
        });
        if (th.dataset.col === sortKey) th.classList.add(sortDir === 1 ? "sort-asc" : "sort-desc");
      });
    };

    if (typeFilter) {
      typeFilter.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        $$(".chip", typeFilter).forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        filter = chip.dataset.filter;
        render();
      });
    }
    render();
  }

  // ── Generic chip groups (backup) ──
  function initFilterChips () {
    // handled per-table above
  }

  // ── Expand-all / collapse-all buttons ──
  function initExpandAll () {
    $$("[data-toggle-all]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = document.querySelector(btn.dataset.toggleAll);
        if (!target) return;
        const all = $$("details.drill", target);
        const allOpen = all.every(d => d.open);
        all.forEach(d => d.open = !allOpen);
        btn.textContent = allOpen ? "Expand all" : "Collapse all";
      });
    });
  }

  // ── Copy-math on wedge rows (small utility) ──
  function initCopyMath () {
    $$(".math[data-copy]").forEach(m => {
      m.style.cursor = "copy";
      m.title = "Click to copy";
      m.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(m.textContent.trim());
        const orig = m.textContent;
        m.textContent = "✓ copied";
        setTimeout(() => m.textContent = orig, 900);
      });
    });
  }

  // ── Public helpers (used by inline template blocks) ──
  window.RIDGELINE.util = { fmtUsd, fmtUsdFull, fmtPct };

})();
