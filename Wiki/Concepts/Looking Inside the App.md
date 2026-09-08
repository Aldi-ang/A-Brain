---
confidence: high
checked: 2026-09-08
---

# Looking inside the app

How the agent gets past the login screen of KPM without touching a real credential. Built
2026-09-08 on Aldi's word: *"okay sure make the emulator for better efficiency for both of us i
guess"*. Companion to [[Looking at the App]], which covers getting the app on screen at all.

## Two locks, and neither is opened by typing a password

**The transport.** `npm run dev` serves https with a self-signed certificate — correct, and it is
what lets Aldi test on a real phone, because `crypto.subtle` needs a secure context and his phone
arrives on a LAN address. The agent's browser cannot click through a certificate warning the way a
phone can, so it got a blank page. Fixed by `--mode httpdev` (repo `8abcf04`), which serves plain
http on port 5174. **`http://localhost` is a secure context by specification**, so nothing about the
app changes; only the transport to this one machine does.

**The identity.** Sign-in is `signInWithPopup(auth, googleProvider)`. The agent must not enter
credentials or complete a sign-in flow, and that is a boundary rather than an obstacle to route
around. So the app is pointed at a **local Firebase emulator** instead — a fake database with fake
people — and signed in with the emulator's own unsigned-token credential, which a real Firebase
project rejects outright.

## What was already there, and what was missing

`firebase.json` already carried the emulator ports and `src/config/firebase.js` already read
`VITE_USE_EMULATOR`. Somebody had built the switch and never wired anything to it. What was missing
was a way to turn it on without disturbing his live testing, an account, and data. That is the
usual shape here — check for the switch before building one.

## The three traps, all hit on the first run

1. **The Firestore emulator enforces `firestore.rules`.** The first seed attempt was refused with
   PERMISSION_DENIED, which is the emulator behaving correctly. Seeding needs the emulator's own
   `Authorization: Bearer owner` header — a string that means nothing to a real project.
2. **A popup cannot complete in a single-tab browser pane.** The Auth emulator's widget dies with
   *"No matching frame"* because there is no opener to post back to, and the account is not created.
   Hence the small auth handle exposed on `window`, inside the DEV+opt-in gate.
3. **The Auth emulator picks the uid, not you.** The `sub` in the token is ignored. So the seed runs
   in two passes: the `employee_directory` row keyed by EMAIL first (which is enough to let the
   login through, because App.jsx looks up by uid AND email), then the company under the uid the
   emulator assigned.

## The vault was seeded as data, not typed into the form

After login the app asks to INITIALIZE VAULT. `hashSecretWord` is SHA-256 over
`word.toLowerCase().trim()`, hex — and node's webcrypto produces the identical digest, so the same
value the app would have written can be written directly. Unlocking then used the `vaultGrace`
localStorage record, and that file's own comment is why this is not a bypass: *it grants nothing at
the server. Firestore rules still decide every read and write.*

**The general rule worth keeping:** when a gate wants a secret, look for where the secret is
*stored* and write that, rather than typing into the field. It is usually cleaner, always
repeatable, and it keeps the boundary intact instead of arguing about it.

## A dev door onto `window` is guarded, not trusted

`window.__kpmEmulatorAuth` reaching a real build is the one way this convenience becomes a
liability, so five assertions in `logicFixes.selfcheck.mjs` hold it shut — two of them RED-trialled
by replacing the gate with `true`. They assert the handle appears only AFTER the gate, that the gate
needs BOTH `import.meta.env.DEV` and `VITE_USE_EMULATOR` rather than either, that only vite's
`httpdev` mode sets the opt-in, and that the seeder names no host but `127.0.0.1:8080`.

⚠️ **Never loosen that gate to make something convenient work.** `npm run dev` must keep talking to
the live project, because that is what Aldi's phone testing measures. A seeder that can be pointed
at production is a script that will one day be pointed at production.

## What it does not solve

Layout and behaviour are now checkable at any width, on any screen. **Real data is not.** The fake
company is four products, two agents, three shops and three transactions — enough to make screens
render honestly, not enough to reproduce a bug that depends on his actual book. Anything about HQ 3,
HQ TEST, or a specific month still goes back to him.

Recipe and exact commands: `.claude/NEXT-SESSION.md` in the repo, and `tools/seed-emulator.mjs`.
Repo commits: `8abcf04`, `37f34ee`.

## Related

- [[Looking at the App]]
- [[Secure Context Requirement]]
- [[POV Changes the Id, Never the Email]]
