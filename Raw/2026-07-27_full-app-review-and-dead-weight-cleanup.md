---
title: "Full App Review and Dead-Weight Cleanup — session transcript excerpt"
description: Ponytail-ultra review of kpm-inventory against the last two fix batches, plus the dead-weight/hygiene cleanup it led to (commit ce3b001).
created: 2026-07-27
tags: [raw, kpm, ponytail, cleanup, review]
---

Source: CCD session "Full app review and git integrity audit"
(local_f7818176-4072-4b5a-beeb-fbb39e5b7ae9), worktree
`claude/app-review-git-audit-18fea5`, 2026-07-27.

## Review findings (ponytail /review ultra)

Ran `/ponytail:ponytail ultra` review against the repo, diffing current state against the
last review's claims rather than re-running a full 4-agent sweep (already fresh/verified).
Build was clean; almost everything from the prior review batches was already fixed and
merged to `main` (`74a02d2` + `d3ec78f`, both in PR #3).

Ranked task list produced:

1. **Deploy the Firestore rules (blocks everything else).** Every permission fix from the
   last two review batches — Fleet Captain gaps, rank-config coverage, pending_audits — is
   sitting in `firestore.rules` as a verified-but-undeployed draft. `firebase deploy --only
   firestore:rules` is the one command needed. Flagged as the single highest-leverage open
   item: "the fixes don't exist yet in prod."
2. **Delete dead weight:**
   - `src/Duke3D.jsx` — unused, referenced a `.glb` that doesn't exist, would crash if ever
     imported.
   - `@react-three/drei`, `@react-three/fiber`, `three`, `clsx`, `tailwind-merge`, `react-is`
     in `package.json` — zero imports anywhere except the dead file above.
   - `src/monalisa.jpg` (189KB, unreferenced).
3. **Small hygiene (~5 min total):**
   - `App.jsx:999` — stale dev note `PINPOINT: Line 1830`, line number now wrong.
   - `App.jsx:1840,1856` — `'THE_OWNER_EMAIL@gmail.com' // Replace later` duplicated in the
     VIP list twice, with the two copies already drifted into slightly different comments.
   - `.firebase/hosting.ZGlzdA.cache` tracked in git by mistake — should be gitignored.
   - 5 leftover `console.log`s in `App.jsx`, including one logging the full Firebase user
     object on every login, and two ("GOD MODE DETECTED" / "OFFLINE GOD MODE ENGAGED") that
     announced a security bypass to anyone with devtools open.

Explicitly confirmed already-done (not on the list): Rank Config rule gap, all 21 missing
`onSnapshot` error handlers, motorists/products Fleet Captain permission gaps, all unchunked
bulk writes, dark mode toggle wiring, search box wiring, logistics-notification read-state,
and `formatRupiah`/`compressImageToBase64`/role-translator duplication all consolidated into
shared helpers.

## Execution — user asked for items 2 and 3

User: "i want u to do 2 and 3 then." Executed on a new branch `cleanup-dead-weight-hygiene`
(off `main` at `ce3b001`'s parent). Committed as `ce3b001`:

```
chore: delete dead weight, dedupe VIP list, drop debug console.logs

- Remove src/Duke3D.jsx (unused, referenced a nonexistent .glb) and its
  now-dead deps: @react-three/drei, @react-three/fiber, three.
- Remove clsx, tailwind-merge, react-is — unused anywhere in src/.
- Remove src/monalisa.jpg (189KB, unreferenced asset).
- App.jsx: the masterVIPs/isDeveloper VIP-email check was declared twice
  in the same auth handler (once for the try block, once shadowed inside
  it for the offline-crash catch handler) — already drifted into two
  slightly different comments. Consolidated to one declaration before the
  try block (still visible to the catch below); dropped the unclaimable
  'THE_OWNER_EMAIL@gmail.com' placeholder from both copies.
- App.jsx: removed a stale dev pinpoint-note comment with a since-moved
  line number, and 5 leftover debug console.logs — including one that
  logged the full Firebase user object on every login, and two
  ("GOD MODE DETECTED"/"OFFLINE GOD MODE ENGAGED") that announced a
  security bypass to anyone with devtools open.
- .firebase/hosting.ZGlzdA.cache was tracked in git by mistake (it's a
  regenerated local CLI cache); untracked and gitignored.

Build clean.
```

Stat: 7 files changed, 20 insertions(+), 694 deletions(-). Not pushed / no PR opened as of
this session — flagged as skipped, "say the word if you want it up."

Verified per its own diff via `git show --stat`, not just the commit message (see
[[../Wiki/Concepts/Anti-Recurrence Check]]).
