---
title: Stock Opname for someone posted at the Master Vault
created: 2026-11-04
status: DECIDED by him, built + live kpm a60d191
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

**His answer turned down both my options, 2026-11-04:** *"there is only 1 submission needed each regional warehouse, not everyone should count, stock opname as default only be able to be seen by regional admin/T4 at default and they are the only one who should do that, if there is help from other member it is outside of this app ability to detect or care about it, lets take the stock opname submission each week as a group homework and the the team leader is the one who submit it, which is the T4"*

Built + live `a60d191`: T4 only by default; one count per warehouse, Monday to Sunday; the mark on the leader's roster card (pending_audits is closed to a T4 by the rules, proven in `rules-test/test-opname-week.mjs`, 7/7 on the repo's rules); a second count refused; a count sent back reopens the week with the reason. Findings 1, 2 and 3 above are fixed in the same commit. Proof: `Raw/2026-11-04-opname/built-week-submitted.jpg`, `built-t4-at-headquarters.jpg`.

**What I chose without asking, each easy to change:** the week is Monday to Sunday (`weekStartKey`); the owner's own counts and the demo are not limited; the T3 no longer has the screen by default; no reminder (he did not ask).

**Open, his to do:** a saved permission matrix wins over the defaults, so on the live app Settings > Tiers & Logic must show Stock Opname on T4 and off for the rest. The live rules were not checked; a real T4 phone is the test.

## Rejected on purpose (by me, he has not seen these)

- Writing stock to `branches/Headquarters` so the old path finds something: a second Master Vault, the exact trap in [[Headquarters Is Not a Cabang]].
- Hiding Stock Opname from people at the Master Vault: his 2026-10-27 *"dont hide the button"*, and it leaves the office unable to count.

Models applied: Inversion (what guarantees a wrong count reaches stock: nothing here, the approval stays), Chesterton's Fence (`isAreaAdmin` meant "has a branch" when everyone below ADMIN was in a branch).
