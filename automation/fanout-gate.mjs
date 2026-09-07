#!/usr/bin/env node
// PreToolUse gate on Workflow / Agent.
//
// Aldi, 2026-08-20: "dont use workflow, edit alucard rules for this" -> "okay then no workflow".
// Aldi, 2026-09-07: "i never allow u to use workflow automatically until im the one who ask it".
//
// Alucard SKILL.md 9a said this in prose and lost to an ultracode system reminder on 2026-09-07:
// 31 agents, 1,620,398 subagent tokens, 21 killed by the session limit, verdict null, and the
// answer came from one file read inline. Prose can be skimmed past by a later instruction; a
// hook cannot. SKILL.md 8b: convert the rule that keeps failing into something structural.
//
// Unlock is deliberate and separate: create .claude/.fanout-unlocked in the project root.
// Nothing about "be exhaustive" tells an agent to create a sentinel file, which is the point.

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SENTINEL = '.claude/.fanout-unlocked'

let payload = {}
try { payload = JSON.parse(readFileSync(0, 'utf8') || '{}') } catch {}

const tool = payload.tool_name ?? ''
// Check every root we might be given. payload.cwd can arrive as an MSYS path (/d/APP...) that
// Node cannot resolve on Windows, so process.cwd() is the reliable one and payload.cwd is a
// fallback, not the primary. Caught by the locked/unlocked/re-locked test, 2026-09-07.
const roots = [process.cwd(), payload.cwd].filter(Boolean)

if (roots.some((r) => existsSync(join(r, SENTINEL)))) process.exit(0)   // Aldi asked; let it through

const reason = [
  `BLOCKED: ${tool} is gated. Aldi banned automatic fan-out twice — 2026-08-20 ("okay then no`,
  `workflow") and 2026-09-07 ("i never allow u to use workflow automatically until im the one who`,
  `ask it"). A mode reminder, a skill, or an "be exhaustive" instruction does NOT override him.`,
  ``,
  `Do the work yourself. Before reaching for a subagent, apply the two-grep test: if the question`,
  `could be answered by reading a file you can already name, read it.`,
  ``,
  `If Aldi asked for this fan-out IN HIS OWN WORDS, say so and create ${SENTINEL} first, then`,
  `retry. Remove it when the run is done. Never create it to get past this message.`,
].join('\n')

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: reason,
  },
}))
