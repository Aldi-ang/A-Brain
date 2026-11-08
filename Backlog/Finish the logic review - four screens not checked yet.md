---
title: Finish the logic review - four screens not checked yet
description: The 2026-08-17 review covered the money and stock paths and ran out of time. Journey, Map, Fleet Canvas and Customers were never opened. Same method, same output format.
status: To Do
progress: "partly: the map screen was swept 2026-08-18 (SWEEP - the map screen); Journey, Fleet Canvas and Customers not yet"
area: Whole app
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# Finish the logic review - four screens not checked yet

The 2026-08-17 review found seven flaws (see the other items added the same day). It went after the
paths that move money and stock first, and the hour ran out. **These four were never opened.**

## What is left

| Screen | File | Why it is worth checking |
|---|---|---|
| Journey Plan | `src/JourneyView.jsx` (1674 lines) | decides which stores an agent visits; a wrong filter hides a store from its own agent |
| Map Mission Control | `src/MapMissionControl.jsx` (2567 lines) | biggest unreviewed file in the app |
| ~~Fleet & Canvas~~ | `src/FleetCanvasManager.jsx` | **DONE 2026-08-17** — found 2 flaws: Clear Canvas stale read, and Load Canvas skipping unit conversion |
| Customers | `src/components/CustomerManager.jsx` (1700 lines) | store records and price tiers; the debt bugs all key off the store name |

## What to look for — the four shapes that produced every flaw found so far

1. **The same maths written twice.** Every flaw found on 2026-08-17 was a second copy of something
   that already existed and had drifted. Grep for a calculation before assuming it is new.
2. **A field that is written and never read.** `returnTotal` was money that went into the database
   and was never taken out again. Check writers against readers with a control grep.
3. **An absolute value written where a difference belongs.** The stock-count approval overwrote the
   day. Anything that sets a total rather than adjusting one deserves a second look.
4. **An offline or secondary path that re-implements the main one thinly.** The offline sale path
   skipped the stock deduction entirely because it was a copy, not a call.

## How to report it

Same as the seven: one Backlog file per flaw, plain English first, `file:line` second, smallest fix
last. No app code changed during the review — findings only.
