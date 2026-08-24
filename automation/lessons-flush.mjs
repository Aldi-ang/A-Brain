#!/usr/bin/env node
/* Lessons flush — Alucard SKILL.md §8c. Runs on Stop.
 *
 * WHY THIS EXISTS: "reflect at the end of the session" is a soft instruction, and soft
 * instructions are dropped exactly during the long, costly sessions that produce the best
 * lessons. The write has to be forced by something outside the model. So: if lessons.md was
 * never touched this session, block ONCE and say so. (Adapted from the task-observer meta-skill
 * by Eoghan Henn / rebelytics.com, CC BY 4.0, which ties the same idea to a todo counter.)
 *
 * ONCE is load-bearing. `nagged` is written to the session's state file before the block, so a
 * second Stop always passes — this can add one turn to a session, never a loop.
 *
 * Baseline mtime comes from lessons-health.mjs at SessionStart. No baseline (session predates
 * the hook, state pruned, disk error) => pass. Every failure path here is fail-open: a Stop hook
 * that throws would wedge every session on this machine.
 *
 * Exit 0 = let the session stop. Exit 2 = block, and stderr goes back to the model.
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LESSONS = 'C:/Users/ASUS/.claude/skills/alucard/lessons.md';
const STATE_DIR = 'D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/runs/.lessons-state';

let state, statePath;
try {
  const sessionId = (JSON.parse(readFileSync(0, 'utf8')).session_id || '').replace(/[^\w-]/g, '');
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
/* Touched this session — the loop did its job. */
if (mtime > state.mtime) process.exit(0);

/* Mark first so a failure after this point cannot re-block. */
try {
  writeFileSync(statePath, JSON.stringify({ ...state, nagged: true }));
} catch {
  process.exit(0);
}

process.stderr.write(
  `LESSONS NOT TOUCHED THIS SESSION (SKILL.md §8c).\n\n` +
  `Do ONE of these now, then stop:\n` +
  `  1. Something went wrong or nearly did, and it can recur? Append the lesson to\n` +
  `     C:/Users/ASUS/.claude/skills/alucard/lessons.md — **Status:** LIKELY, and\n` +
  `     "Would have prevented:" must name a cost that ACTUALLY happened this session.\n` +
  `  2. Genuinely nothing to learn? Update the "Last checked:" footer line in that file to\n` +
  `     today's date.\n\n` +
  `Option 2 is not the default. This check exists because the reflex to skip it is strongest\n` +
  `in exactly the sessions worth learning from. This will not ask again this session.\n`
);
process.exit(2);
