/* the receipt's WhatsApp Share (his "WhatsApp = A"), walked in headless Chrome at a 390 phone on the lab's ?share mode:
   the real SaleReceipt + the real dialog host. window.open is recorded by the lab, nothing leaves the page. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-share'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9403', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9403/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 160)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const out = []; const ok = (name, pass, got) => out.push(`${pass ? 'PASS' : 'FAIL'} ${name} -> ${JSON.stringify(got)}`);
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
const go = async (qs) => { await send('Page.navigate', { url: `http://localhost:4187/tools/ponder-lab.html?share${qs}` }); await sleep(2000); };
const clickText = (t) => js(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().endsWith(${JSON.stringify(t)})); if (!b) return false; b.click(); return true; })()`);
const dialog = () => js(`(() => { const i = document.querySelector('input:not([type=radio])'); return { input: !!i, text: document.body.innerText.match(/WhatsApp number for [^\\n]*|Save [^\\n]*straight to it\\./g) }; })()`);
const type = async (t) => { await js(`document.querySelector('input:not([type=radio])').focus()`); await send('Input.insertText', { text: t }); await sleep(150); };
const opened = () => js('window.__opened || []');

await go('&phone'); await clickText('Share'); await sleep(400);
ok('a shop WITH a number: Share opens its own chat straight away, no box', (await opened()).length === 1 && (await opened())[0].startsWith('https://wa.me/6281234567890?text=') && !(await dialog()).input, { opened: await opened(), dialog: await dialog() });

await go(''); await clickText('Share'); await sleep(400);
const d1 = await dialog();
ok('a shop WITHOUT a number: the app asks for it first', d1.input && /Toko Jaya/.test(String(d1.text)) && (await opened()).length === 0, d1);
await type('0812 3456 7890'); await clickText('Open WhatsApp'); await sleep(400);
ok('the typed number opens that chat', (await opened())[0]?.startsWith('https://wa.me/6281234567890?text=') && (await opened())[0].includes(encodeURIComponent('Toko Jaya')), await opened());

await go(''); await clickText('Share'); await sleep(400); await clickText('Open WhatsApp'); await sleep(400);
ok('left empty: the chat picker opens, as before', (await opened())[0]?.startsWith('https://wa.me/?text='), await opened());

await go(''); await clickText('Share'); await sleep(400); await clickText('Cancel'); await sleep(400);
ok('Cancel: nothing opens', (await opened()).length === 0, await opened());

await go(''); await clickText('Share'); await sleep(400); await type('12ab'); await clickText('Open WhatsApp'); await sleep(500);
const bad = await js(`document.body.innerText.includes('is not a phone number')`);
ok('not a number: nothing opens, and it says so', (await opened()).length === 0 && bad, { opened: await opened(), bad });

await go('&save'); await clickText('Share'); await sleep(400); await type('0812 3456 7890'); await clickText('Open WhatsApp'); await sleep(400);
const d2 = await dialog();
ok('the sales terminal path: after the chat opens it offers to save the number on the shop', (await opened()).length === 1 && /Save 0812 3456 7890 as the WhatsApp number of Toko Jaya/.test(String(d2.text)), { opened: await opened(), d2 });
const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, 'share-save-ask-390.png'), Buffer.from(s.result.data, 'base64'));
await clickText('Confirm'); await sleep(500);
ok('Confirm saves it and reports', (await js('window.__saved')) === '0812 3456 7890' && (await js(`document.body.innerText.includes("Saved - Toko Jaya's number is 0812 3456 7890.")`)), { saved: await js('window.__saved') });

ok('no page errors', errs.length === 0, errs);
console.log(out.join('\n'));
ws.close(); chrome.kill();
