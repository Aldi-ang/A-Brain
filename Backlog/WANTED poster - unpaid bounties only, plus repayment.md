---
title: WANTED poster - unpaid bounties only, plus repayment
description: He split the EOD objects by JOB - the letter holds the facts, the poster holds the debt. The bounty engine is already half-built in App.jsx with no UI of its own.
status: To Do
area: EOD Setoran / Bounty
priority: Medium
created: 2026-08-17
updated: 2026-08-17
---

# WANTED poster — unpaid bounties only, plus a repayment flow

His spec, 2026-08-16: the WANTED poster is repurposed to carry **unpaid bounties ONLY** — missing
item, missing cukai, missing cash, missing transfer — and a **separate feature** beside EOD repays
a bounty via a receipt the admin also confirms, ending in a cleared-bounty animation.

## Why this is the good idea and not a decoration

He costed the Sheriff's Desk concept himself as *"the one that risks hiding the money behind a
costume"*, then solved it: **split the objects by job.** The letter holds the facts, the poster
holds the debt. The theme stops competing with the numbers because each object has exactly one
thing to say.

## What already exists

| already in the code | where |
|---|---|
| `reportType: 'BOUNTY'` with `penaltyKeys`, and a debt-wiping branch | `src/App.jsx` in `handleVerifyEOD` |
| The WANTED poster markup, Georgia serif, *"Awaiting Sheriff Verification"* | `src/EODReconciliationView.jsx` |
| `agentBountyData` — reads `PENALTY_*` keys off `cukaiDebts` | same file, near the top |
| A "Pay Bounty" button that submits the whole bounty as one cash amount | same |

**So repayment is roughly half built.** What is missing is per-bounty repayment (today it is
all-or-nothing), the receipt the admin confirms, and the cleared animation.

## The one thing to get right

The poster must show **only unpaid** bounties. Today `agentBountyData` also has an `isPending`
flag for a bounty already submitted and awaiting the admin — that state needs its own quiet
treatment, not the WANTED sheet. A poster that keeps shouting after the agent has already paid is
the app failing to report the thing that actually happened.

## Related

- [[EOD - the regional admin's letter stack]] — the admin confirms the repayment receipt there
