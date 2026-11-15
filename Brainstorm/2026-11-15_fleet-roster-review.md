---
title: Fleet & Roster review - as every user, big demo company
created: 2026-11-15
status: OPEN — board sent 2026-11-15 16:42, his strikes owed
confidence: measured in the lab (frames + DOM numbers), not on a real phone
---

# Fleet & Roster review (2026-11-15)

## PROBLEM (his words)
*"Journey Plan looks its best first, then Fleet & Roster"* · *"whatever the order as long as all done, efficiently and effectively"* (2026-11-15).
Standing taste: the van-loading flow is the logic he cares about here (2026-09-22); "one job, one control"; a number said twice is clutter.

## How it was measured
Lab 5176, big demo company (reset 34/34), headless Chrome on CDP 9557. Owner HARTONO (T2) and regional admin HENDRA (T4) at 1280 and 390;
salesman DIKA (T6) checked. Frames + scripts: `Raw/2026-11-15-fleet-review/` (`fs.mjs`, `pick.js`, `pickb.js`, `cast.js`, `where.js`, `addline.js`).
Console clean in every run (no permission-denied). Numbers agree: bar INITIAL 1275 = ledger INIT sum, SOLD 375, CURRENT 900.

## Findings (measured)

| # | Who / width | What costs time | Where | Smallest fix |
|---|---|---|---|---|
| 1 | owner + T4, all | Regional admins (T4) sort LAST and get no crown; the T3 gets both. Hendra's own card is #9 on page 2 of his own roster; Dewi (Bandung's boss) #13, page 2 | `FleetCanvasManager.jsx:1418` rank map lacks FLEET_CAPTAIN (0 < AGENT 1); `:877` leader omits it | add FLEET_CAPTAIN to both. The Fleet Captain Permission Gap, UI side |
| 2 | all | Said twice: header "Active personnel 24 · 20 vans loaded" + tiles PEOPLE 24 / VANS LOADED 20/24 | `:1143` and the community box `~:1816` | drop the two tiles, keep BKS IN THE VANS + OVERRIDE |
| 3 | T4, 390 | Title "HEADQUARTERS ROSTER" cut to "HEADQUARTERS l" by OFFERS + add keys; personnel line wraps to 2 lines | header `:1136-1165` | OFFERS icon-only on the phone (to measure) |
| 4 | T4, 390 | Load flow: page 2,609 px on a 720 px screen. Tap 1 on a warehouse item (y 484) -> the van box for tap 2 is at y 886, under the 844 screen. Muatan list y 1,061 and MUAT VAN y 1,170 off screen. From the top MUAT VAN is 2.2 screens down (PC: one scroll) | LoadingBay order on the phone | trial: phone-only bar that jumps to the muatan list (never loads by itself - MUAT VAN moves stock) |
| 5 | 390 | Stage: 7 cards per page, 1.5 on screen, sideways 1,344 px AND page keys 1/2 - two controls for one job | `:1442` PER_STAGE = 7 | phone: one swipe row, no page keys |
| 6 | all | Ledger rows say one number twice: "Active Load: 300 Bks" + "LEFT: 300"; loaded rows repeat the van chest | Itemized Asset Ledger `~:1620` | drop "Active Load" |
| 7 | all | "VAN · VAN" under the van chest | demo seed puts "Van" in the plate field; `LoadingBay.jsx:781` prints it | demo seed gets plates - demo tool, not the screen |
| 8 | id mode | Two languages on one screen (bay Indonesian, roster English; header ARMADA & KANVAS vs card FLEET ROSTER) | - | the language-switch job, not this one |
| 9 | demo, 390 | HOW MANY sheet: its top (item photo + name) sits under the DEMO strip + mission bar | `.kpm-bay-sheet` | to measure first |
| 10 | T5/T6 | Salesmen have no `view_fleet` (`permissions.js:196-203`); live: DIKA's menu has no fleet key | - | by design, nothing to review |

## OPTIONS / COSTS
Board: `Raw/2026-11-15-fleet-review/board.png`. Trial: git stash "fleet-review trial 2026-11-15" (3 files, +41/-10).

| Board # | Proposed | Measured cost / gain |
|---|---|---|
| 1 | T4 crowned + ranked under T3, above salesmen | Dewi 13th (page 2) -> 1st; Hendra 9th -> 2nd. 2 lines |
| 2 | phone: OFFERS icon-only, title tracking normal, one swipe row (matchMedia listener), 4 tiles -> 2 | title needs 240 / has 175 -> 225 / 225 (0 px spare: a longer area name still ends in …); line 30 -> 15 px; first screen fits 844 |
| 3 | phone: glide to the van after tap 1; gold muatan bar that only scrolls | van square 886 -> 438 px; MUAT VAN 1,062 px (under) -> 501 px after one press. First try (block nearest) put the bar over the van row - changed to center |
| 4 | "Active Load" only when the unit is not Bks | page 2,609 -> 2,504 px; keeps the info for a Slop/Bal van |

Not trialled: #7 (demo seed plates), #8 (language switch job), #9 (demo sheet top - measure first).
Trap met on the way: a width read once at render kept the phone's single row on the PC after a resize - now a matchMedia listener.

## DECISION
OPEN — waiting on his strikes (board sent 2026-11-15 16:42).

## REJECTED ON PURPOSE
- Redrawing the chests' order on the phone (his approved Minecraft chest design) - #4 is answered by a jump bar, not a re-layout.
- #8 here - the language switch owns every label.

Models applied: Inversion (what would make a T4 load the wrong van / never find his own card), Second-Order Thinking (a jump bar that LOADED would move stock unseen - so it only scrolls), Opportunity Cost (the language fix stays in its own job).

## Round 2 (2026-11-15 17:40) - he refused all four: "its all gamified"

> *"well i dont want all because its all gamified tbh we need to create e new professional one, research and give me an idea to do that"*

Research (InSitu Sales, "DSD Truck Inventory and Route Settlement", insitusales.com, read 17:3x; the search tool and Chrome were down, read in the app's browser): van sales = plan the load from expected demand minus stock already on the truck -> loading is a custody handoff (dispatched = accepted, a gap stays visible) -> sell from the truck -> returns kept apart from credits -> end-of-day count against expected (opening + loads + returns - sales). Units (cases vs packs) fixed before departure.

Idea drawn (Raw/2026-11-15-fleet-review/pro.html -> pro-board.png), real lab numbers:
| Part | Today | Idea |
|---|---|---|
| Roster | stage cards, 7 per page, swipe + page keys | ruled table: leaders on top, salesmen A-Z, loaded / sold (+bar) / left; phone = one line per person |
| Loading | 2 chests, tap box -> tap van square -> how many -> MUAT VAN | load sheet: warehouse / in van / last day sold / − n +; Fill suggested; one gold Load van button (pinned on the phone) |
| Extras | chest tabs | plain tabs: Return, Damaged, Consignment, Requests; Usual load + Copy a teammate as buttons |
| Motion | chests, sounds, 3D crate | number tick + click sound on − n +; In van counts up once after Load; line turns Loaded |

Trial stash "fleet-review trial 2026-11-15" is now mostly moot; #1 (T4 crown/rank) is folded into the idea (leaders on top).

DECISION: OPEN - his yes on the direction + the suggested-load rule.
REJECTED ON PURPOSE: polishing the game look (his refusal); a drag-and-drop load (professional = typed counts with − n +, his 2026-11-12 rule); a separate Loading module (he chose "inside Fleet & Roster" on 2026-09-22 - the sheet lives in the same screen).
Models applied: Chesterton's Fence (every chest feature - preset, copy, quarantine, consignment, geofence, Surat Jalan - kept as a plain control), Second-Order Thinking (a suggested load changes what a regional admin loads: shown as a suggestion he presses, never auto-filled), Reversibility (the game look stays in tag game-edition-v1).
