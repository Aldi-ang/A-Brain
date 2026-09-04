---
type: concept
confidence: high
checked: 2026-09-05
---

# Ownership Moves, History Does Not

**The rule, in one line:** when a store changes hands, the sales stay with the agent who made
them and only the *ownership* moves. Anything that rewrites the past to move a debt is a bug.

## The problem

Approving a store hand-off used to walk every past transaction of that shop and overwrite
`{ agentId, agentName }` with the receiving agent. It looked harmless — the debt followed the
store, which is what everyone wanted.

It was not harmless. It destroyed the only record of who actually made each sale. Aldi's answer
to the transfer question, 2026-09-05, verbatim:

> "then andi and budi but andi should be view only and budi can edit the value and of course add
> history on the receipt the hands off thats tell Andi -> Budi"

That rule **cannot be stated at all** against a rewritten record. "The seller may edit, the
receiver may not" needs a seller to still exist on the row. The rewrite deleted him.

## Why the rewrite existed — the trap

`ConsignmentFinanceView` scopes an agent's receivables by the agent stamped on each transaction
(`t.agentId === agentProfileId`). Restamping was the **only** mechanism handing the store's
outstanding debt to its new holder.

So deleting the rewrite on its own would have produced a worse bug than the one being fixed: an
agent owning a store he cannot see the debt of, in an app being prepared for sale. **A bad
mechanism cannot simply be removed — its job has to be given to something else first.**

## The shape that was built (39cd90d)

| Requirement (his words) | Where it lives |
|---|---|
| Both agents keep seeing the old sales | rows keep their author; the receiver gets a *second* way in |
| The receiver is view-only | refused in `handleDeleteConsignmentData`, not by hiding a button |
| The seller keeps edit rights | same guard, symmetric — nobody bulk-erases rows they did not write |
| The hand-off is on the receipt | `SERAH` on the thermal slip, `Alih Kelola` on the A4 |

Ownership lives on the **customer document** now: `ownerAgentId`, `ownerAgentName`, and a
`handoffs` array holding `{fromId, fromName, toId, toName, date}` per transfer. The receivables
screen builds the inherited set from the owner plus that chain, so `A -> B -> C` still reaches C.

**`mappedBy` was NOT repurposed.** `handleRequestTransfer` reads it to tell two same-named shops
apart, and it records who first registered the store. "Current owner" is a separate field. See
[[A Store Name Is Not a Store]] for why same-named shops are the live hazard here.

## The two traps a lazy build walks into

1. **View-only hidden in the UI is not view-only.** Hiding an edit control leaves the handler
   callable — the [[UI-Says-Yes-Server-Says-No Pattern]]. The refusal sits in the handler, before
   the confirm dialog and before any batch is built. The matching Firestore rule is *proposed*,
   not deployed — `firestore.rules` is a draft here.
2. **Removing a mechanism orphans its checks.** Two self-check assertions pinned the sweep's
   scoping and died with it. Retiring them silently would have removed a guard with no successor;
   they were replaced in place by assertions that the sweep is *absent* and that the debt still
   arrives.

## Open

The arrow direction on the receipt. His sentence reads "Andi -> Budi" while the example he was
answering had Budi handing the store **to** Andi. It renders `from → to` today, which is the
literal record. Worth one confirmation the first time he sees a real nota with the line on it.
