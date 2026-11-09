/* the phone's order drawer: a real tap on the PESANAN tab that is ON screen (the left edge), as a salesman opens it */
const on = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; };
const tab = [...document.querySelectorAll('button,[role="button"],div')].filter(on).filter((b) => /pesanan/i.test(b.innerText || '') && b.getBoundingClientRect().width < 60)
  .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
if (!tab) return { noTab: true };
const r = tab.getBoundingClientRect();
return { tab: tab.tagName + ' ' + (tab.innerText || '').trim().replace(/\n+/g, ' ').slice(0, 30), tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], after: 1500 };
