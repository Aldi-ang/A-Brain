/* Dika's menu: is EOD Setoran there? then open it */
const marks = [...document.querySelectorAll('[data-mark]')].map((m) => m.dataset.mark);
const eod = document.querySelector('[data-mark="eod"]'); if (eod) eod.click();
await sleep(2500);
return { bar: document.querySelector('.kpm-demo-bar')?.innerText.replace(/\n+/g, ' / '), marks, eodInMenu: !!eod,
  deck: !!document.querySelector('[data-guide="deck"]'), title: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText.trim()).slice(0, 3) };
