---
title: Offline sales never reduce the van stock
description: A sale made with no signal writes only the receipt. The van's stock is never reduced, so the agent looks short at EOD and the warehouse is credited for goods that were already sold.
status: Done
done: "4c38b91 + ac492c3 + 553cf91 (2026-08-18"
area: Offline engine / EOD
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Offline sales never reduce the van stock

Found in the 2026-08-17 logic review. **This one costs real money and it blames the agent for it.**

## What happens, in simple English

When the agent has signal, a sale does three things: it saves the receipt, it takes the goods off
the van, and it takes them out of the warehouse if the sale came from the warehouse.

When the agent has **no signal**, the sale only saves the receipt. Nothing is taken off the van.

Later, when signal comes back, the app uploads the saved receipt — and **only** the receipt. It
never goes back and takes the goods off the van.

## Why that hurts

1. **The agent looks like a thief.** The van still says 10 packs. The agent really has 6, because 4
   were sold with no signal. At EOD they count 6 and the app thinks 4 went missing.
2. **The warehouse is credited with goods that no longer exist.** At EOD the app credits the
   warehouse with what it *thinks* is still on the van, so those 4 sold packs are added back to
   stock. The stock number grows on paper every time somebody sells with no signal.
3. **Nothing stops an offline over-sale.** With signal the app refuses the sale if the van does not
   have enough. With no signal there is no check at all.

## Where it is

- Offline sale writes the receipt only: `src/hooks/useTransactionEngine.js:45-135`
- Online sale, for comparison, reduces the van: `src/hooks/useTransactionEngine.js:213-233`
- The sync that should fix it and does not: `src/App.jsx:226-291` — it pushes the receipt and
  clears the queue, and never touches stock
- The warehouse credit that trusts the van number: `src/App.jsx:1757` (`report.remainingStock`),
  fed by `src/EODReconciliationView.jsx:498` (`remainingStock: agentData.activeStock`)

## A second bug in the same area: the app asks the flag it knows is lying

`useOfflineEngine.js` carries a long comment explaining that `navigator.onLine` **lies** — it says
"online" whenever any network adapter exists, even with no real internet. That is why a real
internet probe was built and exposed as `isOnline`.

The sale path still asks the liar: `useTransactionEngine.js:45` uses `!navigator.onLine`.
The consignment path asks the honest one: `useTransactionEngine.js:355` uses `!isOnline`.

So when the phone shows signal bars but has no working internet, a **sale takes the online path**,
the write never lands, and nothing is saved to the offline ledger either. **The sale can vanish.**

## A third, smaller one: stores registered offline get a status nothing understands

`src/App.jsx:253` stamps a synced store with `status: 'PENDING_OFFLINE_SYNC'`. Nothing anywhere in
`src/` reads that value, and nothing ever changes it back. The online path writes `NOO_ACTIVE` or
`WALK_IN`. A store registered with no signal is left in a status no screen knows about.

## Suggested fix, smallest version

1. Change `:45` to use `isOnline`, so both paths ask the same honest question.
2. When an offline sale is saved, subtract from the van in the local copy too — the same
   subtraction the online path already does — so the phone tells the truth all day.
3. At sync, replay that subtraction against the server instead of only uploading the receipt.
4. Write the same status the online path writes.

**Do not build a second stock engine.** The online path already has the maths; the offline path
should call it, not copy it. Copying it is what caused this.
