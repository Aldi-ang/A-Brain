---
title: Surat Jalan Desk and Sebaran Stok
description: 2026-08-26 evening to 2026-08-27 morning. The Restock Vault became one surat jalan desk with four tabs, HQ got a push and a request queue, Sebaran Stok answered "where is every pack" per warehouse — and a 17x wrong statistic shipped past 632 green checks.
type: summary
created: 2026-08-27
updated: 2026-08-27
confidence: high
checked: 2026-08-27
source: "[[../../Raw/2026-08-27_source_surat-jalan-desk-and-sebaran-stok|Raw source — commits aea7de4 to ce313f9]]"
tags: [kpm, logistics, restock, shipping, sebaran-stok, dashboard, design, ponder]
---

# Surat Jalan Desk and Sebaran Stok

Source: [[../../Raw/2026-08-27_source_surat-jalan-desk-and-sebaran-stok|commits aea7de4 to ce313f9]],
branch `phase0-solid-ground`, 2026-08-26 19:59 to 2026-08-27 08:56 WIB.

This is the **build** of what [[../Concepts/HQ-Initiated Stock Push]] and
[[../Concepts/Logistics and Stock Movement]] had only designed.

## 1. One document cut in half (`aea7de4`)

Aldi asked *"where is the Tujuan textbox?"* and the answer explained the whole screen. Every field
the surat jalan needs already existed **somewhere**, and which half of the screen you stood on
decided whether you could use it: the shipment photo was displayed by intake but written only by
the branch screen; the resi worked outbound only; the nota inbound only; the factory's own SJ
number had nowhere to go, so the app invented one from a clock.

**Asal to Tujuan is the field that puts it back together.** Masuk and Kirim are now the same form
with the route reversed — one tab, no new screen. Both pickers search places that already exist in
the records (suppliers from procurement, branches from `stock_requests`) and still accept an
unknown name, marked *baru* as you type — the same argument his own `BranchWarehouseManager`
comment makes about *Cello Coffee* vs *cello kopi*.

Also landed: Buku opens flat and newest-first with a per-document drawer (both SJ numbers, route,
kurir, resi, batch, landed cost, a `workflowTimeline` never invented); an `IN_TRANSIT` shipment
older than three days says so **in red**; batch became a column, untagged lots ship as
`UNASSIGNED`; landed cost is live per pack with a price-drift flag against the last time that ware
landed; Target lost its tab and kept its data; the evidence row (foto barang, nota, resi, kurir)
feeds a completeness meter that **reports and never blocks a save** — a blocked save is a blocked
dialog, and a block explains nothing. Last screen still painting itself with hardcoded white/black
washes; now all theme tokens.

## 2. What actually shipped for the HQ push — option A, not D

[[../Concepts/HQ-Initiated Stock Push]] recommended **option D** (write `PENDING`, then reuse the
existing fulfilment modal). What shipped writes the `stock_requests` document **straight to
`IN_TRANSIT`**, deducting HQ stock with `increment()` rather than a recomputed total. Both
`requestedItems` and `fulfilledItems` are written, because the receive screen reads one and falls
back to the other and a push has no request to fall back to. No rules change was needed — HQ is
above `isSalesman`. **The branch is still credited what it counts, never what the form claims.**

## 3. The Request tab — a move, not a copy (`76de71a`)

HQ's only way to answer a branch request was *Siapkan Pengiriman*, living inside
**BranchWarehouseManager — the BRANCH screen** — while every other surat jalan lived on the desk.
It became the desk's 4th tab; `BranchWarehouseManager` lost 332 lines and is now HQ's warehouse
readout rather than HQ's outbox. The queue keeps **all three** open states (PENDING, IN_TRANSIT,
DISPUTED) — narrowing to PENDING would make every shipment already on the road invisible to HQ.
DISPUTED sorts first: the goods are in the branch, the count is filed, and HQ's answer is what is
outstanding.

WARNING: **a `<button>` inside a `<button>`** is legal-looking JSX that renders without a warning
and silently kills the inner click. The Siapkan control had to become a **sibling** of the row
button.

## 4. Tujuan from the roster, and Headquarters is not a cabang (`76de71a`, `20c4a0a`)

*"make sure that every team registered on the fleet and roster have their own storage option."*
Tujuan was built from `stockRequests[].branch`, so **the warehouse that most needed its first
delivery was the only one HQ could not select**. Now the roster UNIONed with branches seen on past
requests.

Driving the screen then caught the real bug: the dropdown offered *Gudang Pusat (HQ)*, *BANDUNG*,
**Headquarters** and *MUNTILAN* — the first and third are the same place. The roster union filtered
on its own short list (`!== 'UNASSIGNED'`) while `supply.js` had long owned the real rule behind a
`NON_BRANCH` constant. **Two lists, and the shorter one was on the form that writes stock
movements** — a shipment to "Headquarters" would have opened a `stock_request` against a branch
with no inventory subcollection. Fixed by **exporting `NON_BRANCH`**, not by lengthening the copy.

## 5. Sebaran Stok — where every pack actually is (`76de71a` to `76f1ef3`)

*"show the regional warehouse current stock, on field, sold as well ... so HQ know how many bks
should be send to them again."* One row per warehouse: in stock, shipping, agent inventory, sold,
est. days left; each row opens a drawer with the same figures **per product**.

- *"Just like the dashboard"* is a **correctness requirement, not a styling note** — so it calls
  `supplyByProduct` from `utils/supply.js`, the function the dashboard already runs on. Two
  implementations of "where is every pack" would drift, and the screen nobody edits is the one that
  keeps being believed.
- **Sold is seven days**, because the transactions listener is capped at `sevenDaysAgo`. The
  window is passed explicitly and a check ties the printed label to the listener, so widening the
  cap fails loudly instead of quietly making every figure wrong.
- The stacked bar leaves *sold* out on purpose: sold packs are not anywhere any more, and including
  them shrinks every other segment in proportion to how **well** a branch is doing.
- Master Vault prints an em-dash for shipping, never 0: `stock_requests` only run HQ to branch, so
  a figure there would be an empty sum dressed up as a measurement.
- **Isi Gudang Cabang was deleted** — a one-branch-at-a-time picker the drawer now supersedes. Its
  per-shipment `stockCard` breakdown was lost deliberately, with him told first and offered the
  port; he chose the straight delete. `stockCard` still renders branch-side. HQ also ends up
  holding **one fewer Firestore subscription**.

## 6. The part worth remembering: a total over a total is not a rate (`f7800f5`)

He caught it on screen: *"u cant just divide total with the average goods like that, these are
different goods should have their own depleted number."* Full write-up:
[[../Concepts/A Ratio of Sums Is Not a Rate]].

Master Vault printed **348 days left**. That entire sales rate — 500 a week — was **one** product,
Cello Chocolate, which had **20 days** of cover one row down in its own drawer. The error ran
**17x too comfortable**, on the one panel whose job is *"which warehouse do I restock first"*.
Every one of the 632 checks passed and the arithmetic was verified on screen twice: 24.921 divided
by (500 / 7) really is 348. **A check tests whether a number computes, not whether it means
anything.**

## 7. Plain words, and an estimate that shows its working (`b452264`, `792ca04`)

*"dont make vague terms"*, *"use english terms if its shorter and direct"*, *"i want where u got
that calculation"*, and *"change nomor SJ because i dont know what is that"* — **he owns the
company and could not read the label on his own intake form.**

| was | now |
|---|---|
| Di gudang / Di jalan / Di tangan agen | In stock / Shipping / Agent inventory |
| Terjual | Sold (7d) |
| Sisa hari | **Est.** days left |
| No. SJ / No. SJ pabrik / No. SJ manual | Delivery note (app) / (factory) / (paper) |

*Est.* is load-bearing: he asked for wording that says **potential** time left. A bare "Days left"
reads as something the system measured. A new **Avg / month** column sits beside it, and the
footnote writes both divisions out longhand — *printing a quotient without its divisor asks him to
trust a number he cannot check*. The stored `SJ-631381` prefix was **deliberately not renamed**:
it is `poNumber` on every saved record, and renaming an identifier splits the history.
`BranchWarehouseManager.jsx:1121` keeps "Di jalan" on purpose — different screen, different reader,
all-Indonesian by design.

## 8. Hierarchy made of space, not lines (`76f1ef3`, `d042520`)

*"there should be personal space between the location line and the product lines ... psychology of
the expensive wears store shelf and product display format used by LV or PRADA."* The drawer sat
flush behind a hairline and every product carried another of the same weight, so six rows read as
one stack rather than one warehouse containing five products. The `border-t` was **removed** — the
inset tone already says *nested*, and a rule on top of it says it twice. See
[[../Concepts/Aldi's Design Taste]].

Also structural: the panel had been a `<table>` with `min-w-[640px]` inside a rounded container, so
every row rule ran into the corner radius and was visibly sliced. Rebuilt as **grid rows in a
padded track** driven by one `COLS` constant; the drawer animates `grid-template-rows` 0fr to 1fr,
the one way to transition to a height you have not measured.

## 9. The Ponder tutorial plan (`5d4f062`)

No app code — the plan is the deliverable, and he chose to build nothing with ~23% quota left.
See [[../Concepts/Ponder Tutorial System]].

## Verification, honestly

Build green at every step, **632/632 checks**. Sebaran Stok, the Tujuan list, the date casing, the
label renames and the drawer arithmetic were all **driven live on his own data**. Kirim was left
**unpressed on purpose** — it moves real stock. **Siapkan Pengiriman remains untested.**

See also: [[../Concepts/Anti-Recurrence Check]] · [[Stock Count Trust Chain]] ·
[[../Concepts/The Eight Warehouse Gaps]]
