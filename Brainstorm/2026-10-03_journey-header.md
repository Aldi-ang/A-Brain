---
date: 2026-10-03
status: DECIDED 01:39 - A on the PC, B on the phone; BUILT kpm 339522f
tags: [kpm, journey-plan, design, header]
---

# Journey Plan's top panel (Mission Feed) - redesign

**Problem, his words (2026-10-03 01:30, with a screenshot of the PC panel):** *"redesign this as well so that it on
theme with another panel and features make sure that it looks better and function better"*.

**What is wrong today (kpm `ccae937`, `src/JourneyView.jsx` ~905-955):** the salesman picker is emerald and the day
picker blue (palette law), five drop-downs in three different styles, the day hidden in a list, a 10 px progress bar
with no per-shop reading, a black/orange card unlike the expedition panel beside the map. Kept on purpose: his names
(Mission Feed, Elimination status, Secured, Global Fleet's Bounties - the naming question was answered "names stay",
2026-10-02) and the phone fold he picked (title = 44 px key that opens the pickers, 2026-09-19 board 1 = B).

| Look | What | Costs | Buys |
|---|---|---|---|
| A strip | title + count, one cell per shop, every picker in one row (PC); phone folds everything | the least new | the map starts highest; fewest pixels |
| B day card | the day as a big headline + count + 3 numbers (shops left, salesmen out, overdue) left, pickers stacked right; phone keeps the day keys out | ~85 px taller on the PC; 3 new numbers to compute | reads like the expedition card; the day - Journey Plan's first question - is one tap on the phone without opening the fold |

Both: day = 7 keys (today dotted), progress = one cell per shop, every picker in the app's field style, no green, no blue.
Board: `Raw/2026-10-03-journey-header/board.png` (`board.html`, phone frames forced by class at 390, PC at 1440 shown 62 %).

**My pick:** B - the day is the first thing a salesman answers on this screen, and his own rule says pin only the
first question, in one line (the day keys are one line).

**Decision (01:39):** his *"A for pc B for phone"* - the same split he chose for the expedition (phone one thing at a time, PC everything at once). Built kpm `339522f`; frames `Raw/2026-10-03-journey-header/built-phone-390.jpg`, `built-pc-1440.png`. Found while building: this panel's own classes carry a display and load after Tailwind, so `hidden`/`lg:hidden` lost - the day keys showed twice at 390; the feed now hides its own parts (`.kx-phone`/`.kx-desk`), guarded by a check. Retired: the 2026-09-20 "one line on the phone" rule (his B replaces it).

**Rejected on purpose:** renaming the labels (he kept the names 2026-10-02); hiding the place pickers behind the
Radar Hub breadcrumb below (Chesterton's fence - not checked who uses which).

**Models applied:** Opportunity Cost (map height vs readability), Chesterton's Fence (the duplicate place controls).

Related: [[2026-10-02_expedition-map]]
