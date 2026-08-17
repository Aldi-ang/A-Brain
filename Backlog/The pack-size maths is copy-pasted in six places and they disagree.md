---
title: The pack-size maths is copy-pasted in six places and they disagree
description: Converting Slop/Bal/Karton into packs is hand-written in at least six places. Two of them are wrong in different ways. This is the root cause behind several separate stock bugs.
status: To Do
area: Stock / whole app
priority: HIGH
created: 2026-08-17
updated: 2026-08-17
---

# The pack-size maths is copy-pasted in six places and they disagree

Found in the 2026-08-17 logic review. **Fix this one and three other bugs stop being possible.**

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

## What each broken one costs you

**`useTransactionEngine.js:415`** — when a store returns goods, the app converts the van's stock
using the size of the *returned item* instead of the size of the *van row*. If the van row is
counted in Slop and the return is in packs, Slop numbers get treated as pack numbers. See
[[Returning consignment goods can corrupt the stock count]].

**`App.jsx:3132` / `:3142`** — the sampling edit screen only knows about Slop. A van row counted in
Bal or Karton is treated as if it held single packs, so editing a sample can wipe out or invent a
large amount of stock. The correct version, handling all four sizes, sits about sixty lines above
it in the same file.

## Suggested fix, smallest version

Write the conversion **once**, in `src/utils/helpers.js`, next to the other shared helpers:

```
packsPerUnit(unit, product)   // 'Bks' | 'Slop' | 'Bal' | 'Karton' -> a number
```

Then replace all six copies with a call to it. Leave one small self-check beside it — the same
pattern the money maths in `src/config/*.selfcheck.mjs` already uses — asserting that a Karton is
bigger than a Bal is bigger than a Slop is bigger than a pack, and that an unknown size returns 1.

**Do not add a seventh copy while fixing the two broken ones.** That is how this started.

## Related

- [[Returning consignment goods can corrupt the stock count]] — one of the two broken copies
- [[Offline sales never reduce the van stock]] — same root habit: the offline path re-implements
  what the online path already does, instead of calling it
