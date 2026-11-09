/* the receipt after a deal: CLOSE RECEIPT */
const b = [...document.querySelectorAll('button')].find((x) => /close receipt|tutup/i.test(x.innerText)); b?.click(); await sleep(1200);
return { closed: !!b };
