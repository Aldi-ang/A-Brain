#!/usr/bin/env node
/* Keeps A-Brain's recall graph current.
 *
 * Alucard queries `Wiki/graphify-out/graph.json` to remember what this project already
 * knows about a topic. That only works if the graph has seen the newest notes — on
 * 2026-08-26 it was 13 days stale, so `graphify query "logistic"` returned nothing while
 * a researched note on exactly that sat in the vault. This is the curator step: cheap,
 * automatic, and impossible to forget.
 *
 * Rebuild is AST-only (`graphify update` = "no LLM needed"), ~8s over ~600 nodes, no API cost.
 * Runs on Stop. Silent unless it actually rebuilt. Never blocks a turn.
 */
import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = dirname(dirname(fileURLToPath(import.meta.url)));
const WIKI = join(VAULT, 'Wiki');
const GRAPH = join(WIKI, 'graphify-out', 'graph.json');
/* Own stamp, not graph.json's mtime. Graphify caches by content, so a rebuild that finds
   nothing new leaves graph.json untouched — and the check then fires forever. */
const STAMP = join(WIKI, 'graphify-out', '.last-refresh');

/* newest .md anywhere under Wiki/, skipping graphify's own output so a rebuild
   cannot make itself look stale on the next run. */
function newestNote(dir) {
    let newest = 0;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'graphify-out') continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) newest = Math.max(newest, newestNote(full));
        else if (entry.name.endsWith('.md')) newest = Math.max(newest, statSync(full).mtimeMs);
    }
    return newest;
}

try {
    if (!existsSync(WIKI)) process.exit(0);

    const graphBuiltAt = existsSync(STAMP) ? statSync(STAMP).mtimeMs
                       : existsSync(GRAPH) ? statSync(GRAPH).mtimeMs : 0;
    const notesChangedAt = newestNote(WIKI);
    if (notesChangedAt <= graphBuiltAt) process.exit(0);   // already current, say nothing

    const r = spawnSync('graphify', ['update', 'Wiki'], {
        cwd: VAULT, encoding: 'utf8', shell: true, timeout: 120000
    });
    const line = (r.stdout || '').split(/\r?\n/).find(l => l.includes('Rebuilt:')) || '';
    const counts = line.match(/Rebuilt: .*/)?.[0] || 'rebuilt';

    if (r.status === 0) { writeFileSync(STAMP, new Date().toISOString()); console.log(`VAULT-GRAPH: refreshed — ${counts}`); }
    else console.log(`VAULT-GRAPH: refresh FAILED (${(r.stderr || '').trim().split(/\r?\n/)[0] || 'unknown'}) — run \`graphify update Wiki\` in A-Brain by hand.`);
} catch (e) {
    console.log(`VAULT-GRAPH: refresh skipped — ${e.message}`);
}
process.exit(0);
