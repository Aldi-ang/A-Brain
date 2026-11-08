---
title: Everything is linked by name instead of by id
description: A sale records the store's NAME, never its id. Agent assignments record the agent's NAME. Rename either one, or have two shops share a name, and the records silently attach to the wrong thing.
status: To Do
progress: "partly: hand-offs and the map find a shop by its id (505ddcf, a3a9cf6); a sale still saves the shop name"
area: Whole app / data model
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Everything is linked by name instead of by id

Found in the 2026-08-17 logic review, second pass. **This is the root cause under three of the
other flaws found today.**

## What happens, in simple English

Every store has an id — a permanent code that never changes. Every sale **ignores it** and saves
the store's **name** as text instead.

So the link between a sale and a store is the spelling of the name. Nothing else connects them.

The same is true for agents: assigning a store to an agent saves the agent's **name**, not their id.

Checked, not guessed: no transaction anywhere in the app writes a customer id, and **142 places**
in the code join records by `customerName`.

## What breaks because of it

1. **Two real shops with the same name share one debt.** Your own duplicate-finder already knows
   this happens — it warns that two shops sharing a name and sitting kilometres apart are *probably
   not* duplicates. But every debt calculation groups by name only, so those two shops have one
   merged bill. One shop's unpaid money shows on the other's screen.
2. **Renaming a store detaches its whole history.** The old sales still say the old name. The store
   record says the new one. Nothing joins them again.
3. **Renaming an agent breaks every store assigned to them**, for the same reason.
4. **A typo or a stray space makes a second, invisible store.** One debt calculation trims spaces
   before comparing and another does not, which is one of the reasons the two disagree.
5. **It is why a sale can land on the wrong store at all** — the lookup has nothing but the name to
   go on. See [[A sale can be booked to the wrong store]].

## Where it is

- The sale payload, with no customer id: `src/hooks/useTransactionEngine.js:243-266` (online) and
  `:74-96` (offline)
- Agent assignment saved as a name: `src/JourneyView.jsx:505-526`
- The duplicate-finder that already knows two shops can share a name:
  `src/components/CustomerManager.jsx:736-741`

## Suggested fix — and why it should be done in two steps

**Do not rewrite 142 places.** Do this instead:

**Step 1, cheap and safe:** start writing `customerId` onto every new sale *alongside* the name.
Nothing reads it yet, nothing breaks, and from that day forward the data is repairable.

**Step 2, later:** move the debt calculations to prefer the id and fall back to the name for old
records. Old sales keep working; new ones become exact.

Doing step 1 today costs almost nothing and stops the problem growing. Every day it is not done,
more records are created that can never be untangled.
