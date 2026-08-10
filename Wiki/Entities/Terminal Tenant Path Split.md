---
title: Terminal Tenant Path Split
description: The sales terminal read customers from the boss's vault and wrote IOUs and new outlets to the salesman's own — invisible on the boss's own account, which is why it survived so long.
type: entity
created: 2026-08-11
updated: 2026-08-11
confidence: high
checked: 2026-08-11
tags: [kpm, multi-tenant, firestore, bug, sales-terminal]
---

# Terminal Tenant Path Split

Found 2026-08-11 while chasing Aldi's G5 test report: *"there is no notification on the strip or
banner appear when there is IOU in that store"*.

**The banner was never missing.** `MerchantSalesView.jsx:1401` has rendered it since it was
written. The terminal was reading one vault and writing another.

## The mechanism

`App.jsx:318` is the whole app's rule:

```js
const userId = bossUid || user?.uid || user?.id || 'default';
```

Every database call in App redirects into the **admin's** vault when `bossUid` is set — that is
the [[Multi-Tenant Architecture|bossUid pattern]]. The `customers` array handed to the sales
terminal as a prop comes from that path.

**The terminal was never given that id.** It re-derived its own, four separate times, without
`bossUid`:

```js
const userId = user?.uid || user?.id || 'default';   // :777 :800 :946 :963
```

So a salesman's IOU was written to `users/<salesmanUid>/customers/<id>` while the list was read
from `users/<bossUid>/...`. `selectedCustomerInfo.pendingIOUs` could never be anything but empty.
The same four sites cover **new-outlet (NOO) registration** — an outlet a salesman registered was
invisible to his boss too, which is the more expensive half.

## Why it survived

**On the boss's own account `bossUid === user.uid`** (`App.jsx:904` claims it permanently), so
both expressions return the same value and everything works. Aldi tests on his own account. The
bug only exists for the people the app was built for.

That is the same shape as [[Fleet Captain Permission Gap]]: correct for the account doing the
testing, broken for the role that actually does the work.

## The fix, and what was deliberately left alone

App now passes `masterUserId={userId}` — the id it had always given `RestockVaultView` — and the
terminal resolves every `customers/` and `appSettings/` path through one `dataOwnerId`
(`MerchantSalesView.jsx:33`). Commit landed 2026-08-11, audit group 20.

**Three `masterUid` derivations were left local on purpose** (`:708`, `:852`, `:937` — products,
motorists, samplings, photos, notifications). Same expression, different name, probably the same
fault — but they carry the **sale commit**, and `MerchantSalesView.jsx:958` records that someone
already hit a rules wall writing motorists to another vault. An audit check pins the count at
three, so leaving them is a recorded decision and changing them will be visible.

## The open risk — this is not proven fixed

No live salesman account was used, and `firestore.rules` was not read. **If a salesman is
rules-blocked from writing the boss's customer doc, the write now fails at the server instead of
silently landing in the wrong place.** Better — a loud failure beats an invisible one — but still
not working, and the repair would be a rules change, which is
[[Draft-Then-Deploy Discipline|a draft Aldi deploys himself]].

## The lesson worth carrying

**When one file re-derives a value the rest of the app centralises, treat the copy as wrong until
proven otherwise.** The give-away here was a second name — `masterUid` — for the identical
expression. Two names for one concept in one file meant nobody owned it.

## Related

- [[UI-Says-Yes-Server-Says-No Pattern]] — the family: the UI accepted the IOU and the server
  stored it where nothing reads
- [[Multi-Tenant Architecture]] — the `bossUid` pattern this bypassed
- [[Fleet Captain Permission Gap]] — same "works for the tester, broken for the worker" shape
- [[Aldi's Design Taste]] — he found it by testing, not by reading; his round result is the source
