# /design-dash

Loads `skills/0-orchestration/design-dash/SKILL.md` and runs the full nine-phase Design Dash workflow (P0–P8).

## Usage

```
/design-dash
/design-dash --phase 4
/design-dash --tier standard
```

## Flags

| Flag | Description |
|---|---|
| *(none)* | Start a new dash from P0 |
| `--phase {N}` | Resume at phase N (0–8). Use when continuing an in-progress dash. |
| `--tier {tier}` | Override tier to `express`, `standard`, or `high-stakes`. Escalation only — you cannot downgrade a tier derived by the rules. |

## What it does

1. Loads the orchestrator at `skills/0-orchestration/design-dash/SKILL.md`
2. Runs phases P0–P8 in sequence, enforcing mandatory gates at each transition
3. Writes outputs to `dashes/{slug}/` (scope.md, flow.md, assumptions.md, metrics.md, requirements.md, wireframe.html, summary.html)
4. Object guides written to `library/objects/` accumulate across dashes

## Related commands

- `/orca-start` — lighter intake-only entry point
- `/orca-workshop` — facilitation kit for live workshops
- `/wireframe` — jump directly to wireframing
