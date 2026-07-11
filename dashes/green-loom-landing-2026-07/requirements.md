# Requirements — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Tier:** High-stakes · **Date:** 2026-07-10

## §1 Context

Green Loom (modular software for regulated retail, starting with cannabis) has no shipped public presence. A 9-section draft exists. This dash ships a WordPress-delivered landing page with brand identity v0 that converts visitors to early-access signups and discovery calls. Full intake: `scope.md`.

## §2 Goals / non-goals

**Goals:** 25 early-access signups in 90 days (M-001); 5 discovery calls (M-002); ≥50% signups from target roles (M-003 guardrail); page maintainable by one person via WP block editor; brand token set shipped as theme.json.

**Non-goals:** multi-page marketing site; full design system (follow-up dash); pricing; blog; product UI; custom backend; testimonials (none exist — honesty rule).

## §3 Users + concept selection

**Users:** Prospective operator (primary), agency decision-maker (secondary), founder-maintainer (tertiary). See `scope.md` §2.2.

**Selection Gate record (P6):**

| Concept | Comprehension | Agency depth | Friction | M-001 | M-003 | Effort | Verdict |
|---|---|---|---|---|---|---|---|
| **B-trimmed: Guided Depth** | 4 | 5 | 4 | 4 | 5 | 3 | **SELECTED** |
| A: One Promise | 5 | 2 | 5 | 4 | 3 | 5 | Runner-up — revisit if B underconverts |
| C: Prove It | 3 | 4 | 3 | 3 | 5 | 2 | Elements salvaged: proof block concept |

**Rationale:** B-trimmed is the only concept scoring ≥4 on both user criteria (comprehension, depth) and the business pair (M-001 signups, M-003 quality). Structurally distinct spines: conversion-first (A) vs narrative (B) vs artifact-proof (C). CTA plumbing decision resolved with B: **form vendor + scheduler** (both named in privacy review).

## §4 Scenarios

See `flow.md` — S1 curious operator (→ Lead), S2 skeptical agency (→ Discovery Call), S3 direct intent (→ Lead), S4 founder maintenance.

## §5 Page structure (B-trimmed, 8 sections)

| # | Section | Merged from draft | Conversion |
|---|---|---|---|
| 1 | Hero (plain-terms subhead + inline form + call link) | Hero + What-it-is | P |
| 2 | Problem | Problem + Why-now | — |
| 3 | Pillars (4 cards, capability accordions, module chips) | Pillars + How-it-works | — |
| 4 | Suite (9 module cards, status badges, compact grid) | Suite | — |
| 5 | Who it's for | Audience | self-qualification |
| 6 | Founder note (proof substitute) | new | trust |
| 7 | Closing CTA (form + scheduler) | CTA | P + S |
| 8 | FAQ + Footer (privacy/consent) | FAQ | objection handling |

## §6 Functional requirements

1. Signup form: email (required) + role (optional enum) + explicit consent checkbox; states: default, submitting, success, error — all authored (no vendor defaults).
2. Lead records `source_section` (hero vs closing) for attribution.
3. Scheduler: link-out or embed with authored fallback if embed fails.
4. Module status badges rendered from a single content source (WP pattern), never omitted.
5. Brand tokens in theme.json; sections reference semantic roles; AA contrast enforced.
6. Sticky "skip to signup" anchor after 50% scroll (S3).
7. Analytics events: `signup_submitted`, `call_booked` click-through, per-section visibility (M-004 denominator).

## §7 Open items

- Form vendor + scheduler named at build time (privacy review lists candidate requirements)
- A-001 non-author tier review before launch
- P8: usability test commitment (Learning Gate)
