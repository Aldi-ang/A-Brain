const errs = []; const oe = console.error; console.error = (...a) => { errs.push(a.map(String).join(' | ').slice(0, 300)); oe(...a); };
for (let i = 0; i < 14; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; const ch = [...ct.querySelectorAll('.choices button')]; if (ch.length) ch[ch.length - 1].click(); else ct.querySelector('.box')?.click(); await sleep(700); }
document.querySelector('[data-mark="eod"]')?.click(); await sleep(4000);
const btns = [...document.querySelectorAll('button')].filter(vis).map((b) => b.innerText.trim().replace(/\n+/g, ' ').slice(0, 40)).filter(Boolean);
const heads = [...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map((h) => h.innerText.trim().slice(0, 50));
return { heads: heads.slice(0, 12), btns: btns.slice(0, 40), bounty: /Bounty/i.test(document.body.innerText), less: btns.filter((b) => /^(Less|Landed|Not yet)$/i.test(b)), errs };
