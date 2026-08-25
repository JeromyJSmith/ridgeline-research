import { Hono } from 'hono'

type Bindings = { DB: D1Database }

export const itmApi = new Hono<{ Bindings: Bindings }>()

// ══════════════════════════════════════════════════════════════
// The rule library — every recurring obligation with its citation
// and its automation verdict.
// ══════════════════════════════════════════════════════════════
itmApi.get('/api/rules', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
    SELECT id, standard, lane, applies_to_ifc_class, frequency, description,
           citation, citation_status, who_may_perform,
           automation_status, automation_citation, automation_note,
           residual_human_step, requires_licensed_signature, record_retention,
           unsupervised_frequency, supervised_frequency, supervision_multiplier,
           (SELECT COUNT(*) FROM assets a WHERE a.ifc_class = compliance_rules.applies_to_ifc_class) AS asset_count
    FROM compliance_rules
    ORDER BY
      CASE automation_status
        WHEN 'permitted_today' THEN 1
        WHEN 'gated_listing'   THEN 2
        WHEN 'permitted_w_ahj' THEN 3
        WHEN 'no_relief'       THEN 4
        ELSE 5
      END,
      standard
  `).all()

  const summary = await DB.prepare(`
    SELECT
      COUNT(*)                                                            AS total,
      SUM(CASE WHEN automation_status='permitted_today' THEN 1 ELSE 0 END) AS permitted_today,
      SUM(CASE WHEN automation_status='gated_listing'   THEN 1 ELSE 0 END) AS gated,
      SUM(CASE WHEN automation_status='no_relief'       THEN 1 ELSE 0 END) AS no_relief,
      SUM(CASE WHEN automation_status='not_permitted'   THEN 1 ELSE 0 END) AS not_permitted,
      SUM(CASE WHEN requires_licensed_signature=1 THEN 1 ELSE 0 END)       AS needs_signature,
      SUM(CASE WHEN citation_status='U' THEN 1 ELSE 0 END)                 AS unverified
    FROM compliance_rules
  `).first()

  return c.json({ rules: results, summary })
})

// ══════════════════════════════════════════════════════════════
// THE IMPAIRMENT CLOCK
//
// The threshold is not "how long has this outage lasted." It is the
// CUMULATIVE out-of-service time inside any rolling 24-hour window:
// NFPA 25 §15.5.2(4) — 10 h for water-based; NFPA 101 §9.6.1.8 — 4 h for
// fire alarm. Three separate 4-hour outages in one day cross the 10-hour
// line. Nobody tracks this correctly by hand, which is exactly why it is
// worth computing.
//
// Method: anchor a 24-hour window at each window's opening instant, sum
// every window that starts inside it, and take the worst anchor. An open
// window accrues against the current time.
// ══════════════════════════════════════════════════════════════
itmApi.get('/api/impairments', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
    WITH w AS (
      SELECT i.id AS imp_id,
             iw.opened_at,
             COALESCE(iw.hours, (julianday('now') - julianday(iw.opened_at)) * 24.0) AS hrs
      FROM impairments i
      JOIN impairment_windows iw ON iw.impairment_id = i.id
    ),
    anchored AS (
      SELECT a.imp_id, a.opened_at AS anchor, SUM(b.hrs) AS cum
      FROM w a
      JOIN w b ON b.imp_id = a.imp_id
              AND b.opened_at >= a.opened_at
              AND b.opened_at <  datetime(a.opened_at, '+24 hours')
      GROUP BY a.imp_id, a.opened_at
    ),
    worst AS (
      SELECT imp_id, MAX(cum) AS worst_24h FROM anchored GROUP BY imp_id
    )
    SELECT
      i.*,
      p.name AS property_name,
      p.address AS property_address,
      ROUND(COALESCE(worst.worst_24h, 0), 2) AS cumulative_24h,
      (SELECT COUNT(*) FROM impairment_windows iw WHERE iw.impairment_id = i.id) AS window_count,
      (SELECT ROUND(MAX(COALESCE(iw.hours,0)),2) FROM impairment_windows iw WHERE iw.impairment_id = i.id) AS longest_single_window,
      CASE WHEN COALESCE(worst.worst_24h,0) >= i.threshold_hours THEN 1 ELSE 0 END AS breached,
      (SELECT COUNT(*) FROM notifications n WHERE n.impairment_id = i.id) AS notifications_total,
      (SELECT COUNT(*) FROM notifications n WHERE n.impairment_id = i.id AND n.sent_at IS NOT NULL) AS notifications_sent
    FROM impairments i
    JOIN properties p ON p.id = i.property_id
    LEFT JOIN worst ON worst.imp_id = i.id
    ORDER BY breached DESC, i.ended_at IS NULL DESC, i.started_at DESC
  `).all()

  return c.json({ impairments: results })
})

itmApi.get('/api/impairments/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')

  const impairment = await DB.prepare(`
    SELECT i.*, p.name AS property_name, p.address AS property_address
    FROM impairments i JOIN properties p ON p.id = i.property_id
    WHERE i.id = ?
  `).bind(id).first()
  if (!impairment) return c.json({ error: 'not found' }, 404)

  const { results: windows } = await DB.prepare(`
    SELECT id, opened_at, closed_at,
           ROUND(COALESCE(hours, (julianday('now') - julianday(opened_at)) * 24.0), 2) AS hours,
           note
    FROM impairment_windows WHERE impairment_id = ? ORDER BY opened_at
  `).bind(id).all()

  const { results: notifications } = await DB.prepare(`
    SELECT id, party, requirement, basis, due_rule, due_by, sent_at, channel, note
    FROM notifications WHERE impairment_id = ?
    ORDER BY sent_at IS NOT NULL, due_by
  `).bind(id).all()

  // running cumulative, so the UI can show exactly where the line was crossed
  let running = 0
  const timeline = (windows as any[]).map((w) => {
    running += w.hours ?? 0
    return { ...w, cumulative: Math.round(running * 100) / 100,
             crosses: running >= (impairment as any).threshold_hours }
  })

  return c.json({ impairment, windows: timeline, notifications })
})

// Mark a statutory notification as sent.
itmApi.post('/api/notifications/:id/send', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const body = await c.req.json<{ channel?: string }>().catch(() => ({} as any))
  await DB.prepare(
    `UPDATE notifications SET sent_at = CURRENT_TIMESTAMP, channel = COALESCE(?, channel) WHERE id = ?`
  ).bind(body.channel ?? null, id).run()
  const row = await DB.prepare(`SELECT * FROM notifications WHERE id = ?`).bind(id).first()
  return c.json({ success: true, notification: row })
})

// Open / close an out-of-service window against an impairment.
itmApi.post('/api/impairments/:id/window', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const body = await c.req.json<{ action: 'open' | 'close'; note?: string }>()

  if (body.action === 'open') {
    await DB.prepare(
      `INSERT INTO impairment_windows (impairment_id, opened_at, note) VALUES (?, CURRENT_TIMESTAMP, ?)`
    ).bind(id, body.note ?? null).run()
  } else {
    await DB.prepare(`
      UPDATE impairment_windows
         SET closed_at = CURRENT_TIMESTAMP,
             hours = ROUND((julianday(CURRENT_TIMESTAMP) - julianday(opened_at)) * 24.0, 2)
       WHERE impairment_id = ? AND closed_at IS NULL
    `).bind(id).run()
  }
  return c.json({ success: true })
})

// ══════════════════════════════════════════════════════════════
// Automation feasibility ledger — including the honest negatives
// ══════════════════════════════════════════════════════════════
itmApi.get('/api/automation-candidates', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(
    `SELECT * FROM automation_candidates ORDER BY bucket DESC, rank`
  ).all()
  return c.json({ candidates: results })
})

// ══════════════════════════════════════════════════════════════
// Attestations — the signature boundary, as data
// ══════════════════════════════════════════════════════════════
itmApi.get('/api/attestations', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
    SELECT at.*, a.label AS asset_label, p.name AS property_name,
           cr.standard, cr.requires_licensed_signature
    FROM attestations at
    JOIN check_instances ci ON ci.id = at.check_instance_id
    JOIN assets a ON a.id = ci.asset_id
    JOIN properties p ON p.id = a.property_id
    LEFT JOIN compliance_rules cr ON cr.id = ci.compliance_rule_id
    ORDER BY at.signed_at DESC
  `).all()

  const totals = await DB.prepare(`
    SELECT SUM(machine_prefilled_fields) AS prefilled, SUM(total_fields) AS total
    FROM attestations
  `).first<{ prefilled: number; total: number }>()

  const pct = totals?.total ? Math.round((totals.prefilled / totals.total) * 100) : null
  return c.json({ attestations: results, machinePrefilledPct: pct })
})

// ══════════════════════════════════════════════════════════════
// Headline numbers for the research page
// ══════════════════════════════════════════════════════════════
itmApi.get('/api/itm-summary', async (c) => {
  const { DB } = c.env

  const rules = await DB.prepare(`
    SELECT COUNT(*) AS total,
           SUM(CASE WHEN automation_status='permitted_today' THEN 1 ELSE 0 END) AS permitted_today,
           SUM(CASE WHEN requires_licensed_signature=1 THEN 1 ELSE 0 END) AS needs_signature,
           SUM(CASE WHEN citation_status='U' THEN 1 ELSE 0 END) AS unverified
    FROM compliance_rules
  `).first()

  const discounts = await DB.prepare(`
    SELECT COUNT(*) AS n, ROUND(MAX(supervision_multiplier),1) AS best
    FROM compliance_rules WHERE supervision_multiplier IS NOT NULL
  `).first()

  const impairments = await DB.prepare(`
    SELECT COUNT(*) AS total,
           SUM(CASE WHEN ended_at IS NULL THEN 1 ELSE 0 END) AS open
    FROM impairments
  `).first()

  const notif = await DB.prepare(`
    SELECT COUNT(*) AS total, SUM(CASE WHEN sent_at IS NULL THEN 1 ELSE 0 END) AS outstanding
    FROM notifications
  `).first()

  return c.json({
    rules, discounts, impairments, notifications: notif,
    // From the research. A 150-key hotel, counted zone by zone.
    inventory: {
      itemsPerHotel: 1600,
      actionsPerYear: '2,500–3,000',
      sprinklerHeads: 800,
      ratedDoors: 220,
      tradesInvolved: '4–6',
      deletableHoursPct: 30,
    },
  })
})
