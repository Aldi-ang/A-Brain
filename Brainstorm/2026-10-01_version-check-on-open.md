---
date: 2026-10-01
status: DECIDED B, built kpm 9d276db
---

# Is the app on the latest version? — options (2026-10-01)

## The problem, in his words

*"i think we should put version number somewhere so that we know that the app is already at latest version or not or do u have better option to do so? sometimes i reload the page and login, waste a lot of time and energy just to login and realised late that the version is outdated then i will restart all over again is ineeficient"*

Today: the build id (`v{APP_VERSION} · {__BUILD_ID__}`) shows ONLY in the Flight Recorder panel title (App.jsx ~5442), which needs a signed-in user. The offline helper (main.jsx registerSW, autoUpdate) opens the STORED copy first, downloads a new one behind it, and reloads the page once when it takes over - so on a phone the reload can land after he has already signed in / typed the vault password.

## Options

| | What he sees | Cost |
|---|---|---|
| A | A small version stamp (e.g. `37a482b`) on the sign-in screen and the vault screen | Tiny. But he must know the LATEST id to compare with - he does not, unless told after every push |
| B (my pick) | The same stamp plus the app's own answer, before he types anything: "Checking for update…" -> "✓ Latest version" or "New version found - updating…" and it reloads by itself; offline -> "Offline - can't check" | Small: asks the offline helper to check (registration.update()) when the screen opens; no new service, no server |
| C | B, plus the Sign in / Open the vault buttons wait until the check finishes | Slower open every time; needs an offline escape; a hung check blocks the door |

## Decision

**B — his *"b is good"* (2026-10-01 21:09). BUILT kpm `9d276db`, pushed 21:34, CONFIRMED on his Samsung 21:37: *"yes latest version it is"*.** One line under "Sign in with Google" and under the vault's Fingerprint row: "Checking for update…" -> "Latest version" / "New version found - updating…" (the helper reloads into the new build) / "Update failed - close and reopen the app" / "Offline - can't check", + the build id. Muted ink, mixed case like the Fingerprint row (a first frame on the sign-in card used the `kpm-read` box, which looked like a second button - dropped). Proof: Raw/2026-09-30-potato-audit/t5-update.mjs + t5upd-*.png (old copy: checking -> updating -> reloads -> latest with B's id; the lab serves the build itself so the download can be slowed like a phone's).

## Rejected on purpose

- A server "latest version" endpoint (Vercel function / Firestore doc written on deploy): a second source that can disagree with the offline helper, and a push step to forget. The offline helper already knows.
- A version number from package.json alone: it has not changed across today's pushes (APP_VERSION is bumped by hand), so it would say the same thing on old and new.

Models applied: Inversion (a number he must compare fails exactly when he does not know the latest - which is always), Second-Order Thinking (the reload landing after sign-in is the real waste; the fix is to finish the update BEFORE he types).
