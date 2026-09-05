---
title: The Panel That Never Reads a Transaction
description: Product Performance shows unpaid consignment as revenue — and the fix is not in the panel, because the panel reads a rollup that threw the distinction away before it was written. Traced 2026-09-05, not built.
type: summary
created: 2026-09-05
updated: 2026-09-05
confidence: high
checked: 2026-09-05
tags: [kpm, rollup, reporting, consignment, money, deploy, vercel, scope]
source: "[[../../Raw/2026-09-05_source_kpm-rollup-scope-and-vercel-demo]]"
---

# The Panel That Never Reads a Transaction

Source: [[../../Raw/2026-09-05_source_kpm-rollup-scope-and-vercel-demo]] — KPM commits
`610f02c` → `2906294`, 2026-09-05 09:13 → 09:52 WIB. **Nothing here is built.** Bug 2 was
traced and scoped; the code was not touched.

## The report

Aldi, 2026-09-05: *"this shouldnt be categorize as sales yet, because it is account receivable
and customer can also return the good right"*. Product Performance was showing Rp 1.229.000 as
revenue when most of it was unpaid `Titip` (consignment) — goods sitting in a shop that can
still come back.

That reads like a panel bug. It is not.

## Where the distinction actually dies

`ProductPerformancePanel.jsx:44` never opens a transaction. It reads one pre-aggregated monthly
document through `statsPath(...)` — on purpose, and for a good reason documented in
[[../Concepts/A Rollup Is a Cache, Not a Ledger]]: a year read live off `transactions` is
thousands of document reads on Aldi's own Firestore bill.

The merge happens two layers upstream:

| File | What it does |
|---|---|
| `src/utils/salesRollup.js:88-90` | `salesDelta` accumulates `{ qty, revenue }` per product — **no `paymentType` dimension exists anywhere in the rollup** |
| `src/utils/salesRollupWrite.js:37-38` | writes exactly those two fields into `byProduct` and `byDay` |

By the time the panel renders, receivable and finished sales are one number and cannot be
separated. **A panel cannot render a distinction its source never recorded.** The fix is a
write-time change that has to be carried all the way forward: the delta, the writer, `sumRange`,
the panel, and `ponder/stages/ProductPerformanceTable.jsx`.

Five files — over the 3-file rule — so the session stopped and named them instead of starting.
Tracing first turned a "one-line panel fix" into a five-file money change *before* any of it was
written.

## The trap that makes a lazy build wrong

**Every rollup month already written holds only `{ qty, revenue }`.** Add the split fields and
past months report **zero receivable and 100% finished sales** — with total confidence, and with
no error anywhere. That is worse than today's honest merge: today the number is wrong in a way
Aldi already spotted; after a naive build it would be wrong in a way nothing surfaces.

The decision has to be explicit — backfill from `transactions`, or label pre-change months as
"not separated" in the UI. **Do not let old documents answer a question they were never asked.**
This is [[../Concepts/Silent Failure Disease]] in data rather than in code.

## The larger question underneath, unanswered

Does a later `CONSIGNMENT_PAYMENT` also enter the rollup? `SALE_TYPES` at `salesRollup.js:42-46`
decides it. If a Titip sale books revenue at placement **and** its payment books revenue again,
Product Performance is double-counting *today*, and that is a bigger money bug than the split.

**Not checked — the session ran out of budget and refused to assume either way.** ❓ This is the
first thing the next session on bug 2 must settle. Marked unverified.

## Same day: the demo went online, and the check that made that safe

He asked to put the app online to show friends. `phase0-solid-ground` had never been pushed; it
now tracks `origin`, and `kpm-ang.vercel.app` serves it from Vercel's **Preview** environment.

- **The check ran before the push, not after.** `grep -rn "createUserWithEmailAndPassword" src/`
  returns nothing — there is **no self-signup anywhere in the app**. A stranger with the URL
  reaches a login screen and stops; accounts are admin-created, and the Ghost Killer at
  `App.jsx:2400-2409` blocks a login with no profile.
- **Production was deliberately not touched.** `kpm-inventory.vercel.app` still serves the
  default branch. "Promote to Production" would have been the short way to a short link and
  would have shipped this branch to real agents as a side effect.
- **The gap that is real and unchanged:** the store hand-off write rule is **drafted, not
  deployed**. Friends cannot get an account so the demo is unaffected — but at the database
  level a real agent can still edit or delete transactions he did not make. See
  [[../Entities/Firestore Rules]] and [[../Concepts/Ownership Moves, History Does Not]].
- Vercel login was not attempted — that is entering credentials, and the URL was Aldi's to fetch.

## Also settled, no code

Quota reporting leads with the **5-hour window**, not the weekly. Measured across that session:
5h went 0% → 66% while weekly moved 86% → 93% — about nine times the burn rate. The 5h bucket is
the one that stops him mid-job. The `[plan-quota]` hook's own opening line is still weekly-worded
and was left alone, because `.claude/plan-quota.mjs` is his config; the change was offered, not
made.

See also: [[../Concepts/A Rollup Is a Cache, Not a Ledger]] · [[../Concepts/Silent Failure Disease]] ·
[[../Entities/Firestore Rules]] · [[Store Hand-off Name Collision]]
