---
date: 2026-10-03
status: ROUND 6 DRAWN 22:40 - crowd on the bubble + selling scenes A/B/C, his pick OPEN. Earlier - BUILT 13:42 - kpm aaf6a7e (local, not pushed). Keys icon acts + new layout; shop = 14x14 chest, dark inside, lit sign per outcome; slot bubbles; full pixel salesman. PARKED - players customising their own character.
tags: [kpm, journey-plan, design, map, motion]
---

**Decision (09:55), his words:** *"full pixel is kinda cool, maybe in future update we can allow users to customized
their own as well lets use that for now"* - A (the full pixel person) wins over B (the head). **PARKED, not queued:** a
salesman customising his own character (skin, hair, shirt) - "maybe in future update" is his PARKED marker
(2026-09-23 rule). If it comes back: the sprite is already split into palette letters (`PERSON(hair, shirt)`), so a
picker only has to store three colours per profile.

## Round 6 (22:00-22:40) - the crowd on the bubble + selling scenes A / B / C drawn; his pick OPEN

Page: https://claude.ai/artifact/EW5vnHMQUWYEyt9sk9MGvf (source `Raw/2026-10-03-map-keys/round6/crowd-sell-r6.html`,
frames + `board6.png` + `measure6.json` from `shoot6.mjs`).

**Problem, his words (20:15):** *"i want this animation so that chest and 8 bit character not colliding but combined
into one animation instead"*.

| Option | What plays (merged with the chest's own secure moment) | Last picture (= Lite, = map opened later) |
|---|---|---|
| A Restock | he kneels, the lid swings up, a box of goods arcs from his hands into the chest and sinks behind the front edge (clip line held on the rim), chest jumps, sign plants | kneeling at the open chest, 2 px clear of it |
| B Paid | the chest jumps, the lid pops, a coin is tossed up out of it and caught in his raised hands, sign plants | both hands up holding the coin, name tag lifted above it |
| C Stall | he walks round behind the chest, opens it from there like a shop counter, sign plants (no chest jump) | his head and shoulders above his open chest |

Costs, each measured: all three end with the chest exactly where it rested (0.00 px before vs after a replay), the man
2 px clear of the chest in A and B (TODAY: 14 px overlap), Lite = 0 running animations, no sideways scroll at 390.
Three new poses only (kneel, arms up, both feet down) on the app's 10 x 14 rows - no new sprite system. ~1.5-1.8 s,
once per sale.

**Decided by me, said in the reply:** the scene REPLACES the chest's own secure moment when both fire together (the
sale and the `at` detection arrive in the same location stamp) - his "Norak" rule, one moment one animation. The crowd
is STILL (cached pictures, no loop) - the 17:53 lag fix. Which bubble a salesman belongs to: put his marker INSIDE the
MarkerClusterGroup, so Leaflet's own clustering puts him in exactly one bubble at every zoom (walking ones too), and the
bubble icon draws the crowd from `getAllChildMarkers()` with the shop count excluding salesmen.
not-chosen: screen-space hit test after the map settles (perf/mock-badge.mjs BADGE) - lost on a second pass per zoom and
a man drawn in a bubble his spot is only near. Flips if the cluster plugin cannot hold two marker kinds without
breaking spiderfy. not-chosen: "a salesman at shop X joins X's bubble" - lost on walking salesmen belonging nowhere.

**Mistakes caught before he saw it:** (1) crowd and slot chests invisible - a `background:` shorthand in the page CSS
came after the injected sprite style and reset the picture, and an inline `style="...url("...")"` broke its attribute;
(2) B's coin flew through the name tag; (3) C's chest jump grew over the head of the man behind it - jump removed in C;
(4) the first phone numbers were from a 980 px layout (local copy without the publish skeleton's viewport meta) and
still read "0 overflow".

**REJECTED ON PURPOSE:** the brief's "c) he carries a crate in and the lid shuts" - a shut lid means NOT visited on this
map (his round-2 complaint that two states must read different), so C became the stall. Crowd figures that walk or
breathe zoomed out (lag). Name tags on crowd figures (the crowd itself is the count).

DECISION (23:05), his words: *"B paid but change that into coin animation that used on the agent inventory and
receipt"* - B, with the app's own `.kpm-coin` (the 8-frame `coin-sprite.png` spin of Agent Inventory's revenue line and
its receipt rows) instead of the page's drawn coin. BUILT 23:25, kpm `41e308b` (local, not pushed): crowd on the bubble,
scene B with the spinning inventory coin (Lite = front face), EOD sent = off the map, LIVE_MIN gone. Timing changed
from the page on purpose: the scene rides the chest's existing burst (lid 220-740 ms) instead of a "sell" variant of
the chest, so one moment stays one animation and a location that arrives after the sale still plays the coin alone.
Proof: `Raw/2026-10-03-map-keys/built6/` (frames, `measure-built6.json`) + `perf/perf-crowd6.json` (120 ms busy per
3 s at rest, was 279-308; longest zoom frame 73 ms).
ANSWERED 23:33, his words: *"leave map after approval"* - BUILT kpm `aa7b1d3`: off the map once every EOD doc he sent
today is VERIFIED and the cash/stock one is among them (a part sent back keeps him; a bounty alone is not a closed day).
REJECTED ON PURPOSE: "leaves when he sends it" (built first in `41e308b`, replaced).

Models applied: Inversion (what would make the scene wrong: two animations on one moment; the chest covering the man),
Pre-mortem (C's jump swallowing him was found by freezing 1.20 s), Second-Order Thinking (a crowd that animates in every
bubble costs the phone the lag fixed at 17:53).

## 20:15 - his answer to A/B: a GROUP of 8-bit characters on the bubble + a SELLING ANIMATION (design next session)

His words: *"well just combine them into one but make it into group of 8bit character instead looks kinda cool right,
later our customized character will be displayed there in the group on the future update, when zoom closely then
individual character should all be showed and i feel like we need animation for 8 bit character that just detected
doing its sales job on the stores, i want this animation so that chest and 8 bit character not colliding but combined
into one animation instead"*.

- DECIDED: zoomed out = the salesmen whose spot is inside a bubble stand ON it as a small crowd of full 8-bit
  characters (not B's head row); zoomed in = individuals at their fixed spots. The group is where customised
  characters (PARKED) will appear later.
- OPEN - to draw next session (kpm NEXT-SESSION.md 20:15): the selling animation, character + chest as ONE scene when
  he is detected selling (expedition state `at`). Candidates to draw: kneel + lid lifts + goods rise; lid opens + coin
  arcs into his hand; he carries a crate in and the lid shuts. Each must end on a readable still (Lite).
- Rejected now: A (standing on the bubble) and B (heads only) - his "combine them into one".
- 20:20, his words: *"well actually their animation should be gone when EOD is finished so that its considered as job
  done for the day right"* - DECIDED: a finished End of Day stops every animation of that salesman.
- 20:25, his words: *"after EOD then character will leave the map, EOD finished should replace 2 hours rule, and EOD is
  must to close that day job"* - DECIDED: on the map = seen today and no finished EOD today; EOD done = he leaves the
  map; LIVE_MIN (two hours, kpm 7b770be) goes. Cost told to him: a forgotten EOD keeps him at his last spot until
  midnight (also shows who has not closed). REJECTED: the two-hour clock; "stay on the map standing still".
- 20:30, his words, with a phone screenshot of the shop popup (Toko Anugrah): *"and also i want u to redesign this panel
  just to make it better and on theme with these"* - QUEUED (kpm NEXT-SESSION.md, block under the one job). Seen:
  location path under the EDIT button; slate-blue NO PHONE / ADJUST PIN fills (palette law); a full red CRITICAL slab;
  five unrelated box styles; purple-on-purple salesman badge. OPEN - to draw.

## FIXED SPOT + OFFLINE HIDDEN 2026-10-03 20:08 - kpm 7b770be (local, not pushed); zoomed-out look OPEN

His words (20:00, with a screenshot of seven salesmen at 0 sales ringed round one bubble): *"why these agent position
is changed when i zoom in and out when it supposed to be fix tho, need improvement on this and also there should be no
data for their location right now because they are offline and not working right"*.

- The 17:53 step-aside picked a new free spot after every zoom -> he saw them jump. REMOVED. A salesman now stands at a
  constant offset (feet 30 px left of his spot, clear of his shop's chest) - measured -30 px over five zoom changes.
- "Out" meant "sent a position at any time today" (an app open at the branch at 07:00 counted at 20:00). There is no
  online signal in the data (a point is sent only with a sale or an app open), so `LIVE_MIN = 120`: on the map only
  while his last point is under two hours old. The panel still lists everyone. Map System chips follow the same rule.
- **OPEN - waiting on Aldi:** fixed spots and "never on a bubble" cannot both hold when zoomed out (4 of 4 lab salesmen
  stand on the bubble holding their shop). A = as now, standing on it; B = while his spot is inside a bubble, his small
  head sits on that bubble's top-left corner, the full person back when the bubble opens. Frames
  `Raw/2026-10-03-map-keys/perf/mock-a-out1.png` / `mock-b-out1.png` (mock script `mock-badge.mjs`). My pick B.
- **REJECTED ON PURPOSE:** any screen-space step-aside (moves with zoom - his complaint); hiding salesmen when zoomed
  out (he loses who is where).
- ❓ also asked: is two hours right for "working right now"?

## LAG + COLLISIONS FIXED 2026-10-03 17:53 - kpm eabda69 (local, not pushed)

His words (17:30): *"make sure that the chest and person not colliding with one another when the map is zoomed out
usually its making so much lag as well on the phone maybe u could do something about that?"*

Measured first, `Raw/2026-10-03-map-keys/perf/` (`perf.mjs`: production lab build, headless 390 x 844, touch media,
CPU 6x slower, zoomed out 0-3 steps, one suspect switched off per run; `perf-*.json`, `zoomed-out-before-out1.png` vs
`zoomed-out-after-out1.png`):

| suspect | cost before | fix | after |
|---|---|---|---|
| flowing "heading to" line (stroke-dashoffset) | ~85% of the main thread at rest; one line = three lines (whole Leaflet line layer repaints per frame); stepped ants only -41% | flows only with a mouse (`@media (hover: hover) and (pointer: fine)`); phone = still dashed line | rest 2,874-2,935 -> 261-392 ms busy per 3 s |
| chests/bubbles as ~146 pixel squares each | 1,704-2,621 squares rebuilt per zoom, frames up to 236-346 ms | one cached picture per still look (SVG data URI, same pixel rows); full parts only for the element playing the moment | longest zoom frame 55-109 ms; picture vs the moment's last frame max 1/255 colour |
| salesmen on bubbles | 4-5 of 5 when zoomed out | step aside to the nearest free spot (9 x 7 grid, up to 144 px) after the map settles + a thin line back to the true spot | 0 of 5 on things, 0 on each other, all four zooms |

**REJECTED ON PURPOSE:** stepped "marching ants" on the phone (still 59% of the cost); removing the flow everywhere
(the PC can afford it, his approved look stays there); hiding salesmen when zoomed out (he asked for no collisions,
not fewer salesmen). A 72 px search radius was tried first and left 1-2 salesmen stuck in a block of nine bubbles.
**Models applied:** Inversion (what makes the phone slow at REST, not just on zoom), ablation one suspect at a time.

## BUILT 2026-10-03 13:42 - kpm aaf6a7e (local, not pushed)

Frames + numbers: `Raw/2026-10-03-map-keys/built/` (`measure-built.json`, shooter `shoot-built.mjs`; lab
`?shell&journey&exp&admin&visits`, `&tick` = one more shop visited every 2.5 s). Rest position before vs after the
moment 0.00 px (hop peak -9 px); Lite = 0 px and 0 kx animations running; dock 6 x 58x58; brush rows 44; a bubble's
bar refreshed 2/3 -> 3/3 live without a zoom.

**Traps found while building (each cost a reshoot):**
- Leaflet's own `.leaflet-map-pane svg { z-index: 200 }` lifts every sprite svg inside a marker above its HTML
  siblings - the bubble count went behind the chest (white digit invisible). Fix: `.kx-mk .px { z-index: auto }`,
  pinned in logicFixes.
- The app's global `button:has(> svg:only-child)` centres any button whose only ELEMENT child is an icon - a bare
  text node does not count. Fix: wrap the label in a span.
- Motion sampled in the Browser pane read 0 px: the hidden pane's `document.timeline` does not advance (same cause
  as [[Looking at the App]], 2026-09-04). Motion proof = headless only.
- StrictMode runs a useMemo twice in dev: a "what changed" flag returned from the memo is false on the second
  run. Keep it in a ref.
- Dock labels at 12 px measured 57 in a 57 px key at 390 - shipped at 11 (the floor).

## Round 5 (09:32-09:47) - every visit dark inside, the light in the sign; 14 px chest; the salesman model

> *"yes open with dark inside but light sign and all the visited should be dark and i want u to make the chest more
> detailed even when it is zoomed its still look like a good 8bit chest and also i want u to make some better
> animation or model for the salesman location because pinpoint is just too standard"*

- **Read as:** every visited chest = lid open, DARK inside (sales too); the light moves into the SIGN (a pale board
  with a warm glow behind it, lit ~0.3 s after it is planted). Unvisited = dim closed chest, no sign. Told to him as
  my reading in one line. Superseded: round 4's "light only where money came in" and its No-sale switch.
- **Chest 14 x 14** (Minecraft's own chest front is 14 wide), drawn at 2 px: highlight edge, two plank seams, side
  shading, an iron latch that rides on the lid; 28 x 28 closed, 28 x 34 open. Signs 11 x 11 with 9 x 6 pictures.
  Board shows 3x and 6x crops.
- **Lid hinge fixed again (measured):** the front face now tilts up INTO the back rim, the line the inside face rises
  from; collapsing it onto the front edge left a 3-row jump between the faces (-5.7 px in one 20 ms step -> -0.9).
- **Salesman = a pixel person** (10 x 14 at 3 px = 30 x 42): head, shirt in his colour, a Minecraft name tag
  (initials · shops done, pixel font), a shadow; walking to his next shop = two leg frames + 1 px bob (steps), at a
  shop = a slow 1 px breath, picked = an amber quest arrow bobbing over the tag, not out today = 50 % faded. Look B =
  the floating head only. First drawn at 2 px (20 x 28) and scaled up: smaller than the chests, he was not the thing
  the eye finds first. In the app the face could be his photo pixelated - not built, not asked.
- Proof: rest 0 px before / after / -3 px under the mouse; Lite = 0 running, lid open, sign lit; tags 0 clipped.
  Page v5; `Raw/2026-10-03-map-keys/round5/` (`map-chest-r5.html`: `.c5`, `chest5()`, `sign5Svg()`, `.sm`,
  `personSvg()`, `headSvg()`).
- Owed by him: Player (A) or Head (B); then build.

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
