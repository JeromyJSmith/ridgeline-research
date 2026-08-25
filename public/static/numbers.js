/*
  Ridgeline OpenBIM — canonical numbers.
  Single source of truth. Every figure in the site reads from this file.
  Sourced from investment_research_doc.md v6 (baseline.py).
*/
window.RIDGELINE = window.RIDGELINE || {};

window.RIDGELINE.numbers = {
  round: {
    ask_usd:               4_250_000,
    post_money_usd:       24_000_000,
    dilution_pct:               17.7,
    runway_months:              24,
    bump_ask_usd:          5_000_000,
    bump_cap_usd:         30_000_000,
    bump_runway_months:         30
  },

  costBasis: {
    build_loaded_per_fte_yr: 185_000,   // BLS 15-1252 median $133,080 + Autodesk L11 $172,771 + ~35% burden
    displaced_loaded_per_fte_yr: 130_000
  },

  fte: {
    modules: [
      { id: "M1", name: "Schematic Ingestion + Extraction",             low: 1.8, base: 2.0, high: 3.0, risk: "medium",
        note: "CV/2D-parsing + BIM-API + ETL engineers" },
      { id: "M2", name: "Knowledge-Graph Construction",                 low: 1.0, base: 2.5, high: 4.0, risk: "medium",
        note: "RDF/SPARQL/Neo4j + property-graph data engineers" },
      { id: "M3", name: "Gap Analysis + Auto-Fill",                     low: 0.5, base: 1.0, high: 2.0, risk: "low",
        note: "Ontology + LLM/agent + QA (missing-property assertions)" },
      { id: "M4", name: "CAD/BIM Plugin Layer (multi-SDK)",             low: 3.5, base: 6.5, high: 9.5, risk: "high",
        note: "#1 technical risk. Vectorworks C++ + Vectorscript Pascal + Revit .NET + Archicad/BricsCAD C++" },
      { id: "M5", name: "2D → 3D / Hybrid Conversion",                  low: 1.8, base: 2.5, high: 4.0, risk: "high",
        note: "Research-grade geometry-ML. Two of four high-case FTE are research, not eng." },
      { id: "M6", name: "Standards Ontology + Custom Namespace",        low: 1.4, base: 1.5, high: 3.0, risk: "medium",
        note: "IFC + OmniClass + MasterFormat + bSDD; class/object/volume-typed" },
      { id: "M7", name: "Compliance Checking (IBC/IRC/ADA/NFPA/IDS)",   low: 1.0, base: 1.5, high: 3.0, risk: "medium",
        note: "SME permanent — model codes release triennial" },
      { id: "M8", name: "QTO / Cost Estimation",                        low: 1.0, base: 1.0, high: 2.0, risk: "low",
        note: "Quantity surveyor SME (RSMeans/UniFormat) + cost-line DB engineer" },
      { id: "M9", name: "Audit / Evaluation Reporting",                 low: 1.0, base: 1.0, high: 2.0, risk: "low",
        note: "QA lead + technical writer + BI/reporting engineer" }
    ],
    engSubtotal:      { low: 12.2, base: 19.5, high: 31.6 },
    crossCutting:     { low:  3.0, base:  4.9, high:  9.0, name: "Cross-cutting: PM/lead, DevOps/SRE, QA, design, PMM (25% of eng)" },
    total:            { low: 15.2, base: 24.4, high: 40.6 },
    maintenanceY2on:  { low:  5.0, base: 10.0, high: 17.0 }
  },

  buildCost: {
    annual:          { low: 2_821_250, base: 4_509_375, high:  7_515_625 },
    eighteenMoBurn:  { low: 4_231_875, base: 6_764_063, high: 11_273_438 }
  },

  arr: {
    plugin:      { bear: 1_260_000,  base:  5_660_000, bull:   8_950_000 },
    complianceOS:{ bear:14_490_000,  base: 54_040_000, bull: 172_880_000 },
    crossSell:   { bear:         0,  base:    850_000, bull:   1_500_000 },
    combinedY5:  { bear:15_750_000,  base: 60_550_000, bull: 183_330_000 }
  },

  ev: {
    multiple:          { bear: 5.0, base: 9.5, bull: 9.5 },
    executionDiscount: 0.30,
    raw:      { bear: 78_750_000, base:  575_225_000, bull: 1_741_635_000 },
    realistic:{ bear: 78_750_000, base:  402_657_500, bull: 1_741_635_000 },
    headline: { bear: "≈ $80M",   base: "≈ $400M",    bull: "≈ $1.74B"    }
  },

  customerSide: {
    fteDisplacedPer100Proj: { low: 2.25, base: 5.05, high: 8.55 },
    laborSavedPerOrg:       { low: 292_500, base: 656_500, high: 1_111_500 },
    at200Y5:                { low: 58_500_000, base: 131_300_000, high: 222_300_000 }
  },

  arrRamp: [
    { year: "Y1", label: "Pilot",       arr:    283_000 },
    { year: "Y2", label: "Launch",      arr:  1_130_000 },
    { year: "Y3", label: "Scale",       arr:  2_550_000 },
    { year: "Y4", label: "Expansion",   arr:  4_250_000 },
    { year: "Y5", label: "Combined ARR (Base)", arr: 60_550_000 }
  ],

  useOfFunds: [
    { bucket: "Engineering (6 FTE: CTO, 2× Sr FS, BIM/IFC, IoT/firmware, ML/AI)", pct: 59, usd: 2_510_000 },
    { bucket: "GTM (field/customer engineering, product design)",                 pct: 12, usd:   492_000 },
    { bucket: "Infrastructure & tools (cloud, telemetry, secops)",                 pct:  9, usd:   364_000 },
    { bucket: "Working capital / contingency",                                     pct:  8, usd:   327_000 },
    { bucket: "IoT hardware + 65 building installs @ $4,560",                      pct:  7, usd:   296_000 },
    { bucket: "Legal & compliance (SOC 2 path, IP, E&O/cyber/GL, memberships)",    pct:  6, usd:   261_000 }
  ]
};

// -- Comparable exits (defending the 9.5× multiple)
window.RIDGELINE.comps = [
  { company: "GoCanvas",         acquirer: "Nemetschek",  usd: 770_000_000, mult: "≈ 11.5×", year: 2023 },
  { company: "PlanGrid",         acquirer: "Autodesk",    usd: 875_000_000, mult: "—",       year: 2018 },
  { company: "Nuvolo",           acquirer: "Trane (majority)", usd: 443_000_000, mult: "—",  year: 2023 },
  { company: "Building Engines", acquirer: "JLL",         usd: 300_000_000, mult: "—",       year: 2021 },
  { company: "Procore",          acquirer: "IPO (public)", usd: 3_000_000_000, mult: "public comp", year: 2021 },
  { company: "Odyssey",          acquirer: "Series B",    usd: 1_450_000_000, mult: "$310M raise",  year: 2026 },
  { company: "Inspect Point",    acquirer: "Mainsail $28M Apr 2025", usd: 39_500_000, mult: "$12.6M rev", year: 2025 },
  { company: "BuildingReports",  acquirer: "PE / self-funded", usd: 350_000, mult: "$16M rev", year: 2022 }
];

// -- Competitor matrix: 15 rows × 13 capability dimensions
// Ridgeline row is pinned first and tinted.
window.RIDGELINE.competitors = {
  columns: [
    { key: "vendor",      label: "Vendor",                     kind: "text" },
    { key: "type",        label: "Type",                       kind: "text" },
    { key: "vwNative",    label: "VW-native plug-in",          kind: "bool" },
    { key: "price",       label: "Per-seat price (2026)",      kind: "text" },
    { key: "share",       label: "Disclosed seats / share",    kind: "text" },
    { key: "ifcAuth",     label: "IFC authoring",              kind: "bool" },
    { key: "idsUI",       label: "IDS rule UI",                kind: "bool" },
    { key: "bcf",         label: "BCF",                        kind: "bool" },
    { key: "qto",         label: "QTO",                        kind: "bool" },
    { key: "openBimExp",  label: "openBIM export",             kind: "bool" },
    { key: "compliance",  label: "Compliance-platform",        kind: "bool" },
    { key: "auditPacket", label: "Audit packet",               kind: "bool" },
    { key: "multiSdk",    label: "Multi-SDK",                  kind: "bool" },
    { key: "twinBridge",  label: "Digital-twin bridge",        kind: "bool" },
    { key: "gap",         label: "Strategic gap Ridgeline closes", kind: "text" }
  ],
  rows: [
    {
      vendor: "Ridgeline OpenBIM", type: "Native plugin + Compliance-OS",
      vwNative: true, price: "$720/yr Pro · $18k/firm Enterprise",
      share: "Pre-launch (9-project pilot)",
      ifcAuth: true, idsUI: true, bcf: true, qto: true, openBimExp: true,
      compliance: true, auditPacket: true, multiSdk: true, twinBridge: true,
      gap: "— (reference row)", isRidgeline: true
    },
    {
      vendor: "Solibri", type: "IFC model checker + Solibri Inside",
      vwNative: true, price: "€164–294/mo · 3× hike Oct 2026",
      share: "Not disclosed · Office discontinued Apr 2026",
      ifcAuth: false, idsUI: "partial", bcf: true, qto: false, openBimExp: false,
      compliance: "partial", auditPacket: true, multiSdk: false, twinBridge: false,
      gap: "No VW-native typed ontology. Solibri Oct-26 3× hike creates churn window."
    },
    {
      vendor: "BIMcollab", type: "BCF issue platform",
      vwNative: false, price: "€12.50–25/user/mo",
      share: "Not disclosed",
      ifcAuth: false, idsUI: false, bcf: true, qto: false, openBimExp: false,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "BCF-only. Depends on Solibri upstream for validation."
    },
    {
      vendor: "Trimble Connect", type: "CDE + IFC viewer",
      vwNative: false, price: "$10–24/user/mo · Enterprise $50–200k",
      share: "10M cumulative users · AECO Q1'26 $389M",
      ifcAuth: false, idsUI: false, bcf: true, qto: false, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: "partial",
      gap: "Massive base, no VW-native compliance ontology."
    },
    {
      vendor: "Autodesk Revit", type: "Authoring (bSI-certified IFC export)",
      vwNative: false, price: "≈ $3,675/user/yr",
      share: "~21k companies · ≈ 37.2% BIM share",
      ifcAuth: true, idsUI: false, bcf: "partial", qto: "partial", openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: "partial",
      gap: "Loses ~50% room-property data on IFC export — the wound our receipt graph repairs."
    },
    {
      vendor: "Vectorworks", type: "Authoring host + plugin marketplace",
      vwNative: "self", price: "$1,365/user/yr",
      share: "0.61% overall CAD · niche monopoly in landscape/int/ent",
      ifcAuth: true, idsUI: false, bcf: false, qto: false, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "The host itself. No native compliance ontology or IDS rule UI."
    },
    {
      vendor: "Graphisoft Archicad", type: "Authoring (bSI-certified)",
      vwNative: false, price: "≈ $2,420/yr Studio",
      share: "Not disclosed",
      ifcAuth: true, idsUI: false, bcf: "partial", qto: false, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "Structurally same gap as Vectorworks."
    },
    {
      vendor: "Bentley OpenBuildings / iTwin", type: "Authoring + digital twin",
      vwNative: false, price: "Enterprise (not disclosed)",
      share: "Not disclosed",
      ifcAuth: true, idsUI: false, bcf: false, qto: false, openBimExp: true,
      compliance: "partial", auditPacket: "partial", multiSdk: false, twinBridge: true,
      gap: "Different buyer — enterprise infrastructure, not VW-niche."
    },
    {
      vendor: "IfcLite", type: "OSS browser IFC toolkit",
      vwNative: "via CEF", price: "Free (open source)",
      share: "Small private team",
      ifcAuth: false, idsUI: false, bcf: false, qto: false, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "Our dependency — embedded via CEF Web-Palette. Not a competitor."
    },
    {
      vendor: "BonsaiBIM (Blender add-on)", type: "OSS authoring + IDS",
      vwNative: false, price: "Free (open source)",
      share: "≈ 195 active community members",
      ifcAuth: true, idsUI: true, bcf: true, qto: false, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "Blender-only — no CAD-native path. Complement, not competitor."
    },
    {
      vendor: "IfcOpenShell", type: "OSS Python/C++ IFC library",
      vwNative: false, price: "Free (LGPL)",
      share: "Not disclosed (PyPI stats only)",
      ifcAuth: false, idsUI: false, bcf: false, qto: false, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "Library, not authoring. Substrate we build on."
    },
    {
      vendor: "OpenAEC Foundation", type: "OSS openBIM workflow tools",
      vwNative: "via CEF", price: "Free (open source)",
      share: "Not disclosed",
      ifcAuth: false, idsUI: false, bcf: false, qto: true, openBimExp: true,
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "Substrate module embedded via CEF host. Complement."
    },
    {
      vendor: "Inspect Point", type: "Site-side FLS inspection SaaS",
      vwNative: false, price: "Not per-seat published",
      share: "$12.6M rev · $39.5M raised (Mainsail $28M)",
      ifcAuth: false, idsUI: false, bcf: false, qto: false, openBimExp: false,
      compliance: true, auditPacket: true, multiSdk: false, twinBridge: false,
      gap: "Site-side, not authoring. Possible acquisition target."
    },
    {
      vendor: "BuildingReports", type: "FLS inspection SaaS",
      vwNative: false, price: "Not per-seat published",
      share: "$16M rev · $350K historical raise",
      ifcAuth: false, idsUI: false, bcf: false, qto: false, openBimExp: false,
      compliance: true, auditPacket: true, multiSdk: false, twinBridge: false,
      gap: "Site-side. Possible partnership / acquisition target."
    },
    {
      vendor: "ZWCAD 2026.1.1", type: "Entry-tier CAD with IFC import/edit/export",
      vwNative: false, price: "Not published in live search",
      share: "Not disclosed",
      ifcAuth: "partial", idsUI: false, bcf: false, qto: false, openBimExp: "partial",
      compliance: false, auditPacket: false, multiSdk: false, twinBridge: false,
      gap: "Long-tail follower. Too small to be a live threat."
    }
  ]
};

// -- VC-fit table: 12 thematic + 5 CVCs + 4 unconfirmed = 21 rows
// Theses paraphrased from public-facing fund materials. `[unverified]` = no public confirmation of AEC-plugin thesis; still worth an intro.
window.RIDGELINE.investors = [
  // ─── 12 SECTOR / THEMATIC FUNDS ───
  { name: "Brick & Mortar Ventures",   type: "Thematic",   stage: "Seed–A", checkUsd: "1–5M",  fit: 5,
    thesis: "Built-environment tech — construction, real estate, infrastructure. AEC-plugin thesis is core.",
    publication: "brickmortar.vc" },
  { name: "MetaProp",                  type: "Thematic",   stage: "Pre-seed–A", checkUsd: "0.5–3M", fit: 4,
    thesis: "PropTech-first. Compliance-OS + owner-side receipt fits their owner-of-record thesis.",
    publication: "metaprop.com" },
  { name: "Fifth Wall",                type: "Thematic",   stage: "Seed–C", checkUsd: "3–20M", fit: 4,
    thesis: "Largest built-world fund. LP includes major AEC corporates — good syndicate signal.",
    publication: "fifthwall.com" },
  { name: "Cemex Ventures",            type: "Thematic (strategic)", stage: "Seed–B", checkUsd: "1–5M", fit: 4,
    thesis: "Construction materials + supply chain. IFC-based QTO ties to their material-flow bet.",
    publication: "cemexventures.com" },
  { name: "Zigg Capital",              type: "Thematic",   stage: "Seed–A", checkUsd: "1–4M",  fit: 4,
    thesis: "PropTech / built-world. Owner-side compliance evidence is on-thesis.",
    publication: "zigg.vc" },
  { name: "Nine Four Ventures",        type: "Thematic",   stage: "Seed–A", checkUsd: "1–5M",  fit: 3,
    thesis: "Real estate tech + services. Owner-of-record compliance graph is adjacent.",
    publication: "ninefourventures.com" },
  { name: "LAB Ventures",              type: "Thematic",   stage: "Pre-seed–Seed", checkUsd: "0.25–2M", fit: 3,
    thesis: "PropTech/ConTech studio. Studio model may want deeper involvement — evaluate carefully.",
    publication: "labventures.co" },
  { name: "a16z (Mark Hoover)",        type: "Generalist w/ AEC exposure", stage: "Seed–B", checkUsd: "3–15M", fit: 3,
    thesis: "American Dynamism thesis touches construction. Partner-level intro required.",
    publication: "a16z.com" },
  { name: "Glasswing Ventures",        type: "Thematic (AI-first)",  stage: "Seed–A", checkUsd: "1–5M", fit: 3,
    thesis: "AI-native vertical SaaS. Typed knowledge-graph angle fits the ontology thesis.",
    publication: "glasswing.vc" },
  { name: "Ironspring Ventures",       type: "Thematic",   stage: "Seed–A", checkUsd: "1–4M",  fit: 4,
    thesis: "Industrial + AEC digitization. Native plugin thesis fits their portfolio pattern.",
    publication: "ironspring.com" },
  { name: "Creative Ventures",         type: "Thematic (deep-tech)",  stage: "Seed–A", checkUsd: "1–5M", fit: 3,
    thesis: "Physical-world labor productivity. Displaced-FTE narrative is on-thesis.",
    publication: "creativeventures.vc" },
  { name: "J-Ventures",                type: "Thematic",   stage: "Pre-seed–Seed", checkUsd: "0.25–1.5M", fit: 3,
    thesis: "Japan-US bridge. Nemetschek + Asia openBIM push makes this a strategic angel-network syndicate.",
    publication: "j-ventures.com" },

  // ─── 5 STRATEGIC CVCs ───
  { name: "Autodesk Ventures",         type: "CVC (strategic)", stage: "Seed–C", checkUsd: "1–10M", fit: 5,
    thesis: "Direct product overlap on Revit — but the IFC-export data-loss gap we close is Autodesk's own admitted weakness. Signal risk if they pass.",
    publication: "autodesk.com/investor" },
  { name: "Nemetschek Ventures",       type: "CVC (strategic)", stage: "Seed–B", checkUsd: "1–8M",  fit: 5,
    thesis: "Vectorworks + Solibri + Graphisoft parent. Highest strategic fit — but IP contamination risk. Discuss info-rights carefully.",
    publication: "nemetschek.com" },
  { name: "Trimble Ventures",          type: "CVC (strategic)", stage: "Seed–B", checkUsd: "1–8M",  fit: 4,
    thesis: "Trimble Connect distributor. Fit strong — but they'd want deep integration commitments.",
    publication: "trimble.com/ventures" },
  { name: "Procore Ventures",          type: "CVC (strategic)", stage: "Seed–B", checkUsd: "1–5M",  fit: 3,
    thesis: "Contractor-side, not authoring — fit is more channel than product. Good syndicate signal at Series A.",
    publication: "procore.com" },
  { name: "Titanium Ventures (fmr Telstra)", type: "CVC (strategic)", stage: "Seed–B", checkUsd: "2–10M", fit: 2,
    thesis: "Enterprise SaaS broadly. AEC-specific fit is thin but they've written checks in vertical SaaS.",
    publication: "titaniumventures.com" },

  // ─── 4 RELEVANCE-UNCONFIRMED ───
  { name: "Y Combinator",              type: "Accelerator", stage: "Pre-seed",  checkUsd: "0.5M standard", fit: 2,
    thesis: "[unverified] Batch model — dilution + brand value trade-off. Not a fit for a $4.25M seed on $24M post-money.",
    publication: "ycombinator.com" },
  { name: "Obvious Ventures",          type: "Thematic (world-positive)", stage: "Seed–A", checkUsd: "1–5M", fit: 2,
    thesis: "[unverified] World-positive mandate — carbon/energy angle needed to be primary, not secondary.",
    publication: "obvious.com" },
  { name: "Manifold Ventures",         type: "Generalist", stage: "Seed–A", checkUsd: "1–4M", fit: 2,
    thesis: "[unverified] No public AEC-plugin thesis observed. Would need warm intro to justify.",
    publication: "manifold.vc" },
  { name: "Tram Ventures",             type: "Thematic",   stage: "Seed–A", checkUsd: "1–3M", fit: 2,
    thesis: "[unverified] Mobility-and-infrastructure focus per public materials. AASHTO T-19 bridge angle is a possible entry.",
    publication: "tramventures.com" }
];

// -- Gap cards
window.RIDGELINE.gaps = [
  { id: "G1", title: "AI adoption without productivity",
    stat: ">80%", statLabel: "of enterprises using generative AI report NO material productivity gain",
    body: "The wrapper-on-disconnected-tools layer is why. Models have no typed ontology, no compliance state, no CAD-native identity. That's the WHY of the white space.",
    source: { text: "McKinsey State of AI 2025", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-early-2025" }
  },
  { id: "G2", title: "Compliance is manual, after-the-fact",
    stat: "4–8 hrs", statLabel: "per project on manual IFC validation, industry baseline",
    body: "Wisconsin DOT has the most explicit U.S. IFC mandate; Florida broadened through 2026; UK Building Safety Act Gateway 2 is in active enforcement on Higher-Risk Buildings. Regulators are tightening; vendors haven't closed the validation loop.",
    source: { text: "Data Octopus 2025 IDS/IFC guide", url: "https://dataoctopus.net/blog-ids-ifc-validation-guide-2025" }
  },
  { id: "G3", title: "Rework is 5% of every project — recoverable",
    stat: "40–50%", statLabel: "rework reduction via BIM coordination (5% avg baseline)",
    body: "A typical $2M commercial project leaks ~$100k in rework; BIM coordination recovers ~$40–50k of that. Ridgeline captures the wedge because we're upstream of the coordinator's issue log.",
    source: { text: "OpenSpace — Cost of Rework", url: "https://www.openspace.ai/blog/cost-of-rework-in-construction/" }
  },
  { id: "G4", title: "Vectorworks niche is criminally underserved",
    stat: "0.61%", statLabel: "overall CAD share — near-monopoly in landscape / interior / entertainment",
    body: "Autodesk, Procore, Trimble all build for architect-of-record and general contractor. Vectorworks users have no enterprise rule engine, no IDS UI, no audit reporting native to their CAD. That's the beachhead.",
    source: { text: "6sense Vectorworks share", url: "https://6sense.com/tech/cad-software/vectorworks-market-share" }
  },
  { id: "G5", title: "Capital flows to 3D/AI — not to compliance ontology",
    stat: "$0", statLabel: "public funding for native-CAD + compliance-ontology in the VW/Archicad/BricsCAD niche",
    body: "March 2026: Odyssey $310M Series B → $1.45B for AI world-models. Axiom $264M for AI platforms. Zero comparable checks written into our exact slot. That's the structural white space.",
    source: { text: "Crunchbase News Mar 2026", url: "https://news.crunchbase.com/venture/biggest-funding-rounds-cybersecurity-defense-startup-ai-odyssey-leads/" }
  }
];

// -- Strategic-gap infobox (the 6-record differentiator table)
window.RIDGELINE.differentiators = [
  { title: "Native VW compliance-ontology runtime",
    body: "In-process C++ SDK plugin + CEF Web-Palette on localhost. IDS rules execute while the model is being authored — not after export.",
    incumbent: "Solibri: standalone. Revit: post-export. BIMcollab: BCF-only." },
  { title: "First-class authoring-side IDS rule UI",
    body: "Designers see 'this IDS says you must include X' before the file leaves their machine. The 4–8 hr manual validation loop collapses to seconds.",
    incumbent: "IDS validation exists in bSI + BonsaiBIM, but not embedded in commercial CAD." },
  { title: "IFCX-first receipt graph, author-to-owner",
    body: "Same typed graph flows from designer's CAD into the owner's compliance record. No manual re-typing, no room-property loss.",
    incumbent: "Revit loses ~50% room-property data on IFC export. IWMS platforms rebuild the graph from scratch." },
  { title: "Merged Quantity Take-Off",
    body: "QTO ties directly to the typed graph. Cost lines are class-typed, not spreadsheet-typed. Estimator saves 3–5×.",
    incumbent: "QTO is external in every incumbent — Bluebeam, PlanSwift, eTakeoff. No graph anchor." },
  { title: "Compliance-OS dimension (owner side)",
    body: "The typed record persists after handover — NFPA, ADA, IBC, IRC, ASHRAE 188, AASHTO. The building's compliance state becomes the buyable asset.",
    incumbent: "Nuvolo, Building Engines, Planon own asset twins but not compliance vocabulary." },
  { title: "Open-source substrate co-residency",
    body: "IfcLite, OpenAEC, IfcOpenShell, BonsaiBIM run inside our CEF host as dependencies. Free channel-partner reach; distressed floor stays at ~$80M.",
    incumbent: "Solibri, Revit are closed. No incumbent embeds OSS substrate as first-class citizens." }
];

// -- Regulatory badges reserved (data drives the icons in the site)
window.RIDGELINE.regulatoryBadges = [
  { code: "NFPA",    name: "National Fire Protection Association", scope: "Life-safety / egress / sprinklers / alarms" },
  { code: "ADA",     name: "Americans with Disabilities Act",       scope: "Federal accessibility" },
  { code: "IBC",     name: "International Building Code",           scope: "Non-residential construction" },
  { code: "IRC",     name: "International Residential Code",        scope: "One- and two-family dwellings" },
  { code: "ASHRAE188", name: "ASHRAE Standard 188",                scope: "Legionellosis / water-safety management" }
];

// -- Acronym glossary (right-rail auto-defines on first mention)
window.RIDGELINE.glossary = {
  "FTE":    "Full-Time Equivalent — 1.0 = 40 hr/wk × 48 wk/yr",
  "ARR":    "Annual Recurring Revenue — subscription revenue only",
  "TAM":    "Total Addressable Market — the entire theoretical demand",
  "SAM":    "Serviceable Addressable Market — reachable given product & channel",
  "SOM":    "Serviceable Obtainable Market — winnable in 3–5 years",
  "EV":     "Enterprise Value — ARR × exit multiple for SaaS comps",
  "GTM":    "Go-To-Market — the motion used to acquire customers",
  "BIM":    "Building Information Modeling",
  "IFC":    "Industry Foundation Classes — neutral open BIM file format",
  "AEC":    "Architecture, Engineering & Construction",
  "SDK":    "Software Development Kit",
  "IDS":    "Information Delivery Specification — bSI rule file",
  "BCF":    "BIM Collaboration Format — issue/note format across BIM tools",
  "bSI":    "buildingSMART International — maintains IFC/IDS/BCF/bSDD",
  "bSDD":   "buildingSMART Data Dictionary",
  "NFPA":   "National Fire Protection Association",
  "ADA":    "Americans with Disabilities Act",
  "IBC":    "International Building Code",
  "IRC":    "International Residential Code",
  "QTO":    "Quantity Take-Off",
  "BLS":    "U.S. Bureau of Labor Statistics",
  "OEWS":   "Occupational Employment and Wage Statistics",
  "DOT":    "Department of Transportation (state-level)",
  "HRB":    "Higher-Risk Building — UK BSA, ≥18m or ≥7 storeys",
  "BSA":    "Building Safety Act (UK 2022/2026 enforcement)",
  "BSR":    "Building Safety Regulator (UK)",
  "AASHTO": "American Association of State Highway and Transportation Officials",
  "CEF":    "Chromium Embedded Framework — hosts HTML palette inside native CAD",
  "SAFE":   "Simple Agreement for Future Equity",
  "SOC 2":  "Service Organization Control 2 audit",
  "openBIM":"Vendor-neutral BIM built on IFC/IDS/BCF/bSDD",
  "CDE":    "Common Data Environment",
  "FLS":    "Fire / Life-Safety",
  "IWMS":   "Integrated Workplace Management System",
  "CAD":    "Computer-Aided Design",
  "CVC":    "Corporate Venture Capital",
  "GP":     "General Partner (venture capital)",
  "LP":     "Limited Partner (venture capital)",
  "MVP":    "Minimum Viable Product",
  "SME":    "Subject Matter Expert",
  "PLM":    "Product Lifecycle Management",
  "PMM":    "Product Marketing Manager",
  "SRE":    "Site Reliability Engineer"
};

// -- Source registry (for the audit trail section)
window.RIDGELINE.sources = [
  { tag: "McKinsey State of AI 2025", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-early-2025", use: "80% no-productivity finding" },
  { tag: "McKinsey — AI in AEC",       url: "https://www.mckinsey.com/industries/engineering-construction-and-building-materials/our-insights/how-ai-is-reshaping-the-future-of-the-aec-industry", use: "50% A&E / 39% construction automation ceiling" },
  { tag: "DesignHeed 2026 — US BIM state map", url: "https://www.designheed.us/post/bim-requirements-by-us-state-which-states-mandate-bim-for-public-projects-in-2026-", use: "State IFC mandate landscape" },
  { tag: "buildingSMART US — OpenBIM map", url: "https://www.buildingsmart.us/openbim-in-the-us", use: "openBIM rollout USA" },
  { tag: "RWK Goodman — UK BSA 2026", url: "https://www.rwkgoodman.com/info-hub/biz-const-building-safety-act-2026-key-developments-and-what-to-expect/", use: "BSA Gateway 2 active enforcement" },
  { tag: "RICS — Building Safety Act FAQs", url: "https://www.rics.org/news-insights/building-safety-act-faqs", use: "HRB definition (≥18m / ≥7 storeys)" },
  { tag: "OpenSpace — Cost of Rework",     url: "https://www.openspace.ai/blog/cost-of-rework-in-construction/", use: "5% baseline, 40–50% BIM cut" },
  { tag: "BIMElevate — Coordination Reduces Rework", url: "https://www.linkedin.com/pulse/how-bim-coordination-reduces-rework-cost-overruns-bimelevate-wrk4c", use: "Coordination lever" },
  { tag: "Data Octopus — IDS/IFC 2025 guide", url: "https://dataoctopus.net/blog-ids-ifc-validation-guide-2025", use: "4–8 hr manual validation" },
  { tag: "6sense — Vectorworks share", url: "https://6sense.com/tech/cad-software/vectorworks-market-share", use: "0.61% CAD share" },
  { tag: "Vectorworks 2026 launch", url: "https://www.vectorworks.net/en-US/2026", use: "Host platform" },
  { tag: "Nemetschek — Vectorworks",  url: "https://www.nemetschek.com/en/brand/vectorworks", use: "Brand parent" },
  { tag: "Finro Mid-2025 PropTech multiples", url: "https://www.finrofca.com/news/proptech-valuation-mid-2025", use: "9.5× Construction-Tech median" },
  { tag: "Crunchbase News — Odyssey Mar 2026", url: "https://news.crunchbase.com/venture/biggest-funding-rounds-cybersecurity-defense-startup-ai-odyssey-leads/", use: "$310M / $1.45B AI world-models" },
  { tag: "AlleyWatch — Axiom Mar 2026", url: "https://www.alleywatch.com/2026/04/global-startup-funding-top-largest-march-2026-vc/", use: "$264M AEC AI platform" },
  { tag: "Construction Dive — Procore $3B", url: "https://www.constructiondive.com/news/procore-propelled-to-3b-valuation/544684/", use: "AEC SaaS scale comp" },
  { tag: "AEC Tech Guy — Betting on Building", url: "https://aectechnologyguy.substack.com/p/betting-on-building-the-venture-capital", use: "2026 AEC funding rebound" },
  { tag: "BLS 15-1252 Software Developer", url: "https://www.bls.gov/oes/current/oes151252.htm", use: "$133,080 median, build-cost basis" },
  { tag: "levels.fyi — Autodesk L11 Sr SE", url: "https://www.levels.fyi/companies/autodesk/salaries/software-engineer/levels/senior-software-engineer-1", use: "$172,771 build-cost triangulation" },
  { tag: "Nemetschek Solibri press",       url: "https://www.nemetschek.com/en/news-media/nemetschek-group-takes-quality-assurance-new-level-release-solibri-inside", use: "Solibri Inside launch" },
  { tag: "Solibri offerings + pricing",    url: "https://www.solibri.com/our-offerings", use: "€164–294/mo tier structure" },
  { tag: "BIMcollab plans",                url: "https://www.bimcollab.com/en/plans/bimcollab-cde/", use: "€12.50–25/user/mo" },
  { tag: "Trimble Connect plans",          url: "https://geospatial.trimble.com/en/products/software/trimble-connect/subscription-plans", use: "$10–24/user/mo" },
  { tag: "buildingSMART Software Certification", url: "https://www.buildingsmart.org/compliance/software-certification/ifc/", use: "IFC cert list" },
  { tag: "IfcLite — GitHub",               url: "https://github.com/LTplus-AG/ifc-lite", use: "OSS substrate" },
  { tag: "IfcOpenShell",                   url: "https://ifcopenshell.org/", use: "OSS substrate" },
  { tag: "BonsaiBIM",                      url: "https://bonsaibim.org/", use: "OSS substrate" },
  { tag: "NIBS — bSI USA for FHWA DDSG",   url: "http://nibs.org/wp-content/uploads/2026/04/bS-USA-for-FHWA-DDSG_Calvin-Kam_Tony-Rinella_2026-03-19.pdf", use: "FHWA + AASHTO alignment" },
  { tag: "TRB — openBIM bridges T-19",     url: "https://rip.trb.org/View/2265815", use: "AASHTO T-19 pooled fund" }
];
