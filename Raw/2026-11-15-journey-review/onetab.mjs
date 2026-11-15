// node onetab.mjs - close every phone Chrome tab (CDP 9223) whose document is not visible; the hidden one freezes CDP scripts
const list = (await (await fetch('http://127.0.0.1:9223/json/list')).json()).filter((p) => p.type === 'page');
for (const p of list) {
    const ws = new WebSocket(p.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));
    const vis = await new Promise((res) => {
        ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id === 1) res(m.result?.result?.value); });
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: 'document.visibilityState', returnByValue: true } }));
        setTimeout(() => res('timeout'), 4000);
    });
    ws.close();
    if (vis !== 'visible') { await fetch(`http://127.0.0.1:9223/json/close/${p.id}`); console.log('closed', p.id, vis); } else console.log('kept', p.id, p.url);
}
