# Edge / Ethics / Equity Review — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Tier:** High-stakes (full matrix) · **Date:** 2026-07-10

## 1. Edge states (rendered in wireframe.html — gate requirement)

| Surface | States rendered | Location |
|---|---|---|
| Lead form (hero + closing) | default · submitting · success · error (values preserved) | §1, §7 state rows |
| Scheduler | ok · embed-failure fallback (authored) | §7 state row |
| Pillar accordions | closed · open · empty-capabilities (hidden) · no-JS degradation | §3 state row |
| Suite grid | content-at-scale note (9 cards; group-by-pillar rule if it grows) | §4 annotation |
| Founder-note link | removed when no destination (never dead) | §6 annotation |
| Permission-denied | N/A — public page, no auth | footer annotation |

## 2. Ethics / dark-pattern floor — each item cites a design decision

| Check | Finding | Cited decision |
|---|---|---|
| No fake urgency/scarcity | ✅ | No countdowns, no "only X spots" anywhere |
| No confirmshaming | ✅ | Decline path is simply not signing up; no guilt copy |
| Honest capability claims | ✅ | Module **status badges always visible** (§4); "planned capabilities" labeling (§3); FAQ states stage plainly |
| Consent is explicit, not pre-checked | ✅ | Unchecked required consent checkbox on both forms (§1, §7) |
| Easy exit | ✅ | Unsubscribe in footer + every email (vendor requirement, privacy review §3) |
| No fabricated social proof | ✅ | Founder-note substitute (§6) instead of invented testimonials/logos |
| CTA hierarchy honest | ✅ | One P per context; call CTA never styled as primary (PSTQ cut, cta-matrix) |

## 3. Equity / full matrix (High-stakes)

| Dimension | Finding | Action |
|---|---|---|
| Localization | Copy is US-market English; legal terms vary by state | Keep jurisdiction-neutral claims; no state-specific legal promises on page |
| Performance / bandwidth | Static-first WP page; no heavy media in wireframe | Budget: no video, defer scheduler embed until interaction; images lazy-load |
| Age/context appropriateness | Cannabis-adjacent but B2B — page sells software, not product | No consumption imagery; no product claims; audience is licensed operators |
| Vulnerable users | Low risk (B2B) | Consent + unsubscribe cover the mailing-list surface |
| AI fairness | N/A — no AI features on this page | — |
| Small/independent operators | Equity positive: draft explicitly includes independents | Keep "independent dispensaries" first in audience list (§5) |

## 4. Accessibility audit (WCAG 2.1 AA targets)

| Check | Status | Note |
|---|---|---|
| Semantic structure | ✅ wireframe | One `h1`, sectioned `h2`s, native `details/summary`, real `form`/`label` |
| Keyboard | ✅ by construction | Native elements only; skip-to-signup is an anchor; sticky bar must not trap focus |
| Contrast | ⏳ build-time | Brand Token rule: color pairs pass AA (brand-token.mdx rule 4); verify #39823D on white for text sizes — likely needs the darker ramp for body text |
| Form errors | ✅ authored | Inline error text adjacent to control; values preserved; not color-only |
| Motion | ✅ | No animation required; if added, respect `prefers-reduced-motion` |
| Screen readers | ⏳ build-time | Form success replaces form — announce via `aria-live=polite`; status badges need text (they do) not color-only |

## Gate verdict

**PASS** with two build-time obligations: (1) AA contrast verification of the token ramp; (2) `aria-live` on form state changes. Both carried into requirements §6.
