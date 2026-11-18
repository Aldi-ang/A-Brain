import { copyFileSync, mkdirSync } from "node:fs";
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

console.log("Built tobacco-mixer-3d -> dist/index.html, dist/styles.css, dist/bundle.js");
