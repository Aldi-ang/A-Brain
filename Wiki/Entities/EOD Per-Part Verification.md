---
title: EOD Per-Part Verification
description: How the boss approves or returns each part of a salesman's night on its own (cash, transfer, stock, damaged, cukai, bounty) — the data contract behind the player card, what each part credits, and what stays untouched.
type: entity
created: 2026-09-20
updated: 2026-09-21
confidence: high
checked: 2026-09-21
tags: [kpm, eod, money, firestore, career, player-card]
---

# EOD Per-Part Verification

Shipped as kpm `a401463` (2026-09-20 14:25), stage A of [[The Player Card]]. His words, 03:55:
*"maybe it is better when we made approve and reject for every single EOD, so one for each, cash,
transfer, pita cukai, bounties for havent paid penalty, etc"*; 04:15: *"per item reject and approve
looks okay, since sales will bring few kind of items"*.

## The contract — `eodReportParts(report)` (src/utils/helpers.js)

| report | parts it carries |
|---|---|
| CASH_STOCK | `cash`, `transfer`, `stock` (always — an empty van is still a handover), `damaged` when the van brought packs back, `bounty` only when the count came up short (`eodBountyLines` non-empty) |
| CUKAI | `cukai` |
| BOUNTY | `bounty` (the cash paying the fine) |
| legacy (no reportType) | `cash`, `transfer`, `stock`, `damaged`?, `cukai` when `cukai > 0`, `bounty`? |

`EOD_PART_LABELS` names them once for every screen. `eodPartApproved(report, part)`: a missing
`verified` map reads as NOT approved; `status === 'VERIFIED'` reads as everything approved — the
safe direction for money.

## The handler — `handleVerifyEOD(report, decision)` (src/App.jsx)

`decision = { approve: ['cash', …], reject: { stock: 'kurang 2 bks' } }`. No decision = every
carried part approved (the old one-tap verify, kept for the lab and any old caller).

1. Reads the report INSIDE the transaction; drops any part already in its `verified` map. Two
   admins approving the same part a moment apart credit it once.
2. Reads and writes ONLY the parts approved now: `stock` → products / branch inventory credited
   and the van (`activeCanvas`) wiped; `damaged` → `damagedStock` incremented, the source
   transactions flagged `eodCredited`, the quarantine notification; `cukai` → stamps paid against
   `cukaiDebts`; `bounty` → the shortfall minted as `PENALTY_EOD_<id>_…` lines (CASH_STOCK) or the
   fine's keys deleted (BOUNTY). A part going back touches nothing.
3. Writes `verified` (merged) and `rejected` (merged; an approved part's reason deleted). A reject
   also writes an `EOD_RETURNED` notification to the salesman, and his EOD screen shows the part
   and the reason in red under "Awaiting Verification".
4. Only when EVERY carried part is verified: the career ledger (`collected`, `itemsBks`,
   `daysVerified`…), `computeDayXP`, streaks, badges, `status: 'VERIFIED'`. Until then the report
   stays PENDING. So a night's XP lands once, at the last approval.
5. Resolves `true` when the write landed, `false` on cancel or failure — the card plays the
   scan + seal only on `true`.

The confirm dialog names the parts in hand and the reasons going back; the bounty amount is
still named before it is minted (his 2026-08-18 rule: approving is allowed, never silent).

**One question per night (kpm `992ff6e`, `601e387`, 2026-09-20 16:30).** A night is two
documents (CASH_STOCK + CUKAI), and asking per document read to him as *"this panel showing up
twice"*. The card now asks ONCE through `helpers.eodNightMessage(items, inventory, tier)` — the
parts in handover order (cash, transfer, stock back, damaged goods, pita cukai), the bounty lines,
the van note, the reasons going back — and calls `handleVerifyEOD(report, decision,
{ confirmed: true })` per report; the flag skips the handler's own confirm. `handleResetEOD`
takes the same flag, so RESET / FORCE RESET ask once for the night. A cancel keeps his ticks.
Watched in the pane 2026-09-21 07:45 with real taps: five ✓ → one dialog → CANCEL (ticks stay) →
CONFIRM → both writes (e2 `cukai`; e1 `cash, transfer, stock, damaged`) and the scan + VERIFIED
seal for 900 ms. The History Log shows the night as ONE row (kpm `992ff6e`): cash & stock and pita
cukai together, the money on the right, the stamps under it, one FORCE RESET; a BOUNTY fine keeps
its own row.

## What did NOT change, and why

- **firestore.rules — untouched, reported.** The boss's session writes the report; he already
  owns `users/{bossUid}/{document=**}`. The salesman's `eod_reports` rule stays `allow update,
  delete: if false`. New fields ride on the same write as `status`.
- **RESET stays.** A wrong NUMBER is not a rejected part — reset deletes the night and he
  submits again. A rejected part is a right number he has not physically delivered yet.
- **The career credit is per night, not per part.** Splitting XP per part would need per-part
  `credited` keys and a new XP model; the night's XP at the last approval matches stage B's
  "EXP gain animation on his EOD panel when the boss approves".

## Open edges (not bugs, decisions he has not made)

- The revenue bar in the card compares tonight with his usual verified night (ledger average).
  No per-salesman target exists in the data; the company daily target (`targetMonthlyRevenue/30`)
  would read as failure every night for one man. If he wants a fixed target, that is a setting.
- With the Rank Config switch on "Last 7 days" (career ledger off) the card shows the omset XP
  and no "+N tonight" — that formula has no per-day gain.
- Stage B: the card's head on the salesman's own Agent Profile + the EXP gain animation.
  Stage C: the History Log stays folders.

## Related

- [[The Player Card]] — the card itself and his taste on it.
- [[Rank Config and Achievement Badges]] — the ladder the card climbs (`rankLadder`, `DEFAULT_RANKS` in config/career.js).
- [[Aldi's Design Taste]] — "The player card" section, his words verbatim.
- [[UI-Says-Yes-Server-Says-No Pattern]] — why the rules were checked before the UI was drawn.

## Verify before trusting

`node src/config/logicFixes.selfcheck.mjs` — the EOD HQ VERIFICATION block (parts contract,
fresh-map gate, per-part gating, VERIFIED-only-when-complete). Lab: `?shell&eod&admin`.
