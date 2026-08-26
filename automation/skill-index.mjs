#!/usr/bin/env node
/* Build the searchable index of the stored skill library.
 *
 * WHY AN INDEX AND NOT AN INSTALL: a skill installed under ~/.claude/skills has its name and
 * description loaded into EVERY session before Aldi types anything. Measured 2026-08-25: his 108
 * installed skills cost ~6,355 tokens a session; the cybersecurity pack alone would add ~89,705.
 * The library holds ~1,200 skills. Installed, that is roughly a quarter of a million tokens per
 * session, most of it for jobs he will never do.
 *
 * So the library lives OUTSIDE ~/.claude/skills. Claude cannot see it. Alucard finds a skill by
 * GREPPING this index (skill-find.mjs), which costs a few hundred tokens and returns a handful of
 * lines, then loads exactly one SKILL.md if Aldi says yes.
 *
 * Rebuild after adding a collection:  node "A-Brain/automation/skill-index.mjs"
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LIB = 'D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/Skills-Library';
const OUT = join(LIB, 'INDEX.tsv');

/* One line per skill, tab-separated so a grep hit is readable as-is:
 *   collection <TAB> name <TAB> ~kTokens <TAB> description <TAB> path
 * Description is squashed to one line and clipped — the index is for MATCHING, not for reading. */
const rows = [];
let skipped = 0;

for (const collection of readdirSync(LIB)) {
  const cdir = join(LIB, collection);
  if (!statSync(cdir).isDirectory()) continue;

  /* Collections nest differently: some are skills/<name>/SKILL.md, some go one level deeper. */
  const walk = (dir, depth) => {
    if (depth > 2) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const p = join(dir, e.name);
      const sk = join(p, 'SKILL.md');
      if (existsSync(sk)) {
        let t;
        try { t = readFileSync(sk, 'utf8'); } catch { skipped++; continue; }
        const fm = /^---\r?\n([^]*?)\r?\n---/.exec(t);
        if (!fm) { skipped++; continue; }
        const name = (/^name:\s*(.+)$/m.exec(fm[1]) || [, e.name])[1].trim();
        const dm = /^description:\s*(?:>-?\s*\n)?([^]*?)(?:\n[a-z][\w-]*:|$)/m.exec(fm[1]);
        const desc = (dm ? dm[1] : '').replace(/\s+/g, ' ').replace(/\t/g, ' ').trim().slice(0, 240);
        /* Cost is what matters at offer time: the body loads in full on invocation. */
        const kTok = Math.round(statSync(sk).size / 4000);
        /* join() returns backslashes on Windows while LIB is written with forward slashes, so a
         * plain replace of LIB never matched and every path came out doubled:
         * "A-Brain/Skills-Library/D:/APP DEVELOPMENT/.../Skills-Library/...". Normalise first. */
        const rel = p.replace(/\\/g, '/').replace(LIB + '/', '');
        rows.push([collection, name, kTok + 'k', desc, rel].join('\t'));
      } else {
        walk(p, depth + 1);
      }
    }
  };
  walk(cdir, 0);
}

rows.sort();
writeFileSync(OUT, rows.join('\n') + '\n');

const byCollection = {};
for (const r of rows) {
  const c = r.split('\t')[0];
  byCollection[c] = (byCollection[c] || 0) + 1;
}
console.log(`INDEX: ${rows.length} skills -> ${OUT}${skipped ? ` (${skipped} unreadable, skipped)` : ''}`);
for (const [c, n] of Object.entries(byCollection).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(5)}  ${c}`);
}
console.log(`  index file itself: ${Math.round(statSync(OUT).size / 1024)} KB — NEVER read it whole, grep it`);
