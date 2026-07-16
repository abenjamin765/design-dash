# Get started with Design Dash

You do not need a particular editor, command line, or design tool. Choose the path that matches your environment; every path follows the same method and produces the same core artifacts.

## Path 1 — Chat or general AI assistant

1. Download this repository or attach [`method/method.yaml`](./method/method.yaml) with the templates you need.
2. Paste [`adapters/generic/AGENT_PROMPT.md`](./adapters/generic/AGENT_PROMPT.md) into your assistant.
3. Describe the problem and answer the P0 questions.
4. Save each output into a `dashes/{slug}/` folder as the dash progresses.

If the assistant cannot write files, ask it to maintain one clearly sectioned Markdown response per artifact, then copy those sections into files.

## Path 2 — Cursor or Claude Code

```bash
git clone https://github.com/abenjamin765/design-dash.git
cd design-dash
./install.sh
```

Start with `/design-dash`. Use `--cursor`, `--claude`, or `--dry-run` to narrow or preview installation.

## Path 3 — Another file-capable agent or IDE

Give the agent access to the repository, point it to `AGENTS.md`, and use the generic agent prompt. The adapter conformance rules explain what may and may not change.

## Path 4 — Human-facilitated workshop

Read [`method/method.yaml`](./method/method.yaml) phase by phase. Assign a facilitator and a note-taker, use the templates as worksheets, and schedule the people required for real sign-off. AI critique may broaden the conversation but does not replace accountable reviewers.

## Before you begin

Have these ready if possible:

- a one-sentence description of the problem;
- intended users and affected roles;
- links, notes, or data that support the problem;
- known legal, privacy, safety, accessibility, and technical constraints;
- names or disciplines available to review consequential decisions.

Missing information does not prevent a start. It becomes a labeled assumption or evidence debt with an owner and validation path.
