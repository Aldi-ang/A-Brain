/* his pick B Surat Jalan: open it from the person keys, then report where the paper and its toolbar sit, what is on top of
   the toolbar (the demo bars must NOT be), the paper's width vs the screen (no side scroll), and the rows it prints */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!document.querySelector('.kpm-sj')) {
    const more = document.querySelector('.kpm-fleet-more'); if (more && more.getAttribute('aria-expanded') !== 'true' && more.offsetParent) { more.click(); await sleep(250); }
    const key = [...document.querySelectorAll('.kpm-fleet-acts button')].find((b) => /Surat Jalan/.test(b.innerText));
    if (!key) return 'no Surat Jalan key';
    key.click(); await sleep(600);
}
const sj = document.querySelector('.kpm-sj'), wrap = sj?.closest('.print-modal-wrapper');
if (!sj) return 'no paper';
const r = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; };
const bar = wrap.querySelector('.no-print'), bb = bar.getBoundingClientRect();
const onTop = document.elementFromPoint(bb.left + 20, bb.top + bb.height / 2);
return { parent: wrap.parentElement.tagName, paper: r(sj), bar: r(bar), barHit: bar.contains(onTop) ? 'bar' : String(onTop?.className || onTop?.tagName).slice(0, 40),
    screen: [innerWidth, innerHeight], sideScroll: document.documentElement.scrollWidth > innerWidth || wrap.scrollWidth > wrap.clientWidth,
    rows: [...sj.querySelectorAll('tbody tr')].map((t) => t.innerText.replace(/\s+/g, ' ')).slice(0, 4), foot: sj.querySelector('tfoot')?.innerText.replace(/\s+/g, ' ') };
