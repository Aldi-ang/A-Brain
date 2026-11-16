/* open window.__who's panel if none is open (default BAGUS), then press the panel tab named window.__tab; report what it shows */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!document.querySelector('.kpm-fleet-panel')) {
    const want = (window.__who || 'BAGUS').toUpperCase();
    [...document.querySelectorAll('.kpm-fleet-row')].find((e) => e.innerText.toUpperCase().includes(want))?.click();
    await sleep(1200);
}
const t = [...document.querySelectorAll('.kpm-fleet-tabs button')].find((b) => b.innerText.trim().toLowerCase().startsWith((window.__tab || 'Return').toLowerCase()));
if (!t) return 'no tab ' + window.__tab + ' among ' + [...document.querySelectorAll('.kpm-fleet-tabs button')].map((b) => b.innerText).join(',');
t.click(); await sleep(500);
const body = document.querySelector('.kpm-fleet-body');
return { tab: t.innerText, body: body?.innerText.replace(/\s+/g, ' ').slice(0, 420), foot: document.querySelector('.kpm-fleet-foot')?.innerText.replace(/\s+/g, ' ') || 'no foot',
    overflowX: document.documentElement.scrollWidth > innerWidth };
