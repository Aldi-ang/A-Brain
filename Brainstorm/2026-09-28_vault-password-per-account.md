---
type: brainstorm
status: OPEN — waiting on Aldi (A / B / C)
date: 2026-09-28
project: kpm-inventory
confidence: certain (today's model, read in code)
checked: 2026-09-28, kpm `4d833e4`
---

# Vault password: one per company, or one per person?

## The problem, in his words

*"this will be a problem if we put password on all of the account tho, we need a good managament for this"* (2026-09-28, right after the 15-minute lock and the landlord reset shipped, `e8477c7`).

## How it works today

- Who meets the vault: every role with `view_master_vault` — by default T1 (`ALL_ACCESS`) and T2 (ADMIN) (`src/config/permissions.js:128-131`); T3 and below never see it. The "Unlock Master Vault" door: `BiohazardTheme.jsx:823`, the "Restricted Access" screens `App.jsx:4678`, `SettingsView.jsx:141`.
- Whose password: the vault doc is `users/${userId}/settings/admin` with `userId = bossUid || user.uid` (`App.jsx:458`) — so a T2 admin types the **company owner's** password. One password per company, shared.
- What that costs: the owner has to tell every admin his password; one admin's 5 wrong tries lock the owner out too (one shared counter); removing one admin means changing the password for everyone.

## Options

| Option | What changes for the people | Cost |
|---|---|---|
| **A. Own password per person** (recommended) | Each T1/T2 sets their own the first time they unlock; their wrong tries lock only them; the owner resets a person's password or tries from the roster; the landlord resets owners (built) | biggest: a per-person key doc (e.g. `users/{bossUid}/vault_keys/{uid}`), setup on first unlock, a reset on the roster row; the rules' catch-all already lets T1/T2 write under the boss path — check a T2 cannot reset another T2 if that matters |
| B. Password for the owner only | T2 admins skip the vault; their Google sign-in + tier decides what they can do (the server rules already check that) | small; risk: an admin's unlocked phone opens money screens with no second lock |
| C. Keep one shared password | nothing changes | zero; the three problems above stay |

## Decision

**DECIDED 2026-09-28 17:50 — A**, in his words: *"everyone has their own password and even me as tier 1 should not and could not be able to know their password but we have power to help them reset the password tries, if they want to reset it they can use the forgot password button that the app have to send them the email for the recovery code"*. So: one password per person, only a salted fingerprint stored; T1/T2 (and the landlord for owners) reset TRIES only, never a password; a forgotten password goes through the person's own recovery word + an email code sent to THEIR address. Design written as kpm NEXT-SESSION.md's job: the owner keeps `settings/admin`, an employee gets `users/{bossUid}/vault_keys/{agentProfileId}`; the Fleet & Roster card gets the tries reset; a rules draft (he deploys) so nobody can overwrite a person's password record from outside the app. Open: where the EmailJS template sends (`to_email`).

## Rejected on purpose

- A password for T3-T6 — they never meet the vault by default; adding one is work with nobody asking for it.
- An email code per person for recovery — EmailJS sends to one fixed address today (`App.jsx` handleResetPin); per person, the owner's reset is the recovery.

not-chosen: B — lost on "an admin's phone left unlocked opens money screens with no second lock". Flips if every T2 is him or family.

Models applied: Second-Order Thinking (A turns the owner into the helpdesk for forgotten passwords — the roster reset is what keeps that cheap), Reversibility Test (A can fall back to B later; nothing is deleted), Inversion (what makes a shared secret fail? one person leaves).

## Built

**BUILT 2026-09-28 19:45 as kpm `7b85941`** (its commit message is the story). Found while building: a T2 is saved as `COMPANY_OWNER`, and the live rules only ever knew the owner and the old `ADMIN` tag - so the new per-person doc needs the rules draft (kpm `firestore.rules` CHANGE 11) live BEFORE the app push, or every T2 is locked out of the vault. The same shape as [[UI-Says-Yes-Server-Says-No Pattern]]. Emulator: `rules-test/test-vault-keys.mjs` 38/38. Still his: 🔴 CHANGE 11b (the catch-alls leave `vault_keys` out), the deploy, the push, then the EmailJS "To Email" box.

## Reset + lock (his follow-up, 2026-09-28 20:05-20:10)

His words: *"we admin can reset their password but of course this need double confirmation but we cant change their password, we are also should be able to lock their account as tier 1 and 2 just incase their phone is gone or get hacked make sure that the company data is not leaked right"* - *"admin is tier 1 and 2 btw not regional admin"* - *"if possible we should type confirm and press enter button to reset their password would be safe to avoid accidental pressing, lock account basically just make that email unable to login at all"*. Read as YES to CHANGE 11b.

**BUILT 2026-09-29 as kpm `56801d9`** (the commit message is the story). Reset = type "confirm" + Enter, DELETES the person's `vault_keys` doc so they make the new one themselves. Lock = `{ locked, lockedAt, lockedBy }` on `employee_directory/<email>`: the app signs them out live and at sign-in; rules CHANGE 12 makes a locked record no profile at all (the data half). T1/T2 only, never on your own card or the owner's.

Trap pinned by a check (logicFixes): a LOCKED person must not delete their own login record (it erases the lock), but the self-delete keeps `resource == null ||` - without it the ghost killer's delete of a MISSING record throws, and App.jsx's "Live profile sync failed" catch lets the ghost IN. A tightened rule that throws on a missing doc is a hole, not a lock.

Known limit (put to him 2026-09-29 as a 🔴): `firebase.js` keeps a persistent offline copy, so a lost phone kept OFFLINE still shows what it downloaded before the lock; signOut does not wipe it. No server-side lock can reach a phone that never reconnects.
