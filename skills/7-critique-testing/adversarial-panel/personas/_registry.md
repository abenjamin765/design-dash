---
version: "0.1.0"
updated: "2026-06-29"
purpose: >
  Single source of truth for the adversarial panel roster, tiers, and the casting trigger matrix.
  The orchestrator (SKILL.md) reads this file at Phase 1 Intake to determine the default roster.
  To add a persona: create personas/<slug>.md following _persona-template.md, then add one row here.
---

# Adversarial Panel — Persona Registry

## Roster

| Slug | Name | Title | Tier | File |
|---|---|---|---|---|
| `sophia` | Sophia | OOUX/ORCA Facilitator | always-on | `personas/sophia.md` |
| `pat` | Pat | UX Designer | always-on | `personas/pat.md` |
| `sage` | Sage | Synthesizer | always-on | `personas/sage.md` |
| `mira` | Mira | Visual Designer | contextual | `personas/mira.md` |
| `dev` | Dev | Full-Stack Developer | contextual | `personas/dev.md` |
| `ace` | Ace | Accessibility Expert | contextual | `personas/ace.md` |
| `nora` | Nora | Beginner Advocate | contextual | `personas/nora.md` |
| `prompt-pro` | Prompt Pro | AI/Agent Engineer | contextual | `personas/prompt-pro.md` |
| `power-user` | Power User | Expert Daily User | contextual | `personas/power-user.md` |
| `newcomer` | Newcomer | First-Time User | contextual | `personas/newcomer.md` |
| `skeptic` | Skeptic | Reluctant User | contextual | `personas/skeptic.md` |
| `accessibility-user` | Accessibility User | Assistive Technology User | contextual | `personas/accessibility-user.md` |
| `mobile-user` | Mobile User | Mobile / Low-Bandwidth User | contextual | `personas/mobile-user.md` |

**Hard cap:** 7 arguing voices + Sage. If casting exceeds 7 arguing personas, the casting director
proposes which to drop (lowest-signal first) and **waits for user confirmation** before proceeding.

---

## Casting trigger matrix

Casting is **hybrid**: this matrix runs first (deterministic baseline), then an LLM casting-director
pass may propose additional personas with rationale. The matrix is the floor — the director can add
but must not silently drop a matrix-triggered persona.

| Signal source | Signal value | Cast persona(s) |
|---|---|---|
| Artifact type | wireframe / visual artifact | `mira` |
| Artifact type | prototype HTML / shipping UI | `ace`, `dev` |
| Artifact type | skill / rule / command file | `prompt-pro` |
| Artifact type | OOUX artifact (NOM, CTA matrix, Object Guide) | `sophia` weighted up |
| ORCA layer | Relationships / CTAs heavy | `sophia` weighted up, `pat` |
| Audience flag | power user / expert daily user | `power-user` |
| Audience flag | new user / first-time user / onboarding | `newcomer` |
| Audience flag | reluctant user / low-adoption risk | `skeptic` |
| Scope flag | `audience:beginner` or `ooux_new_audience:yes` | `nora` weighted up |
| Scope flag | `accessibility:true` or `wcag_required:true` | `ace`, `accessibility-user` |
| Scope flag | `mobile:true` or `low_bandwidth:true` | `mobile-user` |
| Scope flag | `regulated_data:true` or `privacy_sensitive:true` | `dev` (triggers privacy-gate) |
| Workflow stage | intake / research (early) | bias toward generative voices, lighter stance |
| Workflow stage | build / pre-test (late) | bias toward gatekeeping voices, harder stance |

---

## Casting rules

1. **Always-on core fires first:** Sophia, Pat, Sage are always cast.
2. **Matrix triggers next:** every signal present in `dashes/{slug}/scope.md` or the artifact fires the matching row.
3. **Director pass:** LLM casting director may propose additions with rationale. Must not silently drop matrix-triggered personas.
4. **Hard cap check:** if the roster exceeds 7 arguing voices, the director proposes drops (lowest signal first) and **waits for user confirmation**.
5. **User override:** the designer may add or remove any persona at Phase 1 Intake. Record all overrides.
6. **Emit casting rationale** before opening statements: "Cast Ace + Dev because artifact is a prototype HTML; cast Newcomer because scope flags audience as first-time users; director adds Skeptic — low-adoption risk present."
7. **WAIT FOR USER** to confirm the roster before proceeding to Phase 2.

---

## Stance dial (panel-level default + per-persona override)

| Stance | When to use | Effect |
|---|---|---|
| `gentle` | Early exploration, generative stages (P1–P3) | Fewer attacks; emphasize Defends; open-ended questions |
| `standard` | Mid-design, pre-critique (P4–P5) | Balanced defend/attack; challenge warranted concerns |
| `ruthless` | Pre-ship, gatekeeping, compliance review | Maximum challenge intensity; demand evidence for every defend |

Default: `standard`. Override at both levels: panel-level default + optional per-persona override
(e.g., keep panel `standard` but set Ace `ruthless` for a final a11y gate).

Stage-aware modulation: Generative early stages auto-bias toward `gentle`; late/pre-test stages auto-bias toward `ruthless` — unless the designer overrides.

---

## Tension map (Phase 3 contested-points driver)

The `tensions` field in each persona's frontmatter pre-declares their natural debate opponents.
Phase 3 picks the 3 most contested points by cross-referencing these pairs against the opening statements.

| Persona | Natural tensions | Archetype conflict |
|---|---|---|
| `sophia` ↔ `nora` | Methodological rigor vs approachability | Process completeness vs first-10-minutes experience |
| `pat` ↔ `sophia` | Shipping reality vs ORCA process completeness | Behavioral truth vs methodological sequence |
| `dev` ↔ `mira` | Implementation simplicity vs visual richness | Shippability vs aesthetic ambition |
| `ace` ↔ `mira` | Semantic structure vs visual creativity | Conformance floor vs expressive freedom |
| `prompt-pro` ↔ `sophia` | Token economy vs ORCA thoroughness | Concision vs methodological completeness |
| `nora` ↔ anyone | Plain language vs domain vocabulary | Accessibility vs precision |
| `power-user` ↔ `newcomer` | Feature depth vs onboarding clarity | Expert efficiency vs beginner approachability |
| `skeptic` ↔ `pat` | Value proposition vs user flow | Trust / motivation vs experience design |
| `accessibility-user` ↔ `dev` | Assistive tech support vs implementation cost | Real-world a11y vs engineering constraints |
| `mobile-user` ↔ `mira` | Mobile constraints vs visual richness | Performance / touch vs aesthetic ambition |

---

## Adding a persona

1. Copy `_persona-template.md` → `personas/<slug>.md`
2. Fill all frontmatter fields (slug, name, title, tier, triggers, expertise_sources, default_stance, tensions)
3. Write all sections: Background · Mandate · Defends · Attacks · Signature questions · Voice & lexicon · Debate moves
4. Add one row to the Roster table above
5. Add trigger rows to the Casting trigger matrix if the persona has novel signals
6. Add to the Tension map if the persona has natural opponents
7. Run `skills/_cross-cutting/artifact-validator` to lint the persona schema
