---
title: EOD - the regional admin's letter stack
description: The agent's half of the EOD redesign shipped; the admin's half does not exist yet. acceptCard/returnCard/canApproveLetter/sign are already written and tested and nothing in the UI calls them.
status: To Do
area: EOD Setoran
priority: High
created: 2026-08-17
updated: 2026-08-17
---

# EOD — the regional admin's letter stack

**This is the next slice, and it is the one that makes everything already built mean something.**

His spec, 2026-08-16, verbatim: the admin sees a **STACK of letters**, opens one, **views each card
and approves them ONE BY ONE** (or approve-all), and only then gets a button to **approve the whole
letter**, which goes back to the agent. Then HQ approves the admin's approval.

## What already exists — finish it, do not invent it

| already written and tested | where |
|---|---|
| `acceptCard(card, accepted, by, at)` — accepted stored separately from declared, gap stored | `src/utils/eodRecord.js` |
| `returnCard(card, by, at)` — send one card back, nothing accepted, nothing credited | same |
| `canApproveLetter(letter)` — every card decided, and a RETURNED card blocks the letter | same |
| `sign(letter, step, by, at)` — refuses an out-of-order signature | same |
| `letterStage(letter)` — COUNTING / AWAITING_REGIONAL / AWAITING_HQ / CLOSED | same |
| 12 assertions covering all of it | `src/config/eodRecord.selfcheck.mjs` |

**Nothing in any component imports any of them.** The record shape is a complete, tested engine
with no UI on it.

## The three decisions he already made — do not re-ask

1. **Per-card approval is real** — one result per card, not flipping through. His words: *"Real —
   one result per card"*.
2. **Approve-all shortcut: YES**, add it.
3. **No grey-out when the day does not balance.** *"we gave admin power and we should trust them"* —
   his answer to risk is a record, not a lock.

## ⚠️ What he has not priced, and it is real

Approving four cards plus a letter is **5 taps per agent per day** for an admin who may have
several agents. Today an EOD report carries ONE `status` field, so per-card approval is a schema
change inside the `handleVerifyEOD` transaction. Design the approve-all so the careful path is
available and the fast path is the default, or the admin will use approve-all every time and the
per-card precision buys nothing.

## Related

- [[EOD - show the admin what the agent counted]] — smaller, and must land first
- [[EOD - put the money figures in the audit line]]
