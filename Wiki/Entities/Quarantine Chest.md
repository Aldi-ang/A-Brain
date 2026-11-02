---
title: Quarantine Chest
description: The hub for KPM's quarantine chest - the yellow crate and the healthy/Quarantine switch on the warehouse box - where it lives on each screen, the shared piece, the data rule, and the lab facts.
type: entity
created: 2026-09-30
updated: 2026-09-30
confidence: high
checked: 2026-09-30 (kpm 8476f20 - logicFixes 2020/2020, audit 722/722, lab frames 1440/430 read back)
---

# Quarantine Chest

Damaged stock (a box that came back wet, torn, broken) is **quarantined**: it is not sellable, and it waits to
be settled - at EOD for what is in a van, in Stock Opname for what is in a warehouse. Aldi's picture for it is a
Minecraft chest: the **yellow crate** with the pixel radiation sign (his 2026-09-27 pick), and the tape band
under the box's title (look C, 2026-09-29: *"erase the text, the biohazard line is enough for decoration"*).

## Where it lives

| Screen | Status | What it shows |
|---|---|---|
| Agent Inventory (T1-T4, `LoadingBay` vanOnly) | BUILT 2026-09-27 (v4); look C + English 2026-09-30 `b3d49ad` | the crate beside the goods chest; its box = the Quarantine tab's list (what came back damaged today, waits for EOD), under the tape band, titled "Quarantine · in van" |
| Fleet & Roster (`LoadingBay`, the van-loading bay) | BUILT 2026-09-30 `8476f20` (his prototype v21) | the ender chest's ONE box switches between the healthy stock and that warehouse's Quarantine on his Satisfactory hatch; the crate stands beside the van chest and its box (the van's damaged goods) takes turns with the van box |
| Regional warehouse (`BranchWarehouseManager.jsx`) | OPTIONS drawn 2026-09-30 (prototype v22) - his A/B owed | no chest today; branch damage comes from the arrival check (`:811-820`). A = today's cards + the switch (my pick), B = the stone box. [[2026-09-30_quarantine-chest-warehouse-and-opname]] |
| Stock Opname (`StockOpnameView.jsx`) | OPTIONS drawn 2026-09-30 (prototype v22) - his A/B owed (A = a crate per warehouse replaces the facility list, my pick) | a full quarantine area already (facility filter, `quarantine_logs`, `PENDING_HQ_APPROVAL`); the chest is only the way in, the resolve actions and the log stay |

Order decided 2026-09-29 19:30 (*"yes good order"*). The options, costs and what he turned down live in
[[2026-09-29_warehouse-quarantine-and-account-move|the brainstorm note]].

## The shared piece

`src/components/QuarantineSwitch.jsx` + its own CSS section "THE QUARANTINE SWITCH" in `theme.css` - built as
one piece on his 19:25 ask so the next two screens reuse it:

- `QuarantineHatch {view, onPress}` - the hatch; `ref.press(toQ)` plays the elevator. The dome shows where the
  NEXT press goes (yellow + sign while healthy shows, dark ender + a living eye while the Quarantine shows).
- `BlastDoors` - `ref.run(toQ, swap)`: doors close (tape in, steel out), `swap()` runs while shut, doors open.
- `QuarantineBand {q}` - a band in BOTH views, so a switch never changes the box's height.
- `runSwitch(hatch, doors, toQ, swap)` - the hatch and, 130 ms later, the doors; Lite Mode swaps at once.

Every wait on an animation is raced with a timer, so a stalled clock never leaves the box shut on the old view -
the bay's rule that motion only decorates what is already true.

## The data rule (a trap that was found, not hit)

`quarantineOf(inventory, branchRows)` in `src/utils/vanBay.js`: HQ = the product's own `damagedStock`; a
branch = its own `branches/<loc>/inventory` row. **Never read `damagedStock` off Fleet & Roster's
`displayInventory` for a branch** - it spreads the MASTER product row and only overrides `stock`, so the
`damagedStock` riding on it is HQ's number. Pinned by a behaviour check on real numbers in `logicFixes`.

## Lab facts

- `?shell&fleet` (Budi Santoso, a BANDUNG branch agent): the branch fixture carries `damagedStock` on two rows.
  Only products that exist in the MASTER list show (displayInventory's rule), so the lab Quarantine shows 1 item.
- **MUAT VAN refuses in the lab** ("BANDUNG Branch Vault only has 0 Bks") on the code before AND after
  `8476f20`: the stub's transaction read does not find branch docs. A drag still reaches the load; the load
  itself cannot be proven in this lab for a branch agent.
- Mid-flight frames: freeze each moment from a FRESH press - the switch's timers keep running while its
  animations are paused, so a second freeze in the same press is late (`Raw/2026-09-30-quarantine-switch/
  shoot-moments.mjs`).

## Related

[[Aldi's Design Taste]] · [[Gudang Pusat (Master Vault)]] · [[Looking at the App]]

## Gap found 2026-11-02: a Master Vault exchange never reaches the crate

His report (verbatim): *"tukar guling from goods taken from master vault and completed the transaction should go to the master vault quarantine right now its just gone"*.

Mechanism (code read, not yet reproduced): an exchange (Retur on, Tukar Ganti) is saved as `type: 'SALE'` with each line `condition: 'DAMAGED'` (MerchantSalesView.jsx:836, :1243-1245). The engine takes the replacement off `stock` (useTransactionEngine.js:287-289) and keeps the damaged packs only as `forensicData.quarantineCargo` on the receipt (:36-45). For a van, the EOD reads that cargo (EODReconciliationView.jsx:242-250) and the EOD approval adds it to `damagedStock` (App.jsx:2464-2478). The boss in VAULT mode has no van and no EOD, so nothing ever adds it: the packs exist only as a line on the receipt. The offline path (`vaultPending`, utils/vanSync.js) has the same gap. Fix = add `damagedStock` in the same transaction as the sale, for the no-van case only. FIXED 2026-11-02, his "1 then 2": kpm 30130c8. Lab proof (real engine, 1 Bks NOW + 1 Slop IOU): before one update {stock: 4199}, after {stock: 4199, damagedStock: 11} + eodCredited on the receipt.
