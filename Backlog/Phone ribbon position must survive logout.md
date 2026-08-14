---
title: Phone ribbon position must survive logout
description: The 3-second-hold position of the phone's edge ribbon is lost across sign-out, so the user re-drags it every login. It is already persisted to localStorage, so the job is finding what clears it — not building persistence.
status: To Do
area: App shell / BiohazardTheme
priority: Medium
created: 2026-08-14
updated: 2026-08-14
---

# Phone ribbon position must survive logout

**His ask, 2026-08-14:** *"make sure that adjustmen on phone sidebar is remembered even after
logout, so that the user dont have to hold and rearrange the button each time login"*.

The control is the **edge ribbon** on the phone — the 14px grip that opens the navigation. Moving
it costs a deliberate three-second hold (`RIBBON_HOLD_MS = 3000`), which was his own design so a
slanted thumb reaching for the menu could not drag it by accident. Because moving it is expensive
on purpose, losing the position is expensive too.

## 🔑 Start here — it is ALREADY persisted

`BiohazardTheme.jsx`, in the pointer-up handler of `startRailPull`:

    localStorage.setItem('kpm-ribbon-y', String(...))

So **do not build persistence.** `localStorage` survives sign-out on its own — it is scoped to the
browser, not to the session. Something is either clearing it or not reading it back. Check, in
this order:

1. **Does sign-out clear storage?** Look at `handleLogout` and anything it calls, plus any
   `localStorage.clear()` in the auth path. A blanket clear on logout is the obvious suspect and
   would explain the symptom exactly.
2. **Is it read back on mount?** Find where `ribbonY` is initialised and confirm it reads
   `kpm-ribbon-y` rather than starting from a default.
3. **Is the service worker or a PWA update wiping it?** The app is a PWA with workbox; a storage
   reset on activate would look identical to a logout bug from the outside.

Only if all three are clean is this a real persistence gap — and then the question becomes whether
it should live **per user in Firestore** instead of per device. Ask him: a per-device position is
correct if he uses one phone, a per-user one is correct if he signs in on more than one.

## Related

- The same file holds the desk strip — see [[PC sidebar hover-expand and top panel redesign]],
  which is a separate and larger job.
- Group 25 of `integration.audit.mjs` already pins the hold-to-move behaviour; whatever fixes this
  should get a check there so it cannot silently regress.
