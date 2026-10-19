---
date: 2026-10-19
status: OPEN — diagnosed, waiting on Aldi's pick
confidence: mixed (tag per line)
checked: 2026-10-19 kpm ffcc9a6 (live build he was on)
---

# Logout signs him straight back in; two accounts in two tabs log each other out

## Problem, his words
*"im on my tier 1 account and it is annoying that when i logout it autolog me again i cant even change account to my salesman account at this point, and another problem is why when i open multiple account inside the same browser it logout the other account inside the same browser but different tab can this be fixed"*

## Diagnosis
1. **Logout does not finish before the page reloads.** [certain] `src/components/BiohazardTheme.jsx` handleLogout (side menu "Terminate Session?") calls `signOut(auth)` WITHOUT await and then `window.location.reload()` at once. [likely] signOut removes the saved login from browser storage asynchronously; the reload cuts it off, so the saved login survives and the app signs the same account in again on load. App.jsx's own handleLogout awaits it; this one does not. Same handler as the 2026-10-01 fix `0e285e6` (that one added clearGrace, a different defect).
2. **The Master Vault screen has no way out.** [certain] `src/components/VaultGate.jsx` has no sign-out / "use another account" control, so once the app lands there he can only type the T1 password - he cannot reach his salesman account.
3. **One login per browser is how Firebase works.** [certain, Firebase design] Sign-in is saved once per site and shared by every tab; signing in account B in tab 2 replaces account A in tab 1 too.

## Options
| | What | Cost |
|---|---|---|
| A (fix 1+2) | await signOut before reload; add "Use another account" on the vault screen | small, 2 files |
| B (for 3) | test a second account in a second browser profile or an Incognito window | no code |
| C (for 3) | per-tab login (session persistence) | every new tab and every reopened phone app asks for Google again; breaks offline sign-in for salesmen - rejected unless he insists |

## Decision
OPEN — waiting on Aldi.

## Rejected on purpose
- C as a default: salesmen reopen the app all day, often offline; per-tab login would lock them out.

Models applied: Inversion (what keeps a user signed in after logout), Second-Order Thinking (per-tab login moves the pain to every salesman).
