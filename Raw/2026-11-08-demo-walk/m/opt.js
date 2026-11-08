/* a guide picker (data-guide = KEY): what its list shows on the phone, and a real tap on the option matching WANT */
const box = document.querySelector('[data-guide="KEY"]'); if (!box) return 'no KEY box';
const opts = [...box.querySelectorAll('button,[role="option"],li')].filter(vis);
const br = box.getBoundingClientRect();
const list = opts.map((o) => { const r = o.getBoundingClientRect(); return { t: o.innerText.trim().replace(/\n+/g, ' ').slice(0, 50), top: Math.round(r.top), bottom: Math.round(r.bottom) }; });
const want = opts.find((o) => /WANT/i.test(o.innerText));
if (!want) return { box: [Math.round(br.top), Math.round(br.bottom)], list, noMatch: true };
const offBefore = want.getBoundingClientRect().bottom > innerHeight;
want.scrollIntoView({ block: 'nearest' }); await sleep(400);
const r = want.getBoundingClientRect();
return { box: [Math.round(br.top), Math.round(br.bottom)], list: list.slice(0, 8), optionWasBelowScreen: offBefore, tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)] };
