# CTA Matrix — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Date:** 2026-07-10
**Roles:** Visitor (operator/agency) · Founder (owner/maintainer)
**PSTQ:** P = the one primary per context · S = secondary · T = tertiary (available, quiet) · Q = quaternary (buried/overflow)

## Visitor

| Object | CTA | PSTQ | Cross-object? | Notes |
|---|---|---|---|---|
| Lead | **Join early access** (submit form) | **P** | → Lead created | THE page conversion; hero + closing section |
| Discovery Call | **Schedule a discovery call** | **S** | → Call (vendor) | Higher-intent path; placement decided in P6 |
| Product Module | Expand module details | T | No | Accordion/anchor, no page nav |
| Page Section (faq) | Expand/collapse FAQ item | T | No | |
| Page Section | Skip to signup (anchor) | T | → CTA section | Sticky/nav affordance |
| Lead | Manage consent (privacy notice link) | Q | No | Required by privacy gate; footer |

## Founder

| Object | CTA | PSTQ | Cross-object? | Notes |
|---|---|---|---|---|
| Lead | Review leads | P | No | Vendor dashboard in MVP |
| Lead | Export leads | S | No | Vendor export |
| Discovery Call | Prepare/attend call | P | ← Lead | Scheduler tool |
| Page Section | Edit & publish section | P | No | WP block editor |
| Product Module | Update status/tagline | S | ← Page Section | Content edit |
| Brand Token | Update token value | S | → all sections | theme.json edit |

## Prioritization cut (visitor context)

One P per screen context: **Join early access** owns P everywhere; Schedule call is S and must never visually compete at equal weight (draft currently presents them as near-equals — flagged for P6/P7).
