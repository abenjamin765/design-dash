# Flow & Scenario Map — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Date:** 2026-07-10

## Scenarios

### S1 — Curious operator (primary, happy path)
Dispensary operator hears about Green Loom (network/LinkedIn) →
lands on **hero** ("what is this?" answered in one line + plain-terms subhead) →
scrolls **problem** (recognizes the scattered-stack pain) →
scans **pillars** (4 promises; capability details on demand) →
optionally expands a **Product Module** (sees honest status badge) →
reaches **closing CTA** → **Join early access** → form success state (Lead created, consent recorded).
**Goal:** Lead. **Steps to conversion:** 1 scroll narrative + 1 form.

### S2 — Skeptical agency (secondary)
WP agency evaluates GL as a toolkit →
hero → jumps to **FAQ** ("Is this a POS?" "Will it work with WordPress?") →
**suite** section (module statuses signal stage) →
**Schedule a discovery call** (S-tier CTA) → scheduler embed/link → Call booked (linked to Lead when known).
**Goal:** Discovery Call.

### S3 — Returning/referred visitor (direct intent)
Arrives with intent (told "join the list") →
sticky **Skip to signup** anchor → form → done.
**Goal:** Lead, minimal friction.

### S4 — Founder maintains the page (operational)
Aaron edits a Page Section in the WP block editor → updates a Product Module status → publishes.
**Goal:** No-code content maintenance; Brand Tokens keep styling consistent.

## Page list (named-page mode)

One page. Sections in draft order (P6 may re-merchandise):

| # | Section (type) | Objects surfaced | Conversion role |
|---|---|---|---|
| 1 | Hero (`hero`) | Value prop, Lead form or CTA button | **P: Join early access** |
| 2 | Problem (`narrative`) | — | Builds recognition |
| 3 | What it is (`narrative`) | — | Category answer |
| 4 | Pillars (`pillars`) | 4 Value Pillars → module refs | Comprehension |
| 5 | Suite (`suite`) | 9 Product Modules + status badges | Honesty + depth |
| 6 | How it works (`narrative`) | Pillar→module Q&A pairs | Comprehension |
| 7 | Who it's for (`narrative`) | Audience list | Self-qualification |
| 8 | Why now (`narrative`) | — | Belief |
| 9 | Closing CTA (`cta`) | Lead form + Discovery Call link | **P + S conversions** |
| 10 | FAQ (`faq`) | FAQ items | Objection handling |
| 11 | Footer (`footer`) | Privacy/consent links | Q: consent management |

## Goal-page map

| Goal | Entry | Path | Endpoint state |
|---|---|---|---|
| Lead (M-001) | Any | → nearest CTA section → form | Success: confirmation state inline; Error: authored error state |
| Discovery Call (M-002) | FAQ/suite | → closing CTA → scheduler | Vendor page/embed; return link |
| Comprehension | Hero | 1 scroll | Visitor can say what GL is (P8 test) |

## Reconciliation Gate — divergences resolved

| # | Divergence (P2.9) | Resolution |
|---|---|---|
| 1 | Visitor expects a category label; GL uses "operating fabric" metaphor | **Adapt UI language:** hero subhead uses plain terms ("modular software for regulated retail — starting with cannabis"); "operating fabric" is flavor in §3, never the only descriptor. FAQ keeps the direct "Is this a POS?" answer. |
| 2 | 9 named products read as shipped software | **Adapt UI + library rule:** Product Module `status` badge always visible (rule written into the canonical guide); copy verbs stay in building/planned tense. |
| 3 | Visitor expects social proof; none exists | **Deferred to P6 concepts** (candidate substitutes: domain-depth proof — the object library/compliance rigor itself; founder story; build-in-public). Tracked as part of concept scoring. |

No `assumed` user-model element drives an irreversible decision; messaging assumptions carry P8 validation commitments (A-002, A-003).
