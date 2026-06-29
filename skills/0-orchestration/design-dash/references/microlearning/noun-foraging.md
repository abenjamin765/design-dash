# Noun Foraging — Designer Cheat-Sheet

> Loaded by `/explain noun-foraging` or at P4.1 first surface.

---

## What noun foraging is

Noun foraging is the foundational OOUX technique for discovering objects. You read through research and product artifacts and highlight **every noun** — people, places, things, concepts, documents, and events — without filtering or judging. Quantity over quality at this stage. The SIP test filters the list later.

The insight behind it: when complexity confuses us, it's almost never verbs or adjectives causing the trouble. Nine times out of ten it's a **noun we don't have a handle on** — an undefined concept, a synonym for something we already know, or an unknown unknown hiding in plain sight.

---

## Sources to mine

Forage nouns from every source available:

| Source | What to look for |
|---|---|
| User interview transcripts | Nouns users repeat; things they name as important |
| Personas and journey maps | Objects users interact with across their day |
| Requirements docs / PRDs | Domain nouns, data entities, named concepts |
| Existing UI screenshots | What nouns appear on screen? In headers, cards, nav labels? |
| Domain glossaries / business docs | Official terms; synonyms to reconcile |
| Support tickets / FAQ | What things do users ask about? |
| Competitive product audit | What objects does the competition surface? |
| Live product | Navigate the product and harvest nouns from the rendered interface |

---

## How to forage

1. Read through one source at a time
2. Highlight every noun — even obvious ones, even ones you think you already know
3. Collect into a flat list; don't group or judge yet
4. After all sources are mined, group similar nouns into clusters
5. Give each cluster a canonical singular name (CUSTOMER, not "customers" or "clients")
6. Run SIP on each cluster

---

## What to watch for

**Synonyms** — "user," "member," "customer," and "account holder" may all refer to the same object. Surface the synonym and pick one canonical name.

**Ambiguous nouns** — "content" and "item" are often overloaded. Ask: "Is this one thing or many different things?" If many, split it.

**Verbs disguised as nouns** — "registration," "submission," "review" — these are often CTAs, not objects. Test with SIP; if S and P fail, reclassify as a CTA.

**Noun overload** — if a single noun seems to mean different things in different contexts, it may be a **Masked Object**: two different objects wearing the same name. Unmask by creating two distinct objects with distinct names.

---

## AI-assist tip (from the book)

After foraging manually, ask an AI model: "For a [domain] system, what nouns would appear most often in user research? What concepts would users care about most?" Use the AI list to cross-check your own — look for gaps, not confirmation.

---

*See also: `sip-test.md` · `01-object-discovery` skill · `ooux-object-thinking` skill*
