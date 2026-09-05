---
title: "Source — Product Performance rollup trace, quota window, and the Vercel demo (2026-09-05)"
description: The four KPM commits of 2026-09-05 09:13–09:52 WIB that the working session did not self-ingest — commit messages and the PROGRESS/NEXT-SESSION text they added, unedited.
type: raw-source
created: 2026-09-05
updated: 2026-09-05
tags: [kpm, raw, rollup, reporting, deploy, vercel, quota]
---

# Source: KPM commits 610f02c → 2906294, 2026-09-05

Captured by the `a-brain-session-ingest` scheduled run on 2026-09-05. These four commits land
after the last vault commit of the day (`c5648ad`, 09:10:30) and had no vault coverage. Body
text below is the commit messages and the added note text, untouched.

## Commit messages

### 610f02c — 2026-09-05 09:13:39 +0700 — Notes: lead quota reporting with the 5-hour window, not the weekly

His correction, and the numbers back it: across this session the 5h bucket went 0 to 66 per cent
while the weekly moved 86 to 93 - about nine times the burn rate. The 5h window is the one that
stops him mid-job.

Saved to project memory. The hook's own opening line is still weekly-worded and was left alone;
that file is his config, so changing it is offered rather than done.

### c739608 — 2026-09-05 09:31:46 +0700 — Notes: bug 2 is a rollup change, not a panel change - traced, scoped, not started

Told to continue, I traced Product Performance before editing anything. The panel never reads a
transaction; it reads a pre-aggregated monthly rollup, deliberately, because reading a year live
costs thousands of document reads. The consignment and paid figures are merged in salesRollup.js
before the writer ever sees them, and there is no paymentType dimension in the rollup at all.

Splitting them touches five files, over the limit, so it stops here and names them. Two traps
recorded: historical rollup months hold no split and would report zero receivable with total
confidence, and it is not yet established whether a later consignment payment re-books revenue
the original Titip sale already booked, which would mean the panel double-counts today.

### 0b947f8 — 2026-09-05 09:46:08 +0700 — Notes: branch pushed for a Vercel demo, with the signup check that made it safe

He asked to put the app online to show friends. The branch had never been pushed; it now tracks
origin. Vercel builds the preview from its own dashboard and the URL is his to fetch - logging
into Vercel is entering credentials and was not attempted.

Checked before pushing rather than after: there is no self-signup anywhere in the app, so a
public URL reaches a login screen and stops. The drafted-not-deployed hand-off write rule is
unaffected by the demo but is still live for real agents, and is recorded as his to deploy.

### 2906294 — 2026-09-05 09:52:36 +0700 — Notes: the demo link is kpm-ang.vercel.app, aliased to the branch not production

Vercel domain on the Preview environment pointing at phase0-solid-ground, so the demo carries
today's four fixes while production keeps serving the default branch untouched. Records why
promoting to production is the wrong way to shorten a link: it would ship this branch to real
agents as a side effect.

## Added to `.claude/NEXT-SESSION.md`

### Bug 2 — Product Performance counts consignment as finished sales (TRACED 2026-09-05)

Aldi, 2026-09-05: *"this shouldnt be categorize as sales yet, because it is account receivable and
customer can also return the good right so there should be another parts of the panel saying that
there are account receivable pending in some stores but also finished sales as well"*. His
screenshot shows Rp 1.229.000 presented as revenue when most of it is unpaid `Titip`.

**It is NOT a panel fix. The panel never sees a transaction.** `ProductPerformancePanel.jsx:44`
reads a pre-aggregated monthly rollup document via `statsPath(...)`, deliberately — a year read
live off `transactions` is thousands of document reads and Aldi is paying for them. The merge
happens long before the panel:

  - `src/utils/salesRollup.js:88-90` — `salesDelta` accumulates `{ qty, revenue }` per product and
    NOTHING ELSE. There is no paymentType dimension anywhere in the rollup.
  - `src/utils/salesRollupWrite.js:37-38` — writes exactly those two fields into `byProduct` and
    `byDay`.

So the split has to be created at write time and carried through: `salesRollup.js` (split the
delta), `salesRollupWrite.js` (increment the new fields), `sumRange` (carry them), the panel and
`ponder/stages/ProductPerformanceTable.jsx` (render two figures instead of one). **That is five
files — over the 3-file rule, so stop and name them to Aldi before starting.**

**THE TRAP THAT MAKES A LAZY BUILD WRONG - historical rollups have no split.** Every month already
written carries only `{ qty, revenue }`. Add the fields and past months silently report zero
receivable and 100% finished sales - a confident wrong number, worse than today's honest merge.
Decide explicitly: backfill from `transactions`, or label pre-change months as "not separated" in
the UI. Do not let old documents answer a question they were never asked.

**CHECK BEFORE DESIGNING:** does a later `CONSIGNMENT_PAYMENT` also enter the rollup? Look at
`SALE_TYPES` in `salesRollup.js:42-46`. If a Titip sale books revenue at placement AND its payment
books revenue again, the panel is already double-counting and that is a separate, larger money bug
that must be settled first.

## Added to `.claude/PROGRESS.md`

**Updated: 2026-09-05 10:55 WIB (🟠 KPM session — branch PUSHED for a Vercel demo; bug 2 scoped; 4 fixes live)** · 📋 **RESUME BRIEF: `.claude/NEXT-SESSION.md`** · **722/722 audit · 1035/1035 selfcheck** · branch `phase0-solid-ground`

### 🟠 2026-09-05 10:55 — `phase0-solid-ground` pushed to GitHub for a Vercel demo.

He asked to put the app online to show friends, then go back to offline work. **The branch had never
been pushed** — it is now `origin/phase0-solid-ground` and tracking. Vercel builds a preview per
branch when the project is git-connected, so the URL comes from his Vercel dashboard; **I cannot log
into Vercel and did not try** — that is entering credentials.

**Security check before pushing, and it came back clean** [certain]:
`grep -rn "createUserWithEmailAndPassword" src/` returns **nothing** — there is no self-signup
anywhere in the app. A stranger with the URL reaches the login screen and stops; accounts are
created by an admin only, and the Ghost Killer at `App.jsx:2400-2409` blocks a login with no
profile. So a public demo URL does not expose the data to whoever finds it.

**⚠️ The gap that does exist, unchanged:** the store hand-off write rule is drafted, NOT deployed
(`A-Brain/Backlog/Deploy the store hand-off write rule.md`). An account holder can still edit or
delete transactions he did not make at the database level. Friends cannot get an account, so this
does not affect the demo — but it is live for real agents right now.

Firebase config is hardcoded at `src/config/firebase.js:8` and committed. That is normal for a
Firebase web key — it is not a secret, the Firestore rules are the actual boundary — but it means
the rules gap above is the whole of the protection.

**✅ LIVE: `kpm-ang.vercel.app`** — Vercel domain, Preview environment, aliased to the
`phase0-solid-ground` branch. Build Ready in 46s. `kpm-demo` was taken by another team;
`kpm-ang` was free.

**Production is deliberately untouched.** `kpm-inventory.vercel.app` still serves the default
branch, which does NOT have today's four fixes. Do not "Promote to Production" to shorten a link —
that would ship this branch to real agents as a side effect. Merging to main is a separate decision
with its own before-and-after checks, and Aldi has not asked for it.

**Still open, unchanged:** bug 1 (hand-off eligibility, design locked, ready to build), bug 2
(rollup split, five files, scoped), bug 3 (book close button, white line unlocated).

### 🟠 2026-09-05 10:35 — Bug 2 traced. It is a rollup change, not a panel change. NOT started.

Told to continue, I took bug 2 and traced it before editing. **It is five files, not one.**

`ProductPerformancePanel.jsx:44` never reads a transaction — it reads a pre-aggregated monthly
rollup document, on purpose, because a year read live off `transactions` is thousands of document
reads Aldi pays for. The consignment/paid merge happens upstream: `salesRollup.js:88-90` accumulates
`{ qty, revenue }` per product with **no paymentType dimension at all**, and
`salesRollupWrite.js:37-38` writes exactly those two fields.

So splitting receivable from finished sales means changing the delta, the writer, `sumRange`, the
panel and `ProductPerformanceTable.jsx`. Over the 3-file rule → stopped and named them rather than
starting. [certain] (checked: both files read at those lines.)

**⚠️ The trap, recorded in the brief:** every rollup month already written holds only
`{ qty, revenue }`. Adding fields makes past months report zero receivable and 100% finished sales —
a confident wrong number, worse than today's honest merge. Backfill or label; do not let old
documents answer a question they were never asked.

**🔴 One thing to settle FIRST, possibly larger than bug 2:** does a later `CONSIGNMENT_PAYMENT`
also enter the rollup? If a Titip sale books revenue at placement and its payment books it again,
the panel is double-counting today. `SALE_TYPES` at `salesRollup.js:42-46` is where that is decided.
**Not checked — ran out of session budget, do not assume either way.**

**Quota note:** his ratio, 2026-09-05 — *"10 % in 5 hours is equal to 1% in weekly"*. My measurement
was 9.4:1, so 10:1 is right. Session ~72% → ~28% of this window left, and that is the binding limit
(7% weekly ≈ 70% of a window). Stopping rather than opening a five-file money change.

**WAITING ON ALDI — nothing blocking.** Optional: switch the `[plan-quota]` hook's opening line to
lead with the 5h window? One edit to `.claude/plan-quota.mjs`.

### 🟠 2026-09-05 10:20 — Reporting correction from Aldi. No code, no state change.

> *"dont focus at the weekly reset, focus on the 5 hours reset first before the weekly reset because
> it will hit the wall of the 5 hours quota before the weekly quota"*

He is right and the numbers back him: across this session the 5h window went 0% → 66% while the
weekly moved 86% → 93% — roughly nine times the burn rate. The 5h bucket is what cuts him off
mid-job; the weekly is the slower limit. Saved as `feedback_quota_report_5h_first.md` in the
project memory. **Lead every quota mention with the 5h figure from now on.**

The `[plan-quota]` hook's own mandated opening line is weekly-worded and lives in
`.claude/plan-quota.mjs`. Not edited — that is his config and his call.

**WAITING ON ALDI — ❓ one optional question:** want the hook's opening line changed to lead with the
5-hour window instead of the weekly? One edit to `.claude/plan-quota.mjs`, say the word.

**Still open, unchanged:** bug 2 (Product Performance counts unpaid consignment as revenue), bug 3
(book close button dead, white line unlocated). Neither is blocked. Approval-matrix design is
complete and buildable from cold.
