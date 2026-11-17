return (async () => { const s=(ms)=>new Promise(r=>setTimeout(r,ms));
const marks=[...new Set([...document.querySelectorAll('[data-mark]')].map(e=>e.dataset.mark))];
const m=marks.find(x=>/^stock_opname$/.test(x)); if(m){ const el=document.querySelector(`[data-mark="${m}"]`); el.click(); await s(2500);}
return {marks, m, edge:[...document.querySelectorAll('.kpm-edge-btn')].filter(e=>e.offsetWidth).map(e=>e.innerText.trim().slice(0,20))}; })();
