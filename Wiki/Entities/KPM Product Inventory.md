---
title: KPM Product Inventory
description: What KPM actually contains, measured rather than recalled — module count, permission surface, test surface, and the replacement-cost anchor that any pricing or buy-out conversation should start from.
type: entity
created: 2026-09-09
updated: 2026-09-09
confidence: high
checked: 2026-09-09
tags: [kpm, pricing, business, product, inventory]
---

# KPM Product Inventory

**Built for the pricing conversation, after Aldi rejected a price derived from memory:** *"i think i
rather u do know this app better first by studying this app fully and then do a deep research on how
other app are priced fairly from that with all the codes and features that i put on this app"*. He
was right — the earlier numbers were anchored on "accounting + field sales", which is not what this
is.

## Method, and its limit

Measured on 2026-09-09 from the codebase's own self-description — audit group titles, self-check
section titles, the permission matrix's `ALL_FEATURES`, the exported helpers in `permissions.js`,
and the file tree. **That is high-fidelity for *what exists* and says nothing about *how well each
piece works*.** Nothing here is a claim that a feature is bug-free; the day-one walk found seven
real problems in an afternoon. Read this as a bill of materials, not a quality certificate.

## Size, measured

| | count |
|---|---|
| lines of production JS/JSX in `src/` | **47.805** |
| top-level screens | **14** |
| components | **37** |
| config modules | 20 · hooks 5 · utils 17 |
| **automated checks that pass** | **2.260** across 6 runnable suites |

The check total is the number worth quoting to a buyer, because it is verifiable in front of them in
about ninety seconds: `npm run build; node src/config/integration.audit.mjs`.

## The permission surface

**16 modules gated by an owner-editable matrix**, plus 5 behaviour switches:

Command Center · Map System · Journey Plan · Fleet & Canvas · Master Vault · Logistics & Warehouse ·
Agent Inventory · Sales Terminal · Receivables & Consign · EOD Setoran · Stock Opname · Customers ·
Sampling · Audit Logs · Settings · Agent Profile

Switches: `can_unrestricted_sample` · `view_expected_count` · `photo_pick_from_gallery` ·
`edit_agent_roles` · `edit_rank_config`

**23 exported permission helpers** in `src/config/permissions.js`, including region normalisation,
hand-off eligibility across regions, per-person named approvers, three customer-access levels, and
fleet-edit rights. This is an org model, not a role dropdown.

## Capabilities that were NOT in the earlier pricing, and should have been

Found in the audit and self-check section titles. Each is a line item a DMS vendor would charge for.

| capability | where it shows up |
|---|---|
| **Track & trace — "Global Logistics: where every pack is"** | audit G55. For tobacco this is adjacent to cukai/excise traceability |
| **Barcode scanning** (`code_128`) with a typed fallback | `ArrivalScanner.jsx`, audit G58 |
| **Surat jalan in two directions**, inbound and outbound | audit G53 |
| **Quarantine + HQ audits** | self-check S37 |
| **Karton / bal / slop intake conversion** | audit G59 |
| **Short-count bounty system** — approved, recorded, repayable, billed at retail, penalty tier is a company setting | self-check S18, S22, S23 |
| **Offline engine with a real internet probe**, not `navigator.onLine`; offline sales move van stock through the same rule as online | S11, S12, S27, S30, S32 |
| **Sales rollup cache, rebuildable from the transactions** | S39 |
| **In-app tutorial system (Ponder)** | audit G56 — kills the "my staff will never learn it" objection |
| **Configurable rank/career ladders** | `career.js`, `rankBorders.jsx`, `edit_rank_config` |
| **Audit logs** · **duplicate finder** (read-only) · **Hall of Fame** | G12, module list |
| **Hand-off approval across regions with named approvers** | `handoffEligibility`, `personApprovalRegions`, `canApproveHandoffFrom` |
| **Light/dark theming with automated contrast checks, plus Lite Mode** | G30–G46, `contrast.selfcheck.mjs` |

## Security, verified in code

| claim | verdict |
|---|---|
| Account login | **Firebase Authentication** — Google infrastructure. The strongest claim, and the one Aldi keeps forgetting to make |
| Master password + recovery word | **SHA-256 via `crypto.subtle`**, stored hashed, never plaintext — `App.jsx:1004` |
| Recovery | **Three layers** — secret word → email OTP (EmailJS) → **5 failed attempts = permanent lockout** — `App.jsx:1158–1219` |
| Multi-tenant isolation | every vault path routes through `bossUid`; Firestore rules enforce per-company separation |

⚠️ **One weakness to fix BEFORE any pitch that names the algorithm.** The SHA-256 is unsalted and
single-round. Correct as a checksum, weak as a password hash — a reader of the Firestore document
could rainbow-table a short PIN. `crypto.subtle` already offers **PBKDF2**; a per-company salt and
~100k iterations turns a claim that invites inspection into one that survives it. Same file, small
change. See [[Secure Context Requirement]] for why `crypto.subtle` is absent on a LAN http address —
that constraint applies to any replacement too.

## The replacement-cost anchor

**The number a factory owner understands: what would it cost to have this built?**

47.805 lines across 14 modules, with offline sync, multi-tenancy, a role engine, track & trace and
2.260 regression checks, is a team-and-a-year job, not a freelance weekend.

| scenario | cost |
|---|---|
| lean freelance team — 3 people × 12 months × Rp 15 juta loaded | **≈ Rp 540 juta** |
| realistic — 1 BA/PM + 3 devs + 1 QA × 14 months × Rp 20 juta loaded | **≈ Rp 1,4 miliar** |
| Jakarta software house at agency bill rates (2–3× salary) | **Rp 1,5 – 3 miliar** |

Confidence: **[likely]**, not measured. Line count is a weak proxy for effort on its own; it is the
combination of line count, module count, the check suite and the offline/multi-tenant architecture
that makes the band defensible. Indonesian developer rates are from general knowledge and should be
sanity-checked against one real quote before being used in a negotiation.

**This anchor matters most for the buy-out conversation, not the monthly one.** It is why a perpetual
licence at Rp 600 juta is a discount rather than an insult.

## What this changed about the price

Honest accounting, so a later session does not read this as pure ratcheting:

- **The monthly figure barely moved.** Rp 10–20 juta/month for a principal with a real field force
  still stands. What changed is that it is now *defensible* — each rupiah maps to a named module.
- **The buy-out figure moved up**, from Rp 180–300 juta to **Rp 600 juta – 1,5 miliar**, because
  replacement cost is the correct anchor for a perpetual licence and it had never been calculated.
- **The pitch changed most of all.** Track & trace, the bounty system, the tutorial and the 2.260
  checks were all missing from the earlier story, and three of them answer objections a buyer raises
  unprompted.

## Related

- [[2026-09-09_pricing-kpm-for-the-first-customer]] — the options, the measured market comps, the selling strategy
- [[A sale is a closed contract — no cash goes back]] — the titip money rule, the deepest moat
- [[capture=environment Is a Request, Not a Lock]] — tier-switchable proof photos
- [[Terminal Tenant Path Split]] — the multi-tenant routing that makes customer #2 possible
