---
title: Approving a Stock Opname count wipes the quarantine number
created: 2026-11-04
status: OPEN, diagnosed + reproduced in the lab, no app code changed, waiting on his A or B
tags: [kpm, stock-opname, quarantine, bug, brainstorm]
---

# Approving a Stock Opname count wipes the quarantine number

**His words, 2026-11-04:** *"after the stock opname where are the quarantine item go, i just tried to do the stock opname for master vault and submit it, verified by the admin which is myself and then all the quarantine item count is just gone from the master vault stock opname counting, it also gone inside the quarantine vault inside stock opname, on the master vault it is also gone, it should still be there, u know all the damaged item status should go into the quarantine vault and all the decision is in there while stock opname is just to check whether the goods quantity is correct and there is no missing item and shouldnot affect any of the quantity check this bug bro"*

## The cause

The count's Damaged box was built to mean "every damaged pack on the shelf, old ones too". An empty box is read as 0 (`StockOpnameView.jsx` handleCommit, `Number(entry.damaged || 0)`), and Approve writes the difference (`handleApproveAudit`, `damagedStock: increment(damagedCount - expectedDamagedStock)`). So an empty box takes the whole quarantine down to 0. The packs are still on the shelf; only the number moved. The three screens he named all read `products.damagedStock`, so they dropped together.

The same line also makes the count treat quarantine as missing goods: the difference is (good + damaged) - (expected good + expected damaged), so an empty box shows a shortage equal to the quarantine, demands a recount and a cause, and HQ sees "Unaccounted shrinkage detected" on a button that says "Approve & Quarantine Damages".

## Proof

Lab `?shell&opname&admin`, the real screen and the real handlers, Djarum Coklat 12 with 1800 good and 12 damaged: typed Good 1800, left Damaged empty. The row said Difference -12 and "Count this one again"; the recount then asked for a cause. The real submit stored `expectedStock 1800, expectedDamagedStock 12, goodCount 1800, damagedCount 0`. That item was put on the lab's waiting count (the stub's listener cannot deliver a new count), and the real Approve wrote `products/p-djar { stock: 0, damagedStock: -12 }`, status APPROVED.

Of every writer of damagedStock in src (App.jsx EOD returns, BranchWarehouseManager arrival, useTransactionEngine exchange, vanSync, Quarantine resolve, this Approve), only this Approve fires on his steps; the others add or resolve by a chosen quantity.

**Not checked:** his live record. I cannot read it. He can confirm from memory: the row said short by exactly the quarantine number.

## How far it reaches

- Not from today's work: the subtraction is `5c4d3c7` (2026-08-18); before it, Approve overwrote with the same number.
- Regional counts run the same code (`branches/<place>/inventory`), read from the code, not run. The weekly count (`a60d191`) makes this happen every week wherever the box stays empty.
- Earlier approved counts may have wiped a warehouse's quarantine the same way.
- If a count typed the damaged packs into Good, the difference is 0 and Approve turns them into sellable stock.

## The numbers are not lost

An approved count stays in `pending_audits` with its expected and counted numbers, and HQ Audits > Audit History shows it ("Expected 1.812 (12 dmg)"). A one-time "Put back" on that count can reverse exactly what Approve changed.

## The fix in both options

- The count never lowers the old quarantine number.
- Difference = good + new damaged - expected good, so quarantine stops looking like missing goods.
- The Damaged box becomes "new damaged packs found today"; empty means none. Approve moves those from good stock into Quarantine, where every decision is made (his "all the damaged item status should go into the quarantine vault").
- Old quarantine packs stay on show on the row but are not counted, unless he asks.

## Decision

OPEN. Book 100 good, 12 quarantine; the team finds 95 good, 3 newly damaged, so 2 are missing:

| | Good after | Quarantine after | The 2 missing |
|---|---|---|---|
| Today, box empty | 95 | 0 | reported |
| **A** Approve corrects good stock (recommended) | 95 | 15 | reported with the cause, the book matches the shelf |
| **B** Approve changes no number, his literal "shouldnot affect any of the quantity" | 97 | 15 | only reported; the book stays 2 too high, those packs can still be loaded, every later count shows -2 |

B's cost: Approve is the only thing that corrects a shortage on a regional shelf. The Master Vault can be corrected by hand in the product's edit form (`App.jsx` name="stock"); I found no such screen for a regional warehouse, so B needs one built.

Asked (verbatim): **🔴 DECIDE: When a count finds packs truly missing, should Approve lower good stock to match the shelf (A), or only report them and change no number (B)?**

## Rejected on purpose

- Blank keeps quarantine, a typed number still overwrites it: smallest fix, but a typed 3 still wipes 12 down to 3, which is the same bug.
