# 14 · IA — departments vs people (naming & attribution rules)

A consistency problem surfaced in review: codes, full names, and people's names were
used interchangeably, and a **department's** delivery status was being shown next to a
**person's** name — so "Khalid Al Marri • Slipped" read as if *the person* had slipped.

This is the rule the whole product now follows, on every surface.

## Two entity types

| | **Department** (org) | **Person** (participant) |
|---|---|---|
| Example | `EDD` · Economic Development Department | Khalid Al Marri, Director-General |
| Is | the **accountable unit** | a **representative** of one department |
| Has | a delivery **status**, owns deliverables, holds budget | a role, contacts, a track record |
| You… | read its status, cite its reports | **contact / ask** them |
| Visual mark | **rounded-square code badge**, status-tinted (`OrgBadge`) | **circular face** (`Avatar`) |

**A person is never "on-track / at-risk / slipped".** Status is a property of the
department's deliverable. If a status appears near a person, it is explicitly labelled as
the department's (the "Represents" line), never attached to the person's name.

## The visual language (one rule, applied everywhere)

- **Circle = a person.** Faces appear only where a human is the subject.
- **Rounded-square code badge = a department.** Status-tinted; never a face.
- Codes (`EDD`) are the department's shorthand — fine as text in dense/secondary contexts
  (rail secondary lines, tables, the AI corpus). The **full name** appears on the primary
  reference (cards, the drawer's "Represents" block).

## Single source of truth

Department facts — full name + delivery status — live in **one** place: `lib/corpus` `ENTITIES`,
looked up by code via `deptFor(code)`. `PARTICIPANTS` (people) carry **no** status or
department-name field, so the two can never drift. (This also fixed a latent bug: MTA was
`on-track` in one place and `at-risk` in another — now a single `at-risk`, consistent with
"3 of 5 need action".)

## Shared primitives (`components/rail.tsx`)

- `OrgBadge` / `OrgRow` — a department (square badge + name + status).
- `Avatar` / `PersonRow` — a person (face + name + role).
- `StatusTag` — the dot + label; only ever a department's status.

## Where each is used

- **The room (rail)** — people present → `Avatar` + name, with their dept code · status as a secondary line.
- **Needs attention** — departments' issues → `OrgBadge` + full name + severity.
- **Who's in the room (cards)** — three zones: **identity** (person, face → profile) · **represents** (department badge + name + status) · **action** (Ask … — a separated footer CTA).
- **During transcript** — speakers are people → face + name + "role · CODE".
- **After distribution** — recipients are people → face chips; **owners** in the action table are departments → code.
- **Profile drawer** — person identity at the top; a "Represents" block carries the department badge, status, situation.
