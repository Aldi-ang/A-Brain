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
