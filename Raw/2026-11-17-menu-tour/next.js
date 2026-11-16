/* press the tour's LANJUT (or, with window.__key = 'LEWATI', that key) */
const k = [...document.querySelectorAll('.kpm-mx-cap .go button')].find((b) => b.innerText.includes(window.__key || 'LANJUT'));
if (!k) return 'no key';
k.click();
return 'pressed ' + k.innerText;
