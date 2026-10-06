/* 2026-10-06 - puts the Day Replay scene into showcase.html as scene 03 (the old 03-10 become 04-11). The pictures come
   from the app itself: kpm src/utils/mapSprites.js (personSvg, SPRITE_CSS - only the 6 rules the scene uses) and
   kpm public/coin-sprite.png (the spinning coin), so the scene cannot drift from what the app draws.
   Parts: replay-scene.css / .html / .js; the page around it is showcase.base.html (edit THAT, never showcase.html). Usage: node splice-replay.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KPM = path.resolve(HERE, '../../../kpm-inventory-main');
const BASE = path.join(HERE, 'showcase.base.html'), PAGE = path.join(HERE, 'showcase.html');   /* edit the BASE (scenes without 03); this writes the page */
let s = fs.readFileSync(BASE, 'utf8');
if (s.includes('id="ulang"')) throw new Error('the base must not hold scene 03 - restore showcase.base.html from git');
const M = await import(pathToFileURL(path.join(KPM, 'src/utils/mapSprites.js')).href);
const want = ['kx-spr-closed', 'kx-spr-open', 'kx-sgn-order', 'kx-sgn-issue', 'kx-sgn-request', 'kx-sgn-closed'];
const rules = M.SPRITE_CSS.split('}').filter((r) => want.includes(r.split('{')[0].trim().slice(1))).map((r) => r + '}');
if (rules.length !== want.length) throw new Error('sprite rules found: ' + rules.length);
const coin = 'data:image/png;base64,' + fs.readFileSync(path.join(KPM, 'public/coin-sprite.png')).toString('base64');
const person = M.personSvg('#2B1A0E', '#E8E4DE');
const css = fs.readFileSync(path.join(HERE, 'replay-scene.css'), 'utf8').replace('/*SPRITES*/', rules.join('\n')).replace('__COIN__', coin);
const html = fs.readFileSync(path.join(HERE, 'replay-scene.html'), 'utf8');
const js = fs.readFileSync(path.join(HERE, 'replay-scene.js'), 'utf8').replace("const DR_PERSON = '__PERSON__';", `const DR_PERSON = ${JSON.stringify(person)};`);
const put = (needle, add, after = false) => { const i = s.indexOf(needle); if (i < 0) throw new Error('needle missing: ' + needle.slice(0, 60)); s = after ? s.slice(0, i + needle.length) + add + s.slice(i + needle.length) : s.slice(0, i) + add + s.slice(i); };
const pad = (n) => String(n).padStart(2, '0');
for (let n = 10; n >= 3; n--) {
  s = s.replace(`<!-- ${pad(n)} -->`, `<!-- ${pad(n + 1)} -->`).replace(`<div class="eyebrow">${pad(n)} · `, `<div class="eyebrow">${pad(n + 1)} · `);
}
s = s.replace('</b> / 10 · ', '</b> / 11 · ');
put('@media (prefers-reduced-motion: reduce) { .kpm-nixie-reel', css + '\n');
put('<!-- 04 -->', html);
put('/* ---- which scene is on screen', js + '\n');
put("if (id === 'aman') { nStep = 0; netRun(); }", " if (id === 'ulang') drGo();", true);
put('function applyMode() {\n  setMode(); cancelAnimationFrame(raf); raf = 0;', ' drMode();', true);
fs.writeFileSync(PAGE, s);
console.log('spliced: scene 03 + css', css.length, '+ js', js.length, 'chars; page now', s.length);
