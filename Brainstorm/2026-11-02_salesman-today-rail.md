---
date: 2026-11-02
status: OPEN — waiting on Aldi
---
# The salesman's TODAY box counts the whole team

Written 2026-11-02 05:45 WIB. Board: [[Raw/2026-11-02-today-rail/board.png]].

## Problem
No words of his yet - asked once in words 2026-10-27 17:44, no answer; asked again 2026-11-02 with the board.
The Sales Terminal's TODAY box (right rail, PC only - `hidden xl:flex` in `src/MerchantSalesView.jsx:2890`) runs `dayStats(transactions)` (:1639) on the company-wide 7-day list (`useDatabaseSync.js:83`, no agentId filter; `firestore.rules:721` lets any salesman read every sale). Seen in the lab (`?shell&terminal&team`, real terminal code, 1440): a T5 whom shops paid Rp 750.000 at 2 shops is told TAKEN Rp 4.780.000, STORES DONE 5, LAST CUSTOMER Toko Lancar (another salesman's sale). Read from the DOM and re-run in node - both agree.
Cost: privacy (every salesman sees company revenue and which shops the others visited) + a wrong cash number - "Taken" is meant to be his cash box (dayStats.js comment).

## Options
| | What changes | Costs |
|---|---|---|
| A (recommended) | box counts only sales with `agentId === agentProfileId` on a salesman's terminal; the boss's terminal unchanged | one filter before `dayStats` + a selfcheck line; trial: 750.000 / 2 / Warung Bu Sri |
| B | keep the team total on purpose, rename heading to "TEAM TODAY" | one label; privacy leak stays |
| C | show both, "You" and "Team" | more rail space; still shows company revenue to every salesman |

## Decision
OPEN — waiting on Aldi. Question sent: "❓ ANSWER: Should a salesman's TODAY box count only his own sales?"

## Rejected on purpose
- Changing `dayStats` itself or the listener: the same list feeds the boss's screens (`dayStats.selfcheck.mjs` pins it).
- Fixing it in the rules (salesman reads only his own sales): right long-term, but every screen that reads `transactions` for a salesman (customer brief, journey) would change - that is the per-salesman scoping question, not this box.
- `customerBrief(transactions, customerName)` (:1652) stays company-wide: a shop's history across salesmen is the point of the brief.

Models applied: Inversion (what does a salesman do with a wrong cash number at EOD), Second-Order Thinking (a rules fix moves every salesman screen), Chesterton's Fence (why the list is company-wide: the boss's screens).
