// node ty.cjs <shot> <SEL> <IDX> <TEXT>  -> tap into the input and type, then print the guide
const { execFileSync } = require('child_process'); const fs = require('fs');
const [shot, sel, idx, text] = process.argv.slice(2);
fs.writeFileSync(__dirname + '/m/_y.js', fs.readFileSync(__dirname + '/m/typein.js', 'utf8').split('SEL').join(sel.replace(/'/g, "\\'")).split('IDX').join(idx).split('TEXT').join(text));
const out = execFileSync('node', [__dirname + '/drive.mjs', 'run', __dirname + '/m/_y.js', shot], { encoding: 'utf8' });
const o = JSON.parse(out); const v = o.val || {};
console.log(JSON.stringify({ press: v.pressing, none: v.none, n: v.n, before: v.before && [v.before.beat, v.before.say], then: v.then?.cap && [v.then.cap.beat, v.then.cap.say, v.then.cap.ring], err: o.errors }));
