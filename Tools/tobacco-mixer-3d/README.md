# 179×179 cm Baglog Steamer → Tobacco Mixer 3D & Anatomy

Interactive 3D mechanical simulator, physics engine, and isometric Anatomy parts breakdown for converting Aldi's **179 cm diameter × 179 cm height** oyster mushroom baglog steamer cylinder (with full-area Tupperware-style vault lid) into a dry *tembakau rajangan* blending tumbler — with a **171 cm human scale model** beside it.

## Files

| File | Purpose |
|---|---|
| `physics.mjs` | Real SI torque, critical speed ($N_c$), Froude regime, 144T:12T ring gear, 24:1 / 72:1 human crank force, and 3 HP / GX160 engine physics |
| `physics.test.mjs` | Node assertions verifying stall at 12:1 (300 kg), comfortable 72:1 crank force (4.6 kgf), 24:1 light batch (3.9 kgf), and 3 HP engine cascade RPM |
| `anatomy-builder.mjs` | 4-tone isometric SVG cutaway & exploded diagram (`lib/iso-kit.mjs`) with 10 clickable mechanical assemblies |
| `sim3d.mjs` | Three.js 1:1 metric 3D simulator with 1,650 instanced tobacco strands, cutaway shell, animated 171 cm human cranking, davit vault lid, and -12° keranjang unload |
| `app.js`, `index.html`, `styles.css` | Desktop & mobile UI with live telemetry, Anatomy tab, and Workshop BOM |
| `build.mjs` | Bundles self-contained `dist/` (`bundle.js`, `index.html`, `styles.css`) via `esbuild` with zero external CDN runtime calls |
| `verify-render.mjs` | Headless Chrome WebGL + mobile + Anatomy screenshot & console-error check (`A-Brain/Raw/2026-11-18-tobacco-mixer-3d/`) |

## Commands

```powershell
node Tools/tobacco-mixer-3d/physics.test.mjs
node Tools/tobacco-mixer-3d/build.mjs
node Tools/tobacco-mixer-3d/verify-render.mjs
```
