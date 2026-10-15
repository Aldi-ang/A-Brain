#!/usr/bin/env node
/* Clean-repo export — run this on the day the app is sold, not before.
 *
 * Why this exists instead of moving files out of the repo now: `.claude/PROGRESS.md` alone is in
 * 118 commits. Moving it today does nothing about the 118 copies already in git history, and a
 * history rewrite would break every hash and any concurrent session. Selling a FRESH repo with
 * one commit and no history is simpler, safer, and takes ten minutes on the day.
 *
 * Aldi, 2026-08-10: "app is meant to be sell while this A-Brain is forever with me".
 *
 * This lives in A-Brain, NOT in the app repo — a tool for selling the app is not part of the app.
 *
 * Usage:
 *   node export-app-for-sale.mjs <destination-folder>
 *   node export-app-for-sale.mjs <destination-folder> --dry-run
 *
 * It copies only git-TRACKED files (so node_modules, build output and untracked junk never come
 * along), drops the personal set below, then SCANS what is left. If any personal marker survives
 * the scan it exits non-zero and writes nothing further — the export cannot pass quietly.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(dirname(dirname(fileURLToPath(import.meta.url)))), 'kpm-inventory-main');

/* Dropped entirely. Each one is Aldi's, not the app's. */
const DROP_PREFIX = [
  '.claude/',        // PROGRESS.md, hooks, quota meter, session context — all personal
  'graphify-out/',   // code-graph export; contains absolute C:/Users/ASUS paths
  '.mcp.json',       // his MCP server wiring
  '.firebaserc',     // his live Firebase project id
  'CLAUDE.md',       // points at the A-Brain vault and his personal workflow
  'coin_flip.html',  // scratch file, not part of the product
];

/* If any of these appear in the exported tree, the export FAILS. */
const FORBIDDEN = [
  /Users[\/\\]ASUS/i,
  /A-Brain/,
  /alucard/i,
  /adikaryasukses/i,
  /192\.168\.\d+\.\d+/,   // his LAN address, from the phone-testing notes
];

const dest = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!dest) {
  console.error('usage: node export-app-for-sale.mjs <destination-folder> [--dry-run]');
  process.exit(2);
}

const tracked = execFileSync('git', ['-C', APP, 'ls-files'], { encoding: 'utf8' })
  .split('\n').filter(Boolean);

const keep = tracked.filter((f) => !DROP_PREFIX.some((p) => f === p || f.startsWith(p)));
const dropped = tracked.length - keep.length;

console.log(`tracked: ${tracked.length}  dropped: ${dropped}  exporting: ${keep.length}`);

/* Scan BEFORE copying, so a dry run is a full safety check on its own. */
const hits = [];
for (const f of keep) {
  const full = join(APP, f);
  let body;
  try {
    body = readFileSync(full, 'utf8');
  } catch {
    continue; // binary or unreadable — skipped, listed below
  }
  for (const rx of FORBIDDEN) {
    if (rx.test(body)) hits.push(`${f}  <-  ${rx}`);
  }
}

if (hits.length) {
  console.error(`\nEXPORT BLOCKED — ${hits.length} file(s) still contain personal data:`);
  for (const h of hits.slice(0, 40)) console.error(`  ${h}`);
  if (hits.length > 40) console.error(`  ...and ${hits.length - 40} more`);
  console.error('\nEither add them to DROP_PREFIX, or edit the file so the marker is gone.');
  console.error('Nothing was written.');
  process.exit(1);
}

console.log('scan clean — no personal markers in the export set.');
if (dryRun) {
  console.log('dry run: nothing written.');
  process.exit(0);
}

if (existsSync(dest)) {
  console.error(`destination ${dest} already exists — refusing to overwrite. Pick a new folder.`);
  process.exit(1);
}
for (const f of keep) {
  const out = join(dest, f);
  mkdirSync(dirname(out), { recursive: true });
  copyFileSync(join(APP, f), out);
}
rmSync(join(dest, '.git'), { recursive: true, force: true });
execFileSync('git', ['-C', dest, 'init', '-q']);
execFileSync('git', ['-C', dest, 'add', '-A']);
execFileSync('git', ['-C', dest, 'commit', '-q', '-m', 'KPM Inventory']);
console.log(`\ndone: ${keep.length} files in ${dest}, one commit, no prior history.`);
console.log('Check it by hand before handing it over. This script is a filter, not a lawyer.');
