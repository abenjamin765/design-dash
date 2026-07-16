# Adapters

Adapters make the Design Dash method usable in different tools and environments. They translate mechanics; [`method/method.yaml`](../method/method.yaml) remains the contract.

## Conformance requirements

A conforming adapter must:

1. preserve P0–P8 ordering and named gates;
2. derive rigor from the tier rules rather than user preference;
3. retain evidence labels and an assumption register;
4. preserve accessibility, ethics/equity, privacy, and edge-state checks;
5. produce equivalent portable artifacts;
6. disclose unavailable capabilities and apply the documented fallback;
7. distinguish real cross-functional review from simulated critique.

Adapters may provide slash commands, IDE rules, templates, automations, or workshop scripts. Each adapter should document setup, start/resume commands, required capabilities, fallbacks, and its conformance version.

## Available paths

- Cursor and Claude Code: use `install.sh` and the existing skills.
- Generic file-capable AI agent: use [`generic/AGENT_PROMPT.md`](./generic/AGENT_PROMPT.md).
- No terminal or no agent: follow the manual path in [`GETTING_STARTED.md`](../GETTING_STARTED.md).
