---
type: brainstorm
status: OPEN — waiting on Aldi (his character count, the finger-drag test, which "web", two decisions)
date: 2026-09-28
project: kpm-inventory
confidence: likely
checked: 2026-09-28, kpm `079330d`, read-only (no code changed)
---

# Master vault: the password is "wrong" on every device (2026-09-28)

## The problem, in his words

- *"yes there is capital letter on the password and yesterday push i use my phone i already reset the password and its already correct when i enter again but the push just now i enter the resetted password and its wrong i even use the password that i use on the localhost but wrong"*
- *"animation is working on the web but not in the shortcut and i tried to login from pc to the app but the password said its wrong so i reset again and i already hard refresh the app but it still showing the old one"*
- Same message: the home-screen shortcut's top is cut by the iPhone notch; the T1 intro says "welcome" and then nothing where the name should be.

He has reset twice. Every wrong press is a strike; 5 = PERMANENT lock (`App.jsx:1118-1119`, Firebase Console only).

## What was found (read-only)

| # | Finding | Confidence | Evidence |
|---|---|---|---|
| H4 — RULED OUT 11:15 | The vault box takes at most **15** characters; the setup/reset box takes **25**. His answer: *"my password only 10 letter"*, *"containing letter number and symbol"* — it fits. The 15 vs 25 mismatch is still real for any future 16-25-character password. | ruled out by his count |
| — RULED OUT | A reset made in the 09-06 copy writes a pin the new code cannot read. No: the old copy hashes SHA-256 of the lowercased, trimmed password — exactly `verifySecret`'s old branch. | certain (`git show 04e1705:src/App.jsx` L951-967, L989) |
| — | His T1 is the developer path: `POV_OWNER_EMAIL` = his Gmail (`src/config/povPreview.js:26`) → `bossUid` null → the vault is under his own uid. | certain (`App.jsx:2613-2615`) | `App.jsx:4525` `maxLength={15}` vs `:4429` `maxLength={25}`, both since `d363813` (2026-04-08); save `:1037`, auto-open `:1071-1072`, strike `:1150-1152` |
| — | Localhost is the SAME vault as live: same database folder. | certain | `src/config/firebase.js:82` `appId = "cello-inventory-manager"`; emulator only with `VITE_USE_EMULATOR=true` (no `.env.local`) |
| H1 | The 09-06 live copy (`04e1705`) compares `hashedInput === data.pin`; a salted pin is an object, so every try there is wrong and adds a strike; its own reset writes the old string form back. Active only if the home-screen app is still that copy. | certain (mechanism), unknown (whether his shortcut is old) | `git show 04e1705:src/App.jsx` L1069-1072 |
| H2 | He is signed in with another Google account somewhere (another uid = another vault doc). | guessing — no evidence | — |
| H3 | Something rewrote `settings/admin`. Writers: setup `:1066` (whole doc), unlock/strike `:1135` `:1152`, recovery `:1210` `:1232`, passkeys `:1294` `:1310`; employees read the boss doc (`hijackedUser.uid = trueBossUid`, `:2727`) and the rules draft denies them writes (`firestore.rules:540-543`). | guessing — nothing found | — |
| (c) | The intro name: App sends the Google first name or the email's name (`App.jsx:4338`), never empty; so the blank is a DRAWING miss — the name is canvas dots (`VaultGate.jsx:313-315`), "Welcome back" is page text (`:323`). | certain (data side) | — |
| (3) | The shortcut's missing animation: `VaultGate.jsx` has not changed since 09-06, so an old copy would still animate; Lite Mode (`kpm_lite_mode`, `App.jsx:1368`) lives in the app's own storage and iOS gives a home-screen app its own storage, separate from Safari. | likely | — |

Login box input rules are fine: `autoCorrect/autoCapitalize off`, `spellCheck false` (`:4513-4516`); both paths `.trim()`.

## Options (for after his answers)

| Option | What it does | Cost |
|---|---|---|
| A. One length for both boxes | the vault box takes what the setup box takes; his CURRENT password opens, no third reset | ~2 lines + a guard (login max >= setup max) |
| A+. Gate words | the vault screen shows which Google email it checks (never the secret), "capital letters count", "N tries left" (`5 - failedRecoveryAttempts`) | ~15 lines |
| L1. Lock for good at 5 (today) | only the Firebase Console reopens | zero code; one bad day locks the owner out |
| L2. Lock 15 minutes at 5 | a `lockedUntil` time, then tries again; recovery path unchanged | ~10 lines; a thief gets 5 guesses per 15 min |
| S. Re-add the home-screen icon | gets a fresh copy; wipes that app's own sign-in and Lite Mode | his action, zero code |

## Decision

OPEN — waiting on Aldi. Option A is dropped (his password is 10 characters). Owed: ✅ his read-only Firebase Console look (Authentication list with last sign-in; the admin doc's `updatedAt`, `failedRecoveryAttempts`, the shape of `pin`; how many uids hold an admin doc) — it separates H1 / H2 / H3; ✅ finger-drag on the shortcut's vault screen; ❓ "web" = iPhone Safari or PC; 🔴 A+ (the gate words) yes/no; 🔴 L1 or L2 (recommended L2).

## Rejected on purpose

- Asking him to "just try again" to test a theory — every try is a strike, 5 is permanent.
- A fan-out of agents for this diagnosis — the Agent gate blocked it (his rule: a workflow only when he asks in his own words); done solo.
- Making the login box a plain `type="password"` everywhere — `CAN_MASK_TEXT_INPUT` (`App.jsx:166`) exists because the phone flashes each typed character; not the cause, not touched.

Models applied: Inversion (what makes EVERY password wrong on EVERY device? a check path that cannot see what the save path saved), Reversibility Test (the lock rule: a permanent lock is a one-way door for the owner).
