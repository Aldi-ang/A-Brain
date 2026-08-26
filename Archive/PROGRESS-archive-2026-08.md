# PROGRESS archive — KPM app track

Cut from `.claude/PROGRESS.md` when it ran over its ~350-line cap. Nothing here is current; `git log` is the authority.

## 🟠 2026-08-25 12:13 — CONTROLS SWEPT TO STENCIL; HISTORY REPORTS CONVERTED. 606/606, 762/762.

⚠️ **DATE CORRECTION, NOT A REWRITE.** The five entries below are stamped `2026-08-24` and the
real date is **2026-08-25** — one session's clock was read wrong and every later entry copied it.
**Their content is accurate; only the day is off.** Left in place on purpose (add, never rewrite).

✅ **SWITCHED-ON CONTROLS TAKE THE STENCIL PLATE** — his answer: *"stencil is good for most button
u can do that"*. Segmented switch, toggle track fill, selected pick-list row, range slider
(`accent-color`), EOD progress fill. **`--sw-on` DELETED** — it existed for two commits only,
for the window when `--gold` was a pale plate and a pale fill was 1.68:1 on its track; the stencil
is 9.39:1 there. The segmented switch's rim went the same way (12.57:1 unaided). **Seen in his
Chrome.**

✅ **HISTORY REPORTS / TRANSACTIONS — the worst screen, palette converted.** It was worse than
first reported: **392 banned colour uses in 1157 lines**, zero tokens. 269 slate · 59 emerald ·
42 blue · 12 indigo · 10 purple. **559 classes replaced, 0 banned left.**
📐 **Done with an ORDERED MAPPING TABLE, not by hand** —
`scratchpad/convert.mjs`, and **it is reusable**: point it at Fleet, Consignment and the Vaults
next and each screen costs a fraction of this one.
Two colours were REPLACED, not deleted, because they carried meaning: **purple → `--alt-ink` /
`--alt-edge`** (the theme's sanctioned secondary accent) and **emerald → `--verified`** (a neutral
"settled" ink — green is banned, but the meaning still needs saying). **Money is no longer blue.**
G51 caught and fixed **7** plates whose ink did not follow.

⚠️ **NOT SEEN — the app auto-locked to the Master Vault password screen.** I do not enter his
password. **Verified by checks only: 0 banned classes, 606/606, 762/762, all contrast pairs.**
⚠️ **This is the PALETTE half.** Markup untouched, so the *"looks good for the UI design and
animation"* half of his ask is the next pass on this screen.

📏 **THIS FILE IS 917 LINES, WELL OVER THE ~350 CAP.** Next session: cut the oldest 🟠 entries into
`A-Brain/Archive/`. ⚠️ Do not trim across tracks — 🔧 and 🟢 entries are other sessions'.

## 🟠 2026-08-24 20:15 — LITE MODE SIDEBAR BUG FIXED. 606/606, 762/762, ALL CONTRAST PAIRS.

His report: *"another thing that i see broke is actually sidebar on lite mode u may check it"*.
**Reproduced and measured in his Chrome after three wrong theories** — `getComputedStyle` settled
it in one call. The sidebar panel was painting **`rgba(46,38,26,.72)` across 351×688px** over the
whole left column of every screen.

**Cause:** `src/index.css` has a blanket
`html.lite-mode [class*="backdrop-blur"] { background-color: var(--duke-scrim) !important }`.
The desk panel carries `backdrop-blur-xl` → matched → `!important` beat its own
`lg:bg-transparent`. **On a desk that panel is an invisible WINDOW, not a scrim** — the rule's own
comment claimed otherwise, and a comment cannot check itself.
**Fix:** background handed back at `≥1024px` only (below that the rail IS a drawer and the scrim
is right). **Blur stays stripped.** `G52` asserts both halves + the media scoping, on BUILT CSS.
⚠️ G52 went red against working CSS first — **the minifier drops the quotes**
(`[class*=backdrop-blur]`). Write built-output checks against `dist`, never against the source.

🔴 **HIS BIG ASK IS NOW QUEUED, NOT DONE** — 9 screenshots, two different sizes of work:
1. **Control-colour sweep** (segmented switches, sliders, toggles, chips still brown/orange) —
   **this is the next session's one job, and it is blocked on ONE question**: should a switched-ON
   control be near-black like the buttons, or stay amber? Near-black measures 9.39:1 on its track,
   so it is taste, not legibility. Full brief in `.claude/NEXT-SESSION.md`.
2. **Redesign 8 screens.** ⚠️ **Two groups, and they are not the same job.** Transactions, Fleet &
   Roster, Consignment, and the two Vaults are **UN-themed, not off-theme** — navy, blue and
   purple, 15–25 banned colour classes each, zero tokens. Those are a session apiece. Dashboard,
   Agent Profile and Journey Map are themed already and only need polish.

## 🟠 2026-08-24 19:50 — STENCIL SHIPPED, AND THE APP WAS FINALLY SEEN. 603/603, 762/762.

✅ **FIRST FRAMES EVER TAKEN OF THIS PROJECT.** The path that worked: **`claude-in-chrome` MCP
against HIS Chrome on `https://localhost:5173`** — his own dev server, already logged in, cert
already accepted. ⚠️ The in-app Browser pane will not composite, `agent-browser` hangs for 30
minutes, and my own dev server on another port is useless because of the login. **Ask him to keep
5173 running and drive his Chrome. Do not try the other three routes again.**
Rail hover: `[data-kpm-rail]` events live on the pod only, so hover **(35, 42)** and do not move.

**He reversed his own choice after seeing it:** *"wait i think it may look better with the stencil
and an amber light tho, i look on the app and i dont really like it"*. Light `--gold` is
`#1B1917` + bone ink. Plate clears **9.39–14.21:1** alone, so the rim rule and its guard were
deleted with the plate that needed them, and the contrast pairs grade the core again. Amber on it
is **8.41:1 bare**.

🔴 **THE BUG LOOKING FOUND, THAT NO CHECK HAD BEEN ASKED:** Sampling's two top buttons paired the
plate with `--ink` — **1.04:1, invisible**. **21 ink references across 5 files** used `--ink` /
`--accent-ink` / `--ink-dim` instead of `--gold-ink`. Most were never readable: `--accent-ink` on
the OLD brown was **1.54:1**. **`G51` now enforces the token pair.**

⚠️ **G51 HAD TO BE REWRITTEN BEFORE IT WAS WORTH KEEPING.** v1 scanned LINES → 30 hits, ~26 wrong
(a ternary's other branch, a `group-hover:` pair that switches together, two elements on one
line). v2 scopes to one `className` value and only fires when the bad ink is in the STATIC part.
**Third time the element-vs-line mistake has cost a session.**

✅ **Green removed from Customer Directory** — emerald fill, emerald glow, and `ring-2
ring-emerald-500 bg-emerald-50 dark:bg-slate-700` all marked *"the record you are editing"*.
Replaced with an amber EDGE, not deleted: the meaning had to survive. Also Lite-safe — a `ring` is
a box-shadow and Lite Mode deletes it, so that mark was already invisible on a cheap phone.

🔴 **ONE QUESTION OPEN — the FULL/LITE segmented switch in Settings is now a big bright amber
slab** (`--lamp-on`). It went amber when the plate was pale and 1.68:1 on its track; the plate is
near-black now and measures **9.39:1** there, so `--gold` would work and would stop being an amber
slab. **Ask him: amber or stencil for segmented ON?** Same question covers the picklist selected
row and `--sw-on` — if he says stencil, `--sw-on` can be deleted entirely.

▶ **THEN: rank 1 per screen.** All 63 buttons are stencil; one loud button per screen, rest outline.

## 🟠 2026-08-24 19:05 — HE CHOSE STEEL. IT IS SHIPPED. 603/603, 762/762, ALL CONTRAST PAIRS.

**Shipped:** light mode `--gold` is now the steel plate `#F7F3E9` with near-black ink `#2B2318`.
*"A and B looks cool but B is more minimalistic and similar to our theme more"* — **A measured
better on every row and lost on taste.** Numbers shortlist; taste picks.

| what | before | after |
|---|---|---|
| word on the button | 6.86 | **13.97** |
| what holds it off the page | plate core 4.45 | **rim 5.32–8.04** |
| the amber lamp on it | 3.51 | **8.95** (core + `#6B3400` rim) |

**How 63 plates got a rim in one rule:** `html.light [class~="bg-[var(--gold)]"] { outline: 1px
solid var(--lamp-rim) }`. `~=` matches a whole class token, so `hover:` variants get the rim only
while hovered. **Outline, not box-shadow** — Lite Mode deletes shadows and Tailwind's shadow
utilities come later in the cascade.

**Contrast pairs repointed from the plate CORE to the RIM. ⚠️ THE 3:1 BAR DID NOT MOVE — only what
it measures.** Those pairs compare tokens and never see a page, so **`G50` in `integration.audit`
asserts the rim against the BUILT stylesheet.** If G50 is ever deleted, put the core pairs back
first.

⚠️ **THE PART THAT NEARLY SHIPPED BROKEN — MARKS DO NOT FOLLOW PLATES.** The toggle, the segmented
switch and the EOD progress bar fill `--gold` on an `--inset` track: a pale fill is **1.68:1**
there, so a switch in Settings would have looked the same ON as OFF. They keep amber. **New token
`--sw-on`** (light `#6B3400`, dark `#ff9d00`) because the toggle is the one mark whose ground
inverses — bright amber on the light track is 1.12:1.

✅ **Two bugs caught by checks, not by review:** a rim written as `box-shadow` (Lite Mode deletes
it), and a contrast pair of mine grading a rim against its own fill instead of the panel — red at
2.33:1 on a control that is perfectly visible.

⚠️ **STILL UNSEEN ON GLASS.** Browser pane will not composite, dev server is HTTPS+login,
`agent-browser` hangs. `tools/theme-preview-lab.html` regenerated and sent. Verified by three
suites, NOT by a frame.

▶ **NEXT: rank 1 per screen.** The plate is live everywhere `--gold` was, which is 63 buttons —
one loud button per screen, everything else the outline pattern. Sampling, Customer Directory,
Settings.

🔗 Study updated in place (same URL): `https://claude.ai/code/artifact/6bc6de23-c628-464a-8545-71086545be85`

## 🟠 2026-08-24 18:35 — RE RESEARCH → THE STENCIL PLATE. STUDY PUBLISHED, HE OWES THE PICK.

He asked for research and *"a better color to make it clearer"*. ⚠️ **BOTH WEB-SEARCH TOOLS ARE
DEAD** — `WebSearch`/`WebFetch` route through `cc/claude-haiku-4-5` which this account cannot
reach, and firecrawl needs a paid key. Answered from series knowledge, said so on the page.

**The finding is an inversion, not a colour.** Modern RE interfaces make the PLATE bright and the
INK dark (RE4's attaché case, RE2's menus, Village's briefcase). KPM light mode does the reverse —
a dark plate with pale ink, which is a dark-mode habit in light-mode clothes. A fill must be dark
to clear 3:1 on cream, and dark amber IS brown. **Brown is the last colour standing after the
rules finish.**

📊 **MEASURED, all four on the real ground `#D2C9B4`:**

| treatment | word on plate | plate vs page | amber lamp |
|---|---|---|---|
| today (brown) | 6.86 | 4.45 | 3.51 |
| **A stencil `#1B1917` + bone `#F7F3E9`** | **15.82** | **10.65** | **8.41** |
| B steel `#F7F3E9` + dark ink | 13.97 | 1.49 ❌ | 1.88 ❌ |
| C outline (`.kpm-btn.key`) | 8.09 | 4.57 edge | n/a |

✅ **A wins outright and needs NO token change and NO contrast-rule repoint** — it passes every
existing check with 2-3x margin, the exact opposite of the amber-fill plan. B is the most
"laboratory" and is rejected because a bright amber lamp on a bright plate is 1.88:1 — it kills
the one thing he likes.

📐 **The rule that ships with it: stencil is a RANK, not a repaint.** One rank-1 button per screen,
everything else outline, amber lamp for state, red outline for destructive. 68 near-black buttons
would be as wrong as 68 brown ones.

🔗 **Study (real buttons, pressable, on the real ground):**
`https://claude.ai/code/artifact/6bc6de23-c628-464a-8545-71086545be85`
⚠️ **Republish that same URL to update it — do not publish a second one.**

🔴 **WAITING ON ALDI: which treatment, A / B / C.** Nothing is applied to the app yet.

## 🟠 2026-08-24 18:10 — THE GRAIN IS GONE, AND THE BROWN-BUTTON FIX TURNED OUT TO BE THE OPPOSITE OF THE PLAN

**Shipped:** `1 commit` — light-mode rail faceplate loses its brush grain, and the theme lab
learned to render the rail. 599/599 integration, 762/762 logicFixes, all contrast pairs.

His report, mid-session, with a screenshot: *"btw i dont like the lines on the sidebar background
for the light mode can u change to other plate instead, this line make the color that is intact
on it seems darker as well"*. **He is right on the mechanism, not just the look** — a 1px light
line every 3px covers a THIRD of the plate, so the surface the sixteen marks meet was never
`--plate`, and `contrast.selfcheck` has been grading a colour that is not fully on screen. Third
time he has found a contrast fault by eye. Flat plate now; **Lite Mode had already shipped exactly
this**, so the two modes agree. ⚠️ Never put a gradient there — it re-creates the moving ground.

🔴 **THE BIG ONE — I ALMOST BROKE A LAW HE STATED TWICE, AND HE CAUGHT IT BY ASKING A QUESTION.**
He asked *"already load all the skills to do the job?"*. I had skipped the design stack. Loading it
surfaced `Aldi's Design Taste.md`: **AMBER IS AN EDGE AND AN INK. IT IS NOT A FILL.** — *"stop
using amber background i said, i hate it"*. The plan was 68 amber fills. **The brown is the law
working, not a bug.** A fill must be dark to clear 3:1 on cream, and dark amber reads brown.

✅ **The right fix is his own house pattern:** `.kpm-btn.key` — transparent body, amber edge, amber
word, fill only on press. The buttons he photographed are Tailwind ones that never adopted it.
Convert them and both complaints resolve at once, with **no token change and no contrast-rule
change**. Everything I proved impossible earlier stops mattering.

📏 **Refinement recorded in the vault:** his rail screenshot shows a bright amber DISC he is happy
with, so the law bans amber **slabs**, not amber marks. Small and bright is legal.

⚠️ **UNSEEN ON GLASS.** The Browser pane will not composite ("pane is not displayed"), the dev
server is HTTPS+login as always, `agent-browser` hung for 30 minutes and was aborted, and no
headless browser is installed. `tools/theme-preview-lab.html` was generated and sent to him to
double-click. **The flat plate is verified by three check suites and NOT by a frame.**
**Lancelot session last wrote 2026-08-13 23:40 WIB** — see the entry further down. Two clocks, one file.

## 🟠 2026-08-24 11:0x — THE AMBER PLATE SWAP IS IMPOSSIBLE UNDER THE CURRENT CONTRAST RULE

**Nothing shipped. Nothing was broken. The finding IS the work.** Quota was at 87% on entry, so
the browser pass was never started — that is deliberate, not abandoned.

Last session's brief said the brown sweep was a two-line token edit. **Tried it, measured it,
reverted it.** `--gold #7A4C0C → #E07C00` with `--gold-ink #FCF7EE → #2B2318` fails four pairs:

```
FAIL  2.14:1 (needs 3)  the gold PLATE against a panel   #E07C00 on #E1DAC8
FAIL  1.60:1 (needs 3)  the gold PLATE against a well    #E07C00 on #C6BDA9
FAIL  2.41:1 (needs 3)  the gold PLATE against raised    #E07C00 on #EDE7D8
FAIL  2.16:1 (needs 3)  the ON plate against the rail    #E07C00 on #e3dbca
```
The ink half was FINE — `#2B2318` on `#E07C00` = **5.20:1**. The plate half is what dies.

⛔ **AND NO OTHER COLOUR SAVES IT.** Computed from the real ground tokens: to clear 3:1 against
the darkest light ground the plate needs luminance **≤ 0.1376**; to carry dark ink at 4.5:1 it
needs **≥ 0.2552**. The windows do not overlap, so this is not "no amber" — it is **no colour**.
`--gold` is `#7A4C0C` (L **0.0933**) with pale ink precisely because the check forces it.
**The plates are brown BY LAW, not by neglect.**

✅ **The way out is the one he already accepted for the rail, six hours earlier in this same
file:** *"a lamp is separated from its panel by its BEZEL, not its core"*. `--gold-edge` measured
**4.57:1** against a panel in the trial. The rule at `contrast.selfcheck.mjs` ~91-93 and ~133
measures the plate's CORE against the ground; for a rimmed plate that is the wrong part.

🔴 **SO HE OWES A THIRD ANSWER, and it is a design call, not a technical one** — full wording is
in `.claude/NEXT-SESSION.md`: *do you want ON plates to be bright amber with a dark outline,
instead of dark brown with no outline?* Yes → repoint 4 pairs from `gold` to `gold-edge`
(**never move the 3:1 bar, only what it measures**), then swap the two tokens. **First check that
all 68 `--gold` fills actually have the rim** — an amber plate with no rim is an invisible ON
state and the check would no longer catch it.

✔️ Also settled while looking: **`--gold` has ZERO text uses in `src/`**. The old brief warned to
hunt for one; the only hits are the audit's own guard strings and comments. That trap is dead.

> ✅ **TRIMMED 2026-08-21 ON ALDI'S WORD.** *"sure trim it"*, on his own condition:
> *"why dont u just save the old one in the A brain and make a trimmed version"*.
>
> **NOTHING WAS DELETED.** The full 3,575-line file is
> `A-Brain/Archive/PROGRESS-archive-2026-08-21.md`, byte for byte, both tracks intact.
> Search it only when tracing a specific past decision — never load it to orient.
>
> **WHY:** this file is read IN FULL at the start of every session, before he types anything.
> At 3,575 lines that was ~50,000 tokens of his quota per session, spent on history a fresh
> session cannot use.
>
> 📖 **THE LAWS AND THE DECISIONS NOW LIVE IN THE VAULT, NOT HERE:**
> `A-Brain/Wiki/Concepts/Where KPM Is Going.md` — the theme, every locked decision, the
> direction, and the gap analysis. **Read that first.** This file holds only WHERE THE WORK
> STANDS RIGHT NOW.
>
> 📏 **KEEP THIS FILE UNDER ~350 LINES.** Past that, cut the oldest day into the same archive.
> ⚠️ **TWO TRACKS SHARE THIS FILE** — 🟠 KPM and 🟢 Lancelot. Never trim or re-sort across them.

> ✂️ **TRIMMED 2026-08-24 10:36.** One 🟠 KPM entry dropped: *the POV switch is built and
> untested on glass* (2026-08-23 13:49) — it is fully superseded by the 09:26 entry above, which
> is the same feature after it was tested. `git log -p` has it. 🟢 Lancelot untouched.

## 🟠 2026-08-24 10:36 — THE RAIL HAS A MATERIAL NOW, AND IT IS AMBER. 599/599, 762/762.

`2149f8a` + `3aac9cf`. **He rejected both options I offered and invented a third** — *"what if some
laboratory panel kind of design for the light mode and keep the glass one for the dark mode?"* →
anodised faceplate, near-black marks (**2,78:1 → 8,39:1**), indicator lamp that strikes twice on
hover and holds steady when active. **Dark mode untouched. Seen rendering in his Chrome.**

⚠️ **TWO THINGS I GOT WRONG AND HE CAUGHT BOTH BY LOOKING:**
1. My three mockups all sat on near-white; his real ground is `--ground #D2C9B4`. *"most of the
   background is not really difference"*. **Mock on the real ground or the comparison is fake.**
2. *"it looks more brown than amber"*. I measured the lamp's **core** against a pale plate, which
   forced it to `#9A4200` — brown. **A lamp is separated from its panel by its BEZEL, not its
   core.** Rim carries 3:1 (5,42:1), core is true `#FF9D00`, same in both themes.

⚠️ **THREE AUDIT GUARDS WERE NAMING THE FIX, NOT THE RULE.** Two went red against correct code
because they pinned `var(--gold)` by name; the third would have **PASSED while the open rail went
amber and the collapsed disc stayed brown** — the exact bug it exists to stop. All three now assert
the rule, and the totem one compares the two tokens to each other.

⚠️ **`integration.audit` READS THE BUILT OUTPUT.** A probe that edits source without rebuilding
proves nothing; it refused to report, which is how this was caught. **Rebuild on both sides of any
audit probe.** `logicFixes.selfcheck` reads source directly and does not need it.

## 🟠 2026-08-24 10:05 — G6 WAS ALREADY BUILT. G3 IS NOT, SO G3 GOT BUILT. 599/599, 762/762.

⚠️ **THE ROADMAP WAS WRONG ABOUT SHIPPED CODE.** *"G6 — damaged stock has no route home"* is
false: **Stock Opname › Quarantine Vault** has held it the whole time — SAMPLING, RTV (back to the
factory) and PENALTY (charge an agent), each decrementing `damagedStock` and writing a
`quarantine_logs` row, at the vault or at any branch, with four self-checks already on it.
`A-Brain/Wiki/Concepts/The Eight Warehouse Gaps.md` is corrected. **The lesson is written next to
it: anything on that list gets a grep before it gets a design.**

**`33700ec` — G3, the real one: a branch used to type its order into an empty box.** The reorder
form now says what is on the shelf, **what is already on a truck** (the double-order trap), how
fast it leaves, how many days that leaves, and what to ask for — and says **PESAN SEKARANG** when
the shelf will run dry before a shipment ordered today could land.

**Nothing is invented.** Lead time = median of his own deliveries. Order gap = median of his own
past requests (this is what stops the SIZE being a made-up number). Rate = by subtraction, the
stock-age trick. **Any missing input → no suggestion, and it says which history it lacks.**
⛔ It suggests, never orders — PAKAI is a button, Add is a second press.

⚠️ **NOT SEEN ON A SCREEN.** Needs a branch with a shipping history — the same thing the arrival
check has been waiting for. **The commit message is the full story.**

> ✂️ **TRIMMED 2026-08-24 08:59.** Two 2026-08-23 entries dropped, both shipped and both fully
> described in their own commit messages: the first real-screen test (`42fefe8` and earlier) and
> stock age (`42fefe8`). `git log` has them in full; nothing was archived because nothing was lost.

## 🟠 2026-08-24 09:26 — THE POV SWITCH RAN, FOUND TWO REAL HOLES, AND BOTH ARE SHUT AND SEEN.

**Claude drove his Chrome, he watched, all 8 steps passed.** The gold ring on his own face opens
the picker · tier 5 cut the sidebar from 17 marks to 7 · **the vault key stayed behind** (music
player gone, vault figures `****`, UNLOCK VAULT offered) · hopped 5→3 with no logout · both
`[TEST]` agents landed in the Fleet roster · refresh restored owner · the damage line printed
**`5 DAMAGED · 4 SORTED MORE THAN THE TOTAL`** in red. Nothing was submitted.

`7496258` — **the two things the run exposed, both fixed.** (1) One tier wore two names at once:
the banner said HQ SALES MANAGER, the created agent said `[TEST] REGIONAL ADMIN`, and the agent's
is what prints on a nota. One naming function now. (2) **A tier 6 could edit the fleet and move
canvas stock** — his own find. `isAreaAdmin` was only `!isGlobalAdmin`, so it was never a tier
check; Load and Reconcile & Clear were not gated at all. Now one row in Settings › Permissions.
**The commit message is the full story.**

**`4c76842` — HIS TIER NAMES ARE THE CODE'S DEFAULT NOW.** *"yea better change the code to follow
my tier name make it as default"*. T2 OWNER · T3 HQ SALES MANAGER · T4 REGIONAL ADMIN · T5 SALES
CANVAS · T6 SALES MOTORIST. ⚠️ **LABELS MOVED, IDS DID NOT** — `AREA_ADMIN` and `FLEET_CAPTAIN`
are in every stored document; a check now asserts all six ids byte for byte. **Invisible in his
app on purpose** (his saved names already won); it fixes the pre-fetch state and the next install.
Two screens that still printed code vocabulary now ask `tierWord()`, and a scan bans it from
rendered text everywhere in `src`. Two banned colours (`blue-400`, `emerald-400`) went with it.

**`86fde13` — his line, drawn at tier 4.** *"regional manager can edit the fleet and canvas, tier
below that cannot"*. ⚠️ **His tier NAMES do not match the code roles**: T3 `HQ SALES MANAGER` is
`AREA_ADMIN`, T4 `REGIONAL ADMIN` is `FLEET_CAPTAIN`. The POV picker prints both now, which is how
this got settled. **Everything above was then seen working in his browser** — the Settings row,
tier 6 with no edit controls, tier 4 with them back and scoped to its own area.

🔴 **HE OWES ONE ANSWER, and it is the bigger hole:** his live tier 3 sees **Master Vault,
Stock Opname, Customers, Sampling, Audit Logs and SETTINGS** on top of the built-in tier-3 list.
Settings is the permission matrix itself — a tier 3 can grant themselves anything.

> ✂️ **TRIMMED 2026-08-23 13:49.** Three same-day entries dropped: *the POV switch is spec'd,
> not started* (superseded by the entry above it) and both clock entries (shipped — `60c53d8`
> and `e3663c6` carry the whole story, including that the first fix missed 21 more copies).
> Nothing was archived because nothing was lost: `git log` has all three in full.

## 🟠 2026-08-23 — THE COUNT MOVED TO THE DOOR, AND THE ROADMAP GOT RANKED

**Two things shipped. Neither has been seen on a real screen.**

### The arrival check — `4a781e6`

Receiving a shipment was one yes/no button, and the branch was credited whatever HQ *said* it
shipped. A short box therefore became branch stock that does not exist, invisible until the weekly
Stock Opname weeks later — where it looks exactly like theft at the branch. Wrong person blamed,
and the claim against HQ or the courier long dead.

Receiving is now a count. **Partial blind** on his decision: the receiver sees WHICH products
should be in the box, never HOW MANY, and the quantities are hidden from the branch card while the
shipment is in transit. The branch is credited what it COUNTED. Any difference or any damage files
the order as `DISPUTED`, which sorts to the top of HQ's active list with the line-by-line record of
sent versus received. **No tolerance here, unlike Stock Opname** — a sealed box carries no fraction
of a pack.

Fixed on the same path: confirming a shipment twice credited the branch twice. The guard reads the
order status *inside* the transaction, not from the listener snapshot.

**594/594 selfcheck, 599/599 audit — and the new checks were PROVEN non-decorative:** three shipped
rules broken on purpose turned four checks red, restoring turned them green.

### The research — vault note + artifact

`A-Brain/Wiki/Concepts/The Eight Warehouse Gaps.md` and the artifact
`https://claude.ai/code/artifact/2a94825e-e349-42a7-bf52-9404d0c19c2c`.

Several assumed gaps turned out not to be gaps — `batchNo`, `minStock` and the whole excise-band
system already exist. What is actually missing is narrower: `batchNo` never travels past the
purchase order, and `minStock` is a flat 50 that knows nothing about sales speed or lead time.

**Build order: G7 clock → G6 damaged route home → G3 suggested order qty → G5 accuracy panel →
G1 batch identity → G2 expiry/FEFO → G4 ids instead of names.**

### 🔴 HE STILL OWES TWO ANSWERS

1. **The five shortage cause words.** Shape settled 2026-08-23 — short main list + a "Lainnya"
   second level, **no free typing by the regional admin** — but the words are still Claude's.
   Drop "kiriman kurang": the arrival check catches that at the door now.
2. **Do old-year excise bands have a legal cut-off?** Decides whether gap G8 exists. Supplier or
   Bea Cukai, not a search engine. Nothing was assumed.

### Skills installed 2026-08-23

82 design skills (bergside 67, Leonxlnx taste 13, vercel web-design-guidelines, playwright-cli).
**Alucard section `1a` now auto-loads the design stack** — his taste note, `impeccable`,
`emil-design-eng`, `ui-ux-pro-max`, `ui-styling` — on any design or redesign ask. The 67 style
packs are a **catalog, never auto-loaded, and never pointed at KPM**: they are competing
aesthetics and the palette law outranks all of them. His component/animation reference sites are
`A-Brain/Wiki/Concepts/Design Inspiration Sources.md`.

⚠️ **Installing bergside overwrote his `impeccable/SKILL.md`** — same skill name, different skill.
Repaired with `npx impeccable skills install`; the intruder lives at `impeccable-typeui`.

## 🟠 LOG TRIMMED TO FIVE ENTRIES, 2026-08-23 10:09

Everything before 2026-08-21 16:44 retired. Full story in `git log -p -- .claude/PROGRESS.md`;
the decisions themselves live in `A-Brain/Wiki/Concepts/Where KPM Is Going.md` and
`A-Brain/Wiki/Concepts/The Eight Warehouse Gaps.md`. Five entries is this file's working depth.

## 🟠 LOG TRIMMED HERE — older entries live in `git log -p -- .claude/PROGRESS.md`

and in `A-Brain/Archive/PROGRESS-archive-2026-08-21.md`. Six entries is the working depth.

