-- Ridgeline Compliance OS — demo seed data
-- One portfolio, three properties, emergency-lighting + extinguisher assets,
-- a mix of check statuses so the dashboard demonstrates the full loop:
-- due -> done -> failed -> work order -> vendor -> reminder -> evidence.

INSERT INTO portfolios (id, name, manager_name, manager_email) VALUES
  (1, 'Front Range Hospitality Group', 'Dana Whitfield', 'dana@frhg-demo.com');

INSERT INTO properties (id, portfolio_id, name, address, property_type, jurisdiction) VALUES
  (1, 1, 'Summit Lodge — Boulder',      '2100 Canyon Blvd, Boulder, CO',      'hotel', 'CO'),
  (2, 1, 'Riverfront Inn — Denver',     '455 S Platte River Dr, Denver, CO',  'hotel', 'CO'),
  (3, 1, 'Foothills Suites — Golden',   '890 Table Mesa Dr, Golden, CO',      'hotel', 'CO');

INSERT INTO vendors (id, name, trade, contact_email, contact_phone) VALUES
  (1, 'Front Range Fire & Life Safety', 'fire_life_safety', 'dispatch@frfls-demo.com', '303-555-0110'),
  (2, 'Peak Backflow Services',         'backflow',         'jobs@peakbackflow-demo.com', '303-555-0121');

-- Assets: emergency lights + extinguishers across the 3 properties.
INSERT INTO assets (id, property_id, global_id, ifc_class, label, location, qr_code, twin_ref) VALUES
  (1,  1, 'RL-SL-EL-001', 'IfcLightFixture',            'Exit Light — Lobby',            'Lobby, Level 1',        'QR-SL-EL-001', 'twin://summit-lodge/L1/EL-001'),
  (2,  1, 'RL-SL-EL-002', 'IfcLightFixture',            'Exit Light — Corridor 2A',      'Corridor 2A, Level 2',  'QR-SL-EL-002', 'twin://summit-lodge/L2/EL-002'),
  (3,  1, 'RL-SL-EX-001', 'IfcFireSuppressionTerminal', 'Extinguisher — Kitchen',        'Kitchen, Level 1',      'QR-SL-EX-001', 'twin://summit-lodge/L1/EX-001'),
  (4,  2, 'RL-RI-EL-001', 'IfcLightFixture',            'Exit Light — Main Stair',       'Main Stairwell',        'QR-RI-EL-001', 'twin://riverfront-inn/ST/EL-001'),
  (5,  2, 'RL-RI-EL-002', 'IfcLightFixture',            'Exit Light — Corridor 3B',      'Corridor 3B, Level 3',  'QR-RI-EL-002', 'twin://riverfront-inn/L3/EL-002'),
  (6,  2, 'RL-RI-EX-001', 'IfcFireSuppressionTerminal', 'Extinguisher — Laundry',        'Laundry, Level 1',      'QR-RI-EX-001', 'twin://riverfront-inn/L1/EX-001'),
  (7,  3, 'RL-FS-EL-001', 'IfcLightFixture',            'Exit Light — Rear Exit',        'Rear Exit, Level 1',    'QR-FS-EL-001', 'twin://foothills-suites/L1/EL-001'),
  (8,  3, 'RL-FS-EX-001', 'IfcFireSuppressionTerminal', 'Extinguisher — Front Desk',     'Front Desk, Level 1',   'QR-FS-EX-001', 'twin://foothills-suites/L1/EX-001');

INSERT INTO compliance_rules (id, standard, lane, applies_to_ifc_class, frequency, description, effective_date, jurisdiction) VALUES
  (1, 'NFPA 101 7.9.3',  'Lane 01 Fire & life safety', 'IfcLightFixture',            'monthly', 'Emergency/exit lighting functional test — 30-second minimum illumination check', '2024-01-01', 'CO'),
  (2, 'NFPA 10 7.2.1',   'Lane 01 Fire & life safety', 'IfcFireSuppressionTerminal', 'monthly', 'Portable extinguisher visual inspection — gauge, seal, obstruction check',          '2024-01-01', 'CO');

-- Check instances for the current cycle (August 2026), mixed statuses:
INSERT INTO check_instances (id, asset_id, compliance_rule_id, origin, due_date, status, executor_type, executor_name, evidence_note, evidence_photo_url, completed_at) VALUES
  (1, 1, 1, 'scheduled_rule', '2026-08-05', 'done',     'facility_employee', 'M. Ortega', 'Illuminated 30s, no flicker.', 'https://example.com/evidence/sl-el-001-aug.jpg', '2026-08-05 09:12:00'),
  (2, 2, 1, 'scheduled_rule', '2026-08-05', 'failed',   'facility_employee', 'M. Ortega', 'Lamp dark on test — battery suspected.', 'https://example.com/evidence/sl-el-002-aug.jpg', '2026-08-05 09:20:00'),
  (3, 3, 2, 'scheduled_rule', '2026-08-05', 'done',     'facility_employee', 'M. Ortega', 'Gauge in green, seal intact.', NULL, '2026-08-05 09:30:00'),
  (4, 4, 1, 'scheduled_rule', '2026-08-10', 'done',     'internal', 'R. Castillo', 'Pass.', NULL, '2026-08-10 14:00:00'),
  (5, 5, 1, 'scheduled_rule', '2026-08-10', 'overdue',  NULL, NULL, NULL, NULL, NULL),
  (6, 6, 2, 'scheduled_rule', '2026-08-10', 'due',      NULL, NULL, NULL, NULL, NULL),
  (7, 7, 1, 'device_event',   '2026-08-22', 'failed',   NULL, NULL, 'Sensor reported fault: exit light offline 2+ hrs.', NULL, NULL),
  (8, 8, 2, 'scheduled_rule', '2026-09-05', 'due',      NULL, NULL, NULL, NULL, NULL);

-- Device binding + event backing check #7 (the IoT-originated fault).
INSERT INTO device_bindings (id, asset_id, device_type, telemetry_only) VALUES
  (1, 7, 'lorawan', 1);

INSERT INTO device_events (id, device_binding_id, event_type, payload) VALUES
  (1, 1, 'fault', '{"code":"LIGHT_OFFLINE","duration_min":137,"battery_pct":9}');

-- Work orders spawned from the two failed checks (#2 and #7).
INSERT INTO work_orders (id, check_instance_id, vendor_id, status, description, created_at) VALUES
  (1, 2, 1, 'open',        'Replace battery / inspect ballast — Exit Light Corridor 2A, Summit Lodge.', '2026-08-05 09:25:00'),
  (2, 7, 1, 'in_progress', 'Investigate exit light fault — Rear Exit, Foothills Suites (IoT-reported).', '2026-08-22 03:14:00');

-- Reminder cadence for the open work order (#1): sent T+0, upcoming T+3, escalation pending.
INSERT INTO reminder_events (id, work_order_id, scheduled_for, channel, escalation_level, sent_at) VALUES
  (1, 1, '2026-08-05 09:25:00', 'email', 'vendor',            '2026-08-05 09:25:00'),
  (2, 1, '2026-08-08 09:00:00', 'email', 'vendor',            NULL),
  (3, 1, '2026-08-12 09:00:00', 'sms',   'property_manager',  NULL),
  (4, 2, '2026-08-22 03:15:00', 'email', 'vendor',            '2026-08-22 03:15:00'),
  (5, 2, '2026-08-24 09:00:00', 'sms',   'property_manager',  '2026-08-24 09:03:00');
