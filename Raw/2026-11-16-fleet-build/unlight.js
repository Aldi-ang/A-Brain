/* put back what light.js changed: Lite Mode off, the theme key pressed once more */
const h = document.documentElement;
h.classList.remove('lite-mode');
const themeKey = [...document.querySelectorAll('button')].find((b) => /theme|dark|light|terang|gelap/i.test(b.getAttribute('aria-label') || b.title || ''));
themeKey?.click();
await new Promise((r) => setTimeout(r, 500));
return { classes: [...h.classList].join(' '), bodyBg: getComputedStyle(document.body).backgroundColor };
