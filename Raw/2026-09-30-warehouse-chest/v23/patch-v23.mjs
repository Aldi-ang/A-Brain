// v23 - his 2026-09-30 answers on v22: "add the 3D chest in the regional warehouse and not just the inventory panel",
// "for stock opname i want option B", "use box A for quarantine inventory", "make the book little bit closer to the table".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const rep = (file, pairs) => {
  let t = fs.readFileSync(path.join(HERE, file), 'utf8');
  for (const [a, b, all] of pairs) {
    const n = t.split(a).length - 1;
    if (n === 0 || (!all && n > 1)) throw new Error(`${file}: anchor found ${n}x: ${a.slice(0, 70)}`);
    t = all ? t.split(a).join(b) : t.replace(a, b);
  }
  fs.writeFileSync(path.join(HERE, file), t);
};

rep('new.js', [
  ["var rw = { opt: 'A', view: 'ok', busy: false, hp: false }", "var rw = { opt: 'B', view: 'ok', busy: false, hp: false, open: true }"],
  [`'</span></p><i class="kpm-qband' + (q ? ' tape' : '') + '" aria-hidden="true"></i>';`,
   `'</span></p>' + (q && rw.opt === 'B' ? '' : '<i class="kpm-qband' + (q ? ' tape' : '') + '" aria-hidden="true"></i>');   /* look A: in B the tape rim replaces the band */`],
  [`rwD.innerHTML = NAV + '<div class="dbody">' + (rw.opt === 'B' ? '<div class="sbx">' + stage + deck + '</div>' : stage + deck) + '</div>';`,
   `rw.open = true;
      rwD.innerHTML = NAV + '<div class="dbody">' + (rw.opt === 'B' ? '<div class="wh2"><div class="sbx" id="rwBox">' + stage + deck + '</div>' + ENDER + '</div>' : stage + deck) + '</div>';`],
  [`stc.innerHTML = stageInner(); stg.classList.toggle('isq', toQ);`,
   `stc.innerHTML = stageInner(); stg.classList.toggle('isq', toQ);
        var bx = document.getElementById('rwBox'); if (bx) bx.classList.toggle('lkA', toQ);`],
  [`rwD.addEventListener('click', function (e) {
      if (e.target.closest('.kpm-hatch')) return flipRW();`,
   `rwD.addEventListener('click', function (e) {
      if (e.target.closest('#rwChest')) {
        rw.open = !rw.open;
        var ch = document.getElementById('rwChest'); ch.classList.toggle('on', rw.open); ch.setAttribute('aria-expanded', String(rw.open));
        document.getElementById('rwBox').classList.toggle('shut', !rw.open);
        rwM.textContent = rw.open ? 'You opened the ender chest: its box stands on it again.' : 'You closed the ender chest: its box folds into the lid, and nothing under it moves.';
        return;
      }
      if (e.target.closest('.kpm-hatch')) return flipRW();`],
  [`var NAV = '<div class="dnav">`,
   `var ENDER = '<button type="button" class="chestCell on" id="rwChest" aria-expanded="true" aria-label="Ender chest Gudang BANDUNG - open or close"><span class="c3 ender"><span class="cc"><i class="bf"></i><i class="bl"></i><i class="br"></i><i class="bt"></i><span class="lid3"><i class="lf"></i><i class="ll"></i><i class="lr"></i><i class="lt"></i><i class="lu"></i><i class="latch"></i></span></span></span><span class="capt">Gudang BANDUNG<small>642 Bks · 16 in Quarantine</small></span></button>';
    var NAV = '<div class="dnav">`],
  [`document.getElementById('rwRec').innerHTML = '<b>My pick: A.</b> It keeps the age list under every card (when each box arrived), which B can only show as one line when you press a square, and it changes the least on the desk you approved on 1 September. <b>B</b> is the one if you want one box everywhere: it is exactly the ender chest\\'s box from Fleet &amp; Roster. Both keep one height when you switch, so nothing under the shelf moves.';`,
   `document.getElementById('rwRec').innerHTML = '<b>Your pick: B, with the 3D ender chest under the box.</b> Press the chest to shut it: the box folds into it and keeps its room, so nothing below moves. The Quarantine view wears box <b>A</b>, the tape rim. The cost you took: the age list under each card becomes one line when you press a square.';`],
  ["var so = { opt: 'A', fac: null, sq: null, hp: false }", "var so = { opt: 'B', fac: null, sq: null, hp: false }"],
  [`'<div class="sbx"><div class="stg isq"><p class="stl">`, `'<div class="sbx lkA"><div class="stg isq"><p class="stl">`],
  [`items(f.rows.length) + '</span></p><i class="kpm-qband tape" aria-hidden="true"></i>'`, `items(f.rows.length) + '</span></p>'`],
  [`document.getElementById('soRec').innerHTML = '<b>My pick: A.</b> Every row keeps its three actions one press away, as today; the crates only replace the "All Facilities" list. <b>B</b> hides each row behind a second press (the crate, then the square), which is slower when you clear several damaged boxes in a row.';`,
   `document.getElementById('soRec').innerHTML = '<b>Your pick: B, in box A.</b> A crate opens its warehouse\\'s box inside the tape rim; press a square and its three actions open under the box. The cost you took: two presses per damaged item (the crate, then the square).';`],
]);

rep('new.html', [
  [`<button class="key" type="button" data-rw="A" aria-pressed="true">A · Shelf with the switch</button>
      <button class="key" type="button" data-rw="B" aria-pressed="false">B · The inventory box</button>`,
   `<button class="key" type="button" data-rw="B" aria-pressed="true">Your pick · Box + 3D chest</button>`],
  [`<button class="key" type="button" data-so="A" aria-pressed="true">A · Crates pick the warehouse</button>
      <button class="key" type="button" data-so="B" aria-pressed="false">B · The crate's box</button>`,
   `<button class="key" type="button" data-so="B" aria-pressed="true">Your pick · The crate's box, box A</button>`],
  [`The button and the doors are the ones you approved for Fleet &amp; Roster. <b>A</b> keeps today's cards and adds the switch. <b>B</b> turns the shelf into the same stone inventory box as the ender chest in Fleet &amp; Roster. Press the button in each.`,
   `Your pick, drawn: the shelf becomes the stone inventory box, standing on a <b>3D ender chest</b>. Press the big button to see the Quarantine (box A, the tape rim); press the chest to shut and open it.`],
  [`Every row and its three actions stay; only the way you pick a warehouse changes. <b>A</b> puts one yellow crate per warehouse where the "All Facilities" list is. <b>B</b> opens each crate's stone box, and you press a square to get its actions. Press a crate.`,
   `Your pick, drawn: one yellow crate per warehouse; a crate opens its box (box A, the tape rim), and a square gets its three actions. Press a crate, then a square.`],
]);

fs.appendFileSync(path.join(HERE, 'new.css'), `
  /* v23, his picks: the regional warehouse's box stands on a 3D ENDER chest; every quarantine box wears look A */
  .wh2 { display: grid; justify-items: center; }
  .wh2 .sbx { width: 100%; transform-origin: 50% 100%; transition: transform .26s cubic-bezier(.34, 1.56, .64, 1), opacity .12s linear; }
  .wh2 .sbx.shut { transform: scale(.08) translateY(24px); opacity: 0; visibility: hidden; transition: transform .2s ease-in, opacity .12s linear, visibility 0s linear .2s; }
  .wh2 .c3 { margin: 58px 0 20px; }   /* headroom for the open lid between the box and the chest */
  .c3.ender { --edge: #050808; --c-top: #22393A; --c-under: #0A1011;
    --c-body: radial-gradient(circle at 18% 72%, rgba(150, 70, 200, .5) 0 1.5px, transparent 2.5px), radial-gradient(circle at 64% 40%, rgba(150, 70, 200, .45) 0 1.5px, transparent 2.5px), radial-gradient(circle at 86% 80%, rgba(150, 70, 200, .5) 0 1.5px, transparent 2.5px), linear-gradient(180deg, #152223, #0C1415);
    --c-lid: radial-gradient(circle at 30% 45%, rgba(150, 70, 200, .45) 0 1.5px, transparent 2.5px), radial-gradient(circle at 76% 62%, rgba(150, 70, 200, .4) 0 1.5px, transparent 2.5px), linear-gradient(180deg, #1C2E2F, #152223); }
  .c3.ender .lid3 .latch { border-color: #050808; border-radius: 3px; background: radial-gradient(ellipse 18% 46% at 50% 50%, #06241A 0 88%, transparent 100%), radial-gradient(ellipse 50% 50% at 50% 50%, #7FE0A8 0 38%, #2FA06E 40% 78%, #135A3D 80%); }
  .sbx.lkA { border: 6px solid transparent; border-image: repeating-linear-gradient(-45deg, #F2C318 0 8px, #141414 8px 16px) 6; }
`);

rep('merge.mjs', [
  [`ench = ench.replace(h0, '<h2 class="h1">The book on an enchanting table (v6): your yes before I build</h2>');`,
   `ench = ench.replace(h0, '<h2 class="h1">The book on an enchanting table: the book lower, your yes before I build</h2>');
// his 2026-09-30 "make the book little bit closer to the table so that it dont float too high"
const f0 = 'bottom: calc(36px + var(--th) * .95 + 2px);';
must(t.indexOf(f0), 'float rule');
t = t.replace(f0, 'bottom: calc(36px + var(--th) * .95 - ' + (process.env.DROP || 16) + 'px);');`],
]);
console.log('patched');
