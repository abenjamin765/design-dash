# /design-dash

Loads `skills/0-orchestration/design-dash/SKILL.md` and runs the full nine-phase Design Dash workflow (P0–P8).

Resolve the skill from (first match wins):

1. `.claude/skills/design-dash/SKILL.md` (project)
2. `~/.claude/skills/design-dash/SKILL.md` (Claude Code global)
3. `~/.cursor/skills/design-dash/SKILL.md` (Cursor)
4. `skills/0-orchestration/design-dash/SKILL.md` (this repo)

**Walk-away deliverable**: a stakeholder **pitch site** at `dashes/{slug}/pitch/index.html`, plus wireframe, optional build/stub note, workshop summary, and thin `summary.html` index.

**Artifact root**: `dashes/{slug}/` (override via `artifact_root` in `dash-config.yaml`).

## Usage

```
/design-dash
/design-dash --solo
/design-dash --phase P6
/design-dash --tier standard
```

## Flags

| Flag | Description |
|---|---|
| *(none)* | Start a new dash from P0 in **interactive** mode |
| `--solo` / `--auto` | Continuous session — wait only at phase boundaries + hard gates; log auto-confirms to `dashes/{slug}/auto-confirms.md` |
| `--phase {P0–P8}` | Resume at that phase. Skip tier classifier if `dash_tier` already recorded |
| `--tier {express\|standard\|high-stakes}` | Escalate tier only — cannot downgrade a rule-derived minimum |

## Default behavior (no flags)

1. Begin at **P0 — Preconditions + Tier Classification**.
2. Set `session-mode: interactive` (unless `--solo` / `--auto`).
3. Run the tier classifier. Record tier in `dashes/{slug}/dash-config.yaml`.
4. **Solo + High-stakes → halt at P0** (write only `dash-config.yaml` with `halted-at: P0`).
5. Continue through P1–P8. Interactive: wait at every `WAIT FOR USER`. Solo: wait at phase boundaries and hard gates only.
6. If Express: follow the Express-light minimum artifact table in the skill.

## Resume (`--phase`)

Before resuming, verify:

- `dashes/{slug}/dash-config.yaml` exists (or prompt for the slug).
- `tier` is already recorded; skip the tier classifier.
- Announce: "Resuming Design Dash at **P{N} — {phase name}**. Tier: {tier}. Mode: {session-mode}. Mandatory gates remaining: {list}."

## Behavior notes

- Machine contract: `apps/dash-living-plan/contract/dash-contract.mjs` and `method/method.yaml`.
- Living-plan CLI (when Node is available): `node apps/dash-living-plan/cli.mjs` with `--dir dashes/{slug}`. Soft-fail the viewer — never block the dash.
- The orchestrator does not commit, push, or open PRs.
- `/explain {term}` and "where am I" handlers are always available.
- At every phase boundary emit progress + Where am I (artifact status).

## Related commands

- `/pitch-site` — regenerate the stakeholder pitch site
- `/orca-start` — lighter intake-only entry point
- `/orca-workshop` — facilitation kit for live workshops
- `/wireframe` — jump directly to wireframing
