#!/usr/bin/env node
/* Find a stored skill without loading any of them.
 *
 *   node "A-Brain/automation/skill-find.mjs" firestore security rules
 *
 * Prints at most 8 matches: name, invocation cost, one-line description, and the path to load.
 * Nothing is loaded here — the whole point is that Aldi sees the price and decides. The library
 * sits outside ~/.claude/skills precisely so ~1,200 skills cost 0 tokens until one is wanted.
 *
 * Scoring is deliberately dumb: a word in the NAME beats a word in the description, and a skill
 * matching more of the query beats one matching a single common word. Anything cleverer would be
 * a second thing to maintain, and the index is only 343 KB of text.
 */
import { readFileSync, statSync } from 'node:fs';

const INDEX = 'D:/APP DEVELOPMENT/kpm inventory main FILES/A-Brain/Skills-Library/INDEX.tsv';
const LIMIT = 8;

const terms = process.argv.slice(2).join(' ').toLowerCase().split(/[^a-z0-9+#.]+/).filter((t) => t.length > 2);
if (!terms.length) {
  console.log('usage: skill-find.mjs <words describing the job>');
  process.exit(0);
}

let lines;
try {
  lines = readFileSync(INDEX, 'utf8').split('\n').filter(Boolean);
} catch {
  console.log(`SKILL-FIND: no index at ${INDEX} — run skill-index.mjs first.`);
  process.exit(0);
}

/* Whole words only. A substring match found "nota" inside "annotates" and offered a plan-canvas
 * skill for "tobacco nota bookkeeping" — a confident wrong answer, which is worse than none. */
const word = (t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
const patterns = terms.map(word);

const scored = [];
for (const line of lines) {
  const [collection, name, cost, desc, path] = line.split('\t');
  let score = 0, hit = 0, nameHit = false;
  for (const re of patterns) {
    if (re.test(name)) { score += 5; hit++; nameHit = true; }
    else if (re.test(desc)) { score += 1; hit++; }
  }
  /* One common word in a description is noise: "security" alone matched 222 skills, none of them
   * about Firestore. Demand the name, or two different words agreeing. */
  if (!nameHit && hit < 2) continue;
  /* Matching more DISTINCT terms is the strongest signal that this is the right skill. */
  score += hit * hit;
  scored.push({ score, collection, name, cost, desc, path });
}

if (!scored.length) {
  console.log(
    `SKILL-FIND: nothing in the library is a real match for "${terms.join(' ')}".\n` +
    `Tell Aldi that plainly and do the job directly — do NOT offer a loose match as if it fits.`
  );
  process.exit(0);
}

scored.sort((a, b) => b.score - a.score || a.cost.localeCompare(b.cost));
const top = scored.slice(0, LIMIT);

console.log(`SKILL-FIND: ${scored.length} match(es) for "${terms.join(' ')}" — showing ${top.length}. NOTHING IS LOADED.`);
for (const m of top) {
  console.log(`\n  ${m.name}  [${m.collection}, ~${m.cost} tokens to run]`);
  console.log(`    ${m.desc.slice(0, 180)}`);
  console.log(`    load: A-Brain/Skills-Library/${m.path}/SKILL.md`);
}
console.log(`\nOFFER these to Aldi with their cost. Load one ONLY after he picks it (SKILL.md §1b).`);
try {
  console.log(`(index: ${Math.round(statSync(INDEX).size / 1024)} KB, ${lines.length} skills, none of them in context)`);
} catch { /* ignore */ }
