# SWEEP — history reports and the audit vault

## Status, checked against the app 2026-11-08 (Claude, his "check the notes, fixes and test it yourself")

✅ fixed 2 · 🔴 still open 0 · ❔ not confirmed 5 (that code was rewritten since August; it needs a read before anyone calls it fixed or open).
Tested: all 16 self-check suites pass (logicFixes 2836/2836 holds a check for every ✅ that names a section).

- 1 ✅ #12, ec3fda7 (the edit box converts from real packing fields)
- 2 ❔
- 3 ✅ likely: f46bc4a (goods that come back stop counting as sold)
- 4 ❔
- 5 ❔
- 6 ❔
- 7 ❔

---

7 confirmed problems in `src/components/HistoryReportView.jsx` and
`src/components/AuditVaultView.jsx`.

---

## 1. 🟠 HIGH — The transaction edit box reprices Karton and Bal from a field that does not exist

**Where:** `src/components/HistoryReportView.jsx:319` (and `:322`, `:334`, `:337`)

**In plain English:** to convert a unit into packs, this screen reads a product field called
`slopPerKarton`. **That field is written nowhere in the entire app.** The real fields are
`packsPerSlop`, `slopsPerBal`, `balsPerCarton`. So the lookup always fails and falls back to a
hardcoded 10.

**What happens:** for a product where 1 Karton = 800 packs, the edit box treats a Karton as
**100 packs**. You open Data Audit on a sale, change the unit to Karton at Rp 25.000 a pack, and
it computes **Rp 2.500.000 instead of Rp 20.000.000** — then saves that as both the total and
the amount paid. There is no branch for **Bal** at all, so choosing Bal prices 200 packs as one
pack. Slop is hardcoded to 10 regardless of the product.

**The checker noted who this hits:** the write lands in the *owner's* vault, i.e. the account
most likely to be doing a Data Audit in the first place.

**Smallest fix:** replace all four hand-written multipliers with `convertToBks(1, unit, product)`
— already imported at the top of this file.

---

## 2. 🟡 MEDIUM — A folder's total and that folder's Context Analytics total are computed differently

**Where:** `src/components/HistoryReportView.jsx:245`

**In plain English:** the folder cards work out who owns a sale by **ID**. Context Analytics
works out the same thing by matching the **name text** stored on the sale, and hardcodes admin
sales to "Headquarters".

**What happens:** the owner's record has location "Magelang". Admin sales are added to the
Magelang folder, which shows Regional Gross Rp 20.000.000. Click Magelang, open Context
Analytics — every admin sale is dropped and **Context Revenue reads Rp 0.**

**The checker found a bigger case than the one reported:** the same split breaks on **any
renamed agent**. The folder is built from the agent's *current* name while the filter matches the
name *frozen into each old sale* — so the folder shows a total and clicking it returns zero rows.

**Smallest fix:** make Context Analytics filter on the same resolved identity the folder cards
use — join by agent ID, not by name string.

---

## 3. 🟡 MEDIUM — Returned goods are counted as sold *and* subtracted at the same time

**Where:** `src/components/HistoryReportView.jsx:279`

**In plain English:** the revenue line correctly subtracts returns. The per-product loop three
lines below adds quantities and values with **no check for returns at all**.

**What happens:** a store returns 10 Slop of Djarum. "Context Revenue" correctly shows
**−Rp 200.000**. The Product Performance row for Djarum shows **+100 Bks and +Rp 200.000**. The
"Items Moved (Bks)" tile counts the 100 returned packs as sold. **Print the report and the
product table does not add up to the revenue headline.**

**Smallest fix:** work out the sign once per transaction and apply it to both the quantity and
the value, using the same return test the display rows already use.

---

## 4. 🟡 MEDIUM — Editing a transaction changes the money and quantities but not the stock

**Where:** `src/components/HistoryReportView.jsx:344`

**In plain English:** the edit saves date, customer, total, amount paid, tier and items —
nothing else. It never touches product stock and never recomputes profit.

**What happens:** an admin corrects a sale from 2 Slop to 20 Slop. Revenue, folder totals and
Product Performance all move by 18 Slop — but **18 Slop of stock that was never deducted stays
on the books**, and "Net Profit (Cuan)" still reports the profit of a 2-Slop sale, because
profit was frozen at the moment of sale.

**Note the inconsistency:** the *delete* path warns "Stock will NOT be restored automatically".
The edit path gives no such warning.

**Smallest fix:** work out the pack difference per product between the old and new item lists
and apply it in the same write — or block quantity edits and warn like the delete path does.

---

## 5. 🟢 LOW — Every return is debited from the Cash column no matter how it was paid

**Where:** `src/components/HistoryReportView.jsx:265`

**In plain English:** the return branch subtracts from Cash and ignores the transaction's own
payment method entirely — even though it worked that method out two lines earlier.

**What happens:** a store on Titip returns Rp 1.000.000 of damaged stock. The payment breakdown
shows **Cash −Rp 1.000.000** and leaves Titip at its full amount. An admin reconciling the cash
box against the report is short by a million rupiah that was never cash.

**Smallest fix:** subtract from the transaction's own payment method instead of hardcoding Cash.

---

## 6. 🟢 LOW — The Audit Vault's "Revert" button can never appear

**Where:** `src/components/AuditVaultView.jsx:159`

**In plain English:** the Revert button and the "REMOTE SNAPSHOT LOADED" tag both require two
fields — `snapshotId` and `snapshotPath` — that **nothing in the app ever writes.** A search of
the whole codebase finds them only inside this one file.

**What happens:** 40 lines of restore logic can never run. The vault's stated purpose —
recovering from a bad write — does not exist.

**Downgraded from MEDIUM by the checker,** on a fair point: because the button is hidden by the
same missing field, the UI never *offers* a Revert that then fails. Nothing misleads you in the
moment. The feature is simply absent. **The risk is planning a recovery around something that
isn't there.**

**Smallest fix:** either gate it on `isSavePoint` (the flag the audit logger actually writes)
and build the snapshot upload, or delete the dead restore UI so nobody counts on it.

---

## 7. 🟢 LOW — A failed vault read looks exactly like an empty day

**Where:** `src/components/AuditVaultView.jsx:79`

**In plain English:** the error handler writes to the console and stops the spinner. It sets no
error state, so the screen renders its normal empty message.

**What happens:** if a read is ever denied, an admin investigating a suspected bad write opens
2026-08-14, sees **"/// Sector Empty ///"**, and concludes nothing was logged that day.

**Downgraded from MEDIUM:** the checker confirmed no denial can actually happen under the
current rules — reader and writer use the same ID, which is permitted. It is a latent blind
spot, not a live wrong answer.

**Related and real:** the audit logger swallows its own write failures the same way, so an audit
entry can silently fail to exist in the first place.

**Smallest fix:** show a distinct "read failed" state instead of the empty state.
