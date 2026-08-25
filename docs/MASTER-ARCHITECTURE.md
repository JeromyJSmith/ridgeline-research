---
ticket: RIDGELINE-004
title: Master Architecture — One Typed Graph, Every AEC Lifecycle Stage
status: canonical
priority: critical
owner: Jeromy J. Smith
created: 2026-08-25
updated: 2026-08-25
revision: 2
sources:
  - Ridgeline-Seed-RevD.artifact.html (Rev D deck, sheets 05–08)
  - DEck-IoT.html (IoT-angle seed deck)
  - Ridgeline-Hotel-ITM-Research.html (code-authority proof, hotel vertical)
  - webapp/public/static/numbers.js (canonical financial/round data, already live)
  - user strategy statements (5 drafts, session 2) on property compliance OS
  - user keyword taxonomy (Property Management / Vendor Workflow / Digital
    Tracking clusters, session 3) — resolved in §5b and §7b
supersedes: RIDGELINE-002, RIDGELINE-003 (file triage + thesis synthesis — both folded in here)
---

# Ridgeline: One Typed Graph, Every AEC Lifecycle Stage

## 0. Why this document exists

Across this session, four uploaded artifacts (investor site, hotel ITM research,
Seed Rev D deck, IoT deck) and five successive strategy statements were treated as
separate things needing separate decisions. They are not separate. Re-reading
Rev D's own "Solution" sheet confirms the founder's thesis already states the
full-coverage claim explicitly:

> Every AEC lifecycle stage — design, coordination, estimating, construction,
> handover, operations, compliance — already has point software. None of them
> share a persistent, typed object. **The product is the thing that makes the
> object survive every handoff.** The property-compliance wedge (extinguishers,
> emergency lights, alarms) is not a separate business line from the design-time
> authoring plugin. It is the same graph, read from the operations end instead
> of the authoring end.

This document is the single reference for how every module — property
management, execution/vendor workflow, IoT, the CAD authoring plugin, cost
estimation, construction QA, and compliance reporting — implements the *same*
underlying schema. Nothing here is marked optional. Sequencing is by
dependency, not by preference, per the working principle: if a component is
listed, it is load-bearing somewhere in the graph; the only question is which
phase reaches it first.

---

## 1. The one-sentence architecture

**A single typed object — an asset/element with a stable identity — is created
once (at design time or at property-onboarding time) and is read and written by
every downstream AEC/O&M function without ever being re-keyed, re-drawn, or
re-interpreted from a static document.**

Two entry points into the *same* graph, per Rev D's own framing:

| | Surface A — Authoring | Surface B — Compliance OS |
|---|---|---|
| **Where it lives** | Inside the CAD tool (Vectorworks 2026, native C++ SDK + CEF palette) | Owner/property-manager-facing web app |
| **Who touches it** | Architects, engineers, designers, at design time | Property managers, facility techs, vendors, inspectors, post-handover |
| **What it captures** | Element identity, geometry, IDS-validated compliance intent, at the moment the building is drawn | Deficiencies, evidence, telemetry, corrective work orders, at the moment the building is operated |
| **Shared substrate** | One IFCX component graph, versioned rules with provenance, signed receipts, IFC 4.3 / COBie export |

The property-compliance business (extinguishers → emergency lights → alarms →
backflow → doors → elevators → healthcare physical environment) is **Surface
B's onboarding wedge**. The AEC design/construction business (E&O reduction,
RFI resolution, estimating accuracy, rework reduction) is **Surface A's
onboarding wedge**. They are not competing go-to-markets to choose between —
they are the two ends of one pipe, and each one seeds data the other consumes.

---

## 2. Full lifecycle coverage — the eight stages, unified

This is the complete AEC + O&M lifecycle already documented across Rev D and
the ITM research, unified into one table. Every stage reads and writes the
same typed graph.

| # | Stage | Industry's documented loss (already in Rev D) | What the graph fixes | Primary surface |
|---|---|---|---|---|
| 1 | **Design & documentation** | E&O is the #1 dispute cause | IDS rules execute live, inside the CAD tool, against versioned NFPA/ADA/OSHA/ASHRAE profiles — the omission is caught before the file leaves the office | Surface A |
| 2 | **Coordination** | 21.4M RFIs/year (US) | BCF issues anchored to element GlobalIds, carrying their own viewpoint/geometry — an RFI becomes a query against an object that already knows its own answer | Surface A |
| 3 | **Estimating** | 32% of overruns start here | Quantity take-off reads directly off the typed graph; cost lines are class-typed, not spreadsheet-typed | Surface A |
| 4 | **Construction** | 48% of rework traced to bad data | Stable element identity across re-imports/revisions — the field works on the same object the designer typed, not a redrawn approximation | Surface A → A/B handoff |
| 5 | **Handover** | Owners bear 67% of the total loss | IFC 4.3 + COBie export of the *same* graph that was authored — no re-keying, no rebuild; the record the owner inherits is the record that was authored | A → B handoff (the seam) |
| 6 | **Operations** | >90% of lifecycle cost occurs here | Compliance OS keeps the typed record live post-handover: deficiencies, rule provenance, and telemetry attach to the *same* elements | Surface B |
| 7 | **Compliance** | "Is this compliant?" today means a search through a binder | Versioned rules (source edition, clause, effective date, reviewer, jurisdiction) + evidence packets that regenerate byte-identically from the graph — compliance becomes a query with a receipt | Surface B |
| 8 | **Industry position** | AEC is the 2nd-least-digitized major industry | Open standards throughout (IFC, IDS, BCF, COBie) — no proprietary lock-in, adoption doesn't require betting on one vendor's survival | Cross-cutting |

**The wedge and the platform are the same build** (Rev D's own words) — you do
not build stage 6/7 (property compliance) and stages 1–5 (design/construction)
as two products that might someday integrate. You build one typed-object model
and expose two UIs onto it, sequenced by which one gets a paying customer
fastest (stage 6/7 — property managers — per your own portfolio-economics
argument: recurring, monthly, mandated, low-trust-barrier to land).

---

## 3. The seven-stage compliance loop (Surface B, zoomed in)

This is the Surface-B-side version of the same loop, at the resolution your
five strategy statements were converging on — property manager, property,
month, asset, evidence:

```
 ① Requirement scheduled
      (code-derived: NFPA 10/25/72/80/96/101, ASME A17.1, ASHRAE 188,
       OSHA §5, ADA Title III, CMS Life Safety Code — jurisdiction + edition + clause)
            │
 ② Check assigned
      (to: internal tech | facility employee | third-party vendor — execution
       layer is a role, not an org boundary)
            │
 ③ Check performed
      (photo / signature / timestamp / geotag — evidence, not a claim)
            │
 ④ Result recorded against the typed element
      (pass → record closes; fail → …)
            │
 ⑤ Deficiency → Work Order
      (auto-generated, assigned to internal team or external vendor,
       tracked to close — platform owns the workflow even when it doesn't
       own the labor)
            │
 ⑥ Evidence packet compiled
      (byte-identical regeneration from the graph — for AHJ, insurer, auditor)
            │
 ⑦ Portfolio roll-up
      (manager sees every property, every asset, every month — this is the
       recurring-revenue surface: sold per-property-per-month, not per-visit)
            │
            └──▶ feeds back into ① (next cycle) and into Surface A
                 (as-operated data informs next design's IDS rule defaults)
```

Stage ⑦ closing the loop back into Surface A is the detail that makes this a
graph and not a checklist app: operational failure patterns become authoring-
time rule defaults for the *next* building. That feedback edge is why this
is one product, not two products with a data export between them.

---

## 4. Compliance lanes already validated (Surface B market map)

Directly from Rev D's market-sizing table — these are not hypothetical
verticals, they're already sized with named budget anchors:

| Lane | Governing standard(s) | Budget anchor (as documented) |
|---|---|---|
| 01 Fire & life safety | NFPA 10/25/72/80/96/101 — weekly through 5-yr ITM cycles | $3.0B US ITM services; 2.1M+ inspections H1 2024 (64% alarm, 52% sprinkler) |
| 02 Water & mechanical | ASHRAE 188 Legionella, backflow, impairment reporting | CMS mandates water mgmt in healthcare; $2.5B backflow devices |
| 03 Workplace safety | OSHA §5 general duty — hazard records, corrective action | $2.73B N.A. EHS software |
| 04 Accessibility | ADA Title III barrier survey + remediation history | 8,667 federal filings 2025; 3.535M pre-1990 buildings |
| 05 Insurance & risk | Loss-control evidence, claim docs, per carrier | 2026 renewals differentiate on risk governance, not rate |
| 06 Vertical transport *(new)* | ASME A17.1 elevator ITM | Already co-filed with fire + backflow through BRYCER |
| 07 Healthcare physical environment *(new)* | Joint Commission Physical Environment ch., CMS Life Safety Code | $4.37B healthcare compliance software; 6,093 hospitals |

Emergency lighting (your entry-point example) sits inside Lane 01 as the
highest-frequency, lowest-friction check — monthly, binary pass/fail, no
special tooling — which is exactly why it's the correct onboarding wedge and
not a separate idea from the other six lanes above. One schema, seven lanes,
same asset table, same work-order table.

---

## 5. Data model — the actual schema, both surfaces, one graph

```
TypedElement  (the atomic unit — exists once, referenced everywhere)
 ├─ global_id            (stable across CAD re-imports, per Rev D's hardest-problem framing)
 ├─ ifc_class            (IFC 4.3 typed class, not a free-text category)
 ├─ geometry_ref         (authored once, Surface A)
 ├─ property_id          (FK → Property, populated at handover)
 └─ jurisdiction_id      (FK → Jurisdiction, for rule resolution)

Property
 ├─ portfolio_id         (FK → Portfolio / Manager — the recurring-revenue unit)
 ├─ address, type        (hotel, healthcare, commercial, multifamily, ...)
 └─ has many → TypedElement

ComplianceRule            (versioned, with provenance — Rev D: "source edition,
                            clause, effective date, reviewer, jurisdiction")
 ├─ standard              (NFPA 10, ASME A17.1, ADA Title III, ...)
 ├─ applies_to_ifc_class  (binds rule to element type, not to a property manually)
 └─ frequency             (monthly / annual / 5-year / continuous)

CheckInstance              (generated from TypedElement × ComplianceRule × due date)
 ├─ status                 (due / done / overdue / failed)
 ├─ executor_id            (FK → Executor: internal | facility employee | vendor)
 ├─ evidence_ref           (photo, signature, timestamp, geotag)
 └─ produces → WorkOrder (on fail)

WorkOrder
 ├─ assigned_to            (internal team OR external Vendor — role, not owner)
 ├─ status                 (open / in-progress / closed)
 └─ closes → CheckInstance (re-check, evidence attached)

EvidencePacket             (regenerates byte-identically from the graph — not
                            a stored PDF, a query result)
 └─ for: AHJ submission | insurance loss-control | audit | investor diligence

Design-side (Surface A) tables reference the SAME TypedElement:
IDSValidationResult, BCFIssue, QuantityTakeoffLine, COBieExport
 — all keyed to global_id, not re-entered.
```

This is the concrete answer to "there's nothing this doesn't touch": every
module you named across five drafts — property manager dashboards, vendor
work orders, IoT telemetry, the CAD plugin, cost estimating, construction
QA — is a **view or a writer onto this one schema**, not a separate system
requiring its own data model.

---

## 5b. Schema extension — device-originated checks and reminder cadence

Session 3's keyword taxonomy (Property Management / Vendor Workflow / Digital
Tracking) named two mechanisms that §5's original schema left implicit rather
than modeled: **(a)** a check can originate from a device or QR scan, not only
from a scheduled `ComplianceRule`, and **(b)** a `WorkOrder` needs an explicit
reminder/escalation cadence, not just a status field. Both are named pillar
terms in the taxonomy ("iot", "device", "reminder" — Vendor Workflow cluster),
so they get modeled here rather than left as a UI feature bolted on later.

```
TypedElement                (extended — §5's definition, plus:)
 ├─ qr_code                 (physical QR/NFC tag id — the asset's real-world handle)
 ├─ twin_ref                (pointer into the IFC/BIM digital-twin geometry —
 │                            same global_id as Surface A's authored element)
 └─ has many → DeviceBinding

DeviceBinding                (an IoT/telemetry source attached to a TypedElement)
 ├─ device_type              (BACnet point | LoRaWAN sensor | QR-scan event | NFC tap)
 ├─ telemetry_only           (always true — enforces the §6 non-control boundary
 │                            at the schema level, not just in copy)
 └─ emits → DeviceEvent

DeviceEvent                  (a signal arriving from a DeviceBinding)
 ├─ event_type                (fault | scan | reading | heartbeat)
 ├─ payload                   (raw telemetry — e.g. battery-low, offline, out-of-range)
 └─ may generate → CheckInstance
                               (a DeviceEvent creates an *ad hoc* CheckInstance,
                               same table as §5's scheduled ones — a fault reported
                               by a sensor and a fault found on a scheduled walk
                               are the same row type, just a different origin)

CheckInstance                (extended — §5's definition, plus:)
 └─ origin                   (scheduled_rule | device_event | qr_scan | manual_report)

WorkOrder                    (extended — §5's definition, plus:)
 ├─ vendor_id                (FK → Vendor — a first-class entity, not a free-text field)
 └─ has many → ReminderEvent

Vendor                       (external party — distinct from internal Executor)
 ├─ trade                    (fire/life-safety | backflow | elevator | HVAC | ...)
 ├─ contact_channel           (email | SMS | portal)
 └─ services → many Property (many-to-many: a vendor serves multiple properties
                               in a portfolio, a property may use multiple vendors)

ReminderEvent                 (the escalation cadence a WorkOrder actually runs on)
 ├─ scheduled_for             (T+0 assignment notice, T+N reminder, T+overdue escalation)
 ├─ channel                   (email | SMS | portal notification)
 ├─ escalation_level           (vendor → property manager → portfolio owner, on repeated miss)
 └─ closes when                (WorkOrder status = closed, i.e. evidence attached — see §5)
```

This closes the exact loop stated in the session's framing —
**asset/device/event → work order → vendor action → reminder/escalation →
deficiency tracking → compliance record** — as literal foreign-key edges, not
narrative steps. `DeviceEvent` and the scheduled path in §5 write into the
*same* `CheckInstance` table (distinguished only by `origin`), which is what
makes "IoT signals, inspections, vendor dispatch, and corrective action all
feeding one property-level dashboard" a single query instead of a
reconciliation job between two systems.

---

## 6. Explicit boundary (already in Rev D — do not relitigate this)

> *"Ridgeline is evidence and decision support. It does not control life-safety
> systems. Every IoT path is telemetry-only, with explicit non-control language
> in code, docs, contracts, and UI."*

This is load-bearing, not optional: it is the liability boundary that lets the
platform ingest BACnet/LoRaWAN/QR/NFC signals from any device (including
someone else's IoT hardware) without becoming a fire-alarm-control-system
vendor subject to UL 864 listing requirements. Keep this line in every surface
(marketing site, app UI, vendor contracts) as new modules are added.

---

## 7. Sequencing (dependency-ordered, not preference-ordered)

Nothing below is cut. This is the order the graph can actually be built in,
because each phase's output is the next phase's input.

| Phase | What ships | Why it must come first |
|---|---|---|
| **0 (done)** | Investor site — the narrative wrapper, all 8 stages referenced | Needed to raise the $4.25M that funds everything below |
| **1** | Surface B MVP: Property → Asset → CheckInstance → WorkOrder, starting with Lane 01 (fire/life safety, emergency-light wedge) | Fastest path to a paying portfolio customer; validates the schema with real evidence data before Surface A exists |
| **2** | Vendor workflow layer on top of Phase 1 (work orders to 3rd parties, reminders, close-out) | Requires Phase 1's WorkOrder table to exist; this is what makes the platform sellable even without owning field labor |
| **3** | Additional compliance lanes (02–07 above) on the *same* schema | Zero new data model — new ComplianceRule rows + new executor onboarding, not new architecture |
| **4** | Surface A: Vectorworks native plugin (per Rev D's own team plan — first two hires are SDK engineer + BIM/IFC engineer, M0–M8) | Requires the TypedElement schema from Phase 1 to already be stable, since Surface A writes into it |
| **5** | Handover bridge: IFC 4.3 / COBie export from Surface A populates Surface B's Property/TypedElement tables automatically at building handover | This is the seam — cannot build until both surfaces exist |
| **6** | Feedback loop: operational failure data (Surface B) informs IDS rule defaults at design time (Surface A) | The graph only becomes a *graph* (vs. two apps) once this edge closes |

Phase 1 and Phase 4 can run in parallel with separate funding/teams once the
schema in §5 is frozen — they do not block each other, only Phase 5 depends on
both.

---

## 7b. Keyword crosswalk — session 3's taxonomy, mapped to schema

Session 3 supplied three explicit keyword clusters and asked for the bridge
between them. Rather than answer in prose again, every term is mapped to its
exact table/field below. If a term has no row, the schema has a gap — there
are none outstanding as of this revision.

| Cluster | Keyword | Schema location |
|---|---|---|
| **Property Management** | property | `Property` table (§5) |
| | compliance | `ComplianceRule`, `EvidencePacket` (§5) |
| | management | `Portfolio` → `Property` rollup, §3 stage ⑦ |
| | month | `ComplianceRule.frequency`, `CheckInstance` due-date generation (§5) |
| | recurring | `ComplianceRule.frequency` + §3's loop re-entering at ① |
| | platform | the schema itself — one graph, two surfaces (§1) |
| | manager | `Portfolio` owner role; consumer of §3 stage ⑦ roll-up |
| | system | the full graph, §5 + §5b combined |
| **Vendor Workflow** | work (order) | `WorkOrder` table (§5) |
| | order | `WorkOrder` table (§5) |
| | device | `DeviceBinding`, `DeviceEvent` (§5b) |
| | vendor | `Vendor` table, first-class entity (§5b) |
| | iot | `DeviceBinding.device_type`, `telemetry_only` boundary flag (§5b, §6) |
| | create | `CheckInstance.origin = device_event` → auto-creates `WorkOrder` on fail (§5, §5b) |
| | workflow | §3's seven-stage loop, now with device-originated entry point (§5b) |
| | reminder | `ReminderEvent` table — cadence + escalation levels (§5b) |
| **Digital Tracking** | qr | `TypedElement.qr_code`, `CheckInstance.origin = qr_scan` (§5b) |
| | asset | `TypedElement` — the atomic unit (§5) |
| | digital | `TypedElement.twin_ref`, `geometry_ref` (§5, §5b) |
| | ifc | `TypedElement.ifc_class`, IFC 4.3/COBie export (§5) |
| | twin | `TypedElement.twin_ref` (§5b) |
| | bim | Surface A tables — `IDSValidationResult`, `BCFIssue`, `QuantityTakeoffLine` (§5) |
| | tracking | `CheckInstance.origin` + `WorkOrder` status history (§5, §5b) |
| | deficiency | `CheckInstance.status = failed` → `WorkOrder` (§5) |

**The one-line proof this crosswalk exists to produce:** a fault reported by
an IoT sensor (`DeviceEvent`), a deficiency found on a scheduled walk
(`ComplianceRule` → `CheckInstance`), and an issue logged from a QR scan
(`origin = qr_scan`) all terminate in the identical `WorkOrder` →
`ReminderEvent` → `EvidencePacket` path. Three input vocabularies (management,
vendor, digital) converge on one execution path — which is the literal
schema-level version of "compliance nervous system for buildings."

---

## 8. What this resolves from this session

- **File triage (RIDGELINE-002):** resolved. All 4 uploaded files are altitude
  views of this one graph, not competing options.
- **Strategy synthesis (RIDGELINE-003):** resolved. Your 5 drafts and Rev D's
  own "Solution" sheet say the same thing; this doc is the merge.
- **"We want everything, don't make us choose":** resolved architecturally —
  nothing is cut, sequencing in §7 is dependency-driven so every module still
  ships, just not simultaneously.
- **Keyword taxonomy (Property Management / Vendor Workflow / Digital
  Tracking, session 3):** resolved. §7b crosswalks all 24 terms to exact
  schema locations; §5b closes the two gaps the taxonomy exposed
  (device-originated checks, reminder/escalation cadence).

## 9. Still open (unchanged, not forgotten)

1. Deploy target for the live investor site: `cf-byok-deploy` vs
   `gsk-hosted-deploy`.
2. GitHub push — offered, not actioned.
3. The 4 images from an earlier turn never arrived on this side (no
   path/URL) — re-attach if they carry information not already covered here.
4. **Which artifact gets built next** — pick one, several, or say "all,
   sequenced" and I'll follow §7's phase order without asking again:
   - **(a)** Working Phase-1 demo: real Cloudflare D1 + Hono app implementing
     `Property → TypedElement → CheckInstance → WorkOrder → ReminderEvent`
     (the schema in §5+§5b, not a mockup) — the emergency-light wedge, live.
   - **(b)** Investor site updated to surface this unified lifecycle table
     (§2) and the crosswalk (§7b) explicitly, instead of implying it.
   - **(c)** This doc treated as internal/pitch reference only, no new code
     yet — proceed straight to deploying what's already built.
