---
id: screen-weekly-plan
type: screen
name: Weekly plan
status: wireframe_draft
links:
  - to: decision-starter-box-curation
    type: JUSTIFIED_BY
provenance:
  source_dash: sample-dash
  extracted_at: 2026-08-24T09:00:00Z
  confidence: assumed
---

# Weekly plan

Low-fi wireframe for the subscriber's weekly brew schedule — the home surface of Concept A. Each day shows the scheduled coffee; any day can be swapped or skipped without contacting support.

*(Sample fixture for the Workshop demo. The `JUSTIFIED_BY` target is illustrative — a real dash would resolve it to a `decision-*` node in this same model.)*

## Wireframe

```
┌──────────────────────────────────────────────┐
│  Weekly plan            [Roast ▾]   [Cart 2] │
├──────────────────────────────────────────────┤
│  MON ──── ☕ Ethiopia · pour-over      [⇄]  │
│  TUE ──── ☕ Ethiopia · pour-over      [⇄]  │
│  WED ──── ☕ Colombia · espresso       [⇄]  │
│  THU ──── ○ skipped                    [+]  │
│  FRI ──── ☕ Colombia · espresso       [⇄]  │
├──────────────────────────────────────────────┤
│  Next delivery: Thu · 2 bags remaining       │
│                                              │
│  [ Swap any day ]          [ Skip week ]     │
└──────────────────────────────────────────────┘
```

## Notes

- Swap is client-side; no plan recalculation until checkout.
- Edge state: zero bags remaining pins a renewal banner above the list.
