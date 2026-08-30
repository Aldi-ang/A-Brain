---
title: A Check Points at a File, Not at a Behaviour
description: Source-scanning checks assert against a PATH. Move the code and the check keeps passing or keeps failing against the wrong file — twice now in KPM, and the second time it stayed red for four days because nobody runs that suite.
type: concept
created: 2026-08-30
updated: 2026-08-30
confidence: high
checked: 2026-08-30
tags: [kpm, testing, checks, refactor, discipline]
---

# A Check Points at a File, Not at a Behaviour

Most of KPM's guards are **source scans**: `read('src/components/Foo.jsx')` then a regex. That
makes them cheap, fast and honest about intent — and it means every one of them is bound to a
**path**, not to the behaviour it claims to protect.

Move the code and the check does not follow. It goes on reading a file the behaviour has left.

## What happened, 2026-08-30

Two checks in `logicFixes.selfcheck.mjs` were RED:

| Check | Claimed | Truth |
|---|---|---|
| `the shipment deducts with increment()` | HQ stock overwrite bug is back | fine — moved to `RestockVaultView.jsx:696` |
| `and sorts above everything else there` | DISPUTED no longer sorts first | fine — `REQ_RANK` at `RestockVaultView.jsx:128` |

`76de71a` had moved the fulfilment half of `BranchWarehouseManager` onto the surat jalan desk;
that file lost **332 lines**. Both checks kept reading it. Neither defect was real.

**Cost:** four days of a red suite, and a session that had to stop and prove two money-path
guarantees by hand before it could trust its own new checks. A red suite that is red for a known-
harmless reason is worse than no suite: it trains the next reader to skim past a real failure.

## Why nobody noticed — the part worth fixing

**Every session report quotes `integration.audit`'s N/N and never `logicFixes.selfcheck`.** The
first number is in `.claude/PROGRESS.md`, in the commit messages, in `NEXT-SESSION.md`. The second
appears nowhere by habit. So a suite went red and the project's own paperwork kept saying green.

**Both numbers, every time.** That is the whole fix, and it is a paperwork fix, not a code one.

## The recurrence — this is the second time

`NEXT-SESSION.md` already carried the warning, written 2026-08-27 after the Ponder split:

> *Splitting a component splits its checks. Grep the audit for a pattern before assuming a check
> still reads it.*

It was written about `PonderOverlay`, and it did not stop the same thing happening to
`BranchWarehouseManager` — because it was written as **prose in a brief**, and the brief is read
once at the start of a session, before anyone knows which files they are about to move.

Eighth instance of [[Anti-Recurrence Check]]'s core shape: **the documentation already said it.**

## What to do instead

1. **When you move code out of a file, grep the check suites for that file's path** before
   committing. `grep -n "components/Foo.jsx" src/config/*.mjs` is one command.
2. **Prefer reading BOTH files over re-pointing to one** when a behaviour has an ambiguous home —
   `read(a) + read(b)` keeps passing wherever HQ's outbox lives next month. That is what S14 does
   now.
3. **Name the constant, then check the name.** `REQ_RANK = { DISPUTED: 0` survives a reformat that
   an inline `'DISPUTED': 0` literal does not.
4. **Report both suite numbers.** A check nobody runs is a comment with a slow build step.

See also: [[Anti-Recurrence Check]] · [[Silent Failure Disease]] · [[Looking at the App]] ·
[[The Eight Warehouse Gaps]]
