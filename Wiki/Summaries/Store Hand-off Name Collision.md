---
title: Store Hand-off Name Collision
description: Approving an account hand-off reassigned every shop sharing the store's name; the prescribed id-based fix was impossible because no transaction carries a customer id, so the sweep was scoped by sending agent instead.
type: summary
created: 2026-08-18
updated: 2026-08-18
confidence: high
checked: 2026-08-18
source: "[[../../Raw/2026-08-18_source_store-handoff-name-collision]]"
tags: [kpm, money, transfer, identity, near-miss]
---

# Store Hand-off Name Collision

**`handleAdminApproveTransfer` in `src/App.jsx` moved every transaction whose `customerName`
matched the request's `storeName`.** Two shops called "Toko Jaya" in different cities meant
approving one hand-off reassigned both shops' sales: one agent lost a receivable, another was
credited with debt he never carried. Aldi's own book has three shops sharing a name 14.5 km
apart — see [[../Concepts/A Store Name Is Not a Store]].

## The fix that could not be built

The job specified filtering on `t.customerId === request.customerId`. **No transaction document
in this app has ever carried a `customerId`.** That filter matches zero rows, so approval would
have marked the request APPROVED, fired both "transfer complete" notifications, and moved no
money at all — a textbook case of [[../Concepts/Silent Failure Disease]], introduced by the fix
rather than removed by it. The over-broad match at least fails loudly, in the balance.

## What shipped

`agentId` is on every transaction, in the same id space as the request's `fromAgentId`. The
sweep now takes the name **and** the sending agent, so only the rows the sender actually holds
move; an `ADMIN` hand-off also picks up legacy rows with no `agentId`, matching the HQ rule
already in `ConsignmentFinanceView`. The request pins `customerId` when the customer document is
unambiguous; with a shared name and no pin, no customer document is touched at all.

Residual, and deliberate: if one agent holds both same-named shops, they still merge — the
receivables screen groups by name, so it merged them before the transfer was requested. Fixing
that means re-keying `ConsignmentFinanceView` on customer id, a much larger job.

## Verified

Build clean · `integration.audit.mjs` 599/0 · `logicFixes.selfcheck.mjs` 59/0 → **72/0**
(8 regression guards, 5 behaviour checks). Guards were run red first: 8 failed before the edit.
Commit `505ddcf`.
