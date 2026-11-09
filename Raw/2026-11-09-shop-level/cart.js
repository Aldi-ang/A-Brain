/* three packs of the first product with a + key, then the handover photo (the demo fills it itself) */
const box = document.querySelector('[data-guide="products"]'); if (!box) return { noProducts: true };
const plus = [...box.querySelectorAll('button')].filter((b) => vis(b) && !b.disabled && /^\+$|add|tambah/i.test((b.getAttribute('aria-label') || b.innerText).trim()));
if (!plus.length) return { noPlus: true, buttons: [...box.querySelectorAll('button')].filter(vis).slice(0, 8).map((b) => (b.getAttribute('aria-label') || b.innerText).trim().slice(0, 30)) };
for (let i = 0; i < 3; i++) { plus[0].click(); await sleep(350); }
document.querySelector('[data-guide="photo"]')?.click();
const m = await wait(() => document.querySelector('[data-mission="4"][data-photo]'), 15000);
const deal = document.querySelector('[data-mission="4"]');
return { plus: (plus[0].getAttribute('aria-label') || plus[0].innerText).trim(), cart: deal?.getAttribute('data-cart'), photo: !!m, deal: deal?.innerText.trim().replace(/\n+/g, ' ') };
