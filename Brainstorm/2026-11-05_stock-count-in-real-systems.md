---
title: How real warehouse systems run a stock count, against ours
created: 2026-11-05
status: option 1 BUILT + live kpm c88a3ac; the board and product-by-product are the next job
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

## His answer, 2026-11-05

*"yes become the real number that is counted, we have blind count for tier 4 and below right and dont we have the matric to toggle the blind counting as well? we also should approve product by product , then maybe we should make confirmation button for each of the product then, so maybe we make some dashboard for regional admin and tier 3 and above, this one panel show regional warehouse stock opname status one by one, swap able with animation and swap button, futuristic panel like features, where we as high tiers can see each of the products inside the warehouse status, we can see how many are them are already confirmed counting by the regional admin, when there is a missing item what the real system do to decide with their employees or is it human interaction to deal with that, if there is human interaction to deal with that? and i want our system to be able to accept and reject each of the item instead of all at once just to upgrade our stock opname system like the real one, the regional admin and upper tiers should see the missing item, what kind of the damaged or missing goods and their value so we know how much lost value we loss"*

**Built + live `c88a3ac`:** option 1 and a truly blind count; the full story is the commit message. Proof: `Raw/2026-11-04-opname/built-blind-flagged.jpg`.

**His question about the blind switch:** he was right that it exists: the matrix key `view_expected_count`, "Stock Count: see expected number while counting", T1-T3 by default. It leaked after one digit; that was the bug.

## What real systems do about a missing item: people decide

The system finds the difference and holds it; it does not decide who is at fault.

- Oracle Inventory (first-party): counts over tolerance are recounted automatically up to a limit, then held for approval. An employee with access can "approve adjustments, recount an item in question, reject the count or take no action until further investigation". https://docs.oracle.com/cd/A60725_05/html/comnls/us/inv/ccadj.htm
- Microsoft Dynamics (first-party): a difference goes to Pending review; a supervisor adjusts and accepts it, and it is rejected if not approved. https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/cycle-counting
- DIXANI investigation guide (third party): a variance "should not be treated as an automatic instruction to adjust the system". Recount with a second person who has not seen the first count, check every storage place including quarantine and returns, trace receipts, picks and transfers, label each cause confirmed, ruled out or unresolved, give someone the open checks, get approval, then post. https://dixani.com/guides/investigate-inventory-variances/

Nothing read has a system charging an employee by itself. Whether anyone pays is the company's decision; KPM has that as Penalty in Quarantine.

## Patch notes (built, same day)

His "i want u to put patch notes button inside the app": built + live `c785e1e`, proof `Raw/2026-11-04-opname/built-patch-notes-phone.jpg`. The list is `src/config/patchNotes.js`; a finished job that changes what people see adds a line before its push (CLAUDE.md, [[Publishing a Fix]]).

## Gap B decided, 2026-11-05 22:24

Asked whether a count that skips products should be refused, he handed it back: *"how the real app or stock opname works? u tell me this is to answer your own question"*. Answered from the table above: the list is fixed before counting (Microsoft counts the whole location, SAP keeps a worklist with a finish line), and the person counting does not choose what to skip. Built + live kpm `74388e3`: Submit is refused and names what is left, a typed 0 counts, a recount and the boss's own counts are free. Honest limit: these five sources are all that was read, and SAP's own screens were not opened. Cost named to him: a reload still loses typed numbers. Asked (verbatim): **❓ ANSWER: Should the numbers a team leader types be kept on the phone until they press Submit, so a reload or a dead battery loses nothing (1), or stay as they are now, lost on a reload (2)?**

## Typed numbers kept until Submit, 2026-11-06 09:23

Asked whether a team leader's numbers should survive a reload or a dead battery, he answered *"1 of course it is a huge quality of life update tho"*. Built + live `ed23208`, the story is its commit message. Proof `Raw/2026-11-06-opname-draft/phone-came-back.png`, walk `walk.mjs` beside it. Not proven on a real phone with a real camera switch. Rules CHANGE 22 and 23 count as published on his word, *"i already paste the new rules in the firestore"*.

Test 1 retold, 2026-11-06 09:58: his report and the real-app walk are in kpm `df98751`; proof `Raw/2026-11-06-opname-draft/real-t4-came-back.png`, `board-tabs-pc.png`. Why the test read as lost: [[POV Changes the Id, Never the Email]]. Tab strip on the phone left as it is, his 2026-09-18 board 3 = A; `board-tabs-phone.png` holds a drawn one-row option, never asked.
