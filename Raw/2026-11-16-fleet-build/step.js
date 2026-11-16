/* his "add button where i can increase the add button by 1 or by 10": press "1 Bks", + twice; press "1 Slop", + once;
   read the first product's box after each, and the remembered pick. Clears the line at the end (− back to 0). */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const keys = [...document.querySelectorAll('.kpm-fleet-step button')];
if (keys.length !== 2) return 'no step keys: ' + keys.length;
const line = [...document.querySelectorAll('.kpm-fleet-panel .kpm-fleet-line:not(.kpm-fleet-linehead)')].find((l) => (+(l.querySelector('.c')?.innerText || '0').replace(/\./g, '')) > 50);
const plus = line.querySelector('[data-guide="load-plus"]'), minus = line.querySelector('[aria-label$=": less"]'), box = line.querySelector('input');
const read = () => +(box.value || 0);
const out = { line: line.querySelector('.n b').innerText, start: read() };
keys[0].click(); await sleep(120); out.picked1 = keys.map((k) => k.getAttribute('aria-pressed'));
plus.click(); await sleep(80); plus.click(); await sleep(120); out.after2x1 = read();
keys[1].click(); await sleep(120); out.picked2 = keys.map((k) => k.getAttribute('aria-pressed'));
plus.click(); await sleep(120); out.afterSlop = read();
out.stored = localStorage.getItem('kpm-load-step');
keys[0].click(); await sleep(80); for (let i = 0; i < 12 && read() > 0; i++) { minus.click(); await sleep(60); }
out.cleared = read();
const r = document.querySelector('.kpm-fleet-step').getBoundingClientRect(); out.box = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
return out;
