---
title: A Cache Saying No
description: Why KPM showed ACCESS DENIED to its own owner for twenty seconds — Firestore answering a lookup out of the local cache, and the rule that a negative from the cache is not evidence.
type: concept
created: 2026-09-01
updated: 2026-09-01
confidence: high
checked: 2026-09-01
tags: [auth, offline, firestore, cache, lockout, phone]
aliases: [Access Denied, ACCESS DENIED, Offline Lockout, absentForSure, fromCache]
---

# A Cache Saying No

## What he saw

> *"i was on access denied for around 15 second then back to the normal login screen"*
> — Aldi, 2026-09-01, signing in as Tier 1 on his iPhone

> *"access denied screen muncul for around 20 seconds and then gone, i can login now"*
> — the same day, second occurrence

Both times the account was fine. The screen after the lockout was the master-password vault gate,
which is the screen for an account the app **recognises** — so the app had contradicted itself
inside a single sign-in.

## The cause, and why the first reading was wrong

The first diagnosis assumed an error had been thrown and caught. It had not.

`getDoc()` with local persistence enabled does not reliably throw while the client is still
connecting. **It answers out of the local cache**, and a document that has never been cached on
that device comes back as a perfectly ordinary *does not exist*. The auth handler read two of those
in a row — `employee_directory/{uid}` and `employee_directory/{email}` — took the `else` branch,
and that branch is the hard lockout. Twenty seconds later the connection came up,
`onAuthStateChanged` fired again, the real answer arrived, and he was in.

**No error was thrown, so nothing in the `catch` ran.** That is why the earlier hypothesis —
`permission-denied` falling through the catch to `UNAUTHORIZED` — found nothing to fix.

## The rule this leaves behind

**A negative from the cache is not evidence. A negative from the server is.** A *positive* from the
cache stays trustworthy — an account that was there last time is still there, which is the whole
basis of opening the app offline.

`absentForSure(snap)` in `src/utils/helpers.js` is that one distinction, and it reads
`snap.metadata.fromCache`. When both directory lookups come back empty and either came from the
cache, the handler lands on the existing can't-verify screen with its Retry button instead of the
red lockout.

⚠️ **The ordering is the safety property.** The cache test sits ABOVE the lockout, never replacing
it: a genuine stranger, whose absence the server confirms, still reaches ACCESS DENIED. A fix that
delayed or softened the lockout itself would have turned a security gate into a timing race.

The can't-verify screen also stopped saying the internet was down. He was online both times, and a
message that blames his signal sends him to fix the wrong thing.

## Pinned

Seven checks in `logicFixes.selfcheck.mjs`. Five are behaviour — the function is lifted out of
`helpers.js` by regex and run against fake snapshots, because `helpers.js` imports
`firebase/storage` and cannot be imported by a checker. Two are regression guards on the branch
order and the new wording.

⚠️ **A trap worth remembering from writing them:** the lift returned `undefined` because the regex
ended in `;\n` and `helpers.js` is checked out with CRLF endings. Every behaviour check went green
by testing nothing until an anchor check was added for the lift itself.

See also: [[One Pack Count, Many Screens]] · [[Anti-Recurrence Check]]
