---
title: Terminal Tenant Path Split
description: The sales terminal read customers from the boss's vault and wrote IOUs and new outlets to the salesman's own — invisible on the boss's own account, which is why it survived so long.
type: entity
created: 2026-08-11
updated: 2026-09-09
confidence: high
checked: 2026-09-09
tags: [kpm, multi-tenant, firestore, bug, sales-terminal, fleet-roster]
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

## The open risk — narrowed 2026-08-11 08:35, not closed

The rules were read the same morning. **Cross-tenant writing into the boss's vault is the intended
design, not a loophole:** `firestore.rules:106`

```
function isSalesman(bossUid) {
  let profile = getEmployeeProfile();
  return isAuthenticated() && profile != null && profile.bossUid == bossUid;
}
```

Anyone whose `employee_directory` doc carries that `bossUid` passes. The customer rules
(`:411-419`) then allow `update` — the IOU write — and `create` — NOO registration — for exactly
that predicate. Default when no `permission_matrix` doc exists is `global`, i.e. allowed.

**Two settings can still deny it, and they are the whole remaining risk:**

| Tier setting | Effect on the IOU write |
|---|---|
| `customers_view_only` | `update` DENIED — IOU fails at the server |
| `customers_edit_own_region` | DENIED when the customer's `region` is classified and differs from the salesman's profile `location`; unclassified/legacy regions stay editable by design |

## CLOSED 2026-08-11 08:45 — the rules are deployed, so the fix works

Aldi read the Firebase Console → Firestore → Rules tab himself and pasted the live text back. It
is byte-identical to the repo's `firestore.rules`, **including CHANGE 6**. His words: *"i got it
from firebase console"*.

**So the last open risk on this bug is gone.** The IOU write and NOO create both pass at the
server for a salesman writing into the boss's vault. The only remaining ways it can fail are the
two tier settings in the table above — configuration, not a defect.

**The correction worth keeping:** several notes in this project asserted the rules were "a draft,
NOT deployed", and that assertion was carried forward for weeks without anyone opening the
Console. It was wrong. **A file in the repo named `firestore.rules` proves what someone intended
to deploy, never what Firebase is enforcing** — the Console is the only source, and reading it
took Aldi about thirty seconds. [[Draft-Then-Deploy Discipline]] still holds for *writing* rules:
deploying remains his to do, never the agent's.

## The second file, 2026-09-09 — Fleet & Roster

**The 2026-08-11 note ended by saying the other re-derivations were "probably the same fault". They
were.** Aldi's report: *"my tier 4 cant even detect its own sales team inside the fleet and roster"*.
His screen read **UNASSIGNED ROSTER — ACTIVE PERSONNEL: 0 — No personnel found** while the staff sat
in the database untouched.

`FleetCanvasManager.jsx:19` carried the identical shape, one line into the component:

```js
const userId = user?.uid || user?.id || 'default';        // no bossUid
```

**Nine collection paths hang off it** — the roster listener, the branch-stock listener, the product
and branch-inventory writes behind Load Canvas and Reconcile, and the GPS-bypass approve/reject
updates. So this is not a read-only mistake like the IOU banner was: **Load Canvas moves real stock
through a path built on the wrong tenant id.**

### Four silent steps, no error at any of them

1. the listener subscribes to the signed-in person's own empty vault → `localFleet` is `[]`
2. `myProfile` — found by id in that empty list — is `undefined`
3. `rawLocation` falls through to the literal string `'UNASSIGNED'`
4. the roster filter is an exact area match, and **no staff record ever carries `'UNASSIGNED'`** —
   the app's own blank sentinel is `'UNASSIGNED AREA'`, a different string

Step 4 is the one worth remembering on its own: two spellings of "no branch yet" existed in one
file, and the fallback used the one that matches nobody. See the standing lesson about a sentinel
carrying two meanings.

### The half that is not a code fix

An empty roster has **four** causes — the read was refused, your own record is missing, you have no
area, or your branch genuinely has nobody — and all four printed *"No personnel found"*. The
Firestore error code went to `console.warn` and nowhere a person would look. They now each say
which, and the refusal prints its code on screen. That message paid for itself in one turn.

### ANSWERED, same day — and it was NOT the vault

Aldi reopened the screen and read back: **"Your own staff record was not found."** So the read had
succeeded and the roster was full — his own screenshot shows seven people at HEADQUARTERS with
**[TEST] REGIONAL ADMIN** among them, sitting there the whole time.

The live cause was a **prop App.jsx never passed**:

```js
const myProfile = (previewing ? null : activeMotorists.find(m => m.email === user.email))
    || activeMotorists.find(m => m.id === agentProfileId);   // agentProfileId === undefined
```

The first half is deliberately null under POV — the preview keeps his real email, so that lookup
must stand down or it finds HIS record whatever tier he wears ([[POV Changes the Id, Never the
Email]]). **The half it stands down TO did not exist.** `find(m => m.id === undefined)` is nothing,
on every tier, however full the roster is. Shipped `b945280`.

> **When you disable a lookup, the fallback it lands on is new load-bearing code. Test the path you
> just created, not only the one you closed.**

Why it survived: a real login never reaches the fallback, because the email lookup answers first.
The only identity that reaches it is the preview — and the preview is what nobody re-tested after
the stand-down was added. App.jsx passes `agentProfileId` to five other screens, so a file-wide grep
says yes; the guard had to be scoped to the `<FleetCanvasManager` tag to see the gap.

**The vault fix is kept and is not wasted.** It is a real defect for any non-owner login and nine
paths hang off it, including branch-stock writes. It was simply not what Aldi hit, because POV keeps
his real uid and on the owner's account `bossUid === user.uid` — old and new code agree there. Two
genuine bugs stacked on one screen, and only the second one was his.

⚠️ **And even with the right vault, a regional admin sees only staff whose `location` string matches
theirs exactly.** A costume parked at `Headquarters` while the team is at a branch is still an empty
roster, correctly. That is a data question, not a bug.

Shipped `da71cbd`.

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
- [[POV Changes the Id, Never the Email]] — the OTHER identity trap in this same file, and why POV masks this one
