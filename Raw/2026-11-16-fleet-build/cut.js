/* RED/GREEN for his "cut top panel when offers opened": press OFFERS (window.__key, default /offers/i) and ask the page
   what lies on top of the panel's title and its X - the panel itself, or a demo bar */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
document.querySelector('[data-guide="front-panel"]')?.click();
await sleep(400);
const re = window.__key || /^offers$/i;
const k = [...document.querySelectorAll('button')].find((b) => re.test((b.innerText || b.getAttribute('aria-label') || '').trim()));
if (!k) return 'no key ' + re;
k.click(); await sleep(900);
const fp = document.querySelector('[data-guide="front-panel"]');
if (!fp) return 'no front panel';
const at = (el) => { const r = el.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const hit = document.elementFromPoint(x, y);
    return { box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], mine: fp.contains(hit), hit: hit ? `${hit.tagName}.${String(hit.className).slice(0, 40)}` : null }; };
const x = fp.querySelector('button[aria-label^="Close"]'), h = fp.querySelector('h3');
const out = { key: k.innerText.trim() || k.getAttribute('aria-label'), parent: fp.parentElement === document.body ? 'body' : String(fp.parentElement.className).slice(0, 40), title: at(h), x: at(x) };
x.click(); await sleep(400);
out.closed = !document.querySelector('[data-guide="front-panel"]');
return out;
