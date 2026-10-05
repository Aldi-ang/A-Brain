---
date: 2026-10-04
status: BUILT 2026-10-05 (kpm a4afcf2, local, not pushed) - his test owed
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

DECIDED 2026-10-04 15:50, his words: *"sure do replay first i want to see it"*.

## DRAWN 2026-10-04 16:00 - live page https://claude.ai/artifact/WnjonLSqjNZYpoMBbXSdSz (v1)

Source + frames: `Raw/2026-10-04-day-replay/` (`day-replay.html`, `shoot-replay.mjs`, `shots/`). Budi's sample Sunday:
the ender-chest warehouse 07:45, then 8 stops, one per outcome - sale (the app's coin rises into his raised hands),
stock full (last week's packs pop over the rim and settle; he shakes his head), exchange (a crate in Quarantine's tape
comes up into his hands), competitor (a grey crate with a red band + a red "!"), repeat order (a crate drops into the
chest), new request (a speech bubble folds into a note he takes), closed (he knocks twice, the lid stays down, the lock
sign), routine check (he looks in; the tick sign). Every scene ends on the chest's own lit sign.
**How it is built (port this, do not re-invent):** the whole replay is ONE function of time t - walking time follows
the real gap between reports (55 ms per minute at 1x, 0.9-2.4 s), each scene holds the clock 2 s; every scene is Web
Animations created PAUSED with one shared duration, so one `currentTime` drives a stop (scrub backwards is free - the
Ponder rule). Timeline = clock time (07:30-11:30) with a notch per event carrying its sign; drag anywhere to scrub.
Camera: "Follow him" (window 250 x 200 around him) or "Whole day". PC = map + Day Log rows; phone = map + one event
card + a chip strip. Lite = cuts between end pictures, 0 animations running (measured).
**Measured:** 0 console errors; brightness over 12 s of playback 81.7-84.4, worst frame 6.2 % of the map changed (the
camera panning) - no flash; phone 390: 0 sideways scroll.
**Fixed before sending:** his name tag hid what the shop hands him (crate, "!", bubble) -> the tag steps aside during a
scene; the warehouse label sat under his start tag -> moved below the chest; the map note wrapped to 3 lines on the
phone -> one short line, the full reason under the map.
OPEN - his pick owed: camera Follow him / Whole day; and any scene that does not read.

## Rejected on purpose (by me, flip conditions given)

- A separate side-scrolling 8-bit stage instead of the real map - repeats a map we already have and hides real
  distance; flips if replaying on the map is too slow on his phone (perf probe at 6x CPU).
- A brand-new visit collection - needs a Firestore rules change he must deploy; the audit log already holds it,
  append-only; flips if the per-day audit read turns out too big or unreadable for a role that should see it.

Models applied: Inversion (what makes the replay lie - the drawn walk, the report time), Second-Order Thinking
(salesmen behave differently once every visit is checkable), Opportunity Cost (the popup redesign waits).

## v2 2026-10-04 16:40 - his answer built (same link)

His words, 16:10: *"make sure that all the stores is interactable when press and make sure that we now what them notes or
status are on each of the stores ... button to review the receipt from that sales ... maybe see as a whole in pc and follow
on phone?"* Built: every shop (and the warehouse) opens a card - status, his note, the time and who recorded it, an
order's or an exchange's detail, "Play from here"; pressing pauses the replay. A sale's card and its Day Log row carry
"Review receipt" -> the app's nota (company blue, SAMPLE banner, the bank line left to Settings - no real account copied).
Camera: PC opens on Whole day, phone on Follow him; the switch stays.
**Measured (shoot-v2.mjs, REAL mouse/touch presses):** all 9 cards name the shop pressed; receipt 2 items + total; Esc
closes it; Play from here plays from that shop; phone receipt 358 px, 0 sideways scroll; 0 errors; brightness 81.7-84.4.
**Found by the real presses:** the card first floated over the map and covered shops 1 and 2 - a press on them hit the
card. Moved off the map. And his tag sat on the shop's own tag while he stood there - his steps aside then.
OPEN: nothing owed on the drawing; next = build (NEXT-SESSION.md).

## BUILT 2026-10-05 - kpm `a4afcf2` (local, not pushed)

Journey Plan -> press a salesman in the Expedition -> **Replay his day**. The shops and the team step off the map; the
player + Day Log take the Expedition panel's slot (PC: the 400 px column, the player sticks on top and the list follows
him under it; phone: under the map, one card + a chip strip). Built exactly as v2 was picked; every scene is the app's own
look-C sign act (`.kx-c5.burst`) plus the page's props (coin / taped crate / note into his hands, packs, rival crate,
knock), the sign's beat moved after the props (CSS `.kx-rp-mk ... --d: 1300ms`).

| Part | Where |
|---|---|
| Day Log reader (pure) + replay clock | kpm `src/utils/dayLog.js`, check `src/config/dayLog.selfcheck.mjs` |
| data + clock hook | `src/hooks/useDayReplay.js` |
| map layer + panel | `src/components/DayReplay.jsx`, CSS end of `src/styles/expedition.css` |
| the one receipt | `src/components/SaleReceipt.jsx` (moved out of HistoryReportView) |
| from now on | Visit Report saves `storeId` / `tag` / `agentId` fields (logAudit 4th arg, spread first) |
| proof | `Raw/2026-10-05-day-replay-built/shoot-replay-built.mjs` 38/38, frames beside it |

**Decisions taken by me (said to him once):** the visited shop's status word shows during and after its scene (one
`held` class on that marker, never all words); one chest per shop even when he visits it twice (a sale + a report = two
timeline stops, one chest, the later outcome wins); old reports are his by the email that wrote them; a day with no first
position starts at his first shop; the replay's man uses Expedition's hair + squad colour; `useScenePlayer` NOT reused (it
is beat-indexed; the replay needs any t - the page's own clock was ported instead).

**Found by the proof, fixed before commit** (each one red first): Leaflet `L.divIcon` REUSES its div on setIcon, so a scene
cache on the marker box went stale and the props froze (cache keyed on the scene's `.kx-c5.burst` now); the PC panel
scrolled the player out of sight; stops minutes apart stacked their timeline marks (greedy lanes); the nota opened under
the map keys (z-500 vs z-9999 - its own top layer now); a paused replay rewrote the trail 332x/s (0 now).

**Known limits (told him):** the walk is drawn; a report's time = when he pressed Report; a past day plays only the sales the
app still has loaded; the boss's own old reports cannot be matched (his record has no email); fullscreen hides the panel.

Models applied (build): Inversion (what makes the replay lie - kept the "drawn" note and the Report-time line on screen),
Chesterton's Fence (the sanitizer's -7.5845 fake pin: read raw shops instead of removing it).

## 2026-10-05 18:35 - his next ask: the replay in FULLSCREEN, "playable and swapble" - OPEN, drawn next session

His words: *"i want the day replay to be playable and swapble in the fullscreen"*.
Today (kpm `a4afcf2`): in fullscreen the replay keeps playing on the map but its player and Day Log stay in the page panel,
which fullscreen covers - no controls. And the small fullscreen Expedition (`ExpeditionMini`) still picks a man for the
LIVE map: pressing another man while a replay is on does not swap the replay to him.

**Two readings of "swapble"** (asked; default 1 if no answer): (1) press another salesman = his day replays (stay in
fullscreen); (2) a switch between the live map and the replay.

| Look | PC fullscreen | Phone fullscreen | Costs |
|---|---|---|---|
| A - bar | the player as a bar along the map's bottom (timeline, controls, clock); the small Expedition rows (top right) swap the man; a pressed shop's card under those rows | player bar above the map keys dock; the man chips on top swap him; the card a sheet over the player | covers least map; the card has little room on the phone |
| B - side | the whole replay panel as a 360 px column on the map's right, the man rows on top of it (closest to the drawn v2 page) | as A | cheapest build (the panel is reused), but 360 px less map |

Rejected on purpose: hiding the controls behind a key (a replay you cannot drive is the bug he reported); floating the
card over the map on the PC (v2's real presses showed it covers the next shop).
Models applied: Opportunity Cost (the popup redesign waits one more session), Inversion (what makes fullscreen
unplayable - controls off screen, a pick that does nothing).

**ANSWERED 19:50 (swap):** *"swap means change other people daily recording when press like on the sc1 there should be some button to view the exact features we viewed on the expedition when not fullscreen"* = reading 1 (press another person -> his day replays) + the small fullscreen Expedition list gets the same Replay key. His shot also shows that list cut off with a sideways scrollbar (long names) - fixed in the same job. Still OPEN: look A or B.

**DRAWN 19:55** from the real app (lab build, the real panel moved into fullscreen for the frame only - drafts): `Raw/2026-10-05-day-replay-built/fs-A-pc.png`, `fs-A-pc-card.png`, `fs-B-pc.png`, `fs-B-pc-card.png`, `fs-ph.png`, `fs-ph-card.png` (script `draw-fullscreen.mjs`). Sent to him; his pick A/B owed - he said "let me review and then i can decide on the next run later".

**ROUND 2, 20:46** - his *"can u make it more compact especially on pc because the panel looks so big here"*: `fs2-A-pc(-card).png` (A = ONE thin row, about 56 px: keys | the day as colour ticks - gold money, pale visited no sale, red problem, dark closed | camera), `fs2-B-pc(-card).png` (B = a 300 px column, smaller keys and rows), `fs2-ph(-card).png` (phone player about half as tall). Same script with `compact`. His pick still owed.

## 2026-10-05 21:30 - DECIDED and BUILT: fullscreen = look A, pushed live (kpm `50d98a9`)

**His pick, 21:00** (asked with `fs2-A-pc.png`, `fs2-B-pc.png`, `fs2-ph.png` side by side): **"A - thin bottom bar"** - the
biggest map, one row of keys + the day as colour ticks + the camera; the Day Log list is not on the fullscreen map (a shop's
card opens one at a time). B (the 300 px column) lost: it kept everything the page panel shows, at ~20% of the map.

**Built** (one player component with `full`, never a second copy): the bar 16 px inside the map's border on the PC (232 px
clear of the right column), above the key dock on the phone (3 rows, the clock on the camera row); ticks gold money, red a
problem, dark closed, pale the rest, each 6 px tick pressable 14 x 30; the card under the Expedition list (PC, a portal into
a slot the list draws) / above the player (phone); the small list gets "Replay his day" / "Stop replay" and a press on
another man swaps the replay to HIS day on the same day; Today / All shops and the PC Paintbrush step off while a day plays
(nothing to paint). His shot's cut-off rows: an auto grid column grew to the widest name - `minmax(0, 1fr)`.

**Found by the walk, before shipping:** swapping to a man with FEWER stops blanked the whole page - the map layer kept the
old day's phases (`s8`) and read them against the new day (`stops[8].kind`). The page's date picker had the same latent bug
since `a4afcf2`. Fix: the layer drops its phases when the timeline changes. Lesson recorded in Alucard's lessons.md.

**Proof:** `Raw/2026-10-05-day-replay-built/walk-fullscreen.mjs` -> `results-fs.json` 32/32 (1440 + 390 touch, 2 swaps
each, card, receipt on top, Stop / start / Exit mid-replay keep man + day + clock, Lite 0 animations); frames `fs3-*.png`.
Old walks still green: page replay 38/38, Journey 49/49; logicFixes 2234, audit 722.

**Pushed 21:22:** 89 commits `5f9d5c7..50d98a9` to `phase0-solid-ground`; rules unchanged since his 2026-10-02 publish and
the two new writes (`openRequest` on customers, Visit Report fields on audit logs) pass them; Vercel "Deployment has
completed"; the live Journey chunk carries `kx-rp-fs`. His live test is owed.

**Models applied:** Pre-mortem (what breaks on a swap - found the fewer-stops crash); Reversibility Test (the push: two
independent checks first - static audit + real-press walks).
