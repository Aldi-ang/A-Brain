/* the dialog gate: read it, then a real tap on its yes button (the last button that is not Cancel/Batal) */
const d = await wait(() => document.querySelector('[role="alertdialog"]'), 6000); if (!d) return { noDialog: true, cap: cap(), toasts: stat().toasts };
const btns = [...d.querySelectorAll('button')].filter(vis); const yes = btns.filter((b) => !/^(cancel|batal|tidak|no)$/i.test(b.innerText.trim())).pop();
const r = yes.getBoundingClientRect(); const dr = d.getBoundingClientRect();
return { text: d.innerText.replace(/\n+/g, ' / ').slice(0, 300), box: [Math.round(dr.left), Math.round(dr.top), Math.round(dr.width), Math.round(dr.height)], buttons: btns.map((b) => b.innerText.trim()), tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], after: 3500 };
