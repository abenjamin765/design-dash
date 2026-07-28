<!--
TEMPLATE USAGE — read this block, then delete it from the artifact you write.

Loaded at: P3 (Framing). Write to `dashes/{slug}/design-spec.md`.

WHEN EACH SECTION IS FILLED
  §1 Context, §2 Goals / Non-Goals, §3 Primary User  → P3 (this template's phase)
  §4 Scenarios & Flow                                 → P4, after `flow.md` is complete
  §5 Selected Concept                                 → P5, after the Selection Gate
  §6 Spec Self-Review                                 → P8.6
Sections for later phases stay in the file as headings with a one-line
`_Not yet written — filled at P{N}._` placeholder. Do not delete them; an empty
heading is how the next phase finds its slot.

HEADING-NAME CONTRACT — do not rename these four
  `## Context`, `## Goals`, `## Non-Goals`, `## Primary User`
The living-plan exporter maps `living-plan/phases/p3.mdx` onto `design-spec.md`
by matching those exact heading names. Renaming one silently drops that section
from the exported artifact. `## Goals` and `## Non-Goals` are siblings at the same
level — never nest one under the other.

AUTHORING PATH
  Living plan in use (normal): author the P3 content in
  `living-plan/phases/p3.mdx` under the heading names above, then run
  `cli.mjs export`, which writes `design-spec.md`. Sections §4–§6 are authored
  directly into `design-spec.md` — the exporter does not populate them.
  No living plan: write this file directly.
  Either way, `design-spec.md` on disk is the artifact the P8 self-review reads.

  This file has two owners, which is deliberate. The exporter rebuilds §1–§3
  from `p3.mdx` on every run and preserves every other `##` section as written,
  moving them below a `Hand-authored below` banner. So: hand-author §4–§6 here as
  soon as their phase completes, keep them as `##` headings at the same level as
  §1–§3, and never hand-edit §1–§3 (those edits are overwritten — the warning
  `cli.mjs check` prints about hand-edited export-owned files is about them).

LEGACY PATH
  If `docs/superpowers/specs/{YYYY-MM-DD}-{slug}-design.md` already exists,
  update it AND copy or symlink the content to
  `dashes/{slug}/design-spec.md`. The workshop folder is the canonical
  location; the whole dash should live in one folder.

TIER NOTES
  Express: §1–§3 only, plus §5 as a single named concept. §4 may point at
  `flow.md` rather than restating it. Every skipped section becomes a dated
  `assumptions.md` debt row — Express defers, it never deletes.
  Standard / High-stakes: all sections.

RULES
  - Cite, do not assert. Every object reference carries its library slug and
    maturity. Every number carries its source. Every claim about a user carries
    an `observed` or `assumed` tag.
  - Never invent object attributes, CTAs, or relationships. If the library does
    not have it, log it in `assumptions.md` and say so here.
  - Goals must be checkable. If a goal cannot be observed happening, rewrite it.
  - Non-Goals are load-bearing. A spec with no Non-Goals has not been scoped.
-->

# Design Spec — {DASH_NAME}

| Field | Value |
|---|---|
| Slug | `{DASH_SLUG}` |
| Dash ID | `{DASH_ID}` |
| Tier | {express / standard / high-stakes} *(provisional until the P6 Section C review confirms it)* |
| Session mode | {interactive / solo} |
| Owner | {OWNER} |
| Last updated | {YYYY-MM-DD} |
| Phase at last edit | {P3 / P4 / P5 / P8} |

---

## Context

<!--
§1 — business situation, product context, and why this dash now. 1–2 paragraphs.
Answer, in order: what exists today, what it does not do, and what triggered
this dash. Name the trigger honestly — a roadmap ask, a support pattern, a
research finding, or a gap surfaced during the P2 library queries. A dogfood or
self-initiated dash says so plainly, so a later reader does not mistake it for
having sponsorship it does not have.
Cite existing shipped behavior by object-library slug (from `library/objects/`)
rather than describing it from memory.
-->

{CONTEXT}

---

## Goals

<!--
§2a — what this design must make possible. One bullet per goal, 2–5 bullets.
Each goal names the role, the surface, and the observable outcome:
  "{Role} can {do what} on {which surface}, so that {outcome}."
A goal that cannot be observed happening is a value statement, not a goal —
rewrite it or move it to Context. Where a goal inherits an existing product
norm, cite the norm rather than restating it as new work.
-->

- {GOAL_1}
- {GOAL_2}

---

## Non-Goals

<!--
§2b — what this design explicitly does not do. Same level as Goals; never
nested under it. 3–6 bullets. Cover at least:
  - adjacent surfaces or lifecycle states left untouched
  - whether a new object is being minted (usually: no — cite the library-gap
    finding and the precedent it follows)
  - audiences deliberately excluded, with the precedent or policy that excludes them
  - the tempting adjacent problem this dash is not solving
Each Non-Goal is a decision, so give its reason in the same bullet.
-->

- {NON_GOAL_1}
- {NON_GOAL_2}

---

## Primary User

<!--
§3 — one role, named from the P2.2 answer (end-user · operator · admin ·
domain-specific label · other — describe). Then the specifics a designer needs:
  - Which products or segments
  - Workflow stage: where in their day this happens, and where it does not
  - Device and surface assumptions, including any new requirement introduced
  - Secondary roles, if any, and the fidelity they get this dash
Tag each behavioral claim `observed` (with an evidence link) or `assumed`
(with the matching `assumptions.md` row id).
-->

{PRIMARY_USER}

**Secondary roles:** {role + fidelity this dash, or "None."}

---

## Scenarios & Flow

<!-- §4 — filled at P4 from `flow.md`. Do not delete this heading at P3. -->

_Not yet written — filled at P4._

<!--
At P4, record here: the primary scenario in one sentence (user · trigger ·
goal), the page list, and the goal-page map. Keep the step-by-step flow in
`flow.md` and link to it rather than duplicating it — `flow.md` is canonical for
flow detail, this section is the spec-level summary.
Also record the Reconciliation Gate outcome: every divergence between the P2.9
user mental model and the local object-library system model, and for each one
whether the UI language adapted to the user model or a library change proposal
was raised.
-->

---

## Selected Concept

<!-- §5 — filled at P5 after the Selection Gate. Do not delete this heading at P3. -->

_Not yet written — filled at P5._

<!--
At P5, record: the chosen concept, the runner-up(s), and the scoring rationale
against both the user success criteria and the business metric. Name what the
runner-up did better — a selection with no tradeoff recorded reads as a
rubber-stamp. If the panel found the concepts were not structurally distinct,
say so and say what changed as a result.
Cross-check before writing: does the concept selected here still match the scope
locked in §2? If P5 selected a concept outside the §2 scope, that is a real
contradiction — surface it as an open question, do not quietly rewrite either one.
-->

---

## Decisions & Open Questions

<!--
Two short lists, appended to as the dash runs. Decisions are the framing calls
this spec depends on; open questions each link to an `assumptions.md` row id so
nothing floats unowned.
-->

**Decisions**

- {DECISION} — {rationale}

**Open questions**

- {QUESTION} — tracked as `assumptions.md` {A-ID}

---

## Spec Self-Review

<!-- §6 — filled at P8.6. -->

_Not yet written — filled at P8.6._

<!--
At P8.6, walk the spec and confirm each of the following. A "no" is a real
finding: record it here and in `assumptions.md` rather than editing the spec to
make the answer yes.
  - Does every Goal in §2 have a surface in §4 that delivers it?
  - Does the concept in §5 stay inside the scope locked in §2?
  - Does every object reference still carry a slug and a current maturity?
  - Is every `observed` claim still backed by a live evidence link?
  - Did anything in P6–P8 change the tier, and does the header table say so?
-->
