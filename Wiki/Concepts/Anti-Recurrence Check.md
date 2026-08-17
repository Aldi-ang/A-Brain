---
title: Anti-Recurrence Check
description: The rule born from 3 "it's committed" lies — never claim a save happened without checking git yourself.
type: concept
created: 2026-07-27
updated: 2026-08-15
confidence: high
checked: 2026-08-15
tags: [pattern, discipline, git]
---

# Anti-Recurrence Check

The standing discipline this project adopted after the same failure happened **three
separate times**: a commit's message claimed to include a fix, but the commit's *actual*
diff didn't contain it — usually because the real work was still sitting uncommitted in a
[[Git Worktrees|git worktree]] that never got merged.

## The rule

Never report a file as "committed" or work as "saved" unless, in that same turn:
1. `git add`/`git commit` was actually run, and
2. `git show --stat HEAD` was checked to confirm the expected file is really in the diff.

This applies every time a task creates or edits a file meant to persist — proactively, not
just when someone is specifically asked to investigate whether something landed.

## Why it's called "anti-recurrence"

Each of the [[Git Worktrees|three incidents]] this rule comes from was independently
discovered — meaning the pattern wasn't caught by the rule the first two times, only by the
project owner manually checking GitHub later. The rule exists specifically to stop a
fourth occurrence, not just to explain the first three after the fact.

## The same shape in the checks themselves: a check that its own explanation can break (2026-08-16)

`integration.audit.mjs` greps the CSS as **text**, and it hit this trap twice in two days from
opposite directions:

1. **Group 45** — a regex matched the PROSE in a comment. The comment said *"never an
   `animation:`"* to explain a decision, and the check read that as the code doing it.
2. **Group 46** — `the theme switch turns white and black` scans `[\s\S]{0,300}?` from the selector
   to a colour. Adding a four-line comment INSIDE that rule pushed the colour past 300 characters
   and the check went red **with nothing wrong in the CSS at all**.

The second is the dangerous one. A check that a comment can break quietly teaches the next person
to **delete the comment** — the check starts eating the explanations that make the codebase
readable, and it looks like a passing build the whole time.

**The rule:** any check that greps source must run on comment-stripped text, and any check that
measures DISTANCE inside a rule must, without exception. `noCmt` is defined once beside the file it
strips, at the top of the audit, so a new check does not have to rediscover this.

⚠️ Note the failure mode it shares with the commit lies above: **the check reported on the
explanation rather than on the thing**, exactly as a commit message reported on the intent rather
than on the diff.

## Related concept: verify before claiming, generally

This project treats "I did X" and "X actually happened, verified" as two different claims
that must not be conflated — the same spirit shows up in
[[Draft-Then-Deploy Discipline|never assuming a rules draft is deployed]] and in this wiki's
own rule (see `CLAUDE.md`) to never answer "is this live right now" from Wiki content alone.

## A second shape of the same mistake: local checks that don't match real conditions

Not just "did the commit happen" — the same failure shape shows up whenever a check is
narrower than what actually gets exercised for real. 2026-07-28: `react-is` got removed as
"unused" because nothing in `src/` imports it directly — but `recharts` (a dependency being
kept) imports it internally, and the removal broke the real Vercel production build. The
local check (`grep src/`) looked sufficient; it wasn't. See
[[Dead Weight Cleanup and Rules-Deploy Gap]]'s 2026-07-28 update for the full incident —
fixed by actually running a production build before trusting the cleanup, not just the
narrower check.

## A third shape: rebuilding the second layout instead of PORTING the solved one (2026-08-14)

**His complaint, and it is about workflow, not about the app:** *"u should know all this logic and
take notes of it when we doing the phone sidebar yesterday, looks like there is flaw in the
workflow of alucard that make them forgot what he did on the phone sidebar yesterday, because of
that i need to tell u twice, yesterday and today"*.

**The honest diagnosis is not amnesia — the notes existed and were found.** The failure was
building the desk navigation from a blank page instead of starting from the phone's already
signed-off answers. Four things he had decided during one night's work on 9–10 August had to be
asked for again on 2026-08-14: **two columns** (his words then: *"instead of 1 line of sidebar i
want it to be 2 colomn per row"*), **a label under the pointer** rather than nothing, **the music
player's pill shape**, and **the agent's own profile picture**. Every one was already solved,
tested, and sitting in the same file behind a different breakpoint.

**The rule: a component with two layouts has ONE set of decisions.** Before writing the second
layout, list what the solved one already answers — density, labels, spacing, states, what hides,
what expands — and port each answer, or say in one clause why this width genuinely differs. Never
open a blank page for a width whose sibling is finished. Cheapest way to run it: read the solved
layout's classes **and the audit checks that pin them** before the first edit, not after his
screenshot arrives.

**Cost when skipped:** a full re-specification round, plus a defect the solved width had never hit
— the desk strip was built at 88px, which clipped the logout button's 118px hover expansion, a
collision 176px on the phone could not produce.

Same lesson from the answering side — *name the width before saying a screen was done* — is in
[[The KPM Control System]] under **two layouts in one file**.

## A fourth shape: the check greps the source instead of measuring the result (2026-08-14)

The narrowest version of the same mistake, and it recurred three times in one day in `theme.css`:
an audit check that greps for a class or a value **proves it was typed, not that it applies**. A
`144px` check passed for a whole day over a value the browser never used, because a Tailwind class
on the same element carried the phone's `176px`. Full pattern and the other two occurrences:
[[The Rule That Never Applied]]. The fix is the same shape as `git show --stat` — read the real
result (`getComputedStyle`, `getBoundingClientRect`), not the source that was supposed to produce it.

## A fifth shape: measuring numbers instead of LOOKING at the page (2026-08-14)

Three defects in one afternoon, all in a prototype built for Aldi to judge by eye, and none of
them caught by measurement:

1. **An `<svg>` with a `viewBox` and no `width`/`height` paints at its intrinsic fallback size** —
   several hundred pixels. It covered the entire dock. Every geometry check passed, because none
   of them asked "is anything absurdly large?".
2. **`pointer-events: none` inherited onto the buttons**, so nothing was hoverable at all.
3. **A label clipped by a preview frame** narrower than the label.

His report: *"u dont even fix the problem ... its broken bro recheck again of what u doing"*. He
was right three times.

**The rule: when the deliverable is judged by eye, a measurement is not a verification.** If a
screenshot is impossible — and it was, the Browser pane was not displayed, so the page never
composited — then replace looking with a **sweep over every element**, not a check of the handful
of numbers you expected to matter:

- any element far larger than its container (catches the unsized-`<svg>` class of bug),
- anything painting outside the box that is supposed to contain it,
- anything that should be interactive but computes `pointer-events: none`,
- anything that should be visible but computes zero size or zero opacity.

**And the sub-rule that recurred three separate times in one day:** any check that forces a
hover/animated state must also force `transition: none`. Without it every reading is taken
mid-animation and reports the *start* value — which produced two confident wrong diagnoses,
including one where I told him a real bug was fixed when my own check was simply reading too
early. See [[The Rule That Never Applied]] for the same lesson in its CSS-cascade form.

> 🔁 **RECURRED 2026-08-16, with this page already written.** A new browser harness read
> `.kpm-btn`'s colour immediately after flipping the theme class; the button has a 120ms colour
> transition, so it returned the *previous* theme's value in both themes — and I was one step from
> reporting "the Command Center buttons don't flip in dark" as a shipping bug. **The sub-rule
> above is exactly this, and it did not fire because it lived on a page nobody re-read at the
> moment of writing a new check.** Two additional lies from the same harness are recorded in
> [[Looking at the App]]: it loaded the wrong stylesheet and reported an unstyled page as passing,
> and it invented a class name and measured the invention. **Any new measuring tool is itself
> unverified until one reading from it is confirmed against something independent.**

## A sixth shape: a regex anchor that matches the wrong occurrence (recurred 4x in one week, 2026-08-15)

Not a coding mistake in the app — a mistake in the **check itself**. An audit check's regex
anchored on a fragment that repeats in the file (`@media (min-width: 1024px) {`, occurring several
times in `theme.css`) and a plain text search returns the *first* match, not the relevant one — the
check's gate landed 28,000 characters early and validated the wrong block entirely. This is the
fourth time in one week the same shape recurred: an anchor that is short or common enough to match
more than once, silently validating the wrong span.

**The rule: before trusting a regex/text-search anchor in a check, count how many times it matches
the file — not just whether it matches at all.** Anchor on something unique (a specific value, a
full selector string), never on a fragment likely to repeat. See [[The Rule That Never Applied]]'s
fourth occurrence for the incident this was pulled from. **This lesson was also written into
`kpm-inventory-facts.md`** (the skill reference), since it is about how audit checks are written in
this project, not a one-off bug — see the ingest run note for 2026-08-15.

## A seventh shape: the check freezes a value the measurement later moves (3x in one day, 2026-08-16)

Three audit checks failed in a single session for one cause: each **pinned a hex literal**, so
correcting a colour broke the check whose whole job was to protect that colour.

- group 32 pinned `--accent-ink: #6B4A05` — the day that value was measured in a browser for the
  first time it turned out to be 3,73:1 and had to move;
- group 25 pinned the ground glow's `rgba(255, 157, 0, .13)` — which was the same statement as
  "there is a lit corner" only while the corner was a literal, and a literal was the bug;
- group 25 pinned the scrollbar's three browns — replaced by tokens for exactly the reason the
  check existed.

**The audit file already contained this lesson in its own words**, written into group 39 weeks
earlier: *"NO HEX IS NAMED HERE ON PURPOSE … freezing a value a measurement later moved just turns
the check into a second thing to fix."* It was not applied to the three checks written after it.

**The rule: a check asserts a RELATIONSHIP, not a number.** "The light ink is darker than the dark
ink." "This token is declared twice with different values." "This gradient names the token." The
numbers belong to the thing that *measures* — here `contrast.selfcheck.mjs` — because a measuring
script re-derives on every run and a frozen literal cannot.

⚠️ **Corollary, and the tell that you are about to do it again:** if fixing a bug requires editing a
check in the same commit, ask whether the check was asserting the fix or asserting a snapshot.

**And a seventh occurrence of the oldest shape on this page** landed the same night: a check that
hunts slate hex codes found four of them inside the code comment explaining that those four had
been removed. *Describe a removed colour; never quote it.*

## Related

- [[Looking at the App]] — the harness that produced shapes 5-recurred and 7, and its own guards
- [[The Rule That Never Applied]] — the CSS-shaped instance of this discipline
- [[The KPM Control System]] — the two-layouts rule and the shell's current state
- [[Git Worktrees]] — the three incidents this rule was built from
- [[Draft-Then-Deploy Discipline]] — the same "verify, don't assume" spirit applied to rules
  deployment
- Summary: [[Lost Work in Worktrees — Three Incidents]]
- Summary: [[Dead Weight Cleanup and Rules-Deploy Gap]] — the dependency-removal instance of
  this same pattern

## An eighth shape: the probe's own escaping lied (4x in one investigation, 2026-08-16)

Not the check, not the code — the **throwaway command used to look**. Chasing a CSS question
through `node -e "..."` inside a bash double-quoted string means backslashes are eaten twice, and
every one of these reported a confident, specific, wrong answer:

1. a regex that threw `Unmatched ')'` — the honest failure, and the only one that announced itself;
2. `bg-[var(--x)] utilities emitted: 0` — the escaping was wrong, they existed;
3. `ABSENT` for a control string that was demonstrably present two commands earlier;
4. `3 missing` for a fix that was complete, because the selector search escaped a `%` wrongly.

Reading 3 is the dangerous one: it agreed with the hypothesis under test, so it would have been
believed if the control had not been in the same output.

**The rules:**
- **Always include a control** whose answer is already known. A probe that cannot fail is not a
  measurement, and a probe with no control cannot tell "absent" from "my escaping is broken".
- **Write the probe to a file** when it contains regexes or escapes. A scratchpad `.mjs` has one
  level of escaping; `node -e` inside a shell string has three.
- **Prefer the unescaped side of the data.** CSS *declarations* keep real spaces and no
  backslashes; CSS *selectors* are escaped. Query the side that needs no guessing.

See [[Looking at the App]] for the bug this was found chasing.

## A ninth shape: a dead verifier scored as a successful refutation (2026-08-17, second occurrence)

A review workflow fanned out 7 readers over the unreviewed KPM files, each followed by a skeptic
told to refute its findings. The run returned `confirmed: []` and `refutedCount: 14` — which reads
as *"we checked 14 claims and killed all of them"*.

**Nothing was checked.** 7 of the 8 agents died on `You've hit your session limit`, including the
only refuter that had work to do. The classifier was:

```js
if (v && v.refuted === false) confirmed.push(row)
else refuted.push(row)          // <- a missing verdict lands here
```

So an agent that never ran produced the same output as an agent that examined the claim and
rejected it. The tell was in the payload and easy to miss: every entry in `refutedTitles` ended
with the fallback string *"no verdict returned"*.

**This is the second occurrence.** Commit `07f0672`, five days earlier, is titled *"EOD review
findings are UNVERIFIED - quota killed the verify phase"*. Same cause, same silent direction of
failure.

**The rule: absence of a verdict is its own state, never a verdict.** Any classifier that sorts
results into pass/fail needs a third bucket for *did not run*, and the missing case must land
there by construction, not by an `else`. Written into the script as three lists — `confirmed`,
`refuted`, `unverified` — with the unverified count logged as a warning.

⚠️ **The general shape, which is the whole point of this page:** the failure defaulted toward the
*reassuring* answer. "14 refuted" sounds like rigour; "14 unchecked" sounds like a problem. When
a default has to be picked for a missing measurement, pick the one that looks worse — a wrong
alarm costs a re-check, a wrong all-clear costs the thing the check existed to catch. Same
direction of error as a commit message that claims a fix the diff does not contain.

**Cheap structural fix, reusable:** long fan-out runs should be resumable. This one was
(`Workflow({scriptPath, resumeFromRunId})`), so the single agent that DID complete replayed from
cache for free and only the dead ones re-ran. A review that has to start over after a quota reset
usually just does not get finished.
