---
id: workshop-activities
title: Workshop Activities
stage: _cross-cutting
version: "0.1.0"
description: >
  Authors declarative Workshop activity specs (ADR-0004) so structured elicitation
  happens over chat instead of inside it. Agents write spec JSON — data, not code —
  referencing Dash Model node ids, covering the three MVP primitives (question,
  artifact_panel, compare). The runtime renders specs and normalizes responses into
  Dash Model records (decisions, evidence, annotations) with provenance; every
  product decision leaves chat as a model record. Markdown fallback worksheets are
  mandatory per primitive so terminal-only sessions satisfy gates honestly.
roles:
  - ux-designer
  - ux-researcher
  - ai-agent
inputs:
  - name: Dash Model nodes
    description: Node ids under dashes/{slug}/model/ per method/dash-model-schema.md
    required: true
outputs:
  - name: Activity specs
    description: Validated JSON specs at dashes/{slug}/workshop/{activity-id}.json plus markdown fallback worksheets
    artifact_type: data
    template_file: null
tags:
  - workshop
  - elicitation
  - declarative-specs
  - normalization
  - provenance
difficulty: intermediate
estimated_duration_minutes: 30
system_prompt_file: SKILL.md
---

# Workshop Activities — Declarative Elicitation Specs

You author **declarative activity specs** for the Workshop so elicitation is structured and every product decision leaves chat as a model record ([ADR-0004](../../docs/adr/0004-workshop-declarative-activity-primitives.md)). You write **data, not code**: spec JSON referencing Dash Model node ids. The runtime renders specs and captures responses; an activity instance is ephemeral, its normalized response is permanent.

**Why this exists**: chat is where decisions get made but a terrible place for them to live. Unstructured chat produces decisions with no prompt context, no alternatives considered, and no provenance. A spec'd activity produces comparable, auditable records — and the same spec serves browser participants and terminal-only sessions alike.

---

## The three MVP primitives

| Primitive | Type value | When to use | Covers (of ADR-0004's twelve activity types) |
|---|---|---|---|
| **Question** | `question` | You need a typed answer: pick one, pick many, rank, rate, or explain | MCQs (`single`/`multi`), ranking (`ranked`), preference elicitation (`scale`/`single`), prioritization prompts (`scale`/`ranked`) |
| **Artifact panel** | `artifact_panel` | Participants react to a rendered model node — critique it, annotate regions, capture a decision about it | Critique, annotations, decision capture, prototype review (`render: image`/`wireframe`) |
| **Compare** | `compare` | Participants choose between two or more node-backed options, forced or weighted | Comparisons, concept testing, A/B |

Not yet authorable: card sorting, brainstorming, and flow walkthroughs map to the Deck, Board, and Walkthrough primitives, which follow demand post-MVP ([ADR-0004](../../docs/adr/0004-workshop-declarative-activity-primitives.md)). Do not fake them with Question configs; run them as facilitated chat and record outputs directly as model nodes instead.

## Authoring rules

- One activity per file at `dashes/{slug}/workshop/{activity-id}.json`; filename = id + `.json`.
- Ids are kebab-case: `^[a-z0-9]+(-[a-z0-9]+)*$` (e.g., `compare-concept-a-vs-b`).
- Every `node_id`, `nodes[]`, and `target_node_id` must reference an existing Dash Model node file under `dashes/{slug}/model/`. Dangling references are validation failures.
- Specs validate against [`references/activity-spec.schema.json`](references/activity-spec.schema.json). If your spec needs a field the schema rejects, stop — extending the contract is a versioned change, not a local hack.
- Always produce the markdown fallback alongside the spec (below); both derive from the same content.

### Example specs

```json
{
  "id": "question-priority-scale",
  "type": "question",
  "title": "Attribute priority rating",
  "phase": "P2",
  "prompt": "How important is plan-swap speed to your weekly workflow?",
  "nodes": ["attribute-plan-swap-speed"],
  "normalizes_to": "evidence",
  "payload": {
    "mode": "scale",
    "scale": { "min": 1, "max": 5, "step": 1 }
  }
}
```

```json
{
  "id": "panel-weekly-plan-critique",
  "type": "artifact_panel",
  "title": "Weekly plan screen critique",
  "phase": "P6",
  "prompt": "Annotate anything on this screen that would confuse you mid-week.",
  "nodes": ["screen-weekly-plan"],
  "normalizes_to": "annotation",
  "payload": {
    "target_node_id": "screen-weekly-plan",
    "render": "wireframe",
    "annotations_enabled": true
  }
}
```

```json
{
  "id": "compare-concept-a-vs-b",
  "type": "compare",
  "title": "Concept selection",
  "phase": "P5",
  "prompt": "Which concept better fits the flexible-planning opportunity?",
  "nodes": ["opportunity-flexible-planning"],
  "normalizes_to": "decision",
  "payload": {
    "mode": "forced_choice",
    "items": [
      { "node_id": "screen-concept-a", "label": "Search-first" },
      { "node_id": "screen-concept-b", "label": "Calendar-first" }
    ]
  }
}
```

## Response normalization (contract with the runtime)

Responses normalize into Dash Model records whose frontmatter satisfies [`method/dash-model-schema.md`](../../../method/dash-model-schema.md) vocabularies. Provenance on every normalized record: `source: workshop`, `activity_id: <spec id>`, plus the standard `source_dash`, `extracted_at`, and evidence-label `confidence`.

| Response | Normalizes to | Record shape |
|---|---|---|
| `question` answer (`single`/`multi`/`scale`/`free_text`) | `evidence` node | `status: open`, `confidence: reported`, answer in body, unless the spec's `normalizes_to` overrides |
| `question` answer (`ranked`) | `evidence` node | As above, with the ordered values recorded in the body |
| `compare` response (`forced_choice`) | `decision` node | `status: selected`; selected node recorded via `provenance.activity_nodes`, full response (including losing items) preserved verbatim in the body |
| `compare` response (`weighted`) | `evidence` node | `confidence: inferred`, scores and criteria weights in body; `normalizes_to: decision` promotes it |
| `artifact_panel` annotation | `annotation` node | `status: open`, `target_id: <target_node_id>`, comment in body |

The `normalizes_to` spec field overrides these defaults — e.g., a scale question feeding a prioritization decision sets `normalizes_to: decision`.

## Markdown fallbacks (mandatory)

Every primitive has a plain-markdown equivalent so terminal-only sessions satisfy gates honestly (capability-fallback ethos, `method.yaml`). Emit the worksheet when serving the spec; parse completed worksheets back through the same normalization table.

**Question worksheet**

```markdown
## {title} ({phase})

{prompt}

1. Option A
2. Option B
3. Option C

Answer: ___
```

For `ranked`: "Rank 1–N (1 = most preferred): ___". For `scale`: "Answer (1–5): ___". For `free_text`: replace options with ruled lines.

**Artifact panel worksheet**

```markdown
## {title} ({phase})

{prompt}

Artifact: {target_node_id} ({render})

Annotations:
- [location/region]: {comment}
- ___: ___
```

**Compare worksheet**

```markdown
## {title} ({phase})

{prompt}

A. {label of item 1}
B. {label of item 2}

Choice (A or B): ___
Why: ___
```

---

## Checkpoints

1. **Fit** (WAIT FOR USER): confirm audience and phase fit — which participants, which phase, which model nodes the activity elicits about.
2. **Review specs** (WAIT FOR USER): present drafted spec JSON (+ fallback worksheets); flag any node reference that does not resolve rather than guessing.
3. **Publish** (WAIT FOR USER): write specs to `dashes/{slug}/workshop/` and point the human at the runtime (`node apps/workshop/server.js`, then open `?slug={slug}`). The runtime lane owns everything under `apps/`.

## What this skill does NOT do

- Does not write UI code or touch the server — the runtime renderer lives strictly under `apps/` (parallel lane).
- Does not invent primitives beyond the catalog; extending question/artifact_panel/compare (or adding Deck/Board/Walkthrough) is a versioned change to the spec schema, not a per-activity workaround.
- Does not normalize responses itself at runtime — it defines the contract; the runtime executes it.
- Does not modify Dash Model node files — normalized records are new nodes written per `method/dash-model-schema.md`.
