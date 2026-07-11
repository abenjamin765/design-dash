# Nested-Object Matrix — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Date:** 2026-07-10
Read: row object **appears nested on** column object's detail/context.

| nests on → | Page Section | Value Pillar | Product Module | Lead | Discovery Call | Brand Token |
|---|---|---|---|---|---|---|
| **Page Section** | — | | | | | |
| **Value Pillar** | ✅ (pillars section) | — | ✅ (module → parent pillar label) | | | |
| **Product Module** | ✅ (suite section) | ✅ (pillar lists its modules) | — | | | |
| **Lead** | ✅ (CTA section form) | | | — | ✅ (call shows originating lead) | |
| **Discovery Call** | | | | ✅ (lead detail shows booked call) | — | |
| **Brand Token** | ⬜ applied-to (styling ref, not nesting) | ⬜ | ⬜ | | | — |

## Relationship notes (MCSFD-lite)

- **Page Section → Value Pillar**: one pillars-section → 4 pillars, ordered. Order is a merchandising decision (P6).
- **Value Pillar ↔ Product Module**: one pillar → 1–4 modules; one module → exactly one pillar (draft mapping: Sell better → Storefront, Studio · Operate cleaner → Flow, Staff, Dispatch · Stay compliant → Rules, Audit · Connect the stack → Connect, Insights).
- **Page Section → Lead**: CTA sections (hero + closing) embed the signup form; Lead records `source_section` for attribution.
- **Lead → Discovery Call**: 0..1 in MVP; scheduler vendor holds the record, Lead links out.
- **Brand Token → all sections**: reference relationship (`applied-to`), not containment; delivered as theme.json/CSS variables.

## Navigability decisions

- Visitor never navigates *to* a Lead or Discovery Call — those are founder-side objects (vendor dashboards in MVP).
- Product Module detail = expandable card / anchor target, not a separate page (single-page scope).
