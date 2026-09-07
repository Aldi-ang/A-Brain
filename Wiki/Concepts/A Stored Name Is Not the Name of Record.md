---
title: A Stored Name Is Not the Name of Record
description: A transaction freezes whatever the signed-in Google account was called that day. Fleet & Roster is where people are actually named. Any screen that renders the frozen string shows the wrong person, and the id on the row is the only way back to the right one.
type: concept
created: 2026-09-07
updated: 2026-09-07
confidence: high
checked: 2026-09-07
tags: [pattern, identity, kpm, handoff, roster]
---

# A Stored Name Is Not the Name of Record

**Aldi, running Round 7 against a store held by a test Tier 5 account: *"it should not be aldi
kurniwan, it should be the test tier 5 so fix the name so that it shows the nickname and not the
google name, nickname here is registered name inside fleet and roster"*.**

Fixed in `2e5a8ac`. Two independent faults sat on the one line that built `ownerName` in
`src/ConsignmentFinanceView.jsx`, and fixing either alone still leaves a wrong name on screen.

## Fault 1 — the string is a snapshot of a Google account

`t.agentName` is written once, at sale time, from `user.displayName`. For a field agent that is
already the roster name, because `App.jsx` hijacks the user object at login and substitutes
`finalName` from the motorist record. **For an admin it is not** — the admin branch calls
`setUser(currentUser)` with the raw Firebase user, so the row freezes the Google account name. It
is also wrong for any test account signed in on somebody else's Google login, which is exactly
Aldi's setup: several `[TEST]` personnel, one Google identity behind them.

So the roster name and the stored name agree for the common case and diverge precisely where he
tests. That is why it survived to production.

**The fix is the id, not the string.** `t.agentId` is the only field that still points at the Fleet
& Roster record. Resolve through it; keep the stored string as the fallback for an id that has been
deleted from the roster, so a departed agent's stores do not go blank.

Admin rows carry `agentId: 'ADMIN'`, which matches no motorist document, so the map has to answer
for that id too — from the `master_owner` record, or from `appSettings.adminDisplayName`.

## Fault 2 — the newest row's seller is not the current owner

This one only appears after the hand-off feature. [[Ownership Moves, History Does Not]] records the
deliberate decision that approving a transfer does **not** restamp past sales. The consequence
nobody traced: any screen that derives "who manages this" by walking to the newest row is reading
the *seller*, and from the moment a store changes hands that is the **previous** agent.

`ownerAgentId` on the customer document is the only field that knows. `activeOwnerId` in the same
file already encoded that rule for the single opened store; the list simply had not been given it.

## The general shape

> When a row stores both an **id** and a **display string**, the string is a snapshot and the id is
> the fact. Render the string only when the id resolves to nothing.

And a second rule, from fault 2: **a decision to stop denormalising creates readers that are now
wrong.** When "we will no longer copy X onto the row" is agreed, grep for everything that reads X
off a row before closing the ticket. The write side was reviewed carefully in `dace958`; the
read side was not looked at at all.

## Guarded by

`src/config/logicFixes.selfcheck.mjs`, section *"THE STORE LABEL NAMES THE ROSTER, NOT THE GOOGLE
ACCOUNT"* — source-shape guards that assert their anchors before slicing, plus the resolution
re-run on four rows: a store that changed hands, one that never moved, an admin-sold one, and one
whose agent was deleted from the roster. Trialled red by reverting both halves.

## Related

- [[A Store Name Is Not a Store]] — the same lesson one level up: the store's *name* is a label,
  its id is the identity.
- [[Ownership Moves, History Does Not]] — the decision that created fault 2.
- [[Handoff Eligibility]] — who may receive and who may approve.
- [[Email Is a Document ID, Not a Field]] — the sibling identity trap found the same morning.
