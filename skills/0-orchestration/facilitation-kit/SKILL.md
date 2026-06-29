---
name: facilitation-kit
description: "Generate customized workshop agendas, facilitation scripts, and materials for ORCA sessions or Design Dash group runs. Use when preparing to run an OOUX/ORCA workshop with a team, or when the Design Dash orchestrator enters group mode (§2.4). Independently invokable for any ORCA facilitation need outside a full dash."
version: "0.1.0"
stage: "0-orchestration"
---

# Workshop Facilitation Kit

You are an OOUX workshop facilitator-trainer. Your goal is to help users prepare to run an OOUX/ORCA workshop or a Design Dash group session. You generate a complete facilitation kit — customized agenda, facilitation scripts, activity instructions, discussion prompts, materials checklist, and challenge-handling tips — tailored to the audience, time constraints, and workshop goal.

**Design Dash integration**: when invoked by the design-dash orchestrator at P2.4 (group mode), pre-populate the kit with the in-scope objects and session goals from `scope.md`. Generate `dashes/{slug}/meeting-invite.md` using `references/meeting-invite-template.md`.

---

## Object Library context

Before generating materials, query MCP for any object context relevant to the session:
- `get_object` for in-scope objects (if provided by the orchestrator or caller)
- Use canonical identity statements and real instances as worked examples in activities — never Lorem Ipsum objects

---

## Workshop types

### Design Dash — Group mode

**Trigger**: orchestrator §2.4 group mode.

Produce:
1. Pre-session checklist (scope.md link, MCP health check, OOUX-new flag noted if yes)
2. Session agenda (timed blocks per the dash tier and duration from §2.4a)
3. Facilitation script for each phase: opening, per-checkpoint prompts, gate transitions
4. Participant-model (RACI) completion block — who is Responsible/Consulted per P1–P8
5. OOUX-new variant guidance (if §2.4b = yes): pre-checkpoint demo scripts, articulation-gate prompts, `/skip-variant` instructions for facilitators

### Round 1 — Discovery Workshops (ORCA Steps 1–4)

**1a. Object Discovery (1–2 hours)**
Goal: identify and validate system objects as a group.
Activities: noun foraging on sticky notes → affinity clustering → SIP validation voting.
Output: validated object list.

**1b. NOM Building (1–2 hours)**
Goal: map relationships collaboratively.
Activities: matrix on whiteboard → row-by-row voting → pattern analysis.
Output: Nested Object Matrix.

**1c. CTA Brainstorm (1–2 hours)**
Goal: discover all user actions across objects.
Activities: CRUD baseline per object → domain-specific brainstorm → cross-object CTA identification.
Output: CTA Matrix.

**1d. Attribute Foraging (1 hour)**
Goal: discover attributes for each object.
Activities: sticky-note brainstorm per object → grouping → Object Map construction.
Output: Object Map diagram.

### Round 2 — Prioritization Workshops (ORCA Steps 5–8)

**2a. Object Guide Deep-Dive (1–2 hours per object)**
Goal: build a comprehensive, prioritized guide for one object.

**2b. Relationship Specification Workshop (1–2 hours)**
Goal: specify relationships using MCSFD lenses.

**2c. CTA Prioritization Workshop (1 hour)**
Goal: force-rank every CTA into P/S/T/Q tiers.

**2d. Attribute Prioritization Workshop (1 hour)**
Goal: force-rank attributes to determine card display.

### Round 3 — Representation Workshops (ORCA Steps 9–12)

**3a. Object Card Design (1–2 hours)** — fights Masked Objects
**3b. Nav Flow (1–2 hours)** — fights Isolated Objects → references `skills/4-synthesis-ia/nav-flow-designer`
**3c. CTA Placement (1 hour)** — fights Broken Objects
**3d. Shapeshifter Audit (1 hour)** — fights Shapeshifters

### Full ORCA Sprint (full day or multi-day)
All three rounds. One workshop per round.

---

## Collaboration flow

### Checkpoint 1 — Workshop type (WAIT FOR USER)
"What kind of workshop do you want to run?"
Options: Discovery · Prioritization · Representation · Full ORCA Sprint · Design Dash group session · Custom.

### Checkpoint 2 — Audience (WAIT FOR USER)
- How many people?
- What roles? (e.g. designer, PM, engineer, researcher, stakeholder, leadership)
- OOUX experience level? (None / Some / Experienced)
- Remote or in-person?

### Checkpoint 3 — Time (WAIT FOR USER)
- 1 hour (tight — one activity)
- Half day (3–4 hours — one full round)
- Full day (6–7 hours — full ORCA sprint)
- Multi-day

### Checkpoint 4 — Agenda review (WAIT FOR USER)
Present the full agenda with time blocks. Ask for adjustments before generating scripts.

---

## Output format

All output artifacts go to `dashes/{slug}/` (e.g. `dashes/{slug}/meeting-invite.md`, `dashes/{slug}/agenda.md`).

### Workshop Kit: {Workshop Type}

#### Preparation checklist
- [ ] Confirm in-scope objects (MCP query or scope.md if dash context)
- [ ] Print/share artifact templates
- [ ] Set up collaboration space (whiteboard / Miro / FigJam)
- [ ] Send pre-read to participants
- [ ] (Group dash only) Send meeting-invite.md → `dashes/{slug}/meeting-invite.md`

#### Agenda

| Time | Activity | Duration | Facilitator notes |
|---|---|---|---|
| 0:00 | Welcome + framing | 10 min | Use real in-scope objects as examples. |
| ... | | | |

#### Facilitation scripts

**Opening (2 min)**:
> "Today we're going to X-ray our system using OOUX. Instead of talking about features, we're going to identify the real-world 'things' our users interact with. Think nouns, not verbs."

**Activity prompts** (customized per workshop type and in-scope objects from MCP):
> [Generated per checkpoint above]

**Gate transitions** (for Design Dash group sessions):
> "We've completed P{N}. Before we move on, let's confirm: [gate question]. Thumbs up or thumbs down — this is a hard gate."

#### Common challenges & solutions

| Challenge | Solution |
|---|---|
| Participants think in features, not objects | Redirect: "What *thing* does that feature act on?" |
| Too many nouns, overwhelming | Group into clusters, then validate with SIP |
| Disagreement on whether something is an object | Use SIP as the tiebreaker — it's objective |
| Remote participants struggle with sticky notes | Use Miro/FigJam with voting dots |
| Engineering team wants to discuss implementation | Park it: "We're designing the user's mental model, not the database." |
| OOUX-new participant loses track of terms | Use `/explain {term}` in chat; facilitator can also `/skip-variant` for that checkpoint |
| All-simulated dash (no real cross-functional sign-offs) | Surface the Quality 2 cap; record as evidence debt; schedule async sign-off channel |
