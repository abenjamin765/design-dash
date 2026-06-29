---
name: wireframing
description: Use when translating Design Dash artifacts, OOUX page/collection/instance models, object-library findings, or rough product concepts into HTML wireframes. Use when asked to create a wireframe, produce a wireframe for Design Dash P4, update skills/5-wireframing/wireframe-components.html, or translate a design spec into a visual structure.
stage: 5-wireframing
version: 0.1.0
---

# Wireframing

## Overview

Produces `dashes/{slug}/wireframe.html` as the durable wireframe artifact for a Design Dash or standalone wireframing session. Uses `skills/5-wireframing/wireframe-components.html` as the local reusable component/style source.

A wireframe communicates structure, hierarchy, and content placement using minimal monochrome styles. It is system-agnostic — it does not assume any specific design system or component library.

**UI decision tree:** The canonical interaction rule engine lives at `skills/_cross-cutting/ui-interaction/`. Load `skills/_cross-cutting/ui-interaction/SKILL.md` to use it. The decision-tree data file is `skills/_cross-cutting/ui-interaction/decision-tree.json`.

---

## Workflow

### Step 1 — Read `skills/5-wireframing/wireframe-components.html`

Before writing any markup, read `skills/5-wireframing/wireframe-components.html`. Use the existing classes and styles before inventing new ones.

### Step 2 — Gather artifacts

Collect what is known about the screen:

- `dashes/{slug}/flow.md` — **read this first if it exists**. Use the "Derived pages" table as the authoritative page list (do not reinvent pages from scratch). Use the "Goal-page map" to ensure every success criterion lands in markup. Use the "Constraints log" to check component choices before drawing.
- `dashes/{slug}/scope.md` — problem statement, success criteria, constraints.
- Design spec `dashes/{slug}/requirements.md` — in-scope objects, relationships, attributes, actions.
- Object library findings from P1 Context (hub object identity, canonical attributes, prioritized attributes).

If `flow.md` is missing and this wireframe is part of a Design Dash, ask whether P4 Synthesis has been run. If not, recommend running it first. If working standalone (no Design Dash context), proceed without it.

If scope.md or the design spec are unavailable, ask the designer before proceeding.

### Step 3 — Model the page by layer

Decompose every screen into three layers before writing markup:

**Page level** — belongs to the whole screen, not any one item.
- Attributes: page title, subtitle, breadcrumb, summary counts or status banners.
- Actions: primary CTAs scoped to the whole page (e.g. "Schedule assessment"), global filters, date-range filters.

**Collection level** — belongs to a list, table, or grid as a group.
- Attributes: column headers, sort controls, active filter labels, item count.
- Actions: bulk actions, select-all, sort/filter controls, view toggles.
- Sort / filter options: list the available sort keys and filter dimensions explicitly as annotations.

**Instance level** — belongs to one specific object record.
- Attributes: the fields shown per row/card (name, status, date, score, etc.).
- Actions: per-row CTAs (e.g. "View results", "Edit", overflow menu items).

Write this layer model as HTML comment blocks in the wireframe before adding markup, so the structure is visible in source.

### Step 3.5 — Match UI patterns

For each interactive section of the wireframe (inputs, controls, navigation, collections, overlays, feedback):

1. Identify the interaction type (e.g. "user selects one option from a short static list", "user filters a collection by multiple dimensions", "system reports a status").
2. Load `skills/_cross-cutting/ui-interaction/SKILL.md` and look up the matching entry in `component_catalog` within `skills/_cross-cutting/ui-interaction/decision-tree.json`.
3. Record the matched `component_id` and the applicable **semantic** rule IDs from the `rules` array (e.g. `SELECT_SINGLE_2_TO_5`, `DISPLAY_COMPARABLE_RECORDS`).
4. Use this as the wireframe class selection guide (e.g. if the catalog says `radio_group` for single static selection, use `.radio-group` in markup; if it says `filter_chips` for collection control, use `.filter-chips`).

These rule IDs will be cited in annotations (Step 6). If the decision tree has no matching entry, note it as `ui-rule: TBD` and flag it in the critique checklist.

### Step 4 — Rank actions with P/S/T/Q

Before choosing button styles, rank every action in each layer:

| Rank | Visual weight | Wireframe class |
|---|---|---|
| Primary | Filled/black button | `.button.primary` |
| Secondary | Outlined button | `.button.secondary` |
| Tertiary | Text-only link or ghost | `.button.tertiary` (add if not in component lib) |
| Quaternary | Overflow / icon menu | `.overflow-menu` (add if not in component lib) |

No two actions at the same layer should share the same rank unless they are genuinely equal.

### Step 5 — Build the wireframe HTML

Use the standard wireframe HTML shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Page Name} — Wireframe</title>
  <style>
    /* Inline all styles from skills/5-wireframing/wireframe-components.html here */
  </style>
</head>
<body>
  <!-- PAGE LEVEL
       Hub object: {object-name}
       Attributes: {list}
       Actions: {Primary} {Secondary} … -->

  <!-- COLLECTION LEVEL
       Collection: {collection-name}
       Attributes: {list}
       Actions: {list}
       Sort by: {list}
       Filter by: {list} -->

  <!-- INSTANCE LEVEL
       Attributes: {list}
       Actions: {list} -->
</body>
</html>
```

Inline the wireframe-components.html styles in the `<style>` block so the artifact is self-contained.

### Step 6 — Annotate for critique and handoff

Every meaningful section must carry a data-annotation attribute or HTML comment that includes:

- `layer` — page | collection | instance
- `object` — hub object or related object name
- `component-hint` — the intended UI component (e.g. `data-table`, `page-heading`, `select-filter`) where it is obvious. Mark as `TBD` if unclear.
- `ui-rule` — one or more **semantic** rule IDs from `skills/_cross-cutting/ui-interaction/decision-tree.json` (e.g. `DISPLAY_COMPARABLE_RECORDS,COLLECTION_SORT`). Mark as `TBD` if no matching catalog entry was found.

Example:

```html
<!-- layer: collection | object: assessment | component-hint: data-table | ui-rule: DISPLAY_COMPARABLE_RECORDS,COLLECTION_SORT -->
<ol class="list" aria-label="Assessments">
```

### Step 7 — Promote reusable patterns

If you create a structural pattern (not page-specific content) that appears in two or more places:

1. Extract the pattern's HTML + CSS into a new section of `skills/5-wireframing/wireframe-components.html`.
2. Add a section label comment: `<!-- Component: {name} -->`.
3. Use that pattern by class name in the wireframe.

Do not promote one-off page-content structures. Promote only structural/layout patterns.

### Step 8 — Run the wireframe critique checklist

Before writing the file, verify:

- [ ] Every success criterion from `scope.md` maps to a visible UI element. If `flow.md` exists, verify against the goal-page map.
- [ ] P/S/T/Q action ranking is honored — no two actions share rank unless intentional.
- [ ] Attribute priority is honored — most important attributes appear first.
- [ ] Page / collection / instance layers are clearly separated and annotated.
- [ ] No color used as the sole signal for status (status needs label + shape/icon).
- [ ] Heading hierarchy is logical (one `<h1>`, descending levels).
- [ ] Sort and filter options are explicitly listed in collection-level annotations.
- [ ] Every action has an accessible label (button text or aria-label).
- [ ] Component hints are present on major sections.
- [ ] Every interactive section cites at least one semantic `ui-rule` ID from the decision tree. Sections marked `ui-rule: TBD` are flagged as open questions for the designer, not silent failures.
- [ ] If `flow.md` constraints log exists, each constraint with a forced design move is honored or explicitly overridden with a note.

If any check fails, fix it before saving.

### Step 9 — Write the file

Write to `dashes/{slug}/wireframe.html`. Update the design spec's §4 IA and §5 Page anatomy sections to be brief summaries that reference the wireframe: `See wireframe: dashes/{slug}/wireframe.html`.

---

## Component Reuse Quick Reference

| Pattern | Wireframe class | Source |
|---|---|---|
| Primary action button | `.button.primary` | wireframe-components.html |
| Secondary action button | `.button.secondary` | wireframe-components.html |
| List with title + description + action | `.list` | wireframe-components.html |
| Card grid (2 col) | `.cards` | wireframe-components.html |

For patterns not in this table, check `skills/5-wireframing/wireframe-components.html` before creating new CSS.

---

## Additional resources

- UI interaction decision tree: `skills/_cross-cutting/ui-interaction/SKILL.md` (load before Step 3.5)
- Component mapping: `skills/_cross-cutting/ui-interaction/component-mapping.json`
- Layer model reference: `skills/0-orchestration/design-dash/references/microlearning/page-collection-instance.md`
- Action priority reference: `skills/0-orchestration/design-dash/references/microlearning/pstq-ranking.md`
