# Ethics & Equity Checklist

**Dash:** <!-- dash-name -->  
**Dash ID:** <!-- scope.md dash_id -->  
**Tier:** Express / Standard / High-stakes  
**Reviewed at gate:** P6 Edge/Ethics/Equity  
**Reviewer:** <!-- name -->  
**Date:** YYYY-MM-DD

> **Governance (req §12.6):** Each item must **cite a specific design decision** — not a tick. A bare checkbox without a cited decision is a substance-over-checkbox failure. Run via the `_cross-cutting/ethics-equity-review` skill.

> **Ethics floor:** The ethics/equity floor (Sections A–B) runs even on Express tier. Section C (data privacy) auto-escalates tier to High-stakes when any item is flagged.

---

## Section A — Dark pattern audit

| # | Check | Design decision cited | Pass ✅ / Flag ⚠️ / N/A | Recommended fix (if flagged) |
|---|---|---|---|---|
| A1 | No manufactured urgency (countdown timers, artificial scarcity messaging) | <!-- cite specific UI element --> | | |
| A2 | No guilt-trip opt-outs ("No thanks, I don't want to improve") | <!-- cite specific opt-out copy --> | | |
| A3 | No misleading defaults (pre-checked sharing, auto-renew, hidden fees) | <!-- cite specific setting or flow --> | | |
| A4 | No confirmshaming (mocking the "no" button) | <!-- cite specific button label --> | | |
| A5 | No hidden costs or information asymmetry | <!-- cite feature or paywall placement --> | | |
| A6 | No roach motel (easy to start, hard to stop/leave) | <!-- cite cancellation or opt-out flow --> | | |

---

## Section B — User vulnerability & engagement guardrails

| # | Check | Design decision cited | Pass ✅ / Flag ⚠️ / N/A | Recommended fix (if flagged) |
|---|---|---|---|---|
| B1 | Streaks or consecutive-use mechanics are not the primary motivational driver | <!-- cite reward/progress system --> | | |
| B2 | Time-in-app is not presented as a progress or success indicator | <!-- cite dashboard or progress display --> | | |
| B3 | Notifications do not create compulsive re-engagement loops | <!-- cite notification strategy --> | | |
| B4 | Any engagement metric in the business case passes the direction rule (north-star does not move in "more" direction for vulnerable user groups) | <!-- cite metric in metrics.md --> | | |
| B5 | Reward / badge system rewards outcomes, not time spent | <!-- cite badge or achievement criteria --> | | |
| B6 | Age-appropriateness / vulnerability guardrails applied for the stated user population | <!-- cite user profile and design rationale --> | | |

---

## Section C — Data privacy (regulated personal data / PII)

> **Trigger rule:** Any flag in Section C → escalate dash tier to minimum **High-stakes** and require real privacy/legal sign-off. No simulation allowed for compliance.

| # | Check | Design decision cited | Pass ✅ / Flag ⚠️ / N/A | Recommended fix (if flagged) |
|---|---|---|---|---|
| C1 | Personal data collected only as necessary (data minimization) | <!-- cite data fields collected --> | | |
| C2 | Consent path exists for regulated data collection (GDPR, HIPAA, CCPA, or equivalent) | <!-- cite consent flow or N/A if no regulated data --> | | |
| C3 | Sensitive records protected — no sharing without appropriate consent or legal basis | <!-- cite data sharing configuration --> | | |
| C4 | Applicable privacy regulations identified and compliance considered | <!-- cite regulatory analysis or N/A --> | | |
| C5 | Role-based access enforced: sensitive data not visible to unauthorized roles | <!-- cite permission model --> | | |
| C6 | Data retention / deletion policy defined | <!-- cite retention policy or ticket --> | | |
| C7 | No third-party sharing without a Data Processing Agreement (DPA) or equivalent | <!-- cite third-party integrations or N/A --> | | |

---

## Section D — Localization & accessibility

| # | Check | Design decision cited | Pass ✅ / Flag ⚠️ / N/A | Recommended fix (if flagged) |
|---|---|---|---|---|
| D1 | UI labels exist in `glossary.md` and are translation-ready | <!-- cite glossary.md reference --> | | |
| D2 | Minimal jargon; iconography supports meaning for diverse users | <!-- cite copy or icon decisions --> | | |
| D3 | Reading level appropriate for the target user population | <!-- cite readability analysis or equivalent --> | | |
| D4 | Low-bandwidth / constrained-device scenario: usable or degrades gracefully | <!-- cite progressive enhancement strategy --> | | |
| D5 | RTL language support not broken (if applicable) | <!-- cite RTL test or N/A --> | | |

---

## Section E — Equity across user subgroups

| # | Check | Design decision cited | Pass ✅ / Flag ⚠️ / N/A | Recommended fix (if flagged) |
|---|---|---|---|---|
| E1 | Feature does not create or amplify inequity between user subgroups | <!-- cite equity analysis or N/A --> | | |
| E2 | Users with accessibility needs (screen readers, motor, cognitive) are not disadvantaged | <!-- cite a11y-audit cross-reference --> | | |
| E3 | Sensitive data views do not expose user information in stigmatizing ways | <!-- cite data display design --> | | |
| E4 | Equity hypothesis: consider which subgroups benefit and which may not | <!-- cite equity hypothesis in assumptions.md --> | | |
| E5 | Content and interactions appropriate for the stated user population | <!-- cite user profile and design rationale --> | | |

---

## Gate summary

| Section | Flagged items | Tier impact | Real sign-off required? |
|---|---|---|---|
| A — Dark patterns | <!-- N --> | None | No |
| B — Vulnerability guardrails | <!-- N --> | None | No |
| C — Data privacy | <!-- N --> | ⚠️ Any flag → min High-stakes | Yes — privacy/legal |
| D — Localization | <!-- N --> | None | No |
| E — Equity | <!-- N --> | None | No |

**Gate result:** <!-- P6 passed / P6 conditionally passed (see flagged items) / P6 blocked (Section C) -->

Unresolved flags → log as assumptions in `assumptions.md` with `status: debt`.
