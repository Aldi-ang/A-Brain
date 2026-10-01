---
title: The unlock intro with their name, for every tier
type: brainstorm
status: DECIDED 2026-10-01 — beyond the options: a password for everyone (kpm 6857f27)
created: 2026-10-01
---

# The unlock intro with their name, for every tier (2026-10-01)

**Problem, his words:** *"can their name be displayed on the intro animation as well? if not then make it so that it can"* (same message as the own-profile ask, built kpm `28b5d14`, and *"how can i put password for other users?"*).

**What is true today [likely, code read - not run on a real T2 account]:**
- The intro is the VAULT UNLOCK (VaultGate dot wave + WELCOME BACK + name). It plays only for people who open the Master Vault: T1 (ALL_ACCESS) and T2 by default (`view_master_vault`, permissions.js). T3-T6 never see a vault, so they never see the intro.
- The name is already the person's own: App.jsx:4429 `agentName = (profileName || displayName).split(' ')[0]`, and profileName comes from THEIR directory / roster row (App.jsx ~2686 owner, ~2744 / ~2754-2802 employees). So a T2 sees their own first name.
- Passwords (his rule 2026-09-28, pick A): everyone makes their OWN vault password the first time they open the vault; nobody, not even T1, can see or set it. T1/T2 can reset it on Fleet & Roster (typed "confirm") - that deletes it and the person makes a new one next visit; "Forgot password" mails a recovery code.

| Option | What T3-T6 see | Cost |
|---|---|---|
| A. As is | nothing - straight into the app after Google sign-in | no work; field staff never get the greeting |
| B. Same intro after sign-in | the same dot wave + WELCOME BACK + their name, once per Google sign-in, no password | ~8.5 s once per sign-in (rare - the session stays signed in); Lite Mode shows the plain box |
| C. Short greeting | the plain 1-second "WELCOME BACK, NAME" box (the Lite Mode one) after sign-in | quick; not the full animation |

**Decision (11:20):** none of A/B/C - his *"i want the other user also have password and their agent name displayed on the intro animation"*: T3-T6 get the same gate with their own password on entry, and the intro with their name on unlock. Built kpm `6857f27`; see [[Master Vault Gate]].

**Rejected on purpose:** B and C (intro without a password). And giving T3-T6 the VAULT itself - their password opens only their own app (appUnlocked), never isAdmin.

Models applied: Second-order thinking (who signs in how often - a field phone stays signed in for weeks, so the cost lands rarely); Opportunity cost (C is cheaper but loses the animation he asked about).
