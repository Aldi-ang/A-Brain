const m = document.querySelector('[data-mark="TAB"]'); if (!m) return { noMark: [...document.querySelectorAll('[data-mark]')].map((e) => e.getAttribute('data-mark')) };
m.click(); await sleep(4500); window.scrollTo(0, 0); await sleep(400);
return { tab: 'TAB', title: [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.innerText.trim().replace(/\n+/g, ' ')).slice(0, 5),
  font: document.fonts.check('700 13px Rajdhani'), w: innerWidth, talk: !!document.querySelector('.kpm-ct'), drawerOpen: !!document.querySelector('[aria-label="Close navigation"]'), stat: stat() };
