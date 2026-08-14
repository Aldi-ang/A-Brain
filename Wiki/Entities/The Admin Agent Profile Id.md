---
title: The Admin Agent Profile Id
description: Why the shell's profile picture does not follow the Agent Profile when the boss is signed in — the id the shell looks up is 'VAULT' or 'ADMIN_VEHICLE', not a motorist id, and a separate ghost-killer strips those ids from lower-tier accounts on purpose.
type: entity
created: 2026-08-14
updated: 2026-08-14
tags: [kpm, app-shell, identity, profile]
---

# The Admin Agent Profile Id

His report, 2026-08-14: *"profile picture should follow the user agent profile picture"*, and then,
when told the wiring looked correct: *"my agent profile is either mobil pak bos or master owner so
u are wrong on that assumption for there is no picture on agent profile"*. He was right to push
back — the guess that his Agent Profile simply had no image was never checked.

## How the shell resolves the face

`App.jsx` hands the shell one prop:

    agentPhoto={motorists.find(m => m.id === (agentProfileId || 'master_owner'))?.profileImage || null}

and the shell falls back to `user.photoURL` (the Google account picture) when that is null. So the
whole question is **what `agentProfileId` contains**.

For an ADMIN it is not an agent id at all (`App.jsx:4195`):

    agentProfileId={userRole === 'ADMIN'
      ? (adminSalesMode === 'VEHICLE' ? 'ADMIN_VEHICLE' : 'VAULT')
      : agentProfileId}

## 🔑 The finding

**`'VAULT'` is not a motorist id.** In vault mode the `find` can never match, `agentPhoto` is null,
and the shell falls through to the Google account photo — every time, no matter what is set in
Agent Profile. That alone explains the symptom for any session spent in vault mode.

`'ADMIN_VEHICLE'` *may* match a real motorist (the boss's own vehicle, MOBIL PAK BOS). **Not yet
verified** — nobody has looked for a motorist document with that id carrying a `profileImage`. That
is the one thing left to check, and it is checkable from inside the app.

## ⚠️ The line that looks like the bug and is not

`App.jsx:2220`, inside the branch for a **non-master account**:

    if (trueAgentId === 'ADMIN' || trueAgentId === 'ADMIN_VEHICLE') {
        console.warn("Corruption blocked: Stripping Admin Vehicle from Tier 4 account.");
        trueAgentId = null;
        if (uidSnap.exists()) updateDoc(uidRef, { agentId: null }).catch(...)
    }

This is a deliberate ghost-killer: a Tier 4 account must never carry the boss's vehicle id, and it
is stripped **and written back to Firestore as null**. It does not run for the master account, so
it is not what breaks the boss's own picture. **Do not remove it to "fix" the photo** — it writes
to the database, and it exists because that mistagging really happened (see the sibling repair at
`App.jsx:1743`, which maps a legacy `'ADMIN'` agentId onto `'ADMIN_VEHICLE'` for report lookups).

## Related

- [[../Concepts/The KPM Control System]] — the shell that renders the face.
- [[../Concepts/Anti-Recurrence Check]] — this page exists because a plausible guess was reported
  as a cause once already.
