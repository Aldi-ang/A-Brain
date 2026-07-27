---
title: Remove unused code and dependencies
description: Duke3D.jsx, monalisa.jpg, and 5 of 6 flagged deps removed and PR'd — but the "no functional risk" claim below was wrong for react-is, and react.svg was never actually touched.
status: Ready to Deploy
area: Cleanup
priority: Low
created: 2026-07-26
updated: 2026-07-28
---

# Remove unused code and dependencies

**Update 2026-07-28**: executed on branch `cleanup-dead-weight-hygiene`
([PR](https://github.com/Aldi-ang/kpm-inventory/pull/new/cleanup-dead-weight-hygiene), not
yet merged). Corrects the original claim below — **it was not actually risk-free**:
`react-is` broke the Vercel production build because `recharts` imports it internally, even
though nothing in `src/` did. Fixed by restoring it (commit `9cddd45`), verified with a real
build. Full story: [[../Wiki/Summaries/Dead Weight Cleanup and Rules-Deploy Gap]].

- ✅ `src/Duke3D.jsx` — removed
- ✅ `src/monalisa.jpg` — removed
- ❌ `src/assets/react.svg` — **still not done**, the cleanup commit never touched it despite
  being asked for
- Dependencies: `@react-three/drei`, `@react-three/fiber`, `three`, `clsx`, `tailwind-merge`
  removed. `react-is` removed then **restored** — it wasn't actually unused (see above).

## Original text (2026-07-26), kept for the record — one claim in here was wrong

Confirmed still present on `main` as of 2026-07-26:

- `src/Duke3D.jsx` — never imported anywhere, references a `.glb` file that doesn't exist, would crash if it were ever used
- `src/monalisa.jpg` (189KB) — unreferenced
- `src/assets/react.svg` — Vite template leftover, unreferenced
- Unused dependencies in `package.json`: `@react-three/drei`, `@react-three/fiber`, `three` (only used by Duke3D.jsx), `clsx`, `tailwind-merge`, `react-is`

~~No functional risk either way — pure housekeeping, smaller install/build.~~ **Wrong** — see
the 2026-07-28 update above.
