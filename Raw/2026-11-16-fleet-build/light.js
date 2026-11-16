/* the app's light theme and Lite Mode, read and switched the way the app keeps them (html classes) - LAB ONLY, put back by unlight.js */
const h = document.documentElement;
window.__was = h.className;
h.classList.add('lite-mode');
const before = [...h.classList].join(' ');
const themeKey = [...document.querySelectorAll('button')].find((b) => /theme|dark|light|terang|gelap/i.test(b.getAttribute('aria-label') || b.title || ''));
themeKey?.click();
await new Promise((r) => setTimeout(r, 700));
const p = document.querySelector('.kpm-fleet-panel');
return { key: themeKey?.getAttribute('aria-label') || themeKey?.title || 'none', classes: [...h.classList].join(' '), before,
    panelAnim: p ? getComputedStyle(p).animationName : 'no panel', panelShadow: p ? getComputedStyle(p).boxShadow : '', bodyBg: getComputedStyle(document.body).backgroundColor };
