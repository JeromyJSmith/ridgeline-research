#!/usr/bin/env node
/**
 * Static-site build for GitHub Pages.
 *
 * The research surface is READ-ONLY reference data — a rule library, a set of
 * worked impairment scenarios, and a feasibility ledger. None of it needs a
 * server, so this script bakes the D1 content into the page and emits a fully
 * static site under docs/ (GitHub Pages serves that folder directly).
 *
 * How it works: it builds a throwaway SQLite database from the same migration
 * and seed files the Worker uses, runs the queries, and injects the results as
 * `window.__ITM_DATA__`. A small fetch() shim intercepts /api/* calls and
 * answers them from that object, so the page's own code is used UNCHANGED —
 * there is only one implementation of the UI, not a static fork of it.
 *
 * The SQL below mirrors src/itm-api.ts. If you change a query there, change it
 * here. (Kept duplicated deliberately: the alternative is importing Worker code
 * into a Node build, which drags in the Cloudflare runtime types.)
 *
 *   node scripts/build-static.mjs
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'docs')
const TMP = join(ROOT, '.static-build.sqlite')

// ── 1. Build a throwaway DB from the canonical SQL ──────────────────────────
rmSync(TMP, { force: true })
for (const f of [
  'migrations/0001_initial_schema.sql',
  'seed.sql',
  'migrations/0002_itm_research.sql',
  'seed_002_itm.sql',
]) {
  execFileSync('sqlite3', [TMP], { input: readFileSync(join(ROOT, f), 'utf8') })
}

const q = (sql) => JSON.parse(execFileSync('sqlite3', ['-json', TMP, sql], { encoding: 'utf8' }) || '[]')
const one = (sql) => q(sql)[0] ?? null

// ── 2. Run the same queries the Worker serves ───────────────────────────────
const rules = q(`
  SELECT id, standard, lane, applies_to_ifc_class, frequency, description,
         citation, citation_status, who_may_perform,
         automation_status, automation_citation, automation_note,
         residual_human_step, requires_licensed_signature, record_retention,
         unsupervised_frequency, supervised_frequency, supervision_multiplier
  FROM compliance_rules
  ORDER BY CASE automation_status
             WHEN 'permitted_today' THEN 1 WHEN 'gated_listing' THEN 2
             WHEN 'permitted_w_ahj' THEN 3 WHEN 'no_relief' THEN 4 ELSE 5 END,
           standard`)

const rulesSummary = one(`
  SELECT COUNT(*) AS total,
         SUM(CASE WHEN automation_status='permitted_today' THEN 1 ELSE 0 END) AS permitted_today,
         SUM(CASE WHEN requires_licensed_signature=1 THEN 1 ELSE 0 END) AS needs_signature,
         SUM(CASE WHEN citation_status='U' THEN 1 ELSE 0 END) AS unverified
  FROM compliance_rules`)

// The cumulative rolling-24h computation — the whole point of the clock.
const CUM = `
  WITH w AS (
    SELECT i.id AS imp_id, iw.opened_at,
           COALESCE(iw.hours,(julianday('now')-julianday(iw.opened_at))*24.0) AS hrs
    FROM impairments i JOIN impairment_windows iw ON iw.impairment_id=i.id
  ), anchored AS (
    SELECT a.imp_id, SUM(b.hrs) AS cum FROM w a JOIN w b
      ON b.imp_id=a.imp_id AND b.opened_at>=a.opened_at
     AND b.opened_at < datetime(a.opened_at,'+24 hours')
    GROUP BY a.imp_id, a.opened_at
  ), worst AS (SELECT imp_id, MAX(cum) AS worst_24h FROM anchored GROUP BY imp_id)`

const impairments = q(`${CUM}
  SELECT i.*, p.name AS property_name, p.address AS property_address,
         ROUND(COALESCE(worst.worst_24h,0),2) AS cumulative_24h,
         (SELECT COUNT(*) FROM impairment_windows iw WHERE iw.impairment_id=i.id) AS window_count,
         (SELECT ROUND(MAX(COALESCE(iw.hours,0)),2) FROM impairment_windows iw WHERE iw.impairment_id=i.id) AS longest_single_window,
         CASE WHEN COALESCE(worst.worst_24h,0) >= i.threshold_hours THEN 1 ELSE 0 END AS breached,
         (SELECT COUNT(*) FROM notifications n WHERE n.impairment_id=i.id) AS notifications_total,
         (SELECT COUNT(*) FROM notifications n WHERE n.impairment_id=i.id AND n.sent_at IS NOT NULL) AS notifications_sent
  FROM impairments i JOIN properties p ON p.id=i.property_id
  LEFT JOIN worst ON worst.imp_id=i.id
  ORDER BY breached DESC, i.ended_at IS NULL DESC, i.started_at DESC`)

const impairmentDetail = {}
for (const imp of impairments) {
  const windows = q(`SELECT id, opened_at, closed_at,
      ROUND(COALESCE(hours,(julianday('now')-julianday(opened_at))*24.0),2) AS hours, note
    FROM impairment_windows WHERE impairment_id=${imp.id} ORDER BY opened_at`)
  let running = 0
  const timeline = windows.map((w) => {
    running += w.hours ?? 0
    return { ...w, cumulative: Math.round(running * 100) / 100, crosses: running >= imp.threshold_hours }
  })
  impairmentDetail[imp.id] = {
    impairment: imp,
    windows: timeline,
    notifications: q(`SELECT id, party, requirement, basis, due_rule, due_by, sent_at, channel, note
      FROM notifications WHERE impairment_id=${imp.id} ORDER BY sent_at IS NOT NULL, due_by`),
  }
}

const candidates = q(`SELECT * FROM automation_candidates ORDER BY bucket DESC, rank`)
const attestations = q(`
  SELECT at.*, a.label AS asset_label, p.name AS property_name,
         cr.standard, cr.requires_licensed_signature
  FROM attestations at
  JOIN check_instances ci ON ci.id=at.check_instance_id
  JOIN assets a ON a.id=ci.asset_id
  JOIN properties p ON p.id=a.property_id
  LEFT JOIN compliance_rules cr ON cr.id=ci.compliance_rule_id
  ORDER BY at.signed_at DESC`)
const attTotals = one(`SELECT SUM(machine_prefilled_fields) AS prefilled, SUM(total_fields) AS total FROM attestations`)
const discounts = one(`SELECT COUNT(*) AS n, ROUND(MAX(supervision_multiplier),1) AS best
                       FROM compliance_rules WHERE supervision_multiplier IS NOT NULL`)
const impCounts = one(`SELECT COUNT(*) AS total, SUM(CASE WHEN ended_at IS NULL THEN 1 ELSE 0 END) AS open FROM impairments`)
const notifCounts = one(`SELECT COUNT(*) AS total, SUM(CASE WHEN sent_at IS NULL THEN 1 ELSE 0 END) AS outstanding FROM notifications`)

const DATA = {
  '/api/itm-summary': {
    rules: rulesSummary, discounts, impairments: impCounts, notifications: notifCounts,
    inventory: {
      itemsPerHotel: 1600, actionsPerYear: '2,500–3,000', sprinklerHeads: 800,
      ratedDoors: 220, tradesInvolved: '4–6', deletableHoursPct: 30,
    },
  },
  '/api/rules': { rules, summary: rulesSummary },
  '/api/impairments': { impairments },
  '/api/automation-candidates': { candidates },
  '/api/attestations': {
    attestations,
    machinePrefilledPct: attTotals?.total ? Math.round((attTotals.prefilled / attTotals.total) * 100) : null,
  },
}
for (const [id, d] of Object.entries(impairmentDetail)) DATA[`/api/impairments/${id}`] = d

// ── 3. Extract the page HTML and inject the shim ────────────────────────────
function pageHtml(file) {
  const src = readFileSync(join(ROOT, 'src', file), 'utf8')
  const start = src.indexOf('`')
  const end = src.lastIndexOf('`')
  if (start < 0 || end <= start) throw new Error(`could not extract template from ${file}`)
  return src.slice(start + 1, end)
}

const SHIM = `
<script>
/* Static build: the research data is read-only, so it is baked in here and a
   fetch() shim answers the page's own /api/* calls from it. The UI code below
   is byte-identical to the server-rendered version — there is no static fork. */
window.__ITM_DATA__ = ${JSON.stringify(DATA)};
(function(){
  var real = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function(url, opts){
    var path = String(url).replace(/^https?:\\/\\/[^/]+/, '').split('?')[0];
    if (Object.prototype.hasOwnProperty.call(window.__ITM_DATA__, path)) {
      return Promise.resolve({ ok:true, status:200,
        json: function(){ return Promise.resolve(window.__ITM_DATA__[path]); } });
    }
    if (opts && opts.method && opts.method.toUpperCase() !== 'GET') {
      /* Writes are disabled in the static build — say so rather than failing silently. */
      console.info('[static build] write ignored:', path);
      return Promise.resolve({ ok:true, status:200, json:function(){ return Promise.resolve({ staticBuild:true }); } });
    }
    return real ? real(url, opts) : Promise.reject(new Error('offline'));
  };
})();
</script>`

let research = pageHtml('research-page.ts')
  .replace('<link rel="stylesheet" href="/static/tokens.css" />',
           '<link rel="stylesheet" href="./tokens.css" />')
  .replace('href="/"',      'href="./index.html"')
  .replace(/href="\/"/g,    'href="./index.html"')
  .replace(/href="\/platform"/g, 'href="./index.html"')
  // The shim MUST be installed before the page's own script runs, so it goes in
  // <head> — injecting before </body> would leave the real fetch() in place for
  // the first calls, which fails outright under file://.
  .replace('</head>', `${SHIM}\n</head>`)

// In the static build there is no live write path; hide the buttons that imply one.
research = research.replace('<style>', `<style>
    /* static build: no write endpoints */
    [data-notif] { display:none !important; }`)

mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'research.html'), research)
copyFileSync(join(ROOT, 'public/static/tokens.css'), join(OUT, 'tokens.css'))
writeFileSync(join(OUT, 'data.json'), JSON.stringify(DATA, null, 2))
writeFileSync(join(OUT, '.nojekyll'), '')  // GitHub Pages: serve files starting with _ and don't run Jekyll

// ── 4. Copy the standalone documents alongside it ───────────────────────────
const DOCS = [
  ['../Ridgeline-Hotel-ITM-Research.html', 'hotel-itm-research.html'],
  ['../Ridgeline-Seed-RevD.html',          'seed-deck-revd.html'],
]
const copied = []
for (const [from, to] of DOCS) {
  const src = resolve(ROOT, from)
  if (existsSync(src)) { copyFileSync(src, join(OUT, to)); copied.push(to) }
}

// ── 5. Landing page ─────────────────────────────────────────────────────────
const card = (href, kicker, title, body, meta) => `
    <a class="lp-card" href="${href}">
      <div class="lp-kicker">${kicker}</div>
      <h3>${title}</h3>
      <p>${body}</p>
      <div class="lp-meta">${meta}</div>
    </a>`

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Ridgeline OpenBIM — Research &amp; Evidence</title>
<meta name="description" content="What a hotel life-safety inspection actually entails, and exactly how much of it US codes already permit a machine to perform." />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="./tokens.css" />
<style>
  body{background:var(--n-25)}
  .lp-wrap{max-width:1060px;margin:0 auto;padding:var(--s-6) var(--s-5) var(--s-9)}
  .lp-brand{font-weight:700;font-size:var(--fs-20);margin-bottom:var(--s-6)}
  .lp-brand small{display:block;font-weight:500;font-size:var(--fs-12);color:var(--n-500);margin-top:2px}
  .lp-hero{background:var(--navy-700);color:#fff;border-radius:14px;padding:var(--s-6);margin-bottom:var(--s-6)}
  .lp-hero .lp-kicker{font-family:var(--mono,monospace);font-size:var(--fs-11);letter-spacing:.14em;text-transform:uppercase;color:var(--gold-200)}
  .lp-hero h1{font-size:clamp(26px,4vw,40px);line-height:1.1;margin:var(--s-3) 0;max-width:24ch;color:#fff}
  .lp-hero p{color:#cfd8e6;max-width:74ch;font-size:var(--fs-15)}
  .lp-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--s-4);margin-top:var(--s-5)}
  .lp-kpi{border-left:2px solid var(--gold-400);padding-left:var(--s-3)}
  .lp-kpi .n{font-family:var(--mono,monospace);font-size:var(--fs-28);font-weight:700;line-height:1}
  .lp-kpi .l{font-size:var(--fs-11);color:#aebbcd;text-transform:uppercase;letter-spacing:.05em;margin-top:6px}
  .lp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--s-4)}
  .lp-card{display:block;background:#fff;border:1px solid var(--n-100);border-radius:12px;padding:var(--s-5);text-decoration:none;color:inherit;transition:border-color .15s,transform .15s}
  .lp-card:hover{border-color:var(--navy-500);transform:translateY(-2px)}
  .lp-card .lp-kicker{font-family:var(--mono,monospace);font-size:var(--fs-10);letter-spacing:.12em;text-transform:uppercase;color:var(--gold-600)}
  .lp-card h3{margin:var(--s-2) 0;font-size:var(--fs-18)}
  .lp-card p{font-size:var(--fs-13);color:var(--n-500);margin:0}
  .lp-card .lp-meta{font-family:var(--mono,monospace);font-size:var(--fs-11);color:var(--n-300);margin-top:var(--s-3)}
  .lp-note{border-left:2px solid var(--navy-500);padding:6px 0 6px 14px;font-size:var(--fs-13);color:var(--n-500);max-width:80ch;margin:var(--s-5) 0}
  .lp-note b{color:var(--n-700)}
  .lp-footer{margin-top:var(--s-7);font-size:var(--fs-12);color:var(--n-300)}
</style>
</head>
<body>
<div class="lp-wrap">
  <div class="lp-brand">Ridgeline <span style="color:var(--gold-600)">OpenBIM</span>
    <small>a DoubleAught(00) product · research &amp; evidence</small></div>

  <div class="lp-hero">
    <div class="lp-kicker">Hotel life-safety ITM · seven research lanes · United States</div>
    <h1>The code already permits far more automation than anyone has built.</h1>
    <p>A 150-key hotel carries roughly <b style="color:#fff">1,600 code-inspectable items</b> producing
      2,500–3,000 inspect-or-test actions a year across 4–6 trades. About
      <b style="color:#fff">30% of those hours are deletable today</b> under provisions already in
      force. What follows is the evidence for that claim, with every citation attached.</p>
    <div class="lp-kpis">
      <div class="lp-kpi"><div class="n">${rules.length}</div><div class="l">Rules encoded</div></div>
      <div class="lp-kpi"><div class="n">${rulesSummary.permitted_today}</div><div class="l">Automatable today</div></div>
      <div class="lp-kpi"><div class="n">${rulesSummary.needs_signature}</div><div class="l">Need a signature</div></div>
      <div class="lp-kpi"><div class="n">${discounts.best}×</div><div class="l">Best supervision discount</div></div>
      <div class="lp-kpi"><div class="n">${candidates.length}</div><div class="l">Feasibility verdicts</div></div>
    </div>
  </div>

  <div class="lp-cards">
${card('./research.html', 'Interactive', 'The inspection, taken apart',
  'Filterable rule library with the citation and automation verdict for every obligation, the cumulative impairment clock computed live, the feasibility ledger, and the method.',
  `${rules.length} rules · ${impairments.length} worked impairments · ${candidates.length} verdicts`)}
${copied.includes('hotel-itm-research.html') ? card('./hotel-itm-research.html', 'Document', 'Hotel life-safety ITM research',
  'The full 21-sheet report: frequency tables with code sections, extracted form field lists, the permission map, the deficiency-to-dispatch lifecycle, and the source register.',
  '21 sheets · ~450 sourced URLs') : ''}
${copied.includes('seed-deck-revd.html') ? card('./seed-deck-revd.html', 'Document', 'Seed deck · Rev D',
  'The investment case, including the instrumented Lane 01 sheet built from this research and its sourcing sheet.',
  '32 sheets') : ''}
  </div>

  <div class="lp-note"><b>How to read this.</b> Every rule carries a citation status:
    <b>P</b> means the section was read verbatim from primary text, <b>S</b> means a secondary
    source, and <b>U</b> means it could not be verified — those are leads, not citations, and are
    badged as such throughout. Six claims encountered during the research were withdrawn as
    unsourced; they are listed in the Method tab rather than quietly dropped.</div>

  <div class="lp-note"><b>A caveat that matters commercially.</b> Every permission cited here is
    edition-dependent, so the addressable market is literally a code-adoption map. And connected
    monitoring has not historically deleted mandated inspections — eight years of connected elevator
    monitoring removed no required ASME inspection. Both facts are kept visible rather than argued
    around.</div>

  <div class="lp-footer">Static build — the research data is read-only and baked into the page.
    Generated from the same migrations and seeds that run the live Compliance OS.</div>
</div>
</body>
</html>`
writeFileSync(join(OUT, 'index.html'), index)

rmSync(TMP, { force: true })
console.log(`static site → docs/`)
console.log(`  research.html   ${rules.length} rules · ${impairments.length} impairments · ${candidates.length} candidates`)
console.log(`  copied          ${copied.join(', ') || '(none found)'}`)
