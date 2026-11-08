// node console.mjs - print every console error the kept Chrome (9555) has buffered, with ALL its arguments
const list = (await (await fetch('http://127.0.0.1:9555/json/list')).json()).filter((t) => t.type === 'page');
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
const seen = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error')
  seen.push(d.params.args.map((a) => a.value ?? a.description ?? '').join(' || ').replace(/\s+/g, ' ').slice(0, 900)); };
ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
await new Promise((r) => setTimeout(r, 1500));
console.log([...new Set(seen)].join('\n---\n')); process.exit(0);
