---
title: A big-company demo for the professional edition
type: brainstorm
created: 2026-11-14
status: OPEN - waiting on Aldi
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
OPEN - waiting on Aldi. Asked 15:35: B, "yes" or his own numbers. The job is NEXT-SESSION top in kpm.

## REJECTED ON PURPOSE
- A: over the free write allowance and the 60 s reset, every night.
- Manual iPhone test lists: he will not run them; Safari-only behaviour (its print screen, its hold-to-copy menu) stays untested, accepted because most users are on Android.

Models applied: Pre-mortem (the nightly rebuild under load), Opportunity Cost (lab-only data vs the demo visitors see), Second-Order Thinking (a bigger seed changes the reset, not only the screens).
