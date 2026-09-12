---
title: Creating a Store Is Not a Visit
description: Why a store created today showed "ALREADY SECURED TODAY — Claimed by ANOTHER AGENT" with nobody else in the picture, and why the fix went to the writer of lastVisit rather than the banner that read it.
type: entity
created: 2026-09-12
updated: 2026-09-12
confidence: high
checked: 2026-09-12
tags: [customers, merchant-sales, journey, revisit-banner, data-lie]
---

# Creating a Store Is Not a Visit

**The symptom.** A store added in the customer directory and sold to on the same day showed the
standing red banner `ALREADY SECURED TODAY — Claimed by ANOTHER AGENT`. There was no other agent.
The banner cannot be dismissed on purpose (it replaced a `window.confirm` that browsers silently
suppress, see [[Silent Failure Disease]]), so a false one is a wall.

**The mechanism.** Two fields on a customer record say when it was last visited and by whom:
`lastVisit` (a day) and `lastVisitedBy` (a name). Every real visit path writes BOTH — a sale at
`MerchantSalesView.jsx:1314`, a journey stop at `JourneyView.jsx:776`. The customer form wrote only
the first: `lastVisit: getLocalDayKey()` in its initial state, in the reset after a save, and as the
edit path's fallback (`CustomerManager.jsx:248`, `:1018`, `:1037`). So "visited today, by nobody"
was a state only the form could produce. `MerchantSalesView.jsx:552` reads exactly that state as a
competitor: `visitedBy || 'another agent'`.

The same stamp told two other screens the same lie: the Journey view counted a brand-new store as
"conquered" today (`JourneyView.jsx:793`) and next-stop routing skipped it as recently seen
(`nextStop.js:38`).

**The fix, `8ed215f`.** The form leaves `lastVisit` blank. Every reader already had a branch for
blank — "no recorded visit" (`CustomerManager.jsx:746`), "NEVER VISITED" (`JourneyView.jsx:705`),
"Never Visited (Due Now)" (`MapMissionControl.jsx:1406`) — and a new outlet reading as never
visited is the truth. The date input on the form still lets a user set one by hand. The banner's
fallback string was left alone: after the fix it is reachable only from rows written before that
day.

**Why the writer and not the reader.** Patching `MerchantSalesView.jsx:552` to treat a blank name
as "nobody" would have silenced the banner and left the Journey tally and the routing wrong. One
line at the source fixed all three; a guard at one reader would have fixed one.

**What Aldi should expect.** A store created today reads NEVER VISITED and due-now until its first
sale. Stores created earlier on 2026-09-12 keep the old stamp until midnight.

**The guard.** `logicFixes.selfcheck.mjs`, section THE PHANTOM COMPETITOR: the form must not stamp
`lastVisit` with `getLocalDayKey()`, and the revisit verdict re-run on three rows (blank date raises
no banner; another agent's sale today names that agent; my own sale today is "me"). 1 red before
the edit, 1426/1426 after.

**Related:** [[Silent Failure Disease]] (why the banner is not a dialog), [[What Counts As Low]] (the other
2026-09-12 fix, same shape: a screen reading a field nobody wrote the way it assumed).
