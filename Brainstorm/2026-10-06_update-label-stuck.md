# 2026-10-06 - "New version found - updating..." spins forever (diagnosed, not fixed)

**His report (16:50, a shot of the vault screen showing "New version found - updating… · 3396fa4"):** *"update keep spinning but not finished but i checked and looks like the app is updated"*.

**Root cause [certain on the label, likely on the trigger]:**
- `src/components/UpdateStatus.jsx:17-24` asks the helper ONCE when the screen opens. If a new worker is installing it says "updating" and then listens for ONE outcome only: `redundant` -> "failed" (line 23). There is no path to "Latest version" except a page reload.
- The reload comes from vite-plugin-pwa autoUpdate (`node_modules/vite-plugin-pwa/dist/client/build/register.js:40-45`): it reloads only when the activated worker is `isUpdate || isExternal`. A page that was NOT controlled by a worker when it loaded (a hard refresh, a fresh tab after site data was cleared, the first open after install) gets `isUpdate: false` -> no reload -> the label stays "updating" forever, while the page is already the new build (the id beside it, 3396fa4, is the new one).
- The 16:43 push changed no app code, so nothing broke; it only made a new worker to install.

**Options:**
| | Fix | Cost |
|---|---|---|
| A | UpdateStatus.jsx:23 also listens for `activated` -> "Latest version" (one line) + a logicFixes guard line | smallest; then a push (his word) |
| B | A + reload the page on `activated` like autoUpdate does | a surprise reload while he types the vault password - rejected |

**Decision:** his "fix and push" (18:18) -> A BUILT `519e13c`; proven by `Raw/2026-09-30-potato-audit/t5-stuck.mjs` (old code: "updating…" 30 s, 0 reloads; fixed: -> "Latest version"). Push held by his GitHub sign-in at 18:25.
**Rejected on purpose:** B (a reload under his fingers on the vault screen).
