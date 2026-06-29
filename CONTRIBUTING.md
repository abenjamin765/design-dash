# Contributing to Design Dash

Thanks for helping build Design Dash! This is an open-source, business-agnostic
UX workflow made of composable skills. Contributions of new skills, templates,
rules, and fixes are all welcome.

## Repo layout

- `skills/` — the workflow's skills, grouped by stage (`0-orchestration`,
  `1-intake`, `2-research`, `3-object-modeling`, `4-synthesis-ia`,
  `5-wireframing`, `7-critique-testing`, `_cross-cutting`).
- `commands/` — slash commands that invoke skills (e.g. `/design-dash`).
- `rules/` — agent rules (`.mdc`) that provide persistent guidance.
- `templates/` — reusable artifact templates (requirements, summaries, etc.).
- `library/objects/` — a local, accumulating library of object guides.
- `dashes/` — per-dash outputs; each run writes to `dashes/{slug}/`.
- `tools/` — supporting scripts (installer helpers, build tooling).

## How skills are structured

Each skill lives in its own folder and contains a `SKILL.md` file. Every
`SKILL.md` begins with YAML frontmatter:

```yaml
---
name: my-skill-name
description: One or two sentences on what this skill does and when to use it.
stage: 3-object-modeling
version: 0.1.0
---
```

The body of `SKILL.md` holds the instructions the agent follows. Keep it focused
on a single, well-scoped job.

## Stay business-agnostic

This is the most important rule. A skill, template, or rule must work for **any**
team or product. That means:

- No hardcoded user or machine paths (e.g. `/Users/you/...`). Use relative,
  repo-local paths.
- No company, product, or team names.
- No proprietary design systems — give generic component hints instead.
- No specific compliance regimes (name the general concern, e.g. "regulated
  personal data," not a particular law or framework).

If you need an example, invent a neutral, generic domain (e.g. a to-do app, a
bookstore, a fitness tracker).

## Adding a skill

1. Create a folder under the appropriate `skills/<stage>/` directory.
2. Add a `SKILL.md` with the frontmatter shown above and your instructions.
3. Reference any templates from `templates/` rather than inlining large blocks.
4. Re-read your skill and confirm it contains nothing business-specific.

## Installing

Run the installer from the repo root to link the skills into your agent:

```bash
./install.sh
```

(`install.sh` is added in a later phase.) Use `./install.sh --dry-run` to preview
what would be installed without changing anything.

## Opening a pull request

1. Fork the repo and create a branch.
2. Make your change and keep it business-agnostic.
3. Open a PR with a clear description of what the skill/template does and when to
   use it.
4. A maintainer will review. Friendly, focused PRs get merged fastest — thanks!
