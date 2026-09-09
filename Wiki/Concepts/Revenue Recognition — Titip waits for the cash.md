---
confidence: high
checked: 2026-09-09
status: DECIDED and SHIPPED — a6192b1
---

# Revenue recognition — a Titip placement is not income

## The decision, in his words

> "omset come after goods is sold and money is received, receivable doesnt count, should have their
> own data and panel for receivable outside of the revenue or omzet" — Aldi, 2026-09-09

and, asked whether the quantity column beside the money should follow the money or the warehouse
door, given a packet that has left the vehicle but not been sold:

> "A for the sold bks mean"

Option A was: *"sold" follows the money — the packet counts as sold only when the store audit says
the shop sold it, while stock screens still show it gone from the warehouse.* One row should not
tell two stories.

## The problem it settled

Found on the [[2026-09-09_day-one-walk]]. One cash sale of Rp 2.000 and one Titip placement of
Rp 24.000, then a store audit declaring the Titip packet **still on the shelf, unsold**:

| screen | said | right? |
|---|---|---|
| Sales Terminal `TAKEN` · Dashboard `OMZET` · Product Performance | Rp 26.000 | no |
| Receivables · store audit receipt · EOD expected cash | Rp 24.000 owed · 0 Laku · Rp 2.000 | yes |

Rp 2.000 was actually collected. The same Rp 24.000 was counted as revenue **and** as debt at once,
and the audit that proved it unsold moved nothing.

## Why it happened — the part worth remembering

**The rule was already written, correctly, in exactly one place.** `EODReconciliationView` has read
`(SALE && method !== 'Titip') || CONSIGNMENT_PAYMENT` since before the rollup existed, which is why
EOD asked the salesman for the right cash while the dashboard above it claimed twelve times more.
Seven other screens each carried their own hand-written `type === 'SALE'` and each got it wrong the
same way.

So this was never a hard problem. It was **the same rule copied eight times and maintained once.**
A rule kept in one place can still be wrong; it cannot DISAGREE with itself, and the disagreement is
what cost a day. Same shape as the [[UI-Says-Yes-Server-Says-No Pattern]] — two authorities on one
question, and nothing that forces them to match.

## What shipped

`a6192b1`. The rule now lives in `src/utils/revenueRule.js`:

- `isTitip` / `countsAsRevenue` / `revenueOf` / `soldLinesOf` — one definition of money
- `outstandingTitip` — the receivable, floored **per customer** so one shop's overpayment cannot
  cancel another's debt
- A missing `type` still means `'SALE'`, matching the old `isSale`. Records written before the field
  existed would otherwise drop silently out of omzet.

Its own module rather than a function in `salesRollup`, because `dayStats` needs it too and the two
would otherwise import each other.

**It is not a reversal of `f46bc4a`.** That fix subtracted a store audit's `itemsReturned` because
the placement had already booked the full drop at the shop door. With nothing booked there is
nothing to reverse, and subtracting anyway would drive the month negative by the value of every
returned packet. `f46bc4a`'s own comment named the half it could not reach — goods still unsold on
a shelf — and said the call was Aldi's. He made it, and the answer moved the whole rule from the
symptom to the cause. Three regression checks pin the old form out.

## The second bug, found while proving the first was repairable

`handleRebuildSalesStats` and `isRebuildingStats` were passed to `<DashboardView>`, which reads
neither. `SettingsView` gates the whole rebuild block on `isSystemOwner && handleRebuildSalesStats`,
so that gate was permanently false and **the "Rebuild the sales totals" button had never rendered
for anybody.**

That button is the only thing that restates months already written. Without it, this decision would
have applied to the future and left every past month wrong forever — a fix that looks complete and
silently is not. Found only because "prove the repair path works" was treated as part of the job
rather than as a claim. Pressing it took the cached month from 26000/2 Bks to 2000/1 Bks.

## Verified

Walked in the emulator on the exact data that lied the day before:

- Dashboard **OMZET Rp 2.000** with **`Piutang titip · belum dibayar Rp 24.000`** beside it
- Leaderboard Rp 2.000 · 1 transaksi
- Product Performance 1 Bks · Rp 2.000
- cached `sales_stats/2026-09` 26000/2 → 2000/1 after the rebuild
- 1382 selfcheck · 722 audit · build clean · no new undefined identifiers

## Rejected on purpose

- **Making a cash refund reduce omzet.** Defensible under "money received", but he was asked about
  consignment, it is a second rule, and it restates history again. `dayStats` already nets refunds
  out of the day's takings; nothing else does. Written down, not built.
- **Making VOLUME DISTRIBUSI follow the money too.** That box is named for goods distributed and a
  placement really did leave the warehouse. Money and volume are now counted separately on the same
  card on purpose, and the code says so.
- **Recomputing the receivable inside the dashboard.** `ConsignmentFinanceView.debtData` is the
  truth; `outstandingTitip` mirrors the sum its per-customer FIFO leaves standing. If the two ever
  disagree, that screen is right and this one is the bug — recorded in the function's own comment.
- **Doing the camera half in the same session.** He answered both questions at once; the money half
  is ranked above it by his own order, and starting the second would have risked stranding it.

## What he still has to do

**Press Settings → General & Brand → "Rebuild sales totals" once on the live app.** Nothing is
deleted. September will drop by the value of every Titip packet still sitting unaudited on a shelf,
and that fall is the correct number.
