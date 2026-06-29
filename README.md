<!-- logo -->

# Design Dash

<!-- badges: license, stars -->

**Take a fuzzy problem all the way to a complete, ready-to-build product plan** — with research, cross-functional input, and ethics/equity checks built into the path, not bolted on after.

Design Dash is an open-source, AI-facilitated UX workflow you can clone and run today, for any product domain. You bring a problem; it walks you through nine phases (intake → plan), enforcing quality gates so what you produce is grounded in evidence and matches how your users actually think.

> **For designers.** This is your starting point. The machine/agent entry point is [`AGENTS.md`](./AGENTS.md). Contributor info is in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## When to run a dash

Run a dash when the work has **real stakes or real uncertainty** — a new workflow, an unclear problem, anything where assumptions could sink a build. For a one-off copy tweak or a throwaway sketch, you don't need the full machinery (that's what the **Express** tier is for).

## You don't pick your rigor — the work does

Tier is **rule-derived**, not designer-chosen. The risk, reversibility, and reach of what you're building determine how many gates are mandatory. This is deliberate: it stops you from "tier-shopping" your way out of doing the evidence work.

| Tier | When it applies | What's mandatory | Cross-functional voices |
|---|---|---|---|
| **Express** | Low risk · easily reversible · narrow reach (one role, small cohort). Never grading, payment, PII, or compliance. | Ethics/equity floor only. Skipped gates become tracked **evidence debt** — deferred, never deleted. | Panel may *simulate* all disciplines |
| **Standard** | Moderate risk · reversible with effort · a real workflow with bounded blast radius (>1 role or meaningful user count). | **Evidence · Reconciliation · Edge/Ethics/Equity** (+ Selection when concepts compete, + Learning when it ships). | **Real** sign-off from each *Responsible* discipline |
| **High-stakes** | Hard/irreversible · broad reach · **or** touches regulated personal data, financial data, or user safety. | **All five gates.** None waivable. | **Real** sign-off required; simulation never sufficient |

> Any feature touching regulated personal data (PII, financial, health, minors) forces **High-stakes** and adds a **Privacy & Compliance gate** with appropriate legal/privacy sign-off.

---

## How it works — the nine phases

| Phase | What you do | What comes out |
|---|---|---|
| **P0 · Preconditions** | Classify tier; confirm research access; assemble cross-functional roster | A dash you can actually run |
| **P1 · Opportunity & Evidence** | Write a falsifiable problem statement; size the opportunity; log assumptions | `assumptions.md` · success-metric hypotheses |
| **P2 · Intake & Context** | Capture the user's mental model (tagged `observed`/`assumed`); check local object library | Dual mental-model capture; library gap list |
| **P3 · Framing lock** | Scope the design surface — provisionally, tied to the assumption register | Framing lock + scope-creep guard |
| **P4 · Object Modeling** | Run ORCA steps 01–12; write object guides to `library/objects/` | NOM · CTA Matrix · Object Map · Object Guides |
| **P5 · Flow & IA** | Derive scenario flows + page architecture; reconcile system ↔ mental model | `flow.md` · page list · resolved divergences |
| **P6 · Divergence** | Generate 2–3 real concepts; score on value/effort + user/business | A defended concept choice |
| **P7 · Wireframe & Critique** | Wireframe; run the adversarial panel; cover edge states, ethics, equity, a11y | `wireframe.html` · edge-state matrix · ethics/equity checklist |
| **P8 · Plan assembly** | Compile `requirements.md` + `summary.html`; close the Learning gate | Complete, portable plan |

---

## The gates — questions you have to answer

Gates aren't bureaucracy. Each one forces "is this real, or is it assumed?"

- **Evidence Gate (P1)** — *Is this problem real? What's the evidence, and how big is the opportunity?*
  No statement passes on zero evidence unless explicitly tagged as an assumption.
- **Reconciliation Gate (P4)** — *Where does our system model diverge from how users think — and how is each divergence resolved?*
- **Selection Gate (P6)** — *Did we weigh 2–3 genuine alternatives against both user and business value?*
- **Edge/Ethics/Equity Gate (P7)** — *Have we designed the empty / loading / error / permission-denied / at-scale states? Checked for dark patterns, equity issues, and privacy exposure?*
- **Learning Gate (P8)** — *How will we know if this worked? Is a usability test plan in place?*

---

## What you walk away with

Every dash produces five portable deliverables:

1. **`library/objects/*.md`** — Object guides that accumulate across dashes. One authoritative source of truth per domain object.
2. **`dashes/{slug}/requirements.md`** — Complete, robust product requirements: context, goals/non-goals, users, objects, flows, page requirements, states, acceptance criteria, open questions.
3. **`dashes/{slug}/wireframe.html`** — Monochrome, design-system-agnostic wireframes with annotated interaction patterns.
4. **`dashes/{slug}/summary.html`** — A self-contained HTML plan: problem, goals, key decisions, full requirements, object-guide cards, flow diagram, embedded wireframes. Opens in any browser with no server needed.
5. **Evidence trail** — `scope.md`, `flow.md`, `assumptions.md`, `metrics.md`, `glossary.md`.

---

## Get started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/design-dash.git
cd design-dash

# 2. Install skills (symlinks into ~/.cursor/skills/ and ~/.claude/skills/)
./install.sh

# 3. Open Cursor or Claude Code and start a dash
# Type: /design-dash
```

**Options:**

```bash
./install.sh --cursor       # Cursor only
./install.sh --claude       # Claude Code only
./install.sh --dry-run      # Preview without making changes
./install.sh --uninstall    # Remove all symlinks from this repo
./install.sh --update       # Idempotent re-link (add new, remove stale)
```

After install, a single edit to any `skills/**/SKILL.md` propagates to both agents via symlink — never fork content.

---

## For contributors & agents

- [`AGENTS.md`](./AGENTS.md) — cross-agent entry point (Cursor + Claude Code parity, stage map, skill reference).
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to add, port, or improve skills.
- [`commands/README.md`](./commands/README.md) — all `/` slash commands and what they do.
- [`rules/README.md`](./rules/README.md) — `.mdc` rules and when each applies.

Skills are organized by workflow stage under `skills/` (`0-orchestration` through `7-critique-testing`, plus `_cross-cutting`), with shared `rules/`, `commands/`, `templates/`, and a local object library at `library/objects/`.
