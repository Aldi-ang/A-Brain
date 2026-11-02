---
date: 2026-11-02
status: DECIDED 2026-11-02, built kpm 6db6916
project: kpm
---

# Quarantine "Convert to Sample" → promo goods in the warehouse

## Problem (his words)
> *"i want the stock opname for the quarantine goods especially for the "convert to sample" to convert into the
> promotional goods inside the regional warehouse instead"*

## What the code does today (checked 2026-11-02 18:50)
- `StockOpnameView.jsx` `executeResolution`, method `SAMPLING`: `damagedStock` −qty on the crate's facility
  (Master `products/{id}` or `branches/{fac}/inventory/{id}`), a `quarantine_logs` row, and a `samplings` row
  ("QUARANTINE CONVERSION: …"). The packs leave the books; nothing can be loaded or given from them.
- `samplings` is read only by the Sampling screen (`useDatabaseSync.js:84`, last 7 days). The quarantine history
  (`quarantine_logs`) keeps the record either way.
- A regional warehouse's promo goods = docs in `branches/{fac}/inventory` with `kind: 'promo'`, unit pcs
  (`App.jsx:2460`). Fleet & Canvas shows a branch's promo ONLY for a Master Vault promo product with the same id
  (`FleetCanvasManager.jsx:227`). So converted packs need a Master promo product to belong to.

## Options
| | What a conversion does | Costs |
|---|---|---|
| **A (recommended)** | Each cigarette gets its own promo item, made by the app on its first conversion: 5 crushed Cello Green 16 → "CELLO GREEN 16 · RUSAK" 5 pcs in that warehouse's promo goods, Cello picture | The app creates Master Vault promo products by itself (one per brand, fixed id `dmg-<productId>`); harder to undo once salesmen hold them in vans |
| **B** | He makes ONE promo item once (e.g. "ROKOK RUSAK"); the convert window adds pcs to it, any brand | Brands mixed in one item: the nota says "ROKOK RUSAK" not which pack; nothing auto-created |

Second question: a crate in the **Master Vault** (not a regional warehouse) → A: promo goods in the Master Vault
itself (same place it sits) / B: pick a regional warehouse to send them to.

## Build notes (for whichever he picks)
- Replaces the `samplings` write for quarantine (his "instead"); the Sampling screen stops listing them, the
  quarantine history keeps them. Log method stays readable: new method `PROMO` (old rows stay `SAMPLING`).
- Rules: check the quarantine resolver's tier may write `products` (A) and `branches/{fac}/inventory/{promoId}` -
  a missing allow = a CHANGE n draft he publishes FIRST.
- Same batch as the `damagedStock` decrement, so a failed write moves nothing.

## Decision
DECIDED 2026-11-02 19:10, his words: *"A and B, when damaged good enter the master vault they should have option to repair or convert it as sampling"*. A = a promo item per cigarette; B = a Master Vault crate picks the regional warehouse; plus REPAIR on Master Vault crates (damaged Bks back to good stock). RTV and Penalty kept. Built + pushed kpm `6db6916`; board `Raw/2026-11-02-quarantine-promo/board.png`.

## Rejected on purpose
- Converting into an existing T-shirt/hat item: damaged cigarettes do not become T-shirts.

Models applied: Reversibility Test (A auto-creates products - a one-way door; B is reversible), Second-Order Thinking
(a store handed a crushed pack as a "gift" - his call), Chesterton's Fence (who reads `samplings`: only the Sampling
screen).
