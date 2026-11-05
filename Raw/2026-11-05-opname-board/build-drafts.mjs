// node build-drafts.mjs <outFile>  -> one self-contained page of the three drafts, for the Artifact. tokens.json comes from drafts.mjs (the app's real values).
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const APP = DIR + '../../../kpm-inventory-main/';
const out = process.argv[2];
const esbuild = createRequire(APP + 'package.json')('esbuild');
const r = await esbuild.build({ entryPoints: [APP + 'tools/opname-drafts-page.jsx'], absWorkingDir: APP, bundle: true, minify: true, format: 'iife', jsx: 'automatic', target: 'es2020', write: false, define: { 'process.env.NODE_ENV': '"production"' }, loader: { '.jsx': 'jsx', '.js': 'jsx' }, legalComments: 'none' });
const js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const T = JSON.parse(readFileSync(DIR + 'tokens.json', 'utf8'));
const block = (o, page) => Object.entries(o).filter(([k, v]) => k.startsWith('--') && v).map(([k, v]) => `${k}:${v};`).join('') + `--page:${page};`;
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Stock Opname Board Drafts</title>
<style>:root{${block(T.dark, T.dark.__page)}color-scheme:dark}:root.light{${block(T.light, T.light.__page)}color-scheme:light}</style></head>
<body><div id="root"></div><script>${js}</script></body></html>`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log('built', out, Math.round(html.length / 1024) + ' KB', 'tokens empty:', Object.entries(T.dark).filter(([, v]) => !v).map(([k]) => k).join(',') || 'none');
