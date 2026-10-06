/* 2026-10-06 - numbers the scenes of showcase.base.html in page order (the <!-- NN --> marker, the eyebrow, the bar's
   "/ N"), so a scene can be inserted anywhere without hand-renumbering the rest. Run BEFORE splice-replay.mjs.
   Usage: node renumber-base.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const F = path.join(path.dirname(fileURLToPath(import.meta.url)), 'showcase.base.html');
let s = fs.readFileSync(F, 'utf8');
const pad = (n) => String(n).padStart(2, '0');
let a = 0, b = 0;
s = s.replace(/<!-- [0-9a-z]+ -->(\r?\n)<section class="scene/g, (_, nl) => `<!-- ${pad(++a)} -->${nl}<section class="scene`);
s = s.replace(/<div class="eyebrow">[0-9]+ · /g, () => `<div class="eyebrow">${pad(++b)} · `);
if (a !== b) throw new Error(`markers ${a} but eyebrows ${b}`);
if (!/<\/b> \/ [0-9]+ · /.test(s)) throw new Error('the bar text is missing');
s = s.replace(/<\/b> \/ [0-9]+ · /, `</b> / ${a} · `);
fs.writeFileSync(F, s);
console.log('scenes', a);
