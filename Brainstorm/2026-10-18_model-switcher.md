---
title: Model switcher - change the AI model by job difficulty
created: 2026-10-18
status: DROPPED by him ("if its cost more then forget it"); B can be reopened only by him
tags: [kpm, cost, models, mods, brainstorm]
---

# Model switcher - change the AI model by job difficulty

## The problem, in his words

2026-10-18 14:56: *"btw i want u to use mods the new claude features that can make token cheaper by changing ai model according on the job difficulty"*

## What a mod can do (checked in the mod API types, plugin-authoring skill, Claude Code build 2.1.299)

- `turn.step` hook: fires before every model request, main loop included; `next({ ...e, model })` sends that request on another model.
- `$.model.complete({ model: "haiku", prompt })`: a cheap side call, usable as a difficulty grader.
- `agent.spawn` hook: sets a subagent's model.
- `$.session.model()`: reads the main loop's current model.
- The cache catch is in the same types file: a fork's `cache_read_input_tokens` near zero means it "paid for the whole prefix (the entry lapsed, or the model changed since)". The prompt cache belongs to one model.

## The options

| | what it does | cost |
|---|---|---|
| A | no mod; each NEXT-SESSION job names the model to start on, he picks it in the model menu | nothing to build; he has to remember |
| B (my pick) | a mod grades his FIRST message after start or /clear with one Haiku call and keeps that model all session | one mod + test; never pays the cache twice because it only switches while the chat is small |
| C (his idea as stated) | a mod switches model on every message | each switch re-reads the whole chat at full price on the new model; switching back to Opus pays it again - on his long sessions it can cost more than it saves |

Second trap for B and C: on the PC, haiku/sonnet died through 9router on 2026-08-18 (`cc/`-prefixed route); five Sonnet agents ran in the cloud on 2026-10-18. Any build starts with one Haiku probe and one Sonnet probe on the PC.

## Decision

2026-10-18 ~15:05, his words: *"if its cost more then forget it"* - DROPPED. Told him in the same reply that A and B do not cost more (B switches only at the start); reopening is his call, by saying "B".

## Rejected on purpose

- C, switching on every message - the cache re-read on every switch. Do not re-propose it unless his sessions become short (under ~20k tokens), where the re-read is cheap.
- Running a workflow to research this - his rule *"well it should not use workflow until i said yes"*; ultracode was on and was skipped.

Models applied: Second-Order Thinking (the cache re-read after a switch), Pre-mortem (a dead 9router tier failing a turn mid-job).
