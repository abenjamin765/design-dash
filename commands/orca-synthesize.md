# /orca-synthesize

Loads `skills/2-research/ux-research-synthesizer/SKILL.md`.

Analyzes UX research data (session notes, interview transcripts, usability recordings, survey results) using ORCA-aligned coding and produces artifact update recommendations.

## Usage

```
/orca-synthesize
```

## What it does

1. Loads `skills/2-research/ux-research-synthesizer/SKILL.md`
2. Accepts raw research data in any format — paste, upload, or point to files
3. Codes findings using the ORCA scheme (O1-O5, R1-R5, C1-C5, A1-A6) with severity ratings
4. Produces a synthesis report with ranked findings and OOUX artifact update recommendations

Outputs to `dashes/{slug}/research/YYYY-MM-DD-{slug}-synthesis.md`.

## Related commands

- `/orca-research-plan` — plan the study before conducting it
- `/design-dash` — full orchestrated dash
