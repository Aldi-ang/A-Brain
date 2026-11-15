[...document.querySelectorAll('button,[role="menuitem"]')].filter(b=>b.offsetParent&&/^T[1-6]\b/.test(b.innerText.trim())).map(b=>b.innerText.trim().replace(/\s+/g,' ').slice(0,70))
