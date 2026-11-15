/* run one page probe on the phone's Chrome (or --pc on the desktop walker's Chrome): node probe.mjs <body.js> [--pc]
   <body.js> is the body of an async function; what it returns is printed as JSON. Debugging only - never a fix. */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [file] = process.argv.slice(2);
const PC = process.argv.includes('--pc'), PORT = PC ? 9557 : 9223;
if (!PC) execFileSync('C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe', ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
ws.addEventListener('message', (m) => {
    const d = JSON.parse(m.data);
    if (d.id !== 1) return;
    const r = d.result;
    console.log(r?.exceptionDetails ? 'EXCEPTION ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) : JSON.stringify(r?.result?.value, null, 1));
    process.exit(0);
});
ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: `(async () => { ${readFileSync(file, 'utf8')} })()`, awaitPromise: true, returnByValue: true } }));
