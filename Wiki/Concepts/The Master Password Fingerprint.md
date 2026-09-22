---
title: The Master Password Fingerprint
description: How the master password and the recovery word are stored (PBKDF2, salted, case kept), why a plain SHA-256 was not enough here, and the one rule every compare must follow
type: concept
created: 2026-09-22
updated: 2026-09-22
confidence: high
checked: 2026-09-22
tags: [security, password, crypto, vault-gate, rules]
---

# The Master Password Fingerprint

Aldi, 2026-09-22: *"yes for A make sure that security for this app is top tier"* — his answer after the question was
put as a blender (the password goes in, mush comes out, nobody can un-blend it) and a thief who blends guesses.

## What is stored, and where

`artifacts/{appId}/users/{bossUid}/settings/admin` holds `pin` (the master password) and `recoveryHash` (the recovery
word). Since kpm `603472d` each is `{ algo: 'PBKDF2-SHA256', iterations: 600000, salt, hash }` — a random 16-byte salt
per fingerprint, 600.000 rounds (OWASP's figure for SHA-256). Before that it was a plain SHA-256 hex of the LOWERCASED
secret. `src/utils/secretHash.js` is the only place that makes or checks one.

## Why the plain hash was not enough HERE

The vault gate compares on the phone, so the rules let every employee of the company read `settings/admin`
(`match /settings/{docId} { allow read: if isSalesman(bossUid) }`). Any employee account, or a copied backup, held the
fingerprint — and a plain SHA-256 can be guessed at millions a second. With the salt a ready-made list is useless; with
the rounds each guess costs what one sign-in costs. The read stays allowed on purpose: narrowing it would break the gate.

## The rules

- **Every compare goes through `verifySecret(secret, stored)`** — never `=== data.pin`. The gate (App.jsx
  handlePinLogin), the setup, the recovery (handleResetPin) and the crown transfer (CrownTransferProtocol.jsx, which had
  its own private SHA-256) all do. The guard block in logicFixes.selfcheck.mjs names each one.
- **The old form still opens.** `verifySecret` accepts a 64-char hex string (SHA-256 of the lowercased, trimmed secret);
  `needsRehash` flags it and the caller re-saves the new form on that sign-in — the gate in the same not-awaited write as
  the strike reset (the 2026-09-16 speed fix kept), the recovery awaited as before. Nobody is locked out by the update.
- **The password keeps its case** from then on (the strength meter demands a capital letter; the old hash threw it
  away). The recovery word stays lowercased BY ITS CALLERS (`cleanWord`, `phrase.trim().toLowerCase()`).
- **The old build online cannot read the new fingerprint.** After the first sign-in on the new build the `pin` is an
  object; an old build's `hashedInput === data.pin` is false forever. Deploy the new build before or right after.
- `crypto.subtle` is a [[Secure Context Requirement]] — the helper throws `SECURE_CONTEXT_REQUIRED` and the gate reads it.

## What was NOT done, on purpose

The compare still runs on the client (no Cloud Functions in this project); a constant-time compare was skipped because
the attacker in that model IS the client. Moving the check server-side is a separate decision for him.

Sibling: [[Firestore Rules]] (CHANGE 8, the rank settings' shared path closed the same day).
