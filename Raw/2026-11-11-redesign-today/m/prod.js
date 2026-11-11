const out = [];
for (const h of [...document.querySelectorAll('h3, h4')].filter(vis)) {
  let c = h.parentElement; for (let i = 0; i < 6 && c && !c.querySelector('img'); i++) c = c.parentElement;
  if (!c) continue; const img = c.querySelector('img');
  out.push({ name: h.innerText.trim().replace(/\s+/g, ' '), text: c.innerText.replace(/\n+/g, ' | ').slice(0, 160), src: img.src });
  if (out.length >= 8) break;
}
return out;
