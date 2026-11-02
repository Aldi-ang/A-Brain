---
date: 2026-11-02
status: DECIDED A + B; C OPEN (more talk)
---
# Beat Distri and SimpliDOTS - one ranked list

Written 2026-11-02 05:59 WIB. Board: [[Raw/2026-11-02-beat-rivals/board.png]].
Merges [[2026-10-28_kpm-vs-distri]] (7 fixes ranked by money) with the SimpliDOTS gap table in
[[2026-10-28_seat-limit-and-simplidots-gaps]]. Nothing re-researched; every "today" claim re-checked in kpm code 2026-11-02.

## Problem, in his words
*"btw we need to update the app so that it will be better from distri and simplidots make sure use your researc as comparison to make our app better compared to them later"* (2026-11-02)

## Done already (dropped from the list)
- Seat limit per company - kpm 2f2eb69 (SimpliDOTS gap 1).
- A salesman sees only his own numbers on the TODAY box - kpm 1a1ca16 (SimpliDOTS gap 2).
- Promo effectiveness in REPORTS - kpm 5c94f59. Promo quota - rejected by him 2026-10-27.

## Options (remaining gaps, ranked)
| # | Gap | Which rival has it | KPM today (checked 2026-11-02) | Size |
|---|---|---|---|---|
| A | Salesman screens in Indonesian (a language switch; his screens stay English) | both (Distri all Indonesian [certain]; SimpliDOTS Indonesian [likely]) | no switch at all - grep `i18n/useLang/setLanguage/bahasa` in src = 0 [certain]; English game words ("Search wares", "Manifest", "Pay bounty") | big: every label on the Sales Terminal, Journey, evening hand-in |
| B | Effective call (visits vs orders) + a target per salesman | both lists (Distri from its Rp 75 rb/user plan; SimpliDOTS supervision KPI) | one COMPANY target only (`appSettings.targetMonthlyRevenue`, default Rp 500 jt, `DashboardBenchmarks.jsx:66`); per-salesman target none; effective call grep = 0 [certain]; the data exists (Journey VISIT_REPORT + sales) | medium: one report + a target per salesman |
| C | Factory view of its distributors (principal portal) | both lists | none - grep `principal/distributors` in jsx = 0 [certain]; LandlordDashboard is Aldi's own tenant registry, not this | big: reads across companies -> rules change he publishes |
| D | Shop card on arrival: debt + due date, favourite wares | SimpliDOTS | customerBrief has last order, last items, visits (7 d), orders, avg basket, spend - no debt / due date (`customerBrief.js:64`); due dates live in ConsignmentFinanceView + Journey | small |
| E | Office: Excel export + e-faktur number | Distri (from Rp 150 rb plan), Accurate add-on | no export - grep `xlsx/.csv/text/csv` = 0 [certain] | medium |
| F | Fake-GPS check on visits | Distri (from Rp 25 rb plan) | none. CORRECTION to the 10-28 note: a web app cannot read the phone's mock-location flag - the browser gives only position, accuracy, speed [likely, W3C GeolocationCoordinates]; only guesses (jumps, too-perfect accuracy) are possible, weaker than Distri's native app | small, weak |
| G | One-page safety sheet | Distri answers with ISO 27001 | none in Wiki/Concepts | no app code, ~1 day |
| H | Speed proven on a cheap phone | Distri reviews: "boros batrai" | never timed | needs a real Rp 1,5 jt Android in his hand |

## What each costs
A: biggest; touches labels pinned by checks (integration.audit `labelSrc`), needs the Indonesian words agreed with him. B: new report screen + one field per salesman; data already recorded. C: rules change + a cross-company read - multi-session. D-F: a session each. G: writing only. H: his phone + 10 minutes.

## Recommendation
A first: the deal is 20 salesmen using it every day, and both rivals are Indonesian from the first screen (the 10-28 money ranking put it #1). B second: on both lists, data already there, the boss who signs sees it.

## Decision
OPEN — waiting on Aldi. Asked: "🔴 DECIDE: Which one do I build first - A, B or C?"

## Rejected on purpose
- Re-researching Distri / SimpliDOTS - paid for on 2026-10-27/28.
- Matching Distri's 50+ reports, delivery e-signature, route optimisation, promo quota, a price cut - all rejected in the 10-28 notes.
- Treating the 10-28 pick ("safety sheet first") as decided - he never answered it.

Models applied: Inversion (how Cello says no: salesmen reject English screens -> A; a supervisor cannot see who visits without selling -> B; the factory cannot see its distributors -> C), Opportunity Cost (A is the biggest job but the deal rides on it), Pre-mortem (F: a fake-GPS "check" a web app cannot really do would be a promise the pitch cannot keep).

## 2026-11-02 06:10 WIB - DECIDED: A and B, C later
His words: *"do A and B first . we need further discussion for C"*.
A round 1 (Sales Terminal) words board sent: [[Raw/2026-11-02-indonesian/board.png]] + [[Raw/2026-11-02-indonesian/words.png]] (124 words, the mock swap in `Raw/2026-11-02-indonesian/inject.js` = the dictionary to build from). Size measured: ~263 English strings on the 3 salesman screens (terminal 175, Journey 75, evening hand-in 12) plus strings built in code -> 3 rounds: terminal, Journey, hand-in.
Asked: "❓ ANSWER: Are these Indonesian words right? Say "ok" or name the ones to change." and "🔴 DECIDE: Who sees Indonesian?" (my default: everyone Indonesian except his own login, an EN/ID button on each phone).

## 2026-11-02 09:24 WIB - his word fixes, round 1
His words: *"5 this sentence is not translated in indonesia well, sc2  minta peningkatan pada level harga, sc3 tulis jenis kerusakannya. example here should be contoh not misalnya/mis"*. Applied in `Raw/2026-11-02-indonesian/inject.js`: pricing-tier request = "Minta peningkatan pada level harga" (and "Requested Pricing Tier" -> "Level harga yang diminta", same word), damage = "Tulis jenis kerusakannya...", "e.g." = "contoh:". His "5" is unnamed (no screenshot reached the session) -> all 19 sentences rewritten. Board: [[Raw/2026-11-02-indonesian/changes.png]].
Asked: "❓ ANSWER: Which number was your "5"? Or say "ok" if the new words are right." and "🔴 DECIDE: Who sees Indonesian?" (still owed).
