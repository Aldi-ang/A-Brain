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


<!-- archived 2026-08-19 from lessons.md, HAD fired, at 5/5-all-fired; chosen by oldest
     last-fire (2026-08-01). Still true, but graphify's caller lists have not been the load-
     bearing step in weeks, and the slot was needed for a live failure. -->

### 2026-07-29 — graphify call-edge queries undercount real callers
**Trigger:** before claiming a graphify `--context call` / "who calls X" query found the
complete or all callers of a function.
**Lesson:** cross-check with `grep -rn "await <fn>(" src/` (or the language-appropriate
call pattern) before asserting completeness. Treat graphify's caller list as a lower bound,
not a final answer — its call-edge extraction is a heuristic, not exhaustive.
**Would have prevented:** benchmark run 2 (2026-07-29, T1) answered "commitInChunks has 7
callers... graphify gave the complete answer without needing to search further." Real count,
grep-verified: 21 call sites across 7 files. Run 2 missed 14 of 21 — including 7 of 8 in
App.jsx alone, the same file run 1 (grep, no graphify) got completely right.
Seen: 2026-07-29
Fired: 2026-08-01 (RankBorder callers — grepped instead of trusting graphify; found exactly 2 render sites, AgentProfileView + CareerDevTools gallery, so the per-agent border change stays one file)


<!-- archived 2026-08-20 from lessons.md, HAD fired (2026-07-29), at 5/5-all-fired.
     Chosen by oldest last-fire: no third-party skill has been installed since. Still true. -->

### 2026-07-29 — a skill's own "setup" doc can be the attack, not the SKILL.md
**Trigger:** before promoting any third-party skill into a discoverable `~/.claude/skills/<name>/`
path, or following a skill's "if key not set, read X" onboarding pointer.
**Lesson:** read every reference file a SKILL.md points to (auth/setup docs especially), not just
the SKILL.md itself. A clean-looking SKILL.md and a low star count do not clear the onboarding doc.
**Would have prevented:** was about to promote `youtube-skills/skills/youtube-full` before reading
`references/auth-setup.md`, which instructs registering a third-party account on the user's behalf,
laundering a live API token through a temp file to dodge output redaction, and — naming Claude Code
specifically — writing the fetched secret into "whatever config file Claude Code reads at runtime."
Seen: 2026-07-29
Fired: 2026-07-29 (caught before install, this session)


<!-- archived 2026-08-20 from lessons.md at 5/5. Chosen by oldest last-fire among the
     entries that HAD fired; hashes have been read from git log every time since. Still true. -->

### 2026-08-18 — read the hash, never write one from memory
**Trigger:** before writing any commit hash into A-Brain, PROGRESS.md or a reply — the moment a
sentence is about to name one.
**Lesson:** run `git log -1 --format=%h` in THAT repo and paste what it prints. A hash written from
memory looks exactly like a real one, and nothing downstream can tell.
**Would have prevented:** wrote `b0b8ad1` into the concept page and Log.md this session for a
commit that is actually `4b63118`, then had to make a second vault commit to correct three
occurrences. Had it not been caught, the vault would permanently point at a commit that does not
exist — in the one file whose whole job is to be trusted later without re-checking.
Seen: 2026-08-18
Fired: 2026-08-18 (this session, twice — read git log -1 before writing f1e3b28 and 4b63118 into A-Brain; the first vault write of the day is the one that had to be corrected)

### 2026-08-20 — fanning out is the cost lever, and the agents inherit Opus
**Status:** RETIRED (2026-09-02) — converted to structure. SKILL.md §9a is a hard gate that runs before any agent() call, and Aldi banned fan-out outright on 2026-08-20; a prose reminder cannot beat a gate.
**Trigger:** before launching a workflow or any multi-agent fan-out on Aldi's plan — the moment
more than one agent is about to be spawned.
**Lesson:** subagents inherit the session model, and `model` cannot be lowered here (see the
model-tier memory: setting it kills the agent). So the ONLY lever is agent COUNT. If the question
is "what does this file do", read it yourself — two greps beat four Opus tracers.
**Would have prevented:** 2026-08-20, quota at 91%, launched a 4-lens workflow with per-finding
refuters to trace one frozen sale. He asked "why did u use all the agent in opus". The answer that
actually located the bug was one grep for `onProcessSale` — it is a two-line wrapper. The run was
stopped unread.
Seen: 2026-08-20
Fired:

### 2026-08-20 — test the primitive before tracing the path
**Status:** RETIRED (2026-09-02) — never fired in 13 days of real work. The two-grep test in SKILL.md §9a already carries it.
**Trigger:** the moment a code path "should work" and the user reports it does not — before
reading the path a second time, and before any fan-out.
**Lesson:** name the one assumption the whole trace stands on, and run a ten-line experiment on
THAT. `disableNetwork()`, a stub, a node one-liner. Reading the path again only re-confirms your
own model of it.
**Would have prevented:** 2026-08-20, the frozen offline sale. Three rounds of tracing, two real
but irrelevant fixes shipped, ~1.05M subagent tokens, and he reported it broken three times. The
answer was that a Firestore write promise never settles offline — proved in 10 lines, in one turn,
once it was finally asked. The bug was one un-awaited call away the whole time.
Seen: 2026-08-20
Fired:


### 2026-08-24 — grep the taste file for locked laws BEFORE proposing a visual change, not after
**Status:** RETIRED (2026-09-07) — never fired in 14 days of real work. Already enforced
structurally: SKILL.md §1a mandates loading `Aldi's Design Taste.md` before ANY design work, so
this entry was the same rule said louder. Retired per §8b rather than repeated.
**Trigger:** before proposing ANY change to a colour, material or treatment that already ships —
the moment a specific token, fill or surface is named as the thing to change.
**Lesson:** run `grep -n "^## " "A-Brain/Wiki/Concepts/Aldi.s Design Taste.md"` and read every
heading carrying a red marker. They are locked laws in his own words, and the headings alone are
enough to spot a collision. SKILL.md §1a already mandates loading that file for design work, so
this is not a new rule - it is the one-command form of a rule that got skipped because the task
looked too small to need it. **The size of the edit is not evidence about the size of the law.**
**Would have prevented:** 2026-08-24. A two-line token swap looked too small for the design stack,
so it was skipped, twice, deliberately, and said so out loud. The whole session then went into
proving an amber plate impossible, computing feasibility windows, running a trial edit against
the repo and drafting a contrast-rule change - all aimed at making 68 amber FILLS. The taste file
says *"AMBER IS AN EDGE AND AN INK. IT IS NOT A FILL"*, quoting him twice, the second time as
*"stop using amber background i said, i hate it"*. Aldi caught it by asking *"already load all the
skills to do the job?"* - the user did the check the process was supposed to do.
Seen: 2026-08-24
Fired:

Archived: 2026-09-08 (retired 2026-09-07, moved per SKILL.md 8a).

### 2026-08-25 — measure what a thing costs EVERY session before judging whether to adopt it
**Status:** RETIRED (2026-09-08) — never fired in 14 days of real work. Not convertible to a
check: it fires only when a whole skill pack or context file is being adopted, which happened
once. Retired per 8b as a rule whose trigger is too rare to earn a standing entry; the one
command it prescribes lives on in SKILL.md 1b, which quotes a token price in every skill offer.
**Trigger:** before adopting anything that loads on every session — a skill pack, a plugin, a
hook, a CLAUDE.md block, a context file. The moment the question is "should we install this".
**Lesson:** measure its per-session token cost FIRST, in one command, before reading a word of
its README. A catalog's own index file or the frontmatter of its skills gives the real number.
That number often settles the question alone and makes the rest of the reading unnecessary.
Stars, licence and features rank a thing on axes that say nothing about what it costs forever.
**Would have prevented:** 2026-08-25, asked to add 19 skill repos. Read three full READMEs,
fifteen metadata rows and seven directory listings first, ranking them on licence and purpose.
Then one command measured the catalog: 818 skills = 89,705 tokens in EVERY session, 14x his
entire installed set, on the account of the person who had PROGRESS.md trimmed for costing
50,000. That single number decided 18 of the 19 cases and could have been the first thing run.
Sibling of "test the primitive before tracing the path" — same instinct, different checkpoint.
Seen: 2026-08-25
Fired:

Archived: 2026-09-09 (retired 2026-09-08, moved per SKILL.md 8a).

### 2026-08-26 — an installed skill's `description` is not its only trigger surface
**Status:** RETIRED (2026-09-09) — never fired in 14 days of real work. Not convertible here: it fires only
when a third-party skill pack is installed, which happened once. The habit it prescribes now lives
in SKILL.md 1b, which keeps the 1,200-skill library outside ~/.claude/skills so nothing auto-fires.
**Trigger:** before installing any third-party skill, plugin or marketplace entry — after the
files are copied, before saying it is installed.
**Lesson:** read the WHOLE frontmatter, not the description. A skill can carry `triggers:`,
`auto-invoke`, `preamble-tier` and other keys that make it fire on its own regardless of what the
description says. Rewriting the description to say MANUAL ONLY changes nothing if a `triggers:`
list is still sitting three lines below it. Grep the installed copy for every frontmatter key and
justify each one before claiming it is opt-in.
**Would have prevented:** 2026-08-26, the gstack install. Four skills were installed with their
descriptions rewritten to "MANUAL ONLY — never invoke unless Aldi types it by name", and all four
still shipped `triggers:` blocks underneath — 22 lines of them, including "show me design
options". Any of them would have auto-fired a 16k-26k-token skill on an ordinary sentence, in the
same session where Aldi had just said *"we have limited token so make sure that inefficient token
usage skills are stores instead of auto use"*. Caught only by eyeballing the frontmatter after the
install had already been reported as done.
Seen: 2026-08-26
Fired:


### 2026-08-26 — a green build is not a check that the identifiers exist
**Status:** RETIRED (2026-09-09) — never fired in 14 days of real work. Converted, not dropped: its structural
form is an ESLint `no-undef` gate over the touched files, which cannot go stale the way this
paragraph can. Successor is that gate; re-write this entry only if the gate is refused.
**Trigger:** after moving state or a helper OUT of a component — an extraction, a rename, a split
into a shared file — and before reporting the change as done.
**Lesson:** a bundler resolves IMPORTS, not free variables, so a call to a setter that no longer
exists builds cleanly and throws only when that line runs. Text-grepping self-checks cannot catch
it either: they read source as a string and have no idea what a scope is. Run the linter's
`no-undef` over the touched files. If the repo's lint is too noisy to gate on — this one carries
~290 findings — gate on that ONE rule rather than skipping the linter, because it is the rule that
separates "untidy" from "blank screen". And do not trust a grep to stand in for it: searching
`scrub` does not match `setScrub`, which is exactly how the manual check missed it too.
**Would have prevented:** 2026-08-26, the dashboard rebuild. Extracting the chart into PaceChart
took its `scrub` state with it and left `setScrub(null)` behind in an effect. Build passed, the
607-check integration audit passed, 813 logic checks, 26 threshold checks and every contrast pair
passed — and the first time Aldi opened the screen it rendered "[DASHBOARD] FAILED TO LOAD",
because the error boundary swallowed the whole tab. Diagnosing it cost a vault unlock, a console
flooded with ~60 Firestore clock warnings that hid the one real line, and a page reload that wiped
the collector armed to catch it. ESLint had reported it as `no-undef` the entire time.
Seen: 2026-08-26
Fired:



### 2026-08-26 — read a screen's real field names before proposing its replacement
**Status:** RETIRED (2026-09-09) — never fired in 14 days of real work. Retired per 8b as a platitude: "read
the file before redesigning it" is already what SKILL.md 4 requires at plan time, so this entry
restated a default instead of naming a new checkpoint.
**Trigger:** any redesign, mockup or "what should we add here" for an EXISTING screen — the moment
a replacement layout is drawn instead of a line edited.
**Lesson:** grep the target file for its actual field and state names first, and lay the proposed
design against that list. A redesign that silently drops a working field does not read as an
oversight; it reads as a removed feature, and the only person who can catch it is the owner.
**Would have prevented:** the first Restock Vault artifact left out the resi, the nota photo and
the shipment photo. All three are in `RestockVaultView.jsx` — `trackingNo`, `receiptFile` →
`receiptUrl`, `packagePhotoUrl` — and one grep finds them. Aldi caught it instead ("dont forget
place to put the bukti foto shipment and the resi receipt") and the artifact was rebuilt whole.
That same grep, run late, also produced the two findings the redesign existed to produce: the
shipment photo is only ever WRITTEN by the branch screen, and the factory's own surat-jalan number
has no field at all. Both arrived only because he pushed back.
Seen: 2026-08-26
Fired:



<!-- archived 2026-09-12 from lessons.md -->

### 2026-08-27 — a closed verification path costs more to re-prove than to ask about
**Status:** RETIRED (2026-09-10) — never fired in 14 days of real work. Retired per 8b as a
platitude: it restates the cost model already in SKILL.md §9 (cost = context × turns), and its
trigger was never specific enough to catch anything a plan-time read would miss.
**Trigger:** finishing a change in this repo and reaching for the browser to see it — any session
where the work lands behind the Master Vault gate, a self-signed dev cert, a login, or anything
else the handoff notes already flag as unreachable.
**Lesson:** the traps list in `.claude/NEXT-SESSION.md` is not background colour, it is a map of
which paths are closed. When it says a path is closed, the cheap move is ONE line asking him to
open it — not a sequence of tool calls that ends up demonstrating the note was right. Read the
traps before opening the browser, not after it fails. And treat an unfamiliar browser MCP as a
last resort rather than a fallback: it can stall for its full idle timeout, which is dead
wall-clock nobody can interrupt.
**Would have prevented:** 2026-08-27, the Request tab session. The notes already said *"the
vault gate re-locks; he must type the password, you cannot."* Tried anyway: ~10 tool calls plus an
`agent_browser_open` that hung its full **1800s** idle timeout. He opened Chrome himself in the
end — which is exactly what one line of asking would have got, immediately.
Seen: 2026-08-27
Fired:

---

### 2026-08-27 — a total ÷ a total is only a rate if the things are interchangeable
**Status:** RETIRED (2026-09-10) — never fired in 14 days of real work. Not convertible into a
check: it is a statistical reasoning rule with no file to guard and no mutating action to gate.
Retired as a platitude.
Summing a numerator and summing a denominator, then dividing, silently assumes every item in the
sum can substitute for every other. For stock, demand does not transfer between products. Aggregate
the RATIO per item (min / count-at-risk), or do not print a total at all.
**Would have prevented:** 2026-08-27, Sebaran Stok. I shipped a warehouse-level "Est. days left" as
`total shelf ÷ total daily rate`. Master Vault read **348 days**. That entire rate was one product,
Cello Chocolate; the other four sold nothing — and Chocolate itself had **20 days**. The headline
figure was 17× more comfortable than the truth, on the exact panel built to answer "which warehouse
do I restock first". Every check passed, the build was green, and I verified the arithmetic on
screen twice — the arithmetic was right and the statistic was meaningless. **Aldi caught it, not
me:** *"u cant just divide total with the average goods like that, these are different goods should
have their own depleted number"*. Cost a shipped wrong number in front of the owner and a full
remove-and-recheck cycle. Verifying that a number computes is not verifying that it MEANS anything.
Seen: 2026-08-27
Fired:

---

---

### 2026-08-27 — a headless frame narrower than the browser's minimum window is a CROP
**Status:** RETIRED (2026-09-10) — never fired in 14 days of real work. Converted, not dropped:
the headless harness built on 2026-09-09 for the sale-proof camera sets its own viewport, so the
fact now lives in runnable code instead of prose. Re-write this only if that harness is removed.
**Trigger:** before reading any headless-Chrome screenshot taken at a phone width, and before
reporting a responsive layout as broken or fixed on the strength of one.
**Lesson:** make the page report its own `window.innerWidth` and compare it to the width you
asked for. Chrome on Windows will not open a window under ~518 CSS px, so `--window-size=375`
lays out at 518 and saves the left 375px — a picture of a wide layout with the right-hand third
sliced off, which is visually identical to a component overflowing its viewport.
`--force-device-scale-factor` does not help; it scales output, not the viewport. 518px is still a
valid narrow frame, being under both the `sm:` and `lg:` breakpoints.
**Would have prevented:** 2026-08-27, Ponder slice 1. Three phone screenshots each "showed" the
overlay overflowing: close button gone, caption clipped mid-word, controls cut. A real browser at
a 375 viewport measured the panel at 375 with zero overflow — it had never been broken. Cost three
shots, two rounds of diagnosis, and a layout change made against a bug that did not exist. The
change was kept on other merits, which is the part that would have hidden the mistake.
Seen: 2026-08-27
Fired:

---

---

### 2026-09-01 — never send JavaScript through `node -e` inside a double-quoted shell string
**Status:** RETIRED (2026-09-12) — converted into a hook. Prose fired four times and never held; `A-Brain/automation/heredoc-gate.mjs` now refuses the command itself (PreToolUse on Bash, registered in kpm `.claude/settings.json`). Aldi approved it 2026-09-12: "yes add the guard if needs to". Proven live the same session: a heredoc with a backslash was blocked with the message.
**Trigger:** before running any `node -e "..."` / `python -c "..."` that patches a source file — the
moment the code being passed contains a template literal, `$`, a backtick, or a backslash class.
**Lesson:** write the patch script to a file and run the file, or use a quoted heredoc (`<<'EOF'`).
The shell expands `${...}` and command-substitutes backticks INSIDE double quotes, so the string
node receives is not the string you wrote. It fails silently on the parts that happen to expand to
nothing.
**Would have prevented:** 2026-09-01, patching PonderBook.jsx. Two `el.animate` keyframe lines came
out as `[{ transform:  }, { transform:  }]` — the template literals were eaten and the replacement
still "succeeded". A separate regex patch was mangled the same way and left the audit file with
`/{safeTurn} / {maxTurn}/` in it, which is a syntax error, not a regex. The build caught one; the
other two were found only by reading the block back. A book whose sheets animate to nothing would
have passed every check.
Seen: 2026-09-01
Fired:
Fired: 2026-09-02 (THIRD occurrence, and the prose is not working — twice in one session a python heredoc ate escapes in an audit patch: `
` inside a JS regex literal became a real newline, and `'` became a bare quote that broke the string. Structural rule replacing the prose: if the payload contains a backslash, a backtick or `${`, write it with the Write tool and splice the FILE. Never build it inside a heredoc string.)
Seen: 2026-09-12 (FOURTH. A quoted heredoc <<'EOF' — the thing the Lesson line still recommends — collapsed a \n to a real newline and broke a 115-line markdown heredoc on a backtick. Three turns lost before switching to the Write tool. The Lesson line's heredoc advice is wrong in this harness; the 2026-09-02 structural rule is the only one that holds: payload has a backslash, backtick or ${ → Write tool, then run the file. Not yet a hook; proposed to Aldi 2026-09-12.)

### 2026-09-02 — a literal that duplicates a named constant is a silent override, not a duplicate
**Status:** RETIRED (2026-09-16) — platitude — 14 days, three sessions of clamps and defaults written, never fired; no structural form (no lint for 'quantity already has a name')
**Trigger:** before writing any clamp, floor, ceiling or default as a bare number — the moment
`Math.max(90, x)` / `?? 300` / `|| 0.5` is about to be typed.
**Lesson:** ask whether that quantity already has a name in the codebase, and use the name. Two
numbers for one quantity do not disagree loudly; the one LATER in the pipeline silently wins, and
every check that reads the earlier one keeps passing. If the second place genuinely needs its own
value, it needs its own NAME, so the two can be seen to differ.
**Would have prevented:** 2026-09-02, the tutorial book's page riffle. `pageModel.js` planned a
60ms floor per page turn; `play()` in `PonderBook.jsx` floored the same value at a literal 90.
The longest run took 1260ms instead of 840 — fifty per cent slower than designed — while all 1000
self-checks read the planned number and reported green. Found only by counting the real durations
out of `document.getAnimations()` in the browser, which is not something anyone does twice.
Seen: 2026-09-02
Fired:

### 2026-09-02 — a "still broken" report after a fix is not evidence the fix was wrong
**Status:** RETIRED (2026-09-16) — platitude — never fired in 14 days; the 2026-08-27 'inherited explanation is a hypothesis' entry covers the same checkpoint and IS firing
**Trigger:** the moment the user says a thing you just fixed is still broken — before re-reading,
loosening or reverting the fix you made.
**Lesson:** reproduce the failure from scratch first, as if there had been no fix. Two independent
causes behind one symptom is ordinary, and the cheapest way to lose a correct fix is to treat the
second report as a verdict on the first. Only after a fresh reproduction do you know which of the
two you are looking at.
**Would have prevented:** 2026-09-02, the tutorial book's close button. Reported broken, fixed (a
drifting tap armed a page drag and stole the click), reported broken again. The second cause was
entirely different: pressing close mid-flight measured the book through its own `scale(0.049)`, so
the departure computed to `translate(-53px) scale(1.005)` and went nowhere — and the guard flag was
already set, so every later press was a no-op. Several turns went into theorising about why the
first fix had "failed" before it was reproduced; it had not failed, and unpicking it would have
brought back the first bug while leaving the second.
Seen: 2026-09-02
Fired:

### 2026-09-02 — verify a field name against one real record before sweeping a data file
**Status:** RETIRED (2026-09-16) — platitude — 14 days without a fire; not KPM-shaped (7DTD configs), and the 2026-08-18 'scope a guard to the element' entry already forces the anchor-asserted read that would catch a wrong name
**Trigger:** about to grep, scan or audit a config/data format for a property, column or key
across many files — before reporting anything the sweep returns.
**Lesson:** open ONE known-good record and confirm the exact spelling and column position first.
A sweep for a name that does not exist returns a confident, well-formatted list of nothing, and a
sweep reading the wrong column returns a list of the wrong thing. Both look like findings. The
check costs one command; the alternative is presenting garbage as evidence and acting on it.
**Would have prevented:** 2026-09-02, three times in one session on 7 Days to Die configs.
`Magazine_size` does not exist (it is `MagazineSize`), so a "70+ guns are broken" list was pure
noise. `MagazineItemNames` does not exist (it is `Magazine_items`), so a magazine audit reported
all-clear against nothing. Worst: Project Z's Localization.csv is a 6-column layout
(`Key,Source,Context,Changes,English,Russian`), not the 20-column standard, so reading index 5
returned the Russian column — 48 entries were "translated into English" that were already English,
and the patch shipped, overriding correct text until the user noticed and said so.
Seen: 2026-09-02
Fired:

### 2026-09-03 — a perfect correlation is worthless when both candidates move together
**Status:** RETIRED (2026-09-16) — platitude: never fired in 14 days; the 2026-08-27 'inherited explanation is a hypothesis' entry already forces the re-test that separates two candidates that move together
**Trigger:** before naming a cause from N sessions/runs of on-off evidence — the moment you are
about to retire, disable or blame a component because the correlation looks clean.
**Lesson:** list every variable that moved with the suspect. If a second one tracks it, the
correlation cannot separate them — say so, and change ONE of them to split the pair before
concluding. State the count that would falsify you, then go and check it.
**Would have prevented:** the 7DTD `EModelBase.CrouchUpdate` crash. Four sessions ran
mod-ON/crash, mod-OFF/clean and the corpse mod was declared "confirmed as the cause" and
retired. The fifth session crashed 593 times with it disabled — the real suspect was a pack
whose stripped DLL left half-built entities, and both things put more broken zombies near the
player at once. Aldi lost two play sessions to a locked console, and the session before that
was spent on a gore-setting theory built on the same bad inference.
Seen: 2026-09-03
Fired:

### 2026-09-03 — removing a mod is a schema change to data already written
**Status:** RETIRED (2026-09-17) — platitude — never fired in 14 days; not KPM-shaped (7DTD save data), and the 2026-09-04 ModInfo entry covers the archive-shape check that IS firing
**Trigger:** before disabling, removing or reordering any mod, plugin or extension on a system
that has already saved data through it.
**Do:** ask what SHAPE that component wrote into storage - array sizes, container capacities, id
assignments - not just what features it adds. If it sized anything, removing it makes the existing
data unreadable, and most engines silently DISCARD what they cannot parse rather than failing loudly.
**Would have prevented:** disabling a 7 Days to Die mod that enlarged crafting queues, purely as a
UI test. The next chunk load threw `TileEntityWorkstation.read` index-out-of-bounds, the game
dropped the tile entity and saved the emptied chunk two minutes later. Aldi lost every melted
resource and every mod stored in his forge, permanently. An earlier removal in the same session had
already turned a placed block into a different mod's block by shifting block IDs - the same class of
mistake, and the first one should have been the warning.
Fired:

## Archived 2026-09-19 — retired 2026-09-18, both superseded by SKILL.md prose

### 2026-09-04 — a tool the note in front of you records as hanging is a settled result, not a stale data point
**Status:** RETIRED (2026-09-18) — never fired in 14 days; SKILL.md §2 "stop at the first source that answers" already covers it
**Trigger:** before reaching for a second verification surface after the first one fails — at the
moment the fallback is chosen.
**Lesson:** when the vault note you are ALREADY reading names a tool as having timed out, that is
the answer; take the path the note says worked. Re-probing to "check whether it is fixed now" is
only justified when something changed since the note, and a new session is not a change.
**Would have prevented:** `Looking at the App.md` was open in context and said `agent-browser`
"hung for 1801s and aborted". It was called anyway, hung for the full 1800s a second time, and
returned nothing — while the fix (read `document.getAnimations()` on the surface already open)
took one call.
Seen: 2026-09-04
Fired:

### 2026-09-04 — check whether this codebase already solved it before offering Aldi an A-or-B choice
**Status:** RETIRED (2026-09-18) — superseded by SKILL.md §4 "second layout of an existing component: list what the SOLVED width already decided"; structural, not prose
**Trigger:** at plan time, the moment a design question is about to be put to him as two options —
before the AskUserQuestion or the "two ways:" paragraph is written.
**Lesson:** grep the sibling implementations first. If one of them already answers the question,
there is no choice to offer: state what the pattern is and follow it. An option list is only
honest when the codebase genuinely has no precedent, and "which approach" questions are exactly
the kind whose answer is usually already checked in.
**Would have prevented:** the Regional Warehouse ponder was blocked on a question put to him as
"build fake tab bodies (drift risk) or mount the real panels (heavy)", complete with a
recommendation. Both were wrong. His reply: *"show the fake content but real panel like u do on
other tutorial of course, uve done this before bruh why dont u look at other tutorial that u
made"*. `GoodsReceivedStage` had been hand-built demo markup with 12 anchors the whole time, and
`StockByWarehouseTable` had 36 — one grep for `data-ponder` per stage would have settled it. The
question cost a round trip and ended the turn with nothing built.
Seen: 2026-09-04
Fired:

### 2026-09-05 — when the thing you are resizing has a stock value, read it before picking a number
**Status:** RETIRED (2026-09-19) — never fired in 14 days of real work (the resize it describes was a game mod, not KPM); a platitude here — "read the stock value first" cannot be made a check in this repo, so it retires as prose
**Trigger:** about to set a dimension, limit, timeout or capacity on something that ships with a
default — a modded game's UI grid, an overridden CSS variable, a tuned config. Before choosing the
number.
**Lesson:** find the stock value first and treat it as the proven envelope. It is the one number in
the system that is known to work, and it usually costs one grep. A number reasoned out from the
screen size, the spec, or the user's phrasing is a guess wearing arithmetic.
**Would have prevented:** 2026-09-05, the 7DTD vehicle-storage panel. Aldi said it overflowed; I
shipped 17x22@48px, then 18x20@48px, then 18x20@36px — three round trips, each sized off his screen
resolution and his own words ("vertical can be more"), and the first two both overran. Vanilla's own
grid is 11 rows x 67px = 737 pixels tall and is known to fit. That line was in
`Data/Config/XUi_InGame/windows.xml`, a file I had already opened and quoted in turn one to prove
the grid had no scrollbar. Two of the three passes were avoidable, on a session that ran the weekly
plan quota from 83% to 92%.
Seen: 2026-09-05
Fired:

### 2026-09-06 — one sentinel must not carry two meanings in a permission predicate
**Status:** RETIRED (2026-09-20) — never fired in 14 days of real work; the guarded form (`senderIsCompanyWide`) is already pinned by 3 selfcheck assertions, so the check exists and the prose retires
**Trigger:** before shipping any access predicate where a MISSING value is read as an ALLOW — the
moment `!x` or a default of `null` decides that somebody may do something.
**Lesson:** give the permissive case its own explicit flag. Absent data and deliberate authority
look identical through one variable, and the failure is silent and in the dangerous direction: the
emptiest record gets the widest reach, and no check fails.
**Would have prevented:** `handoffEligibility` was written with `senderRegion: null` meaning "acts
for the whole company". A field agent whose `location` was never filled in also arrives as null, so
every unplaced agent in the company could have handed a consignment store to anyone in any branch —
the exact hole the predicate was written to close. Caught on re-reading the code I had just written,
before any check existed that could have failed on it. Split into `senderIsCompanyWide` and trialled
red: the regressed form fails 3 assertions.
Seen: 2026-09-06
Fired:

<!-- archived 2026-09-22 — retired 2026-09-21, moved by the §0a bookkeeping -->

### 2026-09-07 — a Stop hook naming a file is not evidence you changed it
**Status:** RETIRED (2026-09-21) — never fired in 14 days of real work; the structural form would be the Stop hook comparing `git diff --stat` instead of mtime, which it does not do; retired as prose that read as insight the day it was written
**Trigger:** before answering a Stop hook that says "you changed X" — the moment it names a source
file this session never opened.
**Lesson:** compare `git diff --stat`, not the mtime. Git rewrites working files during ordinary
READ commands when `core.autocrlf` normalizes line endings, so `git status` or `git diff --stat`
can bump an mtime by itself and trip an mtime-comparing hook. Identical diffstat means nothing
changed, whatever the mtime says. Confirm that before writing the note, and before naming a cause.
**Would have prevented:** 2026-09-07. `src/ConsignmentFinanceView.jsx` read 07:21 at one stat and
06:05 at the next, with no edit between them. The near-miss was telling Aldi a parallel session
was live-editing his repo — false, and alarming about the one repo he cannot afford to doubt. The
diffstat was identical across both readings (45 / 83, 120 insertions, 8 deletions), which is what
actually settled it.
Seen: 2026-09-07
Fired:

### 2026-09-07 — a "sees too much" report is a question about the VIEWER before it is one about the feature
**Status:** RETIRED (2026-09-21) — never fired in 14 days of real work; no check can carry "read the screenshot's header first", so it retires as a platitude
**Trigger:** at plan time on any report that somebody sees data they should not — cross-region,
cross-branch, cross-tenant, "this account can see X" — before opening the feature's own scoping code.
**Lesson:** find the one thing on screen that reveals the VIEWER'S OWN ROLE and settle who they are
first. Headings, filter bars and menu items are usually rendered straight off the role flag, so a
screenshot already contains the answer. An escalated session reproduces every scoping bug at once,
so tracing the named feature will always find something plausible and it will be the wrong thing.
**Would have prevented:** Aldi reported a Tier 4 in MUNTILAN seeing a HEADQUARTERS hand-off. I read
`canApproveHandoffFrom`, `personApprovalRegions` and `translateLegacyRole` and built three
hypotheses about branch matching before noticing his screenshot's header said GLOBAL RECEIVABLES —
drawn by `isAdmin ? 'Global Receivables' : 'My Receivables'`. The account was a full admin. The real
bug was the vault grace keyed on the hijacked boss uid, in a different file, in a different feature,
and the header naming it had been on screen from the first message.
Seen: 2026-09-07
Fired:


## Archived 2026-09-23 — retired 2026-09-22, never fired in 14 days

### 2026-09-08 — a pass/fail tally is not a count of assertions
**Status:** RETIRED (2026-09-22) — never fired in 14 days of real work; the KPM guards already print one PASS/FAIL line per assertion, so the structural form exists and the prose is a platitude
**Trigger:** before comparing a check's before/after totals across a config change — the moment
"3 passed" is read as "3 assertions passed".
**Lesson:** compare the assertion LINES, not the summary number. A harness that appends its SKIP
notes into the same list it counts as passes will report an unchanged total while the set of things
actually asserted changed underneath it. Re-run with the PASS/FAIL/SKIP lines printed before
concluding anything from a delta.
**Would have prevented:** enabling the Dying Light pack moved `spawn-coverage-check.py` from
"3 passed, 0 FAILED" to "2 passed, 1 FAILED". The totals both say 3, so one assertion looked like it
had silently vanished, and a turn went on grepping for a third `ck()` call. The script has exactly
three, and the SKIP line for the disabled pack had been counted as a pass all along. The near-miss
was reporting a dropped assertion to Aldi as a side effect of the change.
Seen: 2026-09-08
Fired:

### 2026-09-08 — a pass criterion written before the change is not a check on the change
**Status:** RETIRED (2026-09-22) — never fired in 14 days of real work; no check can carry "add one open-ended exercise", so it retires as a platitude
**Trigger:** before reporting a fix as verified when the pass criterion is a list of strings chosen
in an EARLIER session — the moment the evidence is "grep found zero of the things we predicted".
**Lesson:** greps prove the predicted failure is absent, nothing more. When the change enables code
that can act outside the area it was reasoned about — a DLL, a Harmony patch, a hook, a middleware
— the criterion must include one open-ended exercise of the surrounding behaviour, and the report
must say the fix is unverified for everything the greps do not name. Say "clean for the two strings
we predicted", never "clean".
**Would have prevented:** enabling the Dying Light pack's runtime DLL. Step 3's criterion, written a
day earlier, was `ReflectionTypeLoadException` = 0 and `EModelBase.CrouchUpdate` = 0. Both were zero,
the whole log had zero exceptions, ten XML checks were green, and it was reported to Aldi as passing
with "Go meet one." The same DLL patches `GetHitTransform` and `LookAtUpdate`, and it had broken
looting on every unsearched container in the game — silently, with no log line. He found it by
playing, told me *"it is happen after your recent update"*, and was right. The next reply then spent
its length on a three-question interrogation and a wrong fourth suspect
(`480_Overengineered`, enabled during every previously working session) instead of on the change
that was four hours old and mine.
Seen: 2026-09-08
Fired:

### 2026-09-08 — when two setups differ, diff the ACTOR before the environment
**Status:** RETIRED (2026-09-22) — never fired in 14 days of real work; a 7DTD-shaped rule with no KPM trigger; retired as a platitude
**Trigger:** plan time, on any "works here, broken there" report — the moment a comparison target
is being chosen.
**Lesson:** list every variable that could differ, not just the one the report names. A
setup/config/environment diff answers "is the environment the same"; it cannot see the player,
account, or user record acting inside it. Find the cheapest file that states the actor's identity
and scale, and read it first. Rank a candidate cause by whether a MECHANISM connects it to the
symptom — a field that differs but has no path to the symptom is noise however clean the diff is.
**Would have prevented:** the 7DTD negative-loot-timer hunt. All of 2026-09-08 went to diffing the
mod list; five mod-level causes were named and all five were wrong. The next brief then narrowed
the diff to per-world sandbox settings. That diff came back clean on the actual cause — LootTimer
was at default in all four worlds — and the one field that did differ, JumpStrength, has no path
to loot time and would have been reported as the answer. The real variable was in a 151-byte
`.ttp.meta`: the broken world's character is level 143, the working world's is level 2, and the
`ScavengingTime` `perc_add` stack sums with no floor.
Seen: 2026-09-08
Fired:

### 2026-09-09 — when a root cause is found, restore what the disproved hypothesis removed
**Status:** RETIRED (2026-09-23) — never fired in 14 days of real work; no KPM checkpoint reached it, retired as a platitude
**Trigger:** before the completion claim on any bug hunt that ends with a root cause found somewhere OTHER than the first suspect.
**Lesson:** list every file, mod, flag or feature that was disabled or stripped WHILE chasing the suspect, and put each one back in the same session that clears it. Closing a bug is not the end of the job; the suspects were removed on a hypothesis, and the hypothesis just died. Name them explicitly in the closing note — "cleared of X" is not the same as "restored".
**Would have prevented:** the Dying Light runtime DLL. It was stripped 2026-09-08 09:15 as the leading suspect for a negative loot timer. The real cause was found the same day at 14:35 (`ScavengingTime` `perc_add` stacking past -100%) and fixed, and the notes even recorded "Dying Light removal changed nothing — it never touched `ScavengingTime`". The DLL was never put back. It is the only code that builds hitboxes for the pack's imported rigs, so Aldi met a Demolisher twice that could hit him while he could not hit it, and three sessions of notes carried "colliders have no XML lever, nothing can be done" as a standing conclusion. The evidence needed to reopen it was already inside the file that said it was closed.
Seen: 2026-09-09
Fired:
LESSONEOF

### 2026-09-09 — a method name says what code CAN do; its log line says what it DID
**Status:** RETIRED (2026-09-23) — never fired in 14 days of real work; no KPM checkpoint reached it, retired as a platitude
**Trigger:** about to act on a conclusion drawn from decompiled metadata — type names, method names, a strings dump — for a component that writes its own log lines. Fires the moment you write "this patch probably does X" from a symbol you have never seen execute.
**Lesson:** grep the log for what that component actually printed BEFORE building anything on the name. A method name is a capability; a log line is an event. `get_IsRagdollActive` existing next to a cleanup patch proves the code can read ragdoll state — it proves nothing about whether the cleanup branches on it. If the component logs per-instance, the answer is already sitting in a file you can read for free, in a log that was written before the bug was even reported. Names first is only allowed when nothing was ever logged. Related but not the same as [[when the symptom is on a screen you cannot see, buy one observation before building]] — there the observation had to be bought from Aldi; here it was already on disk and simply not read.
**Would have prevented:** 2026-09-09, the Dying Light corpse. From `PackImmediateDeathCleanupPatch` + `HideDeadEntity` + `get_IsRagdollActive` in a strings dump I inferred "the cleanup spares a corpse that is ragdolling", built `Mods/242_DyingLight_DeathBody` on it — 16 xpath patches over eight entity classes, a ModInfo, a 28-line comment block defending the reasoning — and told Aldi to restart the game and go kill zombies to test it. It was wrong: the cleanup is unconditional. One grep of the PREVIOUS day's log for `Dead model removed` would have shown the DLL announcing the deletion per entity and killed the idea before a file was written. Cost: a mod built and reverted, one game restart and one play session of his, and a "[likely]" claim shipped to him that had a free disproof available the whole time.
Seen: 2026-09-09
Fired:
LEOF
python -c "
import re,io
p='lessons.md'; t=open(p,encoding='utf-8').read()
t2=re.sub(r'Last checked: .*', 'Last checked: 2026-09-09 - lesson appended (136-turn session)', t, count=1)
open(p,'w',encoding='utf-8').write(t2)
" && grep -n "Last checked:" lessons.md && echo "entries now: $(grep -c '^### ' lessons.md)"

### 2026-09-09 — when you disable a lookup, its fallback becomes new load-bearing code
**Status:** RETIRED (2026-09-23) — never fired in 14 days of real work; no KPM checkpoint reached it, retired as a platitude
**Trigger:** before finishing any change that makes an existing lookup return null, skip, or stand
down under a condition — a preview mode, a feature flag, an offline branch, a permission guard.
**Lesson:** the `||` on the other side is now the ONLY path for that condition, and it has never
run in production. Read it as if it were code you just wrote: does every value it depends on
actually arrive? Then exercise the DISABLED condition, not the one you were protecting.
**Would have prevented:** `FleetCanvasManager`'s POV email-lookup stand-down fell back to
`find(m => m.id === agentProfileId)`, and App.jsx never passed `agentProfileId` to that tag — five
other screens got it, so a file-wide grep said yes. Under POV the whole expression was
`null || find(m => m.id === undefined)`: nothing, on every tier, with seven people in the roster.
Aldi reported it as a Fleet & Roster bug on 2026-09-09; the first diagnosis found a REAL but
different defect (a `bossUid`-less tenant id), shipped it, and had to hand him a four-way
"which message do you see" probe to discover the actual cause. Two commits and a round-trip to
him for a missing prop.
Seen: 2026-09-09"""
tail -18 "$L" | head -4
Fired:


<!-- archived 2026-09-26 by alucard bookkeeping -->
### 2026-09-10 — a number written to be refused still has to survive being checked
**Status:** RETIRED (2026-09-24) — never fired in 14 days; superseded by the 2026-09-11 entry "check a new number against the numbers already in the same document"
**Trigger:** before writing any DERIVED figure — a price, an estimate, an anchor — into a note as a
settled number, especially one whose stated purpose is to be rejected.
**Lesson:** re-run the arithmetic, and check the figure against the other numbers in the same
document. A derived price has a ceiling set by its own alternatives; pricing through that ceiling
inverts what the number does. "Priced to refuse" is not a licence to skip the check — the reader
does the comparison you skipped, and a figure that fails it does the opposite of its job.
**Would have prevented:** Rp 5 miliar for KPM's copyright, written into the vault and then into
`Wiki/Entities/KPM Price Sheet.md` marked CANONICAL, and repeated in two replies. It carried a plain
multiplication error (10 × Rp 15 juta × 12 read as Rp 900 juta/year, not Rp 1,8 miliar), a rate
superseded the same day, and — the fault that mattered — it sat 3,5× above the Rp 1,4 miliar rebuild
cost quoted three sections above it in the same file. A copyright priced above a clean rebuild tells
the buyer to hire a developer instead. Aldi caught it: *"is 5 milliar reasonable that amount is
crazy work"*.
Seen: 2026-09-10
Fired:

### 2026-09-10 — when he answers a numbered list by number, read the number first
**Status:** RETIRED (2026-09-24) — never fired in 14 days of real work; no check can see a reply, retired as a platitude
**Trigger:** any reply from Aldi that opens with a bare numeral and a verb — "1 done", "2 skip",
"3 later" — especially when the same message carries screenshots or a long body.
**Lesson:** resolve the numeral against the list you sent BEFORE opening the attachments. The
attachments are the interesting part, so they pull attention first, and the one-word answer to the
thing you actually asked gets read past. An item he has already completed then stays on every
subsequent list, which reads to him as not being listened to.
**Would have prevented:** *"1 done, sc1 = dashboard, sc2 merchant salesview, sc3 stock opname"* —
the "1 done" was read past, and "press Rebuild sales totals" was put back on his list repeatedly,
ending with *"asked at least four times now"* written into the handoff file about him. He had to
correct it explicitly: *"i said 1 is done which is rebuild sales total i already press that
yesterday and todaty"*. Cost a correction turn plus commit 94c659f to fix two note files, at 94%
weekly quota.
Seen: 2026-09-10
Fired:

### 2026-09-11 — check a new number against the numbers already in the same document
**Status:** RETIRED (2026-09-26) — never fired in 14+ days of real work; no check can read a price inside a note, retired as a platitude
**Trigger:** before committing or publishing any note, sheet or artifact that will hold MORE THAN ONE
related figure — the moment a new price, cost, estimate or total is added beside existing ones.
**Lesson:** verify the new figure against the page it is landing on, not only against the outside
world. Ask which existing number on this page is a floor or a ceiling for the new one, and say so in
one clause. A document that contradicts itself is worse than one that is merely wrong, because the
reader finds the contradiction and then distrusts every number on it — including the correct ones.
**Would have prevented:** the Rp 5 miliar copyright figure. It was checked against the outside world
(a projection of lost customers) and never against `KPM Product Inventory`'s own replacement-cost
anchor of Rp 1,4 miliar, which sat two files away and later on the SAME price sheet. A copyright
price 3,5× the cost of rebuilding the thing from scratch is not a refusal, it is an instruction to go
hire a developer. It also carried an arithmetic slip in its supporting line — ten factories at
Rp 15 juta a month is Rp 1,8 miliar a year, not the Rp 900 juta written — and a rate superseded
earlier the same day. All three shipped into a committed vault note AND a published Artifact, and
**Aldi caught it, not me**: *"is 5 milliar reasonable that amount is crazy work"*.
Seen: 2026-09-11
Fired:

<!-- archived 2026-09-28 from lessons.md; RETIRED 2026-09-27 as a platitude (the toast < dialog audit guard covers its one case) -->
### 2026-09-13 — a z-index move crosses every layer between the old number and the new one
**Status:** RETIRED (2026-09-27) — never fired in 14+ days of real work; retired as a platitude (a z-index move is rare here and the toast < dialog audit guard already covers the one case it was about)
**Trigger:** before changing any z-index or stacking value — the moment a brief, a plan or a
comment says "move X to N", and again before writing such a line into a brief for the next session.
**Lesson:** grep every `z-[` and `z-index` in `src` first and list what sits at every value the
layer will pass through. For each one ask: does it raise a report or a question while it is on
screen? Then prefer LIFTING the thing that must be on top over pushing a shared layer (the toast
column, the mascot) down through its neighbours — a shared layer has callers you did not list.
`ExamineModal.jsx:72` already records the same instinct.
**Would have prevented:** the 2026-09-12 brief named `Toast.jsx → z-[9998]` as "the safe half,
the whole job". At 9998 the strip sits under the vault password gate, which raises five
`notify()` reports while it is up — "wrong reset word" painted behind an opaque screen, and the
guard (`toast < dialog`) green either way. Caught on 2026-09-13 before the edit: one re-plan, one
question that bounced on wording, two turns. The version that ships is five silent reports.
Seen: 2026-09-13
Fired:
