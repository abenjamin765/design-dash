---
id: screen-tasting-notes
type: screen
name: Tasting notes
status: wireframe_draft
links:
  - to: decision-starter-box-curation
    type: JUSTIFIED_BY
provenance:
  source_dash: sample-dash
  extracted_at: 2026-08-24T09:00:00Z
  confidence: assumed
---

# Tasting notes

Low-fi wireframe for the monthly tasting box of Concept B — one curated flight of three coffees with guided tasting notes and a rating step that feeds future curation.

*(Sample fixture for the Workshop demo. The `JUSTIFIED_BY` target is illustrative — a real dash would resolve it to a `decision-*` node in this same model.)*

## Wireframe

```
┌──────────────────────────────────────────────┐
│  August tasting box          [Profile] [Cart]│
├──────────────────────────────────────────────┤
│  ┌ №1 Kenya ▲▁▁ ┐ ┌ №2 Guatemala ┐ ┌ №3 … ┐  │
│  │ blackcurrant │ │ cocoa, orange│ │       │  │
│  │ [Taste me →] │ │              │ │       │  │
│  └──────────────┘ └──────────────┘ └───────┘  │
├──────────────────────────────────────────────┤
│  Rate what you tried — it tunes next month   │
│  №1 ☆☆☆☆☆   №2 ☆☆☆☆☆                         │
│                                              │
│  [ Save ratings ]         [ Reorder box ]    │
└──────────────────────────────────────────────┘
```

## Notes

- Ratings are optional but gate the "your box is tuned" milestone.
- Edge state: month with fewer than three coffees in stock shows two + a postcard.
