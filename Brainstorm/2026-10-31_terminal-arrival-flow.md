---
title: Sales Terminal arrival flow + left Manifest panel
type: brainstorm
created: 2026-10-31
---

# 2026-10-31 - Sales Terminal: status on arrival, ORDER opens the terminal, Manifest slides from the left

Written 20:19 WIB. Plan only.

## The problem, in his words
*"we need to make a change in sales terminal make it simpler, whenever salesperson in range with the stores, it will have option to show the status to be updated, could be stock full, competitor issue, or even closing, if closing then the app should show the sales terminal in full, this way input is much quicker when done in the phone by salesperson. so the flow will be stores close, open option of updated for the stores, if order then show the salesperson terminal in full and the manifest panel need to be moved to the sidebar on the left and can be pulled so that the sales person can see the manifest just with a side slide instead of moving up and down to check"*

## What exists
The Journey Visit Report already has his statuses - `VISIT_TAGS` (kpm `src/utils/dayLog.js:21`): Routine Check, Repeat Order, Stock Full (No Order), Competitor Issue, New Request, Store Closed. One function, one control: the terminal reuses that list and that save.

## Options
| Reading of "closing" | What the shop gets |
|---|---|
| closing a DEAL (= order) | full terminal opens |
| shop SHUT (= Store Closed) | one-tap status, visit done |

## Decision
OPEN - waiting on Aldi: the reading of "closing"; then frames (375 + 1440 + Lite) and one DECIDE. Brief: kpm `.claude/NEXT-SESSION.md` top block.

## Rejected on purpose
- A second list of statuses in the terminal (his one-function-one-control rule) - reuse VISIT_TAGS.
- Building before frames (his show-him rule).

Models applied: Chesterton's Fence (the drawer holds offers, the promo box, the photo and SIGN - each moves on purpose), Opportunity Cost (seat limit waits behind this).
