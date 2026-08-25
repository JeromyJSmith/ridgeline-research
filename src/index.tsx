import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { INVESTOR_PAGE_HTML } from './investor-page'
import { PLATFORM_PAGE_HTML } from './platform-page'
import { RESEARCH_PAGE_HTML } from './research-page'
import { itmApi } from './itm-api'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/static/*', serveStatic({ root: './public' }))

// Phase 2 — hotel life-safety ITM research surface (see ../HANDOFF.md §4.1)
app.route('/', itmApi)

// ══════════════════════════════════════════════════════════════
// Investor site (unchanged — static, no DB)
// ══════════════════════════════════════════════════════════════
app.get('/', (c) => c.html(INVESTOR_PAGE_HTML))

// ══════════════════════════════════════════════════════════════
// Compliance OS — Phase 1 (docs/MASTER-ARCHITECTURE.md §5 + §5b)
// ══════════════════════════════════════════════════════════════
app.get('/platform', (c) => c.html(PLATFORM_PAGE_HTML))

// ══════════════════════════════════════════════════════════════
// Research — what an inspection actually is, and what the code
// already permits a machine to do. Backed by D1, not prose.
// ══════════════════════════════════════════════════════════════
app.get('/research', (c) => c.html(RESEARCH_PAGE_HTML))

// ---- Portfolio summary: stage ⑦ roll-up ----
app.get('/api/portfolio-summary', async (c) => {
  const { DB } = c.env
  const portfolio = await DB.prepare(
    `SELECT id, name, manager_name, manager_email FROM portfolios LIMIT 1`
  ).first()

  const counts = await DB.prepare(`
    SELECT
      SUM(CASE WHEN status = 'due' THEN 1 ELSE 0 END) as due,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
      SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
      COUNT(*) as total
    FROM check_instances
  `).first()

  const openWorkOrders = await DB.prepare(
    `SELECT COUNT(*) as n FROM work_orders WHERE status != 'closed'`
  ).first()

  const propertyCount = await DB.prepare(
    `SELECT COUNT(*) as n FROM properties`
  ).first()

  const assetCount = await DB.prepare(
    `SELECT COUNT(*) as n FROM assets`
  ).first()

  return c.json({ portfolio, counts, openWorkOrders: openWorkOrders?.n ?? 0, propertyCount: propertyCount?.n ?? 0, assetCount: assetCount?.n ?? 0 })
})

// ---- Properties with per-property compliance rollup ----
app.get('/api/properties', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
    SELECT
      p.id, p.name, p.address, p.property_type,
      COUNT(DISTINCT a.id) as asset_count,
      SUM(CASE WHEN ci.status = 'done' THEN 1 ELSE 0 END) as done,
      SUM(CASE WHEN ci.status = 'due' THEN 1 ELSE 0 END) as due,
      SUM(CASE WHEN ci.status = 'overdue' THEN 1 ELSE 0 END) as overdue,
      SUM(CASE WHEN ci.status = 'failed' THEN 1 ELSE 0 END) as failed
    FROM properties p
    LEFT JOIN assets a ON a.property_id = p.id
    LEFT JOIN check_instances ci ON ci.asset_id = a.id
    GROUP BY p.id
    ORDER BY p.name
  `).all()
  return c.json({ properties: results })
})

// ---- Single property detail: assets + their latest check + open work orders ----
app.get('/api/properties/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')

  const property = await DB.prepare(`SELECT * FROM properties WHERE id = ?`).bind(id).first()
  if (!property) return c.json({ error: 'not found' }, 404)

  const { results: assets } = await DB.prepare(`
    SELECT
      a.id, a.global_id, a.label, a.location, a.ifc_class, a.qr_code, a.twin_ref,
      ci.id as check_id, ci.status as check_status, ci.due_date, ci.origin,
      ci.evidence_note, ci.completed_at,
      wo.id as work_order_id, wo.status as wo_status, v.name as vendor_name
    FROM assets a
    LEFT JOIN check_instances ci ON ci.asset_id = a.id
      AND ci.id = (SELECT MAX(id) FROM check_instances WHERE asset_id = a.id)
    LEFT JOIN work_orders wo ON wo.check_instance_id = ci.id
    LEFT JOIN vendors v ON v.id = wo.vendor_id
    WHERE a.property_id = ?
    ORDER BY a.label
  `).bind(id).all()

  return c.json({ property, assets })
})

// ---- Work orders (the vendor workflow surface) ----
app.get('/api/work-orders', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
    SELECT
      wo.id, wo.status, wo.description, wo.created_at, wo.closed_at,
      v.name as vendor_name, v.trade as vendor_trade,
      a.label as asset_label, p.name as property_name,
      ci.origin as check_origin, ci.evidence_note
    FROM work_orders wo
    JOIN check_instances ci ON ci.id = wo.check_instance_id
    JOIN assets a ON a.id = ci.asset_id
    JOIN properties p ON p.id = a.property_id
    LEFT JOIN vendors v ON v.id = wo.vendor_id
    ORDER BY wo.status = 'closed', wo.created_at DESC
  `).all()
  return c.json({ workOrders: results })
})

// ---- Reminder cadence for a work order (§5b escalation ladder) ----
app.get('/api/work-orders/:id/reminders', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const { results } = await DB.prepare(`
    SELECT id, scheduled_for, channel, escalation_level, sent_at
    FROM reminder_events WHERE work_order_id = ? ORDER BY scheduled_for
  `).bind(id).all()
  return c.json({ reminders: results })
})

// ---- Complete a check: the core loop action (§3 stage ③→④) ----
app.post('/api/checks/:id/complete', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const body = await c.req.json<{ passed: boolean; note?: string; executorName?: string }>()

  const newStatus = body.passed ? 'done' : 'failed'
  await DB.prepare(`
    UPDATE check_instances
    SET status = ?, evidence_note = ?, executor_name = ?, executor_type = 'internal',
        completed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(newStatus, body.note ?? null, body.executorName ?? 'Demo User', id).run()

  // §3 stage ⑤: failure auto-generates a WorkOrder
  let workOrderId: number | null = null
  if (!body.passed) {
    const check = await DB.prepare(`SELECT asset_id FROM check_instances WHERE id = ?`).bind(id).first<{ asset_id: number }>()
    const asset = await DB.prepare(`SELECT label FROM assets WHERE id = ?`).bind(check?.asset_id).first<{ label: string }>()
    const result = await DB.prepare(`
      INSERT INTO work_orders (check_instance_id, status, description, created_at)
      VALUES (?, 'open', ?, CURRENT_TIMESTAMP)
    `).bind(id, `Corrective action required — ${asset?.label ?? 'asset'}: ${body.note ?? 'failed check'}`).run()
    workOrderId = result.meta.last_row_id as number

    // §5b: seed the T+0 reminder immediately on creation
    await DB.prepare(`
      INSERT INTO reminder_events (work_order_id, scheduled_for, channel, escalation_level, sent_at)
      VALUES (?, CURRENT_TIMESTAMP, 'email', 'vendor', CURRENT_TIMESTAMP)
    `).bind(workOrderId).run()
  }

  return c.json({ success: true, status: newStatus, workOrderId })
})

// ---- Close a work order (§5 WorkOrder.status -> closed, evidence attached) ----
app.post('/api/work-orders/:id/close', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  await DB.prepare(`UPDATE work_orders SET status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(id).run()
  return c.json({ success: true })
})

// ---- Assign a vendor to a work order ----
app.post('/api/work-orders/:id/assign', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const body = await c.req.json<{ vendorId: number }>()
  await DB.prepare(`UPDATE work_orders SET vendor_id = ?, status = 'in_progress' WHERE id = ?`).bind(body.vendorId, id).run()
  return c.json({ success: true })
})

app.get('/api/vendors', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`SELECT * FROM vendors ORDER BY name`).all()
  return c.json({ vendors: results })
})

export default app
