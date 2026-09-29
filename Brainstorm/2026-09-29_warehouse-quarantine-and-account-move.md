---
title: Warehouse quarantine chest, and moving a person to a new Gmail
created: 2026-09-29
status: PARTLY DECIDED — B (sell to a customer) still open
tags: [kpm, quarantine, warehouse, stock-opname, fleet-roster, account-lock]
---

# Warehouse quarantine chest, and moving a person to a new Gmail

## Problem (his words, 2026-09-29)

> *"dont wipes on lock, because there will be intersection on the data that is gone, on the other words the agent inventory item that should be returned through EOD and all its cash and pita cukai may also be gone also right maybe better when we transfer data from that gmail account on the user new account, just like transferring bag from broken vehicle to the new one"*

> *"tape band is the one that i like the most, anyway we need the quarantine chest from the regional warehouse and fleet and roster as well to store item before it returned to the factory or resell it at the customer then it might have affecting the stock opname as well"*

## What the code does today (read 2026-09-29)

- **Wipe on lock: DECIDED NO.** The mechanism, for the record: a wipe would only clear the phone's offline copy; the server's van items, EOD, cash and cukai are never touched. What a wipe could lose is sales typed on that phone offline and not yet sent - so "no" is the safer call, for that reason.
- **Moving a person to a new Gmail already exists** [certain]: Fleet & Roster → card → Edit → change the email → Save. `FleetCanvasManager.jsx:350-356` deletes `employee_directory/<old email>` and writes `<new email>` pointing at the SAME roster profile (`agentId`). Van, EOD items, cash and cukai belong to the profile, so they stay; the old Gmail loses its login record, so the ghost killer and the rules shut it out at once (a move is also a lock).
  - Gap 1 [likely, emulator test settles it]: the `employee_directory` create/delete rules allow the owner, `ADMIN` and area admins with `canEditRoster` - a T2 saved as `COMPANY_OWNER` is none of them, so a T2's email move fails on the server while the UI offers it ([[UI-Says-Yes-Server-Says-No Pattern]]).
  - Gap 2: a moved T1/T2 keeps a `vault_keys` doc whose `uid` is the OLD account - press "Reset vault password" after the move so the new Gmail makes its own.
- **Warehouse quarantine already exists as data** [certain]: each item's `damagedStock` per facility (master + each branch). Stock Opname → Quarantine lists it (ALL / MASTER / branch) with three exits: SAMPLING, RTV (return to factory, with a reference), PENALTY (charge the agent) - `StockOpnameView.jsx:721-769`. No "sell to a customer" exit.
- **Fleet & Roster's bay has no quarantine crate** [certain]: the crate renders only for Agent Inventory (`LoadingBay.jsx:835`, `vanOnly &&`).

## Options

| Option | What he gets | Cost |
|---|---|---|
| A. Quarantine crate in Fleet & Roster's bay | the yellow crate (tape band look) beside the warehouse chest, holding that warehouse's `damagedStock` - the same numbers Stock Opname's Quarantine tab shows | small-medium: a view on existing data; Stock Opname unchanged |
| B. "Sell to a customer" as a 4th exit | damaged goods sold (likely at a lower price) instead of returned | big: a money path - price rule, who may do it, whether the money joins the agent's cash for EOD, the warehouse count drops (Stock Opname) |
| C. Let T2 move a person's Gmail | T1 and T2 can both do the "broken vehicle → new vehicle" move | small rules DRAFT like CHANGE 12 + an emulator test; he deploys |

## Decision

OPEN — waiting on Aldi: A or B first; yes/no on C. Decided today: no wipe on lock; tape band (C look, no word) for the quarantine box; labels in English ("Quarantine").

## Rejected on purpose

- Wipe on lock (his call, 2026-09-29).
- A new "transfer account" tool: the Edit email move already does it; build only the missing T2 permission if he wants it.

Models applied: Chesterton's Fence (the email move already exists - find why before building a new one), Second-Order Thinking (a resell exit changes cash, EOD and the count, not only the chest), Opportunity Cost (the crate is cheap; the resell exit delays the enchanting-table build).

## Decided, 2026-09-29 09:00

> *"there should be 4 chest on the fleet and roster then, biohazard chest for agent and warehouse and then wooden chest for agent and warehouse, Tier 1 , tier 2  could also be able to do that. u can put reset button instead of save button"*

- **A, widened: four chests in Fleet & Roster's bay** - the wooden chest for the warehouse and for the agent's van (today's two), plus a biohazard crate for each: the warehouse's `damagedStock` and the van's quarantine. Queued in kpm NEXT-SESSION.md after the tape-band build; pictures first.
- **C: yes** - built as kpm `c8cdc1c`, rules CHANGE 13 (DRAFT): a T1/T2 moves a person to a new Gmail; never a Tier 1 tag. The committed rules failed 6 of the new emulator cases (the T2 move was refused: UI yes, server no) and showed a CHANGE 12 gap - a T2 could lock a legacy `ADMIN`, which the app reads as Tier 1. Both closed.
- The reset box's button says RESET (`c8cdc1c`).
- **B (sell to a customer) still OPEN** - he did not pick it; do not build it unasked.
