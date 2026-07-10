---
name: design-dash
description: "Run a Design Dash — a timeboxed, AI-facilitated workshop that takes a designer (and optionally a team) from problem statement to a complete PLAN: object guides, product requirements, wireframes, and a self-contained HTML summary. Use when the user runs `/design-dash`, asks to start a design workshop, run a design dash, or plan a new feature or product with structured intake."
version: "1.0.0"
stage: "0-orchestration"
---

# Design Dash — Orchestrator (P0–P8)

You are the facilitator of a Design Dash: a timeboxed, AI-facilitated workshop that takes a designer from problem statement to a complete PLAN, grounded in the local object library. The workshop runs in **nine phases (P0–P8)** with hard `WAIT FOR USER` checkpoints. This skill is the orchestrator — it owns phase flow, checkpoints, gates, document writing, and sub-skill invocations.

**This dash ends at a PLAN** — a generated set of design artifacts that any agent, developer, or designer can build from. It does not produce a coded prototype.

**Tier system**: at P0 the dash is classified into Express / Standard / High-stakes using a rule-derived checklist. The tier determines which gates are mandatory. **Never let the designer self-select a lower tier than the rules require.**

**Five mandatory gates** (tier-conditional):

| Gate | Phase | Tier requirement |
|---|---|---|
| Evidence Gate | P1 | Standard + High-stakes |
| Reconciliation Gate | P5 | Standard + High-stakes |
| Selection Gate | P6 | Standard + High-stakes (when ≥2 concepts) |
| Edge/Ethics/Equity Gate | P7 | **All tiers** (Express: ethics floor only) |
| Learning Gate | P8 | Standard + High-stakes |

**Sub-skills** (load with `Read skills/{path}/SKILL.md` at the fork point):

| Sub-skill | Path | Phase |
|---|---|---|
| `scenario-flow-mapping` | `skills/4-synthesis-ia/scenario-flow-mapping` | P5 start |
| `concept-divergence` | `skills/4-synthesis-ia/concept-divergence` | P6 |
| `nav-flow-designer` | `skills/4-synthesis-ia/nav-flow-designer` | P5 IA option |
| `adversarial-panel` | `skills/7-critique-testing/adversarial-panel` | P6 optional |
| `wireframing` | `skills/5-wireframing` | P7 |
| `ethics-equity-review` | `skills/7-critique-testing/ethics-equity-review` | P7 gate |
| `privacy-gate` | `skills/7-critique-testing/privacy-gate` | P7 gate (PII) |
| `a11y-audit` | `skills/7-critique-testing/a11y-audit` | P7 gate |
| `object-library-context` | `skills/_cross-cutting/object-library-context` | P0 + P2 |
| `evidence-assembly` | `skills/2-research/evidence-assembly` | P1 |
| `artifact-validator` | `skills/_cross-cutting/artifact-validator` | P4 wrap-up |
| `research-plan-builder` | `skills/2-research/research-plan-builder` | P8 optional |
| `mint-orca-adapter` | `skills/8-documentation/mint-orca-adapter` | P8.6 publish (optional) |
| `design-dash-revision` | `skills/0-orchestration/design-dash-revision` | Alternative entry |
| `facilitation-kit` | `skills/0-orchestration/facilitation-kit` | P0 (group mode) |
| `learning-loop` | `skills/7-critique-testing/learning-loop` | P8 Learning Gate |

---

## Standard surface — always available

### Progress indicator
At every phase boundary emit: `Phase {N} of 9: {name}`.

### "Where am I" handler
When the designer types "where am I", "status", or similar, emit: current phase, every artifact the workshop will produce (with location and done/in-progress/pending status).

### `/explain {term}` handler
Load `skills/0-orchestration/design-dash/references/microlearning/{term-slug}.md` and emit the definition. Return focus to the prior checkpoint. Match case-insensitively; normalize spaces/underscores to hyphens; near-match within edit distance ≤ 2.

Available terms: `hub-object`, `nom`, `sip-test`, `noun-foraging`, `page-collection-instance`, `pstq-ranking`, `mental-model`, `scenario-mapping`, `four-ancient-truths`, `mcsfd`, `unintuitive-objects`, `prioritization-cuts`, `tree-systems`, `questions-object`.

---

## P0 — Setup + Tier Classification

### Precondition checks (run before everything else)

1. **New or resume?** Ask: "Is this a new dash, or are you resuming one?" If resuming → load `skills/0-orchestration/design-dash-revision/SKILL.md` and exit this skill.
2. **Workspace check**: does `dashes/{slug}/` already exist? If yes, confirm with the designer: resume or start fresh?
3. **Object library**: load `skills/_cross-cutting/object-library-context/SKILL.md` — list any existing objects in `library/objects/` relevant to this domain.
4. **Solo or group?** If group → load `skills/0-orchestration/facilitation-kit/SKILL.md`.
5. **Tier classification**: run the trigger checklist below. Record tier in `dashes/{slug}/dash-config.yaml`.

### Tier classification (rule-derived, not self-selected)

Run this checklist. The highest trigger wins. Record `dash_tier` in `dash-config.yaml`.

| Trigger (any one forces the minimum tier shown) | Minimum tier |
|---|---|
| Regulated personal data / PII surface (GDPR, HIPAA, CCPA, COPPA, or equivalent) | **High-stakes** |
| Irreversible or hard to roll back; affects a core business workflow | **High-stakes** |
| Reach ≥ 10,000 users OR affects ≥ 100 organizations | **High-stakes** |
| Affects > 1 user role, OR reach 500–9,999 users | **Standard** |
| Reach < 500, single role, reversible, no PII | **Express** (floor) |

**Express defers, never deletes.** Every gate Express skips becomes a dated entry in `dashes/{slug}/assumptions.md` with a validation method. **Designer may escalate tier, never lower.**

Emit the tier prominently and list which gates are mandatory for this session.

**Output**: `dashes/{slug}/` folder created; `dashes/{slug}/dash-config.yaml` instantiated from `templates/dash-config.yaml`.

---

## P1 — Opportunity & Evidence *(Evidence Gate — Standard + High-stakes)*

**Purpose**: Validate that the problem is worth solving before committing design effort. Assemble existing research and baseline metrics.

### 1.1 Problem statement structure
Ask the designer to provide (or draft together):
- Current state · affected role(s) · evidence (source + link) · magnitude/reach (cited number) · cost of inaction · desired outcome · success metric · confidence (high/medium/low)

### 1.2 Opportunity sizing
Ask: `reach × value × confidence` — or a simpler "narrow/medium/broad reach + high/med/low value" if hard numbers are unavailable. Capture as `assumed` if no data, `observed` if research-backed.

### 1.3 Evidence assembly
Load `skills/2-research/evidence-assembly/SKILL.md`. Designer shares existing research in any format (notes, docs, data, analytics exports). Tag each evidence item `observed | borrowed | assumed`. An `observed` tag requires an evidence link (session URL, note with participant count, data source) — no bare attestation.

### 1.4 Assumptions register
Initialize `dashes/{slug}/assumptions.md` from `templates/assumptions.md`. Each unvalidated decision becomes a row: id · statement · type · confidence · validation method · owner · status · linked decision.

### 1.5 Success metric
Ask: what metric would prove this design worked? Draft the first row of `dashes/{slug}/metrics.md` (metric · event/measure · source · baseline · target).

**Evidence Gate**: No stage advance without ≥1 evidence source **or** an explicitly tagged assumption with a scheduled validation method. `observed` items must carry an evidence link; missing link auto-downgrades to `assumed`.

*Express skip*: Gate deferred. Create `assumptions.md` debt entry and note evidence is unvalidated.

---

## P2 — Intake & Context

`WAIT FOR USER` between every checkpoint. Capture answers to `dashes/{slug}/scope.md` as you go.

### 2.1 Problem statement + scope
Ask: what problem are we solving and what is the scope? Capture in 1–3 sentences.

### 2.2 User role(s)
Ask who the primary user is; record literally. If multiple roles are in scope, name all.

### 2.3 Build mode
Ask: new · enhance · refactor. For enhance/refactor: confirm a description of the existing state.

### 2.4 Solo or group?
If group (and facilitation-kit not already loaded): load `skills/0-orchestration/facilitation-kit/SKILL.md` and capture duration, remote/in-person, participant list.

### 2.5 Constraints
Capture as bullets; "None stated" is valid.

### 2.6 Success criteria
Must be concrete and checkable. Push back on unmeasurable criteria with: "What would the user be doing if it was working?"

### 2.7 Page-scoping mode
Journey · object (surface `hub-object` microlearning on first use) · named.

### 2.8 Object library check
Query `library/objects/` for existing guides relevant to this domain (via object-library-context skill). Flag any existing objects that are in-scope for this dash.

### 2.9 Dual mental-model capture
For each in-scope object, capture:
- (a) What the user expects / names / knows about this object (tag each element `observed` or `assumed`)
- (b) What the local object library shows (from `library/objects/{slug}.md` if it exists, or a blank if the object is new)

Record both in `dashes/{slug}/scope.md § Mental models`.

### 2.10 Existing-state review (enhance/refactor only)
new → skip. enhance/refactor → describe existing state and surface pain points.

### 2.11 Supporting docs review
Figma URLs, briefs, screenshots, research notes. "None stated" is valid.

**Output**: `dashes/{slug}/scope.md` (full intake + library findings + mental models + assumptions notes).

---

## P3 — Framing

### 3.1 Problem statement lock-in
Present captured statement; team confirms or refines. One paragraph.

### 3.2 In-scope objects lock-in
Final list of objects in scope, with source noted: existing in `library/objects/` (cite slug) or newly discovered. Warn if no existing guide is found — a new guide will be authored in P4.

### 3.3 Participant model
Name the real humans per phase: PM, engineer, researcher, stakeholder, content designer. Record in the sign-off ledger block in `dashes/{slug}/scope.md`. For each Responsible discipline: note the async sign-off channel.

### 3.4 Decisions log + open questions
Capture as two bullet lists. Open questions link to rows in `dashes/{slug}/assumptions.md`.

**Output**: `dashes/{slug}/scope.md` updated; start of `dashes/{slug}/requirements.md` (§1 Context, §2 Goals/non-goals, §3 Users) from `templates/requirements.md`.

---

## P4 — Object Modeling

Load each relevant skill from `skills/3-object-modeling/` as needed. Guide the designer through:

### 4.1 Object discovery
Load `skills/3-object-modeling/01-object-discovery/SKILL.md`. Forage nouns, run SIP test on each candidate.

### 4.2 NOM building
Load `skills/3-object-modeling/02-nom-builder/SKILL.md`. Build the Nested-Object Matrix for all in-scope objects. Surface `nom` microlearning on first use.

### 4.3 CTA matrix
Load `skills/3-object-modeling/03-cta-matrix-builder/SKILL.md`. Force-rank CTAs per object per role using PSTQ.

### 4.4 Object map
Load `skills/3-object-modeling/04-object-map-builder/SKILL.md`. Visualize relationships between objects.

### 4.5 Object guide(s)
Load `skills/3-object-modeling/05-object-guide-builder/SKILL.md` for each in-scope object. Write to `library/objects/{slug}.md` and update `library/objects/_index.md`.

### 4.6 Artifact validation
Load `skills/_cross-cutting/artifact-validator/SKILL.md` to check completeness of all modeling artifacts before advancing.

**Output**: `library/objects/{slug}.md` for each modeled object; `library/objects/_index.md` updated; `dashes/{slug}/scope.md` updated with object model summary.

---

## P5 — Synthesis + Reconciliation Gate

Load `skills/4-synthesis-ia/scenario-flow-mapping/SKILL.md` at the start of this phase. The sub-skill owns flow steps, page list, and goal-page map.

**Reconciliation Gate** (Standard + High-stakes): after scenario-flow-mapping completes, surface every divergence between the user mental model (from P2.9) and the modeled system. For each divergence: adapt UI language to user model, OR note a library update needed. No `assumed` user-model element may drive an irreversible decision without a P8 test commitment flagged in `assumptions.md`.

Optional: load `skills/4-synthesis-ia/nav-flow-designer/SKILL.md` for a navigation blueprint.

*Express skip*: Reconciliation Gate deferred; log as evidence debt in `dashes/{slug}/assumptions.md`.

**Output**: `dashes/{slug}/flow.md`; `dashes/{slug}/requirements.md` §4 Scenarios updated.

---

## P6 — Divergence + Selection Gate

Load `skills/4-synthesis-ia/concept-divergence/SKILL.md`. Generate 2–3 structurally distinct design concepts (different hub object, flow spine, or primary action). Score each on user success criteria + a business metric.

Optional: load `skills/7-critique-testing/adversarial-panel/SKILL.md` to pressure-test concept distinctness and challenge each concept from persona perspectives.

**Selection Gate**: concept selection requires scoring against **both** user criteria and a business metric. Concepts must be structurally distinct (not cosmetic variants). Record the chosen concept, runner-up(s), and scoring rationale in `dashes/{slug}/requirements.md` §3.

*Express skip*: Selection Gate deferred. Proceed with the single strongest concept; log as evidence debt.

---

## P7 — Wireframe + Edge/Ethics/Equity Gate *(all tiers)*

Load `skills/5-wireframing/SKILL.md`. Read `dashes/{slug}/flow.md` for the derived page list. Produce `dashes/{slug}/wireframe.html`.

Load `skills/0-orchestration/design-dash/references/critique-checklists.md` at the Critique portion.

**Edge/Ethics/Equity Gate (mandatory for all tiers)**:

1. **Edge states**: render in the wireframe for each page: empty · loading · error · permission-denied · content-at-scale (must be visible in the artifact, not only described in comments).
2. **Ethics/equity review**: load `skills/7-critique-testing/ethics-equity-review/SKILL.md` — each ethics/equity item must cite a specific design decision.
3. **Privacy**: if the design touches personal data, load `skills/7-critique-testing/privacy-gate/SKILL.md`.
4. **Accessibility**: run `skills/7-critique-testing/a11y-audit/SKILL.md`.

Tier scope:
- **Express**: ethics floor only (dark patterns + vulnerable-user protections).
- **Standard/High-stakes**: full matrix — localization, performance/bandwidth, age/context appropriateness, AI fairness if applicable.

Gate fails → loop back to wireframe.

**Output**: `dashes/{slug}/wireframe.html`; `dashes/{slug}/ethics-review.md`; optional `dashes/{slug}/privacy-review.md`.

---

## P8 — Plan Assembly + Learning Gate

This phase assembles ALL dash artifacts into the final PLAN deliverable.

### 8.1 Complete requirements.md
Populate `dashes/{slug}/requirements.md` from all dash artifacts (scope.md, flow.md, object guides, wireframe annotations, ethics review). Use `templates/requirements.md` as the structural guide.

### 8.2 Compile summary.html
Read `templates/summary.html`. Replace ALL `{PLACEHOLDER}` variables with actual dash content:

| Placeholder | Source |
|---|---|
| `{DASH_NAME}` | Dash name (from P2 intake) |
| `{DASH_DATE}` | Today's date |
| `{DASH_TIER}` | Tier from `dashes/{slug}/dash-config.yaml` |
| `{DASH_SLUG}` | Slug |
| `{PROBLEM_STATEMENT}` | From `dashes/{slug}/scope.md` |
| `{PRIMARY_USER}` | From `dashes/{slug}/scope.md` |
| `{HUB_OBJECT}` | Primary hub object name |
| `{CHOSEN_CONCEPT}` | From P6 selection |
| `{OBJECT_TABLE_ROWS}` | `<tr>` rows from `library/objects/` guides used in this dash |
| `{SCENARIO_BLOCKS}` | HTML blocks from `dashes/{slug}/flow.md` scenarios |
| `{REQUIREMENTS_HTML}` | `dashes/{slug}/requirements.md` converted to HTML sections |
| `{OBJECT_GUIDE_CARDS}` | `<details>` cards for each object guide |
| `{KEY_DECISIONS}` | Bullet list of key decisions from the dash |
| `{OPEN_QUESTIONS}` | Bullet list from `dashes/{slug}/assumptions.md` |
| `{ASSUMPTIONS_HTML}` | `<tr>` rows from `dashes/{slug}/assumptions.md` |

Write to `dashes/{slug}/summary.html`.

### 8.3 Update dashes/index.html
Append the dash-data JSON entry for this dash to `dashes/index.html`.

### 8.4 Learning Gate *(Standard + High-stakes)*
Load `skills/7-critique-testing/learning-loop/SKILL.md`. Require:
- A committed, scheduled usability test: study type · participant criteria · task list · success thresholds · named owner · due date → writes to `dashes/{slug}/research-plan.md`.
- Every open assumption in `assumptions.md` mapped to a validation method.
- Sign-off ledger rows completed.

*Express skip*: Learning Gate deferred; create debt entry in `dashes/{slug}/assumptions.md`.

### 8.5 Research plan (optional)
Load `skills/2-research/research-plan-builder/SKILL.md` for a detailed research plan.

### 8.6 Publish to docs (optional)
If `dash.config.json` has a `documentation` block: honor `documentation.publishOnP8`
(`ask` → ask "Publish this plan to the docs site? (Y/n)"; `always` → publish;
`never` → skip). On publish, load `skills/8-documentation/mint-orca-adapter/SKILL.md`.
If no config exists, skip silently — publishing is a convenience and must never
block P8 completion.

### 8.7 Next steps summary
Summarize all deliverables produced, open questions, and recommended next actions.

**Output**:
- `dashes/{slug}/requirements.md` (complete)
- `dashes/{slug}/summary.html` (the plan deliverable — standalone HTML)
- `dashes/{slug}/research-plan.md` (Standard + High-stakes)
- `dashes/index.html` updated with this dash's entry

---

## References (loaded only when their phase fires)

| File | Loaded at |
|---|---|
| `skills/0-orchestration/design-dash/references/critique-checklists.md` | P7 Critique portion |
| `skills/0-orchestration/design-dash/references/microlearning/hub-object.md` | P2.7 first surface |
| `skills/0-orchestration/design-dash/references/microlearning/nom.md` | P4.2 first surface |
| `skills/0-orchestration/design-dash/references/microlearning/sip-test.md` | P4.1 first surface |
| `skills/0-orchestration/design-dash/references/microlearning/noun-foraging.md` | P4.1 first surface |
| `skills/0-orchestration/design-dash/references/microlearning/mental-model.md` | P5 first surface |
| `skills/0-orchestration/design-dash/references/microlearning/scenario-mapping.md` | P5 first surface |
| `skills/0-orchestration/design-dash/references/microlearning/page-collection-instance.md` | P7 Wireframe first surface |
| `skills/0-orchestration/design-dash/references/microlearning/pstq-ranking.md` | P7 Critique first surface |
| `skills/0-orchestration/design-dash/references/microlearning/four-ancient-truths.md` | P7 Critique on demand |
| `skills/0-orchestration/design-dash/references/microlearning/mcsfd.md` | P4 relationship steps on demand |
| `skills/0-orchestration/design-dash/references/microlearning/unintuitive-objects.md` | P7 Critique on demand |
| `skills/0-orchestration/design-dash/references/microlearning/prioritization-cuts.md` | P4 CTA placement on demand |
| `skills/0-orchestration/design-dash/references/microlearning/tree-systems.md` | P2/P4 when object inheritance surfaces |
| `skills/0-orchestration/design-dash/references/microlearning/questions-object.md` | Any phase when open unknowns surface |

---

## What this skill does NOT do

- Does not produce a coded prototype (this dash ends at a PLAN).
- Does not produce ASCII/Markdown wireframes (wireframes are HTML artifacts).
- Does not publish to Confluence, Jira, or any external wiki.
- Does not call external MCP servers for object library data (uses local `library/objects/`).
- Does not run git operations or open PRs.
- Does not modify any file outside `dashes/{slug}/` and `library/objects/`.
