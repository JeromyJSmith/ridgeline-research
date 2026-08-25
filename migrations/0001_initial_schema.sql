-- Ridgeline Compliance OS — Phase 1 schema
-- Implements docs/MASTER-ARCHITECTURE.md §5 + §5b
-- Entities: Portfolio, Property, TypedElement(Asset), ComplianceRule,
--           CheckInstance, WorkOrder, Vendor, ReminderEvent, EvidencePacket,
--           DeviceBinding, DeviceEvent

CREATE TABLE IF NOT EXISTS portfolios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  manager_email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  portfolio_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  property_type TEXT NOT NULL, -- hotel | healthcare | commercial | multifamily
  jurisdiction TEXT NOT NULL DEFAULT 'CO',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id)
);

-- TypedElement: the atomic asset (§5). "assets" table = TypedElement.
CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  global_id TEXT UNIQUE NOT NULL,      -- stable identity, survives re-imports
  ifc_class TEXT NOT NULL,             -- e.g. IfcLightFixture, IfcFireSuppressionTerminal
  label TEXT NOT NULL,                 -- human label: "Exit Light — Corridor 2F-A"
  location TEXT,                       -- floor/room text description
  qr_code TEXT UNIQUE,                 -- §5b: physical QR/NFC tag id
  twin_ref TEXT,                       -- §5b: pointer into IFC/BIM twin geometry
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS compliance_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  standard TEXT NOT NULL,              -- e.g. "NFPA 101 7.9"
  lane TEXT NOT NULL,                  -- Lane 01 Fire & life safety, etc (§4)
  applies_to_ifc_class TEXT NOT NULL,
  frequency TEXT NOT NULL,             -- monthly | annual | 5_year
  description TEXT NOT NULL,
  effective_date TEXT,
  jurisdiction TEXT NOT NULL DEFAULT 'CO'
);

CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  trade TEXT NOT NULL,                 -- fire_life_safety | backflow | elevator | hvac
  contact_email TEXT,
  contact_phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS check_instances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL,
  compliance_rule_id INTEGER,          -- nullable: device/qr-originated checks may have none
  origin TEXT NOT NULL DEFAULT 'scheduled_rule', -- scheduled_rule | device_event | qr_scan | manual_report
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'due',  -- due | done | overdue | failed
  executor_type TEXT,                  -- internal | facility_employee | vendor
  executor_name TEXT,
  evidence_note TEXT,
  evidence_photo_url TEXT,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (compliance_rule_id) REFERENCES compliance_rules(id)
);

CREATE TABLE IF NOT EXISTS work_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  check_instance_id INTEGER NOT NULL,
  vendor_id INTEGER,                   -- null = assigned internally
  status TEXT NOT NULL DEFAULT 'open', -- open | in_progress | closed
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  FOREIGN KEY (check_instance_id) REFERENCES check_instances(id),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE IF NOT EXISTS reminder_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_order_id INTEGER NOT NULL,
  scheduled_for DATETIME NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email', -- email | sms | portal
  escalation_level TEXT NOT NULL DEFAULT 'vendor', -- vendor | property_manager | portfolio_owner
  sent_at DATETIME,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id)
);

-- §5b DeviceBinding / DeviceEvent (IoT + QR signal path)
CREATE TABLE IF NOT EXISTS device_bindings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL,
  device_type TEXT NOT NULL,           -- bacnet | lorawan | qr_scan | nfc_tap
  telemetry_only INTEGER NOT NULL DEFAULT 1, -- always 1: enforces §6 non-control boundary
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);

CREATE TABLE IF NOT EXISTS device_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_binding_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,            -- fault | scan | reading | heartbeat
  payload TEXT,                        -- JSON text
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_binding_id) REFERENCES device_bindings(id)
);

CREATE INDEX IF NOT EXISTS idx_properties_portfolio ON properties(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_assets_property ON assets(property_id);
CREATE INDEX IF NOT EXISTS idx_check_asset ON check_instances(asset_id);
CREATE INDEX IF NOT EXISTS idx_check_status ON check_instances(status);
CREATE INDEX IF NOT EXISTS idx_check_due ON check_instances(due_date);
CREATE INDEX IF NOT EXISTS idx_wo_check ON work_orders(check_instance_id);
CREATE INDEX IF NOT EXISTS idx_wo_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_reminder_wo ON reminder_events(work_order_id);
