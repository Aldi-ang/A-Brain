---
title: Logistics and Stock Movement
description: Topic hub — every note about how goods move between factory, HQ vault, branch warehouses, vans and stores. Read this first when the question is about logistics, shipping, restock, transfers or stock levels.
type: concept
created: 2026-08-26
updated: 2026-08-26
confidence: high
checked: 2026-08-26
tags: [logistics, shipping, warehouse, inventory, stock, transfer, restock, hub]
aliases: [Logistics, Shipping, Stock Movement, Warehouse, Restock, Transfer, Supply Chain]
---

# Logistics and Stock Movement

**This is a hub, not an answer.** It exists so the word *logistics* has somewhere to land — no
note was titled that, so recall for it returned nothing until 2026-08-26. Read the 1-3 notes below
that match the question, not all of them.

## The chain

**factory -> HQ master vault -> branch warehouse -> van -> store.** All internal — KPM makes what
it sells, so there is **no supplier**. A third-party **courier** does move goods between HQ and the
branches (`handleShipItems` demands a Logistic Company and a Nomor Resi), which is the one external
party in the chain.

## Read by question

| Question | Note |
|---|---|
| What do big operations do that KPM does not? What should we build next? | [[The Eight Warehouse Gaps]] — ranked gaps, build order, **rejected on purpose** list |
| How does HQ send stock to a branch on purpose? | [[HQ-Initiated Stock Push]] — lifecycle, 4 options, **decision OPEN** |
| Why is a count trusted over a claim? | [[Stock Count Trust Chain]] |
| Where is the whole app heading? | [[Where KPM Is Going]] |
| How do the screens connect? | [[The KPM Control System]] |

## Locked rules — do not re-litigate

- **The branch is credited what it COUNTED, never what HQ claimed to send.**
  `BranchWarehouseManager.jsx:505`. Double-credit guard at `:499`.
- **A courier status must never move stock.** Carrier-delivered is not consignee-accepted.
- **No supplier claim language.** Nothing is bought in — a shortage is an internal leak, unless the
  courier lost it.
- **Old stock is a money and reputation problem, not a legal one** — the excise band year is a
  freshness label the customer reads. See [[The Eight Warehouse Gaps]] G2.

## Open

- Which push option (D recommended), whether to build **"Dalam Perjalanan"** in-transit visibility,
  and link-vs-Cloud-Function for resi tracking — all in [[HQ-Initiated Stock Push]].
- Split Stok Kritis per warehouse with a per-warehouse minimum. Not started.

See also: [[Anti-Recurrence Check]] · [[Silent Failure Disease]]
