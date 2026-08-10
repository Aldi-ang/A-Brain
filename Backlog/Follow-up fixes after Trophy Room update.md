---
title: Follow-up fixes after Trophy Room update
description: Bugs and improvements found during the full re-verification pass, deliberately NOT fixed yet. Ordered by how much they actually matter.
status: To Do
area: Trophy Room / post-update
priority: Medium
created: 2026-07-30
updated: 2026-07-30
---

# Follow-up fixes — found during re-verification, not yet fixed

## 0. 🚨 BIGGEST ONE — rank thresholds are on the wrong scale for the Career Ledger

Found while building the Tier 1 EXP modifier. **Do not turn "Use Career Ledger for Rank" ON until
this is decided**, or every agent will be permanently stuck at the lowest rank.

The rank thresholds (`min`) were written for the OLD formula, where lifetime EXP was roughly raw
rupiah: Silver 25,000,000 / Gold 100,000,000 / Mythic 1,000,000,000.

The new `careerXP()` is on a completely different scale — `rupiahPerXp: 100000`, so
**Rp 100.000 collected = 1 XP**, plus small amounts for verified days, tenure and clean counts.

Measured with real maths (`node`, against the real `career.js`):

> An agent with **3 years tenure, Rp 5.000.000.000 collected, and 900 verified days**
> earns **86.975 XP** — and is still **Bronze**.

To reach each rank on money alone you would have to collect:

| Rank | Rupiah needed |
|---|---|
| Silver | Rp 2.500.000.000.000 (2,5 triliun) |
| Gold | Rp 10.000.000.000.000 |
| Mythic | Rp 100.000.000.000.000 |

**Why it hasn't bitten yet:** the toggle defaults to OFF, so rank still uses the old formula.
It only breaks the moment the new system is switched on — which is the whole point of the
Trophy Room work.

**Options (your call, this is business config — I have not changed your numbers):**
- **(a) Rescale the rank thresholds** in Rank Config to XP units. Using the veteran above as the
  yardstick (~87.000 XP for 3 strong years), something like Bronze 0 / Silver 5.000 /
  Gold 20.000 / Platinum 50.000 / Diamond 100.000 / Mythic 250.000. Keeps the design intent that
  rank blends money + showing up + tenure + accuracy, not money alone.
- **(b) Change `rupiahPerXp`** so XP tracks rupiah closely — simplest, but then tenure and
  discipline XP become rounding errors and rank becomes "who collected the most money".
- (a) is the better fit for what the ledger was built to do.

The Tier 1 Career Dev Tools now show a red warning whenever the top rank needs more than
1.000.000 XP, so this cannot silently come back.


Aldi asked me to recheck the whole update, hunt for bugs my own way, and park anything new
here instead of fixing it immediately. Everything below was found by actually driving the running
app (measuring real DOM geometry at 375 / 800 / 1280px, A/B-ing CSS rules on and off, and walking
all 14 screens), not by reading code and guessing.

**Already fixed in this pass, so NOT in this list:** Lite Mode hiding the sidebar, hamburger
position, sync-pill position + its tablet-width overlap, Capybara on Hitung Ulang Karir failures,
Journey Map clustering, 4 stray CSS build warnings.

## 1. Agent Profile overflows sideways on phones — PRE-EXISTING, real

At 375px the Agent Profile screen has two containers wider than the screen:
- `flex flex-col xl:flex-row gap-8 relative z-10 max-w-7xl mx-auto` — **87px over**
- `flex justify-between items-start mb-4 relative z-10 gap-4` — **78px over**

Proven pre-existing by an A/B test: I disabled my new 44px touch-target rule and re-measured the
same elements. The first stayed at exactly 87px over either way, so it has nothing to do with this
update. The second went 78px → 94px, so the 44px rule adds 16px to a container that was **already**
16px-of-overflow-ago broken.

Why it doesn't show as a visible horizontal scrollbar: an ancestor clips it. So content is being
silently cut off on phones rather than obviously spilling — which is why nobody has reported it.

Worth fixing because Agent Profile is the whole point of the Trophy Room work and field agents are
on phones. Needs a proper responsive pass on that screen, not a one-line patch.

## 2. Sidebar visibility still depends on an animation finishing (normal mode)

The sidebar menu is `opacity: 0` in CSS and is revealed *by* the `reRequiem` animation finishing
(`.boot-1` … `.boot-4`). That is what made the Lite Mode bug possible in the first place.

Lite Mode is now hardened — the menu is pinned `opacity: 1 !important` there, verified live. But
**normal mode still relies on the animation completing**. If a weak phone drops those frames, or a
future change interferes with animations again, the nav goes invisible in exactly the same way.

Recommended: make the resting state visible and let the animation only *enhance* it (animate from
a visible state, or set the final state in CSS and use the animation purely for the entrance).
Deliberately not changed now — it is long-standing behaviour and outside what was asked.

## 3. Journey Map: tooltips still bound on touch devices

MapMissionControl suppresses its map tooltips on small screens (`className="... hidden lg:block"`,
`MapMissionControl.jsx:311`). JourneyView does not — it binds a tooltip to every marker on every
device, and tooltips are useless on touch (there is no hover).

One class added to JourneyView's `<LeafletTooltip>` drops N tooltip listeners on phones. Small,
safe, real. Not applied because clustering was the ask and this is a separate change.

## 4. MapMissionControl showed 0 cluster bubbles in testing — unexplained

While verifying that JourneyView's new clustering works (it does — 19 cluster bubbles + 32 markers
on real data), the same probe on MapMissionControl returned **0** cluster bubbles, despite it
having used clustering long before this update.

Most likely benign — the map may have still been loading points, or sat at a zoom past
`disableClusteringAtZoom={16}`. But I did not confirm either way, and I did not change that file's
map logic (only bulk colour/font edits). Flagging so it gets a real look rather than an assumption.

## 5. Achievement Tester not visually verified — blocked by the Settings PIN

The new Achievement Tester lives in Settings → Architect. Settings is behind the Master Vault PIN,
and I will not enter or guess a PIN, so I could not open the screen to watch it render.

What I *did* verify: its badge-unlock maths against the real `career.js` with assertions (all 5
badges reachable, threshold edges correct, empty state unlocks nothing), that all 4 lucide icons it
imports genuinely exist (a bad icon name is the usual cause of a blank-screen crash), and that the
production build compiles it.

**You need to confirm it actually renders** when you open that tab. It is on the ticklist.

## 6. Rank border gallery — BUILT (partially; unlock-by-achievement still open)

Done: 7 border styles in `src/config/rankBorders.jsx` (Classic, Sentinel Sweep, Aura Pulse,
Sentinel Beacon, Emblem Studs, Tier Segments, Gyro Array), a live preview gallery in the Tier 1
dev tools, and a per-rank **Border** dropdown in Rank Config. All 7 verified live: they render,
and all stay visible with animations deleted (the correct Lite Mode freeze test — Lite Mode does
NOT force `animation-fill-mode`, so an element falls back to its base inline style, not the last
keyframe).

**Still open — the "unlockable" half.** Right now borders are assigned per RANK by the owner.
The original wish was Steam/MLBB style: an agent *earns* borders through achievements and picks
one from their own locker. That needs: unlock conditions per border, the chosen border persisted
per agent (not per rank), and an agent-facing picker that shows locked vs unlocked. The registry
is now the right shape to build that on top of.

## 7. `manualExp` → `bonusXP` migration branch still never independently clicked

Carried from the earlier tickbox. The code path is shared with the already-verified backfill, but
this specific branch (an agent with nonzero legacy `manualExp`) has never been watched running.

## 8. Firestore rules still not deployed

Unchanged and deliberate: `firestore.rules` is a draft file. The career-ledger rules block from
Phase 2 exists in the file but has **not** been pushed to Firebase. Only you deploy rules.
