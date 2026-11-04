---
title: Headquarters Is Not a Cabang
description: 'Headquarters' is the master vault, not a branch. Anything posted there sees an empty branch warehouse forever — which is what broke the POV test agent, and what 20c4a0a fixed on the shipping form.
type: concept
created: 2026-08-30
updated: 2026-11-04
confidence: high
checked: 2026-11-04
tags: [kpm, logistics, warehouse, pov, permissions]
---

# Headquarters Is Not a Cabang

`supply.js` owns the rule and has since 2026-08-26:

```
export const NON_BRANCH = ['Headquarters', 'UNASSIGNED', 'UNASSIGNED AREA'];
```

**Headquarters IS the master vault.** Its stock lives in `users/{owner}/products`, not in
`users/{owner}/branches/Headquarters/inventory` — that subcollection does not exist and never
will. A `stock_request` cannot name it either, because the Tujuan picker filters `NON_BRANCH` out.

So anything standing at Headquarters and reading the **branch** warehouse screen sees:

> Warehouse is empty. Request stock from HQ using the form below.
> No reorder history found for Headquarters.

Both sentences are true, both are permanent, and together they look exactly like a broken screen.

## It has now bitten twice, in two different shapes

**1 · The shipping form (`20c4a0a`, 2026-08-26).** The Tujuan dropdown built its own shorter
exclusion list (`!== 'UNASSIGNED'`) instead of using `NON_BRANCH`, so it offered *Gudang Pusat
(HQ)* **and** *Headquarters* as two separate destinations for one place — on a form that writes
stock movements. Fixed by **exporting `NON_BRANCH`**, not by lengthening the private copy.

**2 · The POV test agent (`b1cdcaa`, 2026-08-30).** `testAccountDoc` had
`location: defaults.location || 'Headquarters'` and **nobody ever passed defaults**. Every costume
was born at the one location that cannot hold branch stock. Aldi, wearing tier 4 to look at his own
regional warehouse: *"i want the option for tier 1 so that i can assign the test agent into
different places with no problems"*. The rack got a **Tempat tugas** picker, fed by
`warehouseList(motorists)` — the same function the Tujuan picker uses.

## The trap underneath both

**A place list built by hand drifts away from the place list that moves stock.** There is exactly
one right source (`warehouseList` / `NON_BRANCH` in `utils/supply.js`), and every new picker must
read it rather than re-derive it. A second list is not a copy; it is a second answer.

## And the wrong fix that was nearly taken

Aldi first asked to **disable the email requirement** on the roster form so he could edit the test
agent's location there. That would have been a real hole:

- `FleetCanvasManager.jsx:162` requires an email because the email is the **document ID** of the
  `employee_directory` row.
- `employee_directory` is the record that lets a human **sign in**.
- `povPreview.js` deliberately never writes one for a test agent — its own words: *a fake agent
  must never be a way into the company.*

Relaxing it would either break the write or **mint a login for a fake person**. Moving a costume is
a `location` merge on a `motorists` document and touches no directory row at all. **When a request
names a rule to remove, check whether the rule is the obstacle before removing it.**

## A third time, by spelling (2026-11-04)

The Fleet & Roster Edit form offers places in capitals and saves what is picked, so moving his Admin van to headquarters stored `HEADQUARTERS`. Every test matches `Headquarters` exactly, so the van read an empty fake branch: *"it created its own warehouse"*. A name typed into many exact matches is the real trap; the next fix is one case-blind check that everything calls, plus an audit line that fails on a new exact match. Full findings: [[2026-11-04_master-vault-and-three-bugs]].

See also: [[The Eight Warehouse Gaps]] · [[Logistics and Stock Movement]] ·
[[A Check Points at a File, Not at a Behaviour]] · [[The KPM Control System]]
