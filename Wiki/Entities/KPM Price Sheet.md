---
title: KPM Price Sheet
description: The one canonical page of numbers — what KPM costs to run, what it is sold for, the licence and copyright figures, and the tax position. Reasoning lives in the Brainstorm notes; this page is the answer.
type: entity
created: 2026-09-10
updated: 2026-09-10
confidence: medium
checked: 2026-09-10
status: ACTIVE — applies to a 25-30 user customer. Count still unconfirmed.
tags: [kpm, pricing, business, indonesia, canonical]
---

# KPM Price Sheet

**This page is the answer. Do not re-derive prices from the Brainstorm notes** — those hold the
reasoning and several superseded figures, and reading them for a number is how the wrong one gets
quoted.

> ⚠️ **Every figure here hangs on one unconfirmed number.** The user count moved three times on
> 2026-09-10: 10-30 → 50-100 → **25-30**. The last is applied. **Confirm it once more before quoting
> anything to a customer**, and get the split — how many are field sales carrying stock, how many are
> office staff who only read reports.

---

## Cost to run — one customer, 25-30 users

| line | per month |
|---|---|
| Firebase (reads, writes, sale-proof photos) | Rp 250-500 ribu |
| AI tooling attributable to this work | Rp 300-500 ribu |
| Support, 8-15 hours @ Rp 100 ribu/hour | Rp 800 ribu - 1,5 juta |
| **Break-even** | **≈ Rp 2 juta/bulan** |

[guessing] on the Firebase line — derived from published rates against an estimated load, never read
off an invoice. **The first month on a real company's data settles it.** Read the actual bill before
quoting a second customer.

## Subscription — the number to say

| | |
|---|---|
| **Pilot, 3-6 months, whole team** | **Rp 2,5 juta/bulan** |
| **After the pilot, up to 30 users** | **Rp 5 juta/bulan** |
| User 31 and above | Rp 150 ribu/orang/bulan |
| Implementation (data migration + training 30 people) | **Rp 7,5 juta**, half waived for a written testimonial + 2 referrals |
| **Floor — below this he pays to work** | **Rp 2 juta/bulan** |

**The pilot is bounded by TIME, not by headcount.** At 25-30 people one branch is nearly the whole
company, so there is no small slice to pilot on — everyone is on it from day one and nothing absorbs
the first mistake. **That is why the day-one bugs must be fixed before the pilot opens.**

**The implementation fee is charged or waived in writing. Never silently skipped** — a fee that is
quietly dropped is read as "this had no cost", and that belief makes the monthly fee negotiable
forever.

## Why Rp 5 juta is fair — four independent yardsticks

One justification can be invented. Four that stop in the same place cannot.

| | |
|---|---|
| **① Cost** | Running cost Rp 2 juta. Rp 5 juta is 2,5×. Pays for the time, leaves a margin, not extortionate. |
| **② Market** | Accurate Online at 30 users = Rp 333.000 + 29 × Rp 22.200 = **Rp 976.800** — but it cannot do titip, does not know where a salesman is, does not print a nota on a motorbike. Badger Maps at 30 users ≈ **Rp 28 juta**. Indonesian equivalent Rp 4,5-9 juta. Rp 5 juta sits inside it, near the floor. |
| **③ Leak** | ~20-25 field sales × ~Rp 30 juta = **Rp 600-750 juta on the road**. A 1% leak is **Rp 6-7,5 juta/month**. The price is below the leak. |
| **④ Salary** | ≈ one admin's wage — and an admin cannot recount stock that is moving on the road, or know a sale happened at the right shop. |

⚠️ **Yardstick ③ is the one that breaks if the split is wrong.** At 12 field sales instead of 25, the
stock on the road is ~Rp 360 juta, a 1% leak is Rp 3,6 juta — **below the price** — and the argument
has to shift to ② and ④.

## Perpetual licence — offered to be refused

| | |
|---|---|
| Licence, one payment | **Rp 250 juta** |
| Annual maintenance, 20% of licence | **Rp 50 juta/tahun** |

Copyright stays with Aldi and he keeps the right to license other factories. **This is not a
copyright sale.**

**Say plainly that it is worse for the buyer:**

| | 5 years |
|---|---|
| Subscription Rp 5 juta × 60 months | **Rp 300 juta** |
| Perpetual Rp 250 juta + 5 × Rp 50 juta | **Rp 500 juta** |

It only wins if the buyer drops maintenance, and without maintenance the app breaks itself in about
two years — Firebase, Chrome and Android change without waiting for anyone.

**And the free counter, which kills the objection entirely:** Pasal 9 escrow already gives the
customer the code if Aldi stops for 90 days or dies. **They do not need to buy Rp 250 juta of
insurance they already have in the contract.** Lead with this rather than waiting to be asked.

## Copyright sale — **not for sale.** Corrected 2026-09-10.

**The Rp 5 miliar figure is withdrawn.** Aldi challenged it — *"is 5 milliar reasonable that amount
is crazy work"* — and he was right. Three things were wrong with it, and the first is an arithmetic
error of mine:

1. **The arithmetic.** It read *"ten factories over five years at Rp 15 juta/month is Rp 900 juta a
   year forgone"*. Ten × Rp 15 juta × 12 is **Rp 1,8 miliar** a year, not Rp 900 juta.
2. **The rate was already stale when it was written.** Rp 15 juta was the 100-user price, superseded
   the same day. At 25-30 users the figure is Rp 5 juta, so ten factories is Rp 600 juta a year.
3. **It beat its own ceiling, and this is the real flaw.** KPM's replacement cost is quoted at
   **Rp 1,4 miliar**. A copyright price of Rp 5 miliar is **3,5× the cost of building the whole
   thing from scratch** — so it stops being a polite refusal and starts telling the buyer to go hire
   a developer instead. **Nobody pays more for a copyright than for a clean rebuild.** Rebuild cost
   is the ceiling on any IP price, always.

**So: say it is not for sale, and give the reason in one sentence.** A price implies willingness, a
number that absurd invites haggling, and inside a family it reads as contempt.

> *"Hak ciptanya tidak saya jual. Kalau dijual, saya tidak boleh lagi menawarkan ini ke pabrik lain
> selamanya — jadi yang Om beli bukan aplikasinya, tapi seluruh usaha saya. Dan yang Om sebenarnya
> butuhkan sudah ada gratis di Pasal 9."*

**If someone genuinely pushes with real money**, the defensible ceiling is rebuild cost plus a
premium for it already working, already debugged, and available now instead of in a year:
**Rp 2-3 miliar**. Not five. Note that at that price it is no longer a refusal — a real buyer could
pay it — so only name it if the answer would actually be yes.

Legal hook: **UU 28/2014 Pasal 82 ayat (3)** forbids a licence agreement being used to remove or take
over all of the creator's rights. A full transfer needs its own assignment deed, never a clause
smuggled into a licence.

## Tax position at these numbers

Rp 5 juta × 12 = **Rp 60 juta/tahun**.

| | |
|---|---|
| UMKM ceiling | Rp 4,8 miliar/tahun — he is at 1,25% of it |
| Orang pribadi, first Rp 500 juta of turnover | **exempt from the 0,5% final PPh** [likely] |
| **Final PPh at these numbers, as orang pribadi** | **Rp 0** |
| Same, as PT Perorangan (no Rp 500 juta facility for a badan) | Rp 300.000/tahun |
| PKP / PPN registration | not required below Rp 4,8 miliar. **Do not register voluntarily.** |

**The entity decision is about liability, not tax** — the difference is Rp 300 ribu a year. Details
and the Surat Keterangan mechanism: [[2026-09-10_riset-hukum-menjual-kpm]].

## Rules that do not change with the number

1. **Never answer a price question with your own costs.** The moment the sentence is *"the server
   costs X"*, the price becomes cost-plus-margin and margin is always negotiable.
2. **Go quiet after saying a number.** Rushing to justify a price sounds like knowing it is too high.
3. **If pushed, cut scope, not price.** Dropping the number means dropping the user band. That is
   changing package, not caving.
4. **Never build a custom feature free to close a deal.** The first free one sets the rate for all of
   them.
5. **Price last.** Ask → show → price, and only when asked.

## Still open

- **Confirm the user count, and split it** — field sales vs office. Yardstick ③ depends on it.
- Pilot 3 months or 6?
- Implementation fee charged, or half waived for testimonial + 2 referrals?
- How many support hours a month can actually be sustained? That decides whether Rp 5 juta holds.

## Related

- [[2026-09-10_pricing-revisi-50-100-user]] — the reasoning, the market comps, and the **answer script for "why this price"**. Its middle section still carries superseded 100-user tables; the top banner is what applies.
- [[2026-09-09_pricing-kpm-for-the-first-customer]] — the original measured comps, superseded in part
- [[2026-09-10_riset-hukum-menjual-kpm]] — tax, entity, copyright, liability, escrow
- [[2026-09-10_draft-13-pasal-kontrak-kpm]] — Pasal 6 is filled from this page
