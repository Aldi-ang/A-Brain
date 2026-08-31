---
title: The Place Registry
description: Factories, warehouses AND the people who may send or receive a package are records now. All four boxes on the delivery form search this registry instead of creating entries by being typed into. Built 2026-08-31.
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

## It holds PEOPLE too, as of the same day

Aldi, hours later, reading the signature block on his own nota: *"why is that aldi kurniawan tho,
what is that format? how do u get the input for the recipient and sender?"* The answer was that
neither name was an input at all — see the fault below — and his fix extended this registry rather
than starting another one:

> *"the only person who are be able to send and receive the package is company employees right, so
> make sure that there is new textbox to fill the recipient/penerima and sender/pengirim and then i
> want it to work like the factory and warehouse textbox, tier 4/ regional admin and above is
> automatically registered to have power to send or receive package, while lower tier cant do that,
> and if there is other employees outside of the sales team who will send that package then just
> add register button for the sender and receiver"*

**Two sources, and only one of them is a record.** Staff carrying the `handle_delivery` clearance
are in the list *because of their tier* — nobody registers them, and demoting someone removes them
from tomorrow's deliveries without anybody remembering to. Everyone else (a factory's driver, say)
is a deliberate record with `kind: 'orang'` in this same collection. A name appearing in both is
shown once; two identical rows in a dropdown on a document that says who handled goods is a coin
toss, not a choice.

The tab is called **Daftar** now — pabrik, gudang, orang.

## The fault this replaced

| Line on the nota | What it actually was |
|---|---|
| Dikirim oleh | the literal words `Factory Logistics`, hardcoded, on every nota ever printed |
| Diterima & diperiksa oleh | `getAdminName()` evaluated **at print time** |

The second one is the dangerous shape. His Settings "Signed by" box is empty, so the name fell
through to his **Google account's display name** — a name KPM never asked for, printed on a
commercial document. And because it was read when the paper was opened rather than when the goods
arrived, a second admin opening an old delivery would have printed their own name over someone
else's work.

**Both names come from the record now, and an unknown one prints a blank line to sign on.** A blank
line is obviously unsigned; a guessed name looks authorised. That rule generalises past this screen.

⚠️ **The tier boundary is a [[Fleet Captain Permission Gap]] waiting to happen** — his "tier 4 /
regional admin" is the string `FLEET_CAPTAIN`, and `isAreaAdmin()` covers only `AREA_ADMIN`. The
clearance is the permission key `handle_delivery` (T1–T4 by default, FLEET_CAPTAIN named
explicitly, absence-means-tier-default so his saved Firebase matrix does not read as "no"), and
check D16 runs the real function on both sides of the line.

Extended in `83f48a0`.

Related: [[Gudang Pusat (Master Vault)]] · [[Fleet Captain Permission Gap]] · [[Tier System]] ·
[[Logistics and Stock Movement]]
