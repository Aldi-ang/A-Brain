// v27 - the HEALTHY blast door, his pick + his fixes. 2026-09-30 09:25: "make the blast door for healthy goods special,
// design it so that it look kinda realistic and more beautiful". v26 drew three looks; 10:15, on look 2: "vault wheel is
// okay but change it into eye of ender logo instead of spiinning vault i like the silver color tho but make sure that
// both quarantine and eye of ender logo in the middle is really in the middle as u can see the line is not in the middle
// it is annoying to watch, the quarantine logo also not symetrically meet in the middle".
// So: silver brushed steel, panel grooves, bolts, interlocking teeth, and the lock = a pixel Eye of Ender in a chrome
// ring - no wheel, nothing turns. CENTRED: the doors used to overlap by 1% (50.5% each), which put the seam and the
// seals 1% off the middle. Now the quarantine doors overlap 2 px around the exact middle (the tape seam 3 + 3 px each
// side of it, the seal on it), and the healthy doors meet so the teeth zone is centred on the middle (7 px each side),
// the lock on it. Two keys hold either door SHUT so it can be looked at (in the run a door is shut for ~0.4 s).
// The lock rides on the LEFT door (its teeth overlap the right door), so the left door travels 44 px further.
// Runs after patch-isle.mjs, on the LF new.* of vault a960b5d.
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

rep('new.html', [
  ['      <button class="key" type="button" data-door="d3" aria-pressed="false">3 · Stone</button>\n    </div>\n',
   `      <button class="key" type="button" data-door="d3" aria-pressed="false">3 · Stone</button>
    </div>
    <div class="bar" role="group" aria-label="See a door shut">
      <button class="key" type="button" data-see="steel" aria-pressed="false">See the healthy door shut</button>
      <button class="key" type="button" data-see="tape" aria-pressed="false">See the quarantine door shut</button>
    </div>
`],
]);

rep('new.js', [
  ["d.dataset.kind = toQ ? 'tape' : 'steel'; d.dataset.look = rw.door;", "d.dataset.kind = toQ ? 'tape' : 'steel'; d.dataset.look = rw.door; d.dataset.hl = 'silver';"],
  ["A(L, [{ transform: 'translateX(-101%)' }, { transform: 'translateX(0)' }]", "A(L, [{ transform: 'translateX(calc(-101% - 44px))' }, { transform: 'translateX(0)' }]"],
  ["A(L, [{ transform: 'translateX(0)' }, { transform: 'translateX(-101%)' }]", "A(L, [{ transform: 'translateX(0)' }, { transform: 'translateX(calc(-101% - 44px))' }]"],
  ['    function flipRW() {\n      if (rw.busy) return;', '    function flipRW() {\n      if (rw.busy) return;\n      hold(false);'],
  ["    document.querySelectorAll('[data-rw]').forEach(", `    /* a See key holds that door SHUT so it can be looked at (the run shows it for ~0.4 s); the big button opens it again */
    function hold(kind) {
      var d = rwD.querySelector('.kpm-doors'); if (!d) return;
      var L = d.children[0], R = d.children[1];
      if (kind) { d.dataset.kind = kind; d.dataset.look = rw.door; d.dataset.hl = 'silver'; d.dataset.hold = '1'; L.style.transform = R.style.transform = 'translateX(0)'; }
      else if (d.dataset.hold) { delete d.dataset.hold; delete d.dataset.kind; L.style.transform = R.style.transform = ''; }
      keys('data-see', kind || '');
    }
    document.querySelectorAll('[data-see]').forEach(function (k) { k.addEventListener('click', function () {
      if (rw.busy || rw.opt !== 'B') return;
      if (!rw.open) document.getElementById('rwChest').click();
      hold(false); void rwD.offsetWidth; hold(k.dataset.see);
      rwM.textContent = (k.dataset.see === 'steel' ? 'The healthy door' : 'The quarantine door') + ', held shut so you can look. Press the big button to open it.';
    }); });
    document.querySelectorAll('[data-rw]').forEach(`],
  ["The cost you took: the age list", "The healthy door (going back from the Quarantine) is silver steel with the Eye of Ender as its lock; the two <b>See</b> keys hold a door shut so you can look. The cost you took: the age list"],
]);

/* the Eye of Ender, pixel art (16 x 16), in the same crisp style as the biohazard sign on the quarantine seal */
const px = [];
for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
  const dx = x - 7.5, dy = y - 7.5, r = Math.hypot(dx, dy);
  let c = null;
  if (r <= 7.3) c = r > 6.3 ? '#0B3F31' : r > 4.7 ? '#1E8A66' : r > 2.9 ? '#46C38D' : '#B6EFA2';
  if (c && (x === 7 || x === 8) && y >= 4 && y <= 11) c = '#08180F';          // the slit pupil
  if ((x === 4 && (y === 4 || y === 5)) || (x === 5 && y === 4)) c = '#EFFFF4';   // the shine
  if (c) px.push(`<rect x='${x}' y='${y}' width='1.02' height='1.02' fill='${c}'/>`);
}
const EYE = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'>${px.join('')}</svg>`)}")`;

/* the interlocking teeth: N teeth, 14 px deep, centred on the exact middle (7 px each side) */
const N = 12, pts = [], sock = [];
for (let k = 0; k < N; k++) pts.push(`0 ${(k * 100 / N).toFixed(3)}%`, `100% ${((k + .5) * 100 / N).toFixed(3)}%`);
pts.push('0 100%');
const TEETH = `polygon(${pts.join(', ')})`;
/* the right door's own edge is the teeth's mirror (sockets); it starts 1 px under the left door so no hairline shows */
for (let k = 0; k < N; k++) sock.push(`1px ${(k * 100 / N).toFixed(3)}%`, `15px ${((k + .5) * 100 / N).toFixed(3)}%`);
const SOCKETS = `polygon(${sock.join(', ')}, 1px 100%, 100% 100%, 100% 0)`;
const H = '.kpm-doors[data-kind="steel"][data-hl="silver"]';
const BOLTS = [12, 50, 88].flatMap(x => [16, 84].map(y => `radial-gradient(circle at ${x}% ${y}%, #F2F2F2 0 2px, #4A4A4A 2.6px 3.6px, transparent 4.2px)`)).join(', ');
const css = `
  /* v27 - CENTRED DOORS (his "really in the middle"): the quarantine doors overlap 2 px around the exact middle; each
     carries a 4 px tape strip at its meeting edge, so shut the tape reads 3 + 3 px about the middle, and the seal on the
     right door is centred ON the middle (its left edge is 1 px left of the middle) */
  .kpm-doors[data-look="d1"] i { width: calc(50% + 1px); }
  .kpm-doors[data-look="d1"] i::after { width: 4px; }
  .kpm-doors[data-look="d1"] .dr::after { background-position: -2px 0; }   /* its strip starts 2 px right of the left one: the stripes run on unbroken */
  .kpm-doors[data-look="d1"][data-kind="tape"] .dr::before { left: -23px; }
  .kpm-doors .dl { transform: translateX(calc(-101% - 44px)); }

  /* v27 - THE HEALTHY BLAST DOOR (his pick: silver + the Eye of Ender). Polished brushed steel, two panel grooves, bolts;
     the left door carries interlocking TEETH centred on the middle, the right door's edge is their mirror (sockets, a
     2 px dark edge along them); the lock ON the middle is a pixel Eye of Ender in a chrome ring. Nothing turns. */
  ${H} i { border: 0; background:
      ${BOLTS},
      linear-gradient(180deg, transparent 33%, #5A5A5A 33% calc(33% + 2px), #EDEDED calc(33% + 2px) calc(33% + 3px), transparent calc(33% + 3px) 66%, #5A5A5A 66% calc(66% + 2px), #EDEDED calc(66% + 2px) calc(66% + 3px), transparent calc(66% + 3px)),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, .09) 0 1px, rgba(0, 0, 0, .05) 1px 2px, transparent 2px 3px),
      linear-gradient(90deg, #7E7E7E, #C6C6C6 42%, #D6D6D6 52%, #9C9C9C); }
  ${H} .dl { z-index: 1; width: calc(50% - 7px); }
  ${H} .dr { width: calc(50% + 8px); clip-path: ${SOCKETS}; }
  ${H} .dl::after { content: ""; position: absolute; z-index: 1; top: 0; bottom: 0; left: auto; right: -14px; width: 14px; height: auto; border: 0; clip-path: ${TEETH}; background: linear-gradient(90deg, #DADADA, #A4A4A4); }
  ${H} .dr::after { content: ""; position: absolute; top: 0; bottom: 0; left: 3px; right: auto; width: 14px; height: auto; border: 0; clip-path: ${TEETH}; background: #3A3A3A; }
  ${H} .dr::before { content: none; }
  ${H} .dl::before { content: ""; position: absolute; z-index: 2; left: auto; right: -36px; top: calc(50% - 29px); width: 58px; height: 58px; box-sizing: border-box; border-radius: 50%; border: 2px solid #1E1E1E;
    background: ${EYE} center / 36px 36px no-repeat,
      radial-gradient(circle, #2E3134 0 62%, #111 63% 65%, transparent 66%),
      conic-gradient(from 215deg, #FFFFFF, #8A8A8A 16%, #E8E8E8 30%, #5A5A5A 48%, #D6D6D6 64%, #767676 80%, #FFFFFF); }
`;
fs.appendFileSync(path.join(HERE, 'new.css'), css);
console.log('healthy door (silver + eye) patched; doors centred');
