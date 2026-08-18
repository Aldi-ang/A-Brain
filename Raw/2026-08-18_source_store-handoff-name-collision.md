---
title: Source — store hand-off matched shops by name (2026-08-18)
type: raw
created: 2026-08-18
---

# Source — store hand-off matched shops by name

Session of 2026-08-18, KPM inventory, branch `phase0-solid-ground`. Job came from
`.claude/NEXT-SESSION.md`, written by the previous session.

## The job as written

> Fix the store hand-off matching stores by NAME instead of by id.
> WHERE: src/App.jsx:1628, the customer lookup at :1634, and the request written at :1534-1543.
> WHAT IS WRONG: handleAdminApproveTransfer reassigns EVERY transaction whose customerName
> lowercases to request.storeName. The request only ever stored storeName - there is no
> customerId on it. Line 1634 then resolves the customer with customers.find(...), which
> returns the FIRST match only.
> WHY IT MATTERS: two shops called "Toko Jaya" in different cities. Approving the hand-off of
> one reassigns BOTH shops' sales. One agent loses his receivable, another is credited with
> debt he never carried.
> FIX: store customerId on the request at :1534, filter on t.customerId === request.customerId
> at :1628 and c.id === request.customerId at :1634. Fall back to the name match ONLY when
> customerId is absent, so requests created before this change still work.

## What the code actually showed

`grep -rn "customerId" src/` returned six hits, all of them local variable names inside
`JourneyView.jsx`. **No transaction document in this app carries a customer id.**
`useTransactionEngine.js:375` writes `customerName` and nothing else; the write sites at
lines 83, 285, 342, 411 and 483 stamp `agentId: currentAgentProfileId || 'ADMIN'`.

`ConsignmentFinanceView.jsx:162-225` builds its entire customer list by grouping transactions
on `t.customerName`. `activeCustomer` therefore has no `id` field to pass, and the screen has
already merged two same-named shops into one row before the hand-off is even requested.

So the prescribed `transactions.filter(t => t.customerId === request.customerId)` would have
matched zero rows on every request created after the change: the request would be marked
APPROVED, both "transfer complete" notifications would fire, and no sale would move.

## What was built instead

Scope the sweep by `fromAgentId`, which every transaction does carry and which is the same id
space as the request's `fromAgentId` (`agentProfileId || 'ADMIN'` on both sides):

    const sameName = (v) => (v || '').trim().toLowerCase() === request.storeName.trim().toLowerCase();
    const heldBySender = (t) => request.fromAgentId === 'ADMIN'
        ? (!t.agentId || t.agentId === 'ADMIN')
        : t.agentId === request.fromAgentId;
    const storeTx = transactions.filter(t => sameName(t.customerName) && heldBySender(t));

The request still pins `customerId` when the customer document is unambiguous, narrowing by
`mappedBy === fromAgentName` when the name is shared, and approval resolves the customer doc by
that id. With no pin and a shared name, **no** customer document is updated — stamping
`mappedBy` onto the wrong twin would relabel a shop nobody handed over.

## Verification

    node src/config/logicFixes.selfcheck.mjs   # before the edit: 64 passed, 8 failed
    npm run build                              # built in 10.61s, clean
    node src/config/integration.audit.mjs      # 599 passed, 0 failed
    node src/config/logicFixes.selfcheck.mjs   # 72 passed, 0 failed

Commit `505ddcf`, two files, 75 insertions, 3 deletions.
