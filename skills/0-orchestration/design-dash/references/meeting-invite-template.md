<!--
TEMPLATE USAGE — read this block, then delete it from the artifact you write.

Loaded at: P2.4 (group mode) — by the design-dash orchestrator, and by
`skills/0-orchestration/facilitation-kit` when the orchestrator forks to it.
Write to `dashes/{slug}/meeting-invite.md`.

Group mode only. A solo or `--solo`/`--auto` dash has no invite to send: skip
this template and note "solo run — no invite" in `scope.md` §2.4.

INPUTS — take these from the answers already captured, do not re-ask
  §2.1  problem statement           → Why we're meeting
  §2.2  user role                   → Who this is for
  §2.4a duration                    → total time, and which agenda variant below
  §2.4b OOUX-new audience? (yes/no) → include the OOUX primer block and the
                                      articulation-gate note when yes
  §2.4c remote / in-person          → Logistics block
  §2.4d participant list            → invitee table
  §2.8  in-scope objects            → pre-read and worked examples, by slug
  P0    tier + mandatory gates      → Gates in this session
If a required input is missing, ask the one blocking question rather than
inventing a value. An invite with an invented attendee or an invented time is
worse than an invite that is one field short.

RULES
  - Use the dash's real in-scope objects as the worked examples, cited by
    library slug (`library/objects/`). Never use placeholder or Lorem Ipsum
    objects in an invite — the examples are how participants calibrate what
    the session is about.
  - Name a real facilitator and a real note-taker. "TBD" is acceptable and
    honest; a made-up name is not.
  - Say what participants must do before the session and how long it takes. A
    pre-read with no stated time budget does not get read.
  - Name the gates. Participants should arrive knowing which decisions are hard
    stops and that "ambiguous" counts as "no" at a gate.
  - Times below are relative offsets. Convert to wall-clock only once the real
    start time is known, and state the timezone.
  - Do not promise an artifact the tier does not produce. Check the P0 gate list
    before listing outputs.

AGENDA VARIANTS by §2.4a — use one, delete the others
  60 min      → Short session: framing + one activity + one gate
  Half day    → Standard session: the table below as written
  Full day    → Standard session plus a second activity block and a real break
  Multi-day   → One invite per day; each day gets its own copy of this file,
                named `meeting-invite-day{N}.md`
-->

# Workshop Invite — {DASH_NAME}

**Artifact status:** draft invite, not yet sent. Send from a real calendar; this file is the record of what was sent.

| Field | Value |
|---|---|
| Session | {DASH_NAME} — Design Dash, group mode |
| Slug | `{DASH_SLUG}` |
| Date & time | {YYYY-MM-DD}, {HH:MM}–{HH:MM} {TIMEZONE} |
| Duration | {60 min / half day / full day / day {N} of {N}} |
| Format | {Remote — {tool + link} / In-person — {room} / Hybrid — {both}} |
| Facilitator | {NAME, or TBD} |
| Note-taker | {NAME, or TBD} |
| Tier | {express / standard / high-stakes} |
| OOUX-new audience | {yes — primer blocks active / no} |

---

## Paste-ready invite body

<!--
Everything between the two markers below is what goes into the calendar invite.
Keep it short enough to read in the notification preview — detail lives in this
file, not in the invite body.
-->

> **{DASH_NAME} — design workshop ({duration})**
>
> We're designing {one-sentence problem statement from §2.1} for {user role from §2.2}.
>
> **Before you arrive ({N} min):** {pre-read link} — skim the problem statement and the {N} objects we'll be working with.
>
> **Bring:** {what each participant needs — recent examples, data access, a decision you own}.
>
> This session has {N} hard decision point(s). We won't leave them open.
>
> Agenda and full detail: `dashes/{DASH_SLUG}/meeting-invite.md`

---

## Why we're meeting

<!-- 2–4 sentences, plain language, no dash jargon. What's broken today, who it
affects, and what leaving the session with a decision unlocks. Participants who
read only this section should still know why they were invited. -->

{WHY}

**What we'll walk out with:** {the concrete artifacts this session produces — e.g. a locked problem statement, a validated object list, a selected concept}.

---

## Who's coming

<!-- From §2.4d. The Role-in-session column is what they're being asked to do,
not their job title. If a discipline is Responsible for a gate this session
touches (see P3.3 participant model), say so here — that is the person whose
absence would block the gate. -->

| Name | Discipline | Role in session | Responsible for a gate? |
|---|---|---|---|
| {NAME} | {PM / engineering / BI / research / content / educator / admin} | {decision owner / contributor / observer} | {gate name, or —} |

**If you can't make it:** {named async path — comment on `scope.md`, docs page, or ticket}. Sending a delegate is fine; sending no one for a Responsible discipline means we record that gate as debt rather than cleared.

---

## Before the session

<!-- Every item gets a time estimate and a link. Cut anything you can't justify
the minutes for. -->

| # | Do this | Time | Link |
|---|---|---|---|
| 1 | Read the problem statement and success criteria | {N} min | `dashes/{DASH_SLUG}/scope.md` |
| 2 | Skim the {N} in-scope objects we'll build on | {N} min | {object slugs + library links} |
| 3 | {Bring a recent real example of the problem} | {N} min | — |

<!-- OOUX-NEW BLOCK — include only when §2.4b = yes; delete this block otherwise. -->

**New to OOUX?** No prep needed beyond the above. We'll define each term as it comes up, and the session includes short explainer moments before the activities that depend on them. You can ask for a definition at any point — that's expected, not a delay. Two moments in the session ask the group to state a definition back in their own words before we move on; that's a deliberate checkpoint, not a test.

---

## Agenda

<!-- Offsets from session start. Adjust the block lengths to §2.4a; keep the
order. Every activity block names the artifact it feeds, so nobody is doing an
exercise with no destination. -->

| Time | Block | Duration | What happens | Feeds |
|---|---|---|---|---|
| 0:00 | Welcome & framing | 10 min | Problem statement, scope, what a "gate" means today | — |
| 0:10 | {Activity 1 — e.g. object validation} | {N} min | {what the group actually does, with the real objects} | `scope.md` |
| {0:00} | **Gate — {gate name}** | 10 min | {the gate question, asked plainly}. Ambiguous counts as no. | `dash-config.yaml` |
| {0:00} | Break | 10 min | — | — |
| {0:00} | {Activity 2} | {N} min | {what the group does} | {artifact} |
| {0:00} | Decisions & owners | 15 min | Read back every decision; name an owner and a date for each open question | `assumptions.md` |
| {0:00} | Close | 5 min | What happens next, and who does it | — |

---

## Gates in this session

<!-- From the P0 mandatory-gate list for this tier. A gate is a stop, not a
discussion item — say so here so it isn't a surprise in the room. -->

| Gate | Question the group answers | If the answer is no |
|---|---|---|
| {Gate name} | {the question, in one plain sentence} | {what we do instead — the gate is not waived} |

**How gates work today:** we ask the question, we take a visible yes or no, and an ambiguous answer is a no. A gate that doesn't clear becomes recorded debt with an owner and a date — it does not become a silent pass.

---

## Logistics

<!-- Use the §2.4c branch. Delete the branch that doesn't apply. -->

**Remote:** {tool} — {link}. {Collaboration board link}. Please join with camera on for the activity blocks if you can; the exercises are visual. Dial-in: {number}.

**In-person:** {room}, {building}. We'll need {wall space / whiteboard / sticky notes in {N} colors / markers}. {Who brings materials}.

**Accessibility:** {captions on / materials shared in advance / any stated participant need}. If you need something to participate fully, tell {facilitator} before {date} — it's easier to set up ahead than in the room.

---

## After the session

| What | Where | Who | By when |
|---|---|---|---|
| Session notes and decisions | `dashes/{DASH_SLUG}/scope.md` | {note-taker} | {YYYY-MM-DD} |
| Open questions with owners | `dashes/{DASH_SLUG}/assumptions.md` | {facilitator} | {YYYY-MM-DD} |
| Async sign-off requests | {channel per discipline, from P3.3} | {facilitator} | {YYYY-MM-DD} |
| {Next session, if multi-day} | `meeting-invite-day{N}.md` | {facilitator} | {YYYY-MM-DD} |
