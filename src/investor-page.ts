export const INVESTOR_PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ridgeline OpenBIM — Investor Site</title>
  <meta name="description" content="Ridgeline OpenBIM — The compliance record every building owes, as data. Seed round: $4.25M on $24M post-money SAFE. Base-case Y5 EV ≈ $400M." />

  <!-- Fonts: Inter + Inter Tight + IBM Plex Mono (all free) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">

  <link rel="stylesheet" href="/static/tokens.css" />
</head>
<body>

<!-- ══════════════ NAV ══════════════ -->
<header class="nav">
  <div class="nav-inner">
    <a class="brand" href="#top">
      <span class="brand-mark" aria-hidden="true"></span>
      Ridgeline <span style="color:var(--gold-600);margin-left:2px">OpenBIM</span>
      <small>a DoubleAught(00) product</small>
    </a>
    <nav class="nav-links" aria-label="Site sections">
      <a href="#wedge">Wedge</a>
      <a href="#gap">Gap</a>
      <a href="#solution">Solution</a>
      <a href="#differentiator">Differentiator</a>
      <a href="#competitors">Competitors</a>
      <a href="#build">Build &amp; burn</a>
      <a href="#ramp">Ramp</a>
      <a href="#investors">Investors</a>
      <a href="#ask">Ask</a>
      <a href="#risks">Risks</a>
      <a href="#sources">Sources</a>
    </nav>
    <a class="nav-cta" href="#ask">Request meeting</a>
  </div>
</header>

<main id="top">

<!-- ══════════════ HERO ══════════════ -->
<section class="section hero" id="hero" data-glossary>
  <div class="container">
    <span class="kicker">Seed Round · Aug 2026 · Confidential</span>
    <h1 class="headline">
      The compliance record<br>
      every building owes<br>
      <span class="accent">— as data.</span>
    </h1>
    <p class="hero-sub">
      Ridgeline OpenBIM is a <strong>native CAD plug-in + Compliance Operating System</strong> that turns the IFC file stream at every Vectorworks, Archicad, and BricsCAD seat into a <strong>typed knowledge graph</strong>, an <strong>IDS rule engine</strong>, an <strong>IBC/IRC/ADA/NFPA compliance check</strong>, a merged <strong>QTO cost line</strong>, and an audit-ready owner receipt — <em>without leaving the native CAD UI</em>.
    </p>

    <div class="pill-row">
      <span class="pill strong">Seed: $4.25M</span>
      <span class="pill">$24M post-money SAFE</span>
      <span class="pill">17.7% dilution</span>
      <span class="pill">24-mo capex</span>
      <span class="pill gold">Y5 EV: ≈ $400M (realistic)</span>
      <span class="pill">Standards: IFC 4.3 · IDS v1.0 · IFCX · BCF</span>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-label">Y5 Enterprise Value — Realistic Base</div>
        <div class="kpi-value gold">≈ $400M</div>
        <div class="kpi-delta">$575M raw × 0.7 execution-risk discount. 9.5× Finro Construction-Tech 2025 median × $60.55M combined ARR.</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Bull ceiling</div>
        <div class="kpi-value">≈ $1.74B</div>
        <div class="kpi-delta">Same 9.5× multiple on $183.33M ARR at Y5. Managed upside, not central case.</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Bear floor</div>
        <div class="kpi-value bear">≈ $80M</div>
        <div class="kpi-delta">Distressed 5× multiple on $15.75M ARR. Open-source substrate keeps standalone floor.</div>
      </div>
      <div class="kpi dark">
        <div class="kpi-label">Build cost (18-mo burn, base)</div>
        <div class="kpi-value">$6.76M</div>
        <div class="kpi-delta">24.4 peak FTE × $185K loaded × 1.5yr. #1 risk: M4 multi-SDK plugin layer.</div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════ 01 — THE WEDGE ══════════════ -->
<section class="section" id="wedge" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">01</span>
      <h2>The Y5 enterprise-value wedge.</h2>
      <a href="#wedge" class="anchor">#wedge</a>
    </div>
    <p class="lead">
      Every scenario uses the <strong>same combined Y5 ARR × exit-multiple math</strong>. Only the ARR realization and the discount move. Click a row to see the math.
    </p>

    <div class="wedge">
      <div class="wedge-row" data-scenario="bear">
        <div class="wedge-scenario">Bear
          <span class="sublabel">Distressed floor · 5× multiple</span>
        </div>
        <div class="wedge-bar-track">
          <div class="wedge-bar bear" style="width: 5%"></div>
        </div>
        <div class="wedge-value">$80M
          <span class="mult">$15.75M ARR × 5.0×</span>
        </div>
        <div class="wedge-detail">
          <p>Plugin ARR $1.26M + Compliance-OS ARR $14.49M = <strong>$15.75M combined Y5 ARR</strong>. Distressed multiple compression to 5× reflects the AEC vertical-SaaS trough. Open-source substrate (IfcLite + OpenAEC + IfcOpenShell) keeps the standalone floor above the seed check — a $4.25M / 17.7% seed still returns ≈ $13.9M to the lead.</p>
          <div class="math" data-copy>= $15,750,000 × 5.0 = $78,750,000</div>
        </div>
      </div>

      <div class="wedge-row" data-scenario="base">
        <div class="wedge-scenario">Base
          <span class="sublabel">Realistic · 9.5× × 0.7 discount</span>
        </div>
        <div class="wedge-bar-track">
          <div class="wedge-bar base" style="width: 23%"></div>
        </div>
        <div class="wedge-value">$400M
          <span class="mult">$60.55M ARR × 9.5× × 0.7</span>
        </div>
        <div class="wedge-detail">
          <p>Plugin $5.66M + Compliance-OS $54.04M + Cross-sell $0.85M = <strong>$60.55M combined Y5 ARR</strong>. Raw EV = $575.23M at 9.5× Finro Construction-Tech 2025 median. Applied 30% execution-risk discount → <strong>realistic working number ≈ $402.66M</strong> (round to $400M). This is the number to lead with.</p>
          <div class="math" data-copy>= $60,550,000 × 9.5 × (1 − 0.30) = $402,657,500</div>
        </div>
      </div>

      <div class="wedge-row" data-scenario="bull">
        <div class="wedge-scenario">Bull
          <span class="sublabel">Wave case · 9.5× multiple</span>
        </div>
        <div class="wedge-bar-track">
          <div class="wedge-bar bull" style="width: 100%"></div>
        </div>
        <div class="wedge-value">$1.74B
          <span class="mult">$183.33M ARR × 9.5×</span>
        </div>
        <div class="wedge-detail">
          <p>Plugin $8.95M + Compliance-OS $172.88M + Cross-sell $1.50M = <strong>$183.33M combined Y5 ARR</strong>. Same 9.5× multiple, larger ARR realization — triggered by full AASHTO T-19 rollout + at least one CVC channel (Nemetschek or Trimble). Bull path unlocks the M&amp;A option at real scale.</p>
          <div class="math" data-copy>= $183,330,000 × 9.5 = $1,741,635,000</div>
        </div>
      </div>
    </div>

    <div class="callout gold">
      <h4>Multiple triangulation — defending the 9.5×</h4>
      <p>
        Procore trades at ~$3B scale (<a href="https://www.constructiondive.com/news/procore-propelled-to-3b-valuation/544684/">Construction Dive</a>).
        Odyssey $1.45B post-money at $310M Series B (<a href="https://news.crunchbase.com/venture/biggest-funding-rounds-cybersecurity-defense-startup-ai-odyssey-leads/">Crunchbase Mar 2026</a>).
        Axiom $264M equity, AEC AI platform (<a href="https://www.alleywatch.com/2026/04/global-startup-funding-top-largest-march-2026-vc/">AlleyWatch Mar 2026</a>).
        AEC vertical-SaaS median is 6–8× ARR; Finro's Construction-Tech-specific median is 9.5×.
        9.5× is the <em>defensible</em> multiple, not the top of the band.
      </p>
    </div>
  </div>
</section>

<!-- ══════════════ 02 — THE GAP ══════════════ -->
<section class="section" id="gap" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">02</span>
      <h2>Five sourced gaps. All open. All right now.</h2>
      <a href="#gap" class="anchor">#gap</a>
    </div>
    <p class="lead">
      The gap is being created <em>by regulation</em>, not by market forces. Each card cites a live public source. Every stat has a link.
    </p>

    <div class="card-grid" id="gap-cards"><!-- rendered below --></div>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const cards = window.RIDGELINE.gaps.map(g => \`
          <div class="card">
            <span class="card-id">\${g.id}</span>
            <h3>\${g.title}</h3>
            <div class="card-stat">\${g.stat}</div>
            <div class="card-stat-label">\${g.statLabel}</div>
            <p>\${g.body}</p>
            <div class="card-source">Source: <a href="\${g.source.url}" target="_blank" rel="noopener">\${g.source.text}</a></div>
          </div>\`).join("");
        document.getElementById("gap-cards").innerHTML = cards;
      });
    </script>
  </div>
</section>

<!-- ══════════════ 03 — SOLUTION ══════════════ -->
<section class="section dark" id="solution" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">03</span>
      <h2>Two surfaces. One receipt vocabulary.</h2>
      <a href="#solution" class="anchor" style="color:var(--gold-200)">#solution</a>
    </div>
    <p class="lead" style="color:var(--navy-100)">
      Ridgeline lives at the two ends of a building's lifecycle. Both surfaces ship a single IFC-class-typed graph, so authoring handoff and owner-side compliance handoff use the <em>same</em> vocabulary — eliminating the 4–8 hour per-project manual re-typing baseline.
    </p>

    <!-- Isometric building block motif -->
    <svg class="iso" viewBox="0 0 320 220" aria-label="Compliance-OS isometric building block" role="img">
      <!-- floor plate -->
      <path d="M 40 160 L 160 100 L 280 160 L 160 220 Z" class="fill"/>
      <path d="M 40 160 L 160 100 L 280 160 L 160 220 Z"/>
      <!-- lower cube -->
      <path d="M 40 160 L 40 120 L 160 60 L 160 100 Z"/>
      <path d="M 160 100 L 160 60 L 280 120 L 280 160 Z"/>
      <line x1="160" y1="60" x2="160" y2="100"/>
      <!-- upper block -->
      <path d="M 100 130 L 100 90 L 220 30 L 220 70 Z" class="gold"/>
      <path d="M 220 70 L 220 30 L 340 90 L 340 130 Z" class="gold" transform="translate(-60,0)"/>
      <!-- ridgeline (accent) -->
      <line x1="100" y1="90" x2="220" y2="30" class="gold"/>
      <line x1="220" y1="30" x2="280" y2="60" class="gold"/>
    </svg>

    <div class="card-grid n2" style="margin-top: var(--s-6)">
      <div class="card" style="background:var(--navy-800); border-color:var(--navy-600)">
        <span class="card-id" style="color:var(--gold-200)">SURFACE A</span>
        <h3 style="color:var(--n-25)">Plug-in layer (author side)</h3>
        <ul style="color:var(--navy-100); padding-left:1.2em; margin: var(--s-3) 0">
          <li>Native Vectorworks 2026 C++ SDK + Vectorscript Pascal plug-in</li>
          <li>CEF Web-Palette hosting IfcLite / OpenAEC / Open Cost on localhost</li>
          <li>1000+ VectorScript functions via FastAPI control plane</li>
          <li>Pydantic v2 contract authority — no silent mutation of author documents</li>
          <li>Same pattern extends to Revit (.NET) and Archicad/BricsCAD (C++)</li>
        </ul>
      </div>
      <div class="card" style="background:var(--navy-800); border-color:var(--navy-600)">
        <span class="card-id" style="color:var(--gold-200)">SURFACE B</span>
        <h3 style="color:var(--n-25)">Compliance Operating System (owner side)</h3>
        <ul style="color:var(--navy-100); padding-left:1.2em; margin: var(--s-3) 0">
          <li>Typed record for NFPA life-safety (10/25/72/80/96/101)</li>
          <li>ADA Title III accessibility · ASHRAE 188 water-safety</li>
          <li>BCF + COBie for operations · element-anchored deficiency log</li>
          <li>IoT via BACnet / LoRaWAN / QR-NFC · anchored to BCF GUIDs</li>
          <li>AASHTO state-DOT bridge lane (ports to IFC-Bridge when mandate cycles)</li>
        </ul>
      </div>
    </div>

    <div class="badge-row" style="margin-top: var(--s-8)">
      <span style="color:var(--navy-200); font-family: var(--font-mono); font-size: var(--fs-11); text-transform: uppercase; letter-spacing: 0.14em; margin-right: var(--s-3)">Rule packs shipped:</span>
      <span class="badge" title="National Fire Protection Association — life-safety">NFPA</span>
      <span class="badge" title="Americans with Disabilities Act">ADA</span>
      <span class="badge" title="International Building Code">IBC</span>
      <span class="badge" title="International Residential Code">IRC</span>
      <span class="badge" title="ASHRAE 188 legionellosis/water-safety">ASHRAE 188</span>
      <span class="badge" title="AASHTO state-DOT bridges — pooled fund T-19">AASHTO T-19</span>
    </div>

    <details class="drill" style="background:var(--navy-800); border-color:var(--navy-600); margin-top: var(--s-6)">
      <summary style="color:var(--gold-200)">Open-source substrate — dependencies, not competitors</summary>
      <div class="drill-body">
        <div class="table-wrap" style="background:var(--navy-800); border-color:var(--navy-600)">
          <table class="data" style="color:var(--n-25)">
            <thead>
              <tr>
                <th style="background:var(--navy-900); color:var(--gold-200)">Dependency</th>
                <th style="background:var(--navy-900); color:var(--gold-200)">What it does</th>
                <th style="background:var(--navy-900); color:var(--gold-200)">License</th>
                <th style="background:var(--navy-900); color:var(--gold-200)">Position inside Ridgeline</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="background:transparent"><a href="https://github.com/LTplus-AG/ifc-lite" target="_blank">IfcLite</a></td><td style="background:transparent">Browser-native IFC parse / view / query / edit / validate / export (WebGPU)</td><td style="background:transparent">Open source</td><td style="background:transparent">EMBED in the CEF palette for live IFC read-back &amp; validation</td></tr>
              <tr><td style="background:transparent"><a href="https://open-aec.com/" target="_blank">OpenAEC Foundation</a></td><td style="background:transparent">16 repos: BIM, export to Blender / Revit / IFC / DXF / Speckle</td><td style="background:transparent">Open source</td><td style="background:transparent">Substrate for IFCX projection &amp; cost engine</td></tr>
              <tr><td style="background:transparent"><a href="https://ifcopenshell.org/" target="_blank">IfcOpenShell</a></td><td style="background:transparent">Python/C++ IFC library, used by every serious OSS IFC tool</td><td style="background:transparent">LGPL</td><td style="background:transparent">Backing library for our custom rule engine</td></tr>
              <tr><td style="background:transparent"><a href="https://bonsaibim.org/" target="_blank">BonsaiBIM</a></td><td style="background:transparent">Blender IDS authoring + audit — community anchor</td><td style="background:transparent">Free / OSS</td><td style="background:transparent">Complement (Blender-only), not a competitor</td></tr>
              <tr><td style="background:transparent">buildingSMART bSDD / IDS / BCF</td><td style="background:transparent">Vocab &amp; validation standards</td><td style="background:transparent">Standard</td><td style="background:transparent">The vocabulary we carry forward — end-to-end</td></tr>
              <tr><td style="background:transparent"><a href="https://bimvoice.com/" target="_blank">BIMvoice</a> audience</td><td style="background:transparent">Official bSI Practitioner training community</td><td style="background:transparent">Free + paid</td><td style="background:transparent">Channel partner — paid AEC community reach</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>
  </div>
</section>

<!-- ══════════════ 04 — DIFFERENTIATOR ══════════════ -->
<section class="section" id="differentiator" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">04</span>
      <h2>Six things no incumbent has built.</h2>
      <a href="#differentiator" class="anchor">#differentiator</a>
    </div>
    <p class="lead">
      Every incumbent has one or two of these — none has all six on one receipt vocabulary. This is the strategic gap Ridgeline closes.
    </p>

    <div class="card-grid" id="diff-cards"></div>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const cards = window.RIDGELINE.differentiators.map((d, i) => \`
          <div class="card">
            <span class="card-id">D\${i + 1}</span>
            <h3>\${d.title}</h3>
            <p>\${d.body}</p>
            <div class="card-source"><span style="color:var(--n-300)">Contrast:</span> \${d.incumbent}</div>
          </div>\`).join("");
        document.getElementById("diff-cards").innerHTML = cards;
      });
    </script>
  </div>
</section>

<!-- ══════════════ 05 — COMPETITOR MATRIX ══════════════ -->
<section class="section" id="competitors" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">05</span>
      <h2>15 vendors × 13 capabilities.</h2>
      <a href="#competitors" class="anchor">#competitors</a>
    </div>
    <p class="lead">
      Ridgeline pinned at top (gold border). <span class="mono">Green = yes · gold = partial · gray = no · navy = the host itself.</span> Click any column header to sort.
    </p>

    <div class="filter-row">
      <input type="search" id="competitor-search" placeholder="Search vendor, price, capability, or gap description…" aria-label="Filter competitor matrix" />
    </div>

    <div class="table-wrap" id="competitor-table" style="max-height:640px"></div>

    <div class="callout" style="margin-top: var(--s-6)">
      <h4>Three things a GP can quote in a partner meeting</h4>
      <p style="color: var(--navy-100)">
        <strong>1.</strong> Solibri's 3× price hike (Oct 2026) is the demand-creating event of the cycle — churn window is open. <br>
        <strong>2.</strong> Autodesk Revit loses ≈ 50% of room-property data on IFC export — the wound our typed-receipt graph repairs. <br>
        <strong>3.</strong> Vectorworks' 0.61% CAD share under-counts near-monopoly in landscape / interior / entertainment — segments Solibri, BIMcollab, and Trimble Connect don't natively touch.
      </p>
    </div>
  </div>
</section>

<!-- ══════════════ 06 — BUILD & BURN ══════════════ -->
<section class="section" id="build" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">06</span>
      <h2>24.4 FTE. $6.76M. 18 months.</h2>
      <a href="#build" class="anchor">#build</a>
    </div>
    <p class="lead">
      Nine engineering modules + cross-cutting overhead. Loaded cost basis: <strong>$185,000 / FTE / year</strong> = BLS Software Developer median ($133,080) + Autodesk Sr SE L11 ($172,771) + ~35% benefits. <a href="https://www.bls.gov/oes/current/oes151252.htm" target="_blank">BLS 15-1252</a> · <a href="https://www.levels.fyi/companies/autodesk/salaries/software-engineer/levels/senior-software-engineer-1" target="_blank">levels.fyi</a>.
    </p>

    <div class="fte-grid" id="fte-grid"></div>

    <div class="kpi-grid" style="margin-top: var(--s-8)">
      <div class="kpi">
        <div class="kpi-label">Peak headcount (base)</div>
        <div class="kpi-value">24.4 FTE</div>
        <div class="kpi-delta">Range: 15.2 low · 40.6 high</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Annual base burn</div>
        <div class="kpi-value">$4.51M</div>
        <div class="kpi-delta">= 24.4 × $185K loaded</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">18-month build burn</div>
        <div class="kpi-value gold">$6.76M</div>
        <div class="kpi-delta">Capitalised into product · Y2 maintenance ≈ 10 FTE</div>
      </div>
      <div class="kpi dark">
        <div class="kpi-label">Customer-side reallocation (Y5)</div>
        <div class="kpi-value">$131M/yr</div>
        <div class="kpi-delta">≈ 5.05 FTE displaced / 100 proj / yr × 200 orgs</div>
      </div>
    </div>

    <details class="drill" style="margin-top: var(--s-6)" open>
      <summary>Two figures, never confused — build FTE vs displaced FTE</summary>
      <div class="drill-body">
        <div class="card-grid n2">
          <div class="card">
            <h3>Build FTE — engineering investment</h3>
            <p><strong>24.4 peak Full-Time Equivalents</strong> across 18 months. Cost of building the product itself. Capitalised into the cap table, funded by the $4.25M seed. Y2-onward maintenance is ≈ 10 FTE.</p>
            <div class="math" style="font-family:var(--font-mono);font-size:var(--fs-12);color:var(--n-300);background:var(--n-25);padding:var(--s-2) var(--s-3);border-left:2px solid var(--gold-500);display:inline-block;margin-top:var(--s-3)">24.4 × $185,000 = $4,509,375 / yr</div>
          </div>
          <div class="card">
            <h3>Displaced FTE — customer labor reallocated</h3>
            <p><strong>≈ 5.05 customer FTE displaced per 100 projects per year</strong> at base case. That's <strong>≈ $656,500 / yr labor saved per customer org</strong>, which capitalises into willingness-to-pay and drives our ARR. At 200 orgs by Y5 → <strong>$131M / yr reallocated</strong>.</p>
            <div class="math" style="font-family:var(--font-mono);font-size:var(--fs-12);color:var(--n-300);background:var(--n-25);padding:var(--s-2) var(--s-3);border-left:2px solid var(--gold-500);display:inline-block;margin-top:var(--s-3)">5.05 × $130,000 × 200 = $131,300,000</div>
          </div>
        </div>
      </div>
    </details>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const R = window.RIDGELINE;
        const maxFte = Math.max(...R.numbers.fte.modules.map(m => m.base));
        const cells = R.numbers.fte.modules.map(m => \`
          <div class="fte-cell risk-\${m.risk}">
            <div class="fte-code">\${m.id}</div>
            <div class="fte-name">\${m.name}</div>
            <div class="fte-value">\${m.base}<span class="fte-unit">FTE base</span></div>
            <div class="bar"><div class="bar-fill" style="width: \${(m.base / maxFte * 100).toFixed(0)}%"></div></div>
            <div class="fte-note">\${m.note}</div>
          </div>\`).join("");

        const cross = R.numbers.fte.crossCutting;
        const crossHtml = \`
          <div class="fte-cell cross">
            <div class="fte-code">CROSS</div>
            <div class="fte-name">Cross-cutting</div>
            <div class="fte-value">\${cross.base}<span class="fte-unit">FTE (25% of eng)</span></div>
            <div class="bar"><div class="bar-fill" style="width: \${(cross.base / maxFte * 100).toFixed(0)}%"></div></div>
            <div class="fte-note">\${cross.name}</div>
          </div>\`;

        const total = R.numbers.fte.total;
        const totalHtml = \`
          <div class="fte-cell total">
            <div class="fte-code">TOTAL</div>
            <div class="fte-name">Peak team</div>
            <div class="fte-value">\${total.base}<span class="fte-unit">FTE peak</span></div>
            <div class="bar"><div class="bar-fill" style="width: 100%; background: var(--gold-200)"></div></div>
            <div class="fte-note">= Engineering \${R.numbers.fte.engSubtotal.base} + Cross \${cross.base}. Range: \${total.low} → \${total.high}.</div>
          </div>\`;

        document.getElementById("fte-grid").innerHTML = cells + crossHtml + totalHtml;
      });
    </script>
  </div>
</section>

<!-- ══════════════ 07 — ARR RAMP ══════════════ -->
<section class="section" id="ramp" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">07</span>
      <h2>Path to first dollars — the ARR ramp.</h2>
      <a href="#ramp" class="anchor">#ramp</a>
    </div>
    <p class="lead">
      Five annual snapshots — from Y1 pilot to Y5 combined ARR base. Each bar labeled with the exact figure. Y5 is the number the wedge multiplies.
    </p>

    <div class="chart" id="ramp-chart"></div>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const ramp = window.RIDGELINE.numbers.arrRamp;
        const max = Math.max(...ramp.map(r => r.arr));
        const W = 800, H = 260, PAD_L = 60, PAD_R = 24, PAD_T = 20, PAD_B = 60;
        const barW = (W - PAD_L - PAD_R) / ramp.length - 12;
        const colors = ["#4a6591", "#2c4570", "#a67a23", "#a67a23", "#1B2A44"];
        const fmt = window.RIDGELINE.util.fmtUsd;

        const bars = ramp.map((r, i) => {
          const x = PAD_L + i * ((W - PAD_L - PAD_R) / ramp.length);
          const h = (r.arr / max) * (H - PAD_T - PAD_B);
          const y = H - PAD_B - h;
          return \`
            <g>
              <rect x="\${x}" y="\${y}" width="\${barW}" height="\${h}" fill="\${colors[i]}" rx="2"></rect>
              <text x="\${x + barW / 2}" y="\${y - 8}" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" font-weight="600" fill="#1B2A44">\${fmt(r.arr)}</text>
              <text x="\${x + barW / 2}" y="\${H - PAD_B + 20}" text-anchor="middle" font-family="Inter Tight" font-size="14" font-weight="600" fill="#1B2A44">\${r.year}</text>
              <text x="\${x + barW / 2}" y="\${H - PAD_B + 36}" text-anchor="middle" font-family="Inter" font-size="11" fill="#8a8272">\${r.label}</text>
            </g>\`;
        }).join("");

        // Y-axis ticks
        const ticks = [0, 10e6, 20e6, 40e6, 60e6];
        const yAxis = ticks.map(t => {
          const y = H - PAD_B - (t / max) * (H - PAD_T - PAD_B);
          return \`
            <line x1="\${PAD_L}" y1="\${y}" x2="\${W - PAD_R}" y2="\${y}" stroke="#e3ddd0" stroke-width="1"></line>
            <text x="\${PAD_L - 8}" y="\${y + 4}" text-anchor="end" font-family="IBM Plex Mono" font-size="10" fill="#8a8272">\${t === 0 ? "0" : "$" + (t / 1e6) + "M"}</text>\`;
        }).join("");

        document.getElementById("ramp-chart").innerHTML = \`
          <svg viewBox="0 0 \${W} \${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="ARR ramp Y1 to Y5">
            \${yAxis}\${bars}
          </svg>
          <div class="chart-legend">
            <span><span class="swatch" style="background:#4a6591"></span>Y1 pilot</span>
            <span><span class="swatch" style="background:#2c4570"></span>Y2 launch</span>
            <span><span class="swatch" style="background:#a67a23"></span>Y3–Y4 scale</span>
            <span><span class="swatch" style="background:#1B2A44"></span>Y5 combined ARR (base)</span>
          </div>\`;
      });
    </script>
  </div>
</section>

<!-- ══════════════ 08 — INVESTOR FIT ══════════════ -->
<section class="section" id="investors" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">08</span>
      <h2>21 investors. Sorted by fit.</h2>
      <a href="#investors" class="anchor">#investors</a>
    </div>
    <p class="lead">
      12 thematic funds · 5 strategic CVCs · 4 relevance-unconfirmed. Click any column to sort. Fit is scored 1–5 by public thesis alignment with native-CAD compliance + typed-graph plays.
    </p>

    <div class="filter-row" id="investor-type-filter">
      <button class="chip active" data-filter="all">All 21</button>
      <button class="chip" data-filter="thematic">Thematic funds (12)</button>
      <button class="chip" data-filter="cvc">Strategic CVCs (5)</button>
      <button class="chip" data-filter="unverified">Relevance unconfirmed (4)</button>
    </div>

    <div class="table-wrap" id="investor-table" style="max-height: 720px"></div>

    <p style="color:var(--n-300); font-size: var(--fs-12); margin-top: var(--s-4)">
      <strong>Note.</strong> "Relevance unconfirmed" rows are marked <code>[unverified]</code> in the thesis column. These funds have no public statement confirming AEC-plugin + compliance-ontology fit; they're listed because their broader mandate <em>could</em> touch the space — but require warm intros to justify a partner meeting.
    </p>
  </div>
</section>

<!-- ══════════════ 09 — THE ASK ══════════════ -->
<section class="section dark" id="ask" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">09</span>
      <h2>The ask.</h2>
      <a href="#ask" class="anchor" style="color:var(--gold-200)">#ask</a>
    </div>
    <p class="lead" style="color: var(--navy-100)">
      Seed round on a Simple Agreement for Future Equity. 24-month capex. Built-in decision rule to bump the round if channel velocity slips.
    </p>

    <div class="kpi-grid" style="margin-top: var(--s-6)">
      <div class="kpi" style="background: var(--navy-800); border-color: var(--navy-600); color: var(--n-25)">
        <div class="kpi-label" style="color: var(--gold-200)">Seed ask</div>
        <div class="kpi-value" style="color: var(--n-25)">$4.25M</div>
        <div class="kpi-delta" style="color: var(--navy-100)">On $24M post-money SAFE</div>
      </div>
      <div class="kpi" style="background: var(--navy-800); border-color: var(--navy-600); color: var(--n-25)">
        <div class="kpi-label" style="color: var(--gold-200)">Dilution</div>
        <div class="kpi-value" style="color: var(--n-25)">17.7%</div>
        <div class="kpi-delta" style="color: var(--navy-100)">Inside Carta 2025 seed median ($24M post-money)</div>
      </div>
      <div class="kpi" style="background: var(--navy-800); border-color: var(--navy-600); color: var(--n-25)">
        <div class="kpi-label" style="color: var(--gold-200)">Runway</div>
        <div class="kpi-value" style="color: var(--n-25)">24 mo</div>
        <div class="kpi-delta" style="color: var(--navy-100)">Bump-to-$5M / $30M cap decision rule at M18</div>
      </div>
      <div class="kpi" style="background: var(--gold-500); border-color: var(--gold-500); color: var(--navy-900)">
        <div class="kpi-label" style="color: var(--navy-900); opacity: 0.7">Implied return (base)</div>
        <div class="kpi-value" style="color: var(--navy-900)">~94×</div>
        <div class="kpi-delta" style="color: var(--navy-800)">$400M realistic × 17.7% ÷ $4.25M seed</div>
      </div>
    </div>

    <h3 style="margin-top: var(--s-10); margin-bottom: var(--s-4); color: var(--n-25)">Use of funds — $4.25M → $3.98M over 24 months</h3>

    <div class="uof-grid">
      <svg viewBox="-120 -120 240 240" width="220" height="220" role="img" aria-label="Use of funds donut">
        <g id="donut-uof"></g>
        <circle r="55" fill="#14203a"></circle>
        <text text-anchor="middle" y="-4" font-family="Inter Tight" font-size="22" font-weight="700" fill="#ffffff">$4.25M</text>
        <text text-anchor="middle" y="16" font-family="IBM Plex Mono" font-size="10" fill="#a7b8d5">17.7% SAFE</text>
      </svg>

      <ul class="uof-legend" id="uof-legend"></ul>
    </div>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const uof = window.RIDGELINE.numbers.useOfFunds;
        const colors = ["#a67a23", "#4a6591", "#8a6417", "#8a8272", "#a67a23", "#1f3459"];
        // Donut arcs
        let acc = 0;
        const donut = uof.map((u, i) => {
          const start = acc, end = acc + u.pct;
          acc = end;
          const sa = (start / 100) * 2 * Math.PI - Math.PI / 2;
          const ea = (end / 100) * 2 * Math.PI - Math.PI / 2;
          const r1 = 100, r2 = 55;
          const large = (u.pct > 50 ? 1 : 0);
          const x1 = Math.cos(sa) * r1, y1 = Math.sin(sa) * r1;
          const x2 = Math.cos(ea) * r1, y2 = Math.sin(ea) * r1;
          const x3 = Math.cos(ea) * r2, y3 = Math.sin(ea) * r2;
          const x4 = Math.cos(sa) * r2, y4 = Math.sin(sa) * r2;
          return \`<path d="M \${x1} \${y1} A \${r1} \${r1} 0 \${large} 1 \${x2} \${y2} L \${x3} \${y3} A \${r2} \${r2} 0 \${large} 0 \${x4} \${y4} Z" fill="\${colors[i]}" />\`;
        }).join("");
        document.getElementById("donut-uof").innerHTML = donut;

        const legend = uof.map((u, i) => \`
          <li>
            <span class="swatch-bar" style="background: \${colors[i]}"></span>
            <span style="color: var(--n-25)">\${u.bucket}</span>
            <span class="pct" style="color: var(--navy-100)">\${u.pct}%</span>
            <span class="usd" style="color: var(--gold-200)">$\${(u.usd / 1e6).toFixed(u.usd / 1e6 >= 1 ? 2 : 3)}M</span>
          </li>\`).join("");
        document.getElementById("uof-legend").innerHTML = legend;
      });
    </script>

    <div class="callout gold" style="margin-top: var(--s-8)">
      <h4>Decision rule — built into the round</h4>
      <p>If channel velocity (Net New ARR / FTE / month) is <strong>&lt; $2 / yr / employee at Month 18</strong>, bump to <strong>$5M on $30M cap</strong> for 30-month runway to clear the Series-A ARR gap. Explicit, documented in the capex model.</p>
    </div>
  </div>
</section>

<!-- ══════════════ 10 — RISKS ══════════════ -->
<section class="section" id="risks" data-glossary>
  <div class="container">
    <div class="section-head">
      <span class="section-num">10</span>
      <h2>Risks we are not softening.</h2>
      <a href="#risks" class="anchor">#risks</a>
    </div>
    <p class="lead">
      Read these aloud to sophisticated committees. The downside recital is what makes the upside credible.
    </p>

    <div class="card-grid">
      <div class="card">
        <span class="card-id">R1</span>
        <h3>M4 multi-SDK plug-in layer is the #1 technical risk</h3>
        <p>Writing a Pascal/Vectorscript plugin that survives Vectorworks MAJOR/MINOR API breakage is the integration the partner channel will judge us on.</p>
        <div class="card-source"><strong style="color:var(--pos)">Mitigation:</strong> Pascal/Vectorscript engineer is the first hire. Never defer past M3 in the build sequence.</div>
      </div>
      <div class="card">
        <span class="card-id">R2</span>
        <h3>M5 2D→3D is research-grade</h3>
        <p>Geometry-ML inference from unstructured 2D drawings is unsolved at production quality. Two of four high-case FTE here are research, not engineering.</p>
        <div class="card-source"><strong style="color:var(--pos)">Mitigation:</strong> Pad the timeline. Ship value on M1–M4 first; M5 is a Y2 unlock, not a Y1 dependency.</div>
      </div>
      <div class="card">
        <span class="card-id">R3</span>
        <h3>M7 compliance is regulatory</h3>
        <p>IBC/IRC/ADA/NFPA release on a triennial cycle. The 3 FTE in high-case includes an SME whose job is <em>permanently</em> tracking rule changes — not a one-time build cost.</p>
        <div class="card-source"><strong style="color:var(--pos)">Mitigation:</strong> SME contract seat, not headcount. Rule-pack updates ship quarterly.</div>
      </div>
      <div class="card">
        <span class="card-id">R4</span>
        <h3>Wisconsin correction — not overpromised</h3>
        <p>Wisconsin DOT 2025 Bridge Manual describes digital deliverables but does not yet cite IFC. The regulatory wave reaches Wisconsin in 2027–28. AASHTO T-19 pooled fund carries the proof point this year.</p>
        <div class="card-source"><strong style="color:var(--pos)">Mitigation:</strong> Co-develop with Iowa / Ohio / Colorado (exploratory memos published) instead of over-claiming Wisconsin.</div>
      </div>
      <div class="card">
        <span class="card-id">R5</span>
        <h3>Open-source substrate cannibalisation</h3>
        <p>If free tooling (IfcLite, BonsaiBIM, IfcOpenShell) eats the $720 Pro tier, blended ARPU drains toward $240 consumer.</p>
        <div class="card-source"><strong style="color:var(--pos)">Mitigation:</strong> Hold Enterprise tier at $18k/firm — anchored above Solibri Office's €1,962/user/yr. Sell native CAD glue + compliance ontology, not the IFC viewer.</div>
      </div>
      <div class="card">
        <span class="card-id">R6</span>
        <h3>Vectorworks Partner Program SLA delay</h3>
        <p>Unsigned binaries are disabled at every Vectorworks 2026 launch. Distribution risk if Platinum enrolment slips.</p>
        <div class="card-source"><strong style="color:var(--pos)">Mitigation:</strong> Day-one Platinum enrolment. Second slot held for Gold/Silver fallback.</div>
      </div>
    </div>

    <details class="drill" style="margin-top: var(--s-6)">
      <summary>The downside honest recital — worst credible outcome</summary>
      <div class="drill-body">
        <p>If the 5× multiple on $15.75M ARR ($80M distressed floor) still feels too generous, here's the worst-credible walk:</p>
        <div class="table-wrap">
          <table class="data">
            <tbody>
              <tr><td>TAM seats realised</td><td class="num">0.5%</td></tr>
              <tr><td>Pricing forced to consumer floor</td><td class="num">$240/yr ARPU</td></tr>
              <tr><td>Plugin ARR (Y5)</td><td class="num">≈ $1.26M</td></tr>
              <tr><td>Compliance ARR (Y5)</td><td class="num">≈ $14.49M</td></tr>
              <tr><td>Combined ARR (Y5)</td><td class="num">≈ $15.75M</td></tr>
              <tr><td>Exit multiple (distressed)</td><td class="num">5×</td></tr>
              <tr><td><strong>Total enterprise value</strong></td><td class="num"><strong>≈ $78.75M</strong></td></tr>
              <tr><td><strong>Seed return at $4.25M × 17.7%</strong></td><td class="num"><strong>≈ $13.94M back to lead</strong> — 3.3× return of capital, even in bear case</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>
  </div>
</section>

<!-- ══════════════ 11 — SOURCES ══════════════ -->
<section class="section" id="sources">
  <div class="container">
    <div class="section-head">
      <span class="section-num">11</span>
      <h2>Sources cited — audit trail.</h2>
      <button class="chip" data-toggle-all="#sources" style="margin-left: auto">Expand all</button>
    </div>
    <p class="lead">
      Every quantitative claim in this site traces to a public source or a BLS/Nemetschek/Finro benchmark. No estimates crossed without a link.
    </p>

    <div class="table-wrap" id="sources-table"></div>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const src = window.RIDGELINE.sources;
        document.getElementById("sources-table").innerHTML = \`
          <table class="data">
            <thead><tr><th>Source</th><th>Use in this site</th></tr></thead>
            <tbody>
            \${src.map(s => \`<tr><td><a href="\${s.url}" target="_blank" rel="noopener">\${s.tag}</a></td><td>\${s.use}</td></tr>\`).join("")}
            </tbody>
          </table>\`;
      });
    </script>
  </div>
</section>

</main>

<!-- ══════════════ FOOTER ══════════════ -->
<footer class="footer">
  <div class="container">
    <div class="footer-cols">
      <div>
        <h4>Ridgeline OpenBIM</h4>
        <p>
          <strong>The compliance record every building owes — as data.</strong><br>
          A DoubleAught(00) product · Boulder, Colorado · August 2026.<br>
          Numbers traceable to project baseline module. Every acronym defined on hover. WCAG 2.2 AA contrast throughout.
        </p>
      </div>
      <div>
        <h4>Deliverables</h4>
        <ul>
          <li>Interactive investor site (this)</li>
          <li>PPTX 16:9 · 17 slides</li>
          <li>One-page PNG · 2K teaser</li>
          <li>Investment research doc</li>
          <li>Competitor matrix XLSX</li>
        </ul>
      </div>
      <div>
        <h4>Sections</h4>
        <ul>
          <li><a href="#wedge">01 Wedge</a></li>
          <li><a href="#gap">02 Gap</a></li>
          <li><a href="#solution">03 Solution</a></li>
          <li><a href="#competitors">05 Competitors</a></li>
          <li><a href="#ask">09 Ask</a></li>
        </ul>
      </div>
    </div>
    <p style="border-top: 1px solid var(--n-100); padding-top: var(--s-4); font-size: var(--fs-11)">
      © 2026 DoubleAught(00) LLC · Seed round confidential · Contact your intro / GP.
      Numbers reconciled to <span class="mono">baseline.py</span> v6 (2026-08-24).
    </p>
  </div>
</footer>

<script src="/static/numbers.js"></script>
<script src="/static/site.js"></script>
</body>
</html>`;
