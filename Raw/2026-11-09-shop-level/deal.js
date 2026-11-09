/* press SIMPAN TRANSAKSI: a real tap on the copy that is inside the screen (the terminal keeps a desk copy off to the side) */
const on = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.left >= 0 && r.right <= innerWidth; };
const all = [...document.querySelectorAll('[data-mission="4"]')];
const d = all.find(on); if (!d) return { noDeal: true, copies: all.map((e) => Math.round(e.getBoundingClientRect().left)) };
d.scrollIntoView({ block: 'center' }); await sleep(400);
const r = d.getBoundingClientRect();
return { label: d.innerText.trim().replace(/\n+/g, ' '), disabled: d.disabled, tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], after: 2500 };
