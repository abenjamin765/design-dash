# Object Discovery — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Date:** 2026-07-10
**Sources foraged:** landing-page-draft.md, index.html, scope.md mental models, metrics register

## SIP validation results

| Candidate | Structure | Instances | Purpose | Verdict |
|---|---|---|---|---|
| **Lead** | ✅ email, role, source, consent, status, created_at | ✅ each signup | ✅ demand signal + call pipeline (M-001/M-003) | **PASS — conversion hub** |
| **Discovery Call** | ✅ datetime, attendee, lead ref, status, notes | ✅ each booked call | ✅ qualified conversations (M-002) | **PASS** (vendor-owned data) |
| **Product Module** | ✅ name, tagline, status, capabilities, pillar ref | ✅ Storefront, Studio, Rules, Connect, Flow, Dispatch, Staff, Audit, Insights (9) | ✅ communicates the modular suite | **PASS** |
| **Value Pillar** | ✅ title, promise, capability list, module refs | ✅ Sell better · Operate cleaner · Stay compliant · Connect the stack (4) | ✅ organizes the value proposition | **PASS** |
| **Page Section** | ✅ type, heading, content refs, order, edge states | ✅ hero, problem, pillars, suite, how-it-works, audience, why-now, CTA, FAQ | ✅ composes the page; maps to WP blocks | **PASS — structural container** |
| **Brand Token** | ✅ name, value, category (color/type/space) | ✅ #39823D ramps, type scale, spacing units | ✅ consistent identity; maps to WP theme.json | **PASS** |
| FAQ Item | ✅ question, answer, order | ✅ 6 in draft | ⚠️ objection handling — but never referenced outside its section | **DEMOTED** → nested content of Page Section (type=faq) |
| Landing Page | ✅ | ❌ exactly one instance | ✅ | **FAIL Instances** → it is the context/system, not an object |

## Hub designation

- **Lead** — conversion hub: every section's CTA path terminates at Lead; Discovery Call hangs off it.
- **Page Section** — structural hub: everything a visitor sees is nested content of a section.

## Decisions

1. FAQ Item is content, not a system object (revisit if FAQs get reused across pages/products).
2. "Landing Page" is the system boundary; if the site grows to multiple pages, promote Page to an object in a follow-up dash.
3. Brand Token is modeled as an object because it ships as a real artifact (WP theme.json / CSS custom properties) — the v0 brand identity deliverable.
