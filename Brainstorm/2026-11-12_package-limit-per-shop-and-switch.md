---
title: Package (Paket) limit per shop, who may take it, and an on/off switch
date: 2026-11-12
status: OPEN — waiting on Aldi (4 questions, see the bottom)
related: "[[2026-11-11_full-redesign-sales-terminal-directions]]"
---

# Package limit per shop, eligibility, and an on/off switch

## The problem, in his words (2026-11-12)

> *"bundle should be limited to per store, old store, new store cant do that  and ecer cant do that only retail and whosales who are registered who can do that, and this bundle limit example was, for muntilan regional team, the bundle is special 1 tawang slop u get 1 lighter for example and each stores can only buy 1 bundle, so buying 2 bundle is not possible hence 2 slop doesnt mean 2 lighter but this is just one example of the limitation for each bundle, what do u think about this, will this be efficient and effective and also does sales have no way to play with the system to for their own gain from this system?, regarding the bundl/paket i think there should be on and off toggle button but tier 3 and above as default to activate bundle or off that bundle to be used in the future when sales dropped"*

Earlier the same day he asked for *"limit option on the promo as well manageable by tier 3 and above on default"* and then corrected: *"what i meant before was not promo but paket"*.

So three things, per package: a limit **per shop**, a rule for **which shops** may take it (registered, Retail or Grosir, never Ecer), and an **on/off switch** (tier 3 and above by default).

## What the code does today (checked 2026-11-12, kpm 6257a8df)

| Fact | Where |
|---|---|
| A package is added by a press; nothing counts how many a shop has taken | `MerchantSalesView.jsx` `applyBundle` |
| A saved sale keeps which packages were used, as `offers` | `MerchantSalesView.jsx` (the `offers:` line) |
| Any salesman with promo pieces in the van can give them by hand, with no package, even on an empty cart | `canGive = !isReturMode && promoVan.length > 0` |
| A shop becomes Grosir only after a boss confirms the request; a new shop starts as Retail with nobody confirming | `CustomerManager.jsx` (`requestedTier`, `was?.priceTier \|\| 'Retail'`) |
| The package price already has a permission key, default T1-T3 | `permissions.js` `set_bundle_price` |

## How a salesman could beat a per-shop limit (Inversion)

| # | The trick | Why it works today | What closes it |
|---|---|---|---|
| 1 | Give the lighter by hand from "Promo · gratis" | hand-giving is not tied to any package | mark a promo item **package only**: it cannot be given by hand |
| 2 | Register the same shop again under a new name | a new shop is Retail at once, no boss in the loop | the package only for shops a boss has confirmed, or shops with an earlier paid sale |
| 3 | Two phones, or one phone with no signal | the limit would be checked on the phone from data it already has | a **claim ticket** in the database: one record per shop per package, and the database refuses a second one |
| 4 | Sell the package, then return the cigarettes | the shop keeps the lighter and the limit could reopen | a return never gives the claim back |
| 5 | Record the package on shop B, hand the goods to shop A | the app trusts the chosen shop | already narrowed by the hand-over photo and the GPS gate; not closed, and not closable in the app |

## Options for where the limit is enforced

| Option | What it buys | What it costs |
|---|---|---|
| A. Phone only (count past `offers` for that shop) | no rule change, quick | beaten by trick 3; "UI says yes" with nothing behind it |
| B. Phone check + claim ticket in the database (recommended) | cannot be beaten by going offline or by a second phone; the phone still explains the refusal | one new Firestore rule that Aldi publishes himself; one more small write per package sale |
| C. Boss approves each package sale | strongest | slows every sale, needs a boss online; defeats the point of a field promo |

## Decision

**OPEN — waiting on Aldi.** Asked 2026-11-12:

1. "old store, new store cant do that" - does a shop registered today wait before it can take a package, or does only the price tier matter?
2. Is the limit forever for that package, or does it start again each month?
3. Should a promo item that belongs to a package be blocked from hand-giving?
4. May the database get the claim ticket rule (he publishes it in the Console)?

The switch (on/off, T3 and above by default, a key in the permission table beside `set_bundle_price`) needs no answer and is agreed.

## Rejected on purpose

- **A limit per deal** (my first recommendation, before he explained): it does not stop a second sale to the same shop an hour later. His per-shop rule is the right one.
- **Phone-only enforcement (A)** as the final form: it is the UI-Says-Yes-Server-Says-No pattern this project has paid for before.
- **Boss approval per sale (C)**: flips only if a package ever carries something expensive enough that one wrong give matters more than the lost speed.

Models applied: Inversion (the table of tricks), Second-Order Thinking (a per-shop limit makes registering shops valuable, so registration becomes the weak point), Reversibility Test (a claim ticket is written once and is hard to take back - which is the point, but a "reset" for T3 must be designed with it).
