---
date: 2026-10-03
status: OPEN - waiting on Aldi's pick (marks A/B/C, key motion 1/2/3, new layout per width)
tags: [kpm, journey-plan, design, map, motion]
---

# Journey Plan's map - key motion, key ergonomics, a more artistic shop mark

**Problem, his words (2026-10-03 ~02:00):** *"animation for the paintbrush and other button should also improves to
looks like high tech but simple kinda animation and also we should increase the ergonomic from this features, and i
feels like i dont like that gold color on the font and stores marked there i feels like it is missing something
artistic can u improve it as well make sure that animation is fully here without being heavy just simple but elegant"*.

**What is on the map today (kpm `d321daf`, `src/JourneyView.jsx`):** every cluster bubble = gold number + gold ring +
an ORANGE glow (`rgba(249,115,22,.5)`, ~line 31); every shop pin = a dark disc with an emoji (📍 ✅ 📦 🛑 ⚠️ 📝 🔒)
and a glow in its ring colour (~line 46, ~1180); the keys (fullscreen, borders, set home, fly home) float top-right
and show their names only under the mouse; the brush list rows are ~32 px with first names cut at 80 px and an orange
slab for "Disable brush". "Gold on the font and stores marked" = the gold numbers and gold rings on every bubble.

Live page (all switches, Lite, slow x4): https://claude.ai/artifact/TGZErRUq8nuib7kG8sYxLL
Board: `Raw/2026-10-03-map-keys/board.png` (`shoot.mjs` shoots it; frames `f-*.png`, numbers `measure.json`).

## Shop marks

| Look | What | Costs | Buys |
|---|---|---|---|
| A Lamp | a shop is a small lamp, LIT (warm bead + light pool) when secured today; a bubble = white number + an amber arc of how many inside are secured | the cluster icon must count secured children (a marker option); unlit beads are small - the tap box stays 28 px | gold only where it MEANS done; his "warm light, not lines" (2026-09-24) |
| B Survey | map-maker marks: a survey diamond on a hairline; a bubble = a dial with one tick per shop, amber ticks = secured | the dark diamonds nearly vanish on the dark tile bands (seen in the 1440 frame) | the most "instrument" look; a bubble's shop count readable as ticks |
| C Token | board-game pieces with a drawn edge under each (a shape, so Lite keeps the depth); a bubble = a small stack + amber arc | close to today's look and to the salesman coins - least change | physical object, his game taste |

All three: the six visit states keep their meaning (Chesterton's fence - the emoji were the only state carriers) as
one line-icon plate per pin (box / full / issue / request / closed in red / claimed = the lit mark itself); no orange
glow; every halo is a gradient, not a box-shadow, so Lite Mode keeps it (`theme.css` Lite kills box-shadow).

## Key motion (one idea each)

| Motion | What | Costs | Buys |
|---|---|---|---|
| 1 Lock-on | four corner brackets close in on the key you point at / press; stay on a key that is ON | a new vocabulary, used nowhere else in the app | the strongest "high tech" read |
| 2 Icon acts | each icon does its own job for 240 ms: corners open, sheet lifts, pin drops, arrow flies, crosshair tightens, brush strokes | one rule per icon (6 rules) | explains what the key does |
| 3 Lamp | a 6 px indicator lamp in each key: flashes on press and fades 520 ms; stays lit while ON (borders, brush open, fullscreen) | quietest of the three | the SAME lamp the sidebar wears (his 2026-08-24 pick, "lamp beside the icon") - one control vocabulary, his reusable-button ask |

All: brush list opens FROM its key (scale .96 + fade, 220 ms) and its rows stagger 28 ms; press = scale .97 (kept).

## Layout (ergonomics)

- **PC new:** one toolbar, the key names always shown (145 x 40 per row, measured) - today the names exist only under the mouse.
- **Phone new (full map):** every key - brush, borders, set home, fly home, locate, exit - in one bar at the bottom,
  58 x 58 each (measured at 390, no label clipped); brush list = a sheet above it, rows 44 tall, whole names, no orange slab.
  Cost: the bar covers ~90 px of the bottom of the full map.

**My pick:** A + 3 + new layout on both widths. **Decision:** OPEN - waiting on Aldi.

**Rejected on purpose:** a scan line across the key (he called the quarantine switch's scan "bad", 2026-09-29); any
gold/amber FILL on a key or a pin body (amber is an edge and an ink); a rotating ring (Lite law: nothing rotates).

not-chosen: B Survey - lost on reading at a glance (dark diamonds vanish on dark tile bands). Flips if he wants the
per-shop ticks. 1 Lock-on - lost on being a second vocabulary beside the sidebar lamp. Flips if he finds the lamp too quiet.

Models applied: Chesterton's Fence (the emoji carry six visit states - keep the states, change the drawing), Inversion
(what makes a mark "not artistic": the same gold on every object, a glow standing in for an idea), Opportunity Cost
(the phone dock buys thumb reach and costs ~90 px of map).
