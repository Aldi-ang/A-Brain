// v24 island redraw - his 2026-09-30 09:10 on v24: "i like the idea but the platform is not naturally and on point here,
// and if u want to make the platform there then add some slow floating animation for those chest and platform to
// increase the naturality". The flat slab sat IN FRONT of the chest in 2D; now the island is part of the chest's own 3D
// (inside .cc, same camera and tilt), so the chest stands ON its top face. A thick End stone slab, a stepped underside
// tapering into the void, and chest + island bob together (5 s, 5 px). Lite Mode's `.lite * { animation: none }` stops it.
// Runs on the committed new.css / new.js (27be109): `git checkout -- new.css new.js` first to re-run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const rep = (file, pairs) => {
  let t = fs.readFileSync(path.join(HERE, file), 'utf8');
  for (const [a, b] of pairs) {
    const n = t.split(a).length - 1;
    if (n !== 1) throw new Error(`${file}: anchor ${n}x: ${a.slice(0, 70)}`);
    t = t.replace(a, b);
  }
  fs.writeFileSync(path.join(HERE, file), t);
};

rep('new.js', [
  ['<i class="br"></i><i class="bt"></i><span class="lid3"><i class="lf"></i><i class="ll"></i><i class="lr"></i><i class="lt"></i><i class="lu"></i><i class="latch"></i></span></span></span><span class="isle" aria-hidden="true"></span>',
   '<i class="br"></i><i class="bt"></i><i class="it"></i><i class="if"></i><i class="iu"></i><span class="lid3"><i class="lf"></i><i class="ll"></i><i class="lr"></i><i class="lt"></i><i class="lu"></i><i class="latch"></i></span></span></span>'],
]);

const SPECK = 'radial-gradient(circle at 22% 38%, #B9BC7E 0 1.6px, transparent 2.2px) 0 0 / 18px 12px, radial-gradient(circle at 68% 72%, #F3F5C6 0 1.3px, transparent 1.9px) 0 0 / 26px 14px, radial-gradient(circle at 44% 20%, #C4C78A 0 1.2px, transparent 1.8px) 0 0 / 34px 16px';
rep('new.css', [
  ['  .wh2 .c3 { margin-bottom: 0; }\n', `  /* v24 island redraw (his "not naturally and on point ... add some slow floating animation"): the island lives in the
     chest's own 3D (.cc), so the chest stands ON its top face; a thick End stone slab over a stepped underside that tapers
     into the void; chest + island bob together. Lite Mode / reduced motion: animation none, it rests. */
  .wh2 .c3 { --iw: calc(var(--w) * 1.62); --id: calc(var(--d) * 1.34); --is: calc(var(--hb) * .34); --iu: calc(var(--hb) * .9);
    margin-bottom: calc(var(--hb) * 1.36); animation: isleBob 5s cubic-bezier(.37, 0, .63, 1) infinite; }
  @keyframes isleBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  .cc .it, .cc .if, .cc .iu { left: calc((var(--w) - var(--iw)) / 2); width: var(--iw); border: 0; }
  .cc .it { top: calc(var(--hl) + var(--hb) - var(--id) / 2 - 1px); height: var(--id); transform: rotateX(90deg);
    background: ${SPECK}, linear-gradient(180deg, #C6C98C, #E6E9AE);
    clip-path: polygon(7% 0, 93% 0, 93% 12%, 100% 12%, 100% 100%, 0 100%, 0 12%, 7% 12%); }
  /* the slab's front: lit End stone; the underside: darker blocks stepping in, fading toward the void's purple */
  .cc .if { top: calc(var(--hl) + var(--hb) - 1px); height: var(--is); transform: translateZ(calc(var(--id) / 2));
    background: ${SPECK}, linear-gradient(180deg, #F0F2BE 0 2px, #D2D596 2px, #B8BB7D); }
  .cc .iu { top: calc(var(--hl) + var(--hb) + var(--is) - 2px); height: var(--iu); transform: translateZ(calc(var(--id) / 2));
    background: radial-gradient(circle at 30% 40%, #5F5B45 0 1.5px, transparent 2.1px) 0 0 / 20px 13px,
      repeating-linear-gradient(180deg, transparent 0 8px, rgba(24, 12, 34, .18) 8px 9px), linear-gradient(180deg, #8E8C64, #625A49 50%, #392D3C);
    clip-path: polygon(0 0, 100% 0, 100% 10%, 95% 10%, 95% 26%, 88% 26%, 88% 42%, 80% 42%, 80% 58%, 71% 58%, 71% 74%, 62% 74%, 62% 88%, 55% 88%, 55% 100%, 45% 100%, 45% 86%, 37% 86%, 37% 70%, 27% 70%, 27% 52%, 17% 52%, 17% 34%, 9% 34%, 9% 18%, 3% 18%, 3% 6%, 0 6%); }
`],
  ['  @container f (max-width: 699px) { .wh2 .isle { width: 132px; height: 24px; } }\n', ''],
]);
// the old 2D slab, whole rule (4 lines)
const f = path.join(HERE, 'new.css'), css = fs.readFileSync(f, 'utf8'), a = css.indexOf('  .wh2 .isle {');
if (a < 0) throw new Error('old .isle rule not found');
fs.writeFileSync(f, css.slice(0, a) + css.slice(css.indexOf('}\n', a) + 2));
console.log('island patched');
