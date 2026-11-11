// node extract.mjs  -> reads prod.json (the driver's output), writes img/p0.jpg.. and prints the text of each card
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const { val } = JSON.parse(readFileSync(DIR + 'prod.json', 'utf8'));
mkdirSync(DIR + 'img', { recursive: true });
val.forEach((p, i) => {
  const m = /^data:image\/(\w+);base64,(.+)$/.exec(p.src);
  if (m) writeFileSync(`${DIR}img/p${i}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`, Buffer.from(m[2], 'base64'));
  console.log(i, m ? m[1] : 'NOT-BASE64 ' + p.src.slice(0, 60), '|', p.text);
});
