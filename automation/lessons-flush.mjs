#!/usr/bin/env node
/* Lessons flush — Alucard SKILL.md §8c. Runs on Stop.
 *
 * WHY THIS EXISTS: "reflect at the end of the session" is a soft instruction, and soft
 * instructions are dropped exactly during the long, costly sessions that produce the best
 * lessons. The write has to be forced by something outside the model. (Adapted from the
 * task-observer meta-skill by Eoghan Henn / rebelytics.com, CC BY 4.0, which ties the same idea
 * to a todo counter.)
 *
 * BUT forcing it on EVERY session is noise, and noise gets a check switched off. Aldi's call,
 * 2026-08-24: "sure make it automatically". So the session's own size decides:
 *
 *   short session (< BIG_SESSION assistant turns) -> stamp the footer date silently, exit 0.
 *   long session, lessons.md untouched            -> block ONCE and ask for the lesson.
 *
 * Measured over his real transcripts, sessions land at either end: 1, 5, 57, 111 turns for
 * errands, and 571 / 676 / 1236 for the ones that ship something. 120 sits in the empty middle.
 *
 * ONCE is load-bearing. `nagged` is written to the session state BEFORE the block, and
 * stop_hook_active is honoured, so this can add one turn to a session but never a loop.
 *
 * Baseline mtime comes from lessons-health.mjs at SessionStart. No baseline (session predates
 * the hook, state pruned, disk error) => pass. Every failure path is fail-open: a Stop hook that
 * throws would wedge every session on this machine.
 *
 * Exit 0 = let the session stop. Exit 2 = block, and stderr goes back to the model.
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

/* ~/.claude/skills/alucard is a junction on the PC and a symlink in the cloud, both to the repo. */
const LESSONS = join(homedir(), '.claude/skills/alucard/lessons.md');
const STATE_DIR = join(dirname(dirname(fileURLToPath(import.meta.url))), 'runs/.lessons-state');
const BIG_SESSION = 120;

let input, state, statePath;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
  if (input.stop_hook_active) process.exit(0);
  const sessionId = (input.session_id || '').replace(/[^\w-]/g, '');
  if (!sessionId) process.exit(0);
  statePath = join(STATE_DIR, `${sessionId}.json`);
  state = JSON.parse(readFileSync(statePath, 'utf8'));
} catch {
  process.exit(0);
}

if (state.nagged) process.exit(0);

let mtime;
try {
  mtime = statSync(LESSONS).mtimeMs;
} catch {
  process.exit(0);
}
/* Touched this session — the loop did its job, whatever the session's size. */
if (mtime > state.mtime) process.exit(0);

/* How much work actually happened. An errand has nothing to teach; asking anyway is how a
 * check earns the reputation that gets it deleted. */
let turns = 0;
try {
  turns = (readFileSync(input.transcript_path, 'utf8').match(/"type":"assistant"/g) || []).length;
} catch { /* unreadable transcript -> treat as short, stay quiet */ }

if (turns < BIG_SESSION) {
  /* Stamp the footer ourselves. Line-anchored substitution on a fresh read: a greedy or DOTALL
   * pattern over this file could swallow every entry from the match to EOF, and the whole point
   * of the file is that it survives. Re-read immediately before writing so a parallel session's
   * append is not clobbered. */
  try {
    const text = readFileSync(LESSONS, 'utf8');
    const stamp = `Last checked: ${new Date().toISOString().slice(0, 10)} — no lesson (auto, ${turns}-turn session)`;
    const before = (text.match(/^### \d{4}-\d{2}-\d{2}/gm) || []).length;
    const next = /^Last checked:.*$/m.test(text)
      ? text.replace(/^Last checked:.*$/m, stamp)
      : text.replace(/\n*$/, `\n\n${stamp}\n`);
    /* Structural invariant: a footer stamp must not change the entry count. */
    if ((next.match(/^### \d{4}-\d{2}-\d{2}/gm) || []).length !== before) process.exit(0);
    writeFileSync(LESSONS, next);
  } catch { /* fail open */ }
  process.exit(0);
}

/* Mark first so a failure after this point cannot re-block. */
try {
  writeFileSync(statePath, JSON.stringify({ ...state, nagged: true }));
} catch {
  process.exit(0);
}

process.stderr.write(
  `LESSONS NOT TOUCHED IN A ${turns}-TURN SESSION (SKILL.md §8c).\n\n` +
  `Short sessions stamp themselves and stay quiet. This one was long enough to have cost\n` +
  `something, so it gets asked once:\n\n` +
  `  Something went wrong or nearly did, and it can recur on another file or day? Append it to\n` +
  `  ~/.claude/skills/alucard/lessons.md — **Status:** LIKELY, and\n` +
  `  "Would have prevented:" must name a cost that ACTUALLY happened in THIS session.\n\n` +
  `  Genuinely nothing? Update the "Last checked:" footer line to today's date and stop.\n\n` +
  `This will not ask again this session.\n`
);
process.exit(2);
