---
title: Firestore Rules
description: The server-side rule file that actually decides who can read or write what — separate from whatever the UI shows.
type: entity
created: 2026-07-27
updated: 2026-09-06
confidence: medium
checked: 2026-09-06
tags: [firestore, security, rules]
---

# Firestore Rules

The `firestore.rules` file in the `kpm-inventory` repo is the server-side enforcement layer
for [[Multi-Tenant Architecture]] and [[Tier System]] — the actual gate that decides whether
a Firestore read/write is allowed, independent of whatever the UI shows.

## It's a draft, not the live rules

See [[Draft-Then-Deploy Discipline]] — this is important enough to be its own Concept page,
but the short version: `firestore.rules` in the repo is explicitly headed
"RECONCILED DRAFT — NOT DEPLOYED," reconciled against `firestore.rules.deployed-baseline`
(a frozen copy of what's actually live). Nothing in this file protects the real app until
the project owner manually runs `firebase deploy --only firestore:rules`.

## The recurring failure mode

The single most common way this file goes wrong: a role-check function tests for one exact
literal role string and silently omits another role the UI (or business intent) clearly
includes. See [[Fleet Captain Permission Gap]] for the specific, repeatedly-recurring
instance of this (`isAreaAdmin()` never covering `'FLEET_CAPTAIN'`). This is a special case
of the broader [[UI-Says-Yes-Server-Says-No Pattern]].

## The one confirmed tenant-isolation failure

[[Rank Config and Achievement Badges]] — a settings document NOT nested under
`users/{bossUid}/...` like everything else, so it's shared by every company in the Firestore
project rather than scoped per tenant. The closest real thing in this codebase to a
"security escalation" bug: not one account gaining more privilege than intended, but one
company able to overwrite data every other company also depends on. Documented and left as
a known limitation (a rules-only fix can't move data to a new path — that needs an app-code
change), per this project's [[Draft-Then-Deploy Discipline|document-don't-silently-half-fix]]
convention.

## Re-confirmed still-undeployed, 2026-07-27

A `/ponytail:ponytail ultra` review re-checked the repo against the last two fix batches and
confirmed this is still the single highest-leverage open item: every fix in both batches
exists only as a draft. See [[Dead Weight Cleanup and Rules-Deploy Gap]] — that session did
an unrelated dead-code/hygiene cleanup instead, deliberately leaving the actual
`firebase deploy --only firestore:rules` step for the project owner to run by hand.

## Superseded, 2026-07-29 — most of the ruleset deployed 2026-07-28

Per this project's own document-don't-silently-overwrite convention, the "still-undeployed"
section above is **left in place, not deleted** — it was correct for two days and stayed
after it stopped being true, which is the exact failure mode this correction is about.

[certain] (checked: `git show b386ec7 --stat`, commit message) — `b386ec7` (2026-07-28) ran
`firebase deploy --only firestore:rules` against `cello-inventory-manager`, live. Covers Rank
Config, motorists/products Fleet Captain fixes, Option B region-lock, `pending_audits`
widening, Customer Directory tier — the batches this page's "still-undeployed" section was
about.

[certain] (checked: `git diff b386ec7 HEAD -- firestore.rules`) — the very next commit,
`3231f21`, same day, added a `production_targets` rule **after** that deploy. Its own message
says draft only. That one rule is still genuinely undeployed; everything else on this page is
not.

This correction surfaced only because the Alucard benchmark's T2 task happened to ask about
deploy status directly (`A-Brain/runs/alucard-benchmark.md`) — the page itself gave no signal
it had gone stale. See [[Conventions]] for the `confidence`/`checked` frontmatter fields added
to prevent needing a benchmark to catch this again.

## Related

- [[Draft-Then-Deploy Discipline]]
- [[Fleet Captain Permission Gap]]
- [[Rank Config and Achievement Badges]]
- [[UI-Says-Yes-Server-Says-No Pattern]]
- Summaries: [[Rank Config Cross-Tenant Gap]], [[Fleet Captain Rule Gaps — Batch 1 and 2]],
  [[Dead Weight Cleanup and Rules-Deploy Gap]]

## The owner's email is a hardcoded master key — found 2026-08-10

Aldi's own email is written directly into the rules as a full override:

```
firestore.rules:20   request.auth != null && request.auth.token.email == 'adikaryasukses99@gmail.com'
```

and the same address appears again in the app as `masterVIPs` (`src/App.jsx:2130`). Two layers,
same constant, no config indirection.

For Aldi running his own business this is not a bug — it is how he keeps developer access. **It
becomes one the moment the app is sold.** A buyer's deployment would still grant the previous
owner server-level master access to their tenants' data, and it reads exactly like a backdoor
whether or not it was meant as one. Anyone who gains control of that one email address gains it
across every deployment that ever shipped this file.

Found by a packaging tool, not by a security review — `A-Brain/automation/export-app-for-sale.mjs`
scans a would-be sale export for personal markers and refused to write, exiting 1 on 7 hits. The
other 6 were paths and comments. This one was the reason the scan was worth writing.

### 🔴 DO NOT DELETE THAT LINE — it is load-bearing

Correcting this page's own first draft, which framed the email as pure excess access. **It is not
excess. It is the only thing granting super-admin at the server.** `isSuperAdmin()` never reads
`system_admins`, so deleting the literal leaves **nobody** with god-mode — Aldi included.

The rules file has said so since before this page existed, in a comment directly under the
function: Crown Transfer writes `system_admins_invites` and deletes the old owner's
`system_admins/{uid}`, and `App.jsx` creates `system_admins/{newUid}` — but because
`isSuperAdmin()` ignores all of that, *"a newly-crowned owner gains NO god-mode, and the hardcoded
email keeps it even after revocation."* The one-line repair is written out there too:

```
|| exists(/databases/$(database)/documents/system_admins/$(request.auth.uid))
```

and was **deliberately left unapplied**, with the reason recorded: *"it widens god-mode and is the
owner's call to make knowingly."* That earlier session was right to stop, and so was the
2026-08-11 03:17 one, which came within a step of deleting the email before reading the comment
block around it.

**Real fix, whenever Aldi wants it:** make super-admin come from the database, so the crown can
actually transfer and his own address stops being special. Order matters — add the `exists()`
clause and prove it works on the emulator FIRST, only then remove the literal. Reverse that order
and the app has no owner. Rules are his to deploy by hand ([[Draft-Then-Deploy Discipline]]);
no agent deploys them.

**Status 2026-08-11: closed, left as-is at his instruction — "leave it then".** Not forgotten:
`A-Brain/automation/export-app-for-sale.mjs` exits 1 on this exact string, so a sale cannot be
packaged until it is dealt with deliberately.

confidence: high · checked: 2026-08-11 (both files read with surrounding context, comment quoted)

## 2026-09-05: a public URL made the draft/deployed gap concrete

The app went online at `kpm-ang.vercel.app` (Vercel Preview, aliased to the
`phase0-solid-ground` branch) so Aldi could show friends. Two things that gap means in practice:

- **What protects the demo is not the rules.** `grep -rn "createUserWithEmailAndPassword" src/`
  returns nothing — there is no self-signup anywhere in the app, so a stranger with the URL
  reaches a login screen and stops. Accounts are admin-created. That check ran *before* the
  push, not after.
- **What is still open is the store hand-off write rule — drafted, NOT deployed.** At the
  database level an account holder can still edit or delete transactions he did not make. The
  demo does not expose this (friends cannot get an account), but it is live for real agents
  right now. See [[../Concepts/Ownership Moves, History Does Not]] and the Backlog card
  *Deploy the store hand-off write rule*.

The Firebase web config at `src/config/firebase.js:8` is committed, which is normal — a web API
key is not a secret. But it does mean these rules are the *whole* of the boundary, so a drafted
rule is an open door rather than a pending chore. Source:
[[../Summaries/The Panel That Never Reads a Transaction]].

## The demo was not exposed — it was unreachable (2026-09-06)

The 2026-09-05 entry above reasoned about what protects the public demo. A `curl` the next morning
showed the question was moot in a way nobody had checked: **`kpm-ang.vercel.app` answers 302 to
`vercel.com/sso-api`.** Vercel *Deployment Protection* was bouncing every visitor not signed into
Aldi's Vercel team — which is also why his friends saw nothing.

The 2026-09-05 claim still stands as written (no self-signup, so no stranger can obtain an
account); this only adds that a second, earlier gate was closed the whole time. Both are settings
in Aldi's dashboards, neither is code, and both are his to flip. **When he flips them, the
absence-of-signup argument becomes the only protection again — and the store hand-off write rule
is still drafted, not deployed.** A related discovery from the same commit: no demo account was
ever needed, because Fleet & Canvas already requires a Google account email when adding personnel
and `App.jsx` reads that `employee_directory` doc on login. Source:
[[../Summaries/The Shorter List Was Never the Eligible One]].

## Verify before trusting

Whether a specific rule is currently correct — or currently *deployed* — is exactly the kind
of thing this wiki should never answer on its own. Check `firestore.rules` (drafted) versus
`firestore.rules.deployed-baseline` (live) in the real repo.

## CHANGE 8 — 2026-09-22 — the shared rank-settings path is closed (DRAFT until Aldi deploys)

His *"b is also Yes make sure that there is no intersection when second company coming in"*. CHANGE 7 had documented the
gap a rules-only fix could not close: `artifacts/cello-inventory-manager/settings/{achievements,rpg_ranks}` was ONE doc
for every company, readable by any signed-in user and writable by any company's owner. kpm `603472d`: the app reads the
company folder only (`users/{bossUid}/settings/progression`); the vault owner's app start moves whatever is still only
in the shared docs into it once (`src/utils/progressionHome.js`) and reports; the shared path is `allow read, write: if
false`; `isRankConfigEditor()` removed. rules-test/test-batch1.mjs TASK 1 asserts every role DENIED, including a
different company's owner — 26/26 in the emulator. **Deploy order:** the owner opens the app once BEFORE deploying, or
the move can no longer read the old docs and the defaults show. See [[The Master Password Fingerprint]] for the same
day's (a).

## CHANGE 11 / 11b — 2026-09-28 — a vault password per person (DRAFT until Aldi deploys)

`users/{bossUid}/vault_keys/{rosterProfileId}`: the person reads/writes their own; the company T1/T2 change only the three try counters; nobody deletes. 11b takes `vault_keys` out of both catch-alls (his 🔴). MUST deploy before the app push (a T2 = `COMPANY_OWNER` is unknown to the live rules). Pointer: kpm `7b85941`, `rules-test/test-vault-keys.mjs`; the story is in [[2026-09-28_vault-password-per-account]].

## CHANGE 17 — 2026-10-20 — customer access by folder (DRAFT until Aldi publishes it)

`users/{bossUid}/settings/customer_access` `{ on, teams: { MUNTILAN: { areas: { 'JAWA TENGAH|MAGELANG': [kecamatan...] }, adminEdit, teamEdit } } }`. While `on`, T3-T6 read only shops whose `province|region|city` sit in their team's ticks (exact capitals); a team admin (AREA_ADMIN / FLEET_CAPTAIN) also reads `holdTeam == his branch`; a visit (lastVisit*, openRequest, updatedAt) needs only sight; a real edit needs the switch and lands only in his own folders. Off, or T1/T2 (owner, ADMIN, DEVELOPER, COMPANY_OWNER): the old lines unchanged. Pointer: kpm `4350707`, `rules-test/test-customer-access.mjs` (47/47). Story: [[2026-10-20_customer-access-by-folder]].

**Two facts the emulator taught (2026-10-20, confidence high, checked by the test):**
- **The 1000-step limit is per REQUEST, across every allow line tried.** Small helpers that each call getEmployeeProfile() ran every allowed edit and a team admin's holdTeam query past it, and the result was a plain refusal. Fix shape: one function per check, profile read once into `let`s (`folderReadOk`, `folderEditOk`).
- **A list query IS provable through a computed key:** `shop.city in areas.get(shop.province + '|' + shop.region, [])` accepts `where province ==, where region ==, where city in [...]` and refuses a query that slips in one unticked Kecamatan. No stored key field was needed.

**Known gap, NOT fixed (his rules call):** an owner who signs in WITHOUT the super-admin email cannot LIST any collection under his company - the catch-all reads `document[0]`, which a list leaves unbound ("Variable is not bound in path template"). Same on `firestore.rules.deployed-baseline`. Aldi's own Gmail passes as super admin, so it only bites a second company's owner. Asserted as it is in the test so a fix flips it.
