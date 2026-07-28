# Living Plan — Component Catalog

**Read this before editing any `.mdx` file.**

Only the components listed here are allowed. Agents: never invent new JSX tags.
Unknown tags are a `check` failure and block export.

MDX files do not need import statements — all components are injected by the MDX provider.

**Allowlist:** `DashShell` · `PhaseSection` · `PlanPhases` · `Placeholder` · `Takeaway` ·
`Decision` · `AssumptionRow` · `GateStatus` · `GateTrack` · `StatRow` · `Detail` ·
`ScenarioFlow` · `ScopeBoundary` · `ConceptCompare` · `ConceptCard` · `WireframeEmbed` ·
`OpenQuestions`

---

## How export works (read this before trusting a component with content)

`export.mjs` turns phase MDX into workshop Markdown in this order:

1. **Strip `<Placeholder>`** blocks, so example content never reaches a workshop file.
2. **Serialize components to Markdown.** Every component below has an "Exports as"
   entry describing exactly what it becomes.
3. **Strip remaining JSX** tags and comments.
4. **Scrape sections** by heading name and write them into the workshop files.

Step 2 is the contract. A component that carries content in its **props** only
survives export because a serializer exists for it — if you add a component
without one, step 3 deletes the props and the content is gone. This is not
hypothetical: it is what silently emptied `assumptions.md` and `scope.md`'s
`## Decisions` on the first real dash.

**Two rules follow from that:**

- Every new component either ships an export serializer or holds its content as
  **children** (children always pass through).
- `check` fails when a content-bearing component sits inside an exported section
  but produces nothing in the exported Markdown. You get the file, the section,
  and the component name — not silence.

Code fences pass through untouched, and headings inside a fence are ignored by
the scraper, so a fenced diagram or example is safe anywhere.

### What gets exported where

| Workshop file | Built from |
|---|---|
| `assumptions.md` | P1 `## Assumptions` |
| `metrics.md` | P1 `## Metrics` |
| `scope.md` | P2 Problem Statement, User Role, Scope, Mental Models, Constraints, Success Criteria + P3 Objects, Decisions, Sign-Off |
| `design-spec.md` | P3 Context, Goals, Non-Goals, Primary User |
| `flow.md` | P4 Scenarios, Flow, Page List, Goal-Page Map, Reconciliation, Constraints |
| `ethics-review.md` | P6 `## Ethics` |
| `workshop-summary.md` | P8 `## Summary` |

`wireframe.html` is **not** exported — it stays canonical HTML.

### Section headings are matched exactly

Heading matching is exact after normalisation (case, markdown emphasis, hyphens,
a trailing parenthetical, and other punctuation are ignored). `## Non-Goals` can
never satisfy a request for `Goals`, and a section ends at the next heading of
the same or higher level — or at any nested heading that is itself a known
section name.

Plain-language heading names are supported through the alias map in
`export.mjs` → `SECTION_ALIASES`. For example `## Which Screen Delivers Which
Goal` scrapes as `Goal-Page Map`, and `## Where Users and the System Disagree`
scrapes as `Reconciliation`.

**To rename a heading in content, add the new name to `SECTION_ALIASES` first.**
An unlisted heading is not scraped and its content will not reach any workshop
file.

---

## DashShell

**Placed once, at the top of `plan.mdx`.** Renders title, tier badge, session mode, and the P0–P8 progress strip.

```mdx
<DashShell
  slug="assessment-redesign-2026"
  title="Assessment Dashboard Redesign"
  tier="standard"
  sessionMode="interactive"
  currentPhase="P2"
>
  <PlanPhases />
</DashShell>
```

| Prop | Required | Type | Values |
|---|---|---|---|
| `slug` | ✓ | string | workshop slug |
| `title` | ✓ | string | human-readable title |
| `tier` | ✓ | string | `express` · `standard` · `high-stakes` |
| `sessionMode` | — | string | `interactive` (default) · `solo` |
| `currentPhase` | — | string | `P0`–`P8` |

**Exports as:** children only. `plan.mdx` is not itself exported.

**Bad:** `<DashShell>` without slug or title. Missing tier.

`cli.mjs seed --tier --session-mode` writes `tier` and `sessionMode` for you at
P0 — do not hardcode them and do not hand-edit after seeding.

---

## PlanPhases

**Placed once, inside `DashShell`.** Renders every `phases/p*.mdx` file in order.
Takes no props. Move it to control where the phase stack sits relative to other
`plan.mdx` content.

```mdx
<PlanPhases />
```

**Exports as:** nothing. The phase files are exported directly.

---

## PhaseSection

**One per phase (P0–P8).** Wraps all content for that phase. Never delete the shell. Flip `status` as work progresses.

```mdx
<PhaseSection id="P2" title="Background & Scope" status="in-progress">

## Problem Statement

Teachers cannot see which open assignment a struggling student is behind on.

</PhaseSection>
```

| Prop | Required | Type | Values |
|---|---|---|---|
| `id` | ✓ | string | `P0`–`P8` |
| `title` | ✓ | string | phase name |
| `status` | ✓ | string | `placeholder` · `in-progress` · `done` |

**Exports as:** children only.

**Agent rules:**
- `placeholder` = not started yet; keep `<Placeholder>` children
- `in-progress` = currently active phase
- `done` = no `<Placeholder>` may remain (check enforces this)

---

## Placeholder

**Shows an EXAMPLE until replaced.** Always visually distinct (dashed border, muted). Stripped on export — never reaches `scope.md` or any workshop file.

```mdx
<Placeholder example="'Teacher opens Assessment Dashboard and sees 4 active assessments for Grade 5 Math'" />
```

Or with a body:

```mdx
<Placeholder example="Problem statement sentence">

More example content here — all stripped on export.

</Placeholder>
```

| Prop | Required | Type |
|---|---|---|
| `example` | ✓ | string |

**Exports as:** nothing, by design. This is the anti-leak guarantee.

**Bad:** Leaving `<Placeholder>` inside `status="done"` — check will fail.

---

## Takeaway

**One plain-language sentence, pinned at the top of every phase.** Write it for
someone who will read nothing else on the page. Put it directly inside
`PhaseSection`, above the first heading.

```mdx
<PhaseSection id="P1" title="The Problem" status="done">

<Takeaway>Four of twenty-four students fall behind before anyone notices, because nothing connects a mastery prediction to the assignment they are actually missing.</Takeaway>

## Assumptions
...
```

No required props. Content is children — one sentence, no lists.

**Exports as:** a bold blockquote line.

```md
> **Four of twenty-four students fall behind before anyone notices.**
```

Because a Takeaway usually sits above the first heading, it is a phase lede
rather than scraped section content, and normally will not appear in a workshop
file. That is intentional.

---

## Decision

**One locked decision + rationale.** Group multiple inside a PhaseSection under a `## Decisions` heading.

```mdx
## Decisions

<Decision
  title="Not Agent-Native — MDX-native living plan"
  rationale="Avoids external dependency; reuses wireframe skill CSS; works offline."
/>
```

| Prop | Required | Type |
|---|---|---|
| `title` | ✓ | string |
| `rationale` | — | string |

**Exports as:** one bullet per decision. Consecutive decisions become one list.

```md
- **Not Agent-Native — MDX-native living plan** — Avoids external dependency; reuses wireframe skill CSS; works offline.
```

---

## AssumptionRow

**One row per assumption.** Group under a `## Assumptions` heading.

```mdx
## Assumptions

<AssumptionRow
  id="A1"
  statement="Teachers check the dashboard at least 3x per week"
  type="assumed"
  confidence="medium"
  validation="Observe in usability test"
  status="open"
  owner="Research"
/>
```

| Prop | Required | Type | Values |
|---|---|---|---|
| `id` | ✓ | string | e.g. `A1`, `P1-A2` |
| `statement` | ✓ | string | |
| `confidence` | ✓ | string | `high` · `medium` · `low` |
| `type` | — | string | `observed` · `borrowed` · `assumed` (default) |
| `validation` | — | string | |
| `evidence` | — | string | URL, or repo/vault path + date. **Required by lint when `type="observed"`** |
| `status` | — | string | `open` (default) · `validated` · `invalidated` · `deferred` |
| `dueBy` | — | string | `YYYY-MM-DD`, or the solo Learning Gate sentinel `unassigned — set when owner is named`. **Required by lint when the row is debt** |
| `owner` | — | string | `unassigned — needs human` is a valid, meaningful value |

**Exports as:** a Markdown table. A run of consecutive rows shares one header;
omitted props render as `—`. `|` in a value is escaped.

```md
| ID | Statement | Type | Confidence | Validation | Evidence link | Status | Due by | Owner |
|---|---|---|---|---|---|---|---|---|
| A1 | Teachers check the dashboard at least 3x per week | assumed | medium | Observe in usability test | — | open | — | Research |
```

`cli.mjs lint` reads the exported table, so a row that omits `evidence` on an
`observed` claim or `dueBy` on a debt row is flagged there, not at `check` time.

`assumptions.md` is append-only and governance-critical. If `check` reports this
section exporting empty, stop and fix it — do not hand-write the artifact.

---

## GateStatus

**One per mandatory gate.** Place inside the relevant PhaseSection near the gate result.

```mdx
<GateStatus
  name="Evidence Gate"
  required={true}
  result="debt"
  note="No Condens data available. Tagged as assumed with P8 validation commitment."
/>
```

| Prop | Required | Type | Values |
|---|---|---|---|
| `name` | ✓ | string | Gate name |
| `required` | ✓ | boolean | `{true}` · `{false}` |
| `result` | — | string | `pending` (default) · `pass` · `fail` · `debt` · `deferred` |
| `note` | — | string | |

Gates: Evidence (P1) · Reconciliation (P4) · Selection (P5) · Ethics (P6) · Learning (P8)

Gate names stay as-is — they are referenced across the skill library. The
component renders a plain-language subtitle per gate, so no content changes.

**Exports as:** one bullet per gate.

```md
- **Evidence Gate** — result: **debt** · required: yes · No Condens data available.
```

---

## GateTrack

**Placed once, in `plan.mdx`.** Renders all five gates as one progress strip,
reading live status from the API rather than from props. Takes no props and no
children.

```mdx
<GateTrack />
```

**Exports as:** nothing. `GateStatus` is the exportable record; `GateTrack` is
the view of it.

---

## StatRow

**A big-number callout.** For the one or two figures that carry a phase:
`4 of 24 students`, `~2,000 students / 80 teachers`, `4/5`.

```mdx
<StatRow value="4 of 24" label="students flagged per class" />
```

With optional children for a caveat:

```mdx
<StatRow value="~2,000" label="students in scope">

One mid-size district, single pilot year.

</StatRow>
```

| Prop | Required | Type |
|---|---|---|
| `value` | ✓ | string |
| `label` | — | string |

**Exports as:** a bold value plus label line, then any children.

```md
**4 of 24** — students flagged per class
```

---

## Detail

**Collapsible "detail for the build team."** This is the mechanism that lets
prose get shorter without losing rigor. Put implementation depth, long tables,
and process asides here — not in the main flow.

```mdx
<Detail summary="Detail for the build team">

Full component deviation table, instrumentation event names, and the reasoning
behind the retention window.

</Detail>
```

| Prop | Required | Type |
|---|---|---|
| `summary` | ✓ | string |

**Exports as:** the summary as a bold line, then the children — so exported
Markdown keeps the full depth even though the viewer collapses it.

```md
**Detail for the build team**

Full component deviation table, instrumentation event names, and the reasoning
behind the retention window.
```

---

## ScenarioFlow

**A visual step flow with a user/trigger/goal header.** Replaces numbered lists
in P4. Steps are children — write them as an ordered list.

```mdx
## Scenarios

<ScenarioFlow
  user="Teacher of record"
  trigger="Opens Class Activity on Monday morning"
  goal="Know who needs help before class starts"
>

1. Open the Class Activity tab.
2. Scan the At Risk column.
3. Open one student's assignment detail.

</ScenarioFlow>
```

| Prop | Required | Type |
|---|---|---|
| `user` | — | string |
| `trigger` | — | string |
| `goal` | — | string |

**Exports as:** bold label lines for the props, then the children list.

```md
- **User:** Teacher of record
- **Trigger:** Opens Class Activity on Monday morning
- **Goal:** Know who needs help before class starts

1. Open the Class Activity tab.
...
```

---

## ScopeBoundary

**In-scope versus out-of-scope, two columns.** For P2. Both halves are children,
written as ordinary Markdown so they export unchanged.

```mdx
## Scope

<ScopeBoundary>

### In scope

- Class Activity At Risk column.

### Out of scope

- Parent notifications.

</ScopeBoundary>
```

No required props.

**Exports as:** children, unchanged.

**Heading levels matter.** The `In scope` / `Out of scope` headings must be
*deeper* than the enclosing section heading — `###` under a `## Scope`. A `##`
heading inside the block would end the `Scope` section and its content would not
be exported.

---

## ConceptCompare + ConceptCard

**Side-by-side option cards with scores and a clear selected state.** Replaces
P5's prose blocks. `ConceptCompare` wraps two or more `ConceptCard`s.

```mdx
<ConceptCompare>

<ConceptCard
  name="At Risk tab"
  surface="Class Activity"
  action="Open student detail"
  userScore="4/5"
  businessScore="3/5"
  selected={true}
>

Puts the signal where teachers already are, with no new place to check.

</ConceptCard>

<ConceptCard name="Digest email" surface="Email" action="Click through" userScore="2/5" businessScore="4/5">

Cheap to build, easy to ignore.

</ConceptCard>

</ConceptCompare>
```

`ConceptCompare` has no required props and exports its children unchanged.

| `ConceptCard` prop | Required | Type |
|---|---|---|
| `name` | ✓ | string |
| `surface` | — | string |
| `action` | — | string |
| `userScore` | — | string |
| `businessScore` | — | string |
| `selected` | — | boolean (`{true}`) |

**Exports as:** a `### Concept: {name}` heading, labelled fields, then the
rationale children. `selected` only appears when true.

```md
### Concept: At Risk tab

- **Surface:** Class Activity
- **Action:** Open student detail
- **User score:** 4/5
- **Business score:** 3/5
- **Selected:** yes

Puts the signal where teachers already are, with no new place to check.
```

Do not also write a `## Concept:` or `### Concept:` heading by hand — the
serializer emits it, and a duplicate heading is how P5 ended up with two.

---

## WireframeEmbed

**Embeds `wireframe.html` from the workshop.** Added to P6 after the wireframing skill writes the file.

```mdx
<WireframeEmbed src="wireframe.html" title="Assessment Dashboard wireframe" />
```

| Prop | Required | Type |
|---|---|---|
| `src` | ✓ | string | relative to workshop root, e.g. `wireframe.html` |
| `title` | — | string | iframe a11y title (defaults to "Design wireframe") |
| `height` | — | number\|string | px number or CSS string (default 600) |

**Exports as:** a link line, so the exported Markdown still points at the
artifact.

```md
- Wireframe: [Assessment Dashboard wireframe](wireframe.html)
```

**Note:** wireframe.html itself is NOT exported by export.mjs — it stays canonical HTML.

---

## OpenQuestions

**Single block at the bottom of `plan.mdx`.** Only one per plan. Use Markdown list items inside.

```mdx
<OpenQuestions>

- Does P3's locked scope match P5's selection? Owner: TBD. Unblocks: P8 handoff.

</OpenQuestions>
```

No required props.

**Exports as:** children only. `plan.mdx` is not itself exported, so open
questions live in the viewer, not in a workshop file.

---

## Writing rules

Grice's maxims, applied to a document that stakeholders and agents both read.
`check` does not enforce these; reviewers do.

**Quantity — say enough, and stop.**
Lead with the answer in one sentence, then expand. Every phase opens with a
`<Takeaway>`; every section opens with its conclusion, not its context. If a
paragraph does not change what a reader would do next, cut it.

**Quality — never assert what you cannot support.**
An unvalidated claim is an `<AssumptionRow>`, not a sentence. Never invent object
attributes, CTAs, or relationships — query the library or log the assumption.

**Relation — write for the reader in front of you.**
The living plan is read by stakeholders, not just by the next agent. Move process
meta-commentary and skill cross-references into a JSX comment or a `<Detail>`
block:

```mdx
{/* Ran the abbreviated SIP test per the library-gap fork, not the full workshop. */}
```

Cut inline `§` references from human-facing prose entirely. "The ethics review
found no flags" beats "per SKILL.md §2.8 the Section C review returned zero
flags."

**Manner — be plain, and be consistent.**
Expand every acronym on first use in each phase: object library
(object library), design system, Simple-Independent-Persistent (SIP),
Purpose/Structure/Tone/Quality (P/S/T/Q). Prefer the plain-language heading names
in `SECTION_ALIASES` over the internal ones. One idea per sentence. No nested
bullets unless the nesting is the point.

---

## Deferred — do not use yet

Not in the allowlist. Until released, represent these as **structured Markdown
headings** inside `PhaseSection`, using the exact heading text below so the
scraper finds them:

- `ObjectDigest` → `### Hub Object: {name}` heading + prose/table
- `MentalModelCompare` → `### Mental Models` heading + markdown table
- `PageList` → `### Page List` heading + markdown table
- `UserStory` → `### User Stories` heading + standard format
- `SignOffLedger` → `### Sign-Off` heading + markdown table
- `HandoffBrief` → `### Handoff Brief` heading + prose
