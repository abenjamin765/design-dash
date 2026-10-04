<!-- logo -->

# Design Dash

[![License: MIT](https://img.shields.io/github/license/abenjamin765/design-dash)](https://github.com/abenjamin765/design-dash/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/abenjamin765/design-dash)](https://github.com/abenjamin765/design-dash/stargazers)

**Take a fuzzy problem all the way to a complete, ready-to-build product plan** — with research, cross-functional input, and ethics/equity checks built into the path, not bolted on after.

Design Dash is an open-source, AI-facilitated UX workflow you can clone and run today, for any product domain. You bring a problem; it walks you through nine phases (intake → plan), enforcing quality gates so what you produce is grounded in evidence and matches how your users actually think.

> **For designers.** This is your starting point. The machine/agent entry point is [`AGENTS.md`](./AGENTS.md). Contributor info is in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

The explainer site is live at [https://abenjamin765.github.io/design-dash/](https://abenjamin765.github.io/design-dash/).

**Try it:**

1. **ChatGPT** — open the [Design Dash skill](https://chatgpt.com/skills?skill_id=6a58fb9320e88191831d6bd6d77835d0) and describe the problem in plain language.
2. **Cursor or Claude Code** — clone this repo and run `./install.sh`, then start with `/design-dash`.
3. **Any other setup** — follow the tool-neutral [`Getting Started guide`](./GETTING_STARTED.md).

You can run a dash in a general AI chat, Cursor, Claude Code, another file-capable agent, or a human-facilitated workshop. The portable method contract lives in [`method/method.yaml`](./method/method.yaml). A small finished example is the synthetic Express dash in [`examples/reading-list/`](./examples/reading-list/).

---

## When to run a dash

Run a dash when the work has **real stakes or real uncertainty** — a new workflow, an unclear problem, anything where assumptions could sink a build. For a one-off copy tweak or a throwaway sketch, you don't need the full machinery (that's what the **Express** tier is for).

## You don't pick your rigor — the work does

Tier is **rule-derived**, not designer-chosen. The risk, reversibility, and reach of what you're building determine how many gates are mandatory. This is deliberate: it stops you from "tier-shopping" your way out of doing the evidence work.

| Tier | When it applies | What's mandatory | Cross-functional voices |
|---|---|---|---|
| **Express** | Low risk · easily reversible · narrow reach (one role, small cohort). Never grading, payment, PII, or compliance. | Ethics/equity floor only. Skipped gates become tracked **evidence debt** — deferred, never deleted. | Panel may *simulate* all disciplines |
| **Standard** | Moderate risk · reversible with effort · a real workflow with bounded blast radius (>1 role or meaningful user count). | **Evidence · Reconciliation · Selection · Ethics · Learning** (Selection when concepts compete; Learning when it ships — both required by the machine contract for Standard). | **Real** sign-off from each *Responsible* discipline |
| **High-stakes** | Hard/irreversible · broad reach · **or** touches regulated personal data, financial data, or user safety. | **All five gates.** None waivable. | **Real** sign-off required; simulation never sufficient |

> Any feature touching regulated personal data (PII, financial, health, minors) forces **High-stakes** and adds a **Privacy & Compliance gate** with appropriate legal/privacy sign-off.

---

## How it works — the nine phases

| Phase | What you do | What comes out |
|---|---|---|
| **P0 · Preconditions** | Classify tier; set session mode; confirm research access | A dash you can actually run (`dash-config.yaml`) |
| **P1 · Opportunity & Evidence** | Write a falsifiable problem statement; size the opportunity; log assumptions | `assumptions.md` · success-metric hypotheses |
| **P2 · Intake & Object Modeling** | Dual mental models + ORCA; write object guides to `library/objects/` | `scope.md` · NOM · CTA Matrix · Object Guides |
| **P3 · Framing lock** | Scope the design surface — provisionally, tied to the assumption register | `design-spec.md` §1–3 |
| **P4 · Flow & Reconciliation** | Derive scenario flows + page architecture; reconcile system ↔ mental model | `flow.md` · page list · resolved divergences |
| **P5 · Divergence & Selection** | Generate 2–3 real concepts; score on user + business value | A defended concept choice |
| **P6 · Wireframe & Ethics** | Wireframe; cover edge states; ethics, equity, a11y | `wireframe.html` · ethics review |
| **P7 · Optional Build** | Coded prototype when a workspace is configured; otherwise stub note | Prototype page or `p7-build-note.md` |
| **P8 · Validate & Learn** | Research plan → pitch site → Learning gate | `pitch/index.html` · `research-plan.md` · plan artifacts |

---

## The gates — questions you have to answer

Gates aren't bureaucracy. Each one forces "is this real, or is it assumed?"

- **Evidence Gate (P1)** — *Is this problem real? What's the evidence, and how big is the opportunity?*
  No statement passes on zero evidence unless explicitly tagged as an assumption.
- **Reconciliation Gate (P4)** — *Where does our system model diverge from how users think — and how is each divergence resolved?*
- **Selection Gate (P5)** — *Did we weigh 2–3 genuine alternatives against both user and business value?*
- **Ethics Gate (P6)** — *Have we designed the empty / loading / error / permission-denied / at-scale states? Checked for dark patterns, equity issues, and privacy exposure?*
- **Learning Gate (P8)** — *How will we know if this worked? Is a usability test plan in place?*

---

## What you walk away with

Every dash produces five portable deliverables:

1. **`library/objects/*.md`** — Object guides that accumulate across dashes. One authoritative source of truth per domain object.
2. **`dashes/{slug}/pitch/index.html`** — Stakeholder pitch site (primary walk-away deliverable).
3. **`dashes/{slug}/requirements.md`** — Complete product requirements: context, goals/non-goals, users, objects, flows, states, acceptance criteria, open questions.
4. **`dashes/{slug}/wireframe.html`** — Monochrome, design-system-agnostic wireframes with annotated interaction patterns.
5. **Evidence trail** — `scope.md`, `flow.md`, `assumptions.md`, `metrics.md`, `glossary.md`, optional thin `summary.html` index.

---

## Get started

### No terminal required

Open [`GETTING_STARTED.md`](./GETTING_STARTED.md), choose the general-assistant path, and paste the [`generic agent prompt`](./adapters/generic/AGENT_PROMPT.md) into your tool. Missing capabilities have explicit fallbacks, and the outputs stay in portable Markdown, YAML, and HTML.

### Cursor or Claude Code

```bash
# 1. Clone the repo
git clone https://github.com/abenjamin765/design-dash.git
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

## Related projects

- [Many Hats](https://github.com/abenjamin765/many-hats) — a cloneable AI product team that retains Design Dash OOUX/ORCA methods as skill references

---

## For contributors & agents

- [`AGENTS.md`](./AGENTS.md) — cross-agent entry point (Cursor + Claude Code parity, stage map, skill reference).
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to add, port, or improve skills.
- [`method/`](./method/) — tool-neutral phases, gates, outputs, and capability fallbacks.
- [`adapters/`](./adapters/) — conformance rules and tool-specific starting paths.
- [`GETTING_STARTED.md`](./GETTING_STARTED.md) — accessible setup for terminal and no-terminal environments.
- [`examples/reading-list/`](./examples/reading-list/) — the canonical synthetic Express example. [`examples/README.md`](./examples/README.md) is the quality bar for future examples.
- [`landing-page/`](./landing-page/) — source and editorial illustrations for the public explainer site.
- [`commands/README.md`](./commands/README.md) — all `/` slash commands and what they do.
- [`rules/README.md`](./rules/README.md) — `.mdc` rules and when each applies.

Skills are organized by workflow stage under `skills/` (`0-orchestration` through `7-critique-testing`, plus `_cross-cutting`), with shared `rules/`, `commands/`, `templates/`, and a local object library at `library/objects/`.
