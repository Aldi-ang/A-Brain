---
status: To Do
area: Cleanup
priority: Low
updated: 2026-07-26
---

# Remove unused code and dependencies

Confirmed still present on `main` as of 2026-07-26:

- `src/Duke3D.jsx` — never imported anywhere, references a `.glb` file that doesn't exist, would crash if it were ever used
- `src/monalisa.jpg` (189KB) — unreferenced
- `src/assets/react.svg` — Vite template leftover, unreferenced
- Unused dependencies in `package.json`: `@react-three/drei`, `@react-three/fiber`, `three` (only used by Duke3D.jsx), `clsx`, `tailwind-merge`, `react-is`

No functional risk either way — pure housekeeping, smaller install/build.
