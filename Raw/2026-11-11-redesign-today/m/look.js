await sleep(2500);
return { gate: !!document.querySelector('input[placeholder="MASTER PASSWORD"]'), title: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText.trim()).slice(0, 4),
  btns: [...document.querySelectorAll('button')].filter(vis).map((b) => (b.getAttribute('aria-label') || b.innerText || '').trim().replace(/\n+/g, ' ').slice(0, 28)).filter(Boolean).slice(0, 40),
  marks: [...document.querySelectorAll('[data-mark]')].map((e) => e.getAttribute('data-mark') + (vis(e) ? '' : '(h)')).slice(0, 40),
  font: document.fonts.check('700 13px Rajdhani'), hover: matchMedia('(hover: none)').matches, w: innerWidth, stat: stat() };
