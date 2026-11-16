/* A REAL LOAD in the lab: open window.__who (default the empty Boss Vehicle), + twice on the first product, Load van.
   Samples the In van number while it counts up, then reads what the screen says afterwards. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const want = (window.__who || 'BOSS').toUpperCase();
const row = [...document.querySelectorAll('.kpm-fleet-row')].find((e) => e.innerText.toUpperCase().includes(want));
if (!row) return 'no row ' + want;
const rowBefore = row.innerText.replace(/\s+/g, ' ');
row.click(); await sleep(1500);
const line = document.querySelector('.kpm-fleet-panel .kpm-fleet-line:not(.kpm-fleet-linehead)');
const cells = () => [...line.querySelectorAll('.c')].map((c) => c.innerText.trim());
const before = { name: line.querySelector('.n b').innerText, cells: cells(), kpis: document.querySelector('.kpm-fleet-kpis').innerText.replace(/\s+/g, ' ') };
const plus = line.querySelector('[data-guide="load-plus"]'); plus.click(); await sleep(120); plus.click(); await sleep(200);
const go = document.querySelector('.kpm-fleet-panel [data-ponder="go"]');
const key = go.innerText.replace(/\s+/g, ' ');
const panel = document.querySelector('.kpm-fleet-panel');
go.click();
const count = []; const t0 = performance.now(); let last = '';
while (performance.now() - t0 < 4000) { const v = cells()[1]; if (v !== last) { count.push([Math.round(performance.now() - t0), v]); last = v; } await new Promise((r) => requestAnimationFrame(r)); }
return { rowBefore, before, key, count: count.length > 14 ? [...count.slice(0, 7), '…', ...count.slice(-5)] : count,
    after: { cells: cells(), kpis: document.querySelector('.kpm-fleet-kpis').innerText.replace(/\s+/g, ' '), foot: document.querySelector('.kpm-fleet-foot').innerText.replace(/\s+/g, ' ') },
    samePanel: document.querySelector('.kpm-fleet-panel') === panel, panelAnims: panel.getAnimations().length,
    report: document.querySelector('.kpm-fleet-body [role="status"]')?.innerText.replace(/\s+/g, ' '),
    rowAfter: [...document.querySelectorAll('.kpm-fleet-row')].find((e) => e.innerText.toUpperCase().includes(want))?.innerText.replace(/\s+/g, ' '),
    strip: document.querySelector('.kpm-fleet-strip').innerText.replace(/\s+/g, ' '),
    toasts: [...document.querySelectorAll('[class*="toast" i], [role="status"]')].map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 170)).filter((t) => /loaded|saved|Nothing/i.test(t)).slice(0, 2) };
