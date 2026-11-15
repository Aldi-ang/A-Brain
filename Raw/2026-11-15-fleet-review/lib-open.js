/* open Fleet & Roster by its menu key; the menu first when the drawer hides it */
let k = document.querySelector('[data-mark="fleet"]');
const r = k && k.getBoundingClientRect();
if (!k || r.right <= 0 || r.left >= innerWidth || !r.width) {
    const m = [...document.querySelectorAll('button')].find((b) => /^(menu|open menu|open navigation|buka menu)$/i.test((b.getAttribute('aria-label') || b.innerText || '').trim()));
    if (!m) return 'no menu key';
    m.click(); await new Promise((s) => setTimeout(s, 900));
    k = document.querySelector('[data-mark="fleet"]');
}
if (!k) return 'no fleet key';
const t0 = performance.now();
k.click();
await new Promise((s) => setTimeout(s, 2500));
return 'pressed ' + Math.round(performance.now() - t0) + ' ms';
