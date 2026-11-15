/* press the phone's muatan bar (trial) - it only scrolls; report whether the list and MUAT VAN are now on screen */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const seen = (el) => { if (!el) return 'missing'; const r = el.getBoundingClientRect(); return (r.bottom > 0 && r.top + 40 < innerHeight ? 'ON SCREEN' : 'UNDER THE SCREEN') + ' y' + Math.round(r.top); };
const bar = document.querySelector('.kpm-bay-jump');
if (!bar) return 'no bar';
bar.click();
await wait(1500);
return { muatanList: seen(document.querySelector('aside.man')), muatVan: seen(document.querySelector('button.go')), muatVanText: document.querySelector('button.go')?.innerText.replace(/\s+/g, ' '), barLeft: !!document.querySelector('.kpm-bay-jump') };
