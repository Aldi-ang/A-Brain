---
title: "Quarantine way out #2: the Sell Again board"
type: brainstorm
created: 2026-11-08
status: BUILT stage 1 (owner) 2026-11-08 09:31, kpm `e589cab` + `2ce81a5`; stage 2 (Tier 3 + matrix key + rules CHANGE 24) next
tags: [kpm, design, quarantine, sales-terminal, permissions]
---

# Quarantine way out #2: the Sell Again board

## The problem
His 2026-11-03 09:40 decision ([[2026-11-03_quarantine-way-out]], option B): a damaged pack can go back on sale, keeps the hazard mark, moves regional warehouse -> van, sells at full OR a cheaper price, and only Tier 3 and up set that price (a new Access Matrix key). Board first, no code before his pick.

## What the board shows (real screens in the lab, injected DOM only)
Board: `Raw/2026-11-08-quarantine-board/board.png`; shooter `board.mjs` beside it (lab `?shell&opname&admin` crate BANDUNG > Cello Green 16; `?shell&terminal&many&promo&admin` shelf).

| Frame | What I'd build (my defaults, not asked) |
|---|---|
| A. The crate | A **Sell Again** button after Convert to Sample, in the siblings' own box (RTV's classes), gold edge. On every crate, regional and Master Vault. |
| B. The price box | The Convert to Sample box reused: quantity, "Goes on sale as CELLO GREEN 16 · RUSAK", then two no-plate choices **Full price · 11,1 rb / Cheaper** (gold line under the chosen, like his tab pick), a price field, "Only Tier 3 and up can set this price". |
| C. The shelf (the 🔴) | 1 the RUSAK card right after its own pack; 2 all RUSAK cards at the end under a thin "Damaged, still sellable" line. Both: the pack's own 3D card, the HazardMark, its own count and price. |

Not drawn: the van. The lot is planned as its own product (`<NAME> · RUSAK`, like Convert to Sample's `dmg-<pack>` promo item but sellable, with a price), so the loading bay lists it like any pack and EOD counts it apart with no new stock field. That keeps it out of the van's hand-in crate (the 2026-11-03 collision).

## What each costs
- **1:** a salesman asked for Cello sees the cheaper damaged one beside it. Needs the shelf sort to place a RUSAK lot after its source pack (`damagedFrom`).
- **2:** the normal shelf order is untouched; on the phone the damaged packs sit at the bottom of a long list, easy to forget.

## Open, not asked yet (default stated)
- Today only the owner opens Stock Opname > Quarantine (`isHighCommand = userRole === 'ADMIN'`). His rule says Tier 3 sets the price. Default: the new matrix key also opens the Sell Again box for Tier 3; the other quarantine buttons stay owner-only.
- A torn pita cukai may make a pack unsellable (2026-11-03 note): Sell Again lets a person look first, it never runs on its own.

## Decision
**2026-11-08 08:57, his answer: *"1 is easier to find use that"*.** Shelf 1. A (crate button) and B (price box) stood without objection. Not built yet: a big job on money paths, to be planned first in a fresh session.

Was: OPEN — waiting on Aldi. Asked (verbatim): **🔴 DECIDE: Where should a damaged pack you put back on sale sit on the Sales Terminal shelf: 1 right after its own pack, or 2 all damaged packs together at the end of the shelf, under a thin line?** Recommended 1.

## Built — stage 1, 2026-11-08 09:31 (kpm `e589cab`, `2ce81a5`, live)
The owner can Sell Again; Tier 3 waits for stage 2 (the rules refuse a T3 creating a product or writing `quarantine_logs`, so the matrix key ships with rules CHANGE 24, published by Aldi first).

| Decision taken while building (not asked) | Why | Flips if |
|---|---|---|
| One lot per pack, `rsk-<pack>`, company-wide price (last one set wins) | no extra product per warehouse; the van and terminal already read one product | he wants a different price per warehouse |
| The lot stays where the packs are (regional crate -> that warehouse, Master Vault crate -> the Master Vault) — no warehouse picker, unlike Convert to Sample | the packs do not move; HQ vans can sell them too | — |
| "Cheaper" = one price for every shop tier (Retail, Grosir, Ecer, Distributor) | the board showed one price field | he wants tier prices for damaged packs |
| A lot with no stock is off the terminal shelf; a lot is never "low" | otherwise every terminal shows dead RUSAK cards and the dashboard raises restock alarms for packs nobody orders | — |
| Refused: a pack with no Retail price; a cheaper price of 0 or at/above full | found on the lab frame: "Full price · Rp 0" would have sold the lot for free | — |

Models applied: Inversion (what makes a lot sell at Rp 0 / at the wrong price), Second-Order Thinking (a non-promo product shows on every terminal and in every low-stock alarm).
Proof: `Raw/2026-11-08-sell-again/` (shelf PC + phone, crate, box, confirm); the lab's recorded writes: quarantine -8, `products/rsk-p-cg16` at Rp 8.500 all tiers, BANDUNG lot +8, a SELL log.
