const cs = getComputedStyle(document.documentElement);
const tok = {}; for (const n of ['--ground', '--surface', '--surface-2', '--surface-3', '--ink', '--ink-muted', '--ink-faint', '--gold', '--line', '--line-2', '--line-3', '--rust', '--danger', '--plate', '--lamp', '--paper', '--cream']) tok[n] = cs.getPropertyValue(n).trim();
const imgs = [...document.querySelectorAll('img')].filter(vis).map((i) => ({ alt: i.alt, src: i.src.slice(0, 90), len: i.src.length, w: i.naturalWidth, h: i.naturalHeight })).slice(0, 14);
const cards = [...document.querySelectorAll('h3, h4')].filter(vis).map((h) => h.innerText.trim()).slice(0, 20);
const body = getComputedStyle(document.body);
return { tok, imgs, cards, bodyFont: body.fontFamily, bodyBg: body.backgroundColor, text: document.querySelector('main')?.innerText.replace(/\n+/g, ' | ').slice(0, 900) };
