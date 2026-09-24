---
date: 2026-09-24
status: OPEN — waiting on Aldi
---
# The roster as a game community (Fleet & Roster left panel + the empty right panel)

## Problem, in his words
> *"i dont like the folder design for that roster we need better game like theme for that, do u have any suggestion?
> lets brainstorm and quick research for this maybe some team game play that have this features could be used as
> inspiration, i remember that state of decay 2 have this roster that show all survivor in the settlement and all of
> their stats and skills maybe we can use that but change the 3D character into 3D profile card instead and also i dont
> like this blue panel u should redesign this as well"*

The folder roster shipped in kpm `13802b6` an hour earlier. He rejected it for LOOK, not for logic: the doors, search,
rank order and the "what the van holds" line stay. The "blue panel" is the right side's empty state ("STANDBY FOR
DEPLOYMENT", `bg-slate-900` navy) and, by extension, the blue/green detail header above the bay.

## Research (one source read; web search tools were down this session)
State of Decay 2 (stateofdecay.fandom.com, Skills page): four base skills — Cardio, Wits, Fighting, Shooting — each
rated 1–7 and upgraded to a specialisation at 7, plus a fifth "specialty" skill; survivors also carry traits and a
community standing. The KPM data that maps onto it already exists in `src/config/career.js`: STAT_LABELS (Cash
Collected, Stores Served, Items Moved, Days Closed, Best Streak, Clean Cukai Days, Debt Collected, New Outlets…),
DEFAULT_BADGES (= traits), DEFAULT_RANKS Bronze→Mythic via `rankLadder` (= standing), and the shipped
`components/PlayerCard.jsx` (= the 3D profile card he asked for).

## Options
| | Look | What a row/card shows | Cost | Risk |
|---|---|---|---|---|
| A · Community list (State of Decay 2) | list of survivor rows; tap → big 3D profile card on the right (front: face, rank, title; back: traits/badges) | name, rank chip, four skills as 7-pip bars (Cash, Reach, Stock, Streak), van load | medium: reuses PlayerCard look + career stats | skills need a 1–7 scale (per-team percentile or fixed thresholds) — a design call |
| B · Card collection (FIFA Ultimate Team) | grid of 3D player cards, frame colour = rank, overall number | overall rating + 4 short stats | medium-high: a new card component | showpiece, slow for the daily "who do I load" job |
| C · Barracks (XCOM 2) | dense rows, rank insignia, role, status, van fill bar | status + van fill | low | least game-like; close to what he already rejected |

The blue panel, in every option: the empty state becomes a COMMUNITY overview in slate + gold (people, vans loaded,
Bks out, today's cash), like SoD2's community resource strip, and the selected person's header becomes their profile
card instead of the blue/green chips.

## Recommendation
A — it is his own reference, it keeps the list fast to scan, and the "3D profile card" is a reuse of the PlayerCard he
already approved rather than a new engine (the same floor as 2026-09-22: "it must be OUR cool").

## Decision
OPEN — waiting on Aldi (options shown as a three-card board in chat, 2026-09-24).

## Rejected on purpose
- The folder roster (`13802b6`) — he said so. Keep its logic, drop its look.
- A 3D character model — he asked for a 3D profile CARD instead.

Models applied: Opportunity Cost (B's showpiece vs the daily scan), Second-Order Thinking (a 1–7 skill scale ranks
salesmen against each other — the scale choice is a people decision, not a UI one).
