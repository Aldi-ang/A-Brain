---
title: Handing a store to another agent rewrites sales history
description: Approving a store transfer edits every past transaction for that store to name the NEW agent. The real seller is erased, the new agent inherits sales they never made, and same-named shops are dragged along.
status: To Do
area: Store transfers
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Handing a store to another agent rewrites sales history

Found in the 2026-08-17 logic review, third pass.

## What happens, in simple English

When a store is handed from one agent to another and the admin approves it, the app goes back
through **every past sale** for that store and changes the agent's name and id on each one to the
**new** agent.

The history does not say "this store used to belong to Budi and now belongs to Andi". It says Andi
made all of Budi's old sales.

## What that costs you

1. **The real seller is erased.** Budi's sales for that store vanish from his record — his day, his
   totals, anything you ever pay or rank him on.
2. **The new agent inherits work he never did.** Andi's numbers grow retroactively.
3. **You lose the ability to investigate.** Your new transfer-shortfall rule depends on asking
   *which agent handled this sale*. After a store transfer, the answer is a lie — and the answer
   cannot be recovered, because the old value is overwritten, not kept.
4. **Same-named shops get dragged along.** The rewrite selects transactions by matching the store
   **name**, so if two different shops share a name, both shops' entire histories move to the new
   agent. See [[Everything is linked by name instead of by id]].
5. **Who registered the store is overwritten too** — `mappedBy` is set to the new agent while
   `mappedById` is left pointing at the original one, so the two now disagree with each other.

## Where it is

`src/App.jsx:1628-1638`

## Suggested fix, smallest version

**Do not touch past transactions at all.** A transfer changes who is responsible from now on; it
does not change who did what last month.

Change the store record's current owner and leave history alone. If a screen needs "sales for the
store my agent now handles", it should look up the store's current owner and then find that store's
sales — not rewrite the sales to match.

If you genuinely want the new agent's dashboard to include the old sales, add a `transferredFrom`
and a transfer date to the store record and let the dashboard decide. That keeps the truth **and**
gives the new agent the view you want.

Also drop the `mappedBy` overwrite at `:1637` — that field records who first registered the store,
which a transfer does not change.
