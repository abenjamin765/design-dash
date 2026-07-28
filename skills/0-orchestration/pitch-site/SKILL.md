---
name: pitch-site
description: "Generate a stakeholder pitch site from a completed Design Dash workshop folder. Produces dashes/{slug}/pitch/index.html — a standalone HTML page with narrative spine (end-state → opportunity → mental model → solution → proof → plan → ask) and a tabbed appendix of all Design Dash artifacts. Use at P8 wrap-up via the design-dash orchestrator, or standalone via /pitch-site."
version: "0.1.0"
stage: "0-orchestration"
status: "canonical"
---

# Pitch Site Generator

## When to load

Load this skill when:
- The Design Dash orchestrator reaches P8 wrap-up (`design-dash` SKILL.md P8 step 8.3).
- A designer invokes `/pitch-site` or `/pitch-site --slug {slug}` on an existing workshop folder.
- A designer asks to generate a pitch site, summary site, or stakeholder page from a completed dash.

**Prerequisite**: the workshop folder must contain at minimum:
- `scope.md` (problem statement, desired outcome, primary user)
- `flow.md` (scenarios, page list)
- `assumptions.md` (evidence + open assumptions)
- `dash-config.yaml` (tier, dash name, owner, date)

Wireframe, requirements, ethics, and prototype links enrich the output but are not blocking.

---

## What this skill produces

**Primary output**: `dashes/{slug}/pitch/index.html`

**Prerequisite (P8 order):** `dashes/{slug}/research-plan.md` must exist and be fully authored (study type, participants, tasks, thresholds, owner/due-by or honest solo debt sentinels) **before** generating the pitch. If missing or still a thin template, stop and finish the research plan first — do not invent Learning Gate clearance in the pitch narrative.

`summary.html` is a thin secondary index (links to pitch, wireframe, requirements, evidence). Do not maintain a second full narrative that competes with the pitch.

A self-contained HTML page (no external stylesheets, no CDN dependencies beyond Google Fonts) structured as a stakeholder pitch argument:

| Section | Job | Source artifact |
|---|---|---|
| Hero | Orient + create desire | `scope.md` › product name, desired outcome |
| Future Scene | Make the destination vivid | `scope.md` › vignette |
| Current Reality | Create contrast | `scope.md` + `assumptions.md` |
| Why Now | Create urgency | `scope.md` + P1 evidence |
| Mental Model | Give a memorable framework | `flow.md` + P4 synthesis |
| Proposed Solution | Connect model to capabilities | `requirements.md` |
| Proof & Evidence | Build trust | `assumptions.md` + P1 evidence |
| Implementation Plan | Make it actionable | `requirements.md` + phasing |
| Risks & Open Questions | Build credibility | `assumptions.md` (unvalidated) |
| The Ask | Convert belief to commitment | `scope.md` › decision needed |
| Appendix (tabbed) | Full artifact trail | All workshop files |

**Appendix tabs**:
1. Decisions — key design choices, rationale, alternatives considered
2. FAQs — open questions from `assumptions.md` reformatted as Q&A
3. Requirements — from `requirements.md`
4. Specs — MCSFD highlights / engineering handoff notes
5. ORCA Artifacts — object list, NOM summary, object-library update proposals
6. Assumptions — full register from `assumptions.md` + `metrics.md`
7. Ethics & Edge States — `ethics-review.md` summary + edge state matrix
8. Links — prototype URL, wireframe URL, case study (if present)

---

## Narrative spine rule

The pitch site is an *argument*, not a report. Each section must make the next feel necessary. Follow this scroll rhythm:

1. **Promise** — what becomes possible
2. **Tension** — the gap between now and that future
3. **Shift** — why now is the right moment
4. **Model** — a simple structure for the space
5. **Solution** — how the model drives the design
6. **Proof** — evidence labeled by confidence
7. **Plan** — staged, achievable phases
8. **Ask** — a single, specific decision

**Never start with features.** Always start with the transformed reality the user cares about.

---

## Step-by-step execution

### Step 1 — Identify the decision

Read `scope.md` → desired outcome + `assumptions.md` → unvalidated critical assumptions.
Ask (or infer): **What specific decision is this pitch asking the audience to make?**

If no decision is identifiable, surface this to the designer before proceeding. A pitch site without a clear ask is not ready to generate.

Common decisions:
- Approve a prototype sprint
- Fund a discovery phase
- Select pilot users / classrooms
- Prioritize this opportunity for next quarter
- Align on the mental model
- Commit design + engineering capacity

### Step 2 — Define the audience

From `scope.md` → primary user, stakeholder context:
- Who will read this pitch site?
- What is their current belief state (skeptical / aligned / confused)?
- What objection are they most likely to raise?
- What language do they use?

Tailor the narrative accordingly:
- Skeptical audience → more proof, more risk-handling
- Confused audience → more mental-model work, simpler language
- Aligned audience → more implementation detail, fewer basics

### Step 3 — Draft the narrative spine

Produce this template before writing any HTML:

```
Today, {AUDIENCE} struggles with {SPECIFIC_CURRENT_REALITY}.
This matters because {COST_OR_CONSEQUENCE}.
Now, {NEW_SHIFT} makes it possible to {NEW_CAPABILITY}.
The opportunity is to {STRATEGIC_MOVE}.
The mental model is {SIMPLE_MODEL}.
The first implementation step is {PRACTICAL_NEXT_STEP}.
The decision needed is {SPECIFIC_ASK}.
```

Show this spine to the designer (if present) before building the HTML. If the spine is weak or generic, rewrite it before generating output.

### Step 4 — Gather raw material

Read all available workshop artifacts. Map each section to its source:

```
Hero headline       ← scope.md › desired_outcome (phrased as achievement)
Hero sub            ← "Help [role] [achieve outcome] by [approach]"
Future scene        ← scope.md › vignette OR draft 80–150 words from scope evidence
Current reality     ← scope.md + P1 evidence items
Why now             ← scope.md + P1 opportunity sizing (old constraint → shift → opportunity)
Mental model name   ← flow.md + P4 → named "The X Model"
Model steps         ← flow.md + object NOM relationships
Solution headline   ← requirements.md § approach
Capabilities        ← requirements.md § functional requirements (grouped as capabilities)
Evidence items      ← assumptions.md + P1 items, labeled proven/observed/assumed
Impl phases         ← requirements.md + dash phase plan (Explore→Prototype→Pilot→Scale)
Risks               ← assumptions.md unvalidated items + ethics-review.md risks
The ask             ← scope.md › decision_needed
Appendix - decisions  ← workshop notes, scope.md key decisions, concept scoring
Appendix - FAQs       ← assumptions.md open questions reformatted as Q&A
Appendix - reqs       ← requirements.md
Appendix - specs      ← mcsfd-specs or engineering-handoff (if present)
Appendix - ORCA       ← object guides (via local library/objects/)
Appendix - assumptions← assumptions.md table + metrics.md
Appendix - ethics     ← ethics-review.md + edge-state-matrix
Appendix - links      ← prototype path + wireframe path
```

### Step 5 — Visual direction plan *(pitch HTML only — not product UI)*

Harvested from Anthropic `frontend-design`. Before writing HTML, draft a compact plan (show the designer if interactive):

1. **Subject** — product/opportunity name, audience, single job of the pitch page.
2. **Tokens** — 4–6 named hex colors; display + body type roles (characterful display used with restraint).
3. **Layout concept** — one-sentence composition idea + optional ASCII wire for the first viewport.
4. **Signature** — the single memorable visual idea (one risk, justified).
5. **Anti-defaults** — confirm the plan is *not* warm-cream/serif/terracotta, acid-dark, broadsheet, or purple-SaaS unless the brief asks for that look.

Respect `voice-and-style` and host-product brand constraints. This step applies to **pitch HTML only** — never use it to restyle product prototypes.

### Step 6 — Populate the template

1. Read `templates/pitch-site/index.html`.
2. Replace every `{PLACEHOLDER}` with content from the workshop artifacts.
3. For list-pattern sections (`{PAIN_POINTS}`, `{CAPABILITIES}`, etc.), generate the appropriate HTML elements using the comment patterns shown in the template.
4. For SVG sections (`{HERO_SVG}`, `{MODEL_SVG}`), if a suitable diagram exists in the workshop artifacts use it; otherwise generate a minimal SVG or omit the container.
5. Apply the Step 5 visual direction within the template (or controlled CSS variables) — do not abandon the template structure.
6. Write the completed file to `dashes/{DASH_SLUG}/pitch/index.html`.

**Asset setup**: the template references `assets/design-dash-logo.svg` and `assets/rds-icon.png` with relative paths. Copy (do not symlink) these files:
```
dd_logo.svg → dashes/{slug}/pitch/assets/dd_logo.svg (if present)
# favicon optional — skip if no brand assets in repo
```

### Step 7 — Self-critique

**Required sections** (fail the skill — do not declare done — if any are missing or empty placeholders remain):

| Section | Pass criteria |
|---|---|
| Hero | Specific headline + product/concept name + one CTA to The Ask |
| Future Scene | Believable vignette (not feature list) |
| Current Reality | Concrete friction (not generic “teachers struggle”) |
| Mental Model | **Named** model + ≤5 steps a stakeholder could repeat |
| Proof & Evidence | ≥1 item; every claim labeled proven / observed / assumed |
| The Ask | Single concrete decision (not “learn more”) |
| Appendix · Decisions | ≥1 real decision with rationale |
| Appendix · Assumptions | Table or link to `assumptions.md` |

**Optional** (include when workshop files exist; omit cleanly if absent — do not leave `{PLACEHOLDER}` text): Why Now, Implementation Plan, Risks, Requirements, Specs, ORCA detail, Ethics, Links (wireframe / prototype / `p7-build-note.md`).

#### Full checklist (Standard / High-stakes)

**Clarity**
- [ ] Can a new reader explain the idea after 30 seconds of reading the hero?
- [ ] Is the headline specific (not "Better data for teachers")?
- [ ] Is the ask concrete and single (one decision, not "learn more")?

**Opportunity**
- [ ] Is the problem stated with concrete evidence (not generic)?
- [ ] Is the "why now" persuasive and specific? *(optional section — if present, must pass)*
- [ ] Is the future state exciting but believable?

**Mental model**
- [ ] Is the model named?
- [ ] Could a stakeholder repeat it in a meeting?

**Evidence**
- [ ] Is every claim labeled (proven / observed / assumed)?
- [ ] Are assumptions distinguished from facts?

**Design (structural)**
- [ ] Is there one primary CTA pointing to one decision?
- [ ] No unfilled `{PLACEHOLDER}` strings remain in the HTML?

**Visual craft**
- [ ] Step 5 visual direction was written and followed (signature element present)?
- [ ] Load `skills/_cross-cutting/visual-slop/SKILL.md` (pitch mode) — verdict `pass` or `pass-with-nits`?
- [ ] Run `stop-slop` on narrative copy before declaring done?

#### Express pitch checklist (subset — use when `dash_tier` = express)

- [ ] Hero + Future Scene + Current Reality present
- [ ] Named mental model
- [ ] Evidence items labeled (assumed is OK if honest)
- [ ] Single concrete Ask
- [ ] Appendix has Decisions + Assumptions (other tabs optional)
- [ ] Links point at wireframe and/or `p7-build-note.md` if prototype missing
- [ ] No `{PLACEHOLDER}` leftovers

If any **required** item fails, fix it before writing/announcing the file.

### Step 8 — Write and announce

Write `dashes/{slug}/pitch/index.html`.
Copy assets.
Announce: `Pitch site written to dashes/{slug}/pitch/index.html`.
Update `workshop-summary.md` to include a link to the pitch site.

---

## Standalone invocation (outside of design-dash)

When called via `/pitch-site --slug {slug}`:

1. Read `dashes/{slug}/dash-config.yaml` to confirm the slug exists and retrieve tier + owner.
2. Run all steps above from the available files in `dashes/{slug}/`.
3. If required files are missing, list them and ask the designer to provide them before continuing.
4. Do not re-run any Design Dash phases — this skill is read-only with respect to the workshop folder.

---

## Writing rules

- **No vague CTAs.** "Learn more" is not an ask. "Approve a two-week prototype sprint" is.
- **Label evidence honestly.** proven | observed | assumed | hypothesized | needs-validation.
- **Plain language.** Avoid buzzwords. Use the audience's vocabulary.
- **One idea per section.** If a section is doing two jobs, split it.
- **Short paragraphs.** Max 3 sentences of body copy per section in the narrative sections (hero → ask). The appendix may be denser.
- **No empty adjectives.** Never: seamless, innovative, powerful, revolutionary, game-changing.
- **Avoid AI clichés.** "Now with AI" is not a reason. Name what specifically changed.

---

## What this skill does NOT do

- Does not run any Design Dash phases or modify workshop files.
- Does not commit, push, or open PRs.
- Does not publish to Confluence (use `confluence-publishing` skill for that).
- Does not invent object attributes — it reads guides already present in `library/objects/` or the dash folder.
- Does not modify the pitch-site template (`templates/pitch-site/index.html`).
- Does not generate the wireframe or optional P7 prototype (those are already produced).
