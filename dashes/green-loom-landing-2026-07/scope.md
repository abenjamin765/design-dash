# Scope — Green Loom Landing Page

**Dash ID:** green-loom-landing-2026-07 · **Tier:** High-stakes · **Mode:** Solo · **Build mode:** Enhance
**Date:** 2026-07-10 · **Owner:** Aaron

---

## 2.1 Problem statement + scope

Green Loom has no shipped public presence. A draft page (`landing-page/index.html` + `landing-page-draft.md`) exists but isn't live, so prospective customers — dispensary operators, multi-location retailers, and agencies — can't discover or evaluate Green Loom, and there is no mechanism to capture early-access interest. This dash redesigns and ships the landing page as a WordPress-delivered site that converts visitors into early-access signups and discovery calls.

**Scope:** one public landing page (single named page), its signup/scheduling conversion flows, and the brand identity v0 (tokens + core components) needed to build it.

## 2.2 User roles

| Role | Priority | Notes |
|---|---|---|
| Prospective operator (dispensary owner/operator, delivery operator) | **Primary** | Evaluating whether GL understands their compliance/ops pain |
| Agency decision-maker (builds regulated retail sites, WP-centric) | Secondary | Evaluating GL as a toolkit/partner |
| Founder (Aaron) | Tertiary (owner) | Publishes, maintains, reviews leads |

## 2.3 Build mode

**Enhance.** Existing state: 9-section draft copy (hero, problem, what-it-is, 4 pillars, 9-product suite, how-it-works, who-it's-for, why-now, early direction, CTA, FAQ) plus a static HTML draft with the #39823D palette ramps and logo. Target delivery shifts from static HTML to **WordPress** — dogfooding the GL Storefront/Studio direction.

## 2.4 Mode

Solo.

## 2.5 Constraints

- Delivery on WordPress (theme/block-based); page should be a proof point for GL's WP-first product direction
- Brand: green-loom-logo.svg + #39823D-derived palettes; brand identity beyond that is **v0 — to be defined in this dash** (Envy design system is a single product-card sketch today)
- Solo founder: page must be maintainable by one person; no bespoke backend
- No paid traffic planned; organic/network reach (<500 visitors / 6 months, A-004)
- Compliance-sensitive copy: cannabis marketing restrictions vary by jurisdiction; avoid claims that read as legal advice or medical claims
- Email capture = PII surface → privacy gate at P7; vendor choice deferred to P6

## 2.6 Success criteria

- M-001: 25 early-access signups within 90 days of launch (north-star)
- M-002: 5 discovery calls booked within 90 days
- M-003 guardrail: ≥50% of signups match target roles (operator/agency)
- Checkable during dash: a visitor can articulate what Green Loom is and who it's for after the hero + one scroll (validated in P8 learning plan)

## 2.7 Page-scoping mode

**Named** — a single page: "Green Loom landing page." (Conversion endpoints — form success, scheduler — are states/embeds, not separate pages, pending P6.)

## 2.8 Object library check

Queried via `dash.config.json` → `docs/object-library/` (38 canonical guides). No landing-page/marketing objects exist in the library. Library relevance is **messaging truth**: pillar claims should trace to modeled objects, e.g. "audit-ready records" → Custody Event / Evidence Asset; "jurisdiction-aware rules" → Jurisdiction / Rule / Compliance Plan; "menu sync" → Menu Item / Product. In-scope objects for this dash are new (see 3.2) and will be modeled in P4.

## 2.9 Mental models

| Object | (a) Visitor expects (tag) | (b) Library / internal shows |
|---|---|---|
| Green Loom (the offer) | "Is this a POS? Another all-in-one?" — expects a category label (`assumed`; FAQ pre-empts this confusion) | Modular suite of 9 products around existing tools; not a POS |
| Landing page | Standard SaaS marketing patterns: hero → proof → features → pricing → CTA (`assumed`) | Draft follows hero → problem → pillars → suite → FAQ; no pricing (pre-launch), no social proof yet |
| Early access signup | "Give email, get updates / early invite" — low commitment (`assumed`) | Lead = demand signal + discovery-call pipeline; role/source field desired (M-003) |
| Product suite | Named products imply shipped software (`assumed` — risk of overpromising) | All products are *planned*; draft says "being built" — must stay honest |
| Brand | Professional, trustworthy, not stoner-cliché (`assumed`) | #39823D ramps, loom/weave motif ("operating fabric"), Envy sketch only |

## 2.10 Existing-state review (enhance)

Draft strengths: clear pillar structure, honest FAQ, strong "operating fabric" metaphor, concrete capability lists. Pain points: very long (9 sections + 9 sub-products may overwhelm a first-time visitor), no visual hierarchy/brand system yet, two CTAs compete, static HTML doesn't match WP direction, no signup mechanics, suite section reads as roadmap-as-promise (overpromise risk), no social proof (none exists yet — honest gap).

## 2.11 Supporting docs

- `landing-page/landing-page-draft.md` (copy source of record)
- `landing-page/index.html` (palette ramps; superseded structurally)
- `landing-page/img/green-loom-logo.svg`
- `envy-design-system/index.html` (product-card sketch — input to brand v0, to be reworked)
- `docs/object-library/` (messaging truth)
- None stated: analytics, prior research, Figma files

---

## § Mental models — divergences to reconcile (P5 input)

1. Visitor expects a category label; GL resists one ("operating fabric") — UI language must land the metaphor fast or fall back to a plainer descriptor.
2. Visitor may read the 9-product suite as shipped software — copy/design must signal stage honestly without killing credibility.
3. Visitor expects social proof; none exists — decide substitute (founder story, domain depth, build-in-public) at P6.

## Sign-off ledger (3.3)

| Discipline | Person | Responsibility | Channel |
|---|---|---|---|
| Design / PM / Content | Aaron | All Responsible roles (solo) | This dash |
| Non-author tier reviewer | TBD (A-001) | Confirm high-stakes tier + privacy review | Async, due 2026-08-10 |
