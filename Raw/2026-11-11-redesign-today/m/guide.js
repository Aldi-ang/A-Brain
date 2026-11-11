const seen = [];
for (let i = 0; i < 14; i++) {
  const own = any(/coba sendiri|try it myself|sendiri/i)[0]; if (own) { seen.push('OWN:' + own.innerText.trim()); own.click(); await sleep(1500); break; }
  const nx = any(/^LANJUT/i)[0]; if (!nx) break; seen.push(document.querySelector('.kpm-ct p')?.innerText?.slice(0, 50)); nx.click(); await sleep(900);
}
await sleep(1200);
return { seen, talk: !!document.querySelector('.kpm-ct'), mission: document.querySelector('.kpm-mission')?.innerText.replace(/\n+/g, ' / ').slice(0, 120),
  btns: [...document.querySelectorAll('button')].filter(vis).map((b) => (b.getAttribute('aria-label') || b.innerText || '').trim().replace(/\n+/g, ' ').slice(0, 28)).filter(Boolean).slice(0, 14) };
