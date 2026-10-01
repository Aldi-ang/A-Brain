// Build B for t5-push.mjs: the same lab build with a different build id, so App's chunk hash, the precache list and
// sw.js all change - what a real push does to a phone that already holds build A.
import a from './prod-emu.config.mjs';
export default async (env) => {
  const cfg = await a(env);
  cfg.define = { ...cfg.define, __BUILD_ID__: JSON.stringify('labB-' + Date.now()) };
  return cfg;
};
