---
title: A Network Is Not The Internet
description: navigator.onLine only answers "does a network interface exist". It has now lied twice in this app — once turning the offline badge green, and once freezing a completed sale on the PROCESSING button.
type: concept
created: 2026-08-19
updated: 2026-08-20
confidence: high
checked: 2026-08-20
tags: [pattern, offline, firestore, error-handling]
---

# A Network Is Not The Internet

**`navigator.onLine === true` means a network card is attached to something. It does not mean a
packet can reach Google.** The flag lies by saying YES; it never lies by saying NO.

## It has lied twice here

| When | What it broke | Where the truth was |
|---|---|---|
| ~2026-08 | The offline badge stayed green with the wifi off — his PC has a WSL virtual adapter on 172.27.240.1, so the flag stayed true | fixed by writing `canReachInternet()` in `src/hooks/useOfflineEngine.js` |
| 2026-08-19 | A completed offline sale froze on PROCESSING with no receipt | the same probe, which existed but was not exported |

The second one is the instructive one, because the fix for the first was already sitting in the
repo, tested and commented, and the Sales Terminal asked the flag anyway.

## The 2026-08-19 freeze, in order

Aldi had **airplane mode ON but wifi still ON**, reading the app off the preview server on his own
PC. So there was a network, and no internet.

1. The sale saved to the Ghost Ledger (IndexedDB, local — worked).
2. The toast appeared and the van stock was cut (both local — worked).
3. `MerchantSalesView` reached `if (navigator.onLine)` → **true** → entered the auto-promoter.
4. It `await`ed a Firestore write. **A Firestore write promise does not resolve until the server
   acknowledges it.** With no internet that is never.
5. `setReceiptData` never ran. The `finally` that releases the button never ran. Frozen.

Note what this looks like from outside: the data is all correct and the app is broken. That is the
signature — a hang, never an error, because nothing threw.

## It survived the first fix, because the fix moved the lie instead of removing it

Swapping `navigator.onLine` for the honest `isOnline` did not cure the freeze. `useOfflineEngine()`
is called **twice** — `App.jsx:260` and `useTransactionEngine.js:48` — and each call created its
own `isOnline` state, its own ref and its own 30-second probe. **Two independent answers to one
question**, drifting apart for up to thirty seconds.

That is precisely the window Aldi tested in: the transaction engine's copy had already flipped
offline (hence the Ghost Ledger toast and the cut stock) while App's copy — the one handed down to
the Sales Terminal — still said online. The terminal ran its online-only follow-up and hung again,
with identical symptoms.

The flag now lives once, at module scope, read through `useSyncExternalStore`. **A fact with two
holders is a fact with two values.**

And the structural fix that makes the whole question moot: **a finished sale must never wait for
optional work.** `setReceiptData` and the button release now run immediately after
`committed = true`, ahead of the IOU ledger and the tier auto-promoter. Pinned by **S30**, which
asserts the ordering by offset inside the handler.

## The third round, and the fact underneath all of it

Two fixes later it was still frozen. The thing nobody had checked was the **primitive**:

Firestore's own `disableNetwork()` was switched on in node and the three calls on the path were
raced against a four-second timer.

| call | with the network cut |
|---|---|
| `setDoc` | **still pending after 4000ms — never settles** |
| `updateDoc` | **still pending after 4000ms — never settles** |
| `getDoc` | resolves, from cache |

**A Firestore write promise settles only on a server acknowledgement.** `useTransactionEngine.js:192`
awaited one *inside the offline branch*, eleven lines above the Ghost Ledger toast. For any agent
with a vehicle: sale saved, stock cut, execution stopped dead — no toast, no receipt, button on
PROCESSING for good.

Aldi never hit that line. A plain ADMIN gets `currentAgentProfileId = null` and skips the block,
which is why HE saw the toast and his report contradicted the code for three rounds. His salesmen
would have hit it every time.

**The rule: never `await` a write inside an offline path.** Fire it, `.catch()` it, carry on — the
local copy is updated the instant it is called and syncs when signal returns. Pinned by **S32**,
which slices the offline branch and fails on an awaited write at any line, not just line 192.

**The method lesson is bigger than the bug.** Three rounds of tracing control flow were beaten by
one ten-line experiment on the primitive. When a path "should work" and demonstrably does not,
stop reading the path and test the thing it stands on.

## The rule

Anything that decides *whether to talk to the server* must call `canReachInternet()` (or read
`isOnline` from `useOfflineEngine`). `navigator.onLine` is only allowed where a **false** is being
trusted, as a cheap early-out — that direction is honest.

The probe is deliberately **out-of-origin** (`https://www.gstatic.com/generate_204`). A same-origin
probe is worthless in this app: the service worker would answer it from cache with the wifi off.
See [[Silent Failure Disease]] for the wider family, and note the sibling distinction in
[[Secure Context Requirement]] — a bypassed certificate still counts as a secure context, so
`crypto.subtle` works where a service worker will not install.

Pinned by **S27** in `src/config/logicFixes.selfcheck.mjs`: the probe is exported, it is not
same-origin, App hands `isOnline` down, and no decision in the Sales Terminal reads
`navigator.onLine` any more.

## Related

- [[Silent Failure Disease]] — the family this belongs to; a hang reports nothing at all
- [[Secure Context Requirement]] — the other place a browser flag meant less than it looked like
- [[UI-Says-Yes-Server-Says-No Pattern]] — the inverse: the UI claims a success the server refused
