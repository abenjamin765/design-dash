# /wireframe

Loads `skills/5-wireframing/SKILL.md`.

Produces monochrome, design-system-agnostic wireframes from OOUX artifacts (page list, object cards, CTA placement, nav flow). Annotates interaction patterns using the `ui-interaction` skill.

## Usage

```
/wireframe
```

## What it does

1. Loads `skills/5-wireframing/SKILL.md`
2. Reads available OOUX artifacts (object guides, CTA matrix, nav flow, scenario flows) from the current dash
3. Generates wireframes per page/screen: layout, object cards, CTAs, navigation, edge states
4. Annotates with interaction pattern notes (via `_cross-cutting/ui-interaction`)
5. Outputs `dashes/{slug}/wireframe.html` — a self-contained HTML wireframe document

## Related commands

- `/design-dash` — full orchestrated dash (includes wireframing at P7)
- `/orca-panel` — adversarial critique of wireframes
