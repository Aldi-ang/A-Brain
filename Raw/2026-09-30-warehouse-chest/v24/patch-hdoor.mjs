// v26 - the HEALTHY blast door (the doors that shut when the box goes back to the healthy stock). His 2026-09-30 09:25:
// "make the blast door for healthy goods special, design it so that it look kinda realistic and more beautiful the rest
// is great". Three looks on keys (Healthy 1 / 2 / 3); pressing one shows it SHUT and holds it, so it can be looked at
// (in the run it is shut for ~0.4 s). Realism from real blast doors: interlocking teeth at the seam, reinforcement
// bands with bolts, brushed metal, a lock at the seam - all gradients and borders, no shadow, no glow.
// The lock now rides on the LEFT door (its teeth overlap the right door), so the left door also travels 30 px further.
// Runs after patch-isle.mjs, on LF files.
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
    <div class="bar" role="group" aria-label="Healthy door look - press one to see it shut">
      <button class="key" type="button" data-hl="h1" aria-pressed="true">Healthy 1 · Ender vault</button>
      <button class="key" type="button" data-hl="h2" aria-pressed="false">Healthy 2 · Vault wheel</button>
      <button class="key" type="button" data-hl="h3" aria-pressed="false">Healthy 3 · Quiet ender</button>
    </div>
`],
]);

rep('new.js', [
  ["door: 'd1' }", "door: 'd1', hl: 'h1' }"],
  ["d.dataset.kind = toQ ? 'tape' : 'steel'; d.dataset.look = rw.door;", "d.dataset.kind = toQ ? 'tape' : 'steel'; d.dataset.look = rw.door; d.dataset.hl = rw.hl;"],
  ["A(L, [{ transform: 'translateX(-101%)' }, { transform: 'translateX(0)' }]", "A(L, [{ transform: 'translateX(calc(-101% - 30px))' }, { transform: 'translateX(0)' }]"],
  ["A(L, [{ transform: 'translateX(0)' }, { transform: 'translateX(-101%)' }]", "A(L, [{ transform: 'translateX(0)' }, { transform: 'translateX(calc(-101% - 30px))' }]"],
  ['    function flipRW() {\n      if (rw.busy) return;', '    function flipRW() {\n      if (rw.busy) return;\n      hold(false);'],
  ["    document.querySelectorAll('[data-rw]').forEach(", `    /* a Healthy key shows that door SHUT and holds it (the run shows it for ~0.4 s); the big button opens it again */
    function hold(on) {
      var d = rwD.querySelector('.kpm-doors'); if (!d) return;
      var L = d.children[0], R = d.children[1];
      if (on) { d.dataset.kind = 'steel'; d.dataset.look = rw.door; d.dataset.hl = rw.hl; d.dataset.hold = '1'; L.style.transform = R.style.transform = 'translateX(0)'; }
      else if (d.dataset.hold) { delete d.dataset.hold; delete d.dataset.kind; L.style.transform = R.style.transform = ''; }
    }
    document.querySelectorAll('[data-hl]').forEach(function (k) { k.addEventListener('click', function () {
      if (rw.busy || rw.opt !== 'B') return;
      rw.hl = k.dataset.hl; keys('data-hl', rw.hl);
      if (!rw.open) document.getElementById('rwChest').click();
      hold(false); void rwD.offsetWidth; hold(true);
      rwM.textContent = k.textContent.trim() + ': the healthy door, held shut so you can look. Press the big button to open it.';
    }); });
    document.querySelectorAll('[data-rw]').forEach(`],
  ["The cost you took: the age list", "The healthy door (going back from the Quarantine) has three looks on the <b>Healthy</b> keys - press one to see it shut; my pick 1. The cost you took: the age list"],
]);

/* the interlocking teeth: N teeth down the left door's meeting edge, drawn as a clip-path so they cut into the right door */
const N = 12, pts = [], sock = [];
for (let k = 0; k < N; k++) pts.push(`0 ${(k * 100 / N).toFixed(3)}%`, `100% ${((k + .5) * 100 / N).toFixed(3)}%`);
pts.push('0 100%');
const TEETH = `polygon(${pts.join(', ')})`;
/* the right door's own edge is the teeth's mirror (sockets), so apart the two doors show real interlocking edges */
const A0 = 'calc(100% / 50.5)', A1 = 'calc(100% / 50.5 + 14px)';
for (let k = 0; k < N; k++) sock.push(`${A0} ${(k * 100 / N).toFixed(3)}%`, `${A1} ${((k + .5) * 100 / N).toFixed(3)}%`);
const SOCKETS = `polygon(${sock.join(', ')}, ${A0} 100%, 100% 100%, 100% 0)`;
const H = '.kpm-doors[data-kind="steel"]';
const BOLTS = (c, r) => [12, 50, 88].flatMap(x => [22, 78].map(y => `radial-gradient(circle at ${x}% ${y}%, ${c} 0 2px, ${r} 2.6px 3.6px, transparent 4.2px)`)).join(', ');
const css = `
  /* v26 - THE HEALTHY BLAST DOOR, three looks (his "special ... kinda realistic and more beautiful"). Shared: the left
     door carries interlocking TEETH, the right door's edge is their mirror (sockets, a 2 px dark edge along them), and
     the LOCK at the seam; the left door sits above the right. Only while going back to healthy (data-kind steel). */
  .kpm-doors .dl { transform: translateX(calc(-101% - 30px)); }
  ${H}[data-hl] i { border: 0; }
  ${H}[data-hl] .dl { z-index: 1; }
  ${H}[data-hl] .dl::after { content: ""; position: absolute; z-index: 1; top: 0; bottom: 0; left: auto; right: -14px; width: 14px; height: auto; border: 0; clip-path: ${TEETH}; }
  ${H}[data-hl] .dr { clip-path: ${SOCKETS}; }
  /* the teeth shape again, 2 px to the right and inside the right door's clip: only a 2 px dark edge along the sockets shows */
  ${H}[data-hl] .dr::after { content: ""; position: absolute; top: 0; bottom: 0; left: calc(100% / 50.5 + 2px); right: auto; width: 14px; height: auto; border: 0; clip-path: ${TEETH}; }
  ${H}[data-hl] .dr::before { content: none; }
  ${H}[data-hl] .dl::before { content: ""; position: absolute; z-index: 2; left: auto; right: -27px; top: calc(50% - 27px); width: 54px; height: 54px; box-sizing: border-box; border-radius: 50%; }

  /* 1 - ENDER VAULT: dark ender steel, brushed, two reinforcement bands with bolts, a few ender specks; teeth lit on
     their faces; the lock is a living-looking ender eye in a chrome ring (the same eye as the button's dome) */
  ${H}[data-hl="h1"] i { background:
      ${BOLTS('#6E8C8D', '#050808')},
      linear-gradient(180deg, transparent 19%, #3A5A5B 19% calc(19% + 2px), #16292A calc(19% + 2px) calc(19% + 12px), #050808 calc(19% + 12px) calc(19% + 14px), transparent calc(19% + 14px) 74%, #3A5A5B 74% calc(74% + 2px), #16292A calc(74% + 2px) calc(74% + 12px), #050808 calc(74% + 12px) calc(74% + 14px), transparent calc(74% + 14px)),
      radial-gradient(circle at 34% 44%, rgba(150, 70, 200, .5) 0 1.4px, transparent 2.2px), radial-gradient(circle at 70% 62%, rgba(150, 70, 200, .4) 0 1.4px, transparent 2.2px), radial-gradient(circle at 22% 90%, rgba(150, 70, 200, .45) 0 1.4px, transparent 2.2px),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 4px),
      linear-gradient(90deg, #0E1818, #1C2E2F 46%, #22393A 56%, #142223); }
  ${H}[data-hl="h1"] .dl::after { background: linear-gradient(90deg, #2E4C4D, #1C2E2F); }
  ${H}[data-hl="h1"] .dr::after { background: #030505; }
  ${H}[data-hl="h1"] .dl::before { border: 2px solid #050808;
    background: radial-gradient(circle at 40% 34%, rgba(255, 255, 255, .75) 0 4%, transparent 8%),
      radial-gradient(ellipse 9% 30% at 50% 50%, #04170F 0 88%, transparent 100%),
      radial-gradient(circle at 50% 50%, #8AF0B8 0 22%, #2FA06E 36%, #135A3D 52%, #06241A 60%, transparent 61%),
      conic-gradient(from 215deg, #FFFFFF, #8A8A8A 16%, #E8E8E8 30%, #5A5A5A 48%, #D6D6D6 64%, #767676 80%, #FFFFFF); }

  /* 2 - VAULT WHEEL: polished brushed steel, two panel grooves, bolts; the lock is a bank-vault wheel that turns a
     quarter as the doors lock */
  ${H}[data-hl="h2"] i { background:
      ${BOLTS('#F2F2F2', '#4A4A4A')},
      linear-gradient(180deg, transparent 33%, #5A5A5A 33% calc(33% + 2px), #EDEDED calc(33% + 2px) calc(33% + 3px), transparent calc(33% + 3px) 66%, #5A5A5A 66% calc(66% + 2px), #EDEDED calc(66% + 2px) calc(66% + 3px), transparent calc(66% + 3px)),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, .09) 0 1px, rgba(0, 0, 0, .05) 1px 2px, transparent 2px 3px),
      linear-gradient(90deg, #7E7E7E, #C6C6C6 42%, #D6D6D6 52%, #9C9C9C); }
  ${H}[data-hl="h2"] .dl::after { background: linear-gradient(90deg, #DADADA, #A4A4A4); }
  ${H}[data-hl="h2"] .dr::after { background: #3A3A3A; }
  ${H}[data-hl="h2"] .dl::before { width: 58px; height: 58px; right: -29px; top: calc(50% - 29px); border: 2px solid #1E1E1E;
    background: radial-gradient(circle at 44% 40%, #FFFFFF 0 4%, #D2D2D2 10%, #7A7A7A 17%, #2A2A2A 18% 20%, transparent 21%),
      radial-gradient(circle, transparent 0 60%, #1E1E1E 61%, #BDBDBD 63.5%, #F4F4F4 67%, #A8A8A8 71%, #505050 75%, #1E1E1E 76.5%, transparent 77.5%),
      radial-gradient(circle, transparent 0 81%, #1A1A1A 81.5%, #C8C8C8 84%, #EFEFEF 88%, #9A9A9A 94%, #4A4A4A 99%),
      repeating-conic-gradient(from -8deg, #E2E2E2 0 7deg, #8C8C8C 7deg 16deg, transparent 16deg 120deg),
      radial-gradient(circle, #34383B 0 50%, #1C1E20 81%);
    animation: hWheel .5s cubic-bezier(.3, 1.3, .5, 1) .2s both; }
  @keyframes hWheel { from { transform: rotate(-95deg); } to { transform: rotate(0deg); } }

  /* 3 - QUIET ENDER: plain ender steel, a straight seam of ender specks, a small ender eye - the quietest */
  ${H}[data-hl="h3"] i { background: linear-gradient(90deg, #111C1C, #1C2E2F 50%, #142223); }
  ${H}[data-hl="h3"] .dl::after { clip-path: none; right: -2px; width: 4px; background: radial-gradient(circle, #B44CF0 0 1.5px, transparent 2.2px) 0 0 / 4px 16px, #0A1011; }
  ${H}[data-hl="h3"] .dr::after { content: none; }
  ${H}[data-hl="h3"] .dr { clip-path: none; }
  ${H}[data-hl="h3"] .dl::before { width: 34px; height: 34px; right: -17px; top: calc(50% - 17px); border: 2px solid #050808;
    background: radial-gradient(ellipse 12% 34% at 50% 50%, #04170F 0 88%, transparent 100%), radial-gradient(circle, #8AF0B8 0 26%, #2FA06E 50%, #135A3D 72%); }
`;
fs.appendFileSync(path.join(HERE, 'new.css'), css);
console.log('healthy doors patched; teeth', N);
