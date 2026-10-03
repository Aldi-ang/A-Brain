---
date: 2026-10-03
status: KEYS DECIDED (2 Icon acts, 08:25); MARKS round 2 drawn (1 Banner / 2 Chest / 3 Beacon), his pick owed; layout new/today still unanswered
tags: [kpm, journey-plan, design, map, motion]
---

## Round 4 (09:00-09:35) - the chest with signs; the motion made correct

> *"looks okay but make sure the animation is smooth and correct, lets continue with the chest instead, but there
> should be sign on the chest for the stores status, sometimes stores dont buy because our product is still on their
> shelf or many other reasons that we have"*

- **The reasons are the app's own** (`QUICK_TAGS`, `src/JourneyView.jsx:821`): Routine Check, Repeat Order 📦, Stock
  Full (No Order) 🛑 (his example - product still on the shelf), Competitor Issue ⚠️, New Request 📝, Store Closed 🔒;
  plus a real sale through the terminal today (`hasLiveTxToday`). Each = an oak sign on a post beside the chest with a
  7x5 pixel picture (coin / box / tick / full shelf / red ! / speech bubble / red lock). No new reasons invented.
- **New rule proposed, his answer owed:** light pours out of the chest only where MONEY came in (sold today, repeat
  order); other visits open the lid with a dark inside. Switch "No-sale visits: dark / glow" on the page. A closed
  store keeps its lid down (visited, sign = lock).
- **Motion made correct:** (1) the lid swings on a hinge - the front face tilts edge-on, then the lid's dark inside
  face unfolds up (v3 floated the lid straight up: two stacked boxes at 3x); (2) the hop is eased like gravity per
  keyframe (slows to the top, speeds up falling, squashes on landing); (3) **a bug v3 shipped to him:** the tapped
  chest jumped 28 px above its ring for as long as the hop's fill lasted - a transform on a 0-height wrapper became the
  box the chest was placed against. Fix: the wrappers are `inset: 0`. Proof: rest position before the tap = at frame
  0 = after (0 px), under the mouse -3 px (the lift only); every 20 ms step <= 3.7 px for the chest.
- **How it must ship:** Leaflet replaces a marker's element when its icon changes, so the end state is the plain
  style and the moment is keyframes FROM the closed values on a fresh element - the prototype does the same.
- Page v4; board `Raw/2026-10-03-map-keys/round4/board.png`; code `round4/map-chest-r4.html` (`.ch3`, `chest4()`,
  `SIGNS`, `signSvg()`); numbers `round4/measure4.json`.

## Round 3 (08:45-08:56) - the chest, fixed

> *"chest is kinda cool tbh but since it is small, secured stores and unvisited stores looks almost the same here tho
> make it harder to differentiate, it is what the most downside i see, other beacon and banner i dont like it, beacon
> is also satisfying but what is the purpose of the filled and unfilled hexagon tho?"*

- **Chest = his direction.** Banner and Beacon rejected (Beacon called satisfying but its meaning unclear - the reply
  explains: big hex = a bubble, lit edges = its secured share; small hex = one shop).
- **The fault was real and measurable:** v2's closed and open chest used the SAME wood (mean luminance 0.132 both) and
  the same 22 px box - only the lid squashed and a 1 px glow row changed. At 24 px that is invisible.
- **Fix = three signals at once:** SHAPE (open is a separate sprite, 28 px tall, the lid standing up), BRIGHTNESS
  (closed = dim wood, luminance 0.051; open = bright wood, 0.246 - about 4.8x), LIGHT (a beam + a warm pool on the
  ground). The board has a real-size crop and a GREY copy of it: closed = dark box, open = light box, so brightness
  alone separates them.
- The sprite swap is a state (`opacity` with a 150 ms transition DELAY, no animation), so Lite shows the end at once.
- Board `Raw/2026-10-03-map-keys/round3/board.png`; page v3. His verdict owed; key layout still unanswered.

## Round 2 (08:25-08:40) - his answer to round 1

> *"icon acts is the best, i dont like all the marks can u redesign it to make it more satisfying and cool and game
> related u can do research on this"*

- **Keys: 2 Icon acts - DECIDED.** Lock-on and Lamp dropped from the page.
- **Marks: A Lamp, B Survey, C Token all rejected.** Read: they were abstract shapes with no MOMENT. Round 2 = game
  objects, each with a secure moment that plays only when a shop becomes secured while the map is open (on load,
  the end state shows still - "it refreshed" is his word for a replayed entrance, 2026-09-22).
- Research: Minecraft wiki, Map page (read 2026-10-03): *a banner mark takes the color of the banner's base colour and
  shows its name* - so a salesman's colour IS his banner. Game "juice" (squash, a hop, a few particles, one beat per
  reward) from game-design knowledge [likely, not re-read]. WebSearch and firecrawl both down today.
- **No sound**: [[Sounds Come From Aldi]] - a sound is a file he picks; offered as one line, not built.

| Look | Not visited | Secured moment | Bubble | Costs |
|---|---|---|---|---|
| 1 Banner | a rolled-up Minecraft banner in the salesman's colour | unrolls (spring), waves, tip turns amber, dust pops | inventory slot: banner item, count like an item stack, amber bar fills, enchant shine when full | smallest mark (20x34), reads least at a glance |
| 2 Chest | a closed brown chest on a ring in the salesman's colour | hops (squash), lid pops open, warm light, pixel sparks | slot with a chest; full = the chest opens + shine | brown wood = his object exemption (2026-09-22); needs a pixel font for the count (Silkscreen) |
| 3 Beacon | a dark hex, edge in the salesman's colour | ring of light rushes out, the edge powers up round the hex, light pillar | big hex, one edge lights amber per sixth secured, number decodes | least "game object", most "tech" |

My pick: **2 Chest** - his object (he picked a chest every time one was offered), and open-vs-closed reads at 24 px.
not-chosen: 3 Beacon - lost on being a shape again (what round 1 lost on); flips if he wants tech over game.
Frames: `Raw/2026-10-03-map-keys/round2/` (board.png, m-*.png = the moment frozen at 0/100/220/380/600/1400 ms).
Rejected on purpose (round 1): A Lamp, B Survey, C Token; key motions Lock-on and Lamp.

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
