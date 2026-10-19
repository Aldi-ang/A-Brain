---
title: Publishing a Fix
type: concept
confidence: high for the PC path (done three times 2026-10-19); untested for the cloud path
checked: 2026-10-19 kpm 0c7e606
---

# Publishing a fix — from "fix it" to live, without him touching anything

His words, 2026-10-19, after three pushes in one afternoon went through with no GitHub window:
*"actually i like it this way that u can push it yourself make sure the cloud session can do that too and also put that on the A brain for the new automation workflow that u just did, its step us further for our agentic agent behaviour"*.

## What "live" means here
- A push of `phase0-solid-ground` to GitHub IS the live app: Vercel sees it and builds it (his own words earlier: *"whenever we push a new version of the app, the biometric reset"*). `main` is not the live branch.
- The push itself needs no approval window on the PC: the repo's git config names the account (`credential.https://github.com.username = Aldi-ang`), so Git Credential Manager uses the saved login. A-Brain got the same line on 2026-10-19 ~19:58 (his "okay nice u can push it now"), and its end-of-session automation already uploads the vault by itself.
- Firestore rules are NOT part of a push. `firebase deploy` is denied in his settings; he publishes rules himself from the Console (paste the file, Publish). When code needs a new rule, the rule goes live FIRST.

## The workflow (what Alucard does on "publish" / "push" / "fix the publish")
1. Diagnose first and let him pick (his standing rule) - unless he already named the fix.
2. Write the guard first and see it go RED on the old code (`src/config/logicFixes.selfcheck.mjs`), then edit until it is green.
3. After the LAST edit: `node src/config/logicFixes.selfcheck.mjs`, `npm run build`, `node src/config/integration.audit.mjs` - all green. Anything visual: render it (see [[Looking at the App]]) - a measurement is not a look.
4. `git rev-list --count HEAD..origin/phase0-solid-ground` must be 0 (nothing newer on GitHub), then commit with the full story in the message (his "tell it once" rule).
5. `git push origin phase0-solid-ground`, then `git fetch` and confirm `origin/phase0-solid-ground` is the new commit - that, not the push output, is the proof.
6. Tell him the hash; he checks the vault card's "Latest version · <hash>" line before testing.
7. Vault + PROGRESS.md + NEXT-SESSION.md, committed.

## Still his, never automatic
- Rules publishing in the Firebase Console.
- Whether to push at all when he did not ask: the default since 2026-09-06 is still commit locally and stop (the "don't push every update" note in the PC memory). His 2026-10-19 call removes the approval WINDOW, not his word.

## The cloud path (untested)
A cloud session works on its own branch (one pushed `claude/trusting-albattani-yd6b0e` before). Its GitHub proxy may refuse a push to any other branch. So in the cloud: try `git push origin HEAD:phase0-solid-ground`; if refused, push the session branch and tell him plainly the work is NOT live until the PC merges it. The first cloud session that publishes must report which of the two happened and update this page.

## Proof it worked (2026-10-19)
`f292af6..ffcc9a6` (100-users fixes), `ffcc9a6..de4e02b` (logout waits + vault way out), `de4e02b..0c7e606` ("Log out" label) - each one built by Vercel; his screen showed `ffcc9a6` on the vault card.
