---
title: Email Is a Document ID, Not a Field
description: Aldi asked for the roster's required-fields guard to be turned off. Only the phone could come off. The email is the Firestore document id of employee_directory, so an empty one is a crash, not a blank cell — and relaxing a required field silently breaks the duplicate check that sat behind it.
type: concept
created: 2026-09-07
updated: 2026-09-07
confidence: high
checked: 2026-09-07
tags: [pattern, identity, firestore, validation, kpm]
---

# Email Is a Document ID, Not a Field

**Aldi, blocked mid-test: *"i want this disabled for the test account only since its all mine so
that i can try ticking the location adn start testing"*.**

The guard at `src/FleetCanvasManager.jsx:197` refused every save without Name **and** Phone **and**
Google Account Email. Fixed in `4bd0f52` — **only the phone came off.**

## Which required fields are actually structural

| Field | Verdict | Why |
|---|---|---|
| **Phone** | optional now | neither a key nor a login. It was only ever data. |
| **Email** | stays | it is the document id of `artifacts/<appId>/employee_directory/<email>`. Blank produces `doc(db, path, '')` and throws Firestore's raw *"Invalid document reference… must have an even number of segments"*. |
| **Name** | stays | blank puts the Google account name back on the consignment store cards — see [[A Stored Name Is Not the Name of Record]], fixed the same morning. |

The email case already had a scar: `isSafeDocIdEmail` on the very next line exists because a `/` in
an email turned one document id into three path segments and crashed *Authorize & Register* with a
raw SDK error. **A field that is a path segment is not validated for tidiness — it is validated
because the database will reject it.** Those two kinds of "required" look identical in the code and
must be told apart before any of them is relaxed.

## The trap that comes free with every relaxed field

Behind a required field there is usually a **uniqueness check that assumed it was non-empty**.

```js
// before — once one person is saved with no phone, the NEXT blank one is a duplicate of them
const isDupPhone = activeMotorists.some(a => a.phone?.trim() === newAgent.phone.trim() && ...)
// after — only a phone that was actually typed can collide
const isDupPhone = newAgent.phone?.trim() && activeMotorists.some(...)
```

The correct shape was already in the same function three lines down — `isDupPlate` had always
gated on `newAgent.vehicle?.trim()`, because a licence plate was always optional. **The pattern was
in the file; it just had not been applied to the field that changed.**

## And the message

The old refusal listed all three fields whichever one was empty, so nobody could tell which. It now
names the empty field. That is Aldi's "every action must report" law applied to a validation error: an error
that does not say what to fix is a guessing game.

## Guarded by

`src/config/logicFixes.selfcheck.mjs`, section *"A PHONE NUMBER IS NOT REQUIRED TO SAVE A PERSON"* —
13 checks, including the two-blanks-are-not-duplicates case and a self-edit not colliding with
itself. Trialled red (4 failed with the source reverted).

## Related

- [[A Stored Name Is Not the Name of Record]] — the sibling identity bug, same morning.
- [[A Store Name Is Not a Store]] — names are labels, ids are identities.
