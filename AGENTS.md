# AGENTS.md

Cross-agent entry point for the **Design Dash** library. Every agent (Cursor, Claude Code, or any skill-aware tool) reads this file first.

---

## What this library is

A business-agnostic, open-source library of OOUX/ORCA design skills, organized by workflow stage (**intake → plan**). Skills are written for any product domain and follow the OOUX/ORCA method and the Design Dash nine-phase model (P0–P8). A dash ends at a **PLAN** — not a shipped product — and produces a complete, portable artifact set any engineer or designer can build from.

See [`README.md`](./README.md), [`CONTRIBUTING.md`](./CONTRIBUTING.md), and [`AGENTS.md`](./AGENTS.md).

---

## Agent targets & parity

| Agent | Skills dir | Entry file | Distribution |
|---|---|---|---|
| Cursor | `~/.cursor/skills/` (symlinked by `install.sh`) | this `AGENTS.md` | `./install.sh --cursor` |
| Claude Code | `~/.claude/skills/` (symlinked by `install.sh`) | this `AGENTS.md` | `./install.sh --claude` |

- A single edit to `skills/**/<skill>/SKILL.md` propagates to both agents via symlink — **never fork content**.
- No skill hardcodes an absolute machine path.
- Run `./install.sh --dry-run` to preview what would be linked.
- **Workspace config**: an optional, gitignored `dash.config.json` at the repo root can redirect the object library (`library.objectsPath`, `library.indexPath`, `library.format`) and enable P8 docs publishing (`documentation.*`). Skills check it first and fall back to repo defaults — the OSS repo stays business-agnostic.

---

## How to navigate

### Orchestrated work (full Design Dash)

Start the **Design Dash** (`skills/0-orchestration/design-dash`) or invoke the `/design-dash` command.
It sequences the nine phases (P0–P8) and enforces the five mandatory gates.

```
P0  Preconditions & tier classification
P1  Opportunity & Evidence         ← skills/2-research/ (opportunity-framing, evidence-assembly)
P2  Intake & Context               ← skills/1-intake/ (orca-project-intake)
P3  Framing lock
P4  Object Modeling                ← skills/3-object-modeling/ (01–12 ORCA steps)
P5  Flow & IA synthesis            ← skills/4-synthesis-ia/scenario-flow-mapping
P6  Divergence & Selection         ← skills/4-synthesis-ia/concept-divergence
P7  Wireframe + Edge/Ethics/Equity ← skills/5-wireframing/ + skills/7-critique-testing/
P8  Plan assembly                  ← orchestrator compiles requirements.md + summary.html
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
| **_cross-cutting** | `skills/_cross-cutting/` | `object-library-context`, `artifact-validator`, `evidence-and-assumptions`, `voice-and-style`, `stop-slop`, `ui-interaction` |

---

## _cross-cutting skill reference

These skills fire across multiple stages. Load them when the Design Dash or a stage skill calls for them.

| Skill | When to use |
|---|---|
| `object-library-context` | Any time you work with domain objects. Reads `library/objects/` and surfaces relevant object guides. |
| `artifact-validator` | After any OOUX artifact is produced — checks completeness and internal consistency. |
| `evidence-and-assumptions` | Governs `assumptions.md` throughout the dash — logs, updates, and gate-checks assumptions. |
| `ethics-equity-review` | P7 Edge/Ethics/Equity gate — dark patterns, privacy, localization, accessibility. |
| `voice-and-style` | P7 label/copy review; any time new UI copy is introduced. |
| `stop-slop` | Before finalizing any AI-produced artifact — removes vague filler and unsupported assertions. |
| `ui-interaction` | When wireframing interaction patterns — maps generic component behaviors. |

---

## Local Object Library

The object library lives at `library/objects/` in this repo.

- Object guides are generated during dashes via the `05-object-guide-builder` skill and written to `library/objects/`.
- The library **accumulates across dashes** — objects discovered in one dash are available to future dashes.
- Access via `skills/_cross-cutting/object-library-context` — read that skill for usage instructions.
- Index: `library/objects/_index.md` — read this first to find guides by domain or object name.

Never copy object guide content into skill files. Always reference `library/objects/` at runtime.

---

## Templates

Shared artifact templates live in `templates/`. Instantiate per project into `dashes/{slug}/`.

| Template | Purpose |
|---|---|
| `templates/assumptions.md` | Assumption register — classified by type, owned, and tracked to closure |
| `templates/metrics.md` | Success metrics — north-star / guardrail / vanity; instrumentation status |
| `templates/glossary.md` | Term ↔ object ↔ code identifier ↔ UI label; versioned |
| `templates/edge-state-matrix.md` | Per-page: empty, loading, error, permission-denied, at-scale states |
| `templates/ethics-equity-checklist.md` | P7 gate: dark patterns, privacy, localization, accessibility |
| `templates/sign-off-ledger.md` | Discipline × gate × real/simulated status — the confidence register |
| `templates/dash-config.yaml` | Dash identity, tier, mandatory gates, and default thresholds |
| `templates/requirements.md` | Complete product requirements spec (context, goals, objects, flows, acceptance criteria) |
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
