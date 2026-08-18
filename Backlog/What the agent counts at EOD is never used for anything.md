---
title: What the agent counts at EOD is never used for anything
description: The EOD report is built from the system's own expected figures, not from what the agent counted. The counted numbers are attached as a side note that nothing reads, so a cash shortage cannot be detected.
status: Done — d859d41 + 7f96d19 (2026-08-18); admin report card still to show the gap per product
area: EOD
priority: HIGHEST
created: 2026-08-17
updated: 2026-08-17
---

# What the agent counts at EOD is never used for anything

Found in the 2026-08-17 logic review, fourth pass. **Of everything found today, this is the one to
read first** — it is not a broken calculation, it is the whole feature not being connected.

## What happens, in simple English

The agent counts four things: cash, transfers, goods and stamps. Then the report that gets
submitted says this (`src/EODReconciliationView.jsx:494-511`):

| The report sends | Where that number comes from |
|---|---|
| `cash` | **what the system expected**, not what he counted |
| `transfer` | **what the system expected**, not what he checked |
| `remainingStock` | **the system's van list**, not the goods he counted |
| `cards` | what he actually counted — attached, and read by nothing |

So the counted numbers travel with the report as a note, and every figure that **acts** — the money
recorded, the stock credited to the warehouse — is the system's own guess about what should have
been there.

## What that means

**A cash shortage cannot be detected.** The submitted cash figure *is* the expected figure, so the
two can never disagree. If the agent counts Rp 4.300.000 and the system expected Rp 4.500.000, the
report still says 4.500.000 and everything downstream balances perfectly.

The same is true for transfers, and for goods.

This is why the counting flow feels finished and still cannot catch anything: **the count is
recorded, but the comparison never happens.**

## Which part is news and which part is not

- **The goods half is already on your decision list** — the note that the warehouse is credited the
  full van load rather than the counted amount. That was known and parked for your answer.
- **The cash and transfer half looks like nobody noticed.** It is the same root cause, and it is the
  half that matters for the bounty rule you decided today: the shortfall the deck shows the agent is
  never carried into the report the admin verifies.

## Where it is

`src/EODReconciliationView.jsx:494-511` — the whole submit payload.
`cards: letter.cards` at `:510` is the counted data, marked in the code as *"additive"*.
`src/App.jsx:1757` then trusts `report.remainingStock` for the warehouse credit.

## Suggested fix — needs one decision from you first

The plumbing is easy: send the counted numbers instead of the expected ones. What is **not**
mechanical is what the admin should then see and do when they disagree, and whether a shortfall
posts automatically or waits.

You have already answered the shape of that for transfers — a shortfall sits in a **DISPUTED** state
until the company rules on it. **The same answer probably applies to cash and goods**, and if it
does, this becomes one piece of work rather than three.

⚠️ **Do not change the payload before deciding that.** Sending the counted figure without deciding
what happens when it is lower would post shortages straight against agents with no ruling step — the
exact thing you said should not happen.

## Related

- [[Offline sales never reduce the van stock]] — the reason the system's expected goods figure is
  wrong to begin with
- [[Clear Canvas can create stock out of thin air]] — same habit of trusting a stock figure after
  the moment it was true
