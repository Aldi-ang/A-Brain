/* clear the sheet (so no "not saved" question), then close the panel by its own key: ‹ Roster on the phone, × on the PC */
const clear = [...document.querySelectorAll('.kpm-fleet-foot button')].find((b) => /^Clear$/.test(b.innerText.trim()));
if (clear) { clear.click(); await new Promise((r) => setTimeout(r, 300)); }
const key = [...document.querySelectorAll('.kpm-fleet-panel button')].find((b) => (innerWidth < 1024 ? /Roster/.test(b.innerText) : /^Close /.test(b.getAttribute('aria-label') || '')));
if (!key) return 'no close key';
key.click();
await new Promise((r) => setTimeout(r, 600));
return { panel: !!document.querySelector('.kpm-fleet-panel'), rows: document.querySelectorAll('.kpm-fleet-row').length };
