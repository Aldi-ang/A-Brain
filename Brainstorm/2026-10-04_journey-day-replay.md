---
date: 2026-10-04
status: OPEN - waiting on Aldi (which comes first: drawing the replay, or the shop popup redesign)
tags: [kpm, journey-plan, expedition, replay, ponder, design, brainstorm, open]
---

# Journey Plan - replay a salesman's day (the Day Log)

## The problem, his words (2026-10-04 13:30)

> *"i want to review the animation for each of the status on visited stores, whether they are making sales or is there
> any other reason of them not taking the products, and also i want their journey animation to be replay able for who
> review it, so this animation will be replayed on this one panel that have the timeframe for each status update done
> by the salesman for example Aldi go to store 1 (walking animation from regional warehouse to store ) = making sales
> ( sales animation, opening chest and received coin) then walk again go to store 2, and item is still on their shelf
> and not sold yet therefore (another animation for this), then walk animation goes to store 3 = store are requesting
> on exchangin the item, then another animation and sign the stores for this, then so on, this kind of animation should
> differs according to the kejadian ... so there will be like history or logs of what the sales doing today and its
> time and information for each stores that visited that day and this chain of events is replay able"*

## What the app already records (read in code, 2026-10-04)

| Event | Saved where | Has a time? | Note |
|---|---|---|---|
| Sale | `transactions` (agentId, customerName, total, timestamp) | yes | already drives the selling scene |
| Return / exchange | `transactions` type `RETUR` (quarantineCargo: item, qty, reason) | yes | his "store requesting on exchanging the item" |
| Visit reason (Routine Check, Repeat Order, Stock Full, Competitor, New Request, Store Closed) | the SHOP doc: `lastVisit` (date only), `lastVisitTag`, `lastVisitNote`, `lastVisitedBy` - JourneyView.jsx confirmCheckIn ~863 | NO - and the next visit overwrites it | the map's chest signs read this |
| Same visit reason | `audit_logs` + `audit_vault/{day}/logs`: action `VISIT_REPORT`, details = the SENTENCE "Visited {shop} - {tag}: {note}", user email, timestamp | yes | append-only (rules: create yes, update/delete no); per-day folder = one small read per day; readable by the boss. Nothing reads it today. Undo = `VISIT_UNDO` |
| Where he walked | `motorists/{id}.pathHistory` = today's pings only, one per sale + app open | yes | NOT a track - the walk between shops can only be DRAWN, never claimed |
| Where the day starts | first ping of the day (often the branch) | yes | a branch warehouse pin: not checked |

**The player already exists:** `src/ponder/useScenePlayer.js` (the Ponder tutorial engine, his Create-mod ask of
2026-08-27): a scene = BEATS with hold times, a timeline with a notch per beat, play / pause / jump back for free
(a beat is a pure function of its index over fixed data - a finished day is fixed data). One event = one beat.
**The scene vocabulary already exists too:** the chest's lit sign per outcome (`signFor`, `sign5Svg`), the selling
scene with the app's own `.kpm-coin` (41e308b), the walking pixel person.

## Options

| | What | Costs | Gains |
|---|---|---|---|
| 1 Day Log list | pressed salesman -> his day as rows: time · shop · what happened · note | a reader for audit_vault/{day} + transactions; parse the sentence by the KNOWN tags | works for PAST days at once (the log is months deep); the substance of the review |
| 2 Replay on the Journey map | Play on the log -> he walks stop to stop on the real map, each chest plays its scene, timeline notches = event times, tap a row = jump, 1x/2x/4x | reuse useScenePlayer; camera follows; walk drawn between known points | the show he asked for; real distances |
| 3 The scenes | one per outcome (sale, repeat order, stock full, competitor, new request, closed, retur, routine) | each a small sprite moment; Lite = still end picture; no flashing (his epilepsy rule, aa87cd1) | the "differs according to the kejadian" part |
| from now on | save each visit report with shop ID + reason + man as FIELDS beside the sentence | one change in confirmCheckIn/logAudit; no rules change (audit create has no field list) | no parsing, renamed shops still match |

## Costs he has not priced (said to him)

- The walk is drawn, not tracked - a phone sends a position only on a sale or app open. Label it, or a drawn line
  gets read as proof of where a man went.
- Reviewing 6 men x 20 stops at 1x takes minutes - speed + tap-a-row-to-jump are not extras.
- Second order: every visit becomes checkable (five "Stock Full" reports from one spot in three minutes will show).
  Good for the boss; the salesmen will learn it.
- The report time is when he pressed Report, not when he arrived.

## Decision

OPEN - waiting on Aldi: draw the replay first (a live page: panel + map + 3-4 scenes, PC and phone as separate picks,
his habit) or do the queued shop popup redesign first. My pick: draw the replay first - it decides what the popup
must show (the popup is one stop of the same day).

## Rejected on purpose (by me, flip conditions given)

- A separate side-scrolling 8-bit stage instead of the real map - repeats a map we already have and hides real
  distance; flips if replaying on the map is too slow on his phone (perf probe at 6x CPU).
- A brand-new visit collection - needs a Firestore rules change he must deploy; the audit log already holds it,
  append-only; flips if the per-day audit read turns out too big or unreadable for a role that should see it.

Models applied: Inversion (what makes the replay lie - the drawn walk, the report time), Second-Order Thinking
(salesmen behave differently once every visit is checkable), Opportunity Cost (the popup redesign waits).
