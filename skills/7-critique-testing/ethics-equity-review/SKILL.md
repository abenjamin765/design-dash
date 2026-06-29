---
name: ethics-equity-review
description: >
  Run the P6 Edge/Ethics/Equity gate: review the design for dark patterns, vulnerable user
  population protections, data privacy compliance, localization and language accessibility,
  age/context appropriateness, equity across user subgroups, and AI/algorithmic fairness. Required
  for all Standard and High-stakes dashes; the ethics/equity floor runs even on Express. Produces
  a filled ethics-review.md.
stage: 7-critique-testing
version: "0.1.0"
---

# Ethics & Equity Review

Run the P6 Edge/Ethics/Equity gate — a structured review that ensures the design does not harm
users through dark patterns, exploits vulnerable populations, excludes low-bandwidth or
low-literacy users, or creates inequitable outcomes across user subgroups.

---

## Checkpoint 1 — Scope (WAIT FOR USER)

Ask the user:
- "What artifact are we reviewing? (paste wireframe description, prototype URL, or file reference)"
- "Who is the primary audience? (describe your users: role, context, any regulated or vulnerable populations)"
- "What is the Dash tier? (Express / Standard / High-stakes)"
- "Does this feature touch personal data, health information, financial information, or data from minors?"
- "Does this feature use AI, algorithmic scoring, or automated recommendations?"

Do not proceed until answered.

---

## Section A — Dark pattern audit

For each item below, cite a **specific design decision** — not a tick. A passing item names the
element and explains why it is clear.

| # | Check | Design decision cited | Pass / Flag / N/A | Notes |
|---|---|---|---|---|
| A1 | No manufactured urgency ("Offer ends in 12 hours!") | … | … | … |
| A2 | No guilt-trip opt-outs ("No thanks, I don't want to improve") | … | … | … |
| A3 | No misleading defaults (pre-checked sharing, auto-renew) | … | … | … |
| A4 | No confirmshaming (mocking or shaming the "no" option) | … | … | … |
| A5 | No hidden costs or information asymmetry | … | … | … |
| A6 | No roach motel (easy to start, hard to stop / cancel / delete) | … | … | … |
| A7 | No disguised ads or sponsored content without clear labeling | … | … | … |

---

## Section B — Vulnerable user population protections

Applies when any users may be: minors, older adults, users with cognitive disabilities, users in
high-stress situations (healthcare, financial distress, legal proceedings), or other populations
with heightened susceptibility to manipulation or harm.

Flag any of the following:

| # | Check | Design decision cited | Pass / Flag / N/A | Notes |
|---|---|---|---|---|
| B1 | Engagement mechanics (streaks, notifications, urgency timers) do not exploit vulnerable users' psychological state | … | … | … |
| B2 | Session-length / time-in-product is not shown to vulnerable users as a progress or success indicator | … | … | … |
| B3 | Notifications do not create compulsive re-engagement loops for populations at risk of overuse | … | … | … |
| B4 | Reward/badge systems reward genuine outcomes, not time spent | … | … | … |
| B5 | The product does not take advantage of cognitive load, grief, fear, or financial stress to drive actions that benefit the business at the user's expense | … | … | … |
| B6 | For minors: interactions are appropriate for their developmental stage; no persuasive design techniques that exploit age-related inexperience | … | … | … |

---

## Section C — Data privacy compliance

Auto-triggers tier escalation if any item is flagged (regulated personal data → minimum High-stakes).
See the `privacy-gate` skill for a full compliance checklist.

| # | Check | Design decision cited | Pass / Flag / N/A | Notes |
|---|---|---|---|---|
| C1 | Identify what personal data is collected — is it necessary for the stated purpose? (data minimization) | … | … | … |
| C2 | What regulation applies to your users / geography? (GDPR / HIPAA / CCPA / COPPA / equivalent) — is the applicable law identified? | … | … | … |
| C3 | Consent flow exists and is appropriate for the regulation (opt-in / opt-out / parental consent for minors) | … | … | … |
| C4 | User rights are supported: access, correction, deletion, portability (where applicable per regulation) | … | … | … |
| C5 | Retention and deletion policy is defined | … | … | … |
| C6 | Role-based access enforced: personal data not visible to unauthorized users or roles | … | … | … |
| C7 | No third-party sharing without appropriate legal agreement (DPA / data sharing agreement) | … | … | … |

If any C-item is flagged and the dash is not already at High-stakes: **escalate tier; require real
privacy/legal sign-off** (no simulation floor for compliance — see `privacy-gate` skill).

---

## Section D — Localization & language accessibility

| # | Check | Design decision cited | Pass / Flag / N/A | Notes |
|---|---|---|---|---|
| D1 | UI labels avoid hardcoded idioms and are translation-ready | … | … | … |
| D2 | Non-native speakers / lower-literacy users: minimal jargon; iconography supports meaning | … | … | … |
| D3 | Reading level appropriate for the declared user population (prefer ≤ grade 8 for general public UI copy) | … | … | … |
| D4 | Low-bandwidth scenario: feature is usable on a slow connection or degrades gracefully | … | … | … |
| D5 | RTL language support not broken (if the product targets RTL-language users) | … | … | … |

---

## Section E — Age & context appropriateness

| # | Check | Design decision cited | Pass / Flag / N/A | Notes |
|---|---|---|---|---|
| E1 | Content and interactions are appropriate for the stated user population's context (professional, consumer, regulated, etc.) | … | … | … |
| E2 | Feature does not create or amplify inequity between advantaged and disadvantaged user groups | … | … | … |
| E3 | Users with disabilities are not disadvantaged by the interaction (cross-check with `a11y-audit` skill) | … | … | … |
| E4 | Roles or views that surface individual performance data do not expose users in ways that stigmatize or harm | … | … | … |
| E5 | Equity hypothesis: if the feature changes outcomes, which subgroups benefit and which may not? | … | … | … |

---

## Section F — AI & algorithmic fairness (if applicable)

Skip this section if the feature does not use AI, algorithmic scoring, or automated recommendations.

| # | Check | Design decision cited | Pass / Flag / N/A | Notes |
|---|---|---|---|---|
| F1 | The algorithmic system's purpose and limitations are disclosed to affected users | … | … | … |
| F2 | Users can understand why a recommendation or decision was made (explainability appropriate to context) | … | … | … |
| F3 | The model or algorithm has been evaluated for bias across demographic subgroups (age, gender, race, disability, geography) | … | … | … |
| F4 | Users have a meaningful path to challenge, override, or opt out of automated decisions that affect them | … | … | … |
| F5 | Training data sources are documented; potential biases from training data are acknowledged | … | … | … |
| F6 | AI-generated content is labeled as such where it could be mistaken for authoritative human output | … | … | … |

---

## Summary

| Section | Flagged items | Tier impact | Requires real sign-off? |
|---|---|---|---|
| A — Dark patterns | N | None unless egregious | — |
| B — Vulnerable user protections | N | None | — |
| C — Data privacy | N | ⚠️ Any flag → min High-stakes | Yes — privacy/legal |
| D — Localization | N | None | — |
| E — Age/context/equity | N | None | — |
| F — AI/algorithmic fairness | N | None | — |

**Gate result:**
- All sections clear → P6 **passed**.
- Any Section C flag without High-stakes tier + real legal sign-off → gate **blocked**.
- Any Section A–B–E–F flag not addressed → gate **conditionally passed** (flagged items logged as
  open assumptions in `dashes/{slug}/assumptions.md`).

---

## Output

Produce a filled `dashes/{slug}/ethics-review.md` using this checklist. For each flagged item,
include the specific design decision, the risk, and a recommended fix. Log unresolved flags as
assumptions in `dashes/{slug}/assumptions.md`.
