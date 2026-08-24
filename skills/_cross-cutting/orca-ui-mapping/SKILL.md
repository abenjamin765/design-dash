---
name: orca-ui-mapping
description: ORCA → UI mapping engine. The intermediate reasoning step between object modeling and visual design. Translates objects, attributes, relationships, actions, and states into explicit visual-hierarchy and representation decisions before any wireframe or code is written. Load before wireframing, prototyping, or reviewing UI built from OOUX artifacts.
stage: _cross-cutting
version: 0.1.0
---

# ORCA → UI Mapping — From Domain Model to Interface Decisions

## What this skill provides

The bridge between ORCA artifacts (object guides, attribute prioritization, CTA placement, shapeshifter matrices) and visual design (wireframes, prototypes). It forces explicit translation decisions **before markup exists**, so the interface reflects user importance instead of database structure.

Agents given an object model tend to **render the schema**: every attribute visible at equal weight in database order, every collection as a generic table or card grid, controls hand-rolled from scratch, occasional novel interactions nobody asked for. This skill replaces that behavior with a reasoning pass that answers, for every object in every context: *what must stand out, what should it look like, and why.*

**Artifacts in this directory:**

| File | Purpose |
|---|---|
| `SKILL.md` | This framework — the three-pass reasoning workflow, decision trees, anti-patterns. |
| `worked-example.md` | One object (Invoice) translated across list, card, detail, dashboard, and selection contexts. |

**Output artifact:** `dashes/{slug}/ui-mapping.md` (template: `templates/ui-mapping.md`).

**Consumers reference this canonical path — never duplicated:**

- `skills/5-wireframing/SKILL.md` — Step 3.4 loads this skill before matching UI patterns.
- `skills/_cross-cutting/dataviz-selection/SKILL.md` — loaded when the representation tree reaches a visualization branch.
- `skills/_cross-cutting/ui-interaction/SKILL.md` — receives user intents and consequence context; returns `component_id` resolutions for interactive representations.
- `skills/3-object-modeling/engineering-handoff/SKILL.md` — the backend-side counterpart; this skill is the UI-side counterpart.

---

## When to run

- **Design Dash:** at P6, immediately after concept selection and before wireframing. Produces `dashes/{slug}/ui-mapping.md`.
- **Standalone:** whenever translating OOUX artifacts into any UI surface.

**Inputs (read, never invent):**

- Object guides — `library/objects/{slug}.md` (definition, attributes, CTAs, MCSFD specs, status/lifecycle)
- Attribute prioritization (force-ranked card display + detail-page attributes)
- CTA prioritization and CTA placement (P/S/T/Q tiers per layer)
- Shapeshifter matrix (which contexts each object appears in)
- `dashes/{slug}/flow.md` — page list and goal-page map
- Selected concept (P5) and any constraints logged in `flow.md`

If object guides or the prioritization artifacts are missing, stop and route back to P2 (`03-object-map-builder` → `08-attribute-prioritization`). Mapping an unprioritized model reproduces the schema-rendering problem.

---

## The three-pass workflow

Run all three passes per object before writing any output. Each pass has a distinct question:

| Pass | Question | Output |
|---|---|---|
| 1 — Object brief | *What is this thing?* | Identity, status model, relationships, actions |
| 2 — Intent lens | *What do users do with it here?* | Dominant intents and density call per context |
| 3 — Representation | *How should it appear?* | Visual roles, representation classes, action map |

### Pass 1 — Object brief

For each in-scope object, extract from existing artifacts:

1. **Definition** — one sentence from the object guide.
2. **Identity attributes** — what distinguishes one *instance* from its siblings (usually rank #1–2).
3. **Status/lifecycle model** — states, transitions, and which states are actionable.
4. **Relationships** — with cardinality and typical counts (from MCSFD specs).
5. **Actions** — every CTA with its P/S/T/Q tier and role restrictions.
6. **Display constraints** — business rules affecting visibility (permissions, privacy, redaction).

### Pass 2 — Intent lens

For each **context** where the object appears (from the shapeshifter matrix and flow.md pages), answer five questions:

| Intent | Question | Design consequence |
|---|---|---|
| **Recognize** | What must be identifiable in under a second? | Drives the identity zone: title treatment, icon/avatar, type marker |
| **Compare** | What gets compared across instances? | Drives alignment: consistent slots, tabular columns, same units and precision |
| **Monitor** | What changes over time, and how will users notice? | Drives status encoding, recency signals, empty/stale states |
| **Manipulate** | What gets acted on from this context? | Drives the CTA set per layer (fewer than detail view) |
| **Decide** | What decision does this screen support? | Drives summaries, counts, deltas — and whether visualization is justified |

Record the dominant intent mix per context (e.g. "list: compare + monitor"). Then set the **density dial**:

- Recognize/monitor-heavy → lower density, larger identity zone, generous whitespace
- Compare-heavy → higher density, aligned columns, suppressed decoration
- Decide-heavy → judgment aids up front (totals, deltas, trends) — visualization only via `dataviz-selection`

### Pass 3 — Representation decisions

Three sub-decisions, in order:

- **3a. Attributes → visual roles** (below).
- **3b. Relationships → layout** (below).
- **3c. Actions → visibility** (below).

Log any non-standard interaction in the **novelty log** (below).

---

## 3a. Attribute visual roles — the hierarchy engine

Classify every attribute into exactly **one visual role per context**. Roles may shift across contexts (that is the shapeshifter principle made concrete); within one context they are exclusive.

| Visual role | Definition | Typical treatment | Emphasis |
|---|---|---|---|
| **Identity** | Distinguishes this instance from siblings | Title position, largest text in the component | Strongest |
| **Distinguisher** | Distinguishes this *type* from other types | Icon, avatar, type badge, accent | Strong, structural |
| **Status** | Lifecycle/state that changes over time | Badge or pill: label + shape + color (never color alone) | Strong but compact |
| **Primary data** | What users scan to act or decide (ranks #3–4) | Prominent value; right-aligned tabular numerals in tables | Medium-strong |
| **Context** | Orients: who, when, where, parent | Muted secondary text; metadata row | Low |
| **Metadata** | System bookkeeping (IDs, timestamps, computed values) | Hidden by default; detail view, disclosure, or tooltip only | Lowest |

**Rules:**

1. Rank #1–2 from attribute prioritization map to Identity/Distinguisher zones. Ranks #3–4 are Primary data candidates — confirm against the intent lens.
2. If more than two attributes compete for Identity, the object definition is weak — flag it back to ORCA (Masked Objects risk), do not resolve it visually.
3. Metadata never outranks Primary data in any context. IDs and created-at timestamps are not content.
4. Status attributes always get the Status role where a lifecycle exists — never bury state in body text.
5. Every attribute must be classified, including the ones you omit. Omission is a decision: record it ("not shown in this context").

### Representation decision tree (per attribute)

```
What does the user DO with this attribute in this context?
├─ Recognize / identify          → text (title/subtitle); icon only if type-level
├─ Compare across instances      → aligned column (table) or fixed card slot;
│                                   identical unit + precision everywhere
├─ Monitor state change          → status badge / indicator (+ recency signal)
├─ Act on it                     → control — defer pattern choice to ui-interaction
├─ Understand magnitude/pattern  → visualization? gate via dataviz-selection;
│                                   default answer is text
├─ Media (image, avatar, file)   → media element sized by importance
└─ Reference to another object   → link styled as an object reference
                                    (must navigate somewhere — never dead text)
```

### Heuristics by data shape

| Data shape | Default representation | Notes |
|---|---|---|
| Enum, ≤5 states | Badge/pill with label | Shape/icon must differ per state, not just color |
| Boolean (read-only) | Indicator word or icon | Never a disabled-looking checkbox |
| Number, compared | Right-aligned tabular numerals | Consistent units and precision across instances |
| Currency | Numerals + currency mark once per column/group | No repeated `$` per cell |
| Date — monitoring context | Relative ("2h ago", "due in 3d") | Absolute on hover/detail |
| Date — record context | Absolute, unambiguous format | Relative only as supplement |
| Person | Avatar + name | Avatar alone fails recognition for new users |
| Long text | Truncate + disclosure (`ORG_DISCLOSE_SUPPLEMENTAL`) | Full text on detail page |
| Reference to object | Link with object-type styling | Dead-end references are an anti-pattern |
| Count of nested objects | Count badge linking to the collection | The number is an affordance, not trivia |
| File/media | Type icon + name + size/date | Preview only when media IS the content |
| Computed/derived value | Show derivation on hover/detail | Never present as primary data without source note |

---

## 3b. Relationships → layout

Cardinality (from MCSFD specs) drives placement:

| Cardinality | Treatment |
|---|---|
| 1:1, or bounded ≤3 | Inline linked-attribute display — **not** a collection |
| 1:few (4–15 typical) | Compact list or card row inside a detail-page section |
| 1:many (>15, unbounded growth) | Full collection layer with sort/filter; own page if hub-worthy |
| many:many | Collection on both sides; editing via picker pattern |
| Tree/hierarchy | Breadcrumb + tree navigation; depth >3 collapses via progressive disclosure |

**Rules:**

- Page architecture belongs to `nav-flow-designer`; this skill decides **on-page placement** of related objects.
- Every displayed relationship must offer forward navigation (Isolated Objects test): a shown relationship is either a link, a count that links, or explicitly marked non-navigable with a reason.
- A nested collection inherits the intent lens too — a task list inside a project detail is usually monitor+manipulate, so identity shrinks and status grows.

---

## 3c. Actions → visibility

P/S/T/Q tiers come from CTA prioritization (`07-cta-prioritization`), applied per layer by `11-cta-placement-designer`. This skill adds **context overrides** — the same object shows different action sets in different contexts:

| Context | Override |
|---|---|
| Selection/bulk mode | Instance CTAs collapse into checkbox selection + one bulk action bar |
| Dashboard/monitoring — **including collection rows inside operational pages** (review queues, console lists) | All tiers demote one level vs. detail page; navigation replaces manipulation |
| Read-only viewer role | Manipulation CTAs hidden entirely — not disabled |
| Any context | Destructive actions stay Q; one Primary per object per layer |

**Collection-scale emphasis rule.** PSTQ tiers govern *presence and placement*; visual weight is governed separately at screen level. Within any collection, repeated instance actions render as quiet controls (text link, ghost, outline) — never as repeated filled primaries, even though each instance's tier is individually legal. Filled emphasis is reserved for at most one control per screen zone, assigned by severity signals (e.g., over-SLA), not by the action itself. Critique check: count Primary-weighted controls per **screen**, not per object — more than one per zone is a defect.

Never promote an action to fill empty space. Empty space is hierarchy.

---

## Novelty budget

Visual styling is per-project skin — novelty there is encouraged and unconstrained by this skill.

Interaction mechanics default to established patterns (recognition over recall, clear affordances, progressive disclosure — see `ui-interaction` mandatory principles). A novel interaction requires a written justification:

1. Which established pattern was considered and why it fails here
2. What the user gains
3. Evidence label (`observed` / `reported` / `inferred` / `assumed`) — `assumed` novelty must be scheduled for usability testing

Annotate in wireframes: `interaction: standard` or `interaction: novel — {one-line justification}`.

---

## Iconography

**Default library: Lucide** (ISC license, strict 24px/2px-stroke spec, tree-shakeable inline SVG, de-facto ecosystem standard). Declare the choice once per dash.

Deviate only with a recorded reason:

| Library | Deviate when |
|---|---|
| Tabler | Coverage gap in Lucide; needs filled variants for active states (same 24px/2px grammar, survivable mix) |
| Phosphor | The design system uses weight-as-token (6 weights map to emphasis levels) |
| Heroicons | Target codebase is Tailwind UI/Headless UI |
| Material Symbols | Google design language, or animated/optical-size axes required |

**Rules:**

1. One icon per concept across the product; record concept→icon in the glossary.
2. Icons carry meaning only when paired with a label or an established convention. Icon-only controls require an accessible label.
3. Status icons must differ in **shape**, not just color (`A11Y_NO_COLOR_ONLY`).
4. Icons decorate nothing. If removing an icon changes nothing, remove it.
5. Static HTML wireframes: inline SVG placeholders in a consistent stroke style; annotate the intended library (`icon-lib: lucide`).

---

## Output format — `ui-mapping.md`

Use `templates/ui-mapping.md`. Per object it records:

1. **Object brief** — definition link, identity attributes, status model, key relationships
2. **Visual-role classification** — attribute → role → rationale
3. **Context matrix** — context × attribute → representation class + weight (extends the shapeshifter matrix from "shown/hidden" to "how shown")
4. **Intent analysis** — dominant intents + density call per context
5. **Action map** — tier → placement per context, including overrides
6. **Novelty log** — standard/novel + justification
7. **Open questions** — linked to `assumptions.md`
8. **Template deviations** — if the artifact's structure diverges from `templates/ui-mapping.md`, record each deviation (template section → replacement → why) in its "Template Deviations" section, so consumers can diff against the template mechanically

**How wireframing consumes it:** annotations cite the mapping — `component-hint` comes from the representation class, `ui-rule` from `ui-interaction` lookups, and visual-role assignments justify emphasis choices in critique.

---

## Anti-patterns catalog

| # | Anti-pattern | Symptom | Root cause | Correction |
|---|---|---|---|---|
| 1 | **Schema mirror** | Attributes rendered in database order at equal weight | Agent translates structure literally | Classify all attributes into visual roles; rank-driven zones |
| 2 | **Uniform card syndrome** | Generic cards where only text differs between object types | Reusing one layout for everything | Distinctness test (`09-object-card-designer`); type-level Distinguisher role |
| 3 | **Table reflex** | Every collection becomes a data table | Tables feel "complete" | Choose by dominant intent: compare→table, browse/recognize→cards, monitor→status list |
| 4 | **Custom-component bias** | Hand-rolled dropdowns, modals, tabs | No foundation awareness | Route through `ui-interaction`; build on `ui-foundation` primitives; native HTML first |
| 5 | **Novel interaction smuggling** | Invented gestures/mechanics without rationale | Novelty mistaken for quality | Novelty budget: written justification + evidence label |
| 6 | **Decoration charts** | Charts of single values or tiny datasets | Charts feel "designed" | `dataviz-selection` gate: question + sufficient data + takeaway, else no chart |
| 7 | **Icon soup** | Decorative icons, mixed sets, unlabeled icon buttons | Icons added for polish | Iconography rules above; one set, meaning-bearing only |
| 8 | **Metadata inflation** | IDs and timestamps promoted to visible prominence | Schema lists them first | Metadata role: hidden by default, detail/disclosure only |
| 9 | **Dead-end references** | Related-object names as plain text | Relationship treated as string | References are links; Isolated Objects test |
| 10 | **Color-only status** | Red/green badges with no shape or label difference | Color read as sufficient | Label + shape + color always (`A11Y_NO_COLOR_ONLY`) |
| 11 | **Action flood** | Every CTA visible in every context | Fear of hiding functionality | PSTQ per layer + context overrides; overflow menus exist for this |
| 12 | **Dashboard everything** | Viz-first layouts for operational list workflows | Dashboards feel impressive | Intent lens decides; operational work gets lists with strong scan paths |

---

## Gate checklist (before handing off to wireframing)

- [ ] Every in-scope object has a completed brief, intent analysis, and context matrix
- [ ] Every attribute classified into exactly one visual role per context (omissions recorded)
- [ ] No context has more than two attributes competing for Identity
- [ ] Relationship placements match MCSFD cardinality; no dead-end references
- [ ] Action maps respect PSTQ + context overrides; destructive actions are Q everywhere
- [ ] Every visualization candidate passed through `dataviz-selection`
- [ ] Icon set declared; concept→icon pairs recorded in glossary
- [ ] Novelty log complete; every `novel` entry has justification + evidence label
- [ ] Open questions linked to `assumptions.md` with owners

Failures route back into the mapping, not forward into markup.

---

## Related skills

- `skills/5-wireframing/SKILL.md` — consumes this mapping at Step 3.4
- `skills/_cross-cutting/ui-interaction/SKILL.md` — pattern selection for interactive representations
- `skills/_cross-cutting/dataviz-selection/SKILL.md` — visualization gate
- `skills/_cross-cutting/ui-foundation/SKILL.md` — primitive stack for coded prototypes
- `skills/3-object-modeling/09-object-card-designer/SKILL.md` — card-specific anatomy (this skill generalizes it)
- `skills/3-object-modeling/12-shapeshifter-matrix-builder/SKILL.md` — produces the context inventory this skill consumes
