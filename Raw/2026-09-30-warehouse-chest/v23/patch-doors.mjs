// v23 doors - his 2026-09-30: "redesign all the blastdoor for quarantine animation because it is too norak i want it to be
// minimalist but cool but still shows that it is quarantine blast door". Three quieter looks on the same two doors and the
// same timing; the hazard lives only where the doors MEET (the seam), so it reads as a quarantine door at a glance.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const rep = (file, pairs) => {
  let t = fs.readFileSync(path.join(HERE, file), 'utf8');
  for (const [a, b] of pairs) { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}x: ${a.slice(0, 70)}`); t = t.replace(a, b); }
  fs.writeFileSync(path.join(HERE, file), t);
};
rep('new.js', [
  ["var rw = { opt: 'B', view: 'ok', busy: false, hp: false, open: true }", "var rw = { opt: 'B', view: 'ok', busy: false, hp: false, open: true, door: 'd1' }"],
  ["d.dataset.kind = toQ ? 'tape' : 'steel';", "d.dataset.kind = toQ ? 'tape' : 'steel'; d.dataset.look = rw.door;"],
  [`    function keys(attr, val) {`, `    /* the sign as an image, for the stamp where the doors meet (each door carries half of it) */
    (function () {
      var rects = (SIGN.match(/<rect[^>]*>/g) || []).join('').replace(/"/g, "'");
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-5 -5 25 25' shape-rendering='crispEdges'><g fill='#141414'>" + rects + "</g></svg>";
      document.documentElement.style.setProperty('--sign-img', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
    })();
    function keys(attr, val) {`],
  [`    document.querySelectorAll('[data-rw]').forEach(`, `    document.querySelectorAll('[data-door]').forEach(function (k) { k.addEventListener('click', function () {
      rw.door = k.dataset.door; keys('data-door', rw.door);
      var d = rwD.querySelector('.kpm-doors'); if (d) d.dataset.look = rw.door;
      rwM.textContent = 'Door look ' + k.textContent.trim() + ': press the big button to see it close.';
    }); });
    document.querySelectorAll('[data-rw]').forEach(`],
]);
rep('new.html', [
  [`      <button class="key" type="button" data-rw="B" aria-pressed="true">Your pick · Box + 3D chest</button>
    </div>`, `      <button class="key" type="button" data-rw="B" aria-pressed="true">Your pick · Box + 3D chest</button>
    </div>
    <div class="bar" role="group" aria-label="Blast door look">
      <button class="key" type="button" data-door="today" aria-pressed="false">Doors: today</button>
      <button class="key" type="button" data-door="d1" aria-pressed="true">1 · Hazard seam</button>
      <button class="key" type="button" data-door="d2" aria-pressed="false">2 · Ribbed steel</button>
      <button class="key" type="button" data-door="d3" aria-pressed="false">3 · Stone</button>
    </div>`],
]);
fs.appendFileSync(path.join(HERE, 'new.css'), `
  /* THE BLAST DOORS, three quieter looks (his "too norak ... minimalist but cool but still shows that it is quarantine
     blast door"). Same two doors, same timing. The hazard lives only at the SEAM - where the doors meet - so a shut door
     still reads as quarantine at a glance, and the rest is plain material. Going back (steel) wears no hazard at all. */
  .kpm-doors[data-look="d1"] i, .kpm-doors[data-look="d2"] i, .kpm-doors[data-look="d3"] i { border: 0; }
  .kpm-doors[data-look] i::before, .kpm-doors[data-look] i::after { content: none; }
  /* 1 - hazard seam: dark steel, a narrow tape strip on each door's meeting edge, and a yellow stamp with the sign
     that closes into one round seal when the doors meet */
  .kpm-doors[data-look="d1"] i { background: linear-gradient(90deg, #202325, #2C3033 50%, #202325); }
  .kpm-doors[data-look="d1"] i::after { content: ""; position: absolute; top: 0; bottom: 0; width: 6px; background: repeating-linear-gradient(-45deg, #F2C318 0 5px, #141414 5px 10px); }
  .kpm-doors[data-look="d1"] .dl::after { right: 0; } .kpm-doors[data-look="d1"] .dr::after { left: 0; }
  .kpm-doors[data-look="d1"][data-kind="tape"] i::before { content: ""; position: absolute; z-index: 1; top: calc(50% - 22px); width: 22px; height: 44px; background: var(--sign-img) 0 0 / 44px 44px no-repeat, #F2C318; }
  .kpm-doors[data-look="d1"][data-kind="tape"] .dl::before { right: 0; border-radius: 22px 0 0 22px; }
  .kpm-doors[data-look="d1"][data-kind="tape"] .dr::before { left: 0; border-radius: 0 22px 22px 0; background-position: -22px 0, 0 0; }
  .kpm-doors[data-look="d1"][data-kind="steel"] i::after { background: #1C2E2F; width: 4px; }
  /* 2 - ribbed steel: fine horizontal ribs, ONE yellow line down the seam, a small square stamp at its middle */
  .kpm-doors[data-look="d2"] i { background: repeating-linear-gradient(180deg, #34383B 0 9px, #2A2D30 9px 10px); }
  .kpm-doors[data-look="d2"] i::after { content: ""; position: absolute; top: 0; bottom: 0; width: 2px; background: #F2C318; }
  .kpm-doors[data-look="d2"] .dl::after { right: 0; } .kpm-doors[data-look="d2"] .dr::after { left: 0; }
  .kpm-doors[data-look="d2"][data-kind="tape"] i::before { content: ""; position: absolute; z-index: 1; top: calc(50% - 15px); width: 15px; height: 30px; background: var(--sign-img) 0 0 / 30px 30px no-repeat, #F2C318; }
  .kpm-doors[data-look="d2"][data-kind="tape"] .dl::before { right: 0; } .kpm-doors[data-look="d2"][data-kind="tape"] .dr::before { left: 0; background-position: -15px 0, 0 0; }
  .kpm-doors[data-look="d2"][data-kind="steel"] i::after { background: #3E6A6C; width: 1px; }
  /* 3 - stone: the box's own grey with a bevel, like the squares; a narrow tape seam, no sign - the quietest */
  .kpm-doors[data-look="d3"] i { background: #7C7C7C; border: 3px solid; border-color: #A8A8A8 #555555 #555555 #A8A8A8; }
  .kpm-doors[data-look="d3"] i::after { content: ""; position: absolute; top: 0; bottom: 0; width: 5px; background: repeating-linear-gradient(-45deg, #F2C318 0 4px, #141414 4px 8px); }
  .kpm-doors[data-look="d3"] .dl::after { right: 0; } .kpm-doors[data-look="d3"] .dr::after { left: 0; }
  .kpm-doors[data-look="d3"][data-kind="steel"] i::after { content: none; }
`);
console.log('doors patched');
