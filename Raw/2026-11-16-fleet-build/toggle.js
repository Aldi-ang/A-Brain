/* his "when u press the name again it will close": open window.__who (default BAGUS), press the SAME row again, report;
   then sample the close: the panel's opacity + transform each frame until it is gone */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
document.getElementById('opt-css')?.remove(); document.getElementById('opt-veil')?.remove();
const want = (window.__who || 'BAGUS').toUpperCase();
const row = () => [...document.querySelectorAll('.kpm-fleet-row')].find((e) => e.innerText.toUpperCase().includes(want));
if (!document.querySelector('.kpm-fleet-panel')) { row().click(); await sleep(900); }
const open1 = !!document.querySelector('.kpm-fleet-panel');
const p = document.querySelector('.kpm-fleet-panel');
const t0 = performance.now(); row().click();
const samples = [];
while (performance.now() - t0 < 700) {
    const q = document.querySelector('.kpm-fleet-panel');
    if (!q) { samples.push([Math.round(performance.now() - t0), 'gone']); break; }
    const s = getComputedStyle(q); samples.push([Math.round(performance.now() - t0), +(+s.opacity).toFixed(2), s.transform.replace('matrix(1, 0, 0, 1, ', 'x(').slice(0, 14)]);
    await new Promise((r) => requestAnimationFrame(r));
}
const thin = samples.length > 12 ? [...samples.slice(0, 4), '…', ...samples.slice(-6)] : samples;
return { open1, samePanelBeforeClose: p === document.querySelector('.kpm-fleet-panel') || 'replaced', afterPress: !!document.querySelector('.kpm-fleet-panel'), samples: thin, frames: samples.length };
