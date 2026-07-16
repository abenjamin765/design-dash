# Design Dash method

This directory is the tool-neutral source of truth for Design Dash. It describes the work, decisions, gates, and outputs without assuming a particular AI agent, editor, operating system, or design tool.

- [`method.yaml`](./method.yaml) is the machine-readable phase and gate contract.
- [`../GETTING_STARTED.md`](../GETTING_STARTED.md) helps people choose a way to run it.
- [`../adapters/`](../adapters/) translates the contract into tool-specific instructions.

An adapter may change commands, prompts, and file-handling mechanics. It must not weaken tier rules, evidence labels, mandatory gates, accessibility checks, privacy requirements, or the final artifact contract.

## Portable artifact contract

Every completed dash should leave a readable project folder containing:

- `scope.md`, `assumptions.md`, `metrics.md`, `glossary.md`
- object-modeling artifacts and object guides
- `flow.md`, page architecture, and concept rationale
- `wireframe.html` with edge-state annotations
- accessibility, ethics/equity, and privacy findings appropriate to the tier
- `requirements.md` and `summary.html`

Markdown, YAML, and self-contained HTML are deliberate defaults: designers can inspect, edit, share, and archive the work without proprietary software.
