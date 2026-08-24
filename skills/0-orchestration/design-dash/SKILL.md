---
name: design-dash
description: "Run a Design Dash — a timeboxed, AI-facilitated workshop that takes a designer (and optionally a team) from problem statement to a complete PLAN: object guides, product requirements, wireframes, stakeholder pitch site, and a thin HTML summary. Use when the user runs `/design-dash`, asks to start a design workshop, run a design dash, or plan a new feature or product with structured intake."
version: "1.1.0"
stage: "0-orchestration"
---

# Design Dash — Orchestrator (P0–P8)

You are the facilitator of a Design Dash: a timeboxed, AI-facilitated workshop that takes a designer from problem statement to a complete PLAN, grounded in the local object library. The workshop runs in **nine phases (P0–P8)**. This skill is the orchestrator — it owns phase flow, checkpoints, gates, document writing, and sub-skill invocations.

**This dash ends at a PLAN** — design artifacts any agent, developer, or designer can build from. P7 may optionally produce a coded prototype when a `prototype_workspace` is configured; otherwise P7 is stub mode. The primary stakeholder deliverable at P8 is the **pitch site** (`dashes/{slug}/pitch/index.html`).

**Machine contract**: `apps/dash-living-plan/contract/dash-contract.mjs` and `method/method.yaml`. Do not invent phases, gates, or artifact ownership that contradict those files.

**Artifact root**: `dashes/{slug}/` unless `artifact_root` in `dash-config.yaml` says otherwise.

**Tier system**: at P0 the dash is classified into Express / Standard / High-stakes using a rule-derived checklist. The tier determines which gates are mandatory. **Never let the designer self-select a lower tier than the rules require.**

**Session mode** (set at P0 from flags or ask once):

| Mode | Flag | Checkpoint behavior |
|---|---|---|
| **Interactive** (default) | — | Hard `WAIT FOR USER` at every numbered checkpoint |
| **Solo / auto** | `--solo` or `--auto` | Wait only at **phase boundaries** (and hard gates). Auto-confirm intra-phase checkpoints; log each auto-confirm in `dashes/{slug}/auto-confirms.md` |

Solo/auto is for dogfood, agent-run dashes, and designers who want continuous flow. Gates still stop the dash when they fail.

**Solo mode caps at Standard.** High-stakes needs a non-author reviewer and real cross-functional sign-offs. A solo dash that classifies High-stakes **halts at P0** — see below.

**Five mandatory gates** (tier-conditional):

| Gate | Phase | Tier requirement |
|---|---|---|
| Evidence Gate | P1 | Standard + High-stakes |
| Reconciliation Gate | P4 | Standard + High-stakes |
| Selection Gate | P5 | Standard + High-stakes (when ≥2 concepts) |
| Ethics Gate | P6 | **All tiers** (Express: ethics floor only) |
| Learning Gate | P8 | Standard + High-stakes |

**Sub-skills** (load with `Read skills/{path}/SKILL.md` at the fork point):

| Sub-skill | Path | Phase |
|---|---|---|
| `scenario-flow-mapping` | `skills/4-synthesis-ia/scenario-flow-mapping` | P4 |
| `concept-divergence` | `skills/4-synthesis-ia/concept-divergence` | P5 |
| `nav-flow-designer` | `skills/4-synthesis-ia/nav-flow-designer` | P4 IA option |
| `adversarial-panel` | `skills/7-critique-testing/adversarial-panel` | P5 optional |
| `wireframing` | `skills/5-wireframing` | P6 |
| `ethics-equity-review` | `skills/7-critique-testing/ethics-equity-review` | P6 gate |
| `privacy-gate` | `skills/7-critique-testing/privacy-gate` | P6 gate (PII) |
| `a11y-audit` | `skills/7-critique-testing/a11y-audit` | P6 gate |
| `dash-living-plan` | `skills/0-orchestration/dash-living-plan` | P0 onward (when Node available) |
| `pitch-site` | `skills/0-orchestration/pitch-site` | P8 |
| `object-library-context` | `skills/_cross-cutting/object-library-context` | P0 + P2 |
| `evidence-assembly` | `skills/2-research/evidence-assembly` | P1 |
| `kano-prioritization` | `skills/2-research/kano-prioritization` | P2 prioritization |
| `object-graph-export` | `skills/_cross-cutting/object-graph-export` | P2 wrap-up |
| `artifact-validator` | `skills/_cross-cutting/artifact-validator` | P2 wrap-up |
| `research-plan-builder` | `skills/2-research/research-plan-builder` | P8 (before pitch) |
| `mint-orca-adapter` | `skills/8-documentation/mint-orca-adapter` | P8 publish (optional) |
| `design-dash-revision` | `skills/0-orchestration/design-dash-revision` | Alternative entry |
| `facilitation-kit` | `skills/0-orchestration/facilitation-kit` | P0 (group mode) |
| `learning-loop` | `skills/7-critique-testing/learning-loop` | P8 Learning Gate |

When living-plan is active: subagents write `living-plan/phases/p{N}.mdx` only. Workshop `.md` files listed in `EXPORTED_ARTIFACTS` are exporter-owned — do not hand-author those sections; run `export`.

---

## Standard surface — always available

### Progress indicator + auto "Where am I"
At **every phase boundary** (entering P0…P8), always emit both:
1. `Phase {N} of 9: {name}`
2. A compact **Where am I** block: current phase, tier + session mode, and every dash artifact with path and `done | in-progress | pending` status.

### "Where am I" handler
When the designer types "where am I", "status", or similar, re-emit the Where am I block. Prefer `node apps/dash-living-plan/cli.mjs status --dir dashes/{slug}` when Node is available.

### `/explain {term}` handler
Load `skills/0-orchestration/design-dash/references/microlearning/{term-slug}.md` and emit the definition. Return focus to the prior checkpoint. Match case-insensitively; normalize spaces/underscores to hyphens; near-match within edit distance ≤ 2.

Available terms: `hub-object`, `nom`, `sip-test`, `noun-foraging`, `page-collection-instance`, `pstq-ranking`, `mental-model`, `scenario-mapping`, `four-ancient-truths`, `mcsfd`, `unintuitive-objects`, `prioritization-cuts`, `tree-systems`, `questions-object`, `kano-model`.

### Turn economy
- Batch independent reads and shell calls into a single turn.
- One todo write per phase, not per checkpoint.
- Never read `check.mjs`, `export.mjs`, or `contract/dash-contract.mjs` source to debug a failure — run the CLI and read the output.
- Soft-fail the living-plan viewer — never block the dash if it will not start.

---

## Living Plan — always-on surface (when Node available)

Load `skills/0-orchestration/dash-living-plan/SKILL.md` at P0 when `apps/dash-living-plan/cli.mjs` exists. If Node or the app is missing, use `method.yaml` capability fallback `no_node_runtime`: author workshop markdown from templates directly.

```bash
LP=apps/dash-living-plan/cli.mjs

node $LP seed --dir dashes/{slug} --slug {slug}
node $LP serve --dir dashes/{slug}/living-plan --open   # soft-fail
# at each phase boundary:
node $LP check --dir dashes/{slug}/living-plan
node $LP export --dir dashes/{slug}/living-plan
node $LP status --dir dashes/{slug}
node $LP lint --dir dashes/{slug}
```

`export` owns sections in: `assumptions.md`, `metrics.md`, `scope.md`, `design-spec.md`, `flow.md`, `ethics-review.md`, `workshop-summary.md`. Hand-authored `##` sections the exporter does not own are preserved.

---

## P0 — Preconditions + Tier Classification

### Precondition checks (run before everything else)

1. **New or resume?** Ask: "Is this a new dash, or are you resuming one?" If resuming → load `skills/0-orchestration/design-dash-revision/SKILL.md` and exit this skill.
2. **Session mode**: if `/design-dash --solo` or `--auto`, write `session-mode: solo` and explain auto-confirm rules; otherwise `session-mode: interactive`.
3. **Workspace check**: does `dashes/{slug}/` already exist? If yes, confirm: resume or start fresh?
4. **Object library**: load `skills/_cross-cutting/object-library-context/SKILL.md` — list existing objects in `library/objects/` relevant to this domain.
5. **Solo or group?** If group → load `skills/0-orchestration/facilitation-kit/SKILL.md`.
6. **Tier classification**: run the trigger checklist below. Record tier in `dashes/{slug}/dash-config.yaml`.

### Tier classification (rule-derived, not self-selected)

Run this checklist. The highest trigger wins. Record `tier` and `computed-tier-rationale` in `dash-config.yaml`.

| id | Trigger (any one forces the minimum tier shown) | Minimum tier |
|---|---|---|
| T1 | New disclosure of regulated personal data / PII (GDPR, HIPAA, CCPA, COPPA, or equivalent) | **High-stakes** (+ Privacy gate) |
| T2 | Payment / financial / health / assessment-scoring surface | **High-stakes** |
| T3 | Reach ≥ 10,000 users OR multi-tenant / enterprise-wide rollout | **High-stakes** |
| T4 | Irreversible or hard to roll back; affects a core business workflow | **High-stakes** |
| T5 | Affects > 1 user role, OR reach 500–9,999 users | **Standard** |
| T6 | Reach < 500, single role, reversible, no PII | **Express** (floor) |

**Express defers, never deletes.** Every gate Express skips becomes a dated entry in `dashes/{slug}/assumptions.md` with a validation method. **Designer may escalate tier, never lower.**

The P0 tier is **provisional** until P6 ethics Section C confirms it. A Section C flag only ever raises. Lowering a provisional High-stakes tier that was set only by T1 requires a non-author reviewer and a `tier-override-log` entry.

### Solo mode and the tier ceiling

**If the tier is High-stakes and `session-mode: solo`, halt at P0.**

1. Do not proceed to P1.
2. Write **only** `dashes/{slug}/dash-config.yaml` with `tier: high-stakes`, `session-mode: solo`, `computed-tier-rationale`, and `halted-at: P0`.
3. Write nothing else — no living plan seed, no other artifacts.
4. Announce that High-stakes cannot run solo; re-run interactively with real Responsible sign-offs and a non-author tier confirmer.

Mid-dash: if P6 Section C raises a solo dash to High-stakes, halt at P6 under the same rules after recording the raise.

### Express-light path (when `tier` = express)

| Phase | Express minimum | Skip / defer |
|---|---|---|
| P1 | Short problem + `assumptions.md` debt for Evidence Gate | Full evidence sweep optional |
| P2 | Intake + library query + mental models + light object model | Full library-gap workshop unless gaps block design |
| P3 | Problem lock + objects + light sign-off + `design-spec.md` §1–3 | Full RACI for every discipline |
| P4 | **1 primary scenario** + page list in `flow.md` | Full `scenario-flow-mapping` optional; Reconciliation → debt |
| P5 | **1 strongest concept** recorded | `concept-divergence` + adversarial panel unless designer asks |
| P6 | Wireframe + ethics **floor** + edge states visible | Full ethics matrix → debt if escalated later |
| P7 | Stub note (or optional coded prototype if workspace set) | — |
| P8 | Pitch site + workshop-summary | Learning Gate → debt |

**Output**: `dashes/{slug}/` folder created; `dashes/{slug}/dash-config.yaml` from `templates/dash-config.yaml`. Seed living plan when Node is available.

---

## P1 — Opportunity & Evidence *(Evidence Gate — Standard + High-stakes)*

**Purpose**: Validate that the problem is worth solving before committing design effort.

### 1.1–1.5
Problem statement · opportunity sizing · evidence assembly (`evidence-assembly`) · assumptions register · success metric.

**Evidence Gate**: No stage advance without ≥1 evidence source **or** an explicitly tagged assumption with a scheduled validation method. `observed` items must carry an evidence link.

*Express skip*: Gate deferred. Create `assumptions.md` debt entry.

**Output**: `assumptions.md`, `metrics.md` (Standard+), `living-plan/phases/p1.mdx`.

---

## P2 — Intake & Object Modeling

Capture intake into `scope.md`, then run ORCA modeling for in-scope objects.

### Intake (2.1–2.11)
Problem · roles · build mode · constraints · success criteria · page-scoping · dual mental-model capture (observed/assumed vs library) · existing-state review · supporting docs.

**Mental models are owned here.** Later phases read them; they do not re-author a competing mental-model table.

### Object modeling (2.12+)
Load skills from `skills/3-object-modeling/` as needed: object discovery → NOM → CTA matrix → object map → object guides → `artifact-validator`.

Write guides to `library/objects/{slug}.md` and update `library/objects/_index.md`.

### Quantitative prioritization (2.13) *(Standard + High-stakes; optional for Express)*
Load `skills/2-research/kano-prioritization/SKILL.md`. Replace subjective force-ranking with customer-evidenced prioritization: paired Kano surveys over the frozen candidate list, Better/Worse coefficients, RICE mapping, and Must-Be ≻ Performance ≻ Attractive ≻ Indifferent triage. Writes `dashes/{slug}/prioritization-report.md`, which feeds P5 concept scoring. If no survey channel exists, use the skill's disclosed heuristic fallback — never silent.

*Express skip*: defer with an assumptions.md debt entry scheduling validation before P8.

### Object graph export (2.14)
Load `skills/_cross-cutting/object-graph-export/SKILL.md` to regenerate `library/graph.json` from the updated guides, keeping the accumulated library queryable by agents across dashes. Skip only if no object guides were created or updated this dash.

**Output**: `scope.md`; object guides; `prioritization-report.md` (Standard + High-stakes); `library/graph.json`; `living-plan/phases/p2.mdx`.

---

## P3 — Framing Lock

Lock problem statement, in-scope objects, participant model / sign-off ledger, decisions log, and open questions. Produce `design-spec.md` §1–3 (Context, Goals/Non-Goals, Primary User).

**Output**: `design-spec.md`; `living-plan/phases/p3.mdx`.

---

## P4 — Flow & Reconciliation Gate

Load `skills/4-synthesis-ia/scenario-flow-mapping/SKILL.md`.

**Write contract**: subagent writes `living-plan/phases/p4.mdx` only (when living-plan is active). `flow.md` is exporter-owned.

**Reconciliation Gate** (Standard + High-stakes): after scenario flow completes, surface every divergence between the user mental model (from P2) and the modeled system. For each divergence: adapt UI language to user model, OR note a library update needed, with an explicit resolution direction. No `assumed` user-model element may drive an irreversible decision without a P8 test commitment flagged in `assumptions.md`.

Optional: `nav-flow-designer` for a navigation blueprint.

*Express skip*: Reconciliation Gate deferred; log as evidence debt.

**Output**: `flow.md`; `living-plan/phases/p4.mdx`.

---

## P5 — Divergence + Selection Gate

Load `skills/4-synthesis-ia/concept-divergence/SKILL.md`. Generate 2–3 structurally distinct concepts. Score on user criteria + a business metric.

**Weighted scoring**: if `dashes/{slug}/prioritization-report.md` exists (P2.13), derive concept-scoring criteria weights from the validated priorities (Must-Be criteria weigh heaviest) and, where concepts compete on many weighted criteria, use a QFD-style importance × relationship matrix or Pugh comparison against a baseline concept. Record the scorecard with the selection rationale.

**Write contract**: subagent writes `living-plan/phases/p5.mdx` only when living-plan is active.

**Selection Gate**: concepts must be structurally distinct. Record chosen concept, runners-up, and scoring rationale.

*Express skip*: single strongest concept; log Selection as debt.

**Output**: concept decision in living plan / design-spec; `living-plan/phases/p5.mdx`.

---

## P6 — Wireframe + Ethics Gate *(all tiers)*

Load `skills/5-wireframing/SKILL.md`. Produce `dashes/{slug}/wireframe.html`. Wireframing is **P6** (not an earlier phase).

Load `skills/0-orchestration/design-dash/references/critique-checklists.md` at Critique.

**Ethics Gate (mandatory for all tiers)**:

1. **Edge states** visible in the wireframe: empty · loading · error · permission-denied · content-at-scale.
2. **Ethics/equity review**: load `ethics-equity-review` — each item cites a specific design decision. In solo mode, self-answer from config/artifacts; do not shorten Section C.
3. **Privacy**: if personal data, load `privacy-gate`.
4. **Accessibility**: run `a11y-audit`.
5. **Cross-artifact consistency pass**: run the four checks specified in `skills/5-wireframing/SKILL.md` Step 9 (ui-mapping action maps ↔ rendered CTAs · edge-state matrix ↔ rendered states · cited ui-rule IDs ↔ decision tree · selected concept ↔ rendered IA). Results persist in `dashes/{slug}/wireframe-checks.md`; mismatches are fixed or logged as owned design debt.

Tier scope: Express = ethics floor only; Standard/High-stakes = full matrix.

**Output**: `wireframe.html`; `wireframe-checks.md`; `ethics-review.md`; `living-plan/phases/p6.mdx`.

---

## P7 — Optional Build

When `prototype_workspace` is set and a design-system base page is resolvable, optionally produce a coded prototype there. Otherwise write `dashes/{slug}/p7-build-note.md` (stub mode) and continue to P8.

**Never invent a proprietary design-system tree inside this repo.**

**Output**: prototype page and/or `p7-build-note.md`; `living-plan/phases/p7.mdx`.

---

## P8 — Validate & Learn + Pitch *(Learning Gate)*

### 8.1 Research plan first
Author `dashes/{slug}/research-plan.md` **before** dispatching pitch. Solo Learning Gate debt uses honest sentinels (`owner: unassigned — needs human`, `due-by: unassigned — set when owner is named`) — do not invent owners/dates to clear the gate.

### 8.2 Pitch site
Load `skills/0-orchestration/pitch-site/SKILL.md` (or `/pitch-site`). Write `dashes/{slug}/pitch/index.html`. This is the primary stakeholder deliverable.

### 8.3 Thin summary index
Optionally maintain `dashes/{slug}/summary.html` as a short index linking to pitch, requirements, wireframe, and evidence trail — not a second full narrative competing with the pitch.

### 8.4 Requirements + workshop summary
Complete `requirements.md` and `workshop-summary.md` from exported living-plan content (or templates if no Node).

**Handoff-package completeness check** — before closing P8, verify the plan is build-ready:

- [ ] Every user story states Who / What / Why / **When** (conditions, validation rules, permissions) with failure paths
- [ ] Every relationship carries all five MCSFD properties (mechanics · cardinality · sort · filter · dependency)
- [ ] Attributes have exact types; natural keys have unique constraints; instance scale recorded
- [ ] Edge-state matrix covers empty · loading · error · permission-denied · at-scale per page
- [ ] UI copy uses representative content, not placeholders (`{TBD: …}` only where genuinely unknown)
- [ ] Every open question maps to an assumptions.md row with owner + validation method
- [ ] Glossary rows exist for every object and CTA label used in requirements

Unchecked rows are routed: fix now if cheap; otherwise log in `assumptions.md` with an owner. A plan that fails three or more rows is not ready for pitch assembly.

### 8.5 Learning Gate *(Standard + High-stakes)*
Load `learning-loop`. Require scheduled usability test fields or honest debt. Map open assumptions to validation methods.

### 8.6 Update dashes/index.html
Append this dash's entry.

### 8.7 Publish to docs (optional)
If configured, load `mint-orca-adapter`. Never block P8 completion.

**Output**: `pitch/index.html`, `research-plan.md`, `requirements.md`, `workshop-summary.md`, optional `summary.html`, `living-plan/phases/p8.mdx`.

---

## References (loaded only when their phase fires)

| File | Loaded at |
|---|---|
| `references/phases/p0.md` … `p8.md` | When that phase is active (if present) |
| `references/critique-checklists.md` | P6 Critique |
| `references/design-spec-template.md` | P3 |
| `references/meeting-invite-template.md` | P2 group mode |
| `references/workshop-summary-template.md` | P8 |
| `references/microlearning/*.md` | On first surface / `/explain` |

---

## What this skill does NOT do

- Does not require a coded prototype (P7 stub is valid).
- Does not produce ASCII/Markdown wireframes (wireframes are HTML artifacts).
- Does not publish to Confluence, Jira, or any external wiki by default.
- Does not call proprietary object-library MCP servers (uses local `library/objects/`).
- Does not run git operations or open PRs.
- Does not modify files outside `dashes/{slug}/`, `library/objects/`, and an explicitly configured `prototype_workspace`.
