---
title: Damaged goods and expired stamps need a route to HQ
description: Stock Opname submits a COUNT of damaged stock for HQ verification; it never MOVES anything. Expired pita cukai has no return path at all. Both are gaps he named himself.
status: To Do
area: Stock Opname / Master Vault
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# Damaged goods and expired stamps need a route to HQ

His words, 2026-08-16: *"yea they went to the regional vault first and then on the stock opname
allow the damaged goods to be sent to the headquarters right, and yea we need to make new path for
the pita cukai as well"*.

## The two-step is intentional — do not "fix" the EOD routing

Damaged goods land at the **regional vault at EOD** and go up to HQ **later, through Stock Opname**.
`App.jsx` routing at the damaged-refs block is correct as written; an earlier session flagged it as
a mismatch and was wrong. It was a missing STEP, not a wrong route.

## What is actually missing

### 1. A transfer action: damaged units, branch → Master Vault

Stock Opname today submits a **count** with `status: 'PENDING_HQ_APPROVAL'`, notifies HQ, and logs
`STOCK_OPNAME_SUBMITTED`. It does not move a unit. His *"allow the damaged goods to be sent to the
headquarters"* is that missing action.

**Reuse, do not invent.** `StockOpnameView.jsx` already has: the `PENDING_HQ_APPROVAL` state, the HQ
notification, per-facility damaged tracking through `quarantineInventory` (MASTER vs each branch),
damaged counted separately from good **with a photo** (`damagedPhotoUrl`), a variance calculation,
and an `'HQ'` role tag. The pipeline exists; the movement does not.

### 2. A pita cukai return path — there is none at all

Expired stamps have no route anywhere today. Stamps are tracked as a debt (`cukaiDebts` on the
motorist doc) rather than as stock, so "returning" an expired stamp is not the same operation as
returning a damaged pack, and the shape needs deciding before it is built.

🔴 **Needs his answer before this half can start** — see the decisions page. An expired stamp is
either (a) written off against the agent's debt at no cost to them, (b) still their debt because
they held it too long, or (c) the company's loss recorded against the region. Those are three
different business rules and only he can pick.

## Why it matters now

Both feed the HQ dashboard he asked for — *"showing both dashboard to monitor the money convert
ratio with the available supply on the regional warehouse"*. A region's stock number is not
trustworthy while damaged units and dead stamps have nowhere to go: they sit in the branch total
forever and quietly inflate it.
