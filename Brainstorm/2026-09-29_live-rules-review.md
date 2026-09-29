---
title: Live Firestore rules review (before publishing CHANGE 11-13)
created: 2026-09-29
status: OPEN — waiting on Aldi
tags: [kpm, firestore-rules, security, review]
---

# Live Firestore rules review

## Problem

His words, 2026-09-29, pasting the rules from the Firebase Console: *"this is the firestore rules that we have i want u to review first before change"*.

## What was checked

- **His paste == `firestore.rules.deployed-baseline` (synced 2026-07-28, kpm `b386ec7`)**, every code line, comments ignored (normalised diff: IDENTICAL). So the repo's rollback copy is the live truth.
- **Publishing our draft (kpm `c8cdc1c`) loses nothing by accident.** Every changed line of the live file is in the list below. The only two removals are on purpose: `isRankConfigEditor()` and the SHARED `artifacts/.../settings/{docId}` rank/badge path (every company could overwrite every other company's ladder; the app moved that data into each company's own folder in `603472d`).
- What publishing adds: the vault per person (`vault_keys`, CHANGE 11/11b - even the super-admin catch-all cannot touch a password doc), the lock (CHANGE 12 - a locked login is no profile at all), the T1/T2 Gmail move (CHANGE 13, never a Tier 1 tag), `career`/`awards` read rules, `production_targets` (same as the catch-all - no behaviour change).
- **Safe to publish before the push** [likely, reasoned not emulator-run on the OLD app]: today's live app (`42ab421`) still keeps the vault in `settings/admin`, which the new rules treat exactly as before; nobody is locked; no `vault_keys` doc exists yet.

## Gaps in the LIVE rules our draft does NOT fix

| # | Gap | Who could abuse it | Confidence |
|---|---|---|---|
| a | `employee_directory` `allow read: if isAuthenticated()` - any signed-in Google account can LIST every company's login records (emails, roles, company ids). Only the landlord screen lists the collection (`LandlordDashboard.jsx:24-203`), and his super-admin rule already covers it | anyone with a Google account and a direct database call | rule [certain]; that nothing else lists it [likely] |
| b | Approvals are guarded only by the app: `gps_bypasses` update, `stock_requests` update, `account_transfers` create/update are open to ANY employee of the company - a field agent could approve their own GPS bypass or stock request with a direct call (`FleetCanvasManager.jsx:1416`, `BranchWarehouseManager.jsx:690` do the approving) | an employee who knows how to call the database directly | rule [certain]; exploit needs skill |
| c | A T2 saved as `COMPANY_OWNER` is not in the company catch-all (only the owner and the old `ADMIN` tag) - so most admin saves a T2 makes are refused by the server (products, settings, hiring). CHANGE 11-13 fixed only the vault, the lock and the Gmail move | not abuse - T2s blocked from their own job (UI yes, server no) | proved for the roster card + login record (emulator, 2026-09-29); other paths [likely] |
| d | Known, parked by design: his Gmail is god-mode over every company; Crown Transfer does not move god-mode; `transactions` create has no field checks | - | [certain] |

## Options

Publish now, then a second draft for a/b/c (each needs its own emulator test; b and c may need small app changes) - or hold the publish until a/b/c are in (one publish, but the vault/lock/move and the push wait).

## Decision

OPEN - waiting on Aldi: publish now? and which of a/b/c first.

## Rejected on purpose

- Folding a/b/c silently into today's draft: every `allow` change is his call (rules draft process).

Models applied: Inversion (what could the publish break? the live app's vault path - checked), Chesterton's Fence (the shared settings path was closed only after the data moved).

## His call, 2026-09-29 10:10: *"fix first publish later just checked first what need to be fixed, finaliza then publish last"*

Full pass over every rule of the draft (not only a-c). The fix list put to him, ranked by harm (T1-T4 = owner, T2 admin, T3 AREA_ADMIN, T4 FLEET_CAPTAIN):

| # | Hole (rule) | Fix | Could break |
|---|---|---|---|
| 1 | `gps_bypasses` update by any employee - self-approve a bypass; the agent's app sells on `status === 'APPROVED'` (`MerchantSalesView.jsx:869`) [certain] | create only as PENDING; status change only T1-T4 (the Fleet & Roster approvers, `FleetCanvasManager.jsx:1416`) | a T5/T6 given the approve screen |
| 2 | `branches/*/inventory` write by any employee - any branch's stock and damaged stock [certain]; writers found: Fleet load/return, branch receive, EOD verify, Stock Opname approve - all management | T1-T4 only | a T5/T6 given Branch Warehouse / EOD verify [likely none] |
| 3 | `stock_requests` create/update by any employee; only Restock Vault + Branch Warehouse write it | T1-T4 only | same |
| 4 | `settings/admin` (the owner's vault record) readable by every employee; his `recoveryHash` is still the OLD fast SHA-256 form - guessable offline | owner (+ landlord) only; after the push he re-saves the recovery word | T2s on the OLD app lose the vault between publish and push |
| 5 | `employee_directory` listable by any Google account | no list except the super admin; single look-ups stay | none found (only LandlordDashboard lists) [likely] |
| 6 | T2 (`COMPANY_OWNER`) not in the company catch-all | T2 = old ADMIN powers, minus `settings/admin`, `vault_keys`, and never a T1 tag (motorists via their own rule) | none - T2 gains |
| 7 | `account_transfers` update by any employee - can mark APPROVED (nothing moves, the record lies) | APPROVED only T1-T4 | none |
| 8 | `products` update by T3/T4 - any field incl. prices; the fleet flow writes only `stock`/`name`/`productId` (+ `damagedStock` at EOD) | T3/T4 limited to those fields | none |

Parked, no fix (design): fake `transactions` by any employee; an agent edits their own van stock (the sale engine needs it; EOD catches it); audit-log and notification spam.
