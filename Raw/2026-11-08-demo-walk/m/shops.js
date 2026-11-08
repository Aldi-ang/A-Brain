document.querySelector('[aria-label="Choose customer"]')?.click(); await sleep(1200);
const box = document.querySelector('[data-guide="shops"]'); if (!box) return { noList: true, cap: cap() };
const items = [...box.querySelectorAll('button,[role="option"],[role="button"],li')].filter(vis).map((b) => ({ tag: b.tagName, t: b.innerText.trim().replace(/\n+/g, ' / ').slice(0, 70) }));
return { n: items.length, items: items.slice(0, 14), text: box.innerText.replace(/\n+/g, ' / ').slice(0, 400), cap: cap() };
