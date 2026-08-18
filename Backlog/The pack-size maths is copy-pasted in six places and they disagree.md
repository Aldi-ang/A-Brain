---
title: The pack-size maths is copy-pasted in seven places and they disagree
description: Converting Slop/Bal/Karton into packs is hand-written in at least seven places. Three of them are wrong in different ways. This is the root cause behind several separate stock bugs.
status: Done — f51a3a9 (2026-08-18)
area: Stock / whole app
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# The pack-size maths is copy-pasted in seven places and they disagree

Found in the 2026-08-17 logic review. **Fix this one and three other bugs stop being possible.**
(The file name still says six — a seventh copy turned up on the second pass. Renaming a Backlog
file breaks the links pointing at it, so the count lives in the title, not the filename.)

## What happens, in simple English

Your products come in nested sizes: pack (Bks) → Slop → Bal → Karton. To do any stock maths the app
must first turn everything into packs.

That conversion is written out **by hand, from scratch, in at least six different places**. It is
the same three lines each time. Two of the six copies are wrong, and each is wrong in a different
way — which is exactly what you would expect from six copies.

## The six places, and which are broken

| Where | Handles | Verdict |
|---|---|---|
| `src/hooks/useTransactionEngine.js:155-157` | all 4 sizes | ok |
| `src/hooks/useTransactionEngine.js:222` | all 4 sizes, reads the van row's own size | **the correct pattern** |
| `src/hooks/useTransactionEngine.js:415` | all 4 sizes, but reads the **returned item's** size | ❌ wrong source |
| `src/App.jsx:1813-1815` | all 4 sizes | ok |
| `src/App.jsx:3075` | all 4 sizes, reads the van row's own size | ok |
| `src/App.jsx:3132` and `:3142` | **Slop only** | ❌ Bal and Karton silently treated as single packs |
| `src/FleetCanvasManager.jsx:321` | **no conversion at all** | ❌ adds a pack count straight onto a row that may be counted in Slop |

**A seventh copy was found on the second pass** and it is the worst of them: Load Canvas always
loads in packs, and when the vehicle already has a row for that product it just adds the two
numbers together (`:321`). If that row is counted in Slop, loading 10 packs adds **10 Slop** — the
warehouse loses 10 and the van gains 100. Clear Canvas, forty lines below in the same file, does
convert properly (`:379`), which is how the two ends stop agreeing.

## What each broken one costs you

**`useTransactionEngine.js:415`** — when a store returns goods, the app converts the van's stock
using the size of the *returned item* instead of the size of the *van row*. If the van row is
counted in Slop and the return is in packs, Slop numbers get treated as pack numbers. See
[[Returning consignment goods can corrupt the stock count]].

**`App.jsx:3132` / `:3142`** — the sampling edit screen only knows about Slop. A van row counted in
Bal or Karton is treated as if it held single packs, so editing a sample can wipe out or invent a
large amount of stock. The correct version, handling all four sizes, sits about sixty lines above
it in the same file.

## ✅ THE FIX IS SMALLER THAN IT LOOKS — the shared helper already exists

Found while checking the last copy: **`convertToBks(qty, unit, product)` is already written**, in
`src/utils/helpers.js:97-107`. It handles all four sizes correctly and defaults sensibly.

A few places already call it — `FleetCanvasManager.jsx:379`, `MerchantSalesView.jsx:1410`,
`ConsignmentFinanceView.jsx`. **Roughly ten other places ignore it and hand-write the same three
lines**, and three of those hand-written copies are wrong.

So this is not "write a helper". It is **"call the helper that is already there"**.

Three more hand-written copies live in `src/MerchantSalesView.jsx` alone — `:87-89`, around `:545`,
and around `:672` — none of them broken today, all of them free to drift tomorrow.

## Suggested fix, smallest version

1. Fix the three broken copies **by replacing them with a `convertToBks` call**, not by patching
   the maths in place: `useTransactionEngine.js:415`, `App.jsx:3132`/`:3142`,
   `FleetCanvasManager.jsx:321`.
2. Then replace the rest, one file at a time, whenever that file is being touched anyway.
3. Add one self-check beside the helper — the same pattern `src/config/*.selfcheck.mjs` already
   uses for the money maths — asserting a Karton is bigger than a Bal is bigger than a Slop is
   bigger than a pack, and that an unknown size returns the quantity unchanged.

**Do not add an eleventh copy while fixing the three broken ones.** That is how this started.

⚠️ **The price-tier ladder has the same disease.** `priceRetail / priceEcer / priceGrosir` is
written out five separate times in `MerchantSalesView.jsx` (`:82-84`, `:541-543`, `:602-604`,
`:667-669`, `:1405-1407`). None is wrong today. There is no shared helper for it yet, and by the
same argument there should be.

## Related

- [[Returning consignment goods can corrupt the stock count]] — one of the two broken copies
- [[Offline sales never reduce the van stock]] — same root habit: the offline path re-implements
  what the online path already does, instead of calling it
