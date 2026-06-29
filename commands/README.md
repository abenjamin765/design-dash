# Commands

Slash commands for the Design Dash workflow. Each command loads its corresponding skill.

| Command | Skill loaded | Description |
|---|---|---|
| `/design-dash` | `skills/0-orchestration/design-dash/SKILL.md` | Run the full nine-phase Design Dash (P0–P8). Supports `--phase {N}` to resume, `--tier {tier}` to escalate. |
| `/orca-start` | `skills/1-intake/orca-planner/SKILL.md` | Build a sequenced ORCA workflow plan for your project. |
| `/orca-workshop` | `skills/0-orchestration/facilitation-kit/SKILL.md` | Generate workshop agendas, pre-reads, and facilitation guides for live ORCA sessions. |
| `/orca-panel` | `skills/7-critique-testing/adversarial-panel/SKILL.md` | Convene an adversarial expert panel to challenge a design or artifact; outputs a Decision Memo. |
| `/orca-synthesize` | `skills/2-research/ux-research-synthesizer/SKILL.md` | Synthesize UX research data using ORCA-aligned coding; produces artifact update recommendations. |
| `/orca-research-plan` | `skills/2-research/ux-research-planner/SKILL.md` | Plan a UX research study (interviews, usability tests, surveys, card sorts) aligned to ORCA phases. |
| `/orca-teach` | `skills/3-object-modeling/ooux-primer/SKILL.md` | Learn OOUX/ORCA concepts interactively, tailored to your role and experience level. |
| `/wireframe` | `skills/5-wireframing/SKILL.md` | Generate monochrome wireframes from OOUX artifacts; outputs `wireframe.html`. |

## How commands work

Each `.md` file here is a slash command definition. When you type the command in Cursor or Claude Code, the agent loads the referenced skill file and follows its instructions.

Commands are thin wrappers — all the logic lives in the skill. If you want to understand or customize what a command does, read the corresponding `SKILL.md`.
