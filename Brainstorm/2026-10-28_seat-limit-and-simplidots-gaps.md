# 2026-10-28 - seat limit (subscription manager) + what to build next vs SimpliDOTS + price

Plan only - nothing built. Written 08:18 WIB.

## The problem, in his words
*"so can u compare and tell me what could we do to improve this app since we have simplidots app pdf that i gave u last
time as one comparison and also what is the best price in indonesia dont u think and also we should add some restriction,
because the system right now even when the company pays for 10 people they are freely be able to just add another one
inside the fleet and roster without paying me so i think we need some subscription manager features just for the tier 1"*

## What exists today (checked in code 2026-10-28)
- T1 = DEVELOPER = him (landlord). `firestore.rules` `isSuperAdmin()` = his email - the rules already know him.
- `src/components/LandlordDashboard.jsx`: lists companies (employee_directory, role COMPANY_OWNER), provisions a T2 owner,
  and SUSPEND / ACTIVATE per company (`subscriptionStatus`; App.jsx ~2919 refuses a suspended login).
- MISSING: a seat number. A T2 (or T3/T4) adds logins in Fleet & Roster (`FleetCanvasManager.jsx` ~404/417, batch.set of
  `employee_directory/<email>` with bossUid) with no limit; the create rule (firestore.rules ~328) checks rank, not count.

## The seat limit - design (for his yes)
- He sets "seats" per company in the Landlord Dashboard; only isSuperAdmin may write it (rules).
- A seat = a login record (`employee_directory`, bossUid = that company). Boss Vehicle and test (POV) profiles have no
  login, so they never take a seat.
- Enforced in the DATABASE, not only on screen (the UI-says-yes-server-says-no pattern): rules cannot count documents,
  so each login claims a NUMBERED seat (1..limit) in the same write; the rule refuses seat number > limit, and a seat
  number already taken cannot be created twice. Removing the person frees the number. Needs a rules CHANGE he publishes
  BEFORE the code.
- At the limit the "+ add person" control STAYS and says why (his 2026-10-27 taste rule): "25 of 25 seats used. Ask KPM
  to add seats."
- Existing companies: their current logins get numbers on first open after the update; a company already over its
  limit loses nobody - it just cannot add until it is under.
- Known hole a seat count cannot close: one login shared by several people on several phones. Later option: one
  login = one phone at a time.

## Decisions put to him (defaults offered, "your picks" = all three defaults)
| | Default (my pick) | Other |
|---|---|---|
| Owner's own login takes a seat? | yes - every login counts, simplest to explain ("you pay for 25 people who can sign in") | no - owner free |
| A LOCKED login (lost phone) keeps its seat? | yes - else lock Budi, add Andi, lock Andi... = unlimited | no |
| Price of an extra seat | Rp 400 ribu/month (= his Rp 10 jt / 25, same rate) | Rp 250 ribu (Distri Pro) |

## SimpliDOTS gaps (from Raw/2026-10-27_simplidots-company-profile.md), status today
| Gap | Status | Rank |
|---|---|---|
| Promo effectiveness | DONE - offer results in REPORTS (kpm 5c94f59) | - |
| Promo quota | REJECTED by him 2026-10-27 ("the factory caps stock per region") | - |
| Seat limit | his ask today | 1 |
| Salesman sees only his own numbers (the "today" rail shows company totals [likely]) | NEXT-SESSION job; a factory's data review asks this | 2 |
| Effective call - visits vs orders per salesman, ranked (their Supervision KPI) | data exists (Journey visits + sales) | 3 |
| Customer card on the visit: debt + DUE DATE, favourite products, visit history | half exists (customerBrief last order, debtInfo) | 4 |
| Principal portal - the factory sees its distributors' sales | big; only if Cello sells through distributors (asked) | 5 |
| Proof of delivery with a signature | only for delivery, not canvas | skip |

## Price - decided 2026-10-25, not re-opened
His Rp 10 juta/month floor for Cello's 25 users stands (see [[2026-10-24_pricing-and-b2b-engineering-business]]).
New since then: the running cost is now ~Rp 76 ribu/month at 25 users (fix A live 2026-10-27), so the price is ~99% margin
on the cloud; his real cost is support time. The cost he has not priced: per user it is ~1,6x Distri Pro, so it sells
as a factory package - and the seat limit is what makes "25 seats included, Rp X per extra seat" enforceable.

## Decision
OPEN - waiting on Aldi: the three seat questions (or "your picks"); whether Cello sells through distributors.

## Rejected on purpose
- A screen-only limit (button hidden at 25): a company could still add a 26th through the database - the UI-says-yes pattern.
- Re-researching prices: decided 2026-10-25, nothing in the market changed since.
- Promo quota: his 2026-10-27 no.

Models applied: Inversion (how a company gets seats for free: add past the button, lock-and-replace, write the limit
itself, share one login), Chesterton's Fence (Landlord Dashboard + SUSPEND already exist - build the seat number on
them, do not invent a second admin screen), Sunk Cost (a year of work does not set the price; the customer's alternative does).

## 08:30 WIB - ANSWERED
His words: *"1 = yes owner is 1 seat, 2 = yes locked login keep it seat , they can change the email and everything but it will stays at 1 seat until they delete them, i just think that 400k per people is cheap enough isnt? well if u want to compare our stuff with distri make sure that our features and their features is being compared, so its not just the price, its the UI the safety the ergonomics, features and how effective and efficient the app would be , cello does sell from distributor also and they have their own salesman as well"*.
- DECIDED: every login incl. the owner = 1 seat; locked keeps it; an email change keeps the same seat; only deleting frees it; extra seat Rp 400 ribu/month.
- Rp 400 ribu is NOT cheap by the market read 2026-10-24 (Distri Pro Rp 250 ribu, Advanced Rp 150 ribu, SalesMania <= Rp 75 ribu, Bee extra licence Rp 80-100 ribu): it is the top. It holds as a package price only - which is why he wants the full comparison (features, UI, safety, ergonomics, efficiency), not price alone.
- Cello sells through distributors AND its own salesmen -> the factory portal moves up (rank 5 -> worth designing after the seat limit).
- Seat design details (licence doc, seats outside users/<bossUid>, push order): in kpm .claude/NEXT-SESSION.md top block.

## 2026-11-01 18:15 WIB - BUILT (kpm 2f2eb69, pushed)
- How: `licenses/<bossUid> { seats }` (his alone) + `seats/<bossUid>_<n> { bossUid, n, login }` outside `users/<bossUid>`; rules CHANGE 20 - a new login under a licence must name a seat whose doc names it back. Mechanism and every rule: the commit message.
- Checked: rules-test/test-seat-limit.mjs 27/27; the live rules fail 11 of the same lines (a T2 adds a person with no seat), allow-all fails 17. logicFixes 2629/2629, audit 723/723.
- Owner's own record: the email-keyed record becomes `employee_directory/<uid>` (bossUid = uid) at the owner's vault setup (App.jsx account migration). The landlord's Save seats refuses an owner whose bossUid is still the email; the rule exempts only a record keyed by the signer's own uid.
- Known ceiling (ponytail, in utils/seats.js): rules only check "number <= limit and free", so a company he licenses BELOW its head count could refill a freed low number from outside the app - its ceiling is the head count on licence day. The app itself refuses while used >= limit.
- OPEN - waiting on Aldi: publish CHANGE 20 in the Console, then set seats per company.
- Frames: Raw/2026-11-01-seat-limit/ (fleet 375 full company + toast, fleet 1440, add form 1440, landlord 375 + 1440).
- 2026-11-01 18:56 WIB - TESTED end to end on the local emulator (real app + the published rules), all pass: landlord numbers 3 logins; add -> seat 4; full -> the KPM message; direct writes around the app (no seat / seat 5 / taken seat / own licence) all 403; email change moves the seat; lock keeps it; remove frees it. Found, older than this: after an email edit the picked card keeps the old email until re-picked (Lock right away fails with a message).
- 2026-11-01 19:15 WIB - CORRECTION + ROOT CAUSE: the "old-email bug" above is NOT a bug (FleetCanvasManager.jsx:276-281 refreshes the picked card; retested as T1, Lock named the new address). It looked stale because, on the LIVE rules, a company OWNER (uid-keyed record, no email record) is refused every LIST of his own company (GET of one doc works). Proven on the emulator by browser REST and by @firebase/rules-unit-testing; same on the pre-CHANGE-20 baseline. Bisected to the users/{bossUid} catch-all (CHANGE 11b + 14 #6): `document[0] != 'vault_keys'` breaks list queries; `isVaultOwner || isDistributorAdmin` alone lists fine. His T1 account skips it via isSuperAdmin, so nobody saw it. Cello's owner would see an empty app. OPEN - his yes to draft CHANGE 21. Lesson: a bug seen in a test setup whose listeners are failing is a symptom until reproduced where they work.
- 2026-11-01 19:25 WIB - FIXED as rules CHANGE 21 (DRAFT, kpm 03acc89): the users/{bossUid} catch-all excludes vault_keys / motorists / settings/admin by a path-string match instead of document[0]; all 12 rules-test suites green (348), the live rules fail the 6 owner-list lines. OPEN - he publishes it.

## 2026-11-02 05:54 WIB - gap 2 BUILT (kpm 1a1ca16)
A salesman's TODAY box counts only his own sales (his "A"). Gaps 1 + 2 done; next: his ask below in [[2026-10-28_kpm-vs-distri]].
