---
title: The Boss Is the Raw Firebase User
description: Why the owner got the field agent's camera lock on his own sales terminal — the boss's `user` object is the unmodified Firebase auth user and carries no role, so any screen that reads the tier off `user` alone sees him as tier 5. The fix, the guard, and the one screen still open.
type: entity
created: 2026-09-13
updated: 2026-09-13
confidence: high
checked: 2026-09-13
tags: [permissions, tier, sales-terminal, stock-opname, camera, kpm]
---

# The Boss Is the Raw Firebase User

**The symptom.** Aldi, tier 1, opened a sale and got `CAMERA UNAVAILABLE — No camera was found
on this device. This sale needs a photo taken now, so it cannot be completed here.` His words,
2026-09-13 19:50: *"bruh im tier 1 and have this camera lock i cant check by making sales when i
still have this, tier 1 should be able to bypass everything bro"*.

**Not a permissions bug.** `canPickFromGallery('ADMIN')` in `permissions.js` has always returned
true — tier 1 may choose from the gallery. The matrix was never asked about tier 1.

**The mechanism.** Two kinds of signed-in user exist in `App.jsx`:

| who | what `user` is | carries `userRole`? |
|---|---|---|
| a motorist / any non-boss | `hijackedUser` — a hand-built object with `role`, `userRole`, `agentId`, `realUid` | yes |
| **the boss** | `setUser(currentUser)` — the raw Firebase auth user | **no** |

The role for the boss lives in App's `userRole` state (`setUserRole('ADMIN')`), and every screen
receives it as `userRole={userRole}` — except `MerchantSalesView`, which read
`user?.userRole || user?.role` off the user object alone. For the boss that is `undefined`, and
`translateLegacyRole(undefined)` is TIER_5. The owner arrived at his own terminal as a field
agent: camera only, and the sample lock (`can_unrestricted_sample`) read the same way.

**The fix — `0ff0732`.** App passes `userRole={userRole}`; the terminal reads
`const myRole = userRole || user?.userRole || user?.role` and uses it at both permission reads.
No permission changed hands — the matrix decides exactly as before, it is just asked about the
right person. Guarded in `logicFixes.selfcheck.mjs`, THE BOSS IS TIER 1 ON THE SALES TERMINAL
TOO: App hands the role over, the terminal reads the prop first, both sites use it, and the
`TIER_5` default of a missing role is pinned from source (so the mechanism is on record).

**The rule.** A screen must never learn the tier from `user.*` alone. Take `userRole` as a prop
from App, and treat the user object as the fallback for the non-boss case only. The grep that
finds the next one: `user?.userRole` / `user.userRole` across `src`.

**Still open — `StockOpnameView.jsx:200`**: `const userRole = user?.userRole || 'AGENT'`, mounted
without the prop. The boss is a field agent on Stock Opname today. Written as the next job in
the repo's `NEXT-SESSION.md`; not fixed in the same commit because it was a fourth file.

**Same family.** [[Fleet Captain Permission Gap]] — a tier check that matched the UI's idea of the
tier and not the backend's. Here the UI's idea was wrong for one person. And
[[UI-Says-Yes-Server-Says-No Pattern]] — the mirror shape.

## Related

- [[Fleet Captain Permission Gap]]
- [[UI-Says-Yes-Server-Says-No Pattern]]
- Repo: `git show 0ff0732`
