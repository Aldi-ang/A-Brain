---
title: Demo Guide on the Phone
description: The demo's step-by-step guide must ring a button the visitor can see and press; how it failed on the phone and how to walk it so it cannot pass by accident.
type: concept
confidence: high
checked: 2026-11-17
created: 2026-11-15
tags: [demo, guide, phone, testing, incident]
---

# Demo Guide on the Phone

The demo's guide (src/components/DemoMission.jsx + src/config/demoMission.js GUIDE) draws a box round the next button,
dims the rest and says one sentence. It is only right when the box sits on a button the visitor can SEE and PRESS on
the screen they are holding.

## The incident (found 2026-11-14, fixed in kpm b9a6c3a5, live 2026-11-15 07:25)

Found by the tutorial walk promised before the big-company switch (his yes, 2026-11-14 17:40). On the Android emulator
(Pixel 7, Chrome 124) six beats pointed off the screen or at the wrong thing:

| # | Where | What the visitor saw | Fix |
|---|---|---|---|
| 1 | step 4/5 "Pilih toko yang Anda kunjungi." | dark screen, no box (box at x -334: the manifest's button, off-canvas on the phone) | data-guide="customer" on the phone's customer bar too |
| 2 | every key inside the order slip (photo, sale/retur keys, damage boxes, the final press) | same, box at x -330 | slip(): the phone's Bayar/Retur key first, only while the slip is shut (data-shut) |
| 3 | the shelf while the slip is open | box round the shelf under the slip, its middle on BAGIKAN SAMPEL GRATIS | shelf counts only when not covered (data-covered); else the slip's header key, "Tutup pesanan dulu" |
| 4 | after SIMPAN TRANSAKSI / PROSES RETUR | box on the receipt's title, the real button under it | the receipt's CLOSE RECEIPT key first, "Tutup notanya dulu" |
| 5 | step 6 send key | 5 px of the key on a 783 px screen after the EOD deck folded | the box brings its target back while it sticks out, unless he scrolled by hand |
| 6 | step 8 count | sent to Submit after one box; the app refused ("type a number in both boxes") | data-half on the row and Submit; "Isi juga kotak ini" first |

Cost: 1-4 had been live since the slip became a drawer on 2026-10-31 - two weeks of a dark screen at step 4 for every
phone visitor. The 2026-11-08 and 11-10 walks pressed the same steps by selector (shops.js, tapsel.js) and passed them.

## How to walk it so it cannot pass by accident

A-Brain `Raw/2026-11-14-big-demo-walk/`:
- `walk.mjs` - follows the guide like a visitor: a real touch at the box's own centre (CDP Input.dispatchTouchEvent),
  a frame per beat, the box's position against the screen logged; it stops when a press does not move the guide.
  `--pc` (desktop Chrome), `--tag=name` (a run of its own), `--tier=T4`, `--gate-only` (time the vault gate).
- `tabs.mjs` - keep ONE demo tab: a background tab on the phone is frozen and a probe sent to it never answers
  (`am start` opens a new tab each time).
- `clear.mjs` - a first-time visitor (wipes the origin's storage). `probe.mjs` / `tap.mjs` - one look, one tap.
- The lab: [[Looking at the App]] ("A REAL Android phone") + NEXT-SESSION's lab steps.

## Still open (2026-11-15)

- Step 8: a count that differs from the stock must be typed twice ("Count this one again"); the guide does not say so.
- Speed, measured on the lab phone (emulator + dev server + Firestore emulator, slower than a real phone): the vault
  opened ~9.5 s after a fresh visit on the small company; on the big company 18-22 s after a SWITCH and 33 s+ on a
  first visit; PROSES RETUR stayed busy 16 s. Cause not proven. The big-company switch waits on his answer -
  [[2026-11-14_professional-demo-company]].

## The PC, and the menu tour (2026-11-17, kpm 04a6bed2)

- **The PC had the same bug in another form.** The shut menu keeps its items in the page at opacity 0, and the guide
  rang the first match: step 1's ring sat round an empty spot (frame
  `Raw/2026-11-15-journey-review/pc-f16-s1-02-buka-restock-vault.jpg`, 2026-11-16). Rule now: the ring takes only a
  copy that is DRAWN (a size, not visibility hidden, no opacity 0 on it or a parent). A drawn copy below the screen
  still counts, because the guide scrolls it in. Antigravity Task 7 had asked to drop that fallback entirely - that
  would also have stopped the scroll to a key under the fold.
- **Every menu beat names the PC's corner circle before the phone's edge key**, each with its own line. Hovering the
  circle opens the menu and the ring moves to the item.
- **The menu tour.** His 2026-11-16: *"he should give step by step tutorial starting from the sidebar first and what it
  use then to the next"*. Before the step: one beat per item this login's menu carries, in menu order, the item named
  as the menu shows it. LANJUT / LEWATI, once a day per browser. PC: the tour holds the menu open (`html.kpm-tour`),
  because the pointer leaves it for LANJUT. Phone: the ring sits on the edge key until a finger opens the menu - the
  pattern every step already uses. That closed the 🔴 DECIDE NEXT-SESSION had planned (open the drawer by itself, or a
  line with no ring) without asking him: a third way that needed neither.
- **Rejected on purpose:** pasting Antigravity Task 13's "ready to paste" block. Its beats had no `done` and no way
  forward (the guide would sit on item 1 forever), a tier list copied from the nav config (it drifts), and hover-only
  selectors on the PC (the menu shuts the moment the pointer goes to the box). A partner's ready block is a draft
  until it is run against the code that consumes it.
- Lab: `Raw/2026-11-17-menu-tour/` - g.mjs drives the lab Chrome (eval / shot / move / click / tapring / size); a
  size override lives only as long as the run that set it. Frames: pc-t1, pc-t9, pc-s1-totem, pc-s1-open, ph-t1-shut,
  ph-t1-open, ph-t9.

Links: [[Ponder Tutorial System]] · [[Anti-Recurrence Check]]
