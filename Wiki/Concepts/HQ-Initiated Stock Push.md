---
title: HQ-Initiated Stock Push
description: How HQ could send stock to a regional warehouse on purpose instead of waiting for a request — the verified current lifecycle, four options with costs, the courier-vs-consignee trap, and the in-transit hole. Decision OPEN.
type: concept
created: 2026-08-26
updated: 2026-08-26
confidence: high
checked: 2026-08-26
tags: [inventory, warehouse, logistics, shipping, branches, brainstorm, open]
---

# HQ-Initiated Stock Push

## The problem, his words

> *"how do we sent our product from HQ to regional warehouse on purpose without fullfill regional
> admin request tho, i dont think we have that features yet"* — 2026-08-25

> *"we can track the resi for our shipment goods and if its already confirmed that the shipment
> have arrived the regional admin should confirm that the goods are landing to the regional
> warehouse safely"* — 2026-08-26

He is right. There is no HQ-originated push. Verified 2026-08-26: every write into
`branches/{loc}/inventory` starts somewhere other than HQ deciding to send something.

## Verified current state

| write path | who starts it |
|---|---|
| `BranchWarehouseManager.jsx:438` -> `stock_requests` `status:'PENDING'` | the BRANCH |
| `App.jsx:1877` / `:1888` | an agent's end-of-day return |
| `FleetCanvasManager.jsx:305` / `:411` | a van being loaded / unloaded |

**Lifecycle:** `PENDING` (branch) -> `IN_TRANSIT` (HQ ships; deducts HQ `products` via
`increment(-qty)`; requires senderName + courier + resi + package photo) -> `DELIVERED` or
`DISPUTED` (branch counts). Plus `REJECTED`, and `SYSTEM_EDIT` which is timeline-only.
`SETTLED = ['DELIVERED','DISPUTED','REJECTED']` at `BranchWarehouseManager.jsx:206`.

**The rule that must survive any design:** `BranchWarehouseManager.jsx:505` credits the branch
`counted - damaged` — what the branch physically counted, never what HQ claimed to send. The
double-credit guard sits at `:499` and reads inside the transaction, not from the listener prop.
See [[The Eight Warehouse Gaps]], practice 1 (verify before you sign).

**Rules already allow it.** `firestore.rules:285-289` — `allow create, update: if isSalesman(bossUid)`.
HQ can create a `stock_requests` doc today. **No rules change, no deploy needed.**

## The trap: carrier-delivered is not consignee-accepted

Couriers mark DELIVERED when they hand over at the gate, to security, to a neighbour. Big
logistics keeps these as two separate facts on purpose. So **a resi status must never move stock**
— it may only wake the admin up. The count-on-arrival rule at `:505` stays king. Aldi's instinct
already had this right; the risk is a later session letting the tracking shortcut it.

## Options

| | shape | cost | verdict |
|---|---|---|---|
| **D** | HQ taps "Kirim ke Cabang"; app writes the `PENDING` doc itself with `initiatedBy:'HQ'`; the **existing** fulfilment modal opens on it | one button + one small write fn; reuses ship, receipt, double-credit guard, timeline, badges | **recommended** |
| **A** | new HQ composer writing straight to `IN_TRANSIT` | must re-implement the courier/resi/photo validation inside `handleShipItems` | more code, same result |
| **B** | HQ offers, branch must accept | reintroduces waiting on the regional admin | ✗ the thing he said he does not want |
| **C** | new `stock_pushes` collection | duplicates the whole receive transaction; branch gets two inboxes | ✗ |

`not-chosen: A — lost on duplicating shipment validation. Flips if a push should skip HQ's
courier/photo requirement (own-van delivery, no resi).`

**Option D is not a hack.** It is the ASN (Advance Shipping Notice) pattern: the sender announces
a shipment the receiver never ordered, and the receiving dock checks goods against the
announcement. Standard practice, mapped onto documents KPM already has.

## The in-transit hole — the cheapest thing worth building

Once HQ ships, HQ's stock is **already deducted** and the order sits at `IN_TRANSIT` until the
branch taps confirm. A branch that *asked* watches for it. A branch that **did not ask may never
look**. Worked example: HQ pushes 200 packs Monday, HQ's vault drops by 200 immediately, Muntilan
never opens the receive screen — for the rest of the week those 200 packs are in **neither**
warehouse's number.

Big operations solve this by making **in-transit its own inventory location**, so stock is never
invisible. KPM already stores every `IN_TRANSIT` order; it just sums them nowhere. A third number
— **"Dalam Perjalanan"** — beside HQ and each branch closes the hole with **zero new data and zero
API**. Auto-tracking does not close it; it only reports sooner.

## Address gap

`deliveryAddress` is read from the branch device's `localStorage` key `kpm_address_${branchLocation}`.
HQ has no copy. Cheapest fix: read it off that branch's last delivered order (already in
Firestore), let HQ type it when the branch has never ordered.

## Auto resi tracking, honestly priced

The app cannot know a courier said DELIVERED unless something tells it. Aggregators exist
(Binderbyte, Biteship, RajaOngkir) — **prices unverified, `WebSearch`/`WebFetch` were dead on
2026-08-26**. The load-bearing constraint is architectural, not commercial: **KPM is a
browser-only Firebase app, so an API key cannot live in the client.** Auto-tracking means a
**Cloud Function** — new infrastructure, a real deploy, a monthly cost. Cheap version: the resi is
already stored, so make it a tappable link to the courier's own tracker and flag orders older
than N days.

## DECISION: OPEN — waiting on Aldi

1. Confirm option **D**.
2. Build **"Dalam Perjalanan"** now, yes/no?
3. Resi: **link + aging flag** now, or **Cloud Function auto-track**?

## Rejected on purpose — do not re-propose

Option B (branch must accept) — it is the request flow with the roles swapped, and reintroduces
the wait he asked to remove · Option C (a second collection) — two inboxes for the branch, and the
receive transaction copied · **letting a courier status write stock** — see the trap above ·
putting a tracking API key in the client.

See also: [[The Eight Warehouse Gaps]] · [[Where KPM Is Going]] · [[The KPM Control System]]
