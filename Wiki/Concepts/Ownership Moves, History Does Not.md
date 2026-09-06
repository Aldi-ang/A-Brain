---
type: concept
confidence: high
checked: 2026-09-06
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

## Settled — the arrow reads sender first

Asked whether the receipt's hand-off line should read `from → to` or the reverse, Aldi answered,
2026-09-05: *"if budi to andi then Budi -> Andi"*. Sender on the left, receiver on the right, which
is what shipped. His earlier "Andi -> Budi" was naming the two people, not fixing a direction.

Nothing is open on this concept. The one thing still owed is **his**, not the code's:
the matching Firestore rule is drafted, not deployed — see `Backlog/Deploy the store hand-off write
rule.md`. Until that lands, the refusal exists only in the handler.

## The first live test, 2026-09-05 — the debt arrives, the button does not

Aldi ran the flow end to end for the first time: Tier 1 sells on consignment, hands the store to a
test agent account, swaps accounts, accepts. Three faults, none of them in the hand-off logic
itself, all of them in the screen around it.

**1. The receiver goes blind the moment he accepts.** `ConsignmentFinanceView.jsx:269` lists
incoming hand-offs with `status === 'PENDING_AGENT'`. Accepting moves the status to
`PENDING_ADMIN`, so the card correctly disappears — and nothing replaces it. The
`pendingAdminRequests` list (`:987`) renders only for `isAdmin`, and `outgoingRequests` (`:270`)
matches only requests the viewer **sent**. The receiver is neither, so he sees no trace of a
request he just accepted. It reads as "I pressed the button and it deleted itself".

**2. The admin was never actually blocked.** The bell is broken (separately, cause not yet found),
but approval does not need it: Receivables shows an **Admin Auth Required** card with *Authorize
Transfer*, and `pendingAdminRequests` (`:271`) filters on status alone with no agent scoping. Worth
remembering as a shape — *a notification is a shortcut to a screen, never the only door to it.* The
flow looked dead when only its shortcut was.

**3. The one that matters: Store Audit is admin-only.** `ConsignmentFinanceView.jsx:961` wraps the
Store Audit button in `isAdmin &&`, and collecting money and updating the shelf both run through it
(the audit confirm calls `onPayment`). Line `:963` gives the Transfer button `col-span-4` when
`!isAdmin` — the layout was deliberately written for "an agent sees only the hand-off button".

So a field agent has never been able to collect on a consignment store at all. The hand-off work
made the inherited debt **visible** to the agent who now owns it; this gate means he still cannot
**act** on it. Aldi's words: *"i should be able to update the shelf and collect money"*.

**The lesson worth keeping:** making data reachable is not the same as making it actionable. The
read path and the write path are gated by different code, and a fix that only proves the read path
looks finished while the feature is still dead. Any future "agent X can now see Y" work should ask,
in the same pass, which button acts on Y and who is allowed to press it.

Not fixed yet — Aldi ranks first, and removing that gate is a permission change on a money path.

## Aldi's scope answer, 2026-09-05 — locked

Asked which stores a field agent may run Store Audit on, he answered:

> *"of course the consignment that they made or receive from other handsoff, that is the only store
> that they see"*

So the audit scope is exactly the receivables scope that already exists — stores whose consignment
he made himself, plus stores handed to him. Not "any store on screen", and there is no third case:
those two ARE everything an agent can see. Ungating `ConsignmentFinanceView.jsx:961` therefore needs
no new filter, because `myTransactions` is already that list. What it still needs is the decision
about the audit's *write* half: the audit records shelf counts and retur alongside the payment, and
inherited rows are meant to be view-only for their values.

## And the bell is not a footnote — his correction, 2026-09-05

I ranked the broken bell last because the transfer could still be approved from the Receivables
card. He rejected that:

> *"u cant just ignore the notification bell like that, i can see that there is notification number
> but the panel wont shows up even when i press it, therefore i dont know what notification is
> coming to my account because notification bells have so many usage and not just for the
> consignment"*

He is right and the reasoning is worth keeping: **a shared surface cannot be triaged inside one
feature's story.** The bell carries stock requests, EOD, approvals, transfers and more. Judging it
by "does the transfer flow still have another door" measured the wrong thing entirely — the badge
counts correctly, so every one of those features is silently delivering mail nobody can open.

The badge number proves the data path is healthy (`NotificationBell.jsx:15` counts from the same
array the panel renders at `:86`), which narrows it to rendering: `isOpen` flips, the panel mounts,
and something upstream hides it. Prime candidate is `BiohazardTheme.jsx:941` —
`relative z-10 ... overflow-hidden` wrapping the header the bell sits in. That combination clips an
absolutely-positioned dropdown and traps its `z-[9999]` inside a `z-10` stacking context. Unproven:
nothing was rendered, so this stays a candidate, not a cause. The comment at `:1032` shows a
previous session already fought a stacking bug on this exact bell and removed a decoy `z-[9999]`.

## Who may receive it at all (2026-09-06)

Ownership moving cleanly says nothing about *whom* it may move to. That half shipped separately as
`handoffEligibility` — one predicate in `src/config/permissions.js`, enforced in the picker and at
the write, refusing an off-roster agent, an owner account, the current owner, an unplaced agent at
either end, and a cross-branch hand-off by anyone below tier 3. Aldi's rule, 2026-09-05:
*"consignment should only be transferred between regional team member only, and only tier 1,2,3 is
the one who can transfer consignment between regional area personnel."*

The **approving** half is still unbuilt. Aldi chose Option B on 2026-09-06: a tier delegated
approval power over a region is *added* beside him, never replacing him. See
[[../Summaries/The Shorter List Was Never the Eligible One]] and
[[../../Brainstorm/2026-09-06_handoff-approval-region-matrix]].
