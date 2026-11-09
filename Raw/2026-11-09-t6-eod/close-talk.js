/* the capybara's greeting: tap through it to its end, then close (the mission line stays) */
for (let i = 0; i < 12; i++) {
  const ct = document.querySelector('.kpm-ct'); if (!ct) break;
  const x = [...ct.querySelectorAll('button')].find((b) => /tutup|close|nanti|lewati|skip/i.test((b.getAttribute('aria-label') || b.innerText).trim()));
  if (x) { x.click(); await sleep(500); continue; }
  const c = ct.querySelectorAll('.choices button'); if (c.length) { c[c.length - 1].click(); await sleep(500); continue; }
  ct.querySelector('.box')?.click(); await sleep(450);
}
return { talkLeft: !!document.querySelector('.kpm-ct'), guide: cap() };
