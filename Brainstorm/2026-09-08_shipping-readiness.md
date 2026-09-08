---
confidence: high
checked: 2026-09-08
status: PARTLY ANSWERED — deadline given, emulator question still open
---

# Shipping readiness — what "no bugs" has to mean before KPM is sold

## The problem, in his words

> "since we are lack of time and money i think lets do the update and fix regarding the function of
> this app, and make sure that all works well so that i can submit this app to the customer and sell
> it so that we can have more ability to improve the app at faster pace so what do you think we need
> to check and test and fix to be this app to be 100% working with no bug with all the features that
> we have, lets forget about the appearance for now" — 2026-09-08

His reasoning is sound and is not the thing to argue with: ship, get paid, buy the ability to
improve faster. The thing to argue with is **"100% working with no bug"**, which is not a state any
app reaches and is a budget with no bottom. Spending the remaining time chasing it is the actual
risk here, because it converts a finite job into an infinite one.

**The reachable state, and the one worth naming as the goal:** no bug on the paths a customer will
actually run, every remaining known bug written down and ranked, and nothing shipping that lies
about money or leaks between branches.

## What was already known to be broken, before this question was asked

| # | Thing | Class | Ships? |
|---|---|---|---|
| 1 | A consignment return never reverses the sales rollup | **money is wrong** | no |
| 2 | Geofence bypass requests go to the owner globally, and can be spammed | routing + spam | no |
| 3 | `FleetCanvasManager.jsx:38` resolves branch by email, so POV shows the wrong branch | test tool lies | not customer-facing |
| 4 | Titip revenue is booked at placement, before payment | **judgement call, his** | undecided |
| 5 | HQ 3 / HQ TEST carry consignment debt written under the old rule | live data | his call |
| 6 | HQ 3 hand-off reads APPROVED with the shop never moved | live data | his call |
| 7 | PonderBook close button does nothing; a white line on the book | appearance | yes, deferred |

Finding 1 was located while he was typing the question, and it is the sharpest argument for the
ordering below: it was not on anybody's list, it was found by following a comment that named four
paths where the code only implemented three, and it makes the app report money that never arrived.

## The options for how to spend the remaining time

| Option | What it is | Costs |
|---|---|---|
| **A. Fix the known list, then ship** | Work items 1-2 above, then hand it over | Cheapest and fastest. Assumes the known list is the real list — and finding 1 is direct evidence it is not. Anything not yet found ships with it |
| **B. Audit everything** | Systematic pass over every feature | Only option that could approach his words literally. Unbounded, and he has neither the time nor the money — it is the option his own constraint rules out |
| **C. Risk-ordered pass** | Rank by what a bug there COSTS the customer, fix top-down, stop when the time runs out | Not exhaustive, and says so. Requires deciding the ranking up front. Leaves a written list of what shipped unfixed |
| **D. Path-based pass** | Enumerate what a customer does day 1 (first login, add products, add staff, first sale, EOD, first consignment, first payment) and prove each end to end | Bounded by the app's real use, not by its file count. Misses bugs on paths nobody walks on day 1 — which is the correct thing to miss when time is short |

**C and D are not rivals.** D is the list of what to test; C is the order to fix what D turns up.
The pairing is the actual proposal: walk the day-1 paths, rank what falls out by cost to the
customer, fix top-down, and write down whatever the clock leaves.

## The ranking that would drive C, if he accepts it

1. **Lies about money.** Wrong totals, double counting, a return that does not reverse. The customer
   finds these by doing their job, and they destroy trust in every other number on screen.
2. **Loses data.** Offline sales that never drain, a batch that half-commits. Salesmen on phones in
   bad signal is the normal case here, not the edge case.
3. **Leaks across branches.** One branch's staff seeing or changing another's. This is the one that
   is unfixable after the fact by an apology.
4. **Blocks day 1.** Onboarding, first login, adding a product or a person. Not dangerous, but it
   ends the sale before any of the above matters.
5. Everything else, including all appearance work, which he explicitly deferred.

## Rejected on purpose — do not re-propose these

- **"Test everything."** Ruled out by his own stated constraint, not by taste.
- **A new test framework, or a new checklist from scratch.** `MANUAL_TEST_CHECKLIST.md` and
  `SECURITY_RULES_DEPLOY_CHECKLIST.md` already exist and Section B passed 2026-09-08. Extend them.
- **Fixing appearance first.** He said forget appearance. The PonderBook close button and the white
  line stay open on purpose.
- **A migration to repair past months.** Not needed for finding 1 if the fix goes into the shared
  `salesDelta` rather than into its callers: `rebuildMonths` recomputes every month from
  `transactions`, so correcting the maths once makes the existing Settings rebuild repair history by
  itself. Worth confirming before relying on it.
- **Pushing before the money bugs are fixed.** Six commits sit local. Two are tested. Shipping the
  untested four to a customer's hands is the same mistake as not testing at all.

## What he answered, 2026-09-08 19:30

> "okay then fix those first i want to finish this app before this month"

**Deadline: 30 September 2026.** About three weeks. And "fix those first" accepts the ordering —
money bugs before anything else. He did not push back on the reframe, so the shipping bar stands as
written above: no bug on the paths his customer walks, everything else written down and ranked.

He also added, separately: *"make sure both phone and PC looks good and work well"*. That partly
reverses "forget about the appearance" — he does not want it beautiful, he wants it USABLE at both
widths. It turned out to be blocked on something concrete rather than on taste, and that block is
now gone: the dev server served https with a self-signed certificate the agent's browser could not
click through, so every visual claim went back to him by eye. `--mode httpdev` (repo `8abcf04`)
serves plain http on 5174 beside it, and the sign-in screen was verified rendering at desktop and at
375x812 with no console errors.

## Still open — waiting on Aldi

> "can I set up the Firebase emulator?"

Asked and not answered. The browser can now check LAYOUT, but it **cannot sign in** — entering
credentials and completing a sign-in flow are things the agent must not do, which is a boundary and
not an obstacle to route around. So every screen behind the login is unverifiable from here, and
"make sure both phone and PC look good" cannot be honestly delivered beyond the login screen without
it. `src/config/firebase.js:56` already reads `VITE_USE_EMULATOR`. One session to seed it; it pays
back on every session after, and there are three weeks of them.

Second open question, older and unrelated to shipping: is booking Titip revenue at placement, before
the shop has paid, what he wants? That is accounting judgement, not a bug, and it is his call.

Related: [[../Wiki/Concepts/A Rollup Is a Cache, Not a Ledger]] ·
[[../Wiki/Concepts/UI-Says-Yes-Server-Says-No Pattern]] ·
[[../Wiki/Concepts/POV Changes the Id, Never the Email]]
