---
title: Master Vault, Bandung and the Admin van (his 3 bug reports)
created: 2026-11-04
status: OPEN — waiting on Aldi (which first; then the rank rule and the setting)
tags: [kpm, warehouse, fleet-roster, sales-terminal, brainstorm]
---

# Master Vault, Bandung and the Admin van

**Problem, his words (2026-11-03, with a video + a screenshot, both in `Raw/2026-11-03-hq-bugs/`):** *"why is the button become like this, and there is bug where bandung become the real headquarters because i check the supply that bandung fleet and roster have is the number that displayed on the master vault, i think we need some system where we can decide where is the master vault and where is the regional warehouse, and another bug i see is that when i move my admin vehicle account from muntilan to the headquarters through the edit button on fleet and roster looks like it doesnt move the account since it created its own warehouse shown on this video, my other regional team can see the master vault supply but my account cant while bandung fleet and roster also be able to see the master vault supply not their own regional warehoouse supply this is a big bug and fatal problems tho"*

## What was found (read only, no code changed, no check run - his rule)

| Bug | Mechanism | Evidence | Not proven |
|---|---|---|---|
| **C** Admin van "made its own warehouse" | The Edit form's place list is upper-cased (`existingLocations`, FleetCanvasManager.jsx:251) and saved as picked (:421, :436), so the record holds `HEADQUARTERS`. Every HQ test is an exact match on `Headquarters` (FleetCanvasManager.jsx:197, :610, :694, :768; App.jsx:2361; useDatabaseSync.js:211; StockOpnameView.jsx:269, :830; supply.js:43, :47), so it counts as a branch and reads `branches/HEADQUARTERS/inventory`, which is empty. | Video t=00:00 [TEST] HQ Sales Manager "Gudang PUSAT, 49.765 Bks"; t=00:02 Admin (Boss Vehicle), same HEADQUARTERS tab, "Gudang HEADQUARTERS, 0 Bks". That title only prints when `selectedAgentUsesBranch` is true (:1594), so the stored spelling is not exact. Only BranchWarehouseManager.jsx:290 compares case-blind. | The record itself was not read (no Firestore access from here). |
| **B** Bandung reads the Master Vault | Rule from July (`a07975f` 2026-07-19; comment App.jsx:2356 "Tier 3 and above always return to the Master Vault"): `isFieldLevelTier` is T5/T6 only, so T1-T4 use the Master Vault wherever they are posted. Same 5 copies as C. It moves real stock: van load (:610), empty van (:694), EOD return (App.jsx:2361). | grep: BANDUNG appears in app logic only in 2 comments, so the brief's hunch (a hardcoded Bandung, or the owner's location) is dead. | Bandung's 1 person being T1-T4 is by elimination: the video does not show that card. The bay's title would settle it (PUSAT vs BANDUNG). |
| **A** the button | Gradient fill is at least 5 months old (`4a6df36` 2026-06-03 touched it). New since 2026-11-03 08:16 (`c76408e`): `lang.js:223` 'MAKE DEAL' -> 'SIMPAN TRANSAKSI'. At `lg:text-2xl` + `tracking-[0.2em]` it wraps to 2 lines and the Zap icon is squeezed against the edge (MerchantSalesView.jsx:2457). A button-sized amber plate is a SLAB under his law (Aldi's Design Taste, 2026-08-21 + the SLAB vs MARK refinement). | His screenshot; `git log -S`. | Not rendered: the wrap cause is from reading, the wrap itself is from his screenshot. |

**B and C are one rule with two faults**: the "which warehouse does this van use" test, copied into 5 places. C = the spelling half. B = the rank half. Third bite of [[Headquarters Is Not a Cabang]].

**Ghost warehouse today:** 0 Bks in the video, so nothing to repair as of 2026-11-03. It fills the moment that van is emptied or its EOD is approved (200 Bks on board), or someone ships to it: `warehouseList` now offers HEADQUARTERS as a destination because `NON_BRANCH` is exact-match too.

**Sibling to check while fixing C:** Firestore paths are case-sensitive. The dropdown can turn a branch typed once as `Bandung` into `BANDUNG`: two shelves that the roster tabs show as one. App.jsx:2361 also lacks the UNASSIGNED test the other 4 copies have. A 'Headquarters' card opened in Edit probably SHOWS the first option (BANDUNG) because no option matches, while still saving Headquarters - not rendered.

## Options

**Order (asked now):** C, B, A recommended.

**The rank half of B (ask after C ships):**

| | Rule | Cost |
|---|---|---|
| R0 | Keep: T1-T4 Master Vault anywhere | Nothing to build. Bandung's T3/T4 keep draining the Master Vault: what he called fatal |
| R1 | T1-T2 Master Vault; T3-T6 their place | Two sentences to remember. A T2 posted in a region still reads the Master Vault |
| R2 | The place on the card decides, any rank (leaning this way) | Simplest to explain. His Admin van already behaves this way |

Both R1 and R2 cost: a van loaded from the Master Vault before the switch returns to the regional shelf at its next EOD (one-time drift; switch when those vans are empty, or accept it). Firestore rules must already let those vans write the regional shelf - check first, never widen.

**His setting (ask after the rank rule):**

| | What | Cost |
|---|---|---|
| S0 | "Headquarters" stays the fixed name | Nothing beyond C. His ask is not met |
| S1 | Settings: "Master Vault is at: [place]", one place; the shared check reads it | Small once C's one check exists. One-way trap: Master Vault stock lives in `products`, a branch's in `branches/X/inventory`. Picking a place whose shelf holds stock would hide that stock, so refuse until it is moved |
| S2 | Tag every place master/regional in the `places` registry | Biggest; `places` also holds factories and people. Nobody asked for two vaults |

## Decision

OPEN — waiting on Aldi. Asked (verbatim): **❓ ANSWER: Which bug do I fix first? Reply with the letters in your order, for example "C, B, A".**

## Rejected on purpose (by me, he has not seen these)

- Fixing only his one card by re-saving it as `Headquarters`: the next Edit breaks it or someone else again.
- Removing the upper-casing from the dropdown only: stored records stay broken, and "Type New Area" can still write any spelling.
- Widening a Firestore rule to make a read work: never.

Models applied: Chesterton's Fence (the rank rule was deliberate in July: find who relies on it first), Reversibility Test (S1 is a one-way door without the shelf guard), Second-Order Thinking (vans already loaded when the rule changes), Inversion (what guarantees a wrong fix: patching the one card he filmed).
