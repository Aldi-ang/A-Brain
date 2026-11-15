---
title: Fleet & Roster review - as every user, big demo company
created: 2026-11-15
status: OPEN — findings measured, board not made yet (paused 16:02 on his "pause a while i will go bro")
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
Not drawn yet. Next: owner 390 frames, trial 1-6 in the working tree, TODAY vs PROPOSED board, `git stash push` by file, send, he strikes.

## DECISION
OPEN — waiting on the board (not made).

## REJECTED ON PURPOSE
- Redrawing the chests' order on the phone (his approved Minecraft chest design) - #4 is answered by a jump bar, not a re-layout.
- #8 here - the language switch owns every label.

Models applied: Inversion (what would make a T4 load the wrong van / never find his own card), Second-Order Thinking (a jump bar that LOADED would move stock unseen - so it only scrolls), Opportunity Cost (the language fix stays in its own job).
