# Tools

Build and maintenance scripts for the design-dash repo.

## build-marketplace.mjs

Generates `.claude-plugin/marketplace.json` — the Claude plugin marketplace catalog that lists all available skills.

**Usage:**

```bash
node tools/build-marketplace.mjs
```

**What it does:**

1. If `skills-lock.json` exists at the repo root, reads the manifest of record and derives skill directories from it.
2. Otherwise, walks `skills/` and collects every directory that contains a `SKILL.md` file.
3. Writes the `skills` array into `.claude-plugin/marketplace.json`, preserving all other fields in that file.

**Re-run whenever:**
- You add a new skill directory
- You move or rename a skill
- You delete a skill

This keeps the marketplace catalog in sync with the actual skill tree. The `.claude-plugin/marketplace.json` file is the source of truth for the Claude Code plugin registry.
