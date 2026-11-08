const out = [];
for (let step = 0; step < 6; step++) {
  const btns = () => [...document.querySelectorAll('button')].filter(vis);
  const verdict = btns().find((b) => /^(Less|Not yet)$/i.test(b.innerText.trim()));
  if (verdict) { verdict.click(); await sleep(700); const on = btns().find((b) => b.innerText.trim() === verdict.innerText.trim());
    on.scrollIntoView({ block: 'center' }); await sleep(400); const r = on.getBoundingClientRect();
    return { found: on.innerText.trim(), plate: on.className.includes('danger-plate'), bg: getComputedStyle(on).backgroundColor, ink: getComputedStyle(on).color, rect: [r.left, r.top, r.width, r.height].map(Math.round), out }; }
  const input = [...document.querySelectorAll('input')].find((i) => vis(i) && !i.disabled && !i.value);
  if (input) { set(input, '0'); await sleep(400); }
  const next = btns().find((b) => !b.disabled && /^(Next|Lanjut|Continue|Confirm|Simpan|Save|Done|OK)\b|→|›|^Put /i.test(b.innerText.trim()));
  out.push({ step, input: !!input, next: next?.innerText.trim().slice(0, 30), heads: [...document.querySelectorAll('h3,h4')].filter(vis).map((h) => h.innerText.trim().slice(0, 30)).slice(0, 4) });
  if (!next) break; next.click(); await sleep(1500);
}
return { out, btns: [...document.querySelectorAll('button')].filter(vis).map((b) => b.innerText.trim().replace(/\n+/g, ' ').slice(0, 30)).filter(Boolean).slice(0, 30) };
