// v24 - his 2026-09-30 answers on v23: "door 1 looks cool but make sure that the logo is gone after its open", "add some
// background for this panel sc1, so that the ender chest is little bit more visible maybe just make some ender minecraft
// kinda background theme", "for the quarantine vault make sure that there is animation when swapping between chest for
// the inventory box". Reference (minecraft.wiki/w/The_End): a dark, void-like dimension; the starless sky is a static
// pattern, slightly purple; islands of End stone; purple ender particles.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const rep = (file, pairs) => {
  let t = fs.readFileSync(path.join(HERE, file), 'utf8');
  for (const [a, b, all] of pairs) {
    const n = t.split(a).length - 1;
    if (n === 0 || (!all && n !== 1)) throw new Error(`${file}: anchor ${n}x: ${a.slice(0, 70)}`);
    t = all ? t.split(a).join(b) : t.replace(a, b);
  }
  fs.writeFileSync(path.join(HERE, file), t);
};

rep('new.js', [
  /* 1. the seal leaves with its door: the right door travels 30 px further (the seal overhangs its left edge by 24), and
        the door face is cleared once the doors are open */
  ["A(R, [{ transform: 'translateX(101%)' }, { transform: 'translateX(0)' }], { duration: 240, easing: IN, fill: 'forwards' })",
   "A(R, [{ transform: 'translateX(calc(101% + 30px))' }, { transform: 'translateX(0)' }], { duration: 240, easing: IN, fill: 'forwards' })"],
  ["A(R, [{ transform: 'translateX(0)' }, { transform: 'translateX(101%)' }], { duration: 340, easing: OUT, fill: 'forwards' })",
   "A(R, [{ transform: 'translateX(0)' }, { transform: 'translateX(calc(101% + 30px))' }], { duration: 340, easing: OUT, fill: 'forwards' })"],
  ["      all.forEach(function (a) { a.cancel(); });\n    }\n    /* the sign as an image", "      all.forEach(function (a) { a.cancel(); });\n      delete d.dataset.kind;   /* open = no door face at all: the seal never lingers at the edge */\n    }\n    /* the sign as an image"],
  /* 2. the End scene behind the ender chest: particles in the scene, an End stone island under the chest */
  [`<span class="capt">Gudang BANDUNG<small>642 Bks · 16 in Quarantine</small></span></button>';`,
   `<span class="isle" aria-hidden="true"></span><span class="capt">Gudang BANDUNG<small>642 Bks · 16 in Quarantine</small></span></button>';
    var MOTES = '<span class="endmotes" aria-hidden="true">' + Array.from({ length: 10 }, function (_, i) { return '<i style="--mx:' + (8 + (i * 37) % 84) + '%;--md:' + (5 + (i % 4) * 1.3).toFixed(1) + 's;--mdl:-' + (i * 0.9).toFixed(1) + 's"></i>'; }).join('') + '</span>';`],
  [`'<div class="wh2"><div class="sbx" id="rwBox">' + stage + deck + '</div>' + ENDER + '</div>'`,
   `'<div class="wh2">' + MOTES + '<div class="sbx" id="rwBox">' + stage + deck + '</div>' + ENDER + '</div>'`],
  /* 3. the Quarantine Vault: switching crates, the box shuts into the old crate and grows out of the new one */
  [`    function syncCrates() {`, `    function boxSwap(prevFac) {
      var holder = document.getElementById('soBelow'), html = below();
      if (!holder.querySelector('.sbx') || still()) { holder.innerHTML = html; return; }
      var ox = function (k) { var c = soV.querySelector('.crates .chestCell[data-fac="' + k + '"]'), r = c.getBoundingClientRect(), h = holder.getBoundingClientRect(); return Math.round(r.left + r.width / 2 - h.left) + 'px 0'; };
      holder.style.transformOrigin = ox(prevFac);
      var a = holder.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.08) translateY(-24px)', opacity: 0 }], { duration: 170, easing: IN, fill: 'forwards' });
      done(a, 170).then(function () {
        holder.innerHTML = below(); holder.style.transformOrigin = ox(so.fac);
        holder.animate([{ transform: 'scale(.08) translateY(-24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.34, 1.56, .64, 1)' });
        a.cancel();
      });
    }
    function syncCrates(prev) {`],
  [`      document.getElementById('soBelow').innerHTML = below();\n    }`,
   `      if (so.opt === 'B' && prev !== undefined && prev !== so.fac) boxSwap(prev);   /* a crate swap animates; a square pick does not */\n      else document.getElementById('soBelow').innerHTML = below();\n    }`],
  [`        so.fac = so.fac === f.k && so.opt !== 'B' ? null : f.k; so.sq = null;\n        syncCrates();`,
   `        var prev = so.fac;\n        so.fac = so.fac === f.k && so.opt !== 'B' ? null : f.k; so.sq = null;\n        syncCrates(prev);`],
]);

fs.appendFileSync(path.join(HERE, 'new.css'), `
  /* v24 - the seal leaves with its door (the right door rests 30 px further out; its seal overhangs by 24) */
  .kpm-doors .dr { transform: translateX(calc(101% + 30px)); }
  /* v24 - THE END behind the ender chest (his "some ender minecraft kinda background theme"; minecraft.wiki: a dark void,
     the starless sky a static pattern slightly purple, islands of End stone, purple ender particles). A scene of its own,
     so it stays dark in both themes; the chest stands on a pale End stone island, which is what makes the dark chest read. */
  .wh2 { position: relative; overflow: hidden; isolation: isolate; border-radius: 12px; padding: 14px 14px 18px;
    background:
      radial-gradient(40% 34% at 50% 80%, rgba(120, 60, 170, .30), transparent 70%),
      radial-gradient(circle at 20% 30%, rgba(160, 130, 200, .10) 0 1px, transparent 1.5px) 0 0 / 14px 14px,
      radial-gradient(circle at 70% 60%, rgba(160, 130, 200, .08) 0 1px, transparent 1.5px) 0 0 / 22px 22px,
      linear-gradient(180deg, #0D0914, #170F22 55%, #1E142C); }
  .wh2 .c3 { margin-bottom: 0; }
  .wh2 .chestCell { position: relative; z-index: 1; }
  .wh2 .isle { display: block; width: 176px; height: 30px; margin-top: -4px;
    background: radial-gradient(circle at 18% 40%, #C3C688 0 2px, transparent 2.6px) 0 0 / 22px 14px, radial-gradient(circle at 70% 70%, #BABD80 0 2px, transparent 2.6px) 0 0 / 30px 14px,
      linear-gradient(180deg, #E6E9AE 0 7px, #CDD092 7px 100%);
    border-top: 2px solid #F2F4C2; clip-path: polygon(0 0, 100% 0, 96% 55%, 88% 72%, 76% 80%, 64% 100%, 40% 92%, 24% 82%, 10% 68%, 4% 50%); }
  @container f (max-width: 699px) { .wh2 .isle { width: 132px; height: 24px; } }
  .wh2 .capt { color: #D9D2E6; margin-top: 6px; }
  .wh2 .capt small { color: #F0B35C; }
  .endmotes { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
  .endmotes i { position: absolute; left: var(--mx); bottom: 12%; width: 3px; height: 3px; background: #B44CF0; opacity: 0; animation: endMote var(--md) linear var(--mdl) infinite; }
  .endmotes i:nth-child(3n) { background: #D98CFF; width: 2px; height: 2px; } .endmotes i:nth-child(4n) { background: #8A3CC0; width: 4px; height: 4px; }
  @keyframes endMote { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .8; } 100% { transform: translateY(-260px); opacity: 0; } }
  .wh2 .sbx, .wh2 .chestCell { position: relative; z-index: 1; }
`);
console.log('v24 patched');
