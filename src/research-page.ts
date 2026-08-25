export const RESEARCH_PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ridgeline — The Inspection, Taken Apart</title>
  <meta name="description" content="What a hotel life-safety inspection actually entails, and exactly how much of it US codes already permit a machine to perform. Backed by a live compliance database, not prose." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/static/tokens.css" />
  <style>
    body { background: var(--n-25); }
    .rs-shell { max-width: 1180px; margin: 0 auto; padding: var(--s-6) var(--s-5) var(--s-9); }
    .rs-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--s-6); flex-wrap:wrap; gap:var(--s-3); }
    .rs-brand { font-weight:700; font-size:var(--fs-20); }
    .rs-brand a { color:inherit; text-decoration:none; }
    .rs-brand small { display:block; font-weight:500; font-size:var(--fs-12); color:var(--n-500); margin-top:2px; }
    .rs-tabs { display:flex; gap:var(--s-2); flex-wrap:wrap; }
    .rs-tab { padding:8px 16px; border-radius:999px; border:1px solid var(--n-150); background:#fff; font-size:var(--fs-13); font-weight:600; cursor:pointer; color:var(--n-700); }
    .rs-tab.active { background:var(--navy-700); color:#fff; border-color:var(--navy-700); }

    .rs-hero { background:var(--navy-700); color:#fff; border-radius:14px; padding:var(--s-6); margin-bottom:var(--s-6); }
    .rs-hero .kicker { font-family:var(--mono,monospace); font-size:var(--fs-11); letter-spacing:.14em; text-transform:uppercase; color:var(--gold-200); }
    /* tokens.css sets a dark heading ink; the hero is navy, so state it explicitly */
    .rs-hero h1 { font-size:clamp(26px,4vw,40px); line-height:1.1; margin:var(--s-3) 0; max-width:22ch; color:#fff; }
    .rs-hero p { color:#cfd8e6; max-width:70ch; font-size:var(--fs-15); }
    .rs-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:var(--s-4); margin-top:var(--s-5); }
    .rs-kpi { border-left:2px solid var(--gold-400); padding-left:var(--s-3); }
    .rs-kpi .n { font-family:var(--mono,monospace); font-size:var(--fs-28); font-weight:700; line-height:1; }
    .rs-kpi .l { font-size:var(--fs-11); color:#aebbcd; text-transform:uppercase; letter-spacing:.05em; margin-top:6px; }

    .rs-view { display:none; } .rs-view.active { display:block; }
    .rs-sec-title { font-size:var(--fs-22); font-weight:700; margin:var(--s-6) 0 var(--s-2); }
    .rs-sec-sub { color:var(--n-500); font-size:var(--fs-14); max-width:78ch; margin-bottom:var(--s-4); }

    .rs-filters { display:flex; gap:var(--s-2); flex-wrap:wrap; margin-bottom:var(--s-3); align-items:center; }
    .rs-chip { font-size:var(--fs-12); font-weight:600; padding:5px 12px; border-radius:999px; border:1px solid var(--n-150); background:#fff; cursor:pointer; color:var(--n-700); }
    .rs-chip.active { background:var(--navy-700); color:#fff; border-color:var(--navy-700); }
    .rs-search { padding:7px 12px; border-radius:8px; border:1px solid var(--n-150); font-family:inherit; font-size:var(--fs-13); min-width:220px; }

    table.rs-table { width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--n-100); border-radius:12px; overflow:hidden; }
    table.rs-table th { text-align:left; font-size:var(--fs-11); text-transform:uppercase; letter-spacing:.04em; color:var(--n-500); background:var(--n-50); padding:10px 14px; border-bottom:1px solid var(--n-100); white-space:nowrap; }
    table.rs-table td { padding:12px 14px; border-bottom:1px solid #f1efe9; font-size:var(--fs-13); vertical-align:top; }
    table.rs-table tr.rule-row { cursor:pointer; }
    table.rs-table tr.rule-row:hover { background:var(--n-25); }
    table.rs-table tr.detail td { background:var(--n-25); font-size:var(--fs-13); }
    .rs-scroll { overflow-x:auto; }

    .tag { display:inline-block; font-family:var(--mono,monospace); font-size:var(--fs-10); font-weight:600; padding:2px 7px; border-radius:4px; white-space:nowrap; letter-spacing:.03em; }
    .tag.today  { background:#e6f4ea; color:#1a6b3f; }
    .tag.gated  { background:#eaf0fb; color:var(--navy-700); }
    .tag.ahj    { background:#f0ecfa; color:#5b46a3; }
    .tag.norel  { background:#fdf3e2; color:var(--gold-700,#6d4e0e); }
    .tag.never  { background:#fbe9e7; color:#a3352a; }
    .tag.sig    { background:#fbe9e7; color:#a3352a; }
    .tag.P { background:#e6f4ea; color:#1a6b3f; }
    .tag.S { background:#fdf3e2; color:var(--gold-700,#6d4e0e); }
    .tag.U { background:#fbe9e7; color:#a3352a; }
    .tag.who { background:var(--n-50); color:var(--n-500); }

    .rs-note { border-left:2px solid var(--navy-500); padding:6px 0 6px 14px; font-size:var(--fs-13); color:var(--n-500); max-width:78ch; margin:var(--s-3) 0; }
    .rs-note.warn { border-left-color:var(--gold-500); }
    .rs-note.bad  { border-left-color:#a3352a; }
    .rs-note.good { border-left-color:#1a6b3f; }
    .rs-note b, .rs-note strong { color:var(--n-700); }

    .rs-card { background:#fff; border:1px solid var(--n-100); border-radius:12px; padding:var(--s-4); margin-bottom:var(--s-3); }
    .rs-card.breach { border-color:#e0b4ae; box-shadow:0 0 0 3px #fbe9e7; }
    .rs-card h4 { margin:0 0 4px; font-size:var(--fs-16); }
    .rs-card .addr { font-size:var(--fs-12); color:var(--n-500); }

    /* cumulative clock bar */
    .clock { margin-top:var(--s-4); }
    .clock-track { position:relative; height:34px; background:var(--n-50); border-radius:6px; overflow:hidden; display:flex; }
    .clock-seg { height:100%; border-right:2px solid #fff; display:flex; align-items:center; justify-content:center; font-family:var(--mono,monospace); font-size:var(--fs-11); font-weight:600; color:#fff; min-width:2px; }
    .clock-seg.s1 { background:#4a6591; } .clock-seg.s2 { background:#2c4570; } .clock-seg.s3 { background:#1B2A44; }
    .clock-seg.over { background:#a3352a; }
    .clock-line { position:absolute; top:-6px; bottom:-6px; width:2px; background:#a3352a; }
    .clock-line span { position:absolute; top:-18px; left:50%; transform:translateX(-50%); font-family:var(--mono,monospace); font-size:var(--fs-10); color:#a3352a; white-space:nowrap; font-weight:700; }
    .clock-legend { display:flex; gap:var(--s-4); flex-wrap:wrap; margin-top:var(--s-3); font-size:var(--fs-12); color:var(--n-500); }

    .notif-row { display:flex; gap:var(--s-3); align-items:flex-start; padding:10px 0; border-bottom:1px solid #f1efe9; font-size:var(--fs-13); }
    .notif-row:last-child { border-bottom:none; }
    .notif-dot { width:9px; height:9px; border-radius:50%; margin-top:6px; flex:none; }
    .notif-dot.sent { background:#1a6b3f; } .notif-dot.unsent { background:#a3352a; }
    .notif-party { font-weight:700; min-width:150px; }
    .notif-basis { font-size:var(--fs-12); color:var(--n-500); }
    .rs-btn { font-size:var(--fs-12); font-weight:600; padding:5px 12px; border-radius:6px; border:1px solid var(--navy-700); background:var(--navy-700); color:#fff; cursor:pointer; }
    .rs-btn.ghost { background:#fff; color:var(--navy-700); }

    .grid2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:var(--s-4); }
    .rs-empty { color:var(--n-500); font-size:var(--fs-13); padding:var(--s-5); text-align:center; }
    code { font-family:var(--mono,monospace); font-size:.92em; background:var(--n-50); padding:1px 5px; border-radius:4px; }
  </style>
</head>
<body>
<div class="rs-shell">

  <div class="rs-topbar">
    <div class="rs-brand">
      <a href="/">Ridgeline <span style="color:var(--gold-600)">OpenBIM</span></a>
      <small>Research — the inspection, taken apart ·
        <a href="/" style="color:var(--n-500)">investor site</a> ·
        <a href="/platform" style="color:var(--n-500)">compliance OS</a></small>
    </div>
    <div class="rs-tabs">
      <button class="rs-tab active" data-tab="rules">Rule library</button>
      <button class="rs-tab" data-tab="clock">Impairment clock</button>
      <button class="rs-tab" data-tab="feasibility">Feasibility</button>
      <button class="rs-tab" data-tab="method">Method</button>
    </div>
  </div>

  <div class="rs-hero">
    <div class="kicker">Hotel life-safety ITM · seven research lanes · US</div>
    <h1>The code already permits far more automation than anyone has built.</h1>
    <p>A 150-key hotel carries roughly <b style="color:#fff">1,600 code-inspectable items</b> producing
       2,500–3,000 inspect-or-test actions a year across 4–6 trades. About
       <b style="color:#fff">30% of those hours are deletable today</b> under provisions already in force.
       Every rule below is stored in the same D1 database that runs the Compliance OS — the research
       is the product's rule library, not a document about it.</p>
    <div class="rs-kpis" id="hero-kpis"></div>
  </div>

  <!-- ═══════════ RULE LIBRARY ═══════════ -->
  <div class="rs-view active" id="view-rules">
    <h2 class="rs-sec-title">The permission map</h2>
    <p class="rs-sec-sub">The codes do not ask whether a task was automated. They ask
      <em>what kind of obligation you are substituting for</em>. A required physical action is
      protected; a required observation is not. Click any rule to see its citation, the provision
      that permits automation, and — critically — the residual human step that remains.</p>

    <div class="rs-filters">
      <button class="rs-chip active" data-f="all">All</button>
      <button class="rs-chip" data-f="permitted_today">Permitted today</button>
      <button class="rs-chip" data-f="gated_listing">Gated by listing</button>
      <button class="rs-chip" data-f="no_relief">No frequency relief</button>
      <button class="rs-chip" data-f="not_permitted">Not permitted</button>
      <button class="rs-chip" data-f="signature">Needs a signature</button>
      <button class="rs-chip" data-f="discount">Supervision discount</button>
      <input class="rs-search" id="rule-search" type="search" placeholder="Filter by standard or text…" />
    </div>

    <div class="rs-scroll">
      <table class="rs-table">
        <thead><tr>
          <th>Standard</th><th>Obligation</th><th>Frequency</th>
          <th>Who</th><th>Automation</th><th>Cite</th>
        </tr></thead>
        <tbody id="rules-body"><tr><td colspan="6" class="rs-empty">Loading…</td></tr></tbody>
      </table>
    </div>

    <h2 class="rs-sec-title">The supervision discount nobody sells</h2>
    <p class="rs-sec-sub">NFPA 25 has for decades granted frequency relief wherever a condition is
      electrically supervised <em>and reported to a constantly attended location</em> — no AHJ
      approval, no listing, no performance-based programme. The hard condition is the constantly
      attended location. <b>A hotel front desk is staffed 24/7, so it is satisfied for free.</b></p>
    <div class="rs-scroll">
      <table class="rs-table">
        <thead><tr><th>Condition</th><th>Unsupervised</th><th>Supervised</th><th>Multiplier</th><th>Section</th></tr></thead>
        <tbody id="discount-body"></tbody>
      </table>
    </div>
  </div>

  <!-- ═══════════ IMPAIRMENT CLOCK ═══════════ -->
  <div class="rs-view" id="view-clock">
    <h2 class="rs-sec-title">The impairment clock</h2>
    <p class="rs-sec-sub">Compensating measures trigger past <b>10 hours out of service in any 24</b>
      for water-based systems (NFPA 25 §15.5.2(4)) and <b>4 hours</b> for fire alarm
      (NFPA 101 §9.6.1.8). The window is <b>cumulative, not per-event</b> — three separate 4-hour
      outages in one day cross the 10-hour line. This is computed live from the database below;
      it is not tracked correctly by hand anywhere.</p>
    <div id="clock-list"><div class="rs-empty">Loading…</div></div>

    <div class="rs-note bad"><b>Why this is the wedge, and not auto-dispatch.</b>
      3.29M US false alarms in 2024 against 1.39M fires. Chicago's ladder escalates to $1,000;
      Las Vegas fines <em>the maintenance company</em>. NFPA 72 §26.6.3.8 caps initiation-to-recording
      at 90 seconds through a UL 827-listed chain you cannot bypass. The clock carries
      <b>zero false-alarm exposure</b> and addresses what actually voids coverage.</div>
  </div>

  <!-- ═══════════ FEASIBILITY ═══════════ -->
  <div class="rs-view" id="view-feasibility">
    <h2 class="rs-sec-title">What can and cannot be automated</h2>
    <p class="rs-sec-sub">Ranked by (labour deleted × code path exists) ÷ (engineering + listing
      difficulty). The hardest list is included in full because the research is only credible if it
      names what it cannot do — and why. Note the distinction that runs through it:
      <b>blocked by physics</b> versus <b>blocked by law</b>.</p>
    <div class="rs-filters">
      <button class="rs-chip active" data-b="easiest">15 easiest</button>
      <button class="rs-chip" data-b="hardest">10 hardest</button>
    </div>
    <div id="cand-list"></div>

    <h2 class="rs-sec-title">The signature boundary</h2>
    <p class="rs-sec-sub">Every certification block is a first-person attestation bound to a named
      individual and a licence number. The machine produces the evidence and pre-fills the form; a
      licensed human signs. Modelled as its own object so the boundary lives in the data, not in
      the copy.</p>
    <div id="attest-box"></div>
  </div>

  <!-- ═══════════ METHOD ═══════════ -->
  <div class="rs-view" id="view-method">
    <h2 class="rs-sec-title">Method, and what was thrown away</h2>
    <p class="rs-sec-sub">Seven parallel research lanes, ~450 sourced URLs, ~653KB of dossiers.
      Precision on section numbers was prioritised over breadth.</p>

    <div class="rs-note good"><b>The paywall unlock.</b> NFPA standards are paywalled and block
      automated retrieval — but NFPA publishes its committee First and Second Draft reports free and
      un-gated at <code>docinfofiles.nfpa.org</code>, and those reports reproduce the
      <em>published prior edition verbatim</em> as the baseline for proposed changes. That yielded
      primary text for the 2022 and 2025 editions of NFPA 72. Public.Resource.Org hosts full text of
      standards incorporated by reference into law.</div>

    <h3 class="rs-sec-title" style="font-size:var(--fs-16)">Claims withdrawn as unsourced</h3>
    <div class="rs-scroll">
      <table class="rs-table">
        <thead><tr><th>Withdrawn claim</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>"$130K average hotel water incident"</td><td>Traces only to AI-generated SEO pages</td></tr>
          <tr><td>"15–25% insurance discount for monitoring"</td><td>Same. The defensible figure is Phyn partners at <em>up to</em> 15%</td></tr>
          <tr><td>Any "$X billion by 2032 connected fire-safety" TAM</td><td>Every instance traced to a market-research content mill</td></tr>
          <tr><td>"NFPA 72 has a self-testing clause"</td><td><b>Zero hits</b> across the 2022/2025/2028 committee corpus — vendors are describing UL 268 listings</td></tr>
          <tr><td>"The AHJ may not require physical ITM under NFPA 25 §4.6"</td><td>Overstates it. §4.6.6.12 holds frequencies regardless of automation</td></tr>
          <tr><td>"NICET Level II is required by NFPA 72"</td><td>The word NICET does not appear in NFPA 72 mandatory text. Licensing comes from state law</td></tr>
        </tbody>
      </table>
    </div>

    <div class="rs-note warn"><b>Counter-evidence, kept deliberately.</b> Eight years of Otis ONE and
      KONE 24/7 have not eliminated a single ASME A17.1 required inspection. Connected monitoring has
      not historically deleted mandated inspections. Any plan assuming it will should say why this
      case differs.</div>

    <div class="rs-note"><b>Known limits of this dataset.</b> Rules marked <span class="tag U">U</span>
      carry section numbers that could not be verified against primary text — they are leads, not
      citations. Every permission is <em>edition-dependent</em>, so the addressable market is
      literally a code-adoption map. And four of the fifteen easiest automations sit on existing
      patents; freedom-to-operate review is a prerequisite, not a later step.</div>
  </div>

</div>

<script>
(function(){
  "use strict";
  var RULES=[], CANDS=[], IMPS=[];
  var ruleFilter='all', ruleQuery='', candBucket='easiest';

  // NB: must use <template>, not a <div>. Setting innerHTML on a div makes the
  // HTML parser discard <tr>/<td> nodes that have no table ancestor, so every
  // table row would come back null. <template> content is parsed in a context
  // that preserves them.
  function el(h){ var t=document.createElement('template'); t.innerHTML=h.trim(); return t.content.firstElementChild; }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  var AUTO = {
    permitted_today:{c:'today', t:'Permitted today'},
    gated_listing:  {c:'gated', t:'Gated — listing'},
    permitted_w_ahj:{c:'ahj',   t:'With AHJ approval'},
    no_relief:      {c:'norel', t:'No frequency relief'},
    not_permitted:  {c:'never', t:'Not permitted'}
  };
  var WHO = { O:'Owner / staff', Q:'Qualified person', C:'Licensed contractor', E:'Specialty licensed' };

  // ── tabs ──
  document.querySelectorAll('.rs-tab').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('.rs-tab').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      document.querySelectorAll('.rs-view').forEach(function(v){ v.classList.remove('active'); });
      document.getElementById('view-'+b.dataset.tab).classList.add('active');
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  // ── hero ──
  fetch('/api/itm-summary').then(function(r){return r.json();}).then(function(d){
    var k=document.getElementById('hero-kpis');
    var inv=d.inventory||{};
    [[inv.itemsPerHotel?inv.itemsPerHotel.toLocaleString():'—','Inspectable items · 150-key'],
     [inv.actionsPerYear||'—','Inspect-or-test actions / yr'],
     [(d.rules&&d.rules.permitted_today)+' of '+(d.rules&&d.rules.total),'Rules automatable today'],
     [(d.discounts&&d.discounts.best?d.discounts.best+'×':'—'),'Best supervision discount'],
     [(d.notifications&&d.notifications.outstanding)||0,'Statutory notices outstanding']
    ].forEach(function(p){
      k.appendChild(el('<div class="rs-kpi"><div class="n">'+esc(p[0])+'</div><div class="l">'+esc(p[1])+'</div></div>'));
    });
  });

  // ── rule library ──
  function renderRules(){
    var b=document.getElementById('rules-body'); b.innerHTML='';
    var rows=RULES.filter(function(r){
      if(ruleFilter==='signature') { if(!r.requires_licensed_signature) return false; }
      else if(ruleFilter==='discount'){ if(!r.supervision_multiplier) return false; }
      else if(ruleFilter!=='all'){ if(r.automation_status!==ruleFilter) return false; }
      if(ruleQuery){
        var hay=(r.standard+' '+r.description+' '+(r.automation_note||'')+' '+(r.citation||'')).toLowerCase();
        if(hay.indexOf(ruleQuery)===-1) return false;
      }
      return true;
    });
    if(!rows.length){ b.innerHTML='<tr><td colspan="6" class="rs-empty">No rules match that filter.</td></tr>'; return; }
    rows.forEach(function(r){
      var a=AUTO[r.automation_status]||{c:'never',t:r.automation_status};
      var tr=el('<tr class="rule-row">'
        +'<td><b>'+esc(r.standard)+'</b>'+(r.requires_licensed_signature?' <span class="tag sig">SIG</span>':'')+'</td>'
        +'<td>'+esc(r.description)+'</td>'
        +'<td><span class="tag who">'+esc(r.frequency)+'</span></td>'
        +'<td><span class="tag who" title="'+esc(WHO[r.who_may_perform]||'')+'">'+esc(r.who_may_perform)+'</span></td>'
        +'<td><span class="tag '+a.c+'">'+esc(a.t)+'</span></td>'
        +'<td><span class="tag '+esc(r.citation_status)+'">'+esc(r.citation_status)+'</span></td>'
        +'</tr>');
      var det=el('<tr class="detail" style="display:none"><td colspan="6">'
        +'<div style="display:grid;gap:10px;max-width:90ch">'
        +'<div><b>Citation</b> — <code>'+esc(r.citation||r.standard)+'</code>'
          +(r.citation_status==='U'?' <span class="tag U">UNVERIFIED — a lead, not a citation</span>':'')+'</div>'
        +(r.automation_citation?'<div><b>Automation permitted by</b> — <code>'+esc(r.automation_citation)+'</code></div>':'')
        +(r.automation_note?'<div><b>What that actually buys</b><br>'+esc(r.automation_note)+'</div>':'')
        +(r.residual_human_step?'<div><b>Residual human step</b><br>'+esc(r.residual_human_step)+'</div>':'')
        +(r.record_retention?'<div><b>Record</b> — '+esc(r.record_retention)+'</div>':'')
        +'<div><b>Who may perform</b> — '+esc(WHO[r.who_may_perform]||r.who_may_perform)
          +(r.who_may_perform==='C'?' <em>(state law, not the standard — NFPA 25 §4.1.1.3.1 never requires a licensed contractor)</em>':'')+'</div>'
        +'</div></td></tr>');
      tr.addEventListener('click', function(){
        det.style.display = det.style.display==='none' ? 'table-row' : 'none';
      });
      b.appendChild(tr); b.appendChild(det);
    });
  }

  function renderDiscounts(){
    var b=document.getElementById('discount-body'); b.innerHTML='';
    var rows=RULES.filter(function(r){ return r.supervision_multiplier; })
                  .sort(function(x,y){ return y.supervision_multiplier-x.supervision_multiplier; });
    rows.forEach(function(r){
      b.appendChild(el('<tr><td><b>'+esc(r.description.split('—')[0])+'</b></td>'
        +'<td>'+esc(r.unsupervised_frequency)+'</td>'
        +'<td><b>'+esc(r.supervised_frequency)+'</b></td>'
        +'<td><span class="tag today">'+esc(r.supervision_multiplier)+'×</span></td>'
        +'<td><code>'+esc(r.standard)+'</code></td></tr>'));
    });
  }

  document.querySelectorAll('#view-rules .rs-chip').forEach(function(c){
    c.addEventListener('click', function(){
      document.querySelectorAll('#view-rules .rs-chip').forEach(function(x){x.classList.remove('active');});
      c.classList.add('active'); ruleFilter=c.dataset.f; renderRules();
    });
  });
  document.getElementById('rule-search').addEventListener('input', function(e){
    ruleQuery=e.target.value.toLowerCase().trim(); renderRules();
  });

  fetch('/api/rules').then(function(r){return r.json();}).then(function(d){
    RULES=d.rules||[]; renderRules(); renderDiscounts();
  });

  // ── impairment clock ──
  function clockCard(i){
    var pct = Math.min(100, (i.cumulative_24h / i.threshold_hours) * 100);
    var card = el('<div class="rs-card '+(i.breached?'breach':'')+'">'
      +'<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">'
      +'<div><h4>'+esc(i.property_name)+'</h4><div class="addr">'+esc(i.cause||'')+'</div></div>'
      +'<div style="text-align:right">'
        +'<span class="tag '+(i.breached?'never':'today')+'">'+(i.breached?'THRESHOLD BREACHED':'within limits')+'</span>'
        +'<div class="addr" style="margin-top:4px">'+esc(i.system.replace("_"," "))+' · '+esc(i.kind)+(i.ended_at?'':' · OPEN')+'</div>'
      +'</div></div>'
      +'<div class="clock" id="clock-'+i.id+'"></div>'
      +'<div class="clock-legend">'
        +'<span>Cumulative in worst rolling 24 h: <b style="color:'+(i.breached?'#a3352a':'var(--n-700)')+'">'+i.cumulative_24h+' h</b></span>'
        +'<span>Threshold: <b>'+i.threshold_hours+' h</b></span>'
        +'<span>Longest single window: <b>'+(i.longest_single_window||0)+' h</b></span>'
        +'<span>Windows: <b>'+i.window_count+'</b></span>'
        +'<span>Notices sent: <b>'+i.notifications_sent+' / '+i.notifications_total+'</b></span>'
      +'</div>'
      +'<div style="margin-top:10px"><button class="rs-btn ghost" data-imp="'+i.id+'">Show windows &amp; statutory notices</button></div>'
      +'<div class="imp-detail" id="imp-detail-'+i.id+'" style="display:none;margin-top:var(--s-4)"></div>'
      +'</div>');
    return card;
  }

  function drawClock(i, windows){
    var host=document.getElementById('clock-'+i.id); if(!host) return;
    // scale: threshold occupies 70% of the track so a breach is visibly past the line
    var scaleMax = Math.max(i.threshold_hours/0.7, i.cumulative_24h*1.08);
    var track=el('<div class="clock-track"></div>');
    var run=0;
    windows.forEach(function(w,idx){
      var over = run >= i.threshold_hours;
      run += w.hours;
      var pct=(w.hours/scaleMax)*100;
      var seg=el('<div class="clock-seg '+(over?'over':('s'+((idx%3)+1)))+'" style="width:'+pct+'%">'
        +(pct>7? w.hours+'h' : '')+'</div>');
      seg.title = (w.note||'') + ' — ' + w.hours + ' h';
      track.appendChild(seg);
    });
    var line=el('<div class="clock-line" style="left:'+((i.threshold_hours/scaleMax)*100)+'%"><span>'
      +i.threshold_hours+' h threshold</span></div>');
    track.appendChild(line);
    host.innerHTML=''; host.appendChild(track);
  }

  function renderImpairments(){
    var host=document.getElementById('clock-list'); host.innerHTML='';
    if(!IMPS.length){ host.innerHTML='<div class="rs-empty">No impairments recorded.</div>'; return; }
    IMPS.forEach(function(i){
      var card=clockCard(i); host.appendChild(card);
      fetch('/api/impairments/'+i.id).then(function(r){return r.json();}).then(function(d){
        drawClock(i, d.windows||[]);
        var det=document.getElementById('imp-detail-'+i.id);
        var html='<div class="grid2">';
        html+='<div><b style="font-size:var(--fs-13)">Out-of-service windows</b>'
             +'<table class="rs-table" style="margin-top:8px"><thead><tr><th>Opened</th><th>Hours</th><th>Cumulative</th></tr></thead><tbody>';
        (d.windows||[]).forEach(function(w){
          html+='<tr><td>'+esc(w.opened_at)+(w.note?'<br><span class="addr">'+esc(w.note)+'</span>':'')+'</td>'
               +'<td>'+w.hours+'</td><td'+(w.crosses?' style="color:#a3352a;font-weight:700"':'')+'>'+w.cumulative+'</td></tr>';
        });
        html+='</tbody></table></div>';
        html+='<div><b style="font-size:var(--fs-13)">Statutory notifications</b><div style="margin-top:8px">';
        (d.notifications||[]).forEach(function(n){
          html+='<div class="notif-row">'
            +'<div class="notif-dot '+(n.sent_at?'sent':'unsent')+'"></div>'
            +'<div style="flex:1"><div class="notif-party">'+esc(n.party.replace(/_/g," "))+'</div>'
            +'<div>'+esc(n.requirement)+'</div>'
            +'<div class="notif-basis">'+esc(n.basis)+'</div>'
            +(n.note?'<div class="notif-basis" style="color:#a3352a">'+esc(n.note)+'</div>':'')
            +'</div>'
            +'<div style="text-align:right;white-space:nowrap">'
            +(n.sent_at?'<span class="tag today">sent</span>'
                      :'<button class="rs-btn" data-notif="'+n.id+'">Mark sent</button>')
            +'<div class="notif-basis" style="margin-top:4px">'+esc(n.due_rule)+'</div></div>'
            +'</div>';
        });
        html+='</div></div></div>';
        det.innerHTML=html;
        det.querySelectorAll('[data-notif]').forEach(function(btn){
          btn.addEventListener('click', function(){
            fetch('/api/notifications/'+btn.dataset.notif+'/send',{method:'POST',
              headers:{'Content-Type':'application/json'}, body:JSON.stringify({channel:'email'})})
              .then(function(){ loadImpairments(); });
          });
        });
      });
      card.querySelector('[data-imp]').addEventListener('click', function(){
        var d=document.getElementById('imp-detail-'+i.id);
        d.style.display = d.style.display==='none' ? 'block' : 'none';
      });
    });
  }

  function loadImpairments(){
    fetch('/api/impairments').then(function(r){return r.json();}).then(function(d){
      IMPS=d.impairments||[]; renderImpairments();
    });
  }
  loadImpairments();

  // ── feasibility ──
  function renderCands(){
    var host=document.getElementById('cand-list'); host.innerHTML='';
    CANDS.filter(function(c){ return c.bucket===candBucket; })
      .sort(function(a,b){ return a.rank-b.rank; })
      .forEach(function(c){
        var blocker = c.blocker
          ? '<span class="tag '+(c.blocker==='physics'?'never':(c.blocker==='licensing'?'norel':'gated'))+'">'
            +esc(c.blocker)+'</span>' : '';
        host.appendChild(el('<div class="rs-card">'
          +'<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">'
          +'<h4>'+c.rank+'. '+esc(c.item)+'</h4>'
          +'<div>'+blocker+(c.confidence?' <span class="tag who">'+esc(c.confidence)+' confidence</span>':'')+'</div></div>'
          +(c.mechanism?'<div style="font-size:var(--fs-13);margin-top:4px">'+esc(c.mechanism)+'</div>':'')
          +(c.code_path?'<div class="addr" style="margin-top:4px">Code path: <code>'+esc(c.code_path)+'</code></div>':'')
          +(c.labour_note?'<div class="addr" style="margin-top:2px">'+esc(c.labour_note)+'</div>':'')
          +(c.verdict?'<div class="rs-note" style="margin:10px 0 0">'+esc(c.verdict)+'</div>':'')
          +'</div>'));
      });
  }
  document.querySelectorAll('#view-feasibility .rs-chip').forEach(function(c){
    c.addEventListener('click', function(){
      document.querySelectorAll('#view-feasibility .rs-chip').forEach(function(x){x.classList.remove('active');});
      c.classList.add('active'); candBucket=c.dataset.b; renderCands();
    });
  });
  fetch('/api/automation-candidates').then(function(r){return r.json();}).then(function(d){
    CANDS=d.candidates||[]; renderCands();
  });

  fetch('/api/attestations').then(function(r){return r.json();}).then(function(d){
    var host=document.getElementById('attest-box');
    var pct=d.machinePrefilledPct;
    var html='<div class="rs-card"><div style="display:flex;gap:var(--s-5);flex-wrap:wrap;align-items:baseline">'
      +'<div><div class="n" style="font-family:var(--mono,monospace);font-size:var(--fs-28);font-weight:700">'
      +(pct==null?'—':pct+'%')+'</div><div class="addr">of record fields machine-produced</div></div>'
      +'<div style="flex:1;min-width:280px" class="rs-note good">The machine produces the evidence and '
      +'pre-fills the form. The first-person, licence-numbered attestation is the regulated artifact — '
      +'and it stays human. That is not a compromise; it is what the regulation specifies.</div></div>';
    (d.attestations||[]).forEach(function(a){
      html+='<div class="rs-card"><h4>'+esc(a.asset_label||'')+' <span class="addr">— '+esc(a.property_name||'')+'</span></h4>'
        +'<div style="font-size:var(--fs-13);margin-top:6px">'+esc(a.attestation_text)+'</div>'
        +'<div class="addr" style="margin-top:6px">Signed by <b>'+esc(a.signer_name)+'</b>'
        +(a.licence_number?' · licence '+esc(a.licence_number):'')
        +' · '+a.machine_prefilled_fields+' of '+a.total_fields+' fields machine-produced</div></div>';
    });
    host.innerHTML=html;
  });
})();
</script>
</body>
</html>`
