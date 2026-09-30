// A PRODUCTION build (production React, minified, split) that still talks to the local Firebase emulator, so the
// potato audit measures what his phone runs, on fake data. Run with --mode httpdev (that mode already defines
// VITE_USE_EMULATOR); DEV is forced true ONLY for firebase.js's emulator gate - it is the only DEV branch in src/.
// Writes to a temp folder, never to the repo's dist/.
import base from 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/vite.config.js';

export default async (env) => {
  const cfg = typeof base === 'function' ? await base(env) : base;
  cfg.root = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
  cfg.define = { ...(cfg.define || {}), 'import.meta.env.DEV': 'true' };
  cfg.build = { ...(cfg.build || {}), outDir: 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu', emptyOutDir: true };
  cfg.preview = { port: 4175, strictPort: true };
  return cfg;
};
