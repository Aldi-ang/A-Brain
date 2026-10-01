---
title: Master Vault Gate
description: The master-password screen every KPM session starts at — its five modes, the numbers Aldi locked, and the decisions that are closed.
type: entity
created: 2026-08-10
updated: 2026-10-01
confidence: high
checked: 2026-10-01
tags: [kpm, ui, auth, vault-gate, phone]
---

# Master Vault Gate

The screen guarding the KPM app behind the master password. Internally the `showAdminLogin`
modal in `src/App.jsx`, with its canvas in `src/components/VaultGate.jsx` (~335 lines). Not to
be confused with `handleLogin` (`App.jsx:2314`), which is the Google sign-in popup.

Redesigned end-to-end as "JOB 6", 2026-08-09 → 2026-08-10. **Finished and signed off.**

## Five modes

Everyday unlock, setup, recovery, OTP, and biometric. The dot field is the background of **all
five**, dark until a pointer or a finger reveals it. The shield and the SECURITY CHECK heading
render for **setup, recovery and OTP only** — those really are an alarm; the door he opens daily
is not.

## The numbers Aldi locked — hard-coded, pinned by audit checks

```
background spacing 26 · letter density 7 · name size 0.10 · wave 3.00s
unlock sequence 8.5s (GATE_UNLOCK_MS)
outro: opacity 200ms ease / transform 420ms cubic-bezier(.16,1,.3,1)
```

`public/sounds/vault-b.mp3` is cut to the 3.0s wave — tok 4.50s where the name completes, ticks
6.70s, release 6.9s. **Move the wave and the mp3 must be regenerated** (a plain Node PCM script
plus ffmpeg). Because he kept the existing outro, no regeneration is currently owed.

## Decisions that are CLOSED — do not reopen

- **Design**: Variation B, the dots that become his name. Chosen after two rejected rounds.
- **Timing**: 8.5s. *"timing is fine"*.
- **Outro**: the existing fade-and-shrink, kept over three designed alternatives he played.
- **Card**: near-black on a rust hairline, the field an underline not a box, the submit a
  hairline not a red slab, fingerprint + recovery on one small line.
- **The nav button is hidden while the gate is up.** Raising the modal's z-index does not work —
  the button sits in its own stacking context, so `z-[9999]` never beats its `z-[100]`. It must
  not be rendered at all.
- **Backdrop is solid black**, not `black/95`; the app was bleeding through as ghost text.

## Traps recorded in code, each guarded by a check

- The ring is drawn on the canvas from the dots' own `front` — **one clock**. Two clocks drifted
  once and Aldi spotted it before the audit did.
- `pointerdown` is a listener, never a hover — a phone has no hover.
- The `onKeyDown` Enter handler was **removed** when the field became a real `<form>`; both
  together fire `handlePinLogin` twice and **each call spends one of his five PIN tries.**
- Fingerprint and Lost-your-key are explicitly `type="button"` — inside a form they would submit.
- `autoFocus` only when there is a mouse. On a phone it raised the keyboard over the panel and
  the first tap was eaten dismissing it.
- Lite Mode and reduced motion never load the canvas; the app renders a plain ACCESS GRANTED
  block instead. Two separate flags: `gateCanvasOn()` (the field) and `gateIsRich()` (the
  sequence). One flag doing both jobs deleted the background for anyone with iOS Reduce Motion on.

## Phone history

Three real fixes preceded the actual cause. See [[Secure Context Requirement]] — the gate could
not hash a password over plain HTTP, and [[Silent Failure Disease|said nothing about it]].
**The dev server is HTTPS from now on: `https://192.168.1.141:5173/`.** Safari warns once about
the self-signed certificate; that warning is expected.

## Biometric is Vercel-only, by design (2026-08-15)

`App.jsx:1118` — `rp: { id: window.location.hostname }` — locks each registered passkey to the
exact hostname that created it. Registered at the Vercel address, opened at a LAN IP
(`192.168.1.109`): different host, so the device reports no key. **Nothing was lost or reset** —
it is a different origin starting blank, same as a brand-new phone. It can never work on a LAN IP
regardless of re-registering: **WebAuthn rejects a bare IP address as `rp.id` outright**, and
refuses to run on any page showing a certificate warning, which the self-signed LAN dev server
always does. The 5-minute vault grace period (`localStorage['kpm-vault-grace']`) is the same
per-origin shape, so "biometric is gone" and "grace is gone" reported together are one fact, not
two bugs. Full write-up: [[The KPM Control System]].

## The side-menu logout kept the 5-minute pass (2026-10-01, kpm 0e285e6)

His words, Samsung: *"i sign in my google account and its skipped everything now, no master vault UI just straight inside the app"* - confirmed: *"yes i press the terminate session just now"*. Two logout handlers existed: App.jsx handleLogout (clearGrace + signOut, wired only to the lockout screens) and BiohazardTheme.jsx handleLogout (the side menu, "Terminate Session?" - signOut + reload, NO clearGrace). The kpm-vault-grace record survived the side-menu logout, so the same account signing back in within 5 min of its last tap got the vault without the password. Fixed: clearGrace() before signOut. Proof: lab ?shell&admin, pass stored -> Log out -> confirm: kept before, gone after. Guard: logicFixes "EVERY LOGOUT ENDS THE 5-MINUTE VAULT PASS" checks BOTH handlers. Lesson: a rule that says "X clears Y" must be checked against every handler that does X, not the one with the obvious name.

CONFIRMED on his Samsung after the push (~10:05): *"sign in work, no grace period work, name showing in tier 1, no duplicate tab also work"* - Terminate Session now makes the vault ask again.

Also 2026-10-01: the unlock name vanished on the Samsung - [[A Resize Mid-Unlock Wiped the Name]].

## Every person opens the app with their own password (2026-10-01, kpm 6857f27)

His words: *"i want the other user also have password and their agent name displayed on the intro animation"*. T3-T6 (no vault) with a roster profile now meet the gate on entry (`entryLocked`); their password opens their OWN app (`appUnlocked`), never the vault; the unlock plays the intro with their name; their own 5-minute pass. Every unlock path goes through `openGate()`; `gateUp = showAdminLogin || entryLocked` is the one flag for "gate is up". T1/T2 unchanged. Proof on the emulator with T5 Budi (rules enforced): gate on entry, own vault_keys doc created, BUDI in dots, pass skips a reload, sign-out relocks. TRAPS met: (1) screens with their own z-[9999] (Journey Plan Fullscreen, a T5 landing tab) paint over the gate - so nothing behind the lock renders (`user && !entryLocked`); (2) 5 logicFixes + 3 audit checks pinned `showAdminLogin` text - retargeted to gateUp. RISKS before push: live rules must carry CHANGE 11 vault_keys or every T3-T6 is locked out; first unlock must be online; Forgot-password mail needs the EmailJS {{to_email}} fix; the first-time screen still says ADMINISTRATOR CREDENTIALS.

## Open against this screen

- A split second of the old ACCESS GRANTED panel still shows after pressing enter-vault (phone,
  reported 2026-08-10).
- Master password is demanded on every app switch, because iOS discards the page. A grace period
  is proposed and undecided — it is a real security trade-off and is Aldi's call.

## Related

- [[Secure Context Requirement]] · [[Silent Failure Disease]] · [[Aldi's Design Taste]]
- Source: [[../../Raw/2026-08-10_source_kpm-six-days-aug04-to-aug10|the six-day source]]
