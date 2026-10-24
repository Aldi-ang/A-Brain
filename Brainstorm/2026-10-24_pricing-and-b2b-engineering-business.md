---
title: KPM pricing again, and KPM as the start of a B2B engineering business
created: 2026-10-24
status: OPEN - waiting on Aldi's first answer (what the business IS)
---

# KPM pricing again + the B2B engineering business

## The problem, his words (2026-10-24 19:3x WIB)
*"i want us to research after this about the best pricing for this app and about how this business will be our starter to build my B2B app and website producing engineering that i wanted i want u to be my partner and brainstorm with me for all the preparation that we need for this as well"*

## What already exists (do not re-research)
- `Wiki/Entities/KPM Price Sheet.md` (2026-09-10): one customer, 25-30 users. Pilot Rp 2,5 juta/bulan (3-6 months), then Rp 5 juta/bulan up to 30 users, Rp 150 ribu per user above 30, implementation Rp 7,5 juta, floor Rp 2 juta (break-even), perpetual licence Rp 250 juta + 20%/year, copyright NOT for sale. He leaned to Rp 10 juta. Four yardsticks: cost, market (Accurate Online ~Rp 1 juta at 30 users; Badger Maps ~Rp 28 juta), stock leak on the road, one admin's salary.
- Legal: `Brainstorm/2026-09-10_riset-hukum-menjual-kpm.md`; contract draft `Brainstorm/2026-09-10_draft-13-pasal-kontrak-kpm.md`.
- NEXT-SESSION.md marked the business track "CLOSED and PARKED, do not reopen" - he reopened it himself on 2026-10-24, which is his call.

## What is NEW since September (why a second look is worth it)
- The 2026-09 pricing was for ONE company (a custom deal). Since then: a public demo build with five real accounts and a nightly reset (2026-10-06/13), a sales presentation for viewers (v28-v37), customer access by folder (P1-P3). That is the kit for selling to MANY companies, which the September sheet never priced.
- The new ask is bigger than a price: KPM as the first product / showcase of a B2B engineering business.

## The fork that decides the research (asked 2026-10-24)
| | What the business is | What gets priced | What the research looks at |
|---|---|---|---|
| 1 | Software house: companies pay him to BUILD their own app/website, KPM is the portfolio | a project fee + monthly maintenance per client | Indonesian agency rates, scoping, contracts, team |
| 2 | Product company: the SAME KPM sold to many distributors every month | per-company or per-user subscription | distributor SaaS rivals in Indonesia, onboarding cost, multi-company support |
| 3 | Both, in order: product first (cash + proof), house later | 2 first | 2, then 1 |

## 2026-10-24 ~19:40 - his answer: sell THIS app to big factories (fork -> 2, product company)
His words: *"bro i think 5 million is too cheap isnt? we need to make price list for this app that we develop who pays for this app should be big company a big cigarette factory and this app can hold a lot of their salesman to work as well right, we also need to talk about competitor and their pricing as well"*.

### Competitors, read 2026-10-24 (1 USD = Rp 18.040, Bing rate that evening)
| Who | What it is | Price | Rp per user per month | Source |
|---|---|---|---|---|
| Salesforce Consumer Goods Cloud - Retail Execution (Enterprise) | field reps: visits, inventory tracking, maps | US$100/user/month, billed yearly | Rp 1,80 juta | salesforce.com/consumer-goods/pricing [certain, read] |
| Salesforce Consumer Goods Cloud - Sales Core | full consumer-goods CRM | US$275/user/month, yearly | Rp 4,96 juta | same [certain, read] |
| Bizom (India; "750+ CPG brands"; SFA + DMS + van sales) | closest in scope to KPM | Starter 1-250 users US$60/user/month | Rp 1,08 juta | softwarefinder.com (third party) [likely]; bizom.com shows only "Request price", Basic = 100 users |
| Repsly | retail execution | "starts at $89" (unit not shown in the snippet) | ~Rp 1,6 juta if per user | itqlick snippet [guessing on the unit] |
| FieldAssist | SFA + DMS, has an Indonesian site; Nivea, Adani | quote only (Starter / Business / AI Enterprise) | unknown | fieldassist.com/id/pricing [certain: no number published] |
| SimpliDOTS (Indonesia, "600+ distributors") | DMS + SFA for FMCG distributors | quote only | unknown | simplidots.com [certain: no number found] |
| Ivy Mobility | RTM/SFA, posts about "one of the leading tobacco companies" | quote only | unknown | ivymobility.com |
| Accurate Online (Sept) | accounting, not field sales | Rp 976.800 for 30 users | ~Rp 32.560 | Price Sheet |
| Badger Maps (Sept) | route planning only | ~Rp 28 juta for 30 users | ~Rp 930 ribu | Price Sheet |
The Indonesian competitors (SimpliDOTS, FieldAssist ID, Advotics) hide their prices - the only way to get them is a quote request, which needs his name and phone (he does it, not Claude).

### How big is a "big cigarette factory"
- Sampoerna sells and distributes through 106 zone branch offices, sales offices and distribution centres (sampoerna.com, "Sekilas Sampoerna") [certain, search snippet].
- Gudang Garam's distributor PT Surya Madistrindo: ~5,5K employees (LeadIQ, third party) [likely]; one branch document lists 132 staff incl. 60 salesmen (Scribd) [likely].
- So a big factory = hundreds of branches, thousands of salesmen. A flat monthly price cannot work; it has to be per user.

### The cost he has not priced: today's code cannot hold a big factory
From `2026-10-19_app-bugs-and-100-users-check.md` (row 1, NOT built): every phone downloads every salesman's last 7 days of sales, with the photo inside each sale. At 100 people that is ~Rp 21,8 juta/month on Blaze (Rp 434 ribu after both fixes). Because every phone pulls everyone's sales, the bill grows with users x users: 1.000 salesmen = 10x the people and ~100x the bill, ~Rp 2 miliar/month [likely - the 100-user model scaled quadratically, not measured]. After the fixes it grows in a straight line: ~Rp 4,3 juta/month at 1.000 [likely]. **The fix (own sales only + photos as files) and Blaze are a precondition for any big-factory price.**

### Draft price list (for discussion, NOT decided)
Unit = active field user (salesman / canvas / motorist) per month; office users cheaper.
| Package | Who | Price |
|---|---|---|
| Starter | up to 30 users, one small distributor | Rp 7,5 juta/month flat (he leaned Rp 10 juta in Sept) |
| Growth | 31-200 users | Rp 250 ribu per field user + Rp 100 ribu per office user, minimum Rp 10 juta/month |
| Enterprise (big factory) | 200+ users, many branches | Rp 200 ribu per field user, minimum Rp 50 juta/month, yearly contract paid up front, implementation Rp 100-250 juta, SLA (uptime promise) |
Worked example: 1.000 salesmen x Rp 200 ribu = Rp 200 juta/month (Rp 2,4 miliar/year). Same 1.000 users on Bizom Starter pricing = ~Rp 1,08 miliar/month, on Salesforce Retail Execution = ~Rp 1,8 miliar/month, so KPM would be ~5-9x cheaper than the foreign tools; how it sits against SimpliDOTS / FieldAssist is unknown until a quote.

### What a big factory asks for before it pays (pre-mortem: why the deal dies)
A registered company (PT/CV) and tax invoices with PPN; a written SLA and support hours; a security / data review and who owns the data; often a link to their SAP; a tender that takes months; and a single-person vendor is a key-person risk for them. Opportunity cost: a mid-size kretek factory, or ONE depot of a big factory's distributor, says yes faster and becomes the proof for the big ones.

## 2026-10-24 ~20:10 - his answer: first customer is a class 3 factory (Cello or Tawang)
His words: *"well im going to sell it to cello or maybe tawang which is class 3 cigarette factory, not super big company because this is my first app i dont know how this will go really right and fieldassist is out of indonesia so i would skip that i/ll try ask for simplidots but can u do your best research, u can use consensus for this to find the exact pricing for this kinda app"*. So the big-factory question is closed (B), FieldAssist is out, he asks SimpliDOTS himself.

### Indonesian prices that ARE public (read 2026-10-24 in the browser)
| Vendor | Package | Rp per user per month | Notes |
|---|---|---|---|
| Distri (distri.id/harga) | Track & Go / Basic / **Advanced** / **Pro** | 25.000 / 75.000 / **150.000** / **250.000** | min 5 users. Advanced = stock, consignment, returns, invoices + payment, **sales kanvas** - the closest match to KPM. Pro adds delivery, purchasing, route optimisation, CRM [certain, read] |
| SalesMania (salesmania.id) | 3 tiers | 25.000 / 50.000 / 75.000 | + one-time registration Rp 400.000 after trial [certain, read] |
| Bee Sales Order Mobile (bee.id/harga-som) | base package incl. accounting | Rp 340.700/month on a yearly plan, Rp 426.700 monthly (Gold); extra mobile licence Rp 80.000 (yearly) / Rp 100.000 (monthly) | the yearly plan is ~20% cheaper than monthly [certain, read] |
| Local SMB SFA (per MileApp's cost guide) | marketplace listings | from ~Rp 99.000 | guide also says one-time setup runs from "jutaan hingga ratusan juta"; a 10-20 rep team's first year is "puluhan juta" [likely - a vendor blog] |
| Bizom / Salesforce (foreign, above) | | ~1,08 juta / ~1,8 juta | out of reach for a class 3 factory |
SimpliDOTS: still quote-only - he asks.

### What the research papers say (Consensus, 20 papers) - `Raw/2026-10-24_consensus_sfa-pricing-evidence.md`, thread https://consensus.app/search/i-am-pricing-a-b2b-mobile-web-app-for-a-small-indo/vmQAL61nR429gpm1UQ0UCA/
- No paper publishes a real price for SFA / van sales / DMS software in Indonesia or similar markets - "the literature rarely publishes actual SFA/DMS SME price cards". The prices above are the only real numbers.
- Supported: a per-user subscription, tiers, a modest one-time onboarding fee, and penetration (lower intro) pricing for a first customer when market knowledge is thin.
- Indonesian SMEs' barriers are perceived cost and risk, lack of expertise, data security. Against a one-person vendor: strong onboarding, fast support and a clear implementation plan; one Malaysian study found dependency on the system mattered more than trust in the vendor.
- Benefits (real-time stock, fewer errors, leakage control via locked prices and reconciliation) are well supported but almost never as hard percentages - so the value argument is his own customer's numbers (stock on the road, a 1% leak), the Sept yardstick 3.

### What this means for "Rp 5 juta is too cheap"
At 25-30 users, the closest local match costs Rp 4,5 juta (Distri Advanced) to Rp 7,5 juta (Distri Pro) a month. The Sept Rp 5 juta (~Rp 167 ribu/user) sits inside the market, not under it. Rp 10 juta (~Rp 333 ribu/user) is above every local tier read today - reachable only if the extra is services the others do not give (on-site training, his own data loaded, features made for the factory, fast WhatsApp support).

### Our own cost at 30 users (scaled from the 2026-10-19 model)
Today's code (every phone downloads everyone's sales + photos): ~Rp 2 juta/month on Blaze at 30 users, and Spark cannot hold it (~11x the free daily reads) [likely - scaled users x users from the 100-user figure]. After the two fixes: ~Rp 130 ribu/month [likely]. So the fix is worth doing BEFORE Cello too: without it, a third of a Rp 6 juta price goes to Google.

### Draft for a class 3 factory (Cello / Tawang)
| | Price |
|---|---|
| Per active user (salesman, motorist, admin) | Rp 200.000 / month, minimum 10 users |
| 30 users | Rp 6 juta / month |
| Pilot, first 3 months (intro price) | half: Rp 100.000 / user (30 users = Rp 3 juta) |
| Yearly, paid up front | 2 months free (~17% off; Bee's yearly plan is ~20% off) |
| Setup, once (products + shops loaded, training, printer) | Rp 7,5 juta, half waived for a written testimonial + 2 referrals (Sept rule kept) |
Options put to him: A Rp 200 ribu/user (my pick) / B Rp 250 ribu/user (= Distri Pro) / C flat Rp 10 juta.

## Decision
- Fork: 2 (product company) - his "who pays for this app should be big company".
- First customer: a class 3 factory, Cello or Tawang (his 2026-10-24 ~20:10). Big-factory question closed.
- OPEN: price per user (A/B/C above) and Cello's user count split (field vs office).
- ANSWERED 2026-10-24: class 3 factory first; SimpliDOTS quote he asks himself; FieldAssist skipped (not in Indonesia).

Models applied: Chesterton's Fence (the September sheet exists for reasons - read it before replacing it), Opportunity Cost (each research hour comes out of this week's limited quota and the mission card build), Pre-mortem (why a big-factory deal dies), Second-Order Thinking (a per-user price on code whose cost grows users x users).

## REJECTED ON PURPOSE
- Redoing the September market numbers from scratch - they are on the price sheet; only what changed gets researched.

## 2026-10-24 ~20:10 - user count CONFIRMED: 20 salesmen + 5 office (25)
His words: *"yes around 20 salesman and 5 office"*. The options recomputed for 25 users:
| | Per month | Pilot (3 months, half) |
|---|---|---|
| A Rp 200 ribu/user (my pick) | Rp 5 juta | Rp 2,5 juta |
| B Rp 250 ribu/user | Rp 6,25 juta | Rp 3,125 juta |
| C flat | Rp 10 juta | - |
Leak check (Sept yardstick 3) holds at 20 field sales: ~20 x Rp 30 juta = Rp 600 juta of stock on the road, a 1% leak = Rp 6 juta/month, above A and B [likely - the Rp 30 juta per salesman is the Sept estimate]. Our Firebase cost at 25 users: ~Rp 1,4 juta/month with today's code, ~Rp 110 ribu after the fix [likely, scaled]. Price pick still OPEN.
