import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "dist");
const KPM_MODULES = join(HERE, "..", "..", "..", "kpm-inventory-main", "node_modules");

const require = createRequire(import.meta.url);
const esbuild = require(join(KPM_MODULES, "esbuild"));

mkdirSync(DIST, { recursive: true });
for (const f of readdirSync(DIST)) {
  if (/^(bundle|styles)(\.[a-f0-9]+)?\.(js|css)$/.test(f)) unlinkSync(join(DIST, f));
}

const iifeRes = await esbuild.build({
  entryPoints: [join(HERE, "app.js")],
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  write: false,
  nodePaths: [KPM_MODULES],
});
const rawJs = iifeRes.outputFiles[0].text;
const css = readFileSync(join(HERE, "styles.css"), "utf8");
const html = readFileSync(join(HERE, "index.html"), "utf8");

const shortHash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 8);
const jsName = `bundle.${shortHash(rawJs)}.js`;
const cssName = `styles.${shortHash(css)}.css`;

writeFileSync(join(DIST, jsName), rawJs);
writeFileSync(join(DIST, cssName), css);

const hashedHtml = html
  .replace('<link rel="stylesheet" href="./styles.css" />', () => `<link rel="stylesheet" href="./${cssName}" />`)
  .replace('<script type="module" src="./bundle.js"></script>', () => `<script defer src="./${jsName}"></script>`);
writeFileSync(join(DIST, "index.html"), hashedHtml);

writeFileSync(
  join(DIST, "_headers"),
  "/\n  Cache-Control: public, max-age=0, must-revalidate\n/index.html\n  Cache-Control: public, max-age=0, must-revalidate\n/tobacco-mixer-3d-standalone.html\n  Cache-Control: public, max-age=0, must-revalidate\n/bundle.*.js\n  Cache-Control: public, max-age=31536000, immutable\n/styles.*.css\n  Cache-Control: public, max-age=31536000, immutable\n"
);

// Also emit single-file standalone HTML (works via file:// double-click OR direct upload)
const safeInlineJs = rawJs.replace(/<\/(script)/gi, "<\\/$1");
const standalone = html
  .replace('<link rel="stylesheet" href="./styles.css" />', () => `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="./bundle.js"></script>', () => `<script>\n${safeInlineJs}\n</script>`);
writeFileSync(join(DIST, "tobacco-mixer-3d-standalone.html"), standalone);

console.log(`Built tobacco-mixer-3d -> dist/ (${jsName}, ${cssName}, standalone)`);
