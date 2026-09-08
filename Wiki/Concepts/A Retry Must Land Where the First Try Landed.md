---
confidence: high
checked: 2026-09-08
---

# A retry must land where the first try landed

Found 2026-09-08 while ranking what may not ship to a paying customer. Aldi's call was to fix it
rather than accept the frequency: *"better fix the offline one its important, make sure offline also
works well tho"*. Repo fix: `e9b04e5`.

## What was wrong

`commitInChunks` (`src/utils/helpers.js`) is **several commits, not one transaction** — Firestore
caps a batch at 500 writes, so a big upload is genuinely a sequence. It throws on a failed chunk
while the earlier chunks are already committed.

The offline drain then cleared the local queue **only after the whole thing succeeded** — which is
right for data loss and is exactly what created this. A failure partway left every sale in the
queue, including the ones already in the vault, and the retry sent them again under fresh random
document ids. Duplicate receipts, and doubled revenue, because the rollup tally rides the same
operations list.

Threshold: roughly 225 offline sales in one drain, two operations each. Rare, and rare is not the
same as harmless when the subject is money.

## The trap, which is the whole reason this page exists

**The obvious fix is worse than the bug.** Making the document id deterministic from `localId` looks
correct and is not: `localId` is IndexedDB `autoIncrement`, so it counts **1, 2, 3 per device**. Two
salesmen's first offline sale would both be id 1, and one would **silently overwrite the other**.

> Losing a sale is worse than duplicating one. A fix that converts a loud fault into a silent one is
> not a fix.

The id has to be random and decided **when the record is queued**, so it travels with the record in
IndexedDB and every retry addresses the same document.

## The shape worth reusing

1. **Decide the destination early.** An id minted at upload time cannot survive a retry; one minted
   at capture time can. This is the general form of idempotent upload, and it costs nothing.
2. **Acknowledge at the granularity you commit at.** If the write is N commits, the bookkeeping must
   be N acknowledgements. All-or-nothing bookkeeping over a partial write is what re-sends work.
3. **Never acknowledge before the write.** That rule predates this fix and cost sales once already.
   What changed here was granularity, not order.
4. **Say how much is safe.** The old message was "Sync Failed" whatever happened, which reads as
   *nothing went through* — and a salesman who believes that re-enters sales already in the vault.
   It now says how many landed, how many are waiting, and not to re-enter them.
   See [[Silent Failure Disease]].

## What is still not exactly-once, on purpose

`sales_stats` is written with `increment()`. If a chunk commits and the IndexedDB acknowledgement
then fails, the counter can drift even though the receipt cannot duplicate. That is accepted rather
than engineered away, because the rollup is already documented as a cache the transactions can
rebuild — see [[A Rollup Is a Cache, Not a Ledger]] — and the Settings rebuild is the repair. A
counter that can be recomputed from the ledger does not need to be exactly-once; the ledger does.

## Related

- [[A Rollup Is a Cache, Not a Ledger]]
- [[Silent Failure Disease]]
- [[Looking Inside the App]]
