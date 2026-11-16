/* MOTION PROOF (2026-11-16): the panel slides in ONCE per opening and never again on a − + press.
   Real clock: document.timeline.currentTime must advance, or the samples mean nothing (lesson 2026-10-25).
   Baseline = the rest state before each trigger (lesson 2026-10-03). */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(r));
const t0 = document.timeline.currentTime; await sleep(300); const clock = Math.round(document.timeline.currentTime - t0);
if (document.querySelector('.kpm-fleet-panel')) return 'close the panel first';
const rows = [...document.querySelectorAll('.kpm-fleet-row')];
const row = rows.find((e) => /BAGUS/i.test(e.innerText)), other = rows.find((e) => /BUDI/i.test(e.innerText));
const read = (el) => { const cs = getComputedStyle(el); const m = cs.transform === 'none' ? 0 : new DOMMatrix(cs.transform).m41; return [Math.round(m * 10) / 10, Math.round(cs.opacity * 100) / 100]; };

/* 1 - OPEN: sample transform x and opacity every frame for 420 ms */
row.click();
let panel = null; for (let i = 0; i < 20 && !panel; i++) { await frame(); panel = document.querySelector('.kpm-fleet-panel'); }
const openAnims = panel.getAnimations().map((a) => a.animationName);
const open = []; const s0 = performance.now();
while (performance.now() - s0 < 420) { open.push([Math.round(performance.now() - s0), ...read(panel)]); await frame(); }
const rest = panel.getBoundingClientRect(); const restBox = [Math.round(rest.left), Math.round(rest.top), Math.round(rest.width), Math.round(rest.height)];

/* 2 - FIVE PRESSES of +: the panel must be the SAME node, hold no animation, and not move a pixel */
const presses = [];
for (let i = 0; i < 5; i++) {
    const plus = document.querySelector('.kpm-fleet-panel [data-guide="load-plus"]');
    const input = plus.parentElement.querySelector('input');
    const line = plus.closest('.kpm-fleet-line').getBoundingClientRect().height;
    plus.click(); await frame(); await frame();
    const p = document.querySelector('.kpm-fleet-panel'), r = p.getBoundingClientRect();
    presses.push({ same: p === panel, panelAnims: p.getAnimations().length, x: read(p)[0], op: read(p)[1], moved: Math.round(r.left - rest.left) + Math.round(r.top - rest.top),
        value: input.value, tick: input.getAnimations().length, lineH: [Math.round(line), Math.round(plus.closest('.kpm-fleet-line').getBoundingClientRect().height)] });
    await sleep(170);
}
/* 3 - ANOTHER PERSON: one new entrance (clear first so no question is asked) */
[...document.querySelectorAll('.kpm-fleet-foot button')].find((b) => /^Clear$/.test(b.innerText.trim()))?.click(); await sleep(250);
other.click(); await sleep(60);
const p2 = document.querySelector('.kpm-fleet-panel');
const second = { newNode: p2 !== panel, anims: p2.getAnimations().map((a) => a.animationName), name: p2.querySelector('h3')?.innerText };
await sleep(500);
return { clockMs: clock, openAnims, open: open.filter((_, i) => i % 3 === 0), first: open[0], last: open[open.length - 1], restBox, presses, second, settled: read(p2) };
