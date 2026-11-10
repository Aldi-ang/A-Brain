/* press LANJUT on the capybara's welcome until it is gone (or a choice appears) */
const seen = [];
for (let i = 0; i < 20; i++) {
  const ct = document.querySelector('.kpm-ct'); if (!ct || !vis(ct)) break;
  seen.push(ct.querySelector('p')?.innerText.slice(0, 70));
  const b = [...ct.querySelectorAll('button')].filter(vis);
  const next = b.find((x) => /lanjut|tutup|selesai|nanti|lewati|skip|ok/i.test(x.innerText)) || b[b.length - 1] || ct;
  next.click(); await sleep(700);
}
return { seen, left: !!document.querySelector('.kpm-ct') && vis(document.querySelector('.kpm-ct')) };
