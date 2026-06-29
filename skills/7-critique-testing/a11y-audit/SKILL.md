---
name: a11y-audit
description: >
  Accessibility audit for prototypes, wireframes, and shipped UI. Runs a structured WCAG 2.2 AA
  checklist (landmarks, headings, focus, color, motion, touch targets, labels, semantics) against
  an artifact, produces a graded findings report, and flags any `ui-rule: TBD` items that shipped
  unresolved. Use when asked for an a11y review, accessibility audit, keyboard/focus review,
  color contrast review, or WCAG check — or at the Design Dash P7 (Wireframe & Critique) gate.
stage: 7-critique-testing
version: "0.1.0"
---

# Accessibility Audit

Run a structured WCAG 2.2 AA accessibility review against a prototype, wireframe, or shipped UI.
Produce a graded findings report with remediation guidance.

## When to Use

- "Run an a11y audit" · "accessibility review" · "keyboard check" · "WCAG review" · "focus audit"
- Design Dash P7 (Wireframe & Critique) — mandatory a11y check before P8 Plan Assembly
- Stage 7 critique gate: verify that `requirements` attached to matched `ui-rule` entries were honored
- Any time `ui-rule: TBD` items may have shipped unresolved (automatic audit flag)

---

## Step 1 — Confirm the artifact

Ask if not already provided:

1. What are we auditing? (prototype HTML path, Figma URL, live URL, or wireframe description)
2. Who is the target user population? (affects cognitive a11y bar — e.g., general public, older adults, non-native speakers, users with disabilities)
3. Are there any known a11y concerns to prioritize?
4. Is this a WCAG 2.2 AA gate (ship/no-ship) or a review pass (findings + recommendations)?

---

## Step 2 — Read the artifact

- For prototype HTML: use the Read tool to load the markup
- For live URLs: use the browser tools to fetch the rendered DOM
- For wireframes: read the wireframe description and ui-rule annotations

Also check: are any `ui-rule: TBD` annotations present? Flag all of them as automatic open issues
before the checklist begins (no TBD item may ship unresolved).

---

## Step 3 — Run the checklist

Run each category. For each item: **Pass / Fail / N/A** with a brief note. Flag all Fails.

### Landmarks & structure
- [ ] One `<main>` element per page
- [ ] `<header>`, `<nav>`, `<footer>` used as appropriate; `<nav>` has `aria-label` when multiple navs present
- [ ] One `<h1>` per page; heading levels are logical (no skipped levels)
- [ ] Regions are labeled if their role is ambiguous

### Focus management
- [ ] All interactive elements are keyboard-reachable (Tab / Shift+Tab)
- [ ] Focus order is logical — matches visual reading order
- [ ] Visible focus ring on all interactive elements (`:focus-visible` applied; contrast ≥ 3:1)
- [ ] No focus traps (except intentional modal traps that provide an Escape exit)
- [ ] Focus returns to the trigger element after a modal or overlay closes
- [ ] Skip link present for pages with repeated navigation

### Color & contrast
- [ ] Text contrast ≥ 4.5:1 (normal text) and ≥ 3:1 (large text / 18px+ or 14px bold+) — WCAG 1.4.3
- [ ] UI component contrast ≥ 3:1 against adjacent colors — WCAG 1.4.11
- [ ] Color is not the only means of conveying information (error states, status, links) — WCAG 1.4.1
- [ ] Non-color signal present for every color-coded affordance (icon, text label, pattern)

### Interactive elements
- [ ] All buttons and links have accessible names (not empty, not generic "click here" / "more")
- [ ] Touch targets ≥ 44×44 CSS px — WCAG 2.5.8 (AA in 2.2)
- [ ] Form inputs have visible labels (not placeholder-only)
- [ ] Required fields are marked (not color-only)
- [ ] Error messages are specific, not generic; linked to the input via `aria-describedby`
- [ ] Ambiguous labels are unique in context (`aria-label` or `aria-labelledby` where needed)

### Motion & time
- [ ] Respects `prefers-reduced-motion` — all animations / transitions have a reduced-motion alternative
- [ ] No auto-playing content without user consent (or user can pause/stop/hide) — WCAG 2.2.2
- [ ] No content flashes more than 3 times per second — WCAG 2.3.1

### Semantics & structure
- [ ] Interactive elements use semantic HTML (button for buttons, a for links — not `div` + `onClick`)
- [ ] ARIA used only to supplement, not replace, native semantics
- [ ] Dynamic content updates are announced to screen readers (`aria-live`, role alerts)
- [ ] Images have meaningful `alt` text; decorative images have `alt=""`

### Cognitive accessibility
- [ ] Reading level appropriate for the declared user population (prefer ≤ grade 8 for general UI copy)
- [ ] Error messages suggest a specific correction, not just "something went wrong"
- [ ] Task flows minimize working memory load (no need to remember information across steps)
- [ ] Consistent navigation and interaction patterns — no surprise redirects or unexpected context switches

---

## Step 4 — ui-rule TBD check

Scan the prototype or wireframe for any `ui-rule: TBD` annotations from the wireframing stage.

> **Rule:** No `ui-rule: TBD` item may ship to production unresolved.

For each TBD found:
- Flag it as a blocking issue
- Note which interaction it covers and why it was deferred
- Recommend the appropriate rule from `skills/_cross-cutting/ui-interaction/decision-tree.json`

---

## Step 5 — Produce findings report

Use this structure:

```markdown
# Accessibility Audit: [Artifact Name]

**Date**: [YYYY-MM-DD]
**Artifact**: [path or URL]
**Standard**: WCAG 2.2 AA
**Target user population**: [if declared]
**Gate type**: [ship/no-ship | review pass]

---

## Summary

| Category | Pass | Fail | N/A |
|---|---|---|---|
| Landmarks & structure | | | |
| Focus management | | | |
| Color & contrast | | | |
| Interactive elements | | | |
| Motion & time | | | |
| Semantics | | | |
| Cognitive a11y | | | |
| ui-rule TBD | | | |

**Blocking issues (ship/no-ship gate):** [count]
**Recommended fixes:** [count]
**Open TBD items:** [count]

---

## Blocking Issues

### [Issue title] — [WCAG SC number]

**What's wrong:** [Specific observation]
**Where:** [Element, screen, or flow]
**WCAG criterion:** [SC number + title]
**Remediation:** [Specific fix with example markup or pattern]
**Source panelist (if from panel):** [persona slug]

[Repeat for each blocking issue.]

---

## Recommended Fixes (non-blocking)

[Same structure as blocking issues, abbreviated.]

---

## Open ui-rule TBD Items

| Location | Interaction | Recommended rule | Priority |
|---|---|---|---|
| [Screen / element] | [What the interaction does] | [Rule from decision tree] | Blocking / High / Medium |

---

## Passed checks

[Brief confirmation that all other checklist items passed, with any notable passing details.]
```

---

## Remediation guidance reference

| Issue type | Common fix |
|---|---|
| Color-only signal | Add a text label, icon, or border pattern alongside the color |
| Missing focus ring | Apply `:focus-visible { outline: 2px solid <token>; outline-offset: 2px; }` |
| Touch target too small | Expand clickable area with padding; minimum 44×44 CSS px |
| Generic link/button label | Add `aria-label="[action] [context]"` or rewrite visible label |
| Focus trap | Ensure `Escape` key exits the trap and returns focus to the trigger |
| Missing `alt` text | Write `alt` describing the image's purpose; `alt=""` for decorative |
| Auto-playing content | Add `prefers-reduced-motion` CSS rule; provide play/pause control |
| Low contrast | Increase text or background lightness to meet 4.5:1 (text) or 3:1 (UI) |
| Plain-language failure | Rewrite to ≤ grade 8 reading level; remove jargon; add definitions |
