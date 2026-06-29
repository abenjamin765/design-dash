# Prioritization Cuts — Designer Cheat-Sheet

> Loaded by `/explain prioritization-cuts` or at P4 CTA placement on demand.

---

## What prioritization cuts are

Prioritization cuts are the scope-reduction decisions made during the Prioritization Round that determine which objects, relationships, CTAs, and attributes are included in Phase 1 (MVP) vs. deferred to later phases or sent back to research.

The book calls this "killing your darlings strategically." The key insight: **cutting has a ripple effect**. When an object is deferred, all of its nested objects, CTAs, and attributes are automatically deferred too — creating a cascading reduction in scope that makes Phase 1 smaller and more deliverable.

---

## The four cutting decisions

### Object cuts
*Reduces the most scope — the biggest lever.*

Ask before keeping an object in Phase 1:
- Will the core user experience break without this object? (If yes → keep)
- Is there a compelling business reason to include this in Phase 1? (If no → defer)
- Does any other Phase 1 object depend on this one? (Check MCSFD Dependency column)

When you cut an object: all of its nesties, CTAs, and attributes are automatically deferred. Mark them Phase 2 in the Object Guide.

### Relationship (nestie) cuts
*Reduces navigation complexity.*

Ask before keeping a nested relationship:
- Is this nestie required to complete the Primary CTA of the parent object?
- Can the user accomplish their main goal on the parent without seeing this nestie?
- Who else depends on this relationship being surfaced in Phase 1?

### CTA cuts
*Reduces interaction surface.*

Ask before keeping a CTA:
- Is this action critical to the Phase 1 user journey?
- Would removing it create a Broken Object? (If yes → do not cut)
- P-ranked CTAs almost never get cut — they define the object's primary purpose

### Attribute cuts
*The most granular lever; often the most contested.*

Ask before keeping an attribute:
- Will cutting it make instances indistinguishable? (If yes → keep)
- Where do values come from — is that source available in Phase 1?
- Who authors the values — does that role or system exist in Phase 1?
- Is this core content (what the object IS) or metadata (how it's classified)? Core content is harder to cut.

---

## Phase tagging convention

Mark every ORCA element with a Phase column in its table:

| Value | Meaning |
|---|---|
| **1** | Must ship in Phase 1 (MVP) |
| **2** | Planned for Phase 2 |
| **Res** | Needs research before committing to any phase |
| **Cut** | Explicitly removed from scope |

---

## The domino rule

> Cutting an object = cutting all of its nesties + CTAs + attributes.

This is the power move. Use it when a stakeholder wants to reduce scope but can't decide what to cut. Show them the object-level cut and the full cascade. Make scope decisions visible and concrete.

---

## Cuts vs. assumptions

Every cut is an assumption: "We assume users can complete their Phase 1 jobs without [deferred element]." Log every cut in `dashes/{slug}/assumptions.md` with classification **assumed** — it should be tested or validated before Phase 2 scope is committed.

---

*See also: `pstq-ranking.md` · `mcsfd.md` · `nom.md` · `evidence-and-assumptions` skill*
