---
title: Ponder Tutorial System
description: An in-app tutorial on every component, modelled on Create mod's Ponder. Scripted scenes over fixed demo data, never recorded video and never a live spotlight. Two decisions locked, three questions still open, nothing built.
type: concept
created: 2026-08-27
updated: 2026-09-03
confidence: high
checked: 2026-08-27
status: BUILDING — slices 1 and 2 shipped 2026-08-27 (`521b1d9`, `df5c98b`); next is the Kasir scene
tags: [kpm, tutorial, onboarding, ux, design, plan, open, brainstorm]
aliases: [Ponder, Tutorial System, In-App Tutorial, Onboarding Scenes]
---

# Ponder Tutorial System

**Status: slice 1 is built and was looked at.** `.claude/PONDER-PLAN.md` in the kpm-inventory repo (commit `5d4f062`,
2026-08-27) is the whole deliverable. He asked for the plan and **explicitly chose to build
nothing** that session, with ~23% of the quota left.

## The problem, his words

> *"custom instruction menu on each of every components ... so that if our user forgot they can just
> see it from there"*

> *"i want the tutorial to be like video interactive similar to ponder system on minecraft create
> mod"*

## Decision 1 — scripted scenes, not recorded video (LOCKED)

Ponder is not a video player either: it builds a small fixed world from a schematic and runs a
**script** over it. Recorded clips lose to that on three counts here — **eight labels were renamed
on 2026-08-27 alone**, so a clip would have been wrong by the end of the same day; a video cannot
follow dark mode; and it cannot ship inside an offline PWA at a sane size.

## Decision 2 — fixed demo data, not a live spotlight (LOCKED, and it shapes everything)

A scene renders **the real component fed a fixed demo dataset**, rather than spotlighting his live
screen.

| | Spotlight the LIVE panel | Real component + FIXED demo data |
|---|---|---|
| always matches the current UI | yes | yes (same component, different props) |
| works for a brand-new user | **no — empty data is a tutorial full of dashes** | yes, always the same story |
| can teach a state he has never hit (red "3 days left") | no | yes |
| can show a number *changing* | no | yes |
| work needed | less | one small refactor per component |

**This is the version that works for the user who needs a tutorial most: the one whose data is
empty.** Spotlighting live data today would teach Sebaran Stok using Bandung's all-zero row — a
wall of dashes. It is also what Ponder actually does; the schematic world is not your base.

**The cost, taken one slice at a time and never up front:** the visual half of a panel accepts its
rows as a **prop** instead of computing them. Same component in both places, so a scene cannot
drift from the screen it teaches.

## Scene format — data, never React

One file per component under `src/ponder/scenes/`. A scene is `{ id, title, blurb, related, data,
steps[] }`; each step carries `text`, a `focus` key resolved against `data-ponder` attributes, an
optional `act` (open a drawer, switch a tab) and an optional `tick` (a number that counts up rather
than appearing, for the beats that teach a calculation). **Writing a new scene must never require
React.**

## The four audit checks the engine needs

1. every `sceneId` on a `PonderButton` exists in the registry — a typo must fail the audit, not
   render a dead `?`
2. every step has non-empty `text` — a silent step is a black screen
3. **every `focus` key exists as a real `data-ponder` attribute** — this is the one that stops
   scenes rotting when a panel is rewritten
4. the Sebaran Stok formulas appear in the scene file — the migrated check 631, see below

## The footnote migration — recorded so it is not forgotten

**The Sebaran Stok footnote may not be deleted before the first scene exists.** It is currently the
only written record of the two formulas, and check 631 pins them to the screen. So the check
**moves** into the scene file. *Deleting a check to make a change pass is how the thing it protected
comes back* — see [[Anti-Recurrence Check]]. The formulas themselves are why
[[A Ratio of Sums Is Not a Rate]] matters on that panel.

## Project traps written into the plan

Palette law (no blue, no green; gold never text on light) · *Lite mode means performance*, so
nothing rotates and only `transform`/`opacity` animate · `prefers-reduced-motion` must jump to each
step's end state **and keep the captions**, because the tutorial still has to teach with motion off ·
no `window.confirm`/`prompt` anywhere near it · the rail is off-canvas under 1024px, so the overlay
is full-screen there and the caption bar must not cover what it points at.

## Build order — ranked by where a mistake costs money

Slice 1 is the engine on one panel with a placeholder scene. Slice 2 is **Sebaran Stok for real**,
the slice that proves the format. Then one component per slice: Sales Terminal (titip vs paid) →
EOD Setoran → Stock Opname (why the number is hidden) → Restock Vault Request (Siapkan deducts HQ
stock immediately) → Receivables → Fleet & Canvas (loading a van *moves* stock, it does not copy it)
→ Dashboard/Map/Reports last, being read-only.

## ANSWERED 2026-08-27 — all three, plus a fourth he added

> 1. *"teaching just use indonesia, for terms for the features and components just use english"*
> 2. *"scene play but itself but also add pause button or timeframe to restart the tutorial, just
>    like the ponder system inside create mod, i want u to fully research how that works and also
>    find example so u got the image to do this job"*
> 3. *"nope dont push newcomer towards the scene let them figure out by pressing the tutorial button"*
> 4. *"dont use sebaran stock, use proper elegant english terms for that"*

**All four are checks now, not prose** — `integration.audit.mjs` group 56, fourteen of them. A
paragraph recording a preference goes stale in silence; a check cannot.

**On (1):** a teaching sentence is Indonesian and every column name stays in the English it is
printed in on screen, marked `**like this**` so it renders in accent ink. That is what makes an
English term visibly a term rather than a foreign word dropped into an Indonesian sentence — and it
is what sends the reader looking for the same label on the real panel.

**On (4), the name is `Stock by Warehouse`.** Two runners-up lost for stated reasons:
*Stock Distribution* — that screen already has a **Shipping** column, and "distribution" reads as
the shipping operation, so the title could be misread as naming one of its own columns.
*Stock Across Warehouses* — 23 uppercase characters at `tracking-[0.14em]` wrap to two lines on a
phone, and a two-line title is exactly what he deleted the old banner for
([[Aldi's Design Taste]], *"not cool and elegant"*).

## Slice 2 — six more asks in one message, all shipped (`df5c98b`, 651/651)

> *"we can delete this"* … *"i mean the instruction below company total"* · *"make the explanation
> more easier to understand and more descriptive with easy indonesian language"* · *"more variative
> textbox and animation not just static textbox on the bottom just like what create mod have"* ·
> *"improve the higlights animation on each timeframe as well"* · *"i want the tutorial book on the
> very top of the screen for every components"* · *"book SFX also needed here"*

**The footnote is deleted and check 631 MOVED.** Five paragraphs of small print under a table is
where an explanation goes to be skipped; they are sixteen Indonesian beats now, each standing beside
the column it explains. See [[Anti-Recurrence Check]] for why the check moved rather than went.

**The table was extracted** into `ponder/stages/StockByWarehouseTable.jsx`, leaving only the maths in
`BranchWarehouseManager`. The tutorial renders that same component against a fixed demo world.
**Splitting a component splits its checks** — five group-55 checks had to be repointed at the file
the markup moved to, and finding that out was the audit going red, not a guess.

**Captions move now.** `at: 'near'` pins one beside its subject with a pointer; `at: 'bottom'` uses
the wide bar; the pointer aims four ways, because a caption beside a full-height column points
sideways. The two-direction version put the box on top of the table header, over the very numbers it
was describing.

**The book** lives in the shared top bar, so every screen has it. Cover hinged on the spine, lifting
on hover; opens into a two-page spread with tabs down the left edge, a chapter opener on the left and
entry cards on the right. All seven sections are listed, and an unwritten one says **belum ditulis**
on its own face rather than being absent. The shape is from the Minecraft dictionary book he sent;
none of its colours are, because that book is green.

**Sounds** are the app's own audio re-pointed through `useSound`, which is already silent in Lite
Mode. Real book audio is a four-line swap, written down in `sfx.js`.

**The expensive bugs: [[An Effect's Own Cleanup Can Cancel Its Frame]], and it is now a family of
five.** It silently deleted the whole spotlight, later rendered the book invisible, then replayed the
book on every render — and on 2026-08-27 two more turned up in the same files:
[[A CSS Animation Outranks Your Inline Style]] (every caption sat on top of its own subject) and
[[A Rect Is Painted, Not Laid Out]] (the first beat of every scene measured 6% small). Every check
was green for all five.

## What slice 1 actually built (`521b1d9`, 645/645)

`src/ponder/`: `useScenePlayer` (the clock), `PonderOverlay` (the player), `PonderButton` (the chip
in the panel header), `registry.js`, one scene, one disposable stage. Autoplay, a real Pause,
Restart, a 3px timeline with a notch per beat, Comfy Reading, arrow keys, Esc.

**Slice 2 is the only queued job:** extract the real table into a presentational component, feed it
`DEMO_WAREHOUSES`, delete the placeholder stage and the footnote, and **move** check 631 onto the
scene file. See `.claude/NEXT-SESSION.md` in the repo.

See [[What Create Mod's Ponder Actually Does]] for the mechanics this was built from, and
[[Looking at the App]] for how a frame of it was obtained without the vault password.

## Rejected on purpose — do not re-propose

Recorded video/GIF tutorials · spotlighting live data · Ponder's 3D camera work and schematic
format · long scenes (ours are 30-45s, 5-8 steps) · refactoring every component up front.

Source: [[../Summaries/Surat Jalan Desk and Sebaran Stok]] §9.

See also: [[Aldi's Design Taste]] · [[Where KPM Is Going]] · [[The KPM Control System]]

## Goods Received, and his four faults (`8109559`, 663/663)

Aldi's message of 2026-08-27 named four things, and the fix for each is now a check in group 56:

1. **The caption covered its subject** — [[A CSS Animation Outranks Your Inline Style]]. Not the
   height guess everyone assumed: `EST_H` was 150 against a real **109**, so the room test was
   rejecting space that would have worked. Every placement branch returns a final `top` now.
2. **Only one of three costs lit.** `focus` takes a **list** of keys; `measure()` already unioned the
   rects of every hit, so the single-valued key test was the only thing in the way.
3. **The stage scrolled under the caption** — it overflowed its window by 27px, enough to drift a
   caption off its subject, too little to read as a scrollbar. **Sized to fit, not locked:**
   `overflow-auto` stays as the phone's safety net, because locking it would have made everything
   below the fold unreachable.
4. **Click-to-jump built.** Press any part a beat explains and the scene seeks to the first beat
   naming that key. Only parts some beat covers get a cursor — a pointer on a part nothing explains
   promises a jump that cannot happen. This also makes the queued *Identify-on-hover* idea small,
   since it is the same wiring.

## One tutorial, both widths — the follow-camera decision (2026-09-01)

Aldi's open question was whether the phone gets its own Ponder. It does not. He chose the
**follow-camera** — *"do follow camera then"* — and the argument that won was maintenance, not
motion: **a second phone tutorial is a second thing to keep in step with every UI change**, while
the highlight's rect is already measured, so following it costs a few lines.

The camera it replaced was aimed wrong on the horizontal axis at every phone width. See
[[../Summaries/The Camera Was Aimed at the Wrong Scroller]].

Also from that block: the highlight ring got its own `TONE_RING` map and reads orange at 2px,
because `border-line-3` — the grey used for table rules — was not legible as a highlight.

## One idea per beat, and every beat points at something (2026-09-04)

*"there is too much words but too little showing"*, then the instruction that fixed it — *"make sure
that for almost every sentence there is some textbox to highlights and explain not just sentence
reading"*, and *"also apply this logic to other tutorial as well"*.

**The rule now: a beat says one sentence and highlights the one thing that sentence is about. A
sentence that cannot point at anything does not belong in a scene.**

Applied to all five scenes in one day. Measured before and after, because "wordy" is not an opinion
when it can be counted:

| | before | after |
|---|---|---|
| beats across the book | 69 | **168** |
| average characters per beat | 136 | **68** |
| beats over 150 characters | 19 | **3** |
| distinct focus keys | — | 80 |

⚠️ **THE DIAGNOSIS WAS NOT "THE WORDING IS BAD".** `regional-warehouse` had ten paragraphs sharing
seven keys, five of them focusing the same tab in a row — and its stage body was a single line of
grey placeholder text, so there was physically nothing else to point at. The other four stages were
already rich (`StockByWarehouseTable` 36 anchors, `ProductPerformanceTable` 14, `GoodsReceivedStage`
12) and their scenes simply used a fraction of them. **Count the anchors before rewriting a word.**

⚠️ **A STAGE THAT REFUSES DEMO CONTENT IS ARGUING WITH THE REST OF THE CODEBASE.**
`RegionalWarehouseStage` carried a comment rejecting a demo body as "a second version of the screen
to keep correct". But `GoodsReceivedStage` is hand-built demo markup and always was, so the rule was
one no other stage followed. The real protection is not abstinence — it is the audit check that
every `focus` key must resolve to a `data-ponder` attribute, which turns a renamed anchor into a
failed build instead of a tutorial pointing at nothing.

**Use the screen's own words in demo markup.** "Scan barang sampai", "Qty (Bks)", "Buku Besar" — a
tutorial that renames a button teaches a button that does not exist.

## Presence is not visibility (2026-09-04)

**A beat may not point inside something that is closed, and this shipped.** `stock-by-warehouse` had
a beat carrying `act: 'close'` while focusing `item:bandung-choco`, an item inside BANDUNG's drawer.

Why every existing check missed it: the drawer collapses with a `0fr` grid track instead of
unmounting, so **the element still exists**. `querySelector` finds it. The audit's `resolvesKey`
finds its key in the source. The highlight drew a ring with no height around something nobody could
see, and every suite was green.

**A DOM presence check would also have passed.** That is the part worth remembering: for anything
that can be collapsed, hidden, or behind a tab, presence proves nothing and only geometry or a
replay of the scene's own state script can tell the truth.

Two checks now close the class (`integration.audit.mjs`, search `strandedBeats`): one replays each
scene's `act` script the way `StockStage.scriptedOpen` does and demands any `item:`/`drawer:` key be
inside whatever is open at that beat; the other pins every `item:` key to a product that exists in
the demo world. Trialled red by restoring the shipped bug — it failed alone, naming the two beats.

⚠️ **A browser walk was tried first and abandoned.** Clicking through 51 steps stalls past the
45-second tool limit because the pane does not composite ([[Looking at the App]]). The replay check
is better anyway: exact rather than sampled, and it cannot go stale. **When the UI cannot be driven,
check the state machine instead of the pixels.**

Related: [[Aldi's Design Taste]] · [[Looking at the App]] · [[What Create Mod's Ponder Actually Does]]
