# Kano Model (microlearning)

**Surface at**: P2 quantitative prioritization, first use.

The Kano model classifies every feature by how its **presence** and **absence** affect customer satisfaction. Five levels of answer to a paired question ("If you could X…" / "If you could NOT X…") sort each feature into one of five classes:

| Class | Presence… | Absence… | Example |
|---|---|---|---|
| **Must-Be** | neutral feeling | fury | A door that opens |
| **Performance** | delight grows linearly | dissatisfaction grows linearly | Battery life |
| **Attractive** | unexpected delight | nobody minds | Free upgrade surprise |
| **Indifferent** | no effect | no effect | Font choice on a receipt |
| **Reverse** | annoyance | relief | Forced onboarding tour |

Why it matters: teams routinely over-invest in Indifferent features (they were someone's pet idea) and under-invest in Must-Be features (invisible until missing). Kano replaces that argument with respondent data.

Two numbers summarize each feature:

- **Better** = how much delight it can add: `(A + O) / (A + O + M + I)`
- **Worse** = how much pain its absence causes: `(O + M) / (A + O + M + I) × −1`

Rules of thumb:

- Below ~30 responses per segment, results are directional only.
- Never average across user roles — polarized needs hide in averages.
- Must-Be features never win awards; they just prevent catastrophe. Ship them first and stop gold-plating them.
- Indifferent features are the honest scope cut. Cutting them is the point.

Related: `prioritization-cuts` (what to trim), `pstq-ranking` (the fast subjective pass that pre-cuts long lists before surveying).
