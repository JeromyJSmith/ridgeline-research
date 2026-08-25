-- Ridgeline Compliance OS — Phase 2 seed
-- Real code data from the hotel life-safety ITM research.
-- Every citation below is traceable to research/hotel-inspection-automation/.
-- Citation status: P = primary text read verbatim · S = secondary · U = unverified.

-- ══════════════════════════════════════════════════════════════
-- 1. Upgrade the two Phase-1 rules with their real citations
-- ══════════════════════════════════════════════════════════════

UPDATE compliance_rules SET
  standard = 'NFPA 101 §7.9.3.1.1(1)',
  citation = 'NFPA 101 §7.9.3.1.1(1); IFC §1032.10.1',
  citation_status = 'P',
  who_may_perform = 'O',
  frequency = 'monthly',
  description = 'Emergency lighting — functional test, minimum 30 seconds (min 3, max 5 weeks between tests)',
  automation_status = 'permitted_today',
  automation_citation = 'NFPA 101 §7.9.3.1.3',
  automation_note = 'Computer-based self-testing automates BOTH the 30-day 30-second test and the annual 90-minute test. Critically, §7.9.3.1.3 contains NO 30-day human visual inspection — unlike §7.9.3.1.2, which does. The difference between those two subsections is worth real money.',
  residual_human_step = 'None. This is the only obligation found where the code fully deletes both the periodic and the annual manual test.',
  requires_licensed_signature = 0,
  record_retention = 'Written records kept by the owner — NFPA 101 §7.9.3.1.1(5)'
WHERE id = 1;

UPDATE compliance_rules SET
  standard = 'NFPA 10 §7.2.1.2',
  citation = 'NFPA 10 §7.2.1.2; content per §7.2.2 (seven items)',
  citation_status = 'P',
  who_may_perform = 'O',
  frequency = 'monthly',
  description = 'Portable extinguisher inspection — seven-item check: in place, visible, accessible, gauge in operable range, full by heft, hose/nozzle condition, tamper seal intact',
  automation_status = 'permitted_today',
  automation_citation = 'NFPA 10 §7.2.1.2; IFC §906.2 Exception 2',
  automation_note = 'Permitted by electronic monitoring since the 2007 edition. IFC §906.2 Exc. 2 goes further and is the richest credit in the code: thirty-day inspections not required AND maintenance allowed once every 3 years — dry-chemical/halogenated only, indoors, on a listed and approved device. TRAP: §7.2.1.4 — monitoring for LOCATION ONLY (a bracket removal switch) does NOT excuse the manual inspection. Monitoring must sense pressure, presence and obstruction.',
  residual_human_step = 'NFPA 10 §7.6.1.2 — 100% of monitoring units verified annually (tightened from a 20%/year rotation), plus §7.6.2 semiannual NFPA 72 visual inspection of the monitoring devices themselves. Automation creates new human work.',
  requires_licensed_signature = 0,
  record_retention = 'Electronic event log at the control panel — NFPA 10 §7.2.4.6'
WHERE id = 2;

-- ══════════════════════════════════════════════════════════════
-- 2. The rule library — the real recurring calendar
-- ══════════════════════════════════════════════════════════════

INSERT INTO compliance_rules
  (id, standard, lane, applies_to_ifc_class, frequency, description, effective_date, jurisdiction,
   citation, citation_status, who_may_perform, automation_status, automation_citation,
   automation_note, residual_human_step, requires_licensed_signature, record_retention,
   unsupervised_frequency, supervised_frequency, supervision_multiplier)
VALUES

-- ── Extinguishers: the part that stays human ──
(3, 'NFPA 10 §7.3.1.1.1', 'Lane 01 Fire & life safety', 'IfcFireSuppressionTerminal', 'annual',
 'Extinguisher maintenance — thorough physical examination, internal/external exam, hose and nozzle, recharge if needed',
 '2024-01-01', 'CO', 'NFPA 10 §7.3.1.1.1; §7.1.2.1', 'P', 'C',
 'not_permitted', NULL,
 'Maintenance is a hands-on teardown by a certified person who applies a tag. Automation can displace INSPECTION (§7.2); it cannot displace MAINTENANCE (§7.3). The only relief is IFC §906.2 Exc. 2, which stretches this to 3-yearly under five conditions.',
 'Full annual external exam by a certified person; 6-year internal; 5/12-year hydrostatic. Tag hand-punched with the technician name and company.',
 1, 'Tag remains on the extinguisher; records until next annual + 1 year', NULL, NULL, NULL),

-- ── Emergency lighting: the annual leg ──
(4, 'NFPA 101 §7.9.3.1.1(3)', 'Lane 01 Fire & life safety', 'IfcLightFixture', 'annual',
 'Emergency lighting — functional test, minimum 1.5 hours (90 minutes) at full load',
 '2024-01-01', 'CO', 'NFPA 101 §7.9.3.1.1(3); IFC §1032.10.2', 'P', 'O',
 'permitted_today', 'NFPA 101 §7.9.3.1.3',
 'Computer-based self-testing performs the annual 90-minute test automatically and must report full test/failure history on demand (§7.9.3.1.3(5)). UL 924 self-test hardware ships today.',
 'None for the test itself. Note the limit: a fixture aimed at a wall passes its own 90-minute self-test perfectly — illumination LEVEL along the egress path (1 fc avg / 0.1 fc min / 40:1) is a photometric survey of a space, not a self-test of a fixture.',
 0, 'Written records kept by the owner', NULL, NULL, NULL),

-- ── Water-based: automation buys evidence, not schedule ──
(5, 'NFPA 25 §13.2.3.2.2', 'Lane 01 Fire & life safety', 'IfcFlowInstrument', 'semiannual',
 'Waterflow alarm test — vane, paddle and pressure-switch type. Must signal within 90 seconds',
 '2024-01-01', 'CO', 'NFPA 25 §13.2.3.2.2 (2023 ed. — was §13.2.6.2)', 'P', 'Q',
 'no_relief', 'NFPA 25 §4.6.6.2, §4.6.6.3',
 'Automated equipment MAY perform the test (§4.6.6.3 — it must produce the same action the standard requires). But §4.6.6.12 is explicit: frequencies are maintained REGARDLESS of the functionality of automated testing equipment. On the water side, automation buys labour substitution and evidence quality — not fewer events.',
 'NFPA 25 §4.6.1.1 — automated testing shall be observed at a minimum frequency of once every 3 years. §4.6.6.14 — results analysed by qualified personnel.',
 0, 'One year past the next ITM of that type — NFPA 25 §4.3.5',
 NULL, NULL, NULL),

-- ── The supervision discount: the under-exploited provision ──
(6, 'NFPA 25 §13.3.2.1', 'Lane 01 Fire & life safety', 'IfcValve', 'weekly',
 'Sprinkler control valve inspection — normal position, sealed/locked/supervised, accessible, correct wrenches, free from external leaks, identification',
 '2024-01-01', 'CO', 'NFPA 25 §13.3.2.1 → §13.3.2.1.1 → §13.3.2.1.2', 'P', 'O',
 'permitted_today', 'NFPA 25 §13.3.2.1.1, §13.3.2.1.2',
 'SUPERVISION DISCOUNT. Sealed valves: weekly. Locked OR supervised per the applicable NFPA standard: monthly (4x). Electrically supervised: quarterly. No AHJ approval, no performance-based programme, no listing of automated ITM equipment — just supervision plus a monitored receiving point. Two gating conditions: NFPA 72-grade supervision (integrity-supervised circuit, supervisory signal, trouble on fault), and connection to a CONSTANTLY ATTENDED LOCATION. A hotel front desk is staffed 24/7 — the hard condition is satisfied for free.',
 'The inspection CONTENT of §13.3.2.2 still applies at the reduced frequency. Annual full-range valve operation under §13.3.3.1 is untouched.',
 0, 'One year past next ITM of that type',
 'weekly', 'quarterly', 4.0),

(7, 'NFPA 25 §9.2.3.1', 'Lane 01 Fire & life safety', 'IfcTank', 'daily',
 'Water storage tank heating system — inspection during the heating season',
 '2024-01-01', 'CO', 'NFPA 25 §9.2.3.1 / §9.2.3.2', 'P', 'O',
 'permitted_today', 'NFPA 25 §9.2.3.1',
 'THE LARGEST SINGLE DISCOUNT IN NFPA 25. Daily during the heating season becomes weekly where the tank has a supervised low water temperature alarm connected to a constantly attended location — approximately 7x.',
 'The supervised alarm itself becomes an inspected device.',
 0, 'One year past next ITM of that type',
 'daily', 'weekly', 7.0),

(8, 'NFPA 25 §13.2.2', 'Lane 01 Fire & life safety', 'IfcFlowInstrument', 'annual',
 'Main drain test — record static pressure, open the 2-inch drain fully, record residual, close, confirm return to static',
 '2024-01-01', 'CO', 'NFPA 25 §13.2.2 (2023 ed. — was §13.2.5)', 'P', 'Q',
 'no_relief', 'NFPA 25 §4.6.6.3',
 'Mechanically the most automatable procedure in NFPA 25: two transducers and a motorised valve. The test is literally "record two numbers and compare to baseline," and the 10% criterion is arithmetic. Detects a closed or obstructed supply valve upstream — the deadliest failure in the building.',
 'Frequency unchanged (§4.6.6.12). Discharge visually observed at least once every 3 years (§4.6.6.4.2).',
 0, 'One year past next ITM of that type', NULL, NULL, NULL),

(9, 'NFPA 25 §8.3.2.7', 'Lane 01 Fire & life safety', 'IfcPump', 'weekly',
 'Fire pump no-flow (churn) test — start by pressure drop, run, record suction/discharge pressure, RPM, volts, amps, packing gland drip',
 '2024-01-01', 'CO', 'NFPA 25 §8.3.2.7 → §8.3.2.10', 'P', 'Q',
 'permitted_today', 'NFPA 25 §8.3.2.10',
 'One of the strongest rows in the permission map. Verbatim: "Qualified personnel shall be in attendance whenever the pump is in operation UNLESS automated inspection and testing is performed in accordance with 8.3.2.10." Weekly for diesel, monthly for electric.',
 '§8.3.2.10.2 — all checklist observations still performed and abnormalities recorded. §8.3.2.10.2.2 — if packing gland adjustment is indicated, qualified personnel must make it. §8.3.2.10.3 — diesel controller must have automatic engine shutdown.',
 0, 'One year past next ITM of that type', NULL, NULL, NULL),

(10, 'NFPA 25 §8.3.3', 'Lane 01 Fire & life safety', 'IfcPump', 'annual',
 'Fire pump annual flow test — churn, 100% and 150% of rated capacity',
 '2024-01-01', 'CO', 'NFPA 25 §8.3.3; §8.3.3.9(1)', 'P', 'C',
 'not_permitted', NULL,
 'No automated path absent permanent test loops. The hose-stream or flowmeter-to-drain arrangement is required at least every third year.',
 'Entire test remains manual.',
 0, 'One year past next ITM of that type', NULL, NULL, NULL),

-- ── Fire alarm: the credit belongs to the panel maker ──
(11, 'NFPA 72 §14.4.4.2', 'Lane 01 Fire & life safety', 'IfcAlarm', 'annual',
 'Fire alarm manual test frequency — extended to annually where automatic weekly testing is performed by a remotely monitored, listed control unit',
 '2024-01-01', 'CO', 'NFPA 72 §14.4.4.2 (2022 & 2025 eds.)', 'P', 'Q',
 'gated_listing', 'NFPA 72 §14.4.4.2',
 'THE BINDING CONSTRAINT IS THE UL LISTING, NOT THE CODE. Three gating conditions: testing must be automatic and at least weekly; performed BY the fire alarm control unit, not a bolt-on IoT overlay; and the FACU must be "specifically listed for the application." That phrase means the credit accrues to the PANEL MANUFACTURER, not an aftermarket sensor vendor. The provision has stood since ~2007 and nobody has commoditised it. NOTE: NFPA 72 contains NO self-testing clause — zero hits across the 2022/2025/2028 committee corpus. Vendor claims describe UL 268 listings.',
 'Table 14.3.1 visual inspection frequencies are untouched by this credit.',
 0, 'Until the next test and 1 year thereafter — NFPA 72 §14.6.2.1', NULL, NULL, NULL),

(12, 'NFPA 72 Table 14.3.1 Item 2', 'Lane 01 Fire & life safety', 'IfcAlarm', 'annual',
 'Fire alarm control unit inspection — fuses, interfaced equipment, lamps and LEDs, primary power',
 '2024-01-01', 'CO', 'NFPA 72 Table 14.3.1 Item 2(1) vs 2(2)', 'P', 'Q',
 'permitted_today', 'NFPA 72 Table 14.3.1 Item 2(1)',
 'A 52x credit already built into the inspection table and widely unnoticed: a MONITORED system inspects control equipment annually; an UNMONITORED system inspects the same items WEEKLY. Monitoring is not merely good practice — the code prices it.',
 'Annual test regardless.',
 0, 'Until next test + 1 year', 'weekly', 'annual', 52.0),

-- ── Passive protection: irreducibly tactile ──
(13, 'NFPA 80 §5.2.1', 'Lane 01 Fire & life safety', 'IfcDoor', 'annual',
 'Fire door assembly inspection — eleven checkpoints including label legibility, no field modifications, clearance, closer, latch, coordinator, glazing, gasketing, hardware',
 '2024-01-01', 'CO', 'IFC §705.2 → NFPA 80 §5.2.1; record per §5.2.2.4(6)', 'P', 'Q',
 'not_permitted', NULL,
 'Two of the eleven checkpoints automate cleanly — self-close and latch verification, via a position encoder plus a strike-plate latch-engagement sensor. They happen to be the two that fail constantly and the two that actually stop smoke. The other nine are irreducibly tactile at ~220 leaves in a 150-key hotel: a technician runs a HAND over the leaf and finds the filled-and-sanded hole a camera reads as paint. CAUTION: networked door closers and strike-plate latch sensors are already patented — freedom-to-operate review required.',
 'Nine of eleven checkpoints, per leaf, annually. Record signed by the inspector of record.',
 1, 'Acceptance for the life of the assembly; otherwise at least 3 years', NULL, NULL, NULL),

(14, 'IFC §701.6', 'Lane 01 Fire & life safety', 'IfcWall', 'annual',
 'Fire-resistance-rated construction — owner visually inspects, and maintains an inventory of rated construction',
 '2024-01-01', 'CO', 'IFC §701.6', 'P', 'O',
 'not_permitted', NULL,
 'Underrated and widely skipped. An explicit ANNUAL, OWNER-PERFORMED duty covering all rated construction, plus a requirement to maintain an inventory of it. Most hotels do not do this — and an asset graph is exactly an inventory of rated construction.',
 'Concealed firestopping is a person with a flashlight above a ceiling tile, forever. Cameras plus change detection do catch path obstruction well.',
 0, '3 years on premises — IFC §901.6.3', NULL, NULL, NULL),

-- ── Kitchen: zero technology answer ──
(15, 'IFC §904.5.1', 'Lane 01 Fire & life safety', 'IfcFireSuppressionTerminal', 'semiannual',
 'Commercial kitchen hood wet-chemical suppression — inspect and test for proper operation; service within 6 months and after any activation',
 '2024-01-01', 'CO', 'IFC §904.5.1, §904.13.5.2 → NFPA 17A', 'P', 'C',
 'not_permitted', NULL,
 'NFPA 17A does not yet permit remote ITM at all — there is no technology answer here. The procedure is a chain of mechanical states: cable tension through pulley elbows, nozzle aim, blow-off cap age, cartridge weight, detection-line integrity, fusible links. Instrument the OUTCOME states and accept a two-hour hands-on semiannual. The 3-dollar tension-lever switch that catches "left it UP" after service is worth more than the rest combined.',
 'The entire semiannual service. Certificate of inspection to the fire code official.',
 1, 'Certificate to the fire code official', NULL, NULL, NULL),

-- ── Generator: relief was asked for and refused ──
(16, 'NFPA 110 §8.4.1', 'Lane 01 Fire & life safety', 'IfcElectricGenerator', 'weekly',
 'Emergency power supply system — weekly inspection of the generator and appurtenant components',
 '2024-01-01', 'CO', 'NFPA 110 §8.4.1', 'S', 'O',
 'not_permitted', NULL,
 'RELIEF WAS REFUSED IN WRITING. Public Inputs 18 and 21 in the 2022 cycle asked for relief at unmanned sites; Resolution FR-15 granted it only to Level 2 systems on reduced criticality. Generators already telemeter heavily — Table 5.6.5.4 has a remote-audible column — and still require the walk-up. A modern controller senses nearly every weekly checklist item, which makes this a pure regulatory blocker rather than a technical one.',
 'The weekly physical walk-up. Monthly 30-minute load run at 30% nameplate or the manufacturer exhaust gas temperature.',
 0, 'Records: date, technician, conditions noted, corrective action — IFC §1203.4.3', NULL, NULL, NULL),

-- ── Backflow: blocked by licensing, not physics ──
(17, 'NFPA 25 §13.7.2.1', 'Lane 02 Water & mechanical', 'IfcValve', 'annual',
 'Backflow prevention assembly — forward flow test at system demand',
 '2024-01-01', 'CO', 'NFPA 25 §13.7.2.1 (2023 ed. — was §13.6.2.1)', 'P', 'E',
 'not_permitted', NULL,
 'The physics is easy — permanent transducers on the test cocks plus a motorised needle valve would run the whole RPZ sequence. The obstacle is the LICENSING REGIME: in most jurisdictions only a certified backflow tester with an annually calibrated gauge may sign the test, and the WATER PURVEYOR, not the fire AHJ, owns the requirement. Non-filing can terminate water service. Continuous relief-port discharge detection is worth deploying today regardless — it catches a fouled check the day it fouls rather than eleven months later.',
 'The signed annual test, by a certified tester, filed with the water purveyor.',
 1, 'Filed with the water purveyor annually', NULL, NULL, NULL),

-- ── Staff obligation, not a device test ──
(18, 'NFPA 101 §29.7.1.2', 'Lane 01 Fire & life safety', 'IfcBuilding', 'quarterly',
 'Drills of the hotel emergency organisation',
 '2024-01-01', 'CO', 'NFPA 101 §29.7.1.2', 'P', 'O',
 'not_permitted', NULL,
 'A hard recurring calendar obligation that is NOT a device test — a staff event with a record. Frequently missed, and it belongs in any hotel compliance calendar.',
 'The drill itself.',
 0, 'Hilton brand standard: current calendar year + previous 6 years', NULL, NULL, NULL),

-- ── Elevator: the honest impossibility ──
(19, 'ASME A17.1 §8.6.11.1', 'Lane 06 Vertical transport', 'IfcTransportElement', 'monthly',
 'Firefighter Emergency Operation (FEO) — Phase I recall and Phase II in-car operation test',
 '2024-01-01', 'CO', 'ASME A17.1 §8.6.11.1', 'U', 'E',
 'not_permitted', NULL,
 'SECTION NUMBER UNVERIFIED — ASME A17.1 is paywalled and absent from the Public.Resource corpus. The monthly frequency is near-universally reported by elevator contractors and AHJs; treat the frequency as reliable and the section number as a lead. Phase I recall automates. PHASE II DOES NOT: the entire test is "does the car obey a firefighter continuously-pressed thumb" — constant-pressure door close, release at halfway to force reversal, constant-pressure open, CALL CANCEL. There is no way to test constant-pressure behaviour without a constant pressure. A relay that simulates the button proves the relay works, not the safety.',
 'Phase II in its entirety. Elevator inspection is state-licensed almost everywhere — the one item a hotel can essentially never self-perform.',
 1, 'Certificate posted in the car, renewed annually', NULL, NULL, NULL);

-- ══════════════════════════════════════════════════════════════
-- 3. Assets — a representative slice of the real inventory
-- ══════════════════════════════════════════════════════════════
-- A 150-key hotel carries ~1,600 code-inspectable items producing
-- 2,500-3,000 inspect-or-test actions a year. Seeded here is a
-- representative slice, not the full inventory — labelled as such in the UI.

INSERT INTO assets (id, property_id, global_id, ifc_class, label, location, qr_code, twin_ref) VALUES
  (20, 1, 'RL-SL-VLV-001', 'IfcValve',              'Riser Control Valve — OS&Y',        'Riser Room, Level 1',   'QR-SL-VLV-001', 'twin://summit-lodge/L1/VLV-001'),
  (21, 1, 'RL-SL-VLV-002', 'IfcValve',              'Floor Control Valve — Level 2',     'Riser Closet, Level 2', 'QR-SL-VLV-002', 'twin://summit-lodge/L2/VLV-002'),
  (22, 1, 'RL-SL-FLW-001', 'IfcFlowInstrument',     'Waterflow Switch — Level 2',        'Riser Closet, Level 2', 'QR-SL-FLW-001', 'twin://summit-lodge/L2/FLW-001'),
  (23, 1, 'RL-SL-FLW-002', 'IfcFlowInstrument',     'Main Drain — Riser 1',              'Riser Room, Level 1',   'QR-SL-FLW-002', 'twin://summit-lodge/L1/FLW-002'),
  (24, 1, 'RL-SL-PMP-001', 'IfcPump',               'Fire Pump — Electric, 750 gpm',     'Pump Room, Level 1',    'QR-SL-PMP-001', 'twin://summit-lodge/L1/PMP-001'),
  (25, 1, 'RL-SL-FACP-01', 'IfcAlarm',              'Fire Alarm Control Unit',           'Fire Command, Level 1', 'QR-SL-FACP-01', 'twin://summit-lodge/L1/FACP-01'),
  (26, 1, 'RL-SL-DR-2A01', 'IfcDoor',               'Rated Corridor Door — 2A-01',       'Corridor 2A, Level 2',  'QR-SL-DR-2A01', 'twin://summit-lodge/L2/DR-2A01'),
  (27, 1, 'RL-SL-DR-STR1', 'IfcDoor',               'Stair Enclosure Door — Stair 1',    'Stair 1, Level 2',      'QR-SL-DR-STR1', 'twin://summit-lodge/L2/DR-STR1'),
  (28, 1, 'RL-SL-HOOD-01', 'IfcFireSuppressionTerminal','Kitchen Hood Suppression — Line 1','Kitchen, Level 1',  'QR-SL-HOOD-01', 'twin://summit-lodge/L1/HOOD-01'),
  (29, 1, 'RL-SL-GEN-001', 'IfcElectricGenerator',  'Emergency Generator — 150 kW',      'Generator Yard',        'QR-SL-GEN-001', 'twin://summit-lodge/EXT/GEN-001'),
  (30, 1, 'RL-SL-BF-0001',  'IfcValve',             'Backflow Preventer — RPZ 4in',      'Riser Room, Level 1',   'QR-SL-BF-0001', 'twin://summit-lodge/L1/BF-001'),
  (31, 2, 'RL-RI-VLV-001', 'IfcValve',              'Riser Control Valve — OS&Y',        'Riser Room, Level 1',   'QR-RI-VLV-001', 'twin://riverfront-inn/L1/VLV-001'),
  (32, 2, 'RL-RI-FLW-001', 'IfcFlowInstrument',     'Waterflow Switch — Level 3',        'Riser Closet, Level 3', 'QR-RI-FLW-001', 'twin://riverfront-inn/L3/FLW-001'),
  (33, 2, 'RL-RI-FACP-01', 'IfcAlarm',              'Fire Alarm Control Unit',           'Back Office, Level 1',  'QR-RI-FACP-01', 'twin://riverfront-inn/L1/FACP-01');

-- ══════════════════════════════════════════════════════════════
-- 4. THE IMPAIRMENT CLOCK — the wedge, demonstrated
-- ══════════════════════════════════════════════════════════════
-- Summit Lodge: three separate short sprinkler outages inside one 24-hour
-- window. No single event approaches the 10-hour threshold. Cumulatively
-- they cross it. This is the failure mode no hand-kept log catches.

INSERT INTO impairments
  (id, property_id, system, kind, started_at, ended_at, cause, coordinator_name,
   tag_posted, compensating_measure, threshold_hours, threshold_citation, check_instance_id)
VALUES
  (1, 1, 'water_based', 'emergency', '2026-08-23 06:00:00', NULL,
   'Riser 1 control valve closed for sprinkler head replacement on Levels 2-4, reopened between phases',
   'Dana Whitfield', 1, NULL, 10.0,
   'NFPA 25 §15.5.2(4) — compensating measures required past 10 hours out of service in any 24-hour period', NULL),

  (2, 2, 'fire_alarm', 'preplanned', '2026-08-24 22:00:00', '2026-08-25 01:30:00',
   'FACU firmware update — planned, coordinated with monitoring station',
   'Dana Whitfield', 1, 'fire_watch', 4.0,
   'NFPA 101 §9.6.1.8 — notify the AHJ and evacuate or provide an approved fire watch past 4 hours in 24', NULL),

  (3, 3, 'water_based', 'hidden', '2026-08-20 00:00:00', '2026-08-24 11:15:00',
   'Floor control valve found 60% closed during routine inspection — closure date unknown',
   'Dana Whitfield', 0, NULL, 10.0,
   'NFPA 25 §15.5.2(4). Zurich classifies this as a HIDDEN impairment — an outage existing without the knowledge of those responsible. Continuous valve-position monitoring collapses this category to zero.', NULL);

-- The three windows that cumulatively breach. Individually: 3.5 + 4.0 + 3.25 = 10.75 h.
INSERT INTO impairment_windows (impairment_id, opened_at, closed_at, hours, note) VALUES
  (1, '2026-08-23 06:00:00', '2026-08-23 09:30:00', 3.50,  'Phase 1 — Level 2 heads'),
  (1, '2026-08-23 11:00:00', '2026-08-23 15:00:00', 4.00,  'Phase 2 — Level 3 heads'),
  (1, '2026-08-23 18:45:00', '2026-08-23 22:00:00', 3.25,  'Phase 3 — Level 4 heads. CUMULATIVE 10.75 h — threshold breached at 21:45.'),
  (2, '2026-08-24 22:00:00', '2026-08-25 01:30:00', 3.50,  'Single window, below the 4 h fire-alarm threshold'),
  (3, '2026-08-20 00:00:00', '2026-08-24 11:15:00', 107.25,'Duration is a lower bound — actual closure date unknown');

-- ══════════════════════════════════════════════════════════════
-- 5. Notifications — the statutory fan-out, with its clocks
-- ══════════════════════════════════════════════════════════════

INSERT INTO notifications
  (impairment_id, party, requirement, basis, due_rule, due_by, sent_at, channel, note)
VALUES
  (1, 'fire_department',    'Notify the fire department immediately that a required system is out of service',
      'IFC §901.7', 'immediately', '2026-08-23 06:15:00', '2026-08-23 06:11:00', 'phone', NULL),
  (1, 'fire_code_official', 'Notify the fire code official immediately',
      'IFC §901.7', 'immediately', '2026-08-23 06:15:00', '2026-08-23 06:14:00', 'email', NULL),
  (1, 'insurance_carrier',  'Notify the carrier of a known impairment',
      'ISO CP 04 11 ¶A.3/¶B — the duty attaches on KNOWLEDGE; only a 48-hour restoration safe harbour',
      'on_knowledge', NULL, NULL, NULL,
      'UNSENT. This is the notification that voids coverage when missed — Garvin Street (2026) and Frankenmuth (2023) both hold that no prejudice and no causal nexus is required for denial.'),
  (1, 'alarm_company',      'Notify the monitoring company of the impairment',
      'NFPA 25 §15.5(5)-(7)', 'immediately', '2026-08-23 06:15:00', '2026-08-23 06:12:00', 'phone', NULL),

  (2, 'fire_department',    'Preplanned impairment — notify before work starts',
      'NFPA 25 §15.5(5)-(7); IFC §901.7.4', 'before_work', '2026-08-24 22:00:00', '2026-08-24 16:30:00', 'email', NULL),
  (2, 'insurance_carrier',  'Preplanned impairment — advance notice',
      'FM DS 10-7 — permit request at least 24 h in advance for any impairment beyond one 8-hour shift',
      'before_work', '2026-08-23 22:00:00', '2026-08-23 15:00:00', 'portal', NULL),
  (2, 'ahj',                'Fire alarm out of service beyond the threshold — notify the AHJ',
      'NFPA 101 §9.6.1.8; NFPA 72 §10.21.4 (report at 8 h out of service)', '+8h',
      '2026-08-25 06:00:00', NULL, NULL, 'Not required — restored at 01:30, inside the window.'),

  (3, 'insurance_carrier',  'Hidden impairment discovered at inspection — notify on discovery',
      'ISO CP 04 11; FM DS 2-81 §2.3.5 treats degraded performance discovered through ITM as out of service',
      'on_knowledge', '2026-08-24 11:15:00', '2026-08-24 11:40:00', 'email', NULL),
  (3, 'fire_department',    'System discovered out of service — notify immediately',
      'IFC §901.7', 'immediately', '2026-08-24 11:30:00', '2026-08-24 11:22:00', 'phone', NULL);

-- ══════════════════════════════════════════════════════════════
-- 6. Attestations — the boundary, in data
-- ══════════════════════════════════════════════════════════════

INSERT INTO attestations
  (check_instance_id, signer_name, licence_type, licence_number, attestation_text,
   machine_prefilled_fields, total_fields, signed_at)
VALUES
  (1, 'M. Ortega', NULL, NULL,
   'Monthly emergency lighting inspection recorded by the owner. NFPA 101 §7.9.3.1.1(5) requires written records; no licensed signature is required for this record.',
   11, 12, '2026-08-05 09:12:00'),
  (3, 'M. Ortega', NULL, NULL,
   'Monthly extinguisher inspection per NFPA 10 §7.2.2. No certification required — §7.1.2.3 places the duty on the owner.',
   7, 8, '2026-08-05 09:30:00');

-- ══════════════════════════════════════════════════════════════
-- 7. Automation feasibility ledger
-- ══════════════════════════════════════════════════════════════

INSERT INTO automation_candidates (rank, bucket, item, mechanism, code_path, blocker, confidence, labour_note, verdict) VALUES
 (1,'easiest','Valve stem position','Absolute stem-position encoder replacing the binary tamper switch','NFPA 25 §13.3.2.1.2',NULL,'high','~2 hr/yr — but it is not about the hours','Upgrades "someone turned it" to "it is 78% open and has been since March." The highest-consequence failure in the building becomes continuously visible. A safety argument, not a labour one.'),
 (2,'easiest','Emergency lighting monthly + annual 90-min','UL 924 self-test hardware with a reporting layer','NFPA 101 §7.9.3.1.3',NULL,'high','~9-12 hr/yr of button-pressing plus a weekend of 90-minute breaker work','The code fully deletes both tests. Batteries are the #1 failure and a runtime self-test catches them precisely.'),
 (3,'easiest','Exit sign battery test','Same hardware, same code path','NFPA 101 §7.10.9.1',NULL,'high','~5 hr/yr','Ride it in on the same network.'),
 (4,'easiest','FACP standby battery capacity','Shunt plus internal-resistance trending','NFPA 72 T14.4.3.2 fn d',NULL,'high','~1 hr','Converts a coin-flip into a measurement. Voltage-only checks produce false passes.'),
 (5,'easiest','Smoke detector sensitivity drift','Read the value the panel already computes, nightly','NFPA 72 T14.4.3.2 Item 17(8)(3),(4)',NULL,'high','~4-6 hr every other year','Nothing to invent. The addressable panel already computes it.'),
 (6,'easiest','Guest-room leak and abnormal flow','Point sensors plus flow monitoring',NULL,NULL,'high','0 code hours','NOT A CODE ITEM AT ALL — no AHJ, no listing, no standard. The shortest path from sensor to dollars, and it funds the code lanes.'),
 (7,'easiest','Waterflow switch 90-second test','Motorised test-and-drain plus transducer','NFPA 25 §4.6.6.3','listing','high','~6-10 hr/yr','Produces better evidence than a technician with a stopwatch and a radio — exact seconds to signal, exact gpm.'),
 (8,'easiest','Main drain test','Two transducers and a motorised valve','NFPA 25 §4.6.6.3',NULL,'high','~2-4 hr/yr','The most mechanically trivial procedure in NFPA 25.'),
 (9,'easiest','Gauge readings','Transducers in place of or parallel to analog gauges','NFPA 25 §4.6.6.2',NULL,'high','~4 hr/yr','Kills the "gauge stuck at zero for three years" failure.'),
 (10,'easiest','Extinguisher monthly','Optical gauge read, weighted hook, tamper and obstruction sensing','NFPA 10 §7.2.1.2; IFC §906.2 Exc. 2',NULL,'high','~5-7 hr/yr of pure walking','The code did the hard part.'),
 (11,'easiest','Generator weekly and monthly run data','Controller telemetry plus battery conductance','NFPA 110 §8.4.1','licensing','medium','~20-25 hr/yr','Technically solved; the weekly walk-up was refused relief in writing.'),
 (12,'easiest','Fire pump churn — electrical/hydraulic half','Solenoid, transducers, tachometer, optical drip counter','NFPA 25 §8.3.2.10',NULL,'high','~20-35 hr/yr','Every number on the clipboard is instrumentable.'),
 (13,'easiest','Fire door close and latch','Position encoder plus strike-plate latch sensor','NFPA 80 §5.2.1','patent','medium','Does not delete the annual','Two of eleven checkpoints — the two that fail constantly. PATENTED: freedom-to-operate review required.'),
 (14,'easiest','Door propped or held open','Commodity access-control sensing',NULL,'patent','high','Continuous instead of never','Solved everywhere except on rated doors in hotels.'),
 (15,'easiest','Off-premises signal verification','Reconcile panel log against central-station log','NFPA 72 Ch. 26',NULL,'high','~2 hr/yr','Both sides are already digital. Today it is a phone call and a hope.'),
 (1,'hardest','Sprinkler head condition','Imaging sweep with change detection against the last sweep','NFPA 25 §5.2.1','judgement','low','~800 units','THE central hard problem. Categories are subtle — factory white vs a fresh coat of the same white. Best play deletes the SWEEP, not the JUDGEMENT. Anyone claiming full automation here is selling something.'),
 (2,'hardest','The other nine NFPA 80 checkpoints','Tactile inspection','NFPA 80 §5.2.1','judgement','low','~220 leaves','A technician runs a hand over the leaf and finds what a camera reads as paint. Clearance measurement is a genuine unbuilt sensor opportunity.'),
 (3,'hardest','Elevator Phase II','None viable','ASME A17.1','physics','low',NULL,'You cannot test constant-pressure behaviour without a constant pressure. Accept it.'),
 (4,'hardest','Egress path illumination level','Photometric commissioning plus tamper monitoring','NFPA 101 §7.9','judgement','low',NULL,'A fixture aimed at a wall passes its own self-test perfectly. Monitor for regression, do not claim to measure compliance.'),
 (5,'hardest','Fire and smoke dampers','Electric actuators with position feedback','NFPA 80 §19.4','access','medium','40-80 units, 15-45 min each','Sensing is solved outright. ACCESS is not — many are drywalled or painted shut. Capture at renovation, one floor at a time.'),
 (6,'hardest','Kitchen hood mechanical readiness','Instrument the outcome states','NFPA 17A','physics','low',NULL,'The 3-dollar tension-lever switch is worth more than the rest combined.'),
 (7,'hardest','dBA at the pillow, door closed','Microphone on the guest-room module','NFPA 72 §18','judgement','medium',NULL,'Ambient moves with the PTAC, the ice machine, the cart, the guest TV. And the walkthrough is where technicians find water-stained tiles.'),
 (8,'hardest','Backflow annual certified test','Transducers on the test cocks plus a motorised needle valve','NFPA 25 §13.7.2.1','licensing','medium',NULL,'Blocked by the licensing regime, not physics. Deploy relief-port discharge detection today regardless.'),
 (9,'hardest','Standpipe hydrostatic and PRV full-flow','None viable','NFPA 25 §6.3','physics','low',NULL,'You cannot prove a hose valve opens under fire conditions without opening it. Irreducible.'),
 (10,'hardest','Firestopping and "has a human broken something"','Cameras plus change detection for path obstruction','IFC §701.6','judgement','low',NULL,'The state space of ways to break a building is unbounded. Concealed firestopping is a person with a flashlight above a ceiling tile, forever.');
