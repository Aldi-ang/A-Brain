# Rank Frames — ACCEPTED

Six avatar frames for KPM Inventory, Bronze through Mythic. **Aldi accepted all six on
2026-07-31** ("this mytic border is fire man i accept all the border").

## Files
- `rank-frames.css` — all six frames, self-contained
- `markup.html` — the markup each frame expects
- `svg-defs.html` — SVG turbulence filters, needed once per page (Platinum + Mythic)

## The six

| Rank | Name | Reference studied | What moves |
|---|---|---|---|
| 1 | Bronze | wooden frame | **Nothing.** Pure material — grain, knots, iron straps |
| 2 | Silver | silver | One white bloom walking the rail, masked so it never leaves |
| 3 | Gold | gold frame | Four white-hot spots drifting on a dark molten bar |
| 4 | Platinum | corrupted grace | Black/white marble churning on SVG turbulence |
| 5 | Diamond | time winder platinum | Scattered blocks popping at staggered intervals |
| 6 | Mythic | boss warlord | One red eye blinking + 26 violet shards cutting in and out |

## Rules that produced these

Written down because breaking them is what produced four rejected rounds:

1. **Nothing rotates.** No Steam frame spins. Uniform rotation is the clearest tell of cheap.
2. **Structure is static, only light moves.**
3. **Uneven hot spots on unrelated periods** — never one uniform sweep.
4. **Two or three motion systems at once.**
5. **Real bloom over hard structure** — needs `filter: blur()`, not a gradient pretending.
6. **Texture carries the low tiers.**
7. **Multi-stop irregular keyframes.** A two-stop `alternate` is a pure oscillation and always
   reads mechanical no matter the speed.
8. **Anything animated must also be masked**, or its bloom paints outside the frame. This caused
   two separate escape bugs.

## Known constraints

- **Frames are SQUARE.** `AgentProfileView` renders a round avatar today — it needs updating.
- **Lite Mode is the fallback, not the target.** Borders are exempt from Lite-Mode-first design;
  `.lite` strips filters, blends, shadows and animation.
- **Purple is allowed on Mythic only.** Everywhere else the no-blue / no-green palette law holds.
- **Copyright:** the Steam frames were motion reference only. Nothing here is copied or traced.
  Aldi twice asked to copy them directly; declined — this is original work and safe to ship.

## Not yet done
- Wiring into `rankBorders.jsx` (the existing registry is circular and gradient-based)
- Achievement-unlock frames from the remaining folder videos
