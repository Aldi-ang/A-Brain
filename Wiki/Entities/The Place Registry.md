---
title: The Place Registry
description: Factories and warehouses are records with fixed addresses, and the Asal/Tujuan boxes search them instead of creating places by being typed into. Built 2026-08-31.
type: entity
created: 2026-08-31
updated: 2026-08-31
confidence: high
checked: 2026-08-31
tags: [logistics, restock, data-model, firestore]
---

# The Place Registry

Aldi, 2026-08-31, reading his own surat jalan:

> *"we need to make option to register factory and gudang therefore the adress for both is fixed
> and there is no way to input new name inside the textbox. textbox is used only to search gudang
> name not register a new one unlike sales terminal"*

> *"asal inside the masuk panel should be the factory location and tujuan should be the warehouse
> location, can be sent to master vault or regional warehouse directly"*

## The job was half the size it looked, and reading the code is what showed that

**Warehouses were already registered.** `warehouseList()` in `src/utils/supply.js` builds
[[Gudang Pusat (Master Vault)]] plus every branch on the fleet roster — and that roster, not a new
list, is what decides which warehouses exist. Building a second warehouse registry beside it would
have created exactly the "two entries for one place" bug that
[[The Eight Warehouse Gaps|the NON_BRANCH note]] already records.

**Factories never were.** `supplierName` was free text, and the "list of factories" was *every name
anyone had ever typed into a past delivery*.

**And both fields were handed the same list**, which is why a delivery could run factory → factory,
or arrive at a supplier.

So what was genuinely missing: factory *records*, and an *address* for both kinds.

## The shape

One collection, `artifacts/{appId}/users/{bossUid}/places`, doc id = a slug of the name.

| kind | what the record supplies | what it does NOT supply |
|---|---|---|
| `pabrik` | existence **and** address — factories are records for the first time | — |
| `gudang` | the address only | existence; the fleet roster already decides that |

**A warehouse with no address is still shippable.** Paperwork must never hold up a delivery, so the
Tujuan list is the roster's, and the registry only decorates it. A factory with no record, by
contrast, cannot be picked at all — that is the point.

**The slug id is load-bearing.** An auto-id would let "Pabrik Kudus" exist twice with two different
addresses, printing the same words on two different notas.

## The picker rule

`RouteCombo` used to commit whatever was typed and tag it `baru`, and its empty state said so out
loud: *"Nama baru tetap bisa dipakai"*. That is how one warehouse ends up with four spellings.

Now the typed text is a **query**, held apart from the value. The value changes only when a real
option is picked; leaving the box throws an unmatched query away. Verified live rather than argued:
typing `Pabrik Palsu` shows while typing and reverts to empty on click-away.

The same two pickers went onto the **edit** panel as well. A rule that holds on intake and leaks on
the edit form is not a rule.

## Two consequences worth remembering

**The swap button changed meaning.** Exchanging the two strings became an illegal move the moment
the lists split — it would put a factory in Tujuan. It flips *direction* now, which is what it
always meant.

**Addresses are COPIED onto the delivery record**, not looked up when the nota prints. A surat
jalan is evidence of where goods went that day; a place that moves later must not rewrite paper for
a delivery that already happened.

## What it does not do

No migration. Aldi closed that himself: *"we can leave the old record thats okay all the record is
still on trials and error anyway."* Old deliveries keep whatever was typed into them. The Tempat
tab offers those old names as one-click registrations so nothing has to be retyped from memory, but
nothing is rewritten behind him.

**No Firestore rules change either** — `places` falls through the `users/{bossUid}/{document=**}`
catch-all to owner and distributor-admin, which is the gate the Restock Vault already sits behind.
Nothing to deploy.

Shipped in `bdbd5cf`, pinned by twelve checks (D15) in `src/config/logicFixes.selfcheck.mjs`,
scoped to RouteCombo's own body because `onChange(` appears on ordinary inputs all over that file.

Related: [[Gudang Pusat (Master Vault)]] · [[The Shell Repaints Any White It Can Reach]] ·
[[Logistics and Stock Movement]]
