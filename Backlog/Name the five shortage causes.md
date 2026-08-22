---
title: "Name the five shortage causes — only Aldi can"
description: The stock-count cause picker shipped with five words Claude invented. Records keep whatever string was saved, so the list has to be settled before agents count with it, not after.
status: To Do
area: Stock Opname
priority: High
created: 2026-08-22
updated: 2026-08-22
tags: [stock-opname, decision, aldi-only]
---

# Name the five shortage causes

**Only Aldi can do this one — it is a naming decision in his own trade, not a code question.**

Shipped 2026-08-21 (`e103469`): a stock-count difference that survives the recount must now say
**why**. HQ used to get a bare *"-3"* and had to guess between a bookkeeping fix, a write-off and
a person.

## 🔴 The problem

The five words on the picker are **Claude's, not his**:

| Current word | What it would mean |
|---|---|
| **Miscount** | arithmetic — nobody is at fault |
| **Unrecorded sale** | bookkeeping — the goods went out, the record did not |
| **Breakage** | a write-off |
| **Theft** | a person |
| **Supplier short** | the delivery never contained it |

His standing law is that **only he names the categories in his own trade**. He has not seen these.
They were built provisional so the control could exist and be looked at.

## Why it cannot wait

**A saved record keeps whatever string was used at the time.** Rename the list after agents start
counting with it and the book ends up holding two vocabularies for the same thing — the same
problem the legacy store-name cleanup had to solve at display time
(see [[SWEEP - App.jsx admin handlers]]).

So: **settle the list before the first real count, not after.**

## What to answer

- [ ] Are five the right number, or does his trade need more/fewer?
- [ ] What does he call each one? (Indonesian is fine — the app already says TITIP, not
      "consignment")
- [ ] Is **theft** a word he wants on a picker an agent taps, or does he want it softer — the
      person tapping it may be the person accused

## Note for whoever implements it

A check currently pins the list as *still the provisional one*. **When he renames them, that check
fails — that is the signal, and the moment to delete the check.** Do not "fix" it by retyping the
new words into the check file; lift them from the source. See [[../Wiki/Concepts/Anti-Recurrence Check]].

Full context: [[../Wiki/Summaries/Stock Count Trust Chain]].
