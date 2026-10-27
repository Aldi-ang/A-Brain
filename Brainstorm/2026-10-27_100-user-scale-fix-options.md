# 2026-10-27 - the 100-user scale fix: which fix ships before Cello

Plan only - nothing built. Written 17:47 WIB, the moment the options were put to him.

## The problem, in his words
2026-10-19: *"make sure again that everything works well even when there is 100 of people using the app at once"*.
Every phone downloads every salesman's last 7 days of sales, each with its handover photo inside
(`src/hooks/useDatabaseSync.js:83`, `where('timestamp', '>=', sevenDaysAgo)`, no salesman filter). First customer
Cello: 25 users, Rp 10 juta/month at least. Earlier notes: [[2026-10-19_app-bugs-and-100-users-check]] row 1,
[[2026-10-24_pricing-and-b2b-engineering-business]] "The cost he has not priced".

## The options (Rp per month, Blaze, the model in kpm `.claude/cost-sim/kpm-running-cost.html`, Rp 16.500/US$)
| | 25 users (Cello) | 50 | 100 | 1.000 | screens that change | work |
|---|---|---|---|---|---|---|
| Today | 1,52 jt | 5,73 jt | 21,8 jt | 1,66 miliar | - | - |
| **A. photos as files** | **76 rb** | 383 rb | 1,61 jt | 153 jt | none | the Settings switch exists (SettingsView ~1376, "Database" / "Cloud · Blaze"); 1 small fix: offline sales keep the photo inside |
| B alone (own sales only, photos inside) | 217 rb | 935 rb | 3,48 jt | 242 jt | 5 salesman screens | big |
| **A + B** | **16 rb** | 93 rb | 434 rb | 43,5 jt | 5 salesman screens | big + 1 index + Blaze |

[likely - a model calibrated to the 2026-10-19 load test, not a bill. It reproduces the 21,8 jt / 434 rb of 10-19 exactly.]

**Photos are ~93% of the bill.** At Cello size A alone takes it from Rp 1,52 jt to Rp 76 rb; B adds Rp 60 rb/month of saving.

**Spark (free) cannot hold Cello with any option:** 25 users = ~405 k reads/day today and with A, ~133 k with A+B,
against 50 k free. Today/A die at about the 10th app open of the morning, A+B at about the 44th (~75 opens/day).
So Blaze must be on the day Cello starts. His 2026-10-19 answer stands: *"i wont move to blaze yet until the app is rented"*.

## What each tier sees after B (checked by grep 2026-10-27, every reader of the `transactions` list)
- T1-T4 (owner, HQ sales manager, regional admin = FLEET_CAPTAIN): keep the whole company list. Dashboard, Fleet,
  EOD approval, Receivables (incl. inherited debts), Master Vault, Branch warehouse, Stock Opname, Map: no change.
- T5/T6 salesmen, already own-only (no loss): Agent Inventory (`AgentInventoryView.jsx:135`), EOD (`EODReconciliationView.jsx:172`), Reports personal.
- T5/T6 LOSE, silently, no error, unless each is rebuilt:
  1. Sales Terminal shop card "this shop still owes Titip" (`MerchantSalesView.jsx:184` debtInfo) - another salesman's open Titip at the same shop disappears. MONEY: he could give more Titip to a shop already owing.
  2. Sales Terminal last order / reorder (`customerBrief`, `MerchantSalesView.jsx:1624`).
  3. Journey "visited today by X" (`JourneyView.jsx:423`).
  4. Map, T5 only: the region team's progress today (`MapMissionControl.jsx:1778`, expedition) - teammates show 0.
  5. Agent Profile -> Hall of Fame race (`AgentProfileView.jsx:442`, `HallOfFameView.jsx:28`) - everyone else at Rp 0.
  Fix for 1-2: ask for that ONE shop's sales when he picks it (a few reads; the rules already allow it).
  3-5 need a per-salesman running total or a cheaper source - not designed.
- A change he would SEE: the terminal's "today" numbers (`dayStats`, `MerchantSalesView.jsx:1610`) add up the WHOLE
  company's sales today on a salesman's phone now [likely - `dayStats.js` has no agentId]. After B they are his own.
- B needs a Firestore index (agentId + timestamp) created in the Console BEFORE the push - without it the salesman's
  list errors and comes back empty (only a console.warn).

## Gaps in A (found 2026-10-27)
- Offline sales keep the photo inside the sale: `MerchantSalesView.jsx:1208` uploads only `if (isOnline)`. Fix = upload at sync.
- No `storage.rules` in the repo: whether a salesman may write to Storage is unknown until Blaze is on [guessing].
- Old sales keep their photos for up to 7 days after the switch, then roll out of the window.

## Correction to [[2026-10-24_pricing-and-b2b-engineering-business]]
It said ~Rp 4,3 jt/month at 1.000 users after both fixes, "a straight line". The same model gives **~Rp 43,5 jt**:
office users (T1-T4, 10%) still download every sale, so their part still grows users x users. A third fix -
managers download only their region - is what makes it a straight line, and it needs a region field on every sale
(none today). Still cheap next to Rp 200 jt/month of revenue at 1.000 users. [likely - model]

## Decision
DECIDED 2026-10-27 ~18:02: **A**. His words: *"i see then use option A to minimize the cost"*. Built + pushed 18:11 in kpm `740d614` (helper fileOrKeepPhoto; terminal shop photo + offline sync). Works only once Blaze is on and Settings shows "Cloud · Blaze". Next: Storage rules draft. B stays open for 50+ users.

## Rejected on purpose
- B before A: B is the risky half (5 screens, a money card) and the smaller saving.
- Narrowing the firestore.rules read for salesmen now: separate privacy job; a scoped rule without the narrowed
  query denies the listener for T3-T6 (rules comment above `match /transactions`).
- A workflow / subagent fan-out: his rule.

Models applied: Opportunity Cost (Rp 60 rb/month saved by B at Cello size vs 5 rebuilt screens and a money card),
Pre-mortem (B ships -> a shop's Titip from another salesman vanishes from the terminal, extra Titip handed over),
Reversibility (A is a switch, two-way; B changes what every salesman's phone holds).

## 17:56 WIB - he misread the board
His words: *"what are u making here actually, and those pricing is crazy cheap, what im a supposed to eat with whose prices, lets use the logic i made this app for almost a year and those pricing is not even worth it to made one of this app bruh"*.
Cause: the cards said "Rp 76 rb per month" without "Google charges you". Those are the CLOUD BILL he pays, not his price to Cello (Rp 10 juta/month, his number). Re-explained: Cello pays him Rp 10 jt; today the bill would take ~Rp 1,52 jt of it, with A ~Rp 76 rb; at 100 users today the bill (Rp 21,8 jt) is bigger than a Rp 10 jt deal. Decision still OPEN.

## 18:18 WIB - Storage rules drafted (kpm `bc00a52`)
`storage.rules` (DRAFT, he publishes on Blaze day): folder owner, or an unlocked employee of that owner's company (same employee_directory lookup as firestore.rules), pictures only, under 5 MB, only photos/ and images/. Test `rules-test/test-storage-photos.mjs` 18/18, allow-all 7/18. His Blaze-day order: Blaze -> Storage Get started -> paste rules, Publish, allow Storage to read Firestore -> Settings "Cloud · Blaze".
