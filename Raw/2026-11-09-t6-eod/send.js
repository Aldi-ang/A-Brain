/* the letter's send key - a real tap; the dialog gate comes next */
const s = document.querySelector('[data-guide="send"]'); if (!s) return { noSend: true };
s.scrollIntoView({ block: 'center' }); await sleep(400);
const r = s.getBoundingClientRect();
return { label: s.innerText.trim(), disabled: s.disabled, tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], after: 1500 };
