---
title: Journey Plan on the big demo company - the phone test
type: brainstorm
created: 2026-11-15
status: A-D DONE, LIVE 9352941a (2026-11-15 12:50 WIB); E waits on his phone test; F not picked
tags: [kpm, journey-plan, demo, testing, android, iphone, speed]
confidence: high (every number below was measured; the iPhone row is a simulation)
checked: 2026-11-15
---

# Journey Plan on the big demo company - the phone test

## PROBLEM (his words)
> *"all this test could be done in android since they both share the same ui as long as their resolution fir the iphone and android it should be fine, dont forget that some phone have notch as well like iphone"* (2026-11-14)

> *"yes, to make sure that there is no problem when big company want to use my system is simulate it big"* (2026-11-15)

## HOW IT WAS TESTED
- The big company on the Firebase emulator: 600 shops, 20 salesmen, 1,544 sales (`node tools/demo-reset-emulator.mjs`, 34/34).
- The Android emulator `kpm_phone` (Pixel 7, Chrome 124): 412 px wide, then `wm size 1170x2532` + `wm density 480` = 390 px (an iPhone 13's width).
- The live app's production code, not the dev server: dist-demo built with the emulator switch opened for that one build (firebase.js line 71 patched, built, restored, `git diff` 0 lines), served by launch.json `demo-build` (4195).
- The iPhone 13 opened from the home screen, with its notch: PC Chrome 157 headless at 390x844, DPR 3, touch, hover none, an iPhone user agent and `Emulation.setSafeAreaInsetsOverride { top: 47, bottom: 34 }`. A simulation: the notch, clock and home bar are drawn on the board.
- Board: `Raw/2026-11-15-journey-big/board.png`. Scripts there: `jp.mjs` (state / tap / shot / journey timing), `prof.mjs` + `callers.mjs` (CPU profile of the open), `notch.mjs`, `fresh.mjs` (first-time visitor), `hush.mjs` (capybara intro), `walk4195.mjs` (sign-in + vault gate on 4195).

## FINDINGS (measured)
| # | What | Who sees it | Evidence |
|---|---|---|---|
| 1 | The full map on Android Chrome is taller than the screen: 839 px on a 783 px screen (412 wide), 773 on 717 (390). The six bottom keys (Brush, Borders, Set Home, Fly Home, Locate, Exit) lose their names below the edge; the top half of each key still takes a tap. | every Android user in a Chrome tab - most users | `fixed inset-0` on `.kx-map` resolves to Chrome's large viewport (a 100vh probe also reads 839). On the iPhone home-screen simulation it fits: dock 719-787 of 844. |
| 2 | The full map's top row (the salesman chips AP, AW ... and the zoom +) sits at y 13 on Android and y 60 on the iPhone, under the DEMO bar and the guide line. | demo visitors only | `elementFromPoint` at the chips returns `kpm-demo-bar` |
| 3 | Find a shop while a salesman is pressed: the map flies to the shop, but only his shops are drawn (`hideOthers`, JourneyView.jsx:848), and `goToShop` warns only about a shop that is off the day's round (:896). Result: empty streets, no message. | everyone who uses Journey Plan | nearest pin 3,467 px from the map's centre; "All shops" did not bring it back. With nobody pressed it works (pins 36 px from the centre). |
| 4 | The top says 36/600 visited, the Team box says 228/588 shops done. | demo only | the demo writes `lastVisit` only from visit reports (api/_demoCompany.js:345-359); a real sale writes it too (MerchantSalesView.jsx:1445) |
| 5 | Journey Plan's shops appear 1.8-2.2 s after the tap and settle at 3.3-3.9 s; 3.8 s on the first open after a page load. | everyone | production build on the emulator. Profile of one open (4.7 s, profiler on): garbage collection ~1.0 s, idle ~1.0 s, Leaflet re-making marker icons 0.32 s (`setIcon`), JourneyView 0.34 s |
| 6 | The vault gate on a first visit, big company: 23.5 s on the production build (22.9 s on the dev server). | demo visitors; a real big customer's first day | `walk4195.mjs --gate-only`. The dev server is NOT the reason - this one is real. |
| 7 | A 46 px empty band between the day row and the small map (the closed Find / Team fold). | everyone | day row bottom 360, map top 406 |
| 8 | The capybara's "WELCOME BACK, BOSS!" stands over the full map's bottom-right corner on Android; Exit still takes the tap. | demo visitors | frame b412-3 |

No refused listener or console error in any run (lesson check for #1-#4).

## LAB TRAPS FOUND (also in [[Looking at the App]])
- Speed numbers from the vite dev server (5176) lie: 8-17 s there against 1.8-2.2 s on the production build. About 6 of 10 profiled seconds were React's dev-only work (`now` from `startProfilerTimer`, `jsxDEV`).
- launch.json `demo-build` (4195) serves a build that talks to the LIVE demo project, not the emulator: SIGN IN WITH GOOGLE opened the real accounts.google.com. Stopped there - nothing typed, the tab closed.

## OPTIONS (fixes, smallest first)
| | Fix | Size | Cost / risk |
|---|---|---|---|
| A | #1: size the full map to the visible screen (`100dvh` or the small viewport) | CSS + one check | re-test on the phone; the iPhone is already fine |
| B | #3: a shop searched while a salesman is pressed: let go of him and fly there (all shops back), or keep him and say "Toko X is not on AW's road" | ~3 lines in goToShop + one check | letting go changes his focus; his 2026-10 *"just show the stores that is being assigned for him"* is why others hide |
| C | #2: start the full map's top row below the DEMO bar | CSS, demo build | demo only |
| D | #4: in the demo data, a sale sets the shop's lastVisit too | api/_demoCompany.js | shows after the next reset |
| E | #6: the vault gate's 23.5 s | a diagnosis job of its own | the open speed item; his phone test after 00:05 WIB decides its rank |
| F | #7: close the 46 px band | CSS | look only |

## DECISION
His pick (2026-11-15 morning): A, B, C, D now; B = name the teammate - *"add some notification and warning that this store is occupied by teammate name"*.

DONE, LIVE 9352941a (pushed 2026-11-15 12:50 WIB). Measured after the fix on the lab phone (Pixel 7 emulator, dev server on the emulator data):
| | before | after |
|---|---|---|
| A, Android 412 | map 839 px on a 783 screen, key names cut | map 71-783, 6 keys named |
| A, Android 390 | map 773 on 717 | map 71-717, keys 631-689 |
| C, Android | salesman row y 13 under the DEMO bar | y 84, the map under the finger |
| C, iPhone 13 sim | row y 60 under the DEMO bar; keys 719-787 of 844 | row y 131; keys unchanged 719-787 |
| B | empty streets, no message | "Toko Subur Baleendah is DEDE SUPRIATNA's shop, not BAGUS SETIAWAN's - only BAGUS SETIAWAN's shops show while he is pressed." (412 y 83, 390 y 94) |
| D | top 36 visited vs Team 228 done | top 264 = 228 that bought + 36 visit-only |
Board: Raw/2026-11-15-journey-big/board-ad.png. Gates: selfcheck 2972/2972 (3 new, RED on old code), build, audit 725/725, demo build check.
Lab traps this round: the note is a toast and is gone ~3 s after Enter - shoot right after the key; `am start` with a URL opens a SECOND Chrome tab and the hidden one freezes every CDP script (close it via /json/close); the Find box sits in a fold opened by the "Today's Route" header.

ORDER AFTER A-D (2026-11-15 13:21): he asked *"dont we continue with the demo application or the fleet and roster yet?"*, then *"whatever the order as long as all done, efficiently and effectively"*. Claude's order: the Q2 Day Replay mark (smallest, same screen) -> Fleet & Roster -> the demo tutorial + demo door (his split: last). E jumps first if his phone test says slow.

STILL OPEN: E (vault gate 23.5 s on a first visit, big company) - after his phone test of the live demo from 2026-11-16 00:05 WIB. F (46 px band) - not picked.

## REJECTED ON PURPOSE
- Timing on the vite dev server: React's dev timers inflate it 4-8x.
- Signing in on the `demo-build` page: it is the real demo project.
- Fixing anything in this session: findings first, he ranks them (his rule, "diagnose before changing").

Models applied: Inversion (what would make a big customer give up on day one - keys he cannot read, a search that shows nothing), Second-Order Thinking (option B changes what pressing a salesman means), Reversibility Test (A, C and F are CSS).

## REVIEW 2026-11-15 13:45 - "is Journey Plan now the most efficient and most effective UI?"
His words: *"does u think journey plan now is the most efficient end most effective UI that we can do right now? if u have any suggestion as all the users for this app then tell me and show me the solution"*.
Answer given: not yet - six things still cost a user time; none needs a new screen. Rulings it must respect (Aldi's Design Taste): the 160 px map strip is his pick (A, 2026-09-20, "shrink, not hide"); the fold is his default for what is not pressed every minute (2026-09-19); phone = one thing at a time, PC = everything (2026-10-03); a fullscreen map keeps one thin row (2026-10-05).

| # | Who it costs | Now (measured 2026-11-15, big demo company) | Fix to show |
|---|---|---|---|
| 1 | owner, supervisor | BUDI SANTOSO and BAGUS SETIAWAN both read "BS 11/28" on the salesman chips (small map + full map) | chip carries the first name ("BAGUS 11/28") or enough letters to differ |
| 2 | owner | top "264/600 VISITED" vs Team box "228/588 SHOPS" on one screen, nothing says why they differ (264 = 228 that bought + 36 visit-only) | name both: "264 visited · 228 bought" |
| 3 | everyone | Find a shop opens only from the "TODAY'S ROUTE ALL ▾" header; closed, it leaves a 46 px empty band (finding F) | keep his fold; a search key on the day row opens it on Find; the band goes |
| 4 | phone | "336 SHOPS LEFT" = 600 - 264, already in the bar; the map strip starts at y 407 of 717 at 390 | drop that tile (or make the tile row one line) -> map higher on the first screen |
| 5 | big company | Journey opens 1.8-2.2 s on the production build; 0.32 s is Leaflet re-making every shop mark's icon (profile p412-open.cpuprofile) | reuse the icons; no look change |
| 6 | demo visitors, Android | the capybara's "WELCOME BACK, BOSS!" covers the full map's Exit corner | move the bubble clear of the dock |
Not checked: the salesman's own Journey Plan on the phone - goes on the same board.
COSTS: 1-4 are small JSX/CSS each with a check; 5 is a memo in the marker layer; 6 demo only.
DECISION: OPEN - board (today vs proposed, 390 + 1280) is the next chat's first job, with the Q2 mark on the same lab run; he strikes what he does not want, the rest gets built.
REJECTED ON PURPOSE: a full re-layout of the page (he picked this layout - redesign B, 040faf91 - and the strip); hiding the stats.
Models applied: Chesterton's Fence (his strip + fold picks stay), Inversion (what makes a user give up: not finding a shop, wrong man pressed, two numbers).

## BOARD 2026-11-15 14:45 - today vs proposed, sent; the Q2 mark BUILT and LIVE (kpm 745d9cc7)
Board: `Raw/2026-11-15-journey-review/board.png` (spec board.json, frames by shoot.mjs / q2.mjs on the lab dev server 5176, headless Chrome at 390 dpr 3 with touch media + 1280). The proposals ran in the working tree and are parked in kpm `git stash` "journey-review trial 2026-11-15" (JourneyView.jsx, Expedition.jsx, utils/expedition.js, expedition.css) - nothing proposed is live.

| # | Proposal on the board | Measured |
|---|---|---|
| 1 | Chip = first name when two men share initials (owner: BS x2 -> BAGUS / BUDI, DS x3 -> DADANG / DEDE / DIKA; the salesman's team too) | pick arrays read off the DOM |
| 2 | Team header "228/588 shops" -> "228/588 sold" (264 visited, 228 of them bought); PC: the only change | |
| 3 | Search key beside "ALL" on the phone: one press opens the fold with the shop box focused | focus = "Find a shop", fold open |
| 4 | Three tiles -> one line "20 salesmen out · 0 overdue" (shops left = 600 - 264, said twice) | map top 407 -> 367 px at 390 (40 higher); empty band 46 -> 34 px |
| S | NEW, salesman (Dika, T6) checked for the first time: his first screen is the area's numbers (263/598, 335 left, 8 out); his own next shop sits at the bottom of the Team box, under the map. Proposed: the one line is his - "YOUR NEXT SHOP WARMED AFGANMART02 · 0,6 KM" | |
| a | (no picture) open speed 1.8-2.2 s, 0.32 s = Leaflet re-making shop icons -> reuse | from the 13:45 review |
| b | (no picture, demo) capybara bubble over the full map's Exit corner | |

Q2 mark, BUILT (his "q2= sure", 2026-11-14): gold glow + gold ring (a border in literal #E4B04A - --gold is black in light mode). Found while building on the REAL app at 390: the pressed flag landed UNDER the full-map bottom bar (flag top 478, bar top 452) - the ponder-lab board never showed it because its card was shorter. So one pan per press (dayLog.js clearPan) moves the shop into the band between the top chips and the bar: 562 -> 301, bar top 428; at 412 the shop was clear (348 vs 523) and nothing moved. Lite Mode: glow off, ring stays (computed 3px rgb(228,176,74), filter none).

Traps hit on the trial (not shipped): a component class `display:none` loses to theme.css `button:has(> svg:only-child)` (0,1,1) on an icon-only button - the search key showed on the PC until it was wrapped in a `lg:hidden` span. The first Team-box frames showed only the first 4 chips, which hid the duplicates - re-shot with the chip row scrolled to chip 4 (Anti-Recurrence: the TODAY frame must show the defect).

DECISION: OPEN - waiting on Aldi to strike what he does not want; the rest gets built from the stash with a check each, then Fleet & Roster.
Models applied: Chesterton's Fence (strip + fold kept), Inversion (the pressed shop hidden under its own card), Second-Order Thinking (the one line becomes the salesman's own).
