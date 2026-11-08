// node t.cjs <shot> <SEL> [TXT]  -> writes m/_t.js from m/tapsel.js and runs it through drive.mjs; prints a short line
const { execFileSync } = require('child_process'); const fs = require('fs');
const [shot, sel, txt = ''] = process.argv.slice(2);
fs.writeFileSync(__dirname + '/m/_t.js', fs.readFileSync(__dirname + '/m/tapsel.js', 'utf8').split('SEL').join(sel.replace(/'/g, "\\'")).split('TXT').join(txt));
const out = execFileSync('node', [__dirname + '/drive.mjs', 'run', __dirname + '/m/_t.js', shot, process.argv[5] || ''], { encoding: 'utf8' });
const o = JSON.parse(out); const v = o.val || {};
console.log(JSON.stringify({ press: v.pressing, none: v.none, before: v.before && [v.before.beat, v.before.say], then: v.then?.cap && [v.then.cap.beat, v.then.cap.say, v.then.cap.ring], toasts: v.then?.stat?.toasts, err: o.errors }));
