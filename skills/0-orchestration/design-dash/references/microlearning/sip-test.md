# SIP Test — Designer Cheat-Sheet

> Loaded by `/explain sip-test` or at P4.1 first surface.

---

## What SIP is

SIP is the three-part test that validates whether a noun qualifies as a **system object**. Every candidate noun must pass all three to be included in the object library.

| Letter | Question | Passes when… |
|---|---|---|
| **S — Structure** | Does it have its own attributes? Could you design a detail page? | You can name 3+ attributes that belong to it, not to something else |
| **I — Instances** | Can you name multiple specific examples? | You can list 2+ real instances without ambiguity |
| **P — Purpose** | Do users care about this thing for its own sake? | Users seek it out, act on it directly, or it has clear business value |

All three must pass. A single failure disqualifies the noun as a standalone object — it's likely an attribute, a CTA, or too vague.

---

## Quick decision guide

```
Is this noun a person, place, thing, or concept?
  └─ No → Not an object
  └─ Yes →
      S: Can you list 3+ attributes that belong to IT (not its parent)?
        └─ No → Probably an attribute of something else
        └─ Yes →
            I: Can you name 2+ distinct examples?
              └─ No → Probably too abstract or a singleton
              └─ Yes →
                  P: Do users seek it out or act on it directly?
                    └─ No → Probably a system internal or implementation detail
                    └─ Yes → ✅ OBJECT
```

---

## Common failures and reclassifications

| Candidate noun | Failure | Reclassified as |
|---|---|---|
| "Title" | S fails — just a text field on something else | Attribute of RESOURCE, PRODUCT, etc. |
| "The Homepage" | I fails — one thing, not many | Singleton page, not an object |
| "Content" | P fails — too vague; no clear user intent | Split into specific objects (ARTICLE, REPORT, FILE) |
| "Registration" | S and P fail — action, not a thing | CTA: Enroll / Sign Up |
| "First Name" | S fails — attribute of a PERSON object | Attribute |

---

## SIP in the Object Guide

SIP validation appears in the Object Guide as a three-row table at the top of every guide:

```
| Criterion | Evidence |
|---|---|
| Structure | Name, Status, Created Date, Owner, Description |
| Instances | Invoice #1001, Invoice #1002, Invoice #1003 |
| Purpose | Users create, review, and approve invoices as part of the payment workflow |
```

---

## When to re-run SIP

- During **Object Discovery** (P4.1) — validate every candidate noun before adding it to the object directory
- During **Attribute Discovery** — if an attribute feels too rich, run SIP on it; it may be a hidden object
- When a design decision hinges on whether something is an object or an attribute — the answer changes the entire page structure

---

*See also: `noun-foraging.md` · `ooux-object-thinking` skill · `01-object-discovery` skill*
