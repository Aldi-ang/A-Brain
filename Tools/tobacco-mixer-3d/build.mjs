import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "dist");
const KPM_MODULES = join(HERE, "..", "..", "..", "kpm-inventory-main", "node_modules");

const require = createRequire(import.meta.url);
const esbuild = require(join(KPM_MODULES, "esbuild"));

mkdirSync(DIST, { recursive: true });

await esbuild.build({
  entryPoints: [join(HERE, "app.js")],
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "esm",
  outfile: join(DIST, "bundle.js"),
  nodePaths: [KPM_MODULES],
});

copyFileSync(join(HERE, "index.html"), join(DIST, "index.html"));
copyFileSync(join(HERE, "styles.css"), join(DIST, "styles.css"));

// Also emit single-file standalone HTML (works via file:// double-click OR instant Netlify/Vercel drop)
const iifeRes = await esbuild.build({
  entryPoints: [join(HERE, "app.js")],
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  write: false,
  nodePaths: [KPM_MODULES],
});
const html = readFileSync(join(HERE, "index.html"), "utf8");
const css = readFileSync(join(HERE, "styles.css"), "utf8");
const js = iifeRes.outputFiles[0].text.replace(/<\/(script)/gi, "<\\/$1");
const standalone = html
  .replace('<link rel="stylesheet" href="./styles.css" />', () => `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="./bundle.js"></script>', () => `<script>\n${js}\n</script>`);
writeFileSync(join(DIST, "tobacco-mixer-3d-standalone.html"), standalone);

console.log("Built tobacco-mixer-3d -> dist/ (multi-file + tobacco-mixer-3d-standalone.html)");
