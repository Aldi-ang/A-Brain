---
title: The first bounty you mint will break the agent dashboard
description: Cash penalties are stored in the same map as stamp debts. Two of the three places that read it skip the penalties; the agent's own dashboard does not, so a Rp 200.000 fine is displayed as 200.000 stamps owed.
status: Done
area: Agent dashboard / Bounties
priority: HIGH
created: 2026-08-17
updated: 2026-09-22
---

# The first bounty you mint will break the agent dashboard

Found in the 2026-08-17 logic review, fifth pass. **This one has not fired yet. It fires the day you
mint your first bounty**, which is the feature decided today.

## What happens, in simple English

An agent's stamp debts live in one field on their record, as a list of `product -> how many stamps`.
Cash penalties (bounties) are stored **in that same list**, under names beginning with `PENALTY_`,
holding an amount in **rupiah**, not a stamp count.

Three places add that list up. Two of them skip the `PENALTY_` entries. One does not.

| Where | Skips penalties? |
|---|---|
| The EOD screen — `src/EODReconciliationView.jsx:86` | ✅ yes |
| The payment engine — `src/App.jsx:1910` | ✅ yes |
| **The agent's own dashboard — `src/AgentInventoryView.jsx:101-102`** | ❌ **no** |

## The number the agent will see

Agent owes 40 stamps and has one Rp 200.000 bounty.

- The EOD screen says: **40 stamps**
- The agent's dashboard says: **200.040 stamps**

A rupiah amount is being added into a count of stamps. Same field, two different units.

## Why it is worth fixing before the bounty feature ships

The guard exists and was added on purpose — `src/App.jsx:1910` carries the comment *"Prevent
standard stamp payments from accidentally wiping out CASH bounties"*. **That fix was applied to two
of the three copies of this formula and missed the third.** This is bug shape #1 in this codebase:
the same maths written more than once, and one copy left behind.

Right now no penalties exist, so nothing is visibly wrong. The moment the first bounty is written,
the agent opens their dashboard and sees a nonsense number about money they may be disputing. That is
the worst possible moment for the app to look wrong.

## Suggested fix, smallest version

Two options, and the second is better:

1. Add the same `!pid.startsWith('PENALTY_')` guard at `AgentInventoryView.jsx:102`. One line, done.
2. Better: move this formula into one shared function with a self-check, next to the other money
   maths in `src/config/*.selfcheck.mjs`, and have all three places call it. Three copies of a money
   formula is how this bug happened, and a fourth copy will appear otherwise.

Do 1 today so it cannot fire; do 2 when the bounty feature is built, since that work touches all
three call sites anyway.

⚠️ **Consider also storing money separately from stamps.** One map holding both a stamp count and a
rupiah amount, told apart only by a name prefix, is the underlying reason a guard was needed at all.
That is a bigger change and belongs with the bounty work, not before it.

## ✅ DONE 2026-09-22

Found already fixed on 2026-09-22's check: `src/AgentInventoryView.jsx:149` carries the `!pid.startsWith('PENALTY_')` guard with a comment naming EODReconciliationView as the twin. The shared-formula version (option 2) is still open under the bounty work.
