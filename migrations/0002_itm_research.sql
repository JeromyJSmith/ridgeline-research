-- Ridgeline Compliance OS — Phase 2 schema
-- Encodes the findings of the hotel life-safety ITM research
-- (see ../research/hotel-inspection-automation/ and ../HANDOFF.md §4.1)
--
-- Three things the Phase 1 schema could not express, each of which the
-- research shows is load-bearing:
--
--   1. WHAT A MACHINE MAY LAWFULLY DO. Automation permission is per-rule and
--      per-code-edition. NFPA 10 buys frequency relief; NFPA 25 buys none
--      (§4.6.6.12); NFPA 72's credit is gated to the panel listing. A rule
--      row that cannot say which of those it is cannot drive the product.
--
--   2. THE IMPAIRMENT CLOCK. Compensating measures trigger past 10 h / 24 h
--      (water-based, NFPA 25 §15.5.2(4)) and 4 h / 24 h (fire alarm,
--      NFPA 101 §9.6.1.8) — and THE WINDOW IS CUMULATIVE. Three 4-hour
--      outages in one day cross the line. Nobody tracks this by hand.
--
--   3. THE SIGNATURE. Every certification block is a first-person attestation
--      bound to a named individual and a licence number. 80-90% of form
--      fields are machine-producible; the attestation is not.

-- ══════════════════════════════════════════════════════════════
-- 1. ComplianceRule — carry the citation and the automation verdict
-- ══════════════════════════════════════════════════════════════

ALTER TABLE compliance_rules ADD COLUMN citation TEXT;
ALTER TABLE compliance_rules ADD COLUMN citation_status TEXT DEFAULT 'P';
  -- P = primary text read verbatim · S = secondary source · U = unverified.
  -- Unverified section numbers are leads, not citations. Never render a U
  -- figure without its badge.

ALTER TABLE compliance_rules ADD COLUMN who_may_perform TEXT DEFAULT 'Q';
  -- O = owner/staff, no licence · Q = qualified (trained, not licensed)
  -- C = licensed contractor (state law, NOT the standard) · E = specialty licensed
  -- NFPA 25 §4.1.1.3.1 never requires a licensed contractor; state law does.

ALTER TABLE compliance_rules ADD COLUMN automation_status TEXT DEFAULT 'not_permitted';
  -- permitted_today  — the standard permits it in its own text, no AHJ sign-off named
  -- permitted_w_ahj  — permitted only on approval (e.g. NFPA 25 §4.7 performance-based)
  -- gated_listing    — permitted but the credit accrues to the listed panel/device maker
  -- not_permitted    — the standard requires a person and provides no substitute
  -- no_relief        — automation MAY perform it, but the frequency is unchanged

ALTER TABLE compliance_rules ADD COLUMN automation_citation TEXT;
ALTER TABLE compliance_rules ADD COLUMN automation_note TEXT;
ALTER TABLE compliance_rules ADD COLUMN residual_human_step TEXT;
  -- What still needs hands/eyes even when automated. Never null for an
  -- automated rule — if you cannot name the residual step you have not
  -- read the provision carefully enough.

ALTER TABLE compliance_rules ADD COLUMN requires_licensed_signature INTEGER NOT NULL DEFAULT 0;
ALTER TABLE compliance_rules ADD COLUMN record_retention TEXT;

-- Supervision discounts (NFPA 25). Where a condition is electrically
-- supervised AND reported to a constantly attended location, the required
-- inspection frequency drops 3x-7x with no AHJ approval and no listing.
-- A hotel's 24/7 front desk satisfies the hard condition for free.
ALTER TABLE compliance_rules ADD COLUMN unsupervised_frequency TEXT;
ALTER TABLE compliance_rules ADD COLUMN supervised_frequency TEXT;
ALTER TABLE compliance_rules ADD COLUMN supervision_multiplier REAL;

-- ══════════════════════════════════════════════════════════════
-- 2. CheckInstance — deficiency severity
-- ══════════════════════════════════════════════════════════════
-- NFPA 25's three-tier ladder. Note these are NOT the same axis as
-- check status: a check can be 'done' and still have found a critical
-- deficiency. And per NFSA guidance, OVERDUE ITM is an owner compliance
-- issue, NOT a deficiency — the Phase 1 schema already models that
-- correctly as its own status value. Keep it that way.

ALTER TABLE check_instances ADD COLUMN severity TEXT;
  -- noncritical | critical | impairment | null (nothing found)
ALTER TABLE check_instances ADD COLUMN severity_basis TEXT;

-- ══════════════════════════════════════════════════════════════
-- 3. Impairments — THE CLOCK. The wedge.
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS impairments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  system TEXT NOT NULL,                 -- water_based | fire_alarm | standpipe | other
  kind TEXT NOT NULL DEFAULT 'emergency', -- preplanned | emergency | hidden
    -- 'hidden' is Zurich's term, not NFPA's: an outage nobody knows about,
    -- typically a closed valve found at inspection. This is the exact
    -- category continuous valve-position monitoring collapses to zero.
  started_at DATETIME NOT NULL,
  ended_at DATETIME,
  cause TEXT,
  coordinator_name TEXT,                -- IFC §901.7.1: absent a designee, the OWNER is the coordinator
  tag_posted INTEGER NOT NULL DEFAULT 0,-- IFC §901.7.3: FDC, control valve, FACU, annunciator, command centre
  compensating_measure TEXT,            -- evacuation | fire_watch | temp_water_supply | ignition_control
  threshold_hours REAL NOT NULL,        -- 10.0 water-based · 4.0 fire alarm
  threshold_citation TEXT NOT NULL,
  check_instance_id INTEGER,            -- when discovered during ITM
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (check_instance_id) REFERENCES check_instances(id)
);

-- Discrete out-of-service windows. The cumulative sum of these inside any
-- rolling 24 h window is what crosses the threshold — NOT the duration of
-- any single event. This table exists so the sum is computable.
CREATE TABLE IF NOT EXISTS impairment_windows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  impairment_id INTEGER NOT NULL,
  opened_at DATETIME NOT NULL,
  closed_at DATETIME,
  hours REAL,                           -- null while open; computed on close
  note TEXT,
  FOREIGN KEY (impairment_id) REFERENCES impairments(id)
);

-- ══════════════════════════════════════════════════════════════
-- 4. Notifications — the legally required fan-out
-- ══════════════════════════════════════════════════════════════
-- Distinct from reminder_events, which chase a VENDOR. These are statutory
-- and contractual duties owed to outside parties, each with its own clock
-- and its own citation. Missing the carrier notice is what voids coverage
-- (Garvin Street 2026; Frankenmuth 2023 — no prejudice, no causal nexus required).

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  impairment_id INTEGER,
  check_instance_id INTEGER,
  party TEXT NOT NULL,
    -- fire_department | fire_code_official | insurance_carrier | alarm_company
    -- | owner | ahj | occupants | brand
  requirement TEXT NOT NULL,            -- human-readable duty
  basis TEXT NOT NULL,                  -- the citation that compels it
  due_rule TEXT NOT NULL,               -- 'immediately' | 'before_work' | '+8h' | '+24h' | 'on_knowledge'
  due_by DATETIME,
  sent_at DATETIME,
  channel TEXT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (impairment_id) REFERENCES impairments(id),
  FOREIGN KEY (check_instance_id) REFERENCES check_instances(id)
);

-- ══════════════════════════════════════════════════════════════
-- 5. Attestations — where automation stops, by law
-- ══════════════════════════════════════════════════════════════
-- "I ______ certify that I inspected and tested..." — first person, named
-- individual, licence number. The machine produces the evidence and
-- pre-fills 80-90% of the fields; a licensed human signs. Model the
-- signature as its own object so the boundary is explicit in the data,
-- not merely in the UI copy.

CREATE TABLE IF NOT EXISTS attestations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  check_instance_id INTEGER NOT NULL,
  signer_name TEXT NOT NULL,
  licence_type TEXT,                    -- CoF | NICET | state_contractor | backflow_tester | QEI
  licence_number TEXT,
  attestation_text TEXT NOT NULL,       -- the verbatim first-person certification
  machine_prefilled_fields INTEGER,     -- how many fields the system produced
  total_fields INTEGER,                 -- denominator for the "80-90%" claim, per record
  signed_at DATETIME,
  FOREIGN KEY (check_instance_id) REFERENCES check_instances(id)
);

-- ══════════════════════════════════════════════════════════════
-- 6. Automation candidates — the feasibility ledger
-- ══════════════════════════════════════════════════════════════
-- Ranked by (labour deleted x code path exists) / (engineering + listing
-- difficulty). Carries the honest negative cases too: the research is only
-- credible because it names what CANNOT be automated and why.

CREATE TABLE IF NOT EXISTS automation_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rank INTEGER,
  bucket TEXT NOT NULL,                 -- easiest | hardest
  item TEXT NOT NULL,
  mechanism TEXT,                       -- the sensing/actuation concept
  code_path TEXT,                       -- the provision that permits it, if any
  blocker TEXT,                         -- physics | licensing | access | listing | judgement | patent
  confidence TEXT,                      -- high | medium | low
  labour_note TEXT,
  verdict TEXT
);

CREATE INDEX IF NOT EXISTS idx_impairment_property ON impairments(property_id);
CREATE INDEX IF NOT EXISTS idx_impairment_open ON impairments(ended_at);
CREATE INDEX IF NOT EXISTS idx_window_impairment ON impairment_windows(impairment_id);
CREATE INDEX IF NOT EXISTS idx_notification_impairment ON notifications(impairment_id);
CREATE INDEX IF NOT EXISTS idx_notification_sent ON notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_attestation_check ON attestations(check_instance_id);
CREATE INDEX IF NOT EXISTS idx_rules_automation ON compliance_rules(automation_status);
