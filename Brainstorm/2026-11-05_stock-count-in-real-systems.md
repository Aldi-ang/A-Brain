---
title: How real warehouse systems run a stock count, against ours
created: 2026-11-05
status: OPEN, research reported, no count code changed, waiting on his 2 answers
tags: [kpm, stock-opname, research, brainstorm]
---

# How real warehouse systems run a stock count, against ours

**His words, 2026-11-05:** *"btw stock number must always stays the same with the updated one after the confirmation, but i want to know how the stock opname works in real warehouse app and real system i want u to research a little about that so that it will be effective and efficient on our system as well"*

## How it was read

`WebSearch` fails here (its routed model does not exist) and Firecrawl needs an API key, so pages were read in the built-in browser. odoo.com refused the browser, so Odoo is not a source. "A little", as he asked: 5 sources.

- Microsoft Dynamics 365, Cycle counting (first-party): https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/cycle-counting
- SAP, Stock Types (first-party): https://help.sap.com/doc/a6a8c7536e8e2a4be10000000a174cb4/700_SFIN3E%20006/en-US/299bc7536e8e2a4be10000000a174cb4.html
- SAP physical inventory guide (third party, YuvaPlanNex; the steps, tolerances, zero-count trap and movement types below come from here): https://www.yuvaplannextech.com/blog/sap-physical-inventory-s4hana-guide
- ERPNext, Stock Reconciliation (first-party): https://docs.frappe.io/erpnext/stock-reconciliation
- Wikipedia, Cycle count: https://en.wikipedia.org/wiki/Cycle_count

## What real systems do, against ours

| Real systems | Ours | Verdict |
|---|---|---|
| After posting, book = count (SAP guide: "system stock and physical stock must match"; ERPNext: keep them in sync) | True for good stock; not when fewer damaged are found | **the DECIDE** |
| Usable and blocked stock are separate, each difference posted on its own (SAP 701/702 unrestricted, 707/708 blocked) | Same since `52afe9c` | right |
| The counter never sees the expected number, "This design prevents intentional miscounts" (Microsoft); they get more attempts instead | Blind only until the first digit: in the lab a Tier 6 typed 1 and saw Expected good 420, Expected damaged 12 (`isRevealed`, StockOpnameView.jsx) | **gap A** |
| A worklist of counted against uncounted, with a visible finish line (SAP Fiori); every unit counted (Microsoft counts the whole location) | Counting 1 of 7 products closes the warehouse's week | **gap B** |
| One bad item only stops itself; the rest post (SAP guide, item tolerance) | Reject sends the whole count back | **gap C** |
| A shortage posts as an expense at the product's price (SAP guide) | Approver sees packs, no money on differences | **gap D** |
| Small differences close alone, big ones wait for review (Microsoft deviation limits, SAP tolerances per user group) | Every count waits for HQ | not now: he wants to verify counts himself |
| A wrong count gets a recount, never an edit (SAP MI11, Microsoft attempts) | Recount, three-way disagreement | right, and stricter |
| A typed 0 is not the same as not counted (SAP "zero count trap") | Empty box reads as 0 | part of the DECIDE |
| The book is frozen for the comparison (SAP) or stock stays available (Microsoft) | Numbers frozen at the first keystroke, difference applied, sales keep going | right |
| Count often what is valuable or moves a lot (ABC: SAP example 12, 6, 3, 1 a year; Wikipedia) | Everything weekly | not now: few products, weekly is affordable |
| Scrap and non-conforming goods stored apart from good stock (Wikipedia) | Quarantine | right |

## Decision

OPEN. Book 1000 good, 10 damaged:

| Count confirmed | Now | Option 1, real systems |
|---|---|---|
| 995 and 10 | 995 and 10 | the same |
| 1000 and 8, 2 damaged packs missing | 1000 and 10, reported | 1000 and 8, with the cause on record |
| 1010 and 0, damaged typed as good | 1000 and 10, warned | cannot be confirmed: send it back, or use Repair in Quarantine |

Option 1 also makes an empty box "not counted", so a real 0 has to be typed. Recommended: 1. It is the only one where his "must always" holds with no exception, and the third row keeps his 2026-11-04 rule that damaged packs never turn into good stock quietly. Moving a pack from damaged to good stays a decision made in Quarantine.

Asked (verbatim): **🔴 DECIDE: After you confirm a count, should both numbers become exactly what was counted (1, how real systems work), or should Quarantine keep only going up (2, how it works now)?**

And (verbatim): **❓ ANSWER: Which of these do you want, in what order? A truly blind count, B every product must be counted, C approve product by product, D show the money on each difference. Reply with the letters, for example "B, A, D".**

## Patch notes (built, same day)

His "i want u to put patch notes button inside the app": built + live `c785e1e`, proof `Raw/2026-11-04-opname/built-patch-notes-phone.jpg`. The list is `src/config/patchNotes.js`; a finished job that changes what people see adds a line before its push (CLAUDE.md, [[Publishing a Fix]]).
