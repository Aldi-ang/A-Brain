# SWEEP — warehouse and restock

7 confirmed problems in `src/components/BranchWarehouseManager.jsx` and
`src/RestockVaultView.jsx`.

⚠️ **Items 1 and 2 already have their own Backlog files from the earlier hand review.** They
are repeated here only because the robot checker corrected details in both. Fix from the
original files; read the corrections below first.

---

> ## 🔄 ITEMS 1, 2 AND 6 WERE RE-CHECKED A THIRD TIME AND CHANGED
> A third Opus pass on 2026-08-18 disagreed with the sweep on all three. **Item 1 drops HIGHEST →
> MEDIUM** (the photo-upload window is a no-op by default; the real window is offline persistence —
> and the same flaw exists in four other files). **Item 2 drops HIGH → LOW** (the button is only
> rendered while the order is IN_TRANSIT). **The excise item that the sweep KILLED is un-killed** —
> see `Excise and shipping costs...md`. Full detail in each item's own Backlog file.
>
> **The lesson, which is bigger than any of them:** two runs of the same model on the same claim
> reached opposite verdicts. **One verification pass is not proof.**

## 1. 🟡 MEDIUM *(was HIGHEST)* — Shipping to a branch overwrites HQ stock with a cached number

**Where:** `BranchWarehouseManager.jsx:294`
**Existing file:** `Shipping stock to a branch can erase sales made while the photo uploads.md`

**In plain English:** the shipment write says "set HQ stock to 400", using a stock figure the
admin's screen loaded before the package photo was taken. It does not say "subtract 100".

**What happens:** HQ holds 500 packs. The admin opens the shipment screen (screen caches 500),
picks a package photo — compressing and uploading it takes seconds to minutes on a phone.
Meanwhile a salesman's sale deducts 120, so the real vault is 380. The batch then writes
500 − 100 = **400**. The 120 sold packs are re-created out of nothing and the vault is
overstated by 120 forever.

**✏️ Correction from the checker:** the original write-up said "every other stock writer in
this repo uses increment()". **That is wrong** — four other places also do read-then-write. The
difference is that all four are inside a *transaction*, which re-reads the real value. This one
is not. The bug stands; only the supporting sentence was wrong.

**Also worth knowing:** `FleetCanvasManager.jsx:294` carries a comment saying it was *upgraded*
from this exact pattern to a transaction, "so we READ the correct source's real current stock
first, instead of trusting the viewer's own". **This repo already diagnosed and fixed this bug
elsewhere and missed this one site.**

**Smallest fix:** `batch.update(hqRef, { stock: increment(-Number(item.qty)) })` — exactly what
`RestockVaultView.jsx:113` already does.

---

## 2. 🟢 LOW *(was HIGH)* — Confirming the same shipment twice credits the branch twice

**Where:** `BranchWarehouseManager.jsx:152`
**Existing file:** `Confirming a shipment twice credits the branch twice.md`

**In plain English:** the confirmation reads the order document but never checks whether it has
already been confirmed.

**What happens:** two Tier-3 users at the same branch both press KONFIRMASI TERIMA BARANG.
The first commits: branch 0 → 100, status DELIVERED. The second retries, re-reads a branch that
now says 100, and — with no guard — writes 200. **The branch claims 100 packs that were never
shipped, and HQ was only debited once.**

**✏️ Correction from the checker — this changes the fix:** the original write-up said a *single*
user could double-press during the confirmation dialog. **That is refuted** — the dialog is a
full-screen overlay, so the button underneath cannot be pressed. Only the **two-user** path
survives, because the request list is filtered by branch, so every Tier-3 user at that branch
sees the same live button. Downgraded HIGHEST → HIGH: it needs two humans within the same
second.

**Smallest fix:** after reading the order, `if (orderData.status !== 'IN_TRANSIT') throw ...`.
The same read-then-check already exists in `App.jsx:1791` with a comment explaining that
without it "stock gets double-credited". The read is already in the transaction, so this costs
nothing.

---

## 3. 🟠 HIGH — An area name with a slash in it kills the branch warehouse completely

**Where:** `BranchWarehouseManager.jsx:158` (and `:68`)

**In plain English:** area names are free text — there is a plain "Type New Area..." box with
no validation. That text is dropped straight into the database path. A slash in the name splits
the path in two.

**What happens:** an admin creates the area `SEMARANG/UNGARAN`. Four other places in the app
strip the slash to `SEMARANG-UNGARAN`. This file does not. The path comes out with one segment
too many, the call throws inside the transaction, the error is swallowed — and **the branch can
never confirm receipt, even though HQ has already been debited** (see item 1: the stock is now
stranded). The branch user's whole inventory panel dies for the same reason.

**The checker found the blast radius is bigger than reported:** the Stock Opname screen has the
same unsanitised path in **seven** places.

**The existence of four `.replace('/','-')` patches elsewhere is evidence this was already hit
in production once.**

**Smallest fix:** sanitise once at the top of the component and use it everywhere — the same
one-line expression `App.jsx:1755` already uses.

---

## 4. 🟡 MEDIUM — Deleting an in-transit order destroys the stock it represents

**Where:** `BranchWarehouseManager.jsx:368`

**In plain English:** HQ debits the stock when it ships. The branch credits it when it
confirms. The delete button is offered on orders sitting **between** those two moments.

**What happens:** HQ ships 200 packs. Before the branch confirms, an admin sees the order in
Active Pipeline, thinks it is ghost data, and deletes it. The 200 packs are gone from HQ, were
never added to the branch, and no record survives to reconcile against. The same hole exists on
the Restock Vault's delete button.

**Downgraded from HIGH** for two reasons the checker verified: the audit log does leave a trail
(order ID only, not quantities), and the DANGER-styled confirmation **spells out this exact
consequence** — "It will NOT automatically refund or reverse warehouse math". So it takes a
deliberate action past an accurate warning.

**Note:** the sibling PO delete reverses the stock in the same batch, so the codebase knows how
to do this. This one just never got it.

**Smallest fix:** refuse the delete when status is IN_TRANSIT, with a message saying to cancel
via confirm-receipt instead. Deleting PENDING / REJECTED / DELIVERED still moves no stock and
stays allowed.

---

## 5. 🟡 MEDIUM — Monthly production-target progress is computed from a 7-day list

**Where:** `RestockVaultView.jsx:488`

**In plain English:** the production feed only holds the last seven days. The monthly target
bar adds up that list.

**What happens:** target 10.000 packs of Cello for August. The factory delivers 8.000 across
Aug 1–20. On Aug 25 the card reads **"1.200 / 10.000"** and the bar says 12%, because only
Aug 18–25 is in memory — while the banner above it tells you the figure "automatically scans
the Master Ledger". You order a second production run that is not needed.

**Same root cause** makes the Master Logistics Ledger folders misleading: outbound comes from an
unlimited feed, inbound from the 7-day one, so an "August 2026" folder shows every shipment out
and one week of production in.

**Smallest fix:** query the month directly inside this view, or keep a running produced-quantity
on the target record and add to it when a batch is processed. Either way, stop the banner
claiming a full-ledger scan.

---

## 6. 🟡 MEDIUM — A failed data feed shows an empty warehouse, not an error

**Where:** `RestockVaultView.jsx:56` and `:61`; `BranchWarehouseManager.jsx:64` and `:71`

**In plain English:** all four feeds handle failure by writing to the developer console and
nothing else. The list stays empty, so the screen renders its normal empty state.

**What happens:** if the rules deny the read, the Master Logistics Ledger says **"No Records
Found"** and the branch panel says **"Warehouse is empty. Request stock from HQ"** — byte for
byte identical to a genuinely empty warehouse. The admin concludes nothing was ever shipped and
re-ships. The branch concludes its stock is zero and reorders. **Nothing on screen says the read
failed.**

This is the app's own known "UI says yes, server says no" shape, and the sync hook shows the
team already hit a real permission denial on a neighbouring collection.

**✏️ Correction:** the empty `catch(e) {}` also flagged at `BranchWarehouseManager.jsx:49` is
**not** part of this — it is a cached address being parsed, not a data feed.

**Smallest fix:** set an error flag in each handler and render "Gagal memuat data — periksa
koneksi/izin" in place of the empty-state text.

---

## 7. 🟢 LOW — One blank quantity makes a batch total print as "NaN"

**Where:** `RestockVaultView.jsx:555`

**In plain English:** the save only checks that the *total* is above zero, not that each line
has a number. A cart of `[Cello 100, Djarum ""]` passes and stores the empty value.

**What happens:** stock is unharmed, but the ledger card for that batch prints **"NaN Bks"** as
its Total Wares — permanently, because one bad value poisons the whole sum.

**✏️ Correction:** the matching problem claimed for outbound records at `:645` is effectively
unreachable — that quantity is always converted to a number behind a guard.

**Smallest fix:** `Number(i.qtyReceived) || 0` at `:555`, and reject empty lines at save time
rather than only an empty total.
