#!/usr/bin/env node
/* graphify answer hook — deliver the answer, do not nag for it.
 *
 * The idea is stolen from basemode (github.com/ChristopherKahler/base), which argues a memory that
 * waits to be asked is "a filing cabinet with extra steps". The existing `graphify hook-guard`
 * already decides CORRECTLY when a tool call is about KPM source (it stays silent for curl, git
 * status, config reads). Its only flaw is what it says when it fires: "you MUST run graphify
 * query" — an instruction the model can, and does, skip.
 *
 * This wrapper keeps the guard's judgement and replaces its message with the actual query result.
 *
 * FAIL-OPEN, ALWAYS. Any error, timeout, or missing binary exits 0 silently. A PreToolUse hook
 * that throws would block every Bash/Grep/Read call in the session, so nothing here may be fatal.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const GRAPHIFY = 'C:/Users/ASUS/.local/bin/graphify.EXE';
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const BUDGET = '400';      // ~1.6KB of nodes; enough to orient, small enough to ride every call
const TIMEOUT_MS = 8000;   // graphify measured at ~940ms; 8s is a generous ceiling before giving up

const out = (text) => process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: text },
}));

let raw = '';
try { raw = readFileSync(0, 'utf8'); } catch { process.exit(0); }

let payload;
try { payload = JSON.parse(raw); } catch { process.exit(0); }

const mode = process.argv[2] === 'read' ? 'read' : 'search';

/* Let the existing guard rule on whether this call is even about code. If it says nothing,
 * we say nothing — its filtering is already correct and is not what we are changing. */
let guard = '';
try {
  guard = execFileSync(GRAPHIFY, ['hook-guard', mode], {
    input: raw, encoding: 'utf8', timeout: 4000, stdio: ['pipe', 'pipe', 'ignore'],
  });
} catch { process.exit(0); }
if (!guard.trim()) process.exit(0);

/* Pull the thing being looked for out of the tool call. */
const ti = payload.tool_input || {};
let term = null;
if (ti.pattern && !ti.pattern.includes('/')) term = ti.pattern;
else if (ti.command) {
  const m = String(ti.command).match(/(?:grep|rg)\b[^|]*?["']([^"']{3,60})["']/);
  if (m) term = m[1];
} else if (ti.file_path) {
  term = String(ti.file_path).split(/[\/]/).pop();
}
/* Strip regex noise so the graph gets a plain symbol. */
if (term) term = term.replace(/[\^$.*+?()[\]{}|]/g, ' ').trim().split(/\s+/)[0];
if (!term || term.length < 3) process.exit(0);

let answer = '';
try {
  answer = execFileSync(GRAPHIFY, ['query', term, '--budget', BUDGET], {
    cwd: REPO, encoding: 'utf8', timeout: TIMEOUT_MS, stdio: ['ignore', 'pipe', 'ignore'],
  });
} catch { process.exit(0); }

const nodes = answer.split('\n').filter((l) => l.startsWith('NODE ')).slice(0, 12);
if (!nodes.length) process.exit(0);

out(
  `graphify already knows "${term}" — these came from the graph, not a search:\n` +
  nodes.join('\n') +
  `\n\nUse these file:line locations directly. Run \`graphify query "${term}" --budget 1500\` only ` +
  `if the answer is not among them. NOTE: graphify's call edges undercount — for "who calls X", ` +
  `confirm with grep before claiming the list is complete.`
);
