/* the phone's Chrome tabs: keep the VISIBLE demo tab, close every other demo tab (a background tab is frozen, so a probe
   sent to it never answers - 2026-11-15, after `am start` had opened the demo four times). node tabs.mjs */
import { execFileSync } from 'node:child_process';

execFileSync('C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe', ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch('http://127.0.0.1:9223/json/list')).json();
const vis = (p) => { try { return JSON.parse(p.description || '{}').visible === true; } catch { return false; } };
const demo = list.filter((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const keep = demo.find(vis) || demo[0];
for (const p of demo) {
    if (p === keep) continue;
    await fetch(`http://127.0.0.1:9223/json/close/${p.id}`);
}
console.log(JSON.stringify({ tabs: list.filter((p) => p.type === 'page').map((p) => ({ url: p.url.slice(0, 40), visible: vis(p) })), kept: keep?.id, closed: demo.length - 1 }));
