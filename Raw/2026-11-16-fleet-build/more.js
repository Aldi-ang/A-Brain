/* phone: press More - the person keys must open under the head, every one a real key; press again closes */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const more = document.querySelector('.kpm-fleet-more');
if (!more) return 'no More key';
const acts = () => document.querySelector('.kpm-fleet-acts');
const shown = () => { const r = acts().getBoundingClientRect(); return r.height > 0 ? [Math.round(r.top), Math.round(r.height)] : 'hidden'; };
const before = shown(); more.click(); await sleep(300);
const open = shown(), keys = [...acts().querySelectorAll('button')].map((b) => b.innerText.trim() || b.getAttribute('aria-label'));
const r = more.getBoundingClientRect();
return { before, open, keys, expanded: more.getAttribute('aria-expanded'), moreKey: [Math.round(r.width), Math.round(r.height)] };
