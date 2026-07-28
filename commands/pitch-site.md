# Generate a pitch site from a Design Dash workshop

Load the **pitch-site** skill and follow its `SKILL.md`. Resolve from (first match wins): `.claude/skills/pitch-site/SKILL.md`, `~/.claude/skills/pitch-site/SKILL.md`, `~/.cursor/skills/pitch-site/SKILL.md`, or `skills/0-orchestration/pitch-site/SKILL.md` (this repo).

## Default behavior (no flags)

If you are currently running a Design Dash at P8, the `design-dash` orchestrator will invoke this skill automatically. If run standalone:

1. Ask the designer: "What is the slug for the workshop you want to generate a pitch site for?"
2. Read `dashes/{slug}/dash-config.yaml` to confirm the workshop exists.
3. Follow the pitch-site skill from Step 1 (identify the decision) through Step 7 (write and announce).

## Flags

### `--slug <workshop-slug>` — Target a specific workshop

Generate a pitch site for a named existing workshop without asking.

Example: `/pitch-site --slug early-signal-class-health`

### `--dry-run` — Show the narrative spine only

Draft and display the narrative spine, critique checklist assessment, and section outline **without** writing any files. Useful for reviewing the argument before building.

Example: `/pitch-site --dry-run --slug early-signal-class-health`

## Output

- `dashes/{slug}/pitch/index.html` — the standalone pitch site
- `dashes/{slug}/pitch/assets/` — copied brand assets (logo, favicon)

## Behavior notes

- This skill is read-only with respect to the workshop folder — it does not modify `scope.md`, `assumptions.md`, or any other workshop artifact.
- It does not run usability tests, commit files, or open PRs.
- To also update `workshop-summary.md` with a link, the design-dash orchestrator handles that at P8.
- Require a complete `research-plan.md` (or honest Learning Gate debt) before writing the pitch — see the skill prerequisite.
