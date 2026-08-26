# Skill repos evaluated — 2026-08-25

Aldi sent 19 links at once: *"add all the new skills for alucard from here"*. All 19 were
checked (licence, size, what installs, what it overlaps). **One was installed.** This page
exists so the other 18 are not re-evaluated from scratch later.

## The finding that decided it: a skill catalog is billed every session

Every installed skill's **name + description** is loaded into context before Aldi types
anything. Measured, not guessed:

| | skills | ~tokens per session |
|---|---|---|
| What he has installed now | 108 | **6,355** |
| `anthropic-cybersecurity-skills` alone | 818 | **89,705** |
| `ECC` | 286 | ~30,000 (est., same ratio) |

Installing the two biggest would add **~120,000 tokens to every single session, forever**. For
scale: the bloated `PROGRESS.md` he ordered trimmed on 2026-08-21 was ~50,000 tokens, and that
trim was worth doing. This would be more than twice as bad, permanently, and would fire on
sessions that have nothing to do with cybersecurity.

**The rule that comes out of this: judge a skill pack by its catalog cost, not by its star
count.** 818 skills is not 818× the value of one skill — it is 818 descriptions competing for
attention in every unrelated session.

## Verdict table

| Repo | Licence | What it is | Verdict |
|---|---|---|---|
| `coleam00/excalidraw-diagram-skill` | **none** | 1 skill, no hooks, diagram JSON | **INSTALLED** — fills a real gap, costs ~40 tokens |
| `garrytan/gstack` | MIT | **59** skills (CEO / eng / design / QA / iOS / deploy) | **4 INSTALLED MANUAL-ONLY** — see below |
| `obra/superpowers` | MIT | 14 skills, spec→plan→subagent TDD methodology | Overlaps ponytail + karpathy + alucard §4; hooks fire automatically |
| `mukul975/anthropic-cybersecurity-skills` | Apache-2.0 | **818** skills, MITRE/NIST mapped | NO — 90k tokens/session. Reference it if a security job comes up |
| `affaan-m/ECC` | MIT | **286** skills; memory, instincts, security | NO — duplicates what §8a–8c and A-Brain already do, at ~30k/session |
| `thedotmack/claude-mem` | Apache-2.0 | persistent memory, session hooks | NO — a second memory system fighting A-Brain; neither ends up authoritative |
| `calesthio/OpenMontage` | **AGPL-3.0** | video production pipelines | NO — viral copyleft, and he sells KPM. Irrelevant besides |
| `heygen-com/hyperframes` | Apache-2.0 | 21 skills, HTML → video | NO — no KPM use |
| `snarktank/ralph` | MIT | autonomous loop until a PRD is done | NO — `/loop` already covers it |
| `multica-ai/andrej-karpathy-skills` | **none** | 1 CLAUDE.md of Karpathy's rules | NO — `anthropic-skills:karpathy-guidelines` is already wired into alucard §0 |
| `bytedance/deer-flow` | MIT | research/coding SuperAgent harness | Not a skill — a separate harness |
| `pipecat-ai/pipecat` | BSD-2 | voice/realtime agent framework | Not a skill |
| `crewaiinc/crewai` | MIT | Python multi-agent orchestration | Not a skill |
| `browser-use/browser-use` | MIT | browser automation for agents | Not a skill — three browser tools already available here |
| `firecrawl/firecrawl` | **AGPL-3.0** | scraping API | Not a skill — already present as an MCP server (needs a key) |
| `cline.bot/cli` | — | a competing coding agent CLI | Not a skill |
| `anythingllm.com` | — | desktop LLM app | Not a skill |
| `anthropics/.../frontend-design` | official | frontend design skill | Already covered by the design stack in alucard §1a |

## gstack — installed 2026-08-26, and the second cost nobody measures

Aldi said *"add it we might need that in the future right"*, then, mid-install:
*"we have limited token so make sure that inefficient token usage skills are stores instead of
auto use"*. Both were satisfied by installing four skills with their descriptions rewritten to
`MANUAL ONLY`.

**Catalog cost is not the only cost.** gstack's 59 skills are cheap to have listed (~1,413
tokens) but expensive to RUN — the bodies load in full on invocation:

| installed | invocation cost |
|---|---|
| `gstack-office-hours` — six forcing questions that reframe an idea before code | ~26k |
| `gstack-spec` — vague intent → executable spec, five phases | ~22k |
| `gstack-design-shotgun` — several design variants + comparison board | ~19k |
| `gstack-investigate` — root-cause debugging, no fix without evidence | ~16k |

For scale, alucard's entire `SKILL.md` is ~10k. `gstack review` was declined at **28k** — he
already has `/code-review` and 813 audit checks. So were all 55 others: iOS, Supabase, deploy,
benchmarks, and the three `plan-*` reviews that restate alucard §4.

**The trap that nearly shipped:** all four arrived with `triggers:` blocks in their frontmatter —
22 lines of them, including *"show me design options"*. A rewritten description does NOT disable
those. They were stripped after install; the lesson is in `lessons.md` (2026-08-26).

`bun` is not installed, so gstack's `browse` / voice / slop-scan extras stay dead. None of the
four needs them, but `office-hours` will offer to build one — decline it.

## Licence notes that matter because the app is for sale

- **AGPL-3.0** (OpenMontage, Firecrawl) is viral: code derived from it must also be AGPL. Never
  copy from these into KPM. Calling Firecrawl as a hosted service is fine — that is their API,
  not their source.
- **No licence at all** (excalidraw skill, karpathy-skills) means all rights reserved by default.
  Personal local use is what the author published it for; redistributing it inside a product is
  not. The excalidraw skill must never be bundled into anything sold — it stays in
  `~/.claude/skills/`, which `export-app-for-sale.mjs` never touches.

See also [[n8n Automation Templates Archive]] for the other "save this repo" decision, and the
2026-08-24 lessons rework for why a rule that never fires is a cost, not an asset.
