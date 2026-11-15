---
title: A big-company demo for the professional edition
type: brainstorm
created: 2026-11-14
status: BUILT 2026-11-14 (kpm 2a02b48d) - live switch DECIDED yes (17:40), after the tutorial walk
tags: [kpm, demo, professional-edition, testing]
---

# A big-company demo for the professional edition

## PROBLEM (his words, 2026-11-14)
> *"i rather let u build a demo for the professional one first before testing because u could simulate as its a big company having a lot of sales and revenue to view"*

And on testing: *"all this test could be done in android since they both share the same ui as long as their resolution fir the iphone and android it should be fine, dont forget that some phone have notch as well like iphone"* - no more manual phone tests from him.

Today the live demo (rebuilt every night by api/demo-reset.js from demo/seed.json) holds 152 shops, 6 products, 5 tier settings, 6 promos - no salesmen and no sales, so every report is empty.

## OPTIONS
| | What | Writes per nightly rebuild | For him |
|---|---|---|---|
| A | Every single sale for 6 months (~30,000) | ~35,000 | the fullest history |
| B (proposed) | 20 salesmen, 3 areas, 600 shops; last 7 days in full (~1,800 sales + visit reports); 6 months as totals (~Rp 11 billion) | ~9,000 | looks like a big company on every screen |
| C | The big company only in the lab, the live demo unchanged | 0 | testing only; visitors still see an empty company |

## COSTS
- Firestore gives 20,000 free writes a day; the reset has 60 s (vercel.json maxDuration). A breaks both every night: a failed rebuild (an empty demo, as on 2026-11-10) or a bill.
- B assumes the screens load single sales for 7 days and read older months from totals (useDatabaseSync.js, salesRollupWrite.js) - check before building.
- C wastes the work for his pitch: visitors would still meet an empty company.

## DECISION
B accepted (15:40): *"yes just like the previous demo that we made right exactly the same, with tutorial capybara also but with the newest version of the app, but if this takes a long time and quota then we can do it at last, because dont making the demo causing double job since we havent redesign most of the segment inside this app right ... or do u have other pov?"*

Timing OPEN - waiting on Aldi: "split" (my pick) or "all at the end".
- Split: the company's data now (a generator that feeds the lab for testing every redesign at real size, later the live demo's nightly seed); the capybara tutorial, the demo door and the live seed swap last. His double-job worry is right for those - they point at screens still being redesigned - and wrong for the data: redesigns change looks, not data ("same logic").
- not-chosen: all at the end - loses real-size test data for every redesign until then. flips if the data model is about to change.
- not-chosen: the whole demo now - the tutorial would be redone after each redesign.

## BUILT (2026-11-14 17:07, kpm `2a02b48d`) - the data, off on the live demo
His 15:57 *"u can build the simulation now for maximum quality for our app testing and building"*. `buildDemoCompany(seed, now, vault, { big: true })` in api/_demoCompany.js; the live reset builds it only when the demo's server has DEMO_SIZE=big.

| | Small (live today) | Big |
|---|---|---|
| People / salesmen | 9 / 4 | 25 / 20 (16 new practice salesmen) |
| Teams / areas | 2 / - | 2 / 3 (Kab. Magelang = HQ; Kab. Bandung + Bandung Barat; Kota Bandung + Cimahi) |
| Shops | 148 | 600 (452 made 60-300 m from a real shop of the same kecamatan) |
| Single sales | 487 over 4 weeks | 1,540 over the last week |
| Month tallies | 2 months | 6 months, Rp 12,36 miliar of sales to shops |
| Writes a reset | 897 | 2,841 (budget 7,500 = 30 s of the 60 s, under half the free 20,000) |

Emulator, the real handler + rules: big 34/34, 2,841 docs in 7.4 s, a second reset leaves the same counts.

**The check the plan asked for, answered:** option B assumed the screens read older months from totals. Measured in the code: only Product Performance (Reports, T1/T2 only) reads `sales_stats`; the Reports archive ("Pull archive", HistoryReportView via fetchHistoricalTransactions) and Day Replay read single sales. So the 6 months show only as per-product totals, and the archive reaches back 1 week (the small company: 4 weeks). Four weeks in full for 20 salesmen = ~7,500 docs, at the budget - not done. Related: [[Summaries/The Panel That Never Reads a Transaction]] (the same panel and rollup).

**A wrong premise caught before building:** the 15:35 note said the live demo has "NO salesmen, NO sales". That was demo/seed.json, the reset's INPUT; the reset itself makes 4 sellers and 487 sales (~Rp 1,5 miliar a month).

DECIDED 17:40: his *"yes"* - the live demo becomes the big company. Order kept: the capybara tutorial walked on it first (NEXT-SESSION), then the switch. Asked: 🔴 "should the live demo's nightly reset build the big company?" Yes = visitors meet the big company from the next 00:05 WIB reset (a production write); before the switch, the capybara tutorial is walked on it once (25 roster cards, Dika's 29 shops). No = it stays in the emulator lab for my tests.

## REJECTED ON PURPOSE
- A: over the free write allowance and the 60 s reset, every night.
- Manual iPhone test lists: he will not run them; Safari-only behaviour (its print screen, its hold-to-copy menu) stays untested, accepted because most users are on Android.

Models applied: Pre-mortem (the nightly rebuild under load), Opportunity Cost (lab-only data vs the demo visitors see), Second-Order Thinking (a bigger seed changes the reset, not only the screens).

## 2026-11-15 07:28 - the walk, and the switch HELD (OPEN - waiting on Aldi)
- The tutorial walk found 6 guide gaps on the phone - none caused by the big company - fixed and live in kpm b9a6c3a5. [[Demo Guide on the Phone]].
- Speed on the lab phone (emulator + dev server + Firestore emulator; slower than a real phone, so the ratio is the signal): vault open ~9.5 s on a first visit to the small company; on the big company 18-22 s after a SWITCH and 33 s+ on a first visit; PROSES RETUR stayed busy 16 s.
- The switch was edited, then taken back out before the push (4 edits, listed in kpm .claude/NEXT-SESSION.md).
- OPEN - waiting on Aldi: "Switch the live demo to the big company tonight, and you check the speed on your own phone tomorrow?" My pick: yes - one setting (DEMO_SIZE=small) or one push puts the small company back the same day.
- Models applied: Reversibility Test (one setting back), Opportunity Cost (his phone answers in a minute what the lab cannot), Second-Order Thinking (a 20 s wait at every SWITCH is a prospect's first impression).
