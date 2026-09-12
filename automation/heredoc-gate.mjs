#!/usr/bin/env node
// PreToolUse gate on Bash: refuse a command that carries a file body or a script INLINE when
// that body is the kind this harness mangles. Aldi, 2026-09-12: "yes add the guard if needs to".
//
// The lesson it replaces (~/.claude/skills/alucard/lessons.md, 2026-09-01) fired four times in
// eleven days and the prose never stopped it: 2026-09-01 (template literals eaten in
// PonderBook.jsx), 2026-09-02 (a python heredoc turned `\n` into a real newline inside a regex,
// twice), 2026-09-12 (a quoted heredoc collapsed `\\n` to `\n` in a patch script, and a 115-line
// markdown heredoc died on a quote). Each one cost two or three turns before the cause was seen,
// because the write "succeeds" and the damage shows up later.
//
// What is refused, with the evidence for each line:
//   1. a heredoc whose body contains a backslash            (2026-09-02, 2026-09-12)
//   2. a heredoc longer than 40 lines                        (115 lines failed; a 25-line commit
//                                                             message with backticks passed)
//   3. `node -e` / `python -c` whose code holds a backtick
//      or `${`                                               (2026-09-01)
//
// The way out is always the same and is printed in the message: write the payload with the
// Write tool, then run or read the FILE from Bash. Nothing here needs an unlock sentinel; there
// is no legitimate reason to push a backslash-laden body through a heredoc when Write exists.

import { readFileSync } from 'node:fs'

let payload = {}
try { payload = JSON.parse(readFileSync(0, 'utf8') || '{}') } catch {}

if ((payload.tool_name ?? '') !== 'Bash') process.exit(0)
const cmd = String(payload.tool_input?.command ?? '')
if (!cmd) process.exit(0)

const problems = []

// 1 + 2: heredocs. Find each `<<TAG` / `<<'TAG'` / `<<-"TAG"` and slice its body up to the
// closing tag on its own line.
const heredocRe = /<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1[^\n]*\n/g
let m
while ((m = heredocRe.exec(cmd))) {
  const tag = m[2]
  const start = m.index + m[0].length
  const endRe = new RegExp(`^${tag}\\s*$`, 'm')
  const rest = cmd.slice(start)
  const end = rest.search(endRe)
  const body = end < 0 ? rest : rest.slice(0, end)
  const lines = body.split('\n').length
  if (body.includes('\\')) problems.push(`heredoc <<${tag} body contains a backslash`)
  if (lines > 40) problems.push(`heredoc <<${tag} body is ${lines} lines (limit 40)`)
}

// 3: inline scripts.
const inlineRe = /\b(node\s+-e|node\s+--eval|python3?\s+-c)\s+(['"])([\s\S]*?)\2/g
while ((m = inlineRe.exec(cmd))) {
  const code = m[3]
  if (code.includes('`') || code.includes('${')) problems.push(`${m[1]} code contains a backtick or \${`)
}

if (!problems.length) process.exit(0)

const reason = [
  `BLOCKED by heredoc-gate: ${problems.join('; ')}.`,
  ``,
  `This harness mangles exactly that: backslashes collapse (\\\\n -> \\n -> a real newline),`,
  `template literals get eaten, and long bodies die on a quote. It happened four times between`,
  `2026-09-01 and 2026-09-12 and each time the write "succeeded" and the damage surfaced later.`,
  ``,
  `Do this instead: put the payload in a file with the Write tool (scratchpad for scripts and`,
  `patch bodies; the real path for a file you are creating), then run or read that FILE from`,
  `Bash. A commit message is fine as a short heredoc; anything with a backslash is not.`,
].join('\n')

process.stderr.write(reason + '\n')
process.exit(2)
