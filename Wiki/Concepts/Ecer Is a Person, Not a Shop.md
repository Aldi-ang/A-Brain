---
title: Ecer Is a Person, Not a Shop
description: Aldi's tier design - Ecer is an individual who never registers, Retail and Grosir are stores. Selling Ecer on consignment creates a debtor who cannot exist, which is what broke the store hand-off.
type: concept
created: 2026-09-08
updated: 2026-09-08
confidence: high
checked: 2026-09-08
tags: [design, money, consignment, kpm]
---

# Ecer Is a Person, Not a Shop

**His design, stated 2026-09-08 while explaining a bug that looked like a hand-off failure:**

> *"this transaction is actually bought in ecer and as u know all sales bought in ecer means that
> it is an individual and not a store, well i design the app like that, so since ecer didnt need
> registration it doesnt appear as stores and then its confuse the app. so here how its done, ecer
> price should be bought by individual and they can only pay in cash qris or transfer, consignment
> is only for registered stores"*

Three price tiers ship: **Ecer** (an individual, never registered), **Retail** and **Grosir** (both
stores). The tier is per cart line, not per sale.

## Why it was a money bug and not a preference

An Ecer line sold on Titip books a receivable against somebody who has no customer document and
never will. The consequences chain outward, and none of them look like a sale bug:

1. `ConsignmentFinanceView`'s `customerData` is folded from TRANSACTIONS, so the person's name
   appears in Active Consignments as though it were a shop, holding a balance —
   see [[A Store Name Is Not a Store]].
2. That fake shop can be selected for a store hand-off.
3. Approving the hand-off looks for a customer document to move ownership on, finds none, and —
   before `cdaabc7` — had already written `status: 'APPROVED'`. The store never moved, the receiver
   never got it, and the approver had no history entry.

Aldi found it at step 3 and reported it as a hand-off bug. It was a sale bug three steps upstream.
**The report names where the symptom surfaced, never where the rule was broken.**

## What ships

- `967e447` — Titip is refused on any cart holding an Ecer line, in `processTransaction` before the
  first write, and the terminal drops Consignment from the payment menu with a line saying why.
- `83f5041` — Titip requires a customer document that is not a `WALK_IN`. Registering the shop
  during that same sale is exempt, because that path creates the record as it goes.

## The trap inside "strict", and it is the part worth remembering

He answered *"make it strict"*. The obvious encoding is `status === 'NOO_ACTIVE'`. **That would
have been a far worse bug than the one being fixed.**

| Status | Written by |
|---|---|
| `APPROVED` | registry screen, admin adds the shop (`CustomerManager.jsx:1071`) |
| `PENDING` | registry screen, field agent adds it (`:987`) |
| `NOO_ACTIVE` | sale engine, proper in-sale registration |
| `WALK_IN` | sale engine, quick form during a sale |
| *(absent)* | every shop written before the field existed |

A `NOO_ACTIVE` whitelist refuses consignment to almost his entire real book. So the rule is stated
as **what it refuses** — no document, or a `WALK_IN` — rather than as a list of blessed values. A
refusal fails safe when a new status appears; a whitelist fails closed and silently.

Pinned by 22 assertions in `logicFixes.selfcheck.mjs`, including one case per status above plus the
blank legacy shop, which is the row a whitelist would have broken without any error.

## Still open

HQ 3 (Rp 1.000.000) and HQ TEST (Rp 1.055.000) are Ecer consignments already written. The guards
stop new ones; they do not touch money already in the book, and nothing there gets changed until
Aldi names the documents himself.

## Related

[[A Store Name Is Not a Store]] · [[Silent Failure Disease]] · [[Anti-Recurrence Check]]
