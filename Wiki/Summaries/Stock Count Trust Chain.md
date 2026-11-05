---
title: "Stock Count Trust Chain"
description: On one afternoon the gap between "the agent found a different number" and "stock changed" was closed end to end — recount, cause, tolerance, leak detection. Plus the five words Aldi has still not approved.
type: summary
created: 2026-08-22
updated: 2026-08-22
confidence: high
checked: 2026-08-22
tags: [kpm, stock-opname, counting, evidence, summary]
---

# Stock Count Trust Chain

**Source:** [[../Raw/2026-08-21_source_stock-count-trust-chain|Raw — the five commit messages]].
Commits `08e98ce`, `2d8d371`, `e103469`, `7153a82`, `7989b82` on `phase0-solid-ground`,
2026-08-21 between 15:46 and 17:12.

> ⚠️ This is a Wiki distillation, not a deployment record. Whether this is on `main` or in
> Aldi's hands is a question for the repo, not for this page — as of 2026-08-22 it is on
> `phase0-solid-ground` and **has never been opened on a real count screen**. See
> [[../../Backlog/Test the new Stock Opname on a real screen|the test card]].

---

## What was actually closed

[[Where KPM Is Going]] was written at 10:07 that morning and named the same gap four times:
*"the gap between 'the agent found a different number' and 'stock changed' has no checking in
it at all today."* **By 17:00 every one of those holes was shipped.** That page's gap table is
now stale on four rows and has been corrected in place.

The chain, in the order a count now travels:

| Stage | What it does | Commit |
|---|---|---|
| **Count** | Target frozen when the row is started, so a mid-count sale cannot move it | earlier that morning |
| **Tolerance** | A difference under one whole pack is a match, not a shortage | `7153a82` |
| **Recount** | A real difference cannot be submitted — count it again, blind | `2d8d371` |
| **Cause** | A difference that survives the recount must say why | `e103469` |
| **Leak detection** | HQ sees which products go short again and again | `08e98ce` |

## Why recount is the one that mattered

**It is a money argument, not a tidiness one.** HQ approving a count applies
`increment(counted - expected)`, so a miscount is written into real stock — and that wrong
figure becomes the **expected** figure for the next count. Count 98 instead of 100 once, and
the next honest count of 100 reports a surplus of 2. **One typo poisons two months.**

Most differences in a real warehouse are miscounts, not theft, so counting again is the
cheapest correct move before anyone acts.

Aldi chose the three-way rule himself, **option B**: when the first, second and third counts
all disagree, **all three go to HQ and the app picks none of them**. Three different answers
mean something other than counting is wrong, and that is a judgement, not arithmetic.

**Three things a lazy version gets wrong**, each now pinned by a check:

1. **It shows the previous number back.** See 98, retype 98, and the second count proves
   nothing. The boxes are blanked and the attempt kept where only the submit path reads it.
2. **It re-takes the expected snapshot on the recount** — silently re-opening the
   moving-target bug fixed that same morning, while still looking like it works.
3. **It lets a counted row be deleted by emptying both boxes**, dropping the attempt history —
   so clearing and retyping the same wrong number submits with no recount at all.

And the prompt **never names the difference**. *"You are 5 short"* hands a blind tier the
answer this screen exists to withhold, and tells any tier exactly what to type to make the
warning go away. Same instinct as blind counting itself — see [[Where KPM Is Going]].

## The tolerance was a bug fix wearing a settings hat

Asked what size difference is not worth his time, Aldi said: *"few batang wont worth my time,
few bks is still money bruv we need that."* So the line is **exactly one pack**.

**But it was not a comfort setting.** Selling in Batang stores `qty / sticksPerPack`
(`App.jsx:3127`), so a product with loose sticks sold from it holds a **fraction** of a pack —
99.44, say. The count box is `parseInt` and takes whole Bks only, so the agent can type 99 or
100 and **the variance can never reach zero**. Before the recount landed, that was a wrong
number on a screen. With the recount it forced an endless second count and filed a fake
half-pack shortage on that product **every single week**.

⚠️ **The general shape:** a unit conversion that produces fractions, met by an input that only
accepts integers, is an unsatisfiable equality. It looked like a preference question and was a
defect. The figure is still printed exactly as counted — only the *verdict* applies tolerance.

## Leak detection: where a feature lives is the design decision

*"u can add leak detection for this trigger for everytime stock opname is done, which is each
week actually."* One short count is a mistake; **the same product short week after week is a
leak.** No new data is collected — it reads approved audits already on file.

**It deliberately does NOT go on the count row**, for two reasons either of which would have
made the obvious placement useless or harmful:

1. `auditHistory` only loads for `isHighCommand` — the [[../Entities/Firestore Rules|rules]]
   refuse `pending_audits` to everyone else, so a counting agent would see an empty result and
   **conclude all was well**. A silent empty is worse than an absent feature.
2. Telling the counter *"this one is usually short"* **biases the count**. Blind counting
   exists so the shelf decides the number.

HQ acts on a leak anyway, so it sits on HQ's review row. The threshold is deliberately dull —
**at least three counts on record, short in at least two.** He counts weekly, so that is three
weeks of evidence before the app accuses anyone. *"A warning that is usually wrong gets
ignored — worse than none."*

## 🔴 The open decision Aldi still owes

**The five cause words are Claude's, not his:** *miscount, unrecorded sale, breakage, theft,
supplier short.*

His standing law is that **only he names the categories in his own trade**, and he has not seen
these. They were built provisional so the control could be looked at. **Records already saved
keep whatever string was used, so the list must be settled BEFORE agents count with it, not
after** — renaming later leaves two vocabularies in one book. A check pins the list as
provisional; when he renames them that check fails, which is the moment to delete it.

Tracked at [[../../Backlog/Name the five shortage causes|the Backlog card]].

## What this cost, and the lesson that outlived it

The recount commit also shipped a crash that blanked the entire tab for an afternoon while both
audit suites read 599/599 and 565/565. That is written up where it belongs, in
[[Anti-Recurrence Check]] — **a green suite is not a working screen**, and it is the reason the
test card above exists.

Two decorative checks were caught the same day: one threshold retyped into its own check file
instead of lifted from the source, and one static guard that passed on the broken code as
readily as the fixed code. Both found only by **deliberately breaking the shipped rule and
watching what happened**.

---

## Related

- [[Where KPM Is Going]] — the direction page whose gap table this closed
- [[Anti-Recurrence Check]] — the green-suite lesson and the prove-it-fails rule
- [[Aldi's Design Taste]] — why the cause picker reuses the damage reel
- [[../Entities/Tier System]] — `canSeeExpectedCount` is the tier gate on blind counting

## 2026-11-04 — the count became a weekly group homework (kpm `a60d191`)

His words: *"there is only 1 submission needed each regional warehouse, not everyone should count, stock opname as default only be able to be seen by regional admin/T4 at default and they are the only one who should do that, if there is help from other member it is outside of this app ability to detect or care about it, lets take the stock opname submission each week as a group homework and the the team leader is the one who submit it, which is the T4"*

One count per warehouse per calendar week, submitted by the T4, reviewed by the owner as before. How it works and why the mark sits on the roster card: [[2026-11-04_opname-at-master-vault]].

## 2026-11-04 — one count day for the company (kpm `b35f2a0`)

His words: *"actually we as tier 3 and above should have power to set the stock opname day, one specific day for the stock opname so that the interval of the stock opname is the same each time"*

T1 to T3 pick the day; the count opens only that day, so every count is a week after the last. A count sent back can be redone on any day. Details: [[2026-11-04_opname-at-master-vault]].

## 2026-11-04 — good and damaged are two counts (kpm `52afe9c`)

His words: *"it happens when there is for example, 1000 healthy goods and 10 damaged goods, i put all the total count whici is 1010 inside the healthy goods, and keep the damaged good as 0 and the app didnt recognize that and seems like the counting is on point and accurate ... i confirm the reports and all the damaged good is gone converted into healthy goods instead, this is the exact bug u need to work on, make sure damaged and healthy goods have different count number they are different do add it into one, even when they are the same kind of product, so the damage stock is not missing but converted without information"*

The chain had one hole left: the count added the two numbers, so damaged packs typed as good read as a perfect count and Approve turned them into sellable stock with no trace. Details: [[2026-11-04_opname-wipes-quarantine]].

## 2026-11-05 — after confirmation the book is the count (kpm `c88a3ac`)

His words: *"yes become the real number that is counted"*. Both numbers follow the count; damaged typed as good cannot be confirmed; an empty box is not a zero; a blind count judges nothing until Submit. Details: [[2026-11-05_stock-count-in-real-systems]].
