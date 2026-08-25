# Ridgeline OpenBIM — Investor Site

## Project Overview
- **Name**: Ridgeline OpenBIM Investor Site
- **Goal**: An interactive, single-page investor site for Ridgeline OpenBIM's seed round ($4.25M on $24M post-money SAFE, 17.7% dilution), replacing static PDF/PPTX pitch deliverables with a navigable, drill-downable web experience for construction-tech VC GPs and CVC leads.
- **Source**: Ported pixel-accurately from a Genspark Design handoff (`designer2-bcaab02d-b67c-426b-8e95-574ea3c33ba4`, feature `ridgeline_investor_site`).
- **Features**:
  - Sticky nav header with scroll-spy (IntersectionObserver) — exactly one active link at a time
  - Hero with 4-column KPI grid (Y5 EV Bear/Base/Bull, 18-mo burn)
  - **Wedge** (01): 3 click-to-expand scenario rows (Bear/Base/Bull) with math reveal + copy-to-clipboard
  - **Gap** (02): 5 sourced-gap cards rendered from data
  - **Solution** (03): dark section, isometric SVG motif, 2 surface cards, regulatory badge row, OSS-dependency drill-down table
  - **Differentiator** (04): 6 cards rendered from data
  - **Competitors** (05): sortable/filterable 15-vendor × 13-capability matrix, Ridgeline row always pinned to top
  - **Build & burn** (06): 9-module + cross-cutting + total FTE grid, build-vs-displaced-FTE drill-down
  - **ARR ramp** (07): hand-authored SVG bar chart, Y1→Y5
  - **Investors** (08): 21-row VC-fit table, filterable by type, sortable, star-rating fit column
  - **The ask** (09): dark section, 4 KPI cards, use-of-funds SVG donut + legend
  - **Risks** (10): 6 risk cards with mitigations, bear-case walk-through drill-down
  - **Sources** (11): 29-row audit-trail table with "Expand all" toggle for all `<details>` on the page
  - Global acronym glossary — first mention of every acronym auto-wrapped, hover tooltip with definition
  - Full print stylesheet (dark sections auto-lighten, drill-downs collapse)

## URLs
- **Local dev**: http://localhost:3000 (sandbox preview via GetServiceUrl)
- **Production**: _not yet deployed — see Deployment section_
- **GitHub**: _not yet connected_

## Data Architecture
- **Data model**: Single canonical client-side data module (`/static/numbers.js`, attached to `window.RIDGELINE`) — every number, competitor row, investor row, gap, differentiator, glossary entry, and source citation in the UI reads from this object. No numeric literals are re-inlined into markup.
- **Storage**: None — this is a fully static, bundled-data site (per design spec: "no runtime data needs"). No D1/KV/R2 required.
- **Behavior module**: `/static/site.js` — vanilla JS: scroll-spy, glossary tooltip auto-wrap, table sort/filter (competitor + investor tables), wedge expand/collapse, expand-all toggle, copy-math-to-clipboard.
- **Design tokens**: `/static/tokens.css` — CSS custom properties (colors, type, spacing, radii, shadows, motion) — single source of truth for the visual system, ported verbatim from the design handoff.
- **Backend**: Hono route (`src/index.tsx`) serves the single HTML document + static assets via `serveStatic` (Cloudflare Workers-compatible). No API routes — content is fully static.

## User Guide
1. Land on the hero — see the headline claim and the four framing KPIs (Bear/Base/Bull EV, 18-mo burn).
2. Use the sticky top nav to jump to any of the 11 sections; the active section highlights automatically as you scroll.
3. In **Wedge**, click any scenario row to reveal the exact math; click the monospace math pill to copy it to your clipboard.
4. In **Competitors**, type in the search box to filter vendors (Ridgeline always stays visible), or click any column header to sort — Ridgeline stays pinned at the top regardless of sort.
5. In **Investors**, use the filter chips to narrow to thematic funds / CVCs / unverified rows, or sort by any column (default: fit score descending).
6. Hover any acronym (first occurrence only) anywhere in the prose to see its definition.
7. In **Sources**, click "Expand all" to open every drill-down `<details>` panel on the page at once (toggles to "Collapse all").
8. Print (⌘/Ctrl+P) for a clean multi-page PDF — dark sections auto-lighten and drill-downs collapse for print.

## Deployment
- **Platform**: Cloudflare Pages (target)
- **Status**: ❌ Not yet deployed — running in sandbox dev preview only
- **Tech Stack**: Hono + TypeScript (backend routing/static-serving) · vanilla HTML/CSS/JS (frontend, ported verbatim from design) · Vite build · Wrangler
- **Last Updated**: 2026-08-25
