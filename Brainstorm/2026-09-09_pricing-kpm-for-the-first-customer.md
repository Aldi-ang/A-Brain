---
title: Pricing KPM — the first customer, the monthly rate, and how to sell it after him
description: What KPM should cost in Indonesia, what it actually costs to run, how the market prices comparable software here and abroad, and the selling strategy — options laid out, decision still Aldi's.
type: brainstorm
created: 2026-09-09
updated: 2026-09-09
confidence: medium
checked: 2026-09-09
status: OPEN — waiting on Aldi
tags: [kpm, pricing, business, indonesia, saas, strategy]
---

# Pricing KPM — the first customer and everything after him

## The problem, in his words

> *"how should i price this level of app that im working right now for the company tho and how much
> monthly maintenance that needed for this app or maybe if i charge the app for the company by
> paying monthly then what is the most fair price for this app, i will be selling this app to my mom
> uncle that have tobacco factory company"* … *"is there a better way to sell this to other company"*
> … *"what is the price level for this with all the AI going on in the world right now"*

⚠️ **Correction on file:** Aldi is **24**, not 14 — he said so directly on 2026-09-09. Earlier notes
and the memory file said 14 and were wrong. This matters here: at 24 he can sign contracts, register
a legal entity, and invoice a factory himself. Nothing in this note needs a guardian.

## What it costs to RUN — the floor, which is very low

| line | monthly, one company, ~10–30 users |
|---|---|
| Firestore reads/writes (real-time listeners, a few thousand transactions) | **Rp 30k–200k** |
| Storage + egress for sale-proof photos (~40KB each after the 600px/q0.6 compression) | **Rp 15k–80k** |
| Hosting (Firebase free tier covers this size) | **Rp 0** |
| Domain, amortised | **~Rp 20k** |
| **Infrastructure total** | **≈ Rp 100k–400k / month** |

**The price is not about this.** Infrastructure is under 10% of any sane price. What is being sold is
the money the app stops leaking, plus the guarantee that somebody fixes it when it breaks.

Confidence: medium. These are estimates from Firebase's published rates against a guess at load, not
a measured bill. **The first month on a real company's data settles it — read the actual Firebase
invoice before quoting a second customer.**

## What the market charges — MEASURED, 2026-09-09

### Indonesia

| product | what it is | price |
|---|---|---|
| **Accurate Online** — Paket Dasar | the default SMB accounting package in Indonesia | **Rp 333.000/bulan**, *1 user*, PPN included |
| Accurate — extra back-office user | | **Rp 22.200/user/bulan** |
| Accurate — Multi Branch/Cabang | per-branch performance + per-branch access rights | **Rp 99.900/bulan** |
| Accurate — POS add-on | | **Rp 222.000/bulan** |
| Accurate — Manufaktur add-on | | **Rp 2.220.000/bulan** |
| **Mekari Jurnal** — Essentials | accounting + supply chain, multi-warehouse, approval flows | **Rp 399.000/bulan** list (Rp 359.100 promo, annual) |
| Mekari Jurnal — Plus | + BOM, work orders, multi-currency | **Rp 899.000/bulan** list (Rp 629.300 promo) |
| Mekari Jurnal — ERP | full supply chain, batch/serial, custom reports | quote only |

Read the shape, not just the numbers: **Indonesian SMB software is priced per COMPANY with cheap
extra seats**, not per seat. Accurate's marginal user is Rp 22.200. A per-seat pitch will feel wrong
to an Indonesian buyer and invite a fight over headcount.

### Abroad

| product | what it is | price |
|---|---|---|
| **Badger Maps** — Business | field-sales routing, visit logging, CRM sync | **$58/user/month** annual · $69 monthly |
| Badger Maps — Enterprise | | **$95/user/month** annual · $109 monthly |
| **Repsly** (Core/Grow/Scale/Flex) | retail execution for CPG brands — the closest Western category to KPM | **quote only, no public price** |
| **Skynamo** | B2B field sales for wholesalers/distributors/manufacturers — closest of all | **quote only** |

Two things follow. First, **the direct Western comparables hide their prices**, which is what
vendors do when the number would scare an SMB — these are enterprise deals. Second, where a price IS
public, field-sales software is **$58–95 per user per month**. Indonesia runs at roughly **a quarter
to a third** of US pricing for the same category, which puts the honest Indonesian equivalent at
**Rp 150.000–300.000 per field user per month** — and that estimate is [likely], derived from the
ratio, not scraped.

## The options for the uncle

| # | shape | number | what it costs him | what it costs Aldi |
|---|---|---|---|---|
| A | **Free, family favour** | Rp 0 | nothing | everything — no obligation means no feedback, no testimonial, no case study, and unlimited "just one more thing". **The most expensive option on this table.** |
| B | **Cost-recovery only** | Rp 500k/mo | trivial | covers Firebase, pays nothing for his time; sets an anchor that is nearly impossible to raise later |
| C | **Pilot that steps up** ⭐ | **Rp 1 juta/mo for 6 months → Rp 2,5 juta/mo**, setup Rp 5 juta waived in exchange for a written testimonial + 2 referrals | less than one admin salary | real money, real obligation on both sides, and the step-up is agreed in writing BEFORE goodwill is spent |
| D | **Market rate immediately** | Rp 2,5–4 juta/mo flat, up to 20 users; setup Rp 5–15 juta | still under one admin salary | correct for a finished product; KPM is still throwing day-one bugs, so it invites a refund conversation |
| E | **Per-seat** | Rp 200k × field users, min 5 | scales with his team | fights Indonesian buying habit (see Accurate's Rp 22.200 marginal seat); creates an incentive to under-count staff, which corrupts the roster the app depends on |

**Recommended: C.** The step-up is the whole point — it converts a family favour into a commercial
relationship on a date both sides agreed to in advance, instead of an awkward conversation later.

**The setup fee is not optional and should be charged or explicitly waived in writing.** Data
migration, training and branding are real work; a fee that is silently skipped is read as "this had
no cost", which is the belief that makes the monthly fee negotiable forever.

## Maintenance — what it actually takes

The industry rule of thumb is **15–20% of build cost per year**. That is the wrong frame here,
because KPM's build cost was Aldi's time plus an AI subscription, not a payroll.

The right frame is capacity:

| | per live company, per month |
|---|---|
| bug fixes + support + one small feature | **4–10 hours** |
| Firebase | Rp 100k–400k |
| AI tooling attributable to this work | Rp 300k–500k |
| **out-of-pocket** | **≈ Rp 500k–900k** |

> **Price so that ONE customer covers every tool you pay for. The second customer is profit.**

At Rp 2,5 juta/month, customer #1 covers all tooling with room over. That is the test to apply, not a
percentage.

⚠️ **The real maintenance risk is not money, it is that Aldi is the only person who can run this.**
A factory that puts its stock ledger on KPM is betting on one person staying reachable. Either price
that in (a higher rate covers a real response commitment), or cap it honestly in the contract:
response within X working days, no 24/7 promise. A promise that cannot be kept is worse than a
narrow one.

## What KPM has that the comparables do not

Ranked by how hard it would be for Accurate, Jurnal, Repsly or Skynamo to copy.

1. **Titip (consignment) as a first-class money concept.** Revenue is recognised when the store
   audit finds the goods sold, not when they are placed; the placement books a receivable —
   `src/utils/revenueRule.js`. **No Western product models titip at all**, and the Indonesian
   accounting products treat it as a journal entry rather than a field workflow. This is the moat.
2. **Tobacco units native** — Bal / Slop / Bks conversions everywhere, including on the printed nota.
3. **A geofence on the SALE, with a bypass request that carries photo proof and goes to an approval
   queue.** Repsly and Badger track where a rep was. KPM refuses the sale and makes the exception
   auditable.
4. **An owner-editable permission matrix across six tiers.** Almost every SMB product ships fixed
   roles. Aldi's buyer can re-cut authority without calling anyone.
5. **POV tier preview** — the owner wears any tier's screen instantly, without logging out. Not
   present in any comparable product found.
6. **Live-camera-enforced sale proof, switchable per tier from that same matrix** (`284ea64`,
   `1857b97`). Photo capture is common; *"this tier may not choose from the gallery"* is not.
7. **Offline-first with retry-safe sync** — a part-committed sync does not re-send sales that landed.
8. **EOD setoran reconciliation** with a printed audit receipt, and **dual warehouse** (Master Vault
   + per-branch) with per-vehicle canvas load/reconcile.

**The positioning sentence:**

> *Accurate tells you what happened last month. Repsly costs sixty dollars a head and has never
> heard of titip. KPM runs the van, the titip and the setoran in the words your salesmen already
> use.*

## How to sell it after the uncle

1. **Lead with the leak, never with the software.** The opening line is *"how much titip is out
   there right now, and who counted it?"* — not *"I built an inventory app"*. Every distributor in
   the tobacco trade knows that number is wrong and most cannot say by how much.
2. **The uncle is a design partner, not customer #1.** What to collect from him is worth more than
   his money: a written testimonial, permission to name the company, real usage numbers, and **two
   referrals inside the cluster**.
3. **Sell into a cluster, not a map.** Indonesian tobacco distribution is dense and social — Kudus,
   Solo, Malang. One reference in a cluster sells the next five. A scattered national push does not.
4. **Price per company with cheap seats**, following Accurate's shape, because that is the shape
   local buyers already understand.
5. **Annual prepay at ~2 months' discount.** Fixes his cash flow and their budgeting at once.
6. **Never build a custom feature for free.** Charge for it, or say no. The first free one sets the
   rate for all of them.
7. **Get an entity and a real invoice.** A factory's finance department cannot pay a person cleanly.
   A CV or PT Perorangan is cheap in Indonesia and makes him payable. *(Tax specifics — PKP
   registration, PPN threshold — are [likely] and must be confirmed with a local accountant, not
   taken from this note.)*
8. **Put the bus factor in the contract**, not in the conversation: what happens if he stops, who
   owns the data (them), who owns the code (him), what the response time actually is.

## The AI question

Two forces, pulling opposite ways:

- **Down:** building software got cheap, buyers know it, and *"you made this with AI"* will be used
  as a reason to ask for a discount.
- **Up:** nobody is paying for typing. They are paying for a domain model that is correct on day one
  and a person who fixes it on day two. AI did not supply the titip rule, the tier matrix, or the
  knowledge that a completed sale is a closed contract. **Those came from Aldi's understanding of
  his own family's trade, and that is the scarce part.**

**Say the AI part out loud.** It is discoverable, and hiding it costs more than admitting it. The
honest and accurate line is *"I built it, using AI tools"* — the same relationship as an architect
and a contractor. He made every product decision, found every bug by using the app, and owns the
domain knowledge. That is authorship.

## DECISION: OPEN — waiting on Aldi

- Which option (A–E) for the uncle, and does the step-up date go in writing?
- Is the setup fee charged or explicitly traded for a testimonial + referrals?
- What response-time commitment is he actually willing to keep?

## REJECTED ON PURPOSE — do not re-propose

- **Free for family (A).** Rejected because it costs the most: no obligation, no feedback loop, no
  testimonial, and unbounded scope creep. Flips only if the uncle is explicitly a test lab and Aldi
  wants zero commitment in return.
- **Pure per-seat pricing (E).** Rejected because it fights the local buying norm and gives the
  buyer a reason to under-report headcount — which corrupts the roster the whole app runs on.
  Flips if a buyer's team is large and genuinely wants to pay for growth.
- **Undercutting on price because it was AI-built.** Rejected: the price is for the outcome and the
  maintenance, not for the hours. Flips never.
- **A 24/7 uptime or response promise.** Rejected while this is one person. Flips when there is a
  second person who can deploy.

## Related

- [[A sale is a closed contract — no cash goes back]] — the titip/retur money model that is the moat
- [[capture=environment Is a Request, Not a Lock]] — the tier-switchable proof-photo rule (feature #6)
- [[Terminal Tenant Path Split]] — the multi-tenant architecture that makes a second customer possible
