---
title: "Lessons Archive"
description: Where Alucard's retired lessons go when its 5-entry cap is hit. Append-only, never loaded into context — this is the pressure-release valve that keeps the live lessons file small.
type: archive
created: 2026-07-28
updated: 2026-07-28
tags: [alucard, lessons, archive, meta]
---

# Lessons Archive

Retired entries from `~/.claude/skills/alucard/lessons.md`.

**Never loaded into context.** That is the entire point. Alucard's live lessons file is
capped at 5 entries; when it hits the cap, the oldest entry with **zero recorded fires** is
moved here rather than the cap being raised. All growth pressure routes to this file, so the
per-invocation cost of the learning loop stays flat no matter how long it runs.

An entry arriving here with zero fires is not a failure to be embarrassed about — it is the
loop working. A lesson that never fired was a hypothesis that didn't pay off, and saying so
plainly is more useful than keeping it around to pad the file.

## Rules

- Append only. Never edit or delete an archived entry.
- Keep the original date and the `Fired:` line as-is, so the record of "this never fired"
  survives.
- If an archived lesson later turns out to matter, do **not** move it back — write a fresh
  entry in the live file and link back here.

---

<!-- archived entries below this line -->

## Retired 2026-08-10 — the first archive, and the first one retired WITH fires

The cap rule assumed the archive candidate would always have zero fires. On 2026-08-10 all five
entries had fired, so there was no candidate and "or don't write" was the only branch left —
Alucard had silently lost the ability to learn anything new. Aldi chose to archive a fired entry
anyway: *"i think i choose A because lesson is part of experience that alucard can use to be wiser
in the future right, memories also important for AI not just human"*.

**Which entry, and why not the oldest.** Four entries shared the oldest date (2026-07-29). The one
below was picked instead of the first-listed because earlier the same day, seven rules ported from
Hermes Agent added this to `SKILL.md` §8:

> Never a Lesson that a tool, API or environment is broken — "X does not work" outlives the fix
> and you will cite it against yourself. Record the FIX (command, flag, config), or nothing.

This entry is exactly that shape — a negative claim about a tool, unverifiable now, and one that
fires every time its trigger comes up, so it would otherwise have been the last thing ever
archived. It was written before the rule existed. Retiring it applies the rule retroactively, once.

The useful half survives as a fact rather than a verdict: **`agent-browser` ships a CLI binary
taking the same commands as its MCP tools** (`agent-browser open/click/eval/...`, same daemon,
same session). Whether the MCP path still hangs is **unknown** — re-test, do not assume.

### 2026-07-29 — agent-browser MCP tools hang; the CLI binary doesn't
**Trigger:** before retrying a hung `mcp__agent-browser__*` call a second time, or before
reporting the tools as unusable.
**Lesson:** one retry max, then drop to the `agent-browser` CLI directly via Bash (same daemon,
same session — `agent-browser open/click/eval/...`) instead of retrying the MCP tool again.
**Would have prevented:** `mcp__agent-browser__agent_browser_open` hung silently for 30 min,
retried once, hung another 30 min — 60 min dead with zero progress. The CLI form of the exact
same command (`agent-browser open <url>`) worked instantly on the first try right after.
Seen: 2026-07-29
Fired: 2026-07-29 (this session — switched to CLI after 2nd MCP hang, rest of both Phase 0 tests ran through it)

### 2026-08-11 — a fixed element anchored to a resizable container must be checked at EVERY size
*Archived 2026-08-12 at cap, zero fires. Still true; it just never got a chance to fire.*
**Trigger:** before a completion claim on any `position: fixed` element whose offset is computed
from a container that the user can drag, snap or animate to another size.
**Lesson:** evaluate the offset arithmetic at each snap point, not just the resting one, and say
which sizes were checked. If any size pushes it past a viewport edge, pick the direction per size.
**Would have prevented:** shipped and committed `237bf6f` with the customer suggestion list pinned
`bottom: calc(var(--drawer-h) + 8px)`. Correct at the 96px and 55% snaps, but the drawer also snaps
to 92% of the screen, where the 192px list renders ~200px above the top edge — invisible, and no
customer selectable at all. Caught 20 minutes later by re-reading the geometry, in a second commit.
Seen: 2026-08-11
Fired: never

### 2026-08-12 — price a fan-out against the quota BEFORE launching, and never let one last agent own the answer
*Archived 2026-08-14 at cap, zero fires. Still true; it just never got a chance to fire — no
Workflow run happened between it being written and the cap being needed again.*
**Trigger:** before calling `Workflow` (or any fan-out) whose deliverable is produced by a single
synthesis agent at the end. Read the `[plan-quota]` / `[context-watch]` number first, out loud.
**Lesson:** size the run to the stated headroom, not to the task; and make each worker persist its
own findings, so a mid-run limit costs the summary, never the work. If the headroom cannot cover
the run, say so and hand-verify instead — that is what actually found the bugs both times.
**Would have prevented:** two runs died at the session limit before synthesis and produced no
report: `wf_6d41c78e-354` (641k tokens, 9 of 12 agents errored, `laporan: null`) and
`wf_f20bc26d-9ec` (584k tokens, 21 tabs traced, `rencana: null`). 1.2M tokens, both reports lost,
findings recovered only by hand-parsing `journal.jsonl` afterwards. The quota hook had already
printed 76% before the first launch, and I launched anyway. Aldi, 2026-08-12: *"u just failed to
measure the token usage"*.
Seen: 2026-08-12 (twice in one night)
Fired: never

### 2026-08-14 — PORT the solved layout, never rebuild the second one from a blank page
Archived 2026-08-18 at cap, zero fires. **Not retired** — the same rule is written into
`alucard/SKILL.md` §4 ("Second layout of an existing component"), so it still runs at plan time.
**Trigger:** at plan time, before writing the `lg:`/`md:` half of a component whose other width is
already finished and signed off. Also before any "make X work on PC/phone too".
**Lesson:** list what the solved width already answers — density, labels, spacing, states, what
hides, what expands — and port each answer or say in one clause why this width differs. Read the
solved layout's classes AND the audit checks that pin them before the first edit.
**Would have prevented:** built the desk navigation from scratch on 2026-08-14, so four things
Aldi had already decided for the phone on 9–10 August had to be re-specified by him in one
message: two columns, a label under the pointer, the music player's pill shape, the agent's own
profile picture. It also produced a defect the solved width never had — an 88px strip clipping the
logout button's 118px hover expansion. His words: *"because of that i need to tell u twice,
yesterday and today"*.


---

## Archived 2026-08-18 — chosen because it was superseded in part AND over length

At 5/5 with every entry fired, §8's old rule left no archive candidate and the loop went quiet.
Aldi gave permission to fix the rule; the new rule says to archive one anyway and name the reason.
This entry was picked over the two older ones because half of it had already been overruled by his
own instruction — *"if the browser is broken then fix it until u can see it"* — and because it had
grown to five times the four-line cap. Its live half survives as a new entry in `lessons.md`.

### 2026-07-30 — verify JS-rendered Artifacts by executing them in Node, not the Browser pane
**Trigger:** before claiming a published JS-heavy Artifact renders, when the Browser pane can't show it
(file:// = static snapshot, no JS; localhost blocked by policy; claude.ai artifact needs a login the pane lacks).
**Lesson:** skip the browser dance — `new Function(scriptSrc)` for syntax, then run the DOM-build with a
stubbed `document`/`matchMedia` and assert each injected fragment is non-empty and tag-balanced. Then say the
pixels are Aldi's to verify, not mine — never claim visual correctness I couldn't see.
**Would have prevented:** burned 5 Browser-pane calls (preview_start file://, navigate, 2 failed screenshots,
blocked localhost) finding out the pane can't render a script-built artifact, before falling back to Node.
Seen: 2026-07-30, 2026-08-02 (2nd — MISSED: sent dukes-ledger-v2.html to the render panel with
display:"render". Body holds 0 elements before <script>; all 47 buttons are built in JS, so Aldi
got a black frame and unpressable UI, and read it as the prototype having lost its contents.)
Fired: 2026-07-30 (this session — Node execution verified phase2-design.html: 15 cards/3 mocks/11 swatches)
Fired: 2026-08-02 (after the miss — gave the published artifact URL, which runs JS, instead of the file)
Fired: 2026-08-10 (second half only, no artifact involved — VaultGate port: Browser pane refused to
composite, stopped after 4 calls instead of fighting it, and reported the unlock sequence as Aldi's
to verify rather than claiming a look I never got)
Seen: 2026-08-16 (3rd — MISSED THREE TIMES IN ONE SESSION: told Aldi light mode was fixed, then the
shell was fixed, then the background was fixed, having rendered nothing. His reply: *"the background
is still black on light mode, why are u rushing things that havent done"*.)
⚠️ SUPERSEDED IN PART, 2026-08-16, by Aldi's own instruction: *"if the browser is broken then fix it
until u can see it"*. This entry's "say the pixels are Aldi's to verify" branch is now the LAST
resort, not the first — build the viewing path instead. For KPM that path exists and is documented:
`A-Brain/Wiki/Concepts/Looking at the App.md` (`tools/theme-lab-server.mjs`, plain HTTP over
`dist/`, no login, HTTPS dev server untouched). Handing back an unverified look is only acceptable
after that harness has been tried.


---

## Archived 2026-08-18 (2nd today) — chosen by oldest last-fire

Second use of the revised §8 rule. Every entry had fired, so one had to go; this one's most recent
fire is 2026-07-29, three weeks stale, and the work has moved away from handing Aldi install
commands to run by hand. It is still true — restore it from here if skill installs come back.

### 2026-07-29 — install commands need an explicit cwd, and -g when the goal is PATH
**Trigger:** before handing a multi-line install command to the user to run by hand (or running
one myself) meant to end with a bare CLI command on PATH.
**Lesson:** state the exact directory to run it in; use `-g` (or `npx`) when the goal is a
PATH-available binary — a local install with no stated cwd risks landing in the wrong folder.
**Would have prevented:** told Aldi `npm install agent-browser` (no `-g`, no cwd) — he ran it
from `C:\Users\ASUS`, added a line to an unrelated pre-existing `package.json` there, and the
follow-up `agent-browser install` failed with "not recognized," nothing ever reached PATH.
Seen: 2026-07-29, 2026-07-29 (2nd — MISSED: gave `npx ui-ux-pro-max-cli init --ai claude` with no
`--global` and no cwd; installer defaults to process.cwd(), Aldi ran it from the kpm-inventory repo,
145 untracked files landed in his production repo one broad `git add .` from being committed)
Fired: 2026-07-29 (git clone commands for skill installs, absolute destination paths given)
