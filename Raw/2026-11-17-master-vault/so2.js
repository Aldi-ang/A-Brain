return (async () => { const s=(ms)=>new Promise(r=>setTimeout(r,ms));
document.querySelector('[data-mission="8"]')?.click(); await s(1500);
const b=document.querySelector('[data-guide="submit-count"]'); b?.scrollIntoView({block:'center'}); await s(600);
return {submit: b && [b.className.split(' ')[0], getComputedStyle(b).backgroundColor, getComputedStyle(b).borderColor, b.disabled]}; })();
