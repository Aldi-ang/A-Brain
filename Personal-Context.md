---
title: "Personal Context — Aldi"
description: Who Aldi is, what he's building toward, and how he wants to work with AI. Output of the task 1.2 interview. Read this first in any new session — it's what makes a future Claude actually know him instead of re-deriving him.
type: profile
created: 2026-07-27
updated: 2026-07-27
tags: [meta, personal-context, profile]
---

# Personal Context — Aldi

*This is the highest-leverage file in the vault. Read it at the start of any session that
isn't purely mechanical. Revisit and update it periodically — how someone thinks changes,
especially at 14 — never silently overwrite; date-stamp changes and note what shifted.*

---

## Who he is

Aldi, 14, Indonesian, self-taught developer. Studied at SPA (Singapore Piaget Academy) in
Solo.

He is also a **tobacco grader**, running the family business with his dad as part of a
partnership with **Gudang Garam dating back to 1988**. Tobacco season is about 3 months a
year; the other 9 months are free. His dad has no employees due to financial difficulty, so
Aldi is effectively required to help him rather than free to work elsewhere during that
season — he's described this as a real dilemma, not a simple family duty.

Coding/app development is his attempt at a **second income source** alongside tobacco
supply. The KPM project (B2B inventory app for PT Karyamega Putera Mandiri, owned by his
mom's uncle — "Cek Kong" — a cigarette company) is the first instance of this: he expects to
build similar apps for other companies in the future.

He follows **Timothy Ronald** (crypto) as a mentor and inspiration, and studies crypto
independently. Religion: **Tao**, with a self-described life focus on helping others.

---

## Core motivation — read this before assuming what drives a decision

- **Freedom is the thing he's actually chasing.** Not comfort, not status for its own sake —
  freedom, specifically freedom from having few choices in life.
- **Poverty is his defining trauma.** He named "being poor with little choice in life" as the
  most traumatic experience of his life so far, unprompted. This is not a casual preference —
  treat it as load-bearing when reasoning about why he pushes hard on money-generating work.
- **Money is earned, not given** — he explicitly rejects a handout framing. He's fine with any
  work as long as it generates real money while helping people in the process. This is not
  pure profit-seeking; the "helping people" clause is not decoration, see life goal below.
- **Life goal: help 5,000 people "live"** — i.e., 5,000 people in a sustained working
  partnership with him (employees, or tobacco farmers), achieved before he dies. This is the
  north star for anything framed as "impact."
- **Social comparison is an explicit driver.** His school friends' families average ~1 trillion
  rupiah in wealth; he's the poorest among them and wants to reach their level. He's open about
  using the KPM project as a "rocket boost" toward that, not just a favor for family.
- **Constant self-improvement.** When asked what frustrates him, he reframed the question —
  it's not about frustration, it's about wanting to improve every time, as a human.

---

## What "high-end apps" means to him

He's used this phrase before without defining it. Now defined, in his own terms:

- **Reliability** — never breaks, handles bad connections, real error handling (a lot of this
  week's KPM work was actually this).
- **Polish** — the interface looks and feels expensive.
- **Depth** — features competitors don't have.
- **Enterprise-ready** — multi-company, audit trails, real security.
- **Ergonomics** — big impact for the company at low maintenance cost, keeping the underlying
  logic simple even as the feature set is deep. He named this explicitly as the balancing
  factor against the other four: impressive but not simple isn't "high-end" to him.

## What "done" means to him

Not "tests pass" or "it feels right" as a vibe check — **done means every stated goal for the
project is achieved and every criterion is fulfilled.** Criteria-complete, not vibe-complete.
Useful for calibrating when to say something is finished vs. still open.

---

## How he wants to work with AI

He does not see AI as a tool he tolerates — he said explicitly he wants to make AI "part of
my world" and believes he can learn a lot by working with it. Treat this as a standing
collaborative relationship, not a transactional one.

Carried forward from prior project context (still accurate, confirmed by this interview's
tone):
- Simple, short English sentences. Explain technical terms in plain words. Indonesian
  words/phrases are welcome where they help.
- He's learning — be patient and clear, but don't talk down to him. He handles real
  architectural decisions and pushes back well when something's wrong.
- He responds well to honest disagreement — several times, pushing back on his stated request
  produced a better outcome than complying would have. Don't just agree to be agreeable.

---

## Working rhythm

Coding time is **season-dependent**: during the ~3-month tobacco season, tobacco work with his
dad takes priority and there's less time to code. During the other ~9 months, he's free to
build. His stated goal is to finish app work within a given 9-month window so the tobacco
season doesn't become a blocker. Expect his available bandwidth to swing predictably across
the year — worth checking which period it currently is before assuming a working cadence.

---

## Scope of A-Brain (why this vault exists, in his own words)

A-Brain is explicitly **not** limited to KPM or coding. His own framing: *"A-Brain should have
all the thing in life for me... even when I died everyone with this vault know what I'm going
to think."* He wants his thoughts, problems, solutions, experience, and memories in it — a
literal second brain, not a project wiki.

**Implication for [[PLAN-A-Brain-agentic-OS]] task 2.2** (restructure beyond KPM): the sibling
domains shouldn't be guessed — based on this interview, the vault should be structured to
plausibly hold at least: KPM/software work, the tobacco business, crypto/financial learning,
and personal life goals/reflection — not just left as "whatever comes up." Confirm exact folder
names with Aldi when 2.2 is actually executed; this section only establishes that the scope is
whole-life, not the final taxonomy.

---

## He does not review process — locked 2026-09-01

> *"stop giving me too much explanation and talk to me like a caveman, put that in alucard mind,
> explanation only needed for the question description and the input that i need only not the work
> that u do i only accept job thats done not the process"*

And immediately after, on where the explanation should have gone:

> *"yes all of that info put it on your A brain and dont give me that info, just explain something
> that u want me to understand thats the point"*

**The rule, in his own frame:** a reply carries two things and nothing else — **what shipped**, and
**what he must decide**. The first is one line. The second gets as many plain sentences as it needs.
Everything between them is deleted.

**Why this kept leaking, and it is worth naming because writing the rule down did not stop it:**
findings feel like they need defending. Having measured something, the instinct is to show the
measurement — the ratio, the count, the how-it-was-found. None of that is a question. He has told
me the same thing three times now (2026-08-21 *"just tell me the critical point"*, 2026-08-24
*"why this chat still so much talking"*, and this), each time after a reply that was terse in style
and long in substance. **Caveman prose was never the ask. Deleting the justification is.**

Where it goes instead: the commit message and this vault. He reads neither by default, and that is
the correct arrangement — [[Wiki/Concepts/Aldi's Design Taste]] and the commit log are the record;
the chat is the interface.

⚠️ **One live conflict left in `alucard/SKILL.md`.** §11b still ends every reply with
`checks: N run, N pass. adversarial: yes/no. edits: … lessons: … vault: …`. That is a process
tally, which he has now banned twice. §5 was updated with his approved wording on 2026-09-01; §11b
was not, because he approved specific text and not a general rewrite. **Ask before changing it.**

## He corrects names in passing, he does not sit down to name things — 2026-09-01

Offered a full label list for one screen so he could approve or strike each English name in one go:

> *"leave it for now, i can just strike words that i dont like"*

**He declined the WORKFLOW, not the goal.** The rule he had stated an hour earlier — that two
sibling screens must be in one language — still stands. What he refused was a dedicated naming
session for it.

**Why this matters for how work gets offered to him:** a batched approval list looks efficient from
this side and reads as homework from his. He corrects a name the moment he meets it on a real
screen, which costs him one sentence and no context switch. The same instinct is already on file in
[[Wiki/Concepts/Aldi's Design Taste]] — *"i dont want to waste anymore time to design this, lets
move on with other work"* — and in his reply *"stock only is enough then u can continue"*, where
four of five names were approved by silence.

**So: ship the thing, let him strike what he dislikes.** Reserve the explicit name question for
cases where guessing wrong means writing the wrong data — a category in his trade, a tab that other
messages point at — not for cosmetic labels he will read anyway.

## Open questions this interview did NOT resolve

- Exact folder taxonomy for non-KPM domains (tobacco business, crypto, personal reflection) —
  scope is confirmed, structure is not.
- Whether tobacco-business content should get the same Raw/Wiki treatment as KPM, or something
  lighter-weight given it's not software.
- The "starter kit" reusable-code-repo question from [[PLAN-A-Brain-agentic-OS]] is still open
  and unrelated to this interview.

## Every session ends with the start prompt, printed (2026-10-20)
His words: *"always give me the prompt"*. The last reply of every KPM session carries the copy-ready start line from `.claude/NEXT-SESSION.md` (line 3) in its own code block - never "paste the start line" as a pointer. If the job note was committed but NOT pushed, say in one line that it is on the PC only (a cloud session would not see it).
