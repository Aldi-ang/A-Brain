/* does Fleet's own Surat Jalan overlay (fixed inset-0 z-[500], inside the same z-10 box) open with its top under the demo bars? */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!document.querySelector('.kpm-fleet-panel')) { [...document.querySelectorAll('.kpm-fleet-row')].find((e) => /BAGUS/i.test(e.innerText))?.click(); await sleep(900); }
const k = [...document.querySelectorAll('.kpm-fleet-panel button')].find((b) => /Surat Jalan/.test(b.innerText));
if (!k) return 'no Surat Jalan key';
k.click(); await sleep(1200);
const ov = [...document.querySelectorAll('div')].filter((d) => /\bfixed\b/.test(d.className) && /\binset-0\b/.test(d.className) && d.getBoundingClientRect().height > 300).pop();
if (!ov) return 'no overlay';
const kids = [...ov.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.height > 10 && r.width > 40 && e.children.length === 0 && e.innerText?.trim(); });
const top = kids.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top).slice(0, 3).map((e) => {
    const r = e.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + r.height / 2);
    return { text: e.innerText.trim().slice(0, 30), top: Math.round(r.top), mine: ov.contains(hit), hit: hit ? String(hit.className).slice(0, 30) : null };
});
const out = { cls: ov.className.slice(0, 60), parent: ov.parentElement === document.body ? 'body' : 'in app', top };
document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
const close = [...ov.querySelectorAll('button')].find((b) => /close|tutup|×|✕/i.test(b.getAttribute('aria-label') || b.innerText));
close?.click(); await sleep(300);
out.closed = !document.body.contains(ov);
return out;
