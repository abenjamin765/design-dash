# AGENTS.md

Cross-agent entry point for the **Design Dash** library. Every agent (Cursor, Claude Code, or any skill-aware tool) reads this file first.

---

## What this library is

A business-agnostic, open-source library of OOUX/ORCA design skills, organized by workflow stage (**intake → plan**). Skills are written for any product domain and follow the OOUX/ORCA method and the Design Dash nine-phase model (P0–P8). A dash ends at a **Design Plan** — not a shipped product — and produces a complete, portable artifact set any engineer or designer can build from.

---

## Naming disambiguation

Three "plan" concepts can coexist in a workspace. Do not conflate them:

| Term | Produced by | Output | Next step |
|---|---|---|---|
| **Design Plan** | Design Dash (P8) | `pitch/index.html` + `requirements.md` + `wireframe.html` (+ thin `summary.html`) | Engineering Handoff → your design system |
| **OOUX Workflow Plan** | ORCA Planner skill | `dashes/{slug}/orca-plan.md` | Guides which ORCA skills to run and in what order |
| **Implementation Plan** | Superpowers `writing-plans` skill | `docs/superpowers/plans/…` | Developer execution guide for a specific feature/refactor |

Use "Design Plan" when referring to the primary Design Dash output. Never use "plan" ambiguously when context spans more than one system.

The **Dash Model** is not a fourth plan concept — it is the canonical store behind a dash (node files + generated views, see [`ARCHITECTURE.md`](./ARCHITECTURE.md)). The Design Plan is its generated view, never an independently hand-authored document.

---

See [`README.md`](./README.md), [`CONTRIBUTING.md`](./CONTRIBUTING.md), and [`AGENTS.md`](./AGENTS.md).

## Portable method contract

Before translating the workflow into tool-specific commands, read [`method/method.yaml`](./method/method.yaml). It is the canonical, tool-neutral definition of phases, gates, evidence labels, outputs, and capability fallbacks. Dash Model nodes and edges authored during a dash follow [`method/dash-model-schema.md`](./method/dash-model-schema.md). Adapter instructions in [`adapters/`](./adapters/) may change interaction mechanics but must satisfy the conformance requirements in [`adapters/README.md`](./adapters/README.md).

When a capability is unavailable, disclose the limitation and use the named fallback. Never silently omit a gate, present simulated review as accountable sign-off, or trap the only copy of a deliverable in a proprietary format.

## Delegation verification contract

Specialist success reports are **claims, not evidence**. In dogfooding runs, delegated lanes have reported completed work that diff inspection proved missing, and cited confirmations that never occurred. Therefore:

1. Before accepting any delegated work, the delegating agent **verifies against the artifacts themselves** — run the grep/diff/read that would prove the claim, and require mechanical proof (counts, resolved paths) for structural claims.
2. Never accept "confirmed with the user" claims made by a lane; confirmations happen only in the orchestrator conversation.
3. If verification fails, reconcile the partial state before re-dispatching, and adjust the brief rather than reissuing it unchanged.
4. This contract applies to every agent in this repo, including orchestrators delegating to specialists.
5. **Lanes write artifacts incrementally** — after each checkpoint or sub-deliverable, never as a single end-of-task burst — so an infrastructure failure loses at most one checkpoint. Orchestrators list expected output files in every brief; a resumed lane re-lists the target directory before writing, because orchestrator inventories go stale at crash time.

---

## Agent targets & parity

| Agent | Skills dir | Entry file | Distribution |
|---|---|---|---|
| Cursor | `~/.cursor/skills/` (symlinked by `install.sh`) | this `AGENTS.md` | `./install.sh --cursor` |
| Claude Code | `~/.claude/skills/` (symlinked by `install.sh`) | this `AGENTS.md` | `./install.sh --claude` |
| Generic file-capable agent | workspace files | `adapters/generic/AGENT_PROMPT.md` | paste prompt + attach method/templates |
| Human-facilitated | shared project folder | `GETTING_STARTED.md` | use templates as workshop worksheets |

- A single edit to `skills/**/<skill>/SKILL.md` propagates to both agents via symlink — **never fork content**.
- No skill hardcodes an absolute machine path.
- Run `./install.sh --dry-run` to preview what would be linked.
- **Workspace config**: an optional, gitignored `dash.config.json` at the repo root can redirect the object library (`library.objectsPath`, `library.indexPath`, `library.format`) and enable P8 docs publishing (`documentation.*`). Skills check it first and fall back to repo defaults — the OSS repo stays business-agnostic.

---

## How to navigate

**System boundaries**: see [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the five-role architecture (Chat · Workshop · Dash Model · Design Plan · Story) and the decision records in [`docs/adr/`](./docs/adr/).

### Orchestrated work (full Design Dash)

Start the **Design Dash** (`skills/0-orchestration/design-dash`) or invoke the `/design-dash` command.
It sequences the nine phases (P0–P8) and enforces the five mandatory gates.

```
P0  Preconditions & tier classification
P1  Opportunity & Evidence      ← skills/2-research/ (opportunity-framing, evidence-assembly)
P2  Intake & Object Modeling    ← skills/1-intake/ + skills/3-object-modeling/ (ORCA)
P3  Framing lock                ← design-spec.md
P4  Flow & Reconciliation       ← skills/4-synthesis-ia/scenario-flow-mapping
P5  Divergence & Selection      ← skills/4-synthesis-ia/concept-divergence
P6  Wireframe + Ethics Gate     ← skills/5-wireframing/ (+ _cross-cutting/orca-ui-mapping) + skills/7-critique-testing/
P7  Optional build              ← coded prototype or honest stub note
P8  Validate & learn            ← pitch site + research plan + workshop summary
                                     + optional publish via skills/8-documentation/ (config-driven)
```

### Single-purpose work

Load the skill for the stage you are in:

```
skills/<stage>/<skill>/SKILL.md
```

---

## Stage map

| Stage | Path | Skills |
|---|---|---|
| **0-orchestration** | `skills/0-orchestration/` | `design-dash` (orchestrator spine), `design-dash-revision`, `facilitation-kit` |
| **1-intake** | `skills/1-intake/` | `orca-project-intake`, `orca-planner` |
| **2-research** | `skills/2-research/` | `opportunity-framing`, `evidence-assembly`, `ux-research-planner`, `ux-research-synthesizer`, `research-plan-builder` |
| **3-object-modeling** | `skills/3-object-modeling/` | `01-object-discovery` … `12-shapeshifter-matrix-builder`, `ooux-primer`, `ooux-ctas`, `ooux-relationships`, `ooux-advanced-modeling`, `ooux-object-thinking`, `user-story-writer`, `engineering-handoff`, `cross-object-artifacts`, `case-study-writer` |
| **4-synthesis-ia** | `skills/4-synthesis-ia/` | `scenario-flow-mapping`, `nav-flow-designer`, `concept-divergence` |
| **5-wireframing** | `skills/5-wireframing/` | `wireframing` |
| **7-critique-testing** | `skills/7-critique-testing/` | `adversarial-panel`, `a11y-audit`, `usability-validation`, `learning-loop`, `ethics-equity-review`, `privacy-gate` |
| **8-documentation** | `skills/8-documentation/` | `mint-orca-adapter` (publish P8 artifacts to a Mintlify docs site; optional, config-driven) |
| **_cross-cutting** | `skills/_cross-cutting/` | `object-library-context`, `artifact-validator`, `evidence-and-assumptions`, `voice-and-style`, `stop-slop`, `ui-interaction`, `object-graph-export`, `workshop-activities` |

---

## _cross-cutting skill reference

These skills fire across multiple stages. Load them when the Design Dash or a stage skill calls for them.

| Skill | When to use |
|---|---|
| `object-library-context` | Any time you work with domain objects. Reads `library/objects/` and surfaces relevant object guides. |
| `artifact-validator` | After any OOUX artifact is produced — checks completeness and internal consistency. Library audit mode sweeps all of `library/objects/` and hard-fails guides missing required sections (see its SKILL.md). |
| `evidence-and-assumptions` | Governs `assumptions.md` throughout the dash — logs, updates, and gate-checks assumptions. |
| `ethics-equity-review` | P6 Ethics Gate — dark patterns, privacy, localization, accessibility. |
| `voice-and-style` | P6 label/copy review; any time new UI copy is introduced. |
| `stop-slop` | Before finalizing any AI-produced artifact — removes vague filler and unsupported assertions. |
| `ui-interaction` | When wireframing interaction patterns — maps generic component behaviors. |
| `object-graph-export` | After P2 (or standalone) — Mode A exports `library/objects/` to a validated property graph (`library/graph.json`) so agents can query accumulated objects across dashes; Mode B exports the full dash model (`dashes/{slug}/model/`) to `dashes/{slug}/graph.json` with a generation stamp and anchor-coverage counts. |
| `workshop-activities` | Authoring Workshop activities at any phase — three MVP primitives (question, artifact_panel, compare) as declarative spec JSON referencing Dash Model node ids; responses normalize into Dash Model records; markdown fallbacks mandatory for terminal-only sessions. |
| `orca-ui-mapping` | Between ORCA modeling and wireframing (P6) — translates objects, attributes, relationships, and actions into explicit visual-hierarchy and representation decisions (`ui-mapping.md`). |
| `dataviz-selection` | Whenever a visualization is considered — decides whether a chart is justified and which form fits the question. |
| `ui-foundation` | Before coded prototypes (P7) or component-mapping population — recommended headless primitive stack plus an evaluation checklist for project-supplied systems. |

---

## Local Object Library

The object library defaults to `library/objects/` in this repo. A workspace-local `dash.config.json` may redirect it to an external location (e.g. a Mintlify docs repo).

When a workspace redirects the library, that external location is canonical — never write to `library/objects/` directly in that workspace.

- Object guides are generated during dashes via the `05-object-guide-builder` skill.
- The library **accumulates across dashes** — objects discovered in one dash are available to future dashes.
- Access via `skills/_cross-cutting/object-library-context` — that skill reads `dash.config.json` first and resolves the correct path.
- Index: resolved from `library.indexPath` in `dash.config.json` (or `library/objects/_index.md` fallback).

Never copy object guide content into skill files. Always reference the library at runtime.

---

## Templates

Shared artifact templates live in `templates/`. Instantiate per project into `dashes/{slug}/`.

| Template | Purpose |
|---|---|
| `templates/assumptions.md` | Assumption register — classified by type, owned, and tracked to closure |
| `templates/metrics.md` | Success metrics — north-star / guardrail / vanity; instrumentation status |
| `templates/glossary.md` | Term ↔ object ↔ code identifier ↔ UI label; versioned |
| `templates/edge-state-matrix.md` | Per-page: empty, loading, error, permission-denied, at-scale states |
| `templates/ethics-equity-checklist.md` | P6 gate: dark patterns, privacy, localization, accessibility |
| `templates/sign-off-ledger.md` | Discipline × gate × real/simulated status — the confidence register |
| `templates/dash-config.yaml` | Dash identity, tier, mandatory gates, and default thresholds |
| `templates/requirements.md` | Complete product requirements spec (context, goals, objects, flows, acceptance criteria) |
| `templates/prioritization-report.md` | Kano tallies, Better/Worse coefficients, RICE table, triage verdicts (P2.13) |
| `templates/summary.html` | Self-contained HTML plan summary — the centerpiece dash deliverable |

---

## Rules

Canonical `.mdc` rules live in `rules/`. Copy or symlink them into `.cursor/rules/` in the workspace where you are working.

| Rule | When active |
|---|---|
| `rules/ooux-overview.mdc` | All OOUX-method sessions (`alwaysApply: true`) — skill routing, object library access |
| `rules/ooux-collaboration.mdc` | All OOUX-method sessions (`alwaysApply: true`) — never assume, checkpoint discipline |
| `rules/ooux-ux-research.mdc` | Research planning and synthesis sessions |

---

## Distribution summary

```
design-dash/
├── install.sh          → symlinks skills/** into ~/.cursor/skills/ and ~/.claude/skills/
├── AGENTS.md           → this file (cross-agent contract)
├── README.md           → designer-facing getting-started guide
├── CONTRIBUTING.md     → contributor guidelines
├── LICENSE             → MIT
├── ARCHITECTURE.md     → system boundaries + ADR index
├── docs/adr/           → architecture decision records
├── skills/             → 7 stage dirs + _cross-cutting
│   ├── 0-orchestration/    design-dash, design-dash-revision, facilitation-kit
│   ├── 1-intake/           orca-project-intake, orca-planner
│   ├── 2-research/         opportunity-framing, evidence-assembly, ux-research-*, research-plan-builder
│   ├── 3-object-modeling/  01–12 ORCA steps + ooux-* + supporting skills
│   ├── 4-synthesis-ia/     scenario-flow-mapping, nav-flow-designer, concept-divergence
│   ├── 5-wireframing/      wireframing
│   ├── 7-critique-testing/ adversarial-panel, a11y-audit, ethics-equity-review, privacy-gate, …
│   └── _cross-cutting/     object-library-context, artifact-validator, stop-slop, …
├── commands/           → /design-dash, /orca-*, /wireframe slash commands
├── rules/              → canonical .mdc rules
├── templates/          → artifact templates + summary.html + requirements.md
├── library/objects/    → local object-guide library (accumulates across dashes)
├── dashes/             → per-dash outputs ({slug}/requirements.md, wireframe.html, summary.html, …)
└── tools/              → build-marketplace.mjs
```
