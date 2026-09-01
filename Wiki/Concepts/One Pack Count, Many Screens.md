---
title: One Pack Count, Many Screens
description: How KPM converts karton, bal and slop into bks — the one shared converter, where the ten copies of it live, and the two that are already producing wrong numbers.
type: concept
created: 2026-09-01
updated: 2026-09-01
confidence: high
checked: 2026-09-01
tags: [inventory, units, packing, conversion, restock, sales, data-model]
aliases: [Units, Packing, Karton, Bal, Slop, Bks, convertToBks, Unit Conversion]
---

# One Pack Count, Many Screens

## The problem, in his words

> *"remember that all the products each have different bks per slop/bal/karton so make sure that
> there is no data intersection here. like i said before. we should have 1 data to be used many
> times on the other components"*
> — Aldi, 2026-09-01, asking for karton/bal/slop boxes in the Restock Vault

Kretek is not counted in one unit. A factory note says karton and bal; a shop buys slop; stock is
held in bks. **And the rates are different per product** — Cello Green 16 is 400 bks to a karton,
Djarum Coklat 12 is 600. So a single number written on a screen means nothing without knowing which
product and which unit it belongs to.

## The one source

`convertToBks(qty, unit, product)` — `src/utils/helpers.js:195`. It reads `packsPerSlop`,
`slopsPerBal` and `balsPerCarton` off the product, with **10 / 20 / 4** as fallbacks, and returns
`qty` untouched when the product is missing. That last behaviour is a trap: a missing product
silently prices a karton as one bks, so every caller must pass `product || {}`.

The packing itself is set per product in the Master Vault. There is no global table, and there must
never be one.

## The decision — the boxes are a calculator, not a second unit

Shipped 2026-09-01 in the Restock Vault, ported from the sales terminal rather than reinvented:
four boxes (Karton · Bal · Slop · Bks), a running total, and the rates printed underneath.

| Option | What it costs |
|---|---|
| **CHOSEN — boxes total to Bks, line stores one number in one unit** | The typed breakdown is kept in a display-only `mix` field that no calculation reads. Nothing downstream changes. |
| Rejected — store `qty` + `unit` as typed, convert at read time | Every screen that reads stock would have to know units. `totalItemsReceived`, the landed cost per unit, the HQ stock increment and the shipment line all read the quantity raw, so a line saying *qty 2, unit Karton* would take **2** packs out of HQ stock instead of 800. That is the intersection he was warning about. |

**REJECTED ON PURPOSE, do not re-propose:** a local packing table in any screen. It is how two
screens come to disagree about how many packs are in a karton.

## The part that is still broken

The same three lines of maths are copy-pasted in about **ten** places instead of calling the
converter — six in `App.jsx`, three in `MerchantSalesView.jsx`, plus `AgentProfileView.jsx` and
`EODReconciliationView.jsx`. Duplication alone is only a smell. **Two of them are wrong today:**

- `src/AgentInventoryView.jsx:81` — `if (unit === 'Slop') mult = 10;`, no product lookup at all.
- `src/MerchantSalesView.jsx:1238` and `:1256` — `qtyInBks *= 800` for a karton, hardcoded. 800 is
  the 4 × 20 × 10 default; the two lab products are 400 and 600.

Any product that is not 10/20/4 is miscounted on those screens, and the symptom is a total that
looks perfectly plausible — which is the one kind of error nobody catches by looking.

**Status: OPEN.** Queued as the next job, with the warning that the inline copies are not identical
— some feed a price that the retur/exchange path deliberately zeroes, and two in `App.jsx` compute
an old-product and a new-product multiplier either side of an edit on purpose.

## Pinned

Group 59 of `integration.audit.mjs` asserts the intake desk imports the converter, carries no local
packing constants, totals to bks, offers the same four units in the same order as the sales
terminal, prints its rates, and starts a line at the distributor price.

See also: [[Logistics and Stock Movement]] · [[Anti-Recurrence Check]]
