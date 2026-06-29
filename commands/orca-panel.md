# /orca-panel

Loads `skills/7-critique-testing/adversarial-panel/SKILL.md`.

Convenes a multi-perspective expert panel to challenge and defend an OOUX artifact or design decision, then synthesizes a Decision Memo.

## Usage

```
/orca-panel
```

## What it does

1. Loads `skills/7-critique-testing/adversarial-panel/SKILL.md`
2. Assembles a panel of expert personas appropriate to your domain
3. Runs structured adversarial rounds: each voice challenges, the author defends
4. Synthesizes a Decision Memo with unresolved tensions and recommended actions

Outputs to `dashes/{slug}/panel-decision-memo.md`.

## Related commands

- `/design-dash` — full orchestrated dash (includes panel at P7)
- `/orca-workshop` — facilitation kit for live sessions
