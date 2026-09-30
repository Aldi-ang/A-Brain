import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = 'C:/Users/ASUS/.claude/projects/D--APP-DEVELOPMENT-kpm-inventory-main-FILES-kpm-inventory-main/c70b79f9-32bb-4474-94e4-7ba67c6be2c3/tool-results/artifact-bb85c99d-1790681903-ccf5.html';
let t = fs.readFileSync(SRC, 'utf8');
const css = fs.readFileSync(path.join(HERE, 'new.css'), 'utf8') + '  .sbx .slot.on { outline: 3px solid var(--hi); outline-offset: -3px; }\n';
const html = fs.readFileSync(path.join(HERE, 'new.html'), 'utf8');
const js = fs.readFileSync(path.join(HERE, 'new.js'), 'utf8');
const must = (i, what) => { if (i < 0) throw new Error('anchor not found: ' + what); return i; };

// 1. the new CSS at the end of the page's main style block
const cssAt = must(t.indexOf('</style>\n\n<div class="wrap">'), 'main style end');
t = t.slice(0, cssAt) + css + t.slice(cssAt);

// 2. lift the enchanting-table block (v6) out of its place
const e0 = must(t.indexOf('  <header class="page">'), 'enchanting header');
const e1 = must(t.indexOf('</div>\n\n<script>', e0), 'wrap close');
let ench = t.slice(e0, e1);
t = t.slice(0, e0) + t.slice(e1);
const h0 = '<h2 class="h1">The book on an enchanting table</h2>';
must(ench.indexOf(h0), 'enchanting title');
ench = ench.replace(h0, '<h2 class="h1">The book on an enchanting table: the book lower, your yes before I build</h2>');
// his 2026-09-30 "make the book little bit closer to the table so that it dont float too high"
const f0 = 'bottom: calc(36px + var(--th) * .95 + 2px);';
must(t.indexOf(f0), 'float rule');
t = t.replace(f0, 'bottom: calc(36px + var(--th) * .95 - ' + (process.env.DROP || 16) + 'px);');

// 3. the new sections first, then v6, then the approved Fleet & Roster switch and the biohazard looks
const wrapAt = must(t.indexOf('<div class="wrap">\n'), 'wrap open') + '<div class="wrap">\n'.length;
t = t.slice(0, wrapAt) + html + ench + t.slice(wrapAt);

// 4. the new script last
const endAt = must(t.lastIndexOf('</body></html>'), 'body end');
t = t.slice(0, endAt) + js + t.slice(endAt);

fs.writeFileSync(path.join(HERE, 'index.html'), t);
console.log('written', t.length, 'bytes; sections:', (t.match(/<section class="opt"/g) || []).length, 'v6 at', t.indexOf('(v6): your yes'), 'fx2 at', t.indexOf('id="fx2"'));
