#!/usr/bin/env node
/* Lessons health check — the curator's second half. Runs at SessionStart.
 *
 * Alucard SKILL.md §8a-8c sets the rules this enforces. Rewritten 2026-08-24 when the
 * 5-entry cap was replaced by a status lifecycle (the cap jammed the loop twice — a file of
 * five useful entries has nothing to evict, so writing stopped without erroring):
 *
 *   - every entry carries **Status:** LIKELY | LIVE | RETIRED (YYYY-MM-DD) - why
 *   - no cap; archive RETIRED-before-today to A-Brain/Wiki/Lessons-Archive.md before appending
 *   - LIKELY for 14+ days is a BROKEN rule, not an archive candidate: the trigger is wrong, or
 *     it was a platitude. Retire it, or make it structural (audit check / self-check / hook).
 *
 * Second job: record this session's lessons.md mtime so the Stop hook (lessons-flush.mjs) can
 * tell whether anything was written. Fail-open everywhere — a hook that throws is worse than a
 * hook that says nothing.
 *
 * Pure text parsing, no model call. Run by hand:
 *   node "A-Brain/automation/lessons-health.mjs"
 */
import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const LESSONS = 'C:/Users/ASUS/.claude/skills/alucard/lessons.md';
const STATE_DIR = 'D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/runs/.lessons-state';
const STALE_DAYS = 14;
const MAX_LINES = 20;

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((a - b) / 86400000);

/* ---- side job: baseline for the Stop hook. Never let this break the report. ---- */
function recordBaseline() {
  let sessionId = '';
  try {
    sessionId = (JSON.parse(readFileSync(0, 'utf8')).session_id || '').replace(/[^\w-]/g, '');
  } catch { /* no stdin, or not JSON — run by hand */ }
  if (!sessionId) return;
  try {
    mkdirSync(STATE_DIR, { recursive: true });
    /* prune: a state file per session adds up, and none matters after the session ends */
    for (const f of readdirSync(STATE_DIR)) {
      const p = join(STATE_DIR, f);
      if (daysBetween(today, statSync(p).mtime) > 7) unlinkSync(p);
    }
    writeFileSync(
      join(STATE_DIR, `${sessionId}.json`),
      JSON.stringify({ mtime: statSync(LESSONS).mtimeMs, nagged: false })
    );
  } catch { /* fail open */ }
}
recordBaseline();

let text;
try {
  text = readFileSync(LESSONS, 'utf8');
} catch {
  console.log(`LESSONS: UNKNOWN — could not read ${LESSONS}`);
  process.exit(0);
}

/* Entries start at "### <date> — <title>"; everything before the first is preamble. The preamble
 * holds a FORMAT TEMPLATE inside a code fence headed "### YYYY-MM-DD — <short lesson>" —
 * requiring a real numeric date is what excludes it. Counting it once hid a jam. */
const blocks = text.split(/^### /m).slice(1).filter((b) => /^\d{4}-\d{2}-\d{2}/.test(b));

const entries = blocks.map((b) => {
  const head = b.split('\n')[0].trim();
  /* Bookkeeping comments are not entry content. The archive ledger has been miscounted as part
     of both its neighbours before; strip comments wherever they sit. */
  const body = b.replace(/<!--[^]*?-->/g, '');
  const m = /^\*\*Status:\*\*[ \t]*(LIKELY|LIVE|RETIRED)\b[ \t]*(\(\d{4}-\d{2}-\d{2}\))?/m.exec(body);
  return {
    title: head,
    written: head.slice(0, 10),
    status: m ? m[1] : null,
    retiredOn: m && m[2] ? m[2].slice(1, -1) : null,
    fired: /^Fired:[ \t]*\S/m.test(body),
    lines: body.split('\n').filter((l) => l.trim()).length,
  };
});

const problems = [];
const live = entries.filter((e) => e.status === 'LIVE');
const likely = entries.filter((e) => e.status === 'LIKELY');
const retired = entries.filter((e) => e.status === 'RETIRED');

/* §8a — a status is mandatory and a resolved one must carry its date. */
const statusless = entries.filter((e) => !e.status);
if (statusless.length) {
  problems.push(
    `NO STATUS — ${statusless.map((e) => `"${e.title}"`).join(', ')}. §8a: every entry opens ` +
    `with **Status:** LIKELY | LIVE | RETIRED (date).`
  );
}
const undated = retired.filter((e) => !e.retiredOn);
if (undated.length) {
  problems.push(`RETIRED WITHOUT A DATE — ${undated.map((e) => `"${e.title}"`).join(', ')}. Invalid; add the date it was retired.`);
}

/* §8a — archive on write. Same-day retirements stay so parallel sessions can see them. */
const dueForArchive = retired.filter((e) => e.retiredOn && e.retiredOn < iso(today));
if (dueForArchive.length) {
  problems.push(
    `ARCHIVE DUE — ${dueForArchive.length} entry(ies) retired before today are still in the file: ` +
    `${dueForArchive.map((e) => `"${e.title}"`).join(', ')}. Move them to A-Brain/Wiki/Lessons-Archive.md.`
  );
}

/* §8b — the real change. A rule that has not fired is not waiting its turn, it is broken. */
const stale = likely.filter((e) => daysBetween(today, new Date(e.written)) >= STALE_DAYS);
if (stale.length) {
  problems.push(
    `NEVER FIRED IN ${STALE_DAYS}+ DAYS — ${stale.map((e) => `"${e.title}"`).join(', ')}. §8b: the ` +
    `trigger is wrong, or it was a platitude. Retire it, or convert it into a check/hook and retire the prose.`
  );
}

/* Status and evidence must agree, in both directions. */
const mismatch = entries.filter(
  (e) => (e.status === 'LIVE' && !e.fired) || (e.status === 'LIKELY' && e.fired)
);
if (mismatch.length) {
  problems.push(
    `STATUS DOES NOT MATCH Fired: — ${mismatch.map((e) => `"${e.title}"`).join(', ')}. ` +
    `LIVE needs a Fired: date; LIKELY must have none.`
  );
}

const oversize = entries.filter((e) => e.lines > MAX_LINES);
if (oversize.length) {
  problems.push(`RUNAWAY LENGTH — ${oversize.map((e) => `"${e.title}" (${e.lines} lines)`).join(', ')}.`);
}

const tally = `${entries.length} entries — ${live.length} LIVE, ${likely.length} LIKELY, ${retired.length} RETIRED`;

if (problems.length) {
  console.log(`LESSONS: NEEDS ATTENTION — ${tally}.`);
  for (const p of problems) console.log(`- ${p}`);
} else {
  const soon = likely
    .map((e) => STALE_DAYS - daysBetween(today, new Date(e.written)))
    .filter((d) => d <= 4 && d > 0);
  console.log(
    `LESSONS: OK — ${tally}.` +
    (soon.length ? ` ${soon.length} LIKELY entry(ies) go stale within ${Math.max(...soon)} day(s).` : '')
  );
}
