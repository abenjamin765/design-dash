---
name: ui-foundation
description: Recommended UI foundation for Design Dash builds. Stops agents from hand-rolling components by pointing at proven headless primitives, a thin skin layer, and an evaluation checklist for project-supplied systems. Load before coded prototypes (P7), before populating component-mapping.json, or whenever a build is about to create a custom interactive component.
stage: _cross-cutting
version: 0.1.0
---

# UI Foundation — Primitives, Not Another Design System

## What this skill provides

A recommended **behavioral foundation** for coded prototypes and handoff guidance. It is deliberately *not* an opinionated design system: it supplies accessible behavior and structure that agents compose and skin per project's visual language.

Agents building UI from scratch tend to hand-roll dropdowns, modals, tabs, and comboboxes — reproducing decades of accessibility bugs (focus traps, keyboard gaps, ARIA drift) that mature primitives already solved. The rule:

> **Never hand-roll an interactive composite when a maintained primitive exists. Compose primitives; skin with tokens; ship the visual language separately.**

---

## Recommended stack (layered)

| Layer | Recommendation | Notes |
|---|---|---|
| 1 — Structure | Semantic HTML first | Mirrors `META_PREFER_NATIVE` in `ui-interaction`; a native `<select>` beats a custom combobox for ≤15 static options |
| 2 — Behavior | Headless primitives: **Base UI** (default for new React work; stable since Dec 2025, MIT, RTL support) · **Radix Primitives** (established ecosystems) · **React Aria Components** (deepest a11y/behavior) · **Ark UI / Zag.js** (Vue/Solid/Svelte/multi-framework) | Unstyled by design — no visual opinions to fight |
| 3 — Skin | **shadcn/ui** copy-in model as a *starting point* teams restyle via design tokens | A distribution mechanism, not a system — delete what you don't need |
| 4 — Icons | **Lucide** default (see `orca-ui-mapping` § Iconography for deviations) | |
| 5 — Charts | Recharts (React prototypes) · Apache ECharts (heavy/static CDN) · inline SVG (wireframes) | Selection logic lives in `dataviz-selection` |
| 6 — Static wireframes | No JS frameworks: semantic HTML + WAI-ARIA APG patterns + honest stubs (`skills/5-wireframing/wireframe-components.html` remains the wireframe substrate) | Wireframes communicate structure; they do not ship behavior |

**Version reality check (Aug 2026):** Base UI v1.x stable and now shadcn/ui's default; Radix still maintained for existing apps. Verify versions at build time — do not pin stale ones from this file.

---

## ORCA → primitive mapping

How domain concepts land on primitives (behavior only; all visuals are yours):

| ORCA concept | Primitive(s) |
|---|---|
| Object Card | Composition — layout + media + badge primitives; no "card" primitive needed |
| Collection (compare intent) | Table / Grid |
| Collection (browse/recognize) | Listbox / card composition |
| Instance actions | Dropdown Menu / Context Menu / Toolbar |
| Detail sections | Tabs (peer views) / Accordion / Disclosure |
| Filters | Select / Combobox / Checkbox Group / Toggle Group |
| Bulk operations | Checkbox + Toolbar + bulk action bar |
| Status | Badge styling + live-region announcements for async changes |
| Destructive confirmation | AlertDialog |
| Record creation/editing | Dialog or dedicated page per `ui-interaction` rules |

---

## Evaluation checklist (for project-supplied foundations)

When a team brings their own system, evaluate before adopting. Score each criterion honestly; a failure on accessibility or interaction quality is disqualifying regardless of other scores.

- [ ] **Accessibility** — WAI-ARIA APG conformance, keyboard completeness, focus management, screen-reader announcements, RTL
- [ ] **Interaction quality** — pointer/keyboard parity, touch targets, interruption handling
- [ ] **Framework compatibility** — matches the target stack; SSR behavior defined
- [ ] **Styling flexibility** — styleable via parts/data-attributes/CSS variables without fighting encapsulation
- [ ] **Design-token support** — consumes standard token formats; no hardcoded theme
- [ ] **Composability** — primitives compose; no monolithic components forcing layout
- [ ] **Reskinability** — two projects using it can look unrelated
- [ ] **Coverage** — menus, dialogs, combobox, tabs, disclosure, toolbar, toast, table/grid behaviors
- [ ] **ORCA mapping ease** — the mapping table above lands without distortion
- [ ] **Visual neutrality** — imposes no look of its own

---

## Rules

1. Wrap, don't fork: a thin adapter layer may rename/tokenize primitives; it may not fork behavior.
2. Gaps follow the `component-mapping.json` protocol in `ui-interaction`: mark `gap: true`, confirm with the design-system owner before building anything custom.
3. Declare the chosen foundation per dash (in `dash-config.yaml` or `p7-build-note.md`) so handoff names real components.
4. Prototype code is disposable; primitive behavior is not. Never let prototype shortcuts leak into handoff specs as "custom components."

## Related skills

- `skills/_cross-cutting/ui-interaction/SKILL.md` — decides *which* pattern; this decides *what it's built on*
- `skills/_cross-cutting/orca-ui-mapping/SKILL.md` — upstream representation decisions
- `skills/0-orchestration/design-dash/SKILL.md` — P7 coded-prototype gate
