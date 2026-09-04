---
title: Handing a store to another agent rewrites sales history
description: Approving a store transfer edits every past transaction for that store to name the NEW agent. The real seller is erased, the new agent inherits sales they never made, and same-named shops are dragged along.
status: Done
area: Store transfers
priority: HIGH
created: 2026-08-17
updated: 2026-09-05
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

## ✏️ CORRECTION — 2026-09-05. **The suggested fix above is wrong as written.**

"Do not touch past transactions at all" would ship a worse bug than the one it fixes.

`ConsignmentFinanceView.jsx:59` scopes a consignment/receivables view by
`t.agentId === agentProfileId`. The rewrite at `App.jsx:1746-1749` is what moves the store's
outstanding debt onto the new agent's screen. Delete it on its own and the agent who now owns the
store cannot see, chase or collect what that store owes — the debt disappears from every agent view
and only Admin can still find it. For a paying customer that reads as lost money, not as fixed
history.

So this item is **not** a four-line delete. The real shape is: stop rewriting history, and give the
receivables view a second way to find a store's transactions — by the store's current owner, not by
the agent stamped on each old row. That is a change to how one screen queries, and it needs Aldi's
answer to the question the item already raises: after a hand-off, whose dashboard shows the old
sales — the seller's, the new owner's, or both.

Also still true and unchanged: `mappedBy` is overwritten at approval while `mappedById` is not, so
the two disagree afterwards. Do not drop that overwrite blindly either — `App.jsx` uses
`c.mappedBy === fromAgentName` at request time to tell two same-named shops apart.

Partly hardened since this was written: the request now pins `customerId` when the sender's own
ownership can single one shop out, and the rewrite is filtered by `heldBySender`, so a same-named
twin's rows no longer move.

## ✅ ALDI DECIDED — 2026-09-05. Both see it; the new owner is view-only.

His words, verbatim:

> *"then andi and budi but andi should be view only and budi can edit the value and of course add
> history on the receipt the hands off thats tell Andi -> Budi"*

Read as three requirements:

1. **Both agents see the store's old sales.** Neither dashboard loses them.
2. **The agent who RECEIVES the store sees them read-only.** He can look, chase and collect; he
   cannot change a number he did not write. The agent who MADE those sales keeps the right to edit
   their values.
3. **The hand-off is recorded and visible on the receipt / history**, naming both sides and reading
   as a hand-off, not as a silent change of owner.

What that settles: **the rewrite at `App.jsx:1746-1749` goes.** Past sales keep the agent who made
them, which is requirement 2's whole basis — you cannot grant "the seller may edit, the receiver may
not" while the record says the receiver was the seller. The debt reaches the new agent through the
store's CURRENT OWNER instead, not by restamping history.

⚠️ **Direction check for whoever builds this.** The example he answered was "Budi hands his store to
Andi", so the receiving agent is Andi and the selling agent is Budi. His line reads "Andi -> Budi".
Build it as a rule about roles — *receiver is view-only, seller keeps edit* — and let the receipt
render whichever two names apply. Confirm the arrow's direction with him when the receipt line is
drawn, not before.

⚠️ **Read-only must be enforced where the WRITE happens, not by hiding a button.** This is the
"UI Says Yes, Server Says No" shape already in the vault. Hiding an edit control in
ConsignmentFinanceView leaves the write path open; the rule and the handler both have to refuse it.
`firestore.rules` stays a draft until Aldi deploys it himself.

## ✅ BUILT AND SHIPPED — 2026-09-05, `39cd90d`

Past sales keep the agent who made them. Ownership moved to the customer document —
`ownerAgentId`, `ownerAgentName`, and a `handoffs` array holding `{fromId, fromName, toId, toName,
date}` per transfer. `ConsignmentFinanceView` reaches the inherited debt through that owner plus the
hand-off chain, so `A -> B -> C` still reaches C, and the new holder can see and collect a debt he
now owns. `handleDeleteConsignmentData` refuses rows the caller did not make — both sides, before
the confirm and before any batch is built. `mappedBy` was not repurposed; it still does its own job
at request time.

The nota carries the line: `SERAH` on the thermal slip, `Alih Kelola` on the A4.

**The arrow question is answered.** Aldi, 2026-09-05: *"if budi to andi then Budi -> Andi"*. The
receipt renders `from → to`, which is what shipped — sender on the left, receiver on the right. His
earlier line reading "Andi -> Budi" was the two names, not the direction. No change needed.

Still open, and it is Aldi's to run: [[Deploy the store hand-off write rule]]. The handler refuses
the write today; the database does not.
