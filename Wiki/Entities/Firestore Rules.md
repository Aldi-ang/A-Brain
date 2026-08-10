---
title: Firestore Rules
description: The server-side rule file that actually decides who can read or write what — separate from whatever the UI shows.
type: entity
created: 2026-07-27
updated: 2026-08-10
confidence: medium
checked: 2026-08-10
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

## Verify before trusting

Whether a specific rule is currently correct — or currently *deployed* — is exactly the kind
of thing this wiki should never answer on its own. Check `firestore.rules` (drafted) versus
`firestore.rules.deployed-baseline` (live) in the real repo.
