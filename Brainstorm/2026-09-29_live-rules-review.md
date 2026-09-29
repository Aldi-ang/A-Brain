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
