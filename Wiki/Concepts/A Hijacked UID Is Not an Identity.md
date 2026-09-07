---
title: A Hijacked UID Is Not an Identity
description: KPM rewrites every signed-in user's uid to the owner's so their reads land in the right tenancy. Any per-person key built on that uid therefore belongs to the browser, not the person. It turned the vault's 5-minute grace into a privilege escalation that made a Tier 4 a global admin.
type: concept
created: 2026-09-07
updated: 2026-09-07
confidence: high
checked: 2026-09-07
tags: [security, identity, auth, incident, kpm]
---

# A Hijacked UID Is Not an Identity

**Aldi, 2026-09-07: *"the other T4 account located in different area also receive the approval
request that is not on their regional area"*. He reported a hand-off leak. It was a privilege
escalation, and the hand-off had nothing to do with it.**

Fixed in `994d3d6`.

## The tell was in the screenshot, not the sentence

ALEX — Tier 4 Regional Admin, MUNTILAN — was seeing a HEADQUARTERS hand-off. Every instinct says
go and read the region predicate. The header said something better:

> **GLOBAL RECEIVABLES**, with an ALL REGIONS filter.

One line draws that — `isAdmin ? 'Global Receivables' : 'My Receivables'`. A Tier 4 should read
*My* Receivables. So the question was never "why does this branch rule leak"; it was "why is this
account an admin". **Chrome-level evidence beat the reported symptom.**

## The mechanism

`App.jsx` rewrites the signed-in user's `uid` to `trueBossUid` on purpose, so every Firestore read
lands in the owner's tenancy. The person's real id is kept beside it as `realUid`. The comment on
that line calls it critical, and it is.

The vault's 5-minute grace stored `{uid, at}` in `localStorage` and read it back with
`readGrace(user?.uid)`. That is the **hijacked** uid. So:

1. Aldi unlocks the vault as Tier 1 → a record is written under the boss uid.
2. Anyone signs in on that browser → their `user.uid` **is** the boss uid.
3. The effect finds a valid record and runs `setIsAdmin(true)` for them.

A Tier 4 became a global admin: every store, every region, every branch's approval queue. Any agent
on any device the owner had unlocked within five minutes.

## The general shape

> **When an app deliberately substitutes one identity for another, every key derived from the
> substituted value silently changes meaning.** The substitution is usually well-commented at the
> point it happens and invisible everywhere it is consumed.

Grep for the hijacked field, not for the feature. Anything storing per-person state — localStorage
keys, cache keys, rate limits, "don't show this again" flags, analytics ids — has to use the field
that was *preserved* (`realUid`), never the one that was rewritten.

And the second half: **the right key is not enough.** A record belonging to a person who may hold
the vault must still not restore it into a session belonging to somebody who may not. Both guards
shipped: keyed on `realUid`, and a hijacked agent session never restores the vault at all.

## What it did NOT break

Aldi's own five minutes. The owner is not hijacked, so `realUid` is undefined and the key is the
value it always was. Checks pin that explicitly, and pin that his grace still expires — fixing
somebody else's access by quietly removing his convenience would have been a trade he did not ask
for. See [[Every Action Must Report]]-adjacent reasoning in [[Aldi's Design Taste]]: a fix he
notices as a regression is a fix he will ask to have reverted.

## Guarded by

`src/config/logicFixes.selfcheck.mjs`, section *"THE VAULT GRACE BELONGS TO A PERSON, NOT TO A
BROWSER"* — 11 checks, trialled red on both guards, including the owner keeping his window and the
window still expiring. `integration.audit.mjs` still asserts the restore closes the PIN gate; that
check pinned the old identifier and was updated rather than weakened.

## Related

- [[A Stored Name Is Not the Name of Record]] — the same day, the same family: a stored value that
  looks like identity and is not.
- [[Email Is a Document ID, Not a Field]] — the third of the set: a field doing structural work.
- [[Handoff Eligibility]] — the feature this was misreported as.
- [[UI-Says-Yes-Server-Says-No Pattern]] — its mirror image: here the UI said yes and the server
  agreed, because the session really had been escalated.
