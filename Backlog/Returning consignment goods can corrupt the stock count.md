---
title: Returning consignment goods can corrupt the stock count
description: When a store returns goods, the app adds the number without converting the unit, and uses the wrong item's unit to do the maths. Returning 2 Slop can add only 2 Bks.
status: To Do
area: Consignment / Stock
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# Returning consignment goods can corrupt the stock count

Found in the 2026-08-17 logic review.

## What happens, in simple English

Your products are counted in different sizes: Bks (pack), Slop, Bal, Karton. One Slop is usually 10
Bks. Everywhere else in the app the code converts the size before adding or subtracting.

In the **consignment return** code it does not. It adds the raw number.

So a store returning **2 Slop** — which is 20 packs — adds **2 packs** to your stock. You lose 18
packs on paper, every time.

## A second mistake in the same lines

To convert the van's stock the code needs the multiplier of the **row it is changing**. It uses the
multiplier of the **item being returned** instead. If the van row is counted in Slop but the
returned item is in Bks, the maths treats Slop numbers as pack numbers and the row comes out wrong.

The correct version of this exact calculation already exists in the sale path a couple of hundred
lines above, and that one reads the van row's own unit.

## Where it is

- Wrong multiplier source: `src/hooks/useTransactionEngine.js:415` uses `item.unit`
- Correct version to copy: `src/hooks/useTransactionEngine.js:222` uses `c.unit`
- Raw number added to the van: `src/hooks/useTransactionEngine.js:420` (`item.qty * 1`)
- Raw number added to the warehouse: `src/hooks/useTransactionEngine.js:425`
- The same raw-number bug again in the other return function:
  `src/hooks/useTransactionEngine.js:496`

## A third one right next to it: a failed return says nothing

`handleConsignmentReturn` ends with `catch (err) { console.error(err); }` at
`src/hooks/useTransactionEngine.js:504`. It does not tell the user and it does not re-throw. If the
return fails, the screen behaves as if it worked. This is the "screen says yes, database says no"
shape already recorded in the vault.

## Suggested fix, smallest version

Pull the unit-multiplier maths out of the sale path into one small helper and call it from all four
places. One helper, four call sites, and the bug cannot come back in only one of them.
