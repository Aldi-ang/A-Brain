---
title: KPM vs Distri - features, look, safety, ease, savings, price
description: Head-to-head with Distri (distri.id), the closest Indonesian van-selling app, for Cello's 25 people. Every Distri claim carries its URL or a confidence tag. Ranked list of what KPM must fix to earn Rp 400 ribu per person.
type: brainstorm
created: 2026-10-28
tags: [competitor, distri, pricing, cello, sfa]
---

# 2026-10-28 - KPM vs Distri

Research only, no app code touched. Written 08:47 WIB.
Board (the picture he reads): https://claude.ai/artifact/DsChMVhYN8JZjcSQ6Cb1X1
Context: [[2026-10-24_pricing-and-b2b-engineering-business]], [[2026-10-28_seat-limit-and-simplidots-gaps]],
`Raw/2026-10-27_simplidots-company-profile.md`.

## The problem, in his words
*"i just think that 400k per people is cheap enough isnt? well if u want to compare our stuff with distri make sure that
our features and their features is being compared, so its not just the price, its the UI the safety the ergonomics,
features and how effective and efficient the app would be , cello does sell from distributor also and they have their
own salesman as well"* (2026-10-28 08:30).

## Sources read 2026-10-28 (built-in browser)
- https://distri.id/harga - plans, prices, FAQ
- https://distri.id/fitur - tech specs: Android app + web portal, offline "hybrid", AWS, ISO/IEC 27001, Accurate add-on
- https://distri.id/fitur/canvassing, /tracking-salesman, /aplikasi-penjualan, /aplikasi-inventori, /faktur-pembayaran,
  /pengiriman-retur, /analisis-bisnis
- https://distri.id/tentang - PT Distri Digital Indonesia, a product of Advotics (PT Advotics Teknologi Global)
- https://play.google.com/store/apps/details?id=com.advotics.distri - 4,1 from 58 reviews, 5 rb+ installs, updated 7 Okt 2026
- NOT read: their YouTube channel (would not load in the pane). Distri app NOT tried (needs an account; not made).

Tags: [certain] = read on that URL (their own claim, not audited) · [likely] · [guessing].

## What each Distri plan really includes (all from distri.id/harga [certain] unless tagged)
Per person per month, minimum 5 people, cheaper yearly via sales, no server/setup fee.
| Plan | Price | Adds |
|---|---|---|
| Free (NEW since 2026-10-24) | Rp 0 | web only: sales, stock, delivery management, basic |
| Track & Go | Rp 25 rb | live tracking, visit reports + photos, anti-fraud visits (check-in only inside the shop radius, /fitur/tracking-salesman), PJP route plan, ready staff reports |
| Basic | Rp 75 rb | anti-fraud sales, shop stock + price survey, assets, service tickets, KPI management |
| Advanced | Rp 150 rb | promo + discount rules, stock, consignment, returns, invoices + payment, **sales kanvas**. Button is "Hubungi Kami" (sales call), not sign-up |
| Pro | Rp 250 rb | delivery management (photo + e-signature), purchasing, route optimisation, CRM |
| 22 add-ons | quote only | e.g. Accurate link, Route Management System, Geo Analytics, Credit Note, Leads |

## The comparison
| Topic | KPM | Distri | Verdict |
|---|---|---|---|
| Features | Bal/Slop/Bks math (1 Karton = 400 Bks) [lab]; pita cukai counted at EOD [code]; promo goods from van or Master Vault [lab]; EOD hand-in per van, missing stock = fine [lab]; IOU + overdue [code]; returns + consignment [lab/code]; day route + live map [lab]; roles + region locks in the DB [code]; offline [code]; any phone incl. iPhone (web app) [code]. MISSING: e-faktur/Accurate, salesman targets, factory view of distributors, fake-GPS check, delivery signature | offline hybrid [certain /fitur]; stock per canvasser, cash/COD at sale [certain /fitur/canvassing]; generic units "Unit"/"Box" [likely, Play Store screenshot]; no pita cukai anywhere [likely]; invoices + e-faktur + due-date alerts [certain /fitur/faktur-pembayaran]; 50+ reports, KPI from Basic [certain /fitur/analisis-bisnis]; multi-warehouse + reorder suggestion [certain /fitur/aplikasi-inventori]; Android + web only [certain /fitur]; "prinsipal per area" pitch [certain], depth unknown [guessing] | split: Distri wider (office), KPM deeper (kretek van day) |
| Look | dark + gold, game-like, stock + price on the product card [lab]; English game words: "Search wares", "Manifest", "Pay bounty", "Command Center" [lab] | green/white business forms, shop-cart ordering ("Tambahkan ke keranjang"), all Indonesian [certain, Play Store screenshots] | KPM stands out; Distri easier on day one |
| Safety | DB rules per role + region [code]; lock a lost phone's login [code]; seat limit in build; no certificate, no data sheet | ISO/IEC 27001, AWS, encryption, backup [certain /tentang]; radius check-in [certain]; Play Store: encrypted in transit, deletion on request [certain]; role detail not public [guessing] | Distri on paper |
| Easy to use (one sale) | 8 taps, no typing: customer bar, shop, +, open list, cash, photo (2), done. First 4 tapped in the lab [certain], last 4 read off the screen [likely]. Shop price fills itself [lab]. GPS + photo required. Lite mode exists. Not timed on a cheap phone | ~7 taps + typing the amount [guessing, from Play Store pictures]. Reviews: "boros batrai, login mengganggu buang2 waktu pakai foto" (28 Apr 2026, 1 star), "Males banyak eror" (14 Jul 2026, 1 star), "tidak fast Respon tim nya" (8 Sep 2023, 1 star) [certain, Play Store]. Four 5-star reviews dated 14 Mar 2025 [certain] - same day, looks seeded [guessing] | KPM likely; must prove on a cheap phone |
| Saves each day | field: unit math, evening hand-in with fines, promo goods tracked [lab] | office: one order -> invoice + stock + delivery job + report "tanpa input ulang" [certain distri.id/]; Accurate sync add-on [certain] | split; Cello is 20 field + 5 office |
| Price, 25 people/month | Rp 10 jt (Rp 400 rb) | Track & Go 0,625 jt / Basic 1,875 jt / Advanced 3,75 jt / Pro 6,25 jt | KPM +Rp 45 jt/yr vs Pro, +Rp 75 jt/yr vs Advanced |

## What it means
Rp 400 rb is the top of the market, 1,6x Distri Pro. It holds only as a factory package (his setup, data loaded, training,
WhatsApp support, features on request) AND only if the gaps that Distri sells cheaply are closed. Three of the seven gaps
below are things Distri sells at Rp 25-150 rb; missing them at Rp 400 rb is the hard sentence in a pitch.
Cello sells through distributors AND own salesmen -> the factory view is what turns KPM from a salesman app into a factory
system, and it opens upside: each distributor's salesmen become seats.

## Where KPM must improve to deserve Rp 400 ribu (ranked by money at stake)
1. **Indonesian words on the salesman screens** - the whole Rp 10 jt rides on 20 salesmen using it daily. Language switch
   is already planned (new labels English, his 2026-09-29 call); this ranks it first for Cello.
2. **One-page safety sheet** - signing at all. ~1 day, no code. Who sees what, where data lives, backups, data belongs to
   Cello, export. Distri answers with ISO 27001.
3. **Factory view of its distributors** - Rp 3,75 jt/month (gap to Pro) + upside seats.
4. **Office invoices: e-faktur number + Excel/Accurate export** - Distri from Rp 150 rb.
5. **Salesman target + effective call** - Distri from Rp 75 rb. Data already in KPM (route visits + sales).
6. **Fake-GPS check on visits** - Distri from Rp 25 rb. KPM needs GPS + photo, no mock-location check found [likely, grep 0].
7. **Prove speed on a cheap phone** - time first open + one sale on a Rp 1,5 jt Android, Lite on.

Already better (pitch lines): Bal/Slop/Bks math, pita cukai at EOD, evening hand-in with fines, promo goods from van or
vault, per-shop price fills itself, iPhone too, the maker answers WhatsApp himself (vs Distri's 1-star "tidak fast respon").

## Decision
OPEN - waiting on Aldi: which of the 7 to build, in what order, after the seat limit (the current ONE job).
My pick: 2 first (a day, no code, unblocks signing), then 1, then design 3.

## Rejected on purpose
- Cutting KPM to Distri's per-seat price - he set Rp 400 rb (2026-10-28); the answer is the package, not the number.
- Delivery with e-signature / route optimisation (Distri Pro) - Cello's salesmen sell from the van; no delivery leg.
- Matching "50+ reports" - build the 2-3 reports Cello asks for (target, effective call), not a count.
- An ISO 27001 certificate now - months and a large fee [guessing]; a one-page safety sheet answers the first review.
- Making a Distri account to test their app - not done (accounts are his to make); tap count for Distri stays [guessing].

## Could not check
Distri hands-on (needs account) · their YouTube demos · KPM sale taps 5-8 (read, not tapped) · KPM speed on a cheap phone.

Models applied: Inversion (how Cello says no: salesmen reject the English screens, the data review finds no paper, the
office still retypes - each became a ranked fix), Opportunity Cost (Rp 45 jt/yr above Pro is what the package must buy),
Second-Order Thinking (the factory view also makes distributors' salesmen into paid seats).
