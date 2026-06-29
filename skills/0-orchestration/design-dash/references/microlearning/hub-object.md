# Hub Object — Designer Cheat-Sheet

> Loaded by `/explain hub-object` or at P2.7 first surface.

---

## What a hub object is

A hub object is an object that nests many other objects on its detail page — it has many marks in its NOM row. Hub objects become the natural **navigation anchors** of a system: pages users return to repeatedly, and from which they reach most of what they need.

| Pattern | NOM characteristic | Design implication |
|---|---|---|
| **Hub** | Many marks in its row | Rich detail page; primary nav anchor |
| **Popular** | Many marks in its column | Appears inside many other objects; shows up everywhere |
| **Leaf** | Few or no marks in its row | Simple detail page; end of a navigation path |
| **Isolated** (anti-pattern) | Few marks anywhere | Dead end; may be missing connections or may be an attribute |

---

## How to spot a hub during NOM building

After filling in the NOM, count the marks in each row. Objects with the most marks are hubs. In most product domains:

- The primary organizational unit (e.g., PROJECT, ACCOUNT, TEAM, ORDER) is almost always a hub — it nests the key objects users manage within it
- The primary actor object (e.g., USER, CUSTOMER, MEMBER) is often a hub — it nests the things associated with that person
- Status or result objects (e.g., REPORT, SCORE, LOG) are typically leaves — they nest fewer objects and are destinations rather than starting points

---

## Hub objects in the nav flow

Hub objects drive the primary navigation structure:

1. Hub objects become the top-level items in the main nav
2. Their detail pages become the most visited pages — design them to load fast and orient users quickly
3. The Page layer (see `page-collection-instance.md`) of a hub is a landing point; the Collection layers beneath it are where users spend most of their time

---

## Caution: not all hubs are equal

A hub with 10+ nested objects may need sub-sections or tabs to organize its detail page. Ask: "What is the user's primary job on this page?" The P-ranked CTA answers that — use it to prioritize the top of the detail page, not the most-nested collection.

---

*See also: `nom.md` (building and reading the NOM) · `page-collection-instance.md` (page layer design)*
