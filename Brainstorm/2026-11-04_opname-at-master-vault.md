---
title: Stock Opname for someone posted at the Master Vault
created: 2026-11-04
status: OPEN - waiting on Aldi (who may count it)
tags: [kpm, stock-opname, warehouse, brainstorm]
---

# Stock Opname for someone posted at the Master Vault

**Problem:** found while fixing [[2026-11-04_master-vault-and-three-bugs]], not reported by him. He chose to look at it first (*"123 is good order"*).

## What was found (no app code changed)

| # | Finding | Evidence | How sure |
|---|---|---|---|
| 1 | Anyone below `ADMIN` posted at the Master Vault has **nothing to count**. `isAreaAdmin = !isHighCommand` (StockOpnameView.jsx:221) reads `branches/<their location>/inventory` (:235), which never holds stock at the Master Vault, and the count list IS that shelf (:246) | Lab `?shell&opname&role=AREA_ADMIN&at=Headquarters`: "AUDITING: Headquarters", no products, "0 WARES COUNTED". Same tier at BANDUNG: the list. `Raw/2026-11-04-opname/` | Proven for a T3. T2 to T6 and the picked Master Vault place run the same lines; from reading |
| 2 | The tag "BLIND COUNT ENFORCED" shows even for a tier that sees the expected numbers: it depends only on `!isHighCommand` (:1022), the numbers on `showExpectedWhileCounting` (:211) | The Bandung frame shows the tag above EXPECTED GOOD 420 | Proven |
| 3 | The HQ AUDITS "Gudang Pusat" filter only matches `branchLocation` HQ or MASTER_VAULT (:906), but a count stores `user.location || 'HQ'` (:548). A Master Vault count by anyone with a location on their login hides from that filter; it still shows under All | From reading, not rendered | Likely |

Console in the lab: only the usual 500 on a static file, no listener or permission errors. Rules need no change: `products` read and `pending_audits` create are open to `isSalesman`, and only an ADMIN approves.

## Options

| | Rule | Cost |
|---|---|---|
| 1 (recommended) | Everyone posted at the Master Vault counts it. Rank only decides whether they see the expected numbers. Nothing changes until he approves | A T5/T6 at headquarters gets a long list |
| 2 | Only T3 and T4 count it; T5/T6 there see a line saying the office counts this warehouse | A rank test comes back, against his "according to the location of that cards not according to tiers" |

## Decision

OPEN - waiting on Aldi. Asked (verbatim): **🔴 DECIDE: Who posted at the Master Vault may count it in Stock Opname: 1 everyone posted there, or 2 only Tier 3 and 4?**

**Proposed fix, NOT trialled:** `const isAreaAdmin = !isHighCommand && (!user?.location || !isMasterVaultPlace(user.location));` That one name drives the listener, the list, `auditType` (MASTER_VAULT, so approval writes `products`) and the title. Blank location stays as it is (no list), it must not fall through to the Master Vault. Tag only when `!showExpectedWhileCounting`. Filter on `a.auditType === 'MASTER_VAULT'`. Option 2 adds the rank test.

## Rejected on purpose (by me, he has not seen these)

- Writing stock to `branches/Headquarters` so the old path finds something: a second Master Vault, the exact trap in [[Headquarters Is Not a Cabang]].
- Hiding Stock Opname from people at the Master Vault: his 2026-10-27 *"dont hide the button"*, and it leaves the office unable to count.

Models applied: Inversion (what guarantees a wrong count reaches stock: nothing here, the approval stays), Chesterton's Fence (`isAreaAdmin` meant "has a branch" when everyone below ADMIN was in a branch).
