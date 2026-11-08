---
title: The app day rolls over at 7am instead of midnight
description: Every transaction's date field is stamped in UTC, so "today" on the route board runs 07:00 to 07:00 WIB. An agent who starts before 7am sees his visited stores reset mid-morning. The EOD money is not affected.
status: Done
done: "60c53d8 (2026-08-23"
area: Journey Plan / Fleet
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# The app day rolls over at 7am instead of midnight

Found in the 2026-08-17 logic review, fourth pass.

## What happens, in simple English

Every sale is stamped with a date like `2026-08-17`. That date is worked out in **UTC**, not in
Indonesian time. WIB is 7 hours ahead of UTC, so the date only changes at **07:00 in the morning**,
not at midnight.

So for every screen that groups by that date field, "today" means **07:00 today until 07:00
tomorrow**.

## What actually breaks

An agent who starts before 7am:

- makes a sale at 06:30 — it is filed under **yesterday**
- the store shows as visited, the route board counts it
- at 07:00 the date flips, and those early stores go back to looking **unvisited**
- the "stores conquered today" count drops back down mid-morning

Nobody loses money. It looks like the app forgot what he already did.

## ✅ The money is safe — checked, not assumed

The EOD screen does **not** use that date field. It compares the real timestamp against the local
day (`src/EODReconciliationView.jsx:100-101`), which is correct. Early-morning cash still lands in
the right EOD.

So this is a route-board and reporting problem, not a cash problem. Worth saying clearly, because
the same root cause could easily have been a cash problem and is not.

## Where it is

- The UTC date stamp: `src/utils/helpers.js:23` — `getCurrentDate()`
- Written onto every sale: `src/hooks/useTransactionEngine.js:75`, `:244`, `:369`, `:441`, `:485`
- Read as "today" on the route board: `src/JourneyView.jsx:270`, `:275`, `:737`, `:754`, `:1086`
- Same UTC "today" on the Fleet screen: `src/FleetCanvasManager.jsx:420-423`

## ✅ The fix already exists in the codebase

`getLocalDayKey()` sits right underneath, at `src/utils/helpers.js:28-33`, and its comment already
describes this exact problem — *"WIB is UTC+7, so toISOString() flips to tomorrow at 07:00 local,
right in the middle of a morning route."*

It is currently used only for the career ledger.

## Suggested fix, smallest version

Switch the **route board and Fleet screen** to `getLocalDayKey()` for their "today", and start
stamping new transactions with it too.

⚠️ **Do not bulk-rewrite old records.** For a few hours a day the old ones will disagree with the
new ones. Since the EOD reads timestamps rather than this field, the safest order is: change the
readers first, watch a morning, then change the writer.


---

## Done — 2026-08-23, `60c53d8`

**It was never two bugs.** There was no 7am rule anywhere in the code, and nobody had configured
one — which is why nobody could find it. `getCurrentDate()` was
`new Date().toISOString().split('T')[0]`, the **UTC** date, and WIB is UTC+7, so the UTC date flips
at 07:00 local. The rollover was the symptom of the timezone, not a second problem.

**The fix was already in the file.** `getLocalDayKey` sat directly below the broken helper with a
comment describing exactly this failure, and all 26 call sites went on using the UTC one anyway.
Fixed at the definition: `getCurrentDate` now returns the local day key. Every caller wanted local.

`AgentInventoryView.jsx` kept its **own private copy** of the UTC helper, so it would have stayed a
day behind even after the shared one was fixed. Deleted, and a check now refuses any file that
defines a second date rule.

⚠️ **OLD RECORDS WERE NOT REWRITTEN.** Past sales between midnight and 07:00 WIB are still filed
under the previous day. Repairing that means rewriting `date` on every historical transaction from
its `timestamp` — **Aldi's decision, still open.**

Two non-findings worth keeping: `dayStats` was already correct and pinned so, and the sales-draft
cap is an AGE (twelve hours), never a day boundary, despite being captioned *"his day starts at
07:00"* for months.
