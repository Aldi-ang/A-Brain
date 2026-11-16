/* GUIDE STEP 3 on the new ledger (2026-11-16): for every beat, where the ring sits against the screen, what is under its
   centre, and whether pressing THAT moves the guide on. window.__go = true also presses the last beat (Load van). */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
const bar = document.querySelector('.kpm-mission');
if (!bar) return 'no mission bar';
const sheet = [...document.querySelectorAll('.kpm-demo-bar .sheet button')].find(vis); if (sheet) { document.querySelector('.kpm-demo-bar .scrim')?.click(); await sleep(400); }
const three = [...bar.querySelectorAll('button')].find((b) => /^3\b/.test(b.innerText.trim()));
if (three) { three.click(); await sleep(900); }
const log = [{ bar: bar.innerText.replace(/\s+/g, ' ').slice(0, 90) }];
for (let i = 0; i < 12; i++) {
    /* a capybara line or the "Pandu saya" key first */
    const talk = [...document.querySelectorAll('button')].filter(vis).find((b) => /^(LANJUT|Pandu saya|Saya coba sendiri)/i.test(b.innerText.trim()));
    const ring = document.querySelector('.kpm-mx-ring'), cap = document.querySelector('.kpm-mx-cap');
    if (!ring || !vis(ring)) {
        if (talk) { log.push({ talk: talk.innerText.replace(/\s+/g, ' ').slice(0, 40) }); (/(Pandu saya)/i.test(talk.innerText) ? talk : [...document.querySelectorAll('button')].filter(vis).find((b) => /Pandu saya/i.test(b.innerText)) || talk).click(); await sleep(900); continue; }
        const hint = [...bar.querySelectorAll('button')].find((b) => /PETUNJUK/i.test(b.innerText));
        if (hint && i < 3) { hint.click(); log.push({ pressed: 'PETUNJUK' }); await sleep(900); continue; }
        log.push({ end: 'no ring', bar: bar.innerText.replace(/\s+/g, ' ').slice(0, 90) }); break;
    }
    const r = ring.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + Math.min(r.height / 2, 40);
    const inView = r.left >= -2 && r.top >= -2 && r.right <= innerWidth + 2 && r.bottom <= innerHeight + 2;
    const under = document.elementsFromPoint(cx, cy).find((e) => !e.closest('.kpm-mx-ring,.kpm-mx-veil,.kpm-mx-cap'));
    const hit = under?.closest('button,[role="option"],a,input') || under;
    const say = cap?.innerText.replace(/\s+/g, ' ').slice(0, 70);
    const entry = { say, ring: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], inView, under: (hit?.getAttribute('aria-label') || hit?.innerText || hit?.tagName || '').replace(/\s+/g, ' ').slice(0, 50) };
    log.push(entry);
    if (/Load van/i.test(say || '') && !window.__go) { entry.stopped = 'before the last press'; break; }
    hit?.click(); await sleep(1600);
}
log.push({ after: bar.innerText.replace(/\s+/g, ' ').slice(0, 90), foot: document.querySelector('.kpm-fleet-foot')?.innerText.replace(/\s+/g, ' ').slice(0, 80) });
return log;
