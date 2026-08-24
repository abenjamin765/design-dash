---
name: ui-interaction
description: Canonical UI interaction decision engine. Load before generating, refactoring, or reviewing any interaction-heavy UI — forms, controls, collections, navigation, dialogs, feedback states, AI-generated actions, or accessibility reviews. Merges the decision-tree catalog (decision-tree.json) with the always-on pattern rule into a single cross-cutting skill.
stage: _cross-cutting
version: 0.1.0
---

# UI Interaction — Pattern Selection Engine

## What this skill provides

This skill is the **canonical UI rules engine** for the design-dash library. It governs UI component selection across stages 5 (Wireframing) and 7 (Critique/A11Y). It is **loaded on demand** by consumers — not globally always-applied.

**Artifacts in this directory:**

| File | Purpose |
|---|---|
| `decision-tree.json` | Prioritized rule catalog (design-system-agnostic). Source of truth for all component/pattern selection. |
| `component-mapping.json` | Generic overlay: maps `component_catalog` IDs → concrete UI component names for your design system. |

**Consumers reference this canonical path** — never duplicated:

- `skills/5-wireframing/SKILL.md` — Step 3.5 loads this skill before annotating each interactive section.
- `skills/7-critique-testing/a11y-audit` — verifies `requirements` from matched rules were honored; no `ui-rule: TBD` shipped unresolved.
- `skills/_cross-cutting/orca-ui-mapping` — supplies user intents and consequence context from `ui-mapping.md`; receives component resolutions back.

---

## Usage: how to apply the decision tree

**Step 1 — Normalize the task into `input_context_schema` fields.**

Read `decision-tree.json` → `input_context_schema`. Populate the fields that are known. Do **not** silently infer consequential fields.

Required field: `user_goal` (one of: `input`, `select`, `find`, `sort`, `browse`, `view`, `compare`, `edit`, `manipulate`, `navigate`, `act`, `monitor`, `understand_pattern`, `change_view`, `consume_feed`).

When a field is unknown but materially affects the recommendation, surface it as missing context rather than choosing an arbitrary component.

When an ORCA→UI mapping exists (`dashes/{slug}/ui-mapping.md`), populate `user_goal` and consequence fields from its intent analysis instead of re-inferring them from markup.

**Step 2 — Apply `global_requirements` and meta rules before choosing a component.**

Always check: `META_REQUIRE_MINIMUM_CONTEXT` (priority 1000), `META_PREFER_NATIVE` (990), `META_HIGH_IMPACT_AI_REVIEW` (980). These override everything else.

**Step 3 — Evaluate `rules` in descending `priority`.**

Contextual override rules (e.g. `SELECT_SINGLE_RICH_OR_CONSEQUENTIAL`) outrank generic count-threshold defaults (e.g. `SELECT_SINGLE_2_TO_5`).

**Step 4 — Return a structured recommendation.**

Emit the `recommendation_response_schema` when selecting a pattern, resolving ambiguity, or reviewing a mismatch:

```json
{
  "primary_component": "component_id_from_catalog",
  "matched_rule_ids": ["SEMANTIC_RULE_ID"],
  "alternatives": [{ "component": "...", "use_when": "..." }],
  "rationale": ["Why this component fits the user's task and context."],
  "assumptions": ["Assumptions that materially affect the recommendation."],
  "missing_context": ["Information needed before a high-impact decision."],
  "requirements": ["Applicable accessibility and interaction obligations."],
  "states_to_design": ["loading", "empty", "error", "success"],
  "avoid": ["Relevant anti-patterns."],
  "confidence": 0.0
}
```

Do **not** emit this block for every trivial decision — use it for non-trivial pattern selection, ambiguity, or mismatch review.

**Step 5 — For AI-initiated or high-risk actions**, insert a review/confirmation step before execution (`AGENT_RISK_REVIEW`).

**Step 6 — For collections and async work**, specify loading, empty, error, permission, and success states.

---

## Mandatory decision principles

These apply unless a higher-priority rule in `decision-tree.json` explicitly overrides them:

- Prefer native semantic HTML controls before custom composites (`META_PREFER_NATIVE`).
- Choose components by task and consequence first; use item-count thresholds only as defaults.
- Show essential instructions and decision-making information by default; do not hide them in tooltips (`ORG_SHOW_ESSENTIAL`).
- Prefer exposed choices when users need to compare descriptions, pricing, consequences, or visual options.
- Use a `table` for aligned comparison; use a `data_grid` **only** when grid-style keyboard navigation or cell-level manipulation is required — never for read-only tabular content.
- Use `link` for navigation and `button` for commands or state changes.
- Avoid interruptive dialogs for low-risk, reversible actions when an undo pattern is sufficient.
- Require preview or explicit confirmation before irreversible, external, or high-impact AI-initiated actions (`AGENT_RISK_REVIEW`).
- Define loading, empty, error, permission, and success states for collections and asynchronous work (`AGENT_STATE_ALL_STATES`).
- Never rely on color alone for selected, focused, error, or status states (`A11Y_NO_COLOR_ONLY`).

---

## `user_goal` canonical enum (JSON is source of truth)

Use **only** these values when populating `user_goal` in `input_context_schema`:

`input` · `select` · `find` · `sort` · `browse` · `view` · `compare` · `edit` · `manipulate` · `navigate` · `act` · `monitor` · `understand_pattern` · `change_view` · `consume_feed`

---

## Default selection guidance

Use the JSON rule priorities and overrides first. In the absence of overriding context:

- Single selection from 2–5 short choices → `radio_group` (`SELECT_SINGLE_2_TO_5`)
- Single selection from 6–15 compact choices → `select` (`SELECT_SINGLE_6_TO_15`)
- Single selection from 16–100 searchable choices → `combobox` with typeahead (`SELECT_SINGLE_16_TO_100`)
- Very large, dynamic, or unbounded sets → `autocomplete_search` (`SELECT_SINGLE_101_PLUS` / `SELECT_SINGLE_DYNAMIC_REMOTE_SET`)
- Multiple selection from a few visible options → `checkbox_group` (`SELECT_MULTI_FEW_VISIBLE`)
- Multiple selection from many searchable options → `multi_select_combobox` (`SELECT_MULTI_MANY_SEARCHABLE`)
- Sequential readable content → `list` (`DISPLAY_SIMPLE_SEQUENCE`)
- Browsable rich objects → `card_grid` (`DISPLAY_RICH_BROWSABLE_OBJECTS`)
- Repeated records requiring aligned comparison → `table` (`DISPLAY_COMPARABLE_RECORDS`)
- Editable or application-like tabular interaction → `data_grid` (`DISPLAY_INTERACTIVE_EDITABLE_TABULAR`)
- Supplemental optional detail (single) → `disclosure` (`ORG_DISCLOSE_SUPPLEMENTAL`)
- Supplemental optional detail (multiple) → `accordion` (`ORG_ACCORDION_OPTIONAL_SECTIONS`)
- Peer views of one context (no comparison) → `tabs` (`ORG_TABS_PEER_PANELS`)
- Required ordered steps → `step_flow` (`ORG_SEQUENTIAL_REQUIRED`)
- Reversible low-risk action → immediate action with undo when appropriate (`ACTION_DESTRUCTIVE_REVERSIBLE`)
- Irreversible, external, or high-impact action → `modal_dialog` for confirmation (`ACTION_DESTRUCTIVE_IRREVERSIBLE`)

---

## Implementation behavior (UI code generation)

When generating UI code:

- Use the recommended native element or documented accessible composite pattern.
- Include visible labels, group names, keyboard behavior, focus handling, error association, and accessible status announcements as required by the matched rule's `requirements` array.
- Preserve existing design-system components only when their semantics and accessibility behavior satisfy the selected pattern.
- If an existing implementation conflicts with a higher-priority rule, identify the mismatch and propose the smallest viable correction.
- For custom composite controls, explicitly implement the associated keyboard and focus-management behavior (`A11Y_COMPOSITE_PATTERN`).

---

## Design system mapping

After resolving a `component_id` via the decision tree, consult `component-mapping.json` in this directory to resolve the generic ID to a concrete UI component in your design system. A `gap: true` entry means no confirmed component exists — never build ad-hoc without confirmation from your design system team.

Update `component-mapping.json` to reflect your own design system's component names when adopting this library.

---

## Wireframe annotation format (Stage 5 handoff)

When annotating wireframe sections, cite rule IDs using their **semantic form** from `decision-tree.json` (e.g. `DISPLAY_COMPARABLE_RECORDS`, `COLLECTION_SORT`). Never use the deprecated `rN` shorthand.

```html
<!-- layer: collection | object: assessment | component-hint: data-table | ui-rule: DISPLAY_COMPARABLE_RECORDS,COLLECTION_SORT -->
```

---

## Governance

- **Versioning:** The catalog carries `version` + `last_updated` in `decision-tree.json`. Bump on every rule change.
- **Validation suite:** `validation_scenarios` (T001–T018) in `decision-tree.json` is the regression test. Adding or editing a rule requires a matching scenario.
- **TBD backlog:** Every `ui-rule: TBD` from a wireframe is a candidate new rule or confirmed gap.
- **Severity semantics:** `must` = hard critique gate; `should` = recommendation; `must_when_*` = conditional gate (e.g. `A11Y_SORT_ANNOUNCE` only when sortable).

---

## Apply this skill when

- Designing, implementing, refactoring, or reviewing any of:
  - Forms, fields, option selection, filters, sorting, or search
  - Lists, cards, tables, grids, trees, charts, or dashboards
  - Buttons, links, menus, toolbars, bulk actions, or destructive actions
  - Tabs, disclosures, accordions, pagination, navigation, or step flows
  - Validation, alerts, dialogs, toasts, loading, empty, success, or error states
  - AI-generated drafts, AI-proposed changes, or agent-triggered user-visible actions
  - Accessibility of interactive components or component semantics
- Selecting a component family during wireframing (Step 3.5 of the wireframing skill)
- Reviewing a mismatch between wireframe annotations and built markup
- Auditing a11y requirements against matched rule obligations
