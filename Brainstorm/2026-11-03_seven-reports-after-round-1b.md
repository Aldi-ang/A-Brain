---
type: brainstorm
status: OPEN — waiting on Aldi's rank
date: 2026-11-03
---

# Seven reports after round 1b (2026-11-03 ~08:20 WIB)

## The problem, his words

*"i want the button to be still in theme of the resident evil village manifest paper not tech like this , another bug i found is that the sidebar inside sales terminal is not updating even when the hutang is already updated look at sc2 and 3, sc4 looks like the quarantine item cant be transferred between chest inside the fleet and roster, sc5 looks like the map is buggy and didnt show the chest here this is the journey map, there should be animation the EXP review and increase everytime the EOD has been done, EOD setoran animation should also be fixed because right now it just snap my screen and gone right away. test 1 complete. test 2 not completed, looks like the test account still unable to see all the customer even when i already put that account in muntilan region and i know the reason, so i found some intersection on the tempat tugas and the fleet and roster, when i put the tempat tugas in headquarters and the the fleet and roster is still inside the muntilan, the account will prioritise access that is affected by the tempat tugas instead of their location inside fleet and roster"*

TEST 1 (Master Vault exchange -> quarantine, `30130c8`) PASSED.

## Diagnosis (code read + one lab observation, no code written)

| # | Report | Cause | Evidence | Fix size |
|---|---|---|---|---|
| 1 | Test account sees HQ shops (TEST 2) | The rack's "Tempat tugas" select opens on Headquarters every time, and wearing a costume WRITES that place onto the test card in Fleet & Roster; the worn costume also keeps its own copy of the place (`pov.place`), so a later Fleet & Roster move never reaches it | TierPovSwitch.jsx:77,85; App.jsx:3918-3944; povPreview.js:117 | small |
| 2 | Sidebar Utang stuck at Rp 2.100.000 while Receivables says Rp 1.050.000 | Sidebar debt engine sorts by DAY only (`date` = YYYY-MM-DD); the list arrives newest-first, so a same-day payment is processed before the sale and thrown away. Receivables sorts by exact time | MerchantSalesView.jsx:205-240; ConsignmentFinanceView.jsx:285; useDatabaseSync.js:83 | small, [likely] |
| 3 | Journey map shows no chests | expedition.css:198 `.kx-spr, .kx-sgn { background: ... }` - the shorthand erases the chest picture when that CSS file loads AFTER the picture rules (mapSprites injects them; a screen like Day Replay can load first). Flags survive: no shorthand on them | Lab: moved the picture rules before expedition.css -> chest background computed `none`; moved back -> picture | 1 line |
| 4 | Quarantine pack cannot move between chests in Fleet & Roster | NOT a bug - built "tell only": a drop on the crate is refused, damaged goods settle at EOD / Stock Opname | LoadingBay.jsx:219, :493, :952 | new rule - needs his direction |
| 5 | EOD seal "snaps and is gone" | VERIFIED stamp lives 0.9 s (EOD_SEAL_MS = 900) and the approved card leaves the list the same instant, so the list collapses under the stamp | EODReconciliationView.jsx:18, :905, :930 | design -> frames |
| 6 | EXP should animate up after every EOD | Partly exists: "XP tonight" counts up on the SALESMAN's Shift Closed block after the boss's last approval (stage B, 2026-09-21). What is missing is unclear | EODReconciliationView.jsx:26-40 | ask when reached |
| 7 | Photo button looks "tech", wants RE Village manifest paper | the 3D black camera key `f530178` (his 2026-11-02 ask) | theme.css .kpm-shutter | design -> frames |

Side: his sc3 still says "LAST ORDER · 11 HOURS AGO" in English = that screen ran the version before `c76408e`. "1 days old" is English in the new build too -> round 2 board.

## Options

| Item | Option | Cost |
|---|---|---|
| 1 | A: Fleet & Roster is the one truth; the rack's select starts on "keep where it is" and only a chosen place moves the card | small; the rack loses its silent default |
| 1 | B: remove "Tempat tugas" from the rack; place only in Fleet & Roster | smallest; one more screen to visit to move a costume |
| 4 | which way a damaged pack may move (van crate -> warehouse quarantine? warehouse -> van to return to the factory?) | unknown until he says |

Recommended order: 3, 2, 1 (A), 5, 7, 6, 4.

## Decision

OPEN — waiting on Aldi's rank.

## Rejected on purpose

- Widening a Firestore rule so a test account sees more shops (a real Tier 4 must keep seeing only its region).

Models applied: Chesterton's Fence (item 4 - the refusal was built on purpose), Inversion (item 1 - how would a costume end up at HQ without him choosing it? the default).
