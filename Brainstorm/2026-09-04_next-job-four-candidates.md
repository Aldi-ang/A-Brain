---
title: "Next job — four candidates from the Backlog, re-verified against today's code"
description: The tutorial work is finished and nothing was queued behind it. Four open Backlog items were re-read whole and checked against the current source before being offered to Aldi. Two other items turned out to be partly fixed already.
type: brainstorm
created: 2026-09-04
updated: 2026-09-04
tags: [brainstorm, backlog, open]
---

# Next job — four candidates, re-verified 2026-09-04

## The problem, in his terms

"read next session md and the notes to continue the work" — but `NEXT-SESSION.md` had no job in it.
The ponder sweep closed on 2026-09-04 (`50fb09f`) with nothing behind it, so the brief sent this
session to `A-Brain/Backlog/` to rank and ask instead of to build.

The Backlog holds 22 open items. Its own `index.md` has drifted — several rows read "To Do" for
files whose `status:` says Done — so the per-file field is the only truth, and a title is a first
draft of a finding: three of these files correct themselves further down the page.

## The options

Every line number below was re-checked against the working tree on 2026-09-04. The Backlog files
were written 2026-08-17/18 and their line numbers have all drifted.

| # | What breaks | Verified today at | Fix size |
|---|---|---|---|
| A | Opening Journey Plan fuzzy-matches stores to a wrong agent and writes it, unasked and silently | `src/JourneyView.jsx:561-583` — two-way `includes` match, `updateDoc(...).catch(() => {})` | one screen, medium-small |
| B | Approving a store hand-off rewrites `agentId`/`agentName` on every past sale of that store | `src/App.jsx:1746-1749` | four lines to delete, plus one product decision |
| C | Damaged goods handed back during a consignment payment never reduce the debt | `returnTotal` written at `useTransactionEngine.js:492,569,590`, read by no balance calc; `ConsignmentFinanceView.jsx:204` subtracts `amountPaid` alone | biggest — two debt calculators want merging first |
| D | A cash bounty is displayed as a stamp count on the agent's own dashboard | `src/AgentInventoryView.jsx:117` has no `PENALTY_` guard; `EODReconciliationView.jsx:162` and `App.jsx:2054` both do | one line |

## What each one costs

- **A** — no one presses a button for it, so it is the only candidate that corrupts data while the
  app sits idle. The write is silent and its failure is swallowed. Cost of fixing: replacing an
  automatic repair with a review list, which is a small screen, not a one-liner.
- **B** — fires only when an admin approves a transfer, but what it destroys cannot be recovered:
  the old `agentId` is overwritten, not kept. The deletion is trivial; the decision behind it
  (should the new agent's dashboard still show the old sales?) is Aldi's, not a code question.
  Partly hardened since it was written — the same-name twin problem is now pinned by `customerId`
  at request time and `heldBySender` filters the rewrite, so only the sender's own rows move.
- **C** — the only candidate that overcharges a real customer in rupiah. Its own write-up says to
  merge the two debt calculators first or the same fix has to land in three places, so it is the
  most expensive of the four and the least suited to a short session.
- **D** — has not fired yet; it fires the day the first bounty is minted. Rp 200.000 becomes
  "200.040 stamps" on the agent's screen. The guard exists twice already and was missed once.

## Decision

**OPEN — waiting on Aldi.** Recommended A, with D as a free rider in the same session because it is
one line and one self-check.

## Rejected on purpose

- **Re-running the sweep or hunting new bugs.** 75 confirmed findings are already written up; adding
  to the list is not the same as shrinking it.
- **"Confirming a shipment twice credits the branch twice"** — its title still says HIGH but the file
  downgrades itself to LOW three sections in: the button only renders while the order is IN_TRANSIT,
  so the race is a split second. The one-line guard is worth having, but not as a session's job.
- **Fixing the drifted `Backlog/index.md` table.** Real, but bookkeeping, and it does not change what
  the app does.
