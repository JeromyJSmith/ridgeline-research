export const PLATFORM_PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ridgeline Compliance OS — Portfolio Dashboard</title>
  <meta name="description" content="Live Phase-1 demo: Property → Asset → CheckInstance → WorkOrder → ReminderEvent, per docs/MASTER-ARCHITECTURE.md" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/static/tokens.css" />
  <style>
    body { background: var(--n-25); }
    .pf-shell { max-width: 1180px; margin: 0 auto; padding: var(--s-6) var(--s-5) var(--s-9); }
    .pf-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--s-6); flex-wrap: wrap; gap: var(--s-3); }
    .pf-brand { font-family: var(--font-display, inherit); font-weight: 700; font-size: var(--fs-20); }
    .pf-brand a { color: inherit; text-decoration: none; }
    .pf-brand small { display: block; font-weight: 500; font-size: var(--fs-12); color: var(--n-500); margin-top: 2px; }
    .pf-tabs { display: flex; gap: var(--s-2); flex-wrap: wrap; }
    .pf-tab { padding: 8px 16px; border-radius: 999px; border: 1px solid var(--n-150); background: #fff; font-size: var(--fs-13); font-weight: 600; cursor: pointer; color: var(--n-700); }
    .pf-tab.active { background: var(--navy-700); color: #fff; border-color: var(--navy-700); }
    .pf-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--s-4); margin-bottom: var(--s-7); }
    .pf-stat { background: #fff; border: 1px solid var(--n-100); border-radius: var(--r-3, 12px); padding: var(--s-4); }
    .pf-stat .n { font-family: var(--mono, monospace); font-size: var(--fs-28); font-weight: 700; line-height: 1; }
    .pf-stat .l { font-size: var(--fs-12); color: var(--n-500); margin-top: 6px; text-transform: uppercase; letter-spacing: .04em; }
    .pf-stat.due .n { color: var(--navy-700); }
    .pf-stat.done .n { color: var(--green-600, #1a7f4b); }
    .pf-stat.overdue .n { color: var(--gold-600); }
    .pf-stat.failed .n { color: var(--red-600, #c0392b); }
    .pf-section-title { font-size: var(--fs-20); font-weight: 700; margin: var(--s-6) 0 var(--s-3); }
    .pf-property-card { background: #fff; border: 1px solid var(--n-100); border-radius: var(--r-3, 12px); padding: var(--s-4); margin-bottom: var(--s-3); cursor: pointer; transition: border-color .15s; }
    .pf-property-card:hover { border-color: var(--navy-500); }
    .pf-property-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: var(--s-2); }
    .pf-property-head h4 { font-size: var(--fs-16); font-weight: 700; margin: 0; }
    .pf-property-addr { font-size: var(--fs-12); color: var(--n-500); }
    .pf-status-row { display: flex; gap: var(--s-2); margin-top: var(--s-3); flex-wrap: wrap; }
    .pf-pill { font-size: var(--fs-11); font-weight: 600; padding: 3px 10px; border-radius: 999px; }
    .pf-pill.done { background: #e6f4ea; color: #1a7f4b; }
    .pf-pill.due { background: #eaf0fb; color: var(--navy-700); }
    .pf-pill.overdue { background: #fdf3e2; color: var(--gold-700, #92620a); }
    .pf-pill.failed { background: #fbe9e7; color: var(--red-600, #c0392b); }
    table.pf-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--n-100); border-radius: var(--r-3, 12px); overflow: hidden; }
    table.pf-table th { text-align: left; font-size: var(--fs-11); text-transform: uppercase; letter-spacing: .04em; color: var(--n-500); background: var(--n-50); padding: 10px 14px; border-bottom: 1px solid var(--n-100); }
    table.pf-table td { padding: 12px 14px; border-bottom: 1px solid var(--n-75, #f1f1f1); font-size: var(--fs-13); vertical-align: top; }
    table.pf-table tr:last-child td { border-bottom: none; }
    .pf-btn { font-size: var(--fs-12); font-weight: 600; padding: 5px 12px; border-radius: 6px; border: 1px solid var(--navy-700); background: var(--navy-700); color: #fff; cursor: pointer; }
    .pf-btn.secondary { background: #fff; color: var(--navy-700); }
    .pf-btn.danger { background: var(--red-600, #c0392b); border-color: var(--red-600, #c0392b); }
    .pf-btn:disabled { opacity: .5; cursor: default; }
    .pf-origin-tag { font-family: var(--mono, monospace); font-size: var(--fs-10); color: var(--n-500); background: var(--n-50); padding: 2px 6px; border-radius: 4px; }
    .pf-view { display: none; }
    .pf-view.active { display: block; }
    .pf-back { font-size: var(--fs-13); color: var(--navy-700); cursor: pointer; margin-bottom: var(--s-3); display: inline-block; }
    .pf-empty { color: var(--n-500); font-size: var(--fs-13); padding: var(--s-4); text-align: center; }
    .pf-reminder-list { list-style: none; margin: var(--s-2) 0 0; padding: 0; font-size: var(--fs-12); }
    .pf-reminder-list li { padding: 4px 0; display: flex; gap: var(--s-2); align-items: center; }
    .pf-reminder-list .sent { color: var(--green-600, #1a7f4b); }
    .pf-reminder-list .pending { color: var(--n-400); }
    .pf-modal-bg { display: none; position: fixed; inset: 0; background: rgba(15,20,25,.5); z-index: 50; align-items: center; justify-content: center; }
    .pf-modal-bg.open { display: flex; }
    .pf-modal { background: #fff; border-radius: var(--r-4, 14px); padding: var(--s-5); max-width: 420px; width: 92%; }
    .pf-modal h4 { margin-top: 0; }
    .pf-modal textarea { width: 100%; min-height: 70px; margin: var(--s-3) 0; padding: 8px; border-radius: 8px; border: 1px solid var(--n-150); font-family: inherit; }
    .pf-modal-actions { display: flex; gap: var(--s-2); justify-content: flex-end; }
    .pf-note { font-size: var(--fs-12); color: var(--n-500); margin-top: var(--s-2); }
  </style>
</head>
<body>
<div class="pf-shell">

  <div class="pf-topbar">
    <div class="pf-brand">
      <a href="/">Ridgeline <span style="color:var(--gold-600)">OpenBIM</span></a>
      <small>Compliance OS — Phase 1 live demo · <a href="/" style="color:var(--n-500)">← investor site</a></small>
    </div>
    <div class="pf-tabs">
      <button class="pf-tab active" data-tab="portfolio">Portfolio</button>
      <button class="pf-tab" data-tab="workorders">Work Orders</button>
    </div>
  </div>

  <p class="pf-note">
    Implements <code>docs/MASTER-ARCHITECTURE.md</code> §5 + §5b: Portfolio → Property → TypedElement (Asset) →
    CheckInstance → WorkOrder → ReminderEvent. Data is real, stored in Cloudflare D1 — not mocked.
    Emergency-lighting checks below are the Lane 01 onboarding wedge; the same schema carries all seven compliance lanes.
  </p>

  <!-- ═══════ PORTFOLIO VIEW ═══════ -->
  <div class="pf-view active" id="view-portfolio">
    <div class="pf-stat-grid" id="stat-grid"></div>
    <h3 class="pf-section-title">Properties</h3>
    <div id="property-list"></div>
  </div>

  <!-- ═══════ PROPERTY DETAIL VIEW ═══════ -->
  <div class="pf-view" id="view-property">
    <span class="pf-back" id="back-to-portfolio">← Back to portfolio</span>
    <h3 class="pf-section-title" id="property-detail-title"></h3>
    <div id="property-detail-body"></div>
  </div>

  <!-- ═══════ WORK ORDERS VIEW ═══════ -->
  <div class="pf-view" id="view-workorders">
    <h3 class="pf-section-title">Work orders — vendor coordination layer</h3>
    <p class="pf-note">Auto-created when a check fails (scheduled or device-originated). The platform owns this workflow whether the field work is done in-house or by a third-party vendor.</p>
    <div id="workorder-list"></div>
  </div>

</div>

<!-- ═══════ COMPLETE-CHECK MODAL ═══════ -->
<div class="pf-modal-bg" id="check-modal-bg">
  <div class="pf-modal">
    <h4>Log check result</h4>
    <div id="check-modal-asset" style="font-size:13px;color:var(--n-500);margin-bottom:8px;"></div>
    <textarea id="check-note" placeholder="Evidence note (e.g. 'Illuminated 30s, no flicker' or 'Lamp dark on test')"></textarea>
    <div class="pf-modal-actions">
      <button class="pf-btn secondary" id="check-cancel">Cancel</button>
      <button class="pf-btn danger" id="check-fail">Fail</button>
      <button class="pf-btn" id="check-pass">Pass</button>
    </div>
  </div>
</div>

<script>
(function () {
  const state = { properties: [], currentPropertyId: null, currentCheckId: null, currentAssetLabel: '' };

  function fmtDate(s) { if (!s) return '—'; return new Date(s.replace(' ', 'T')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  function pill(status) { return '<span class="pf-pill ' + status + '">' + status + '</span>'; }

  async function loadPortfolioSummary() {
    const r = await fetch('/api/portfolio-summary');
    const d = await r.json();
    const c = d.counts || {};
    document.getElementById('stat-grid').innerHTML = [
      { l: 'Properties', n: d.propertyCount, cls: '' },
      { l: 'Assets tracked', n: d.assetCount, cls: '' },
      { l: 'Due', n: c.due || 0, cls: 'due' },
      { l: 'Done', n: c.done || 0, cls: 'done' },
      { l: 'Overdue', n: c.overdue || 0, cls: 'overdue' },
      { l: 'Failed', n: c.failed || 0, cls: 'failed' },
      { l: 'Open work orders', n: d.openWorkOrders, cls: 'overdue' }
    ].map(s => '<div class="pf-stat ' + s.cls + '"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div></div>').join('');
  }

  async function loadProperties() {
    const r = await fetch('/api/properties');
    const d = await r.json();
    state.properties = d.properties || [];
    document.getElementById('property-list').innerHTML = state.properties.map(p => \`
      <div class="pf-property-card" data-id="\${p.id}">
        <div class="pf-property-head">
          <h4>\${p.name}</h4>
          <span class="pf-property-addr">\${p.address}</span>
        </div>
        <div class="pf-status-row">
          \${p.done ? pill('done') + ' ' + p.done : ''}
          \${p.due ? pill('due') + ' ' + p.due : ''}
          \${p.overdue ? pill('overdue') + ' ' + p.overdue : ''}
          \${p.failed ? pill('failed') + ' ' + p.failed : ''}
          <span style="margin-left:auto;font-size:12px;color:var(--n-500)">\${p.asset_count} assets tracked</span>
        </div>
      </div>\`).join('');
    document.querySelectorAll('.pf-property-card').forEach(el => {
      el.addEventListener('click', () => openProperty(el.dataset.id));
    });
  }

  async function openProperty(id) {
    state.currentPropertyId = id;
    const r = await fetch('/api/properties/' + id);
    const d = await r.json();
    document.getElementById('property-detail-title').textContent = d.property.name;
    document.getElementById('property-detail-body').innerHTML = \`
      <table class="pf-table">
        <thead><tr><th>Asset</th><th>Location</th><th>Origin</th><th>Status</th><th>Evidence</th><th>Action</th></tr></thead>
        <tbody>
        \${(d.assets || []).map(a => \`
          <tr>
            <td><strong>\${a.label}</strong><br><span style="font-size:11px;color:var(--n-400)">\${a.global_id} · \${a.qr_code || ''}</span></td>
            <td>\${a.location || '—'}</td>
            <td><span class="pf-origin-tag">\${a.origin || '—'}</span></td>
            <td>\${a.check_status ? pill(a.check_status) : '—'} <span style="font-size:11px;color:var(--n-400)">due \${fmtDate(a.due_date)}</span></td>
            <td style="max-width:220px;font-size:12px;color:var(--n-500)">\${a.evidence_note || (a.wo_status ? 'WO #' + a.work_order_id + ' → ' + (a.vendor_name || 'unassigned') + ' (' + a.wo_status + ')' : '—')}</td>
            <td>\${a.check_id && (a.check_status === 'due' || a.check_status === 'overdue')
              ? '<button class="pf-btn" data-check="' + a.check_id + '" data-label="' + a.label + '">Log check</button>'
              : ''}</td>
          </tr>\`).join('')}
        </tbody>
      </table>\`;
    document.querySelectorAll('[data-check]').forEach(btn => {
      btn.addEventListener('click', () => openCheckModal(btn.dataset.check, btn.dataset.label));
    });
    showView('property');
  }

  function openCheckModal(checkId, label) {
    state.currentCheckId = checkId;
    state.currentAssetLabel = label;
    document.getElementById('check-modal-asset').textContent = label;
    document.getElementById('check-note').value = '';
    document.getElementById('check-modal-bg').classList.add('open');
  }

  async function submitCheck(passed) {
    const note = document.getElementById('check-note').value;
    await fetch('/api/checks/' + state.currentCheckId + '/complete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passed, note, executorName: 'Dashboard Demo User' })
    });
    document.getElementById('check-modal-bg').classList.remove('open');
    await loadPortfolioSummary();
    await openProperty(state.currentPropertyId);
  }

  async function loadWorkOrders() {
    const r = await fetch('/api/work-orders');
    const d = await r.json();
    const wos = d.workOrders || [];
    if (!wos.length) {
      document.getElementById('workorder-list').innerHTML = '<div class="pf-empty">No work orders open. The graph is clean.</div>';
      return;
    }
    document.getElementById('workorder-list').innerHTML = \`
      <table class="pf-table">
        <thead><tr><th>Property / Asset</th><th>Description</th><th>Vendor</th><th>Origin</th><th>Status</th><th>Reminders</th><th></th></tr></thead>
        <tbody>
        \${wos.map(w => \`
          <tr>
            <td><strong>\${w.property_name}</strong><br><span style="font-size:12px;color:var(--n-500)">\${w.asset_label}</span></td>
            <td style="max-width:240px">\${w.description}</td>
            <td>\${w.vendor_name ? w.vendor_name + '<br><span style="font-size:11px;color:var(--n-400)">' + w.vendor_trade + '</span>' : '<em style="color:var(--n-400)">unassigned</em>'}</td>
            <td><span class="pf-origin-tag">\${w.check_origin}</span></td>
            <td>\${pill(w.status)}</td>
            <td><ul class="pf-reminder-list" data-reminders="\${w.id}"><li class="pending">loading…</li></ul></td>
            <td>\${w.status !== 'closed' ? '<button class="pf-btn secondary" data-close-wo="' + w.id + '">Close</button>' : ''}</td>
          </tr>\`).join('')}
        </tbody>
      </table>\`;

    document.querySelectorAll('[data-reminders]').forEach(async (el) => {
      const id = el.dataset.reminders;
      const rr = await fetch('/api/work-orders/' + id + '/reminders');
      const rd = await rr.json();
      el.innerHTML = (rd.reminders || []).map(r =>
        '<li class="' + (r.sent_at ? 'sent' : 'pending') + '">' +
        (r.sent_at ? '✓' : '○') + ' ' + fmtDate(r.scheduled_for) + ' · ' + r.channel + ' → ' + r.escalation_level.replace('_',' ') +
        '</li>').join('');
    });

    document.querySelectorAll('[data-close-wo]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch('/api/work-orders/' + btn.dataset.closeWo + '/close', { method: 'POST' });
        await loadWorkOrders();
        await loadPortfolioSummary();
      });
    });
  }

  function showView(name) {
    document.querySelectorAll('.pf-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + name).classList.add('active');
    document.querySelectorAll('.pf-tab').forEach(t => t.classList.remove('active'));
    if (name === 'portfolio') document.querySelector('[data-tab="portfolio"]').classList.add('active');
    if (name === 'workorders') document.querySelector('[data-tab="workorders"]').classList.add('active');
  }

  document.querySelectorAll('.pf-tab').forEach(t => {
    t.addEventListener('click', () => {
      const tab = t.dataset.tab;
      showView(tab);
      if (tab === 'workorders') loadWorkOrders();
    });
  });
  document.getElementById('back-to-portfolio').addEventListener('click', () => showView('portfolio'));
  document.getElementById('check-cancel').addEventListener('click', () => document.getElementById('check-modal-bg').classList.remove('open'));
  document.getElementById('check-pass').addEventListener('click', () => submitCheck(true));
  document.getElementById('check-fail').addEventListener('click', () => submitCheck(false));

  loadPortfolioSummary();
  loadProperties();
})();
</script>
</body>
</html>`;
