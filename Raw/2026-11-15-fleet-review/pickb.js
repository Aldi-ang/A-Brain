/* pick the person whose card name matches window.__who (default the first card), as a tap does */
const want = 'BAGUS';
const cards = [...document.querySelectorAll('.kpm-actor')];
const c = want ? cards.find((e) => (e.querySelector('.who')?.innerText || '').toUpperCase().includes(want)) : cards[0];
if (!c) return 'no card ' + want + ' among ' + cards.map((e) => e.querySelector('.who')?.innerText).join(',');
const t0 = performance.now();
c.click();
await new Promise((r) => setTimeout(r, 2500));
const bar = document.querySelector('.kpm-stage-bar');
return { picked: c.querySelector('.who')?.innerText, ms: Math.round(performance.now() - t0), bar: bar?.innerText.replace(/\s+/g, ' ').slice(0, 300) };
