---
title: "Redesign Receivables & Consignment, and the whole Fleet & Roster — logic must survive"
description: Asked for by Aldi 2026-08-24. Both screens are 0% themed — they have no light mode at all, not just an ugly one. Measured, risk-ranked, and with the exact seams a redesign must not cut.
status: To Do — measured, not started
area: UI rework
priority: High
created: 2026-08-24
updated: 2026-08-24
tags: [redesign, palette-law, light-mode, aldi-reported]
---

# Two screens to redesign, logic untouched

**His words, 2026-08-24:**

> *"receivable and consignment UI also needs to be redesign but make sure the logic still intact"*

> *"we need to redesign the UI for the whole fleet and roster but make sure the logic and features
> remain intact as well put this on your to do list and actually there is few logic that we need
> to redesign as well"*

❓ **STILL UNANSWERED — "there is few logic that we need to redesign as well".** He has not said
which. **Ask before starting either screen**, because a logic change decided halfway through a
repaint is how both end up half-done.

## ⚠️ THIS IS BIGGER THAN "IT LOOKS DATED"

Measured 2026-08-24:

| | lines | banned colour classes | design tokens |
|---|---|---|---|
| `src/FleetCanvasManager.jsx` | 1291 | **293** | **0** |
| `src/ConsignmentFinanceView.jsx` | 993 | **191** | **0** |

**Zero tokens means nothing flips.** These two screens were never part of the theme sweep, so they
do not have a bad light mode — **they have no light mode at all.** Every colour is a hardcoded
`slate-900` / `blue-600` / `emerald-400`, which is also the palette law broken 484 times in two
files. That is the same root cause as the sidebar fade he reported the same morning, at ten times
the scale.

So this is not taste. It is two screens that are unreadable for anyone who prefers light mode.

## Do Receivables FIRST — its logic cannot break

`ConsignmentFinanceView.jsx` **writes nothing**. Not one `setDoc`, `updateDoc`, `writeBatch` or
`runTransaction` in 993 lines. Every action leaves through a callback handed in from App.jsx:

```
onAddGoods · onPayment · onReturn · onDeleteConsignment
onRequestTransfer · onAgentAcceptTransfer · onAdminApproveTransfer
```

**That is the whole contract.** Keep calling those seven with the same arguments and the logic is
mathematically untouched, because it does not live in this file. A repaint here is close to
risk-free, which is exactly why it should go first — it proves the approach before the dangerous
one.

Second seam worth keeping: the tab state (`financials` and its siblings) and the region / agent
filters are local UI state only. Nothing downstream reads them.

## Fleet is the dangerous one — four write paths, two of them move real stock

`FleetCanvasManager.jsx` writes inside itself, and two of those writes are the ones that were
upgraded from `writeBatch` to `runTransaction` **precisely because they were losing stock**:

| where | what it does | why it is delicate |
|---|---|---|
| `handleSaveAgent` (~L186) | creates/edits an agent + its `employee_directory` row | two documents that must agree, or a ghost login |
| `handleDeleteAgent` (~L269) | removes an agent | |
| `handleLoadCanvas` (~L312) | **`runTransaction`** — warehouse → van | re-reads the agent inside the transaction; a sale made mid-load used to vanish. Also converts units — loading 10 packs onto a Slop-counted row once added 10 SLOP |
| `handleClearCanvas` (~L389) | **`runTransaction`** — van → warehouse | same read-inside rule. Clearing while a sale was in flight once put 20 packs in two places at once |

**Rules for that file:**

- **Do not touch the two transactions.** Repaint around them. Every comment inside them records a
  bug that already cost a session.
- **`canEditFleet` gates six things** (add button, edit pencil, delete, Load, Reconcite & Clear,
  and the two handler guards). It is new as of `7496258` and checked — keep every one.
- The roster **filters to the viewer's own location** for every tier below global admin. That is
  Aldi's rule for tier 4: *"limited on seeing their own regional teams"*. Do not flatten it.
- `isReadOnlyMode` drives the View-Profile panel. It is not the same thing as `canEditFleet`.

## How to know the logic survived

Both screens are covered by existing checks — run them, and **add a check for anything a repaint
touches**:

```
npm run build; node src/config/integration.audit.mjs; node src/config/logicFixes.selfcheck.mjs
```

And **the contrast suite must be pointed at these files once they are tokenised**
(`src/config/contrast.selfcheck.mjs`) — otherwise they will pass while still being unreadable,
which is what happened with the rail. See [[Sidebar marks fade out in light mode]].

## Order

1. **Ask which logic he means.** ❓
2. **Receivables & Consignment** — no writes, seven callbacks, safe.
3. **Fleet & Roster** — bigger, and the transactions are off limits.

Related: `Three screens he asked to redesign - Sampling, Customers, Stock Opname.md` — same shape,
same promise, and Stock Opname is the one that proves it can be done without breaking anything.
