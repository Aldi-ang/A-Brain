// DIAGNOSIS ONLY (demo #15b, 2026-11-09) - why the store's "last visit" + level never save after a salesman's sale.
// The app's own steps, MerchantSalesView handleFinalDeal "Auto-Promoter": 1) getDoc appSettings/tierRules, 2) updateDoc the shop
// { lastVisit, lastVisitedBy, updatedAt, tier? }. Run from the repo root (emulator only, never the live project):
//   npx firebase emulators:exec --only firestore --project demo-kpm-rules "node ../A-Brain/Raw/2026-11-09-promoter/probe.mjs"
import { readFileSync } from 'node:fs';

const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';

import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
const RULES = readFileSync(REPO + (process.env.RULES_FILE || 'firestore.rules'), 'utf8');
const APP_ID = 'cello-inventory-manager', A = (p) => `artifacts/${APP_ID}/users/ownerA/${p}`;
const DIR = [
  ['t3@test.com', { bossUid: 'ownerA', userRole: 'AREA_ADMIN', agentId: 'AGT_T3', location: 'MUNTILAN' }],
  ['t4@test.com', { bossUid: 'ownerA', userRole: 'FLEET_CAPTAIN', agentId: 'AGT_T4', location: 'MUNTILAN' }],
  ['t5@test.com', { bossUid: 'ownerA', userRole: 'FIELD_OPERATIVE', agentId: 'AGT_T5', location: 'MUNTILAN' }],
  ['t6@test.com', { bossUid: 'ownerA', userRole: 'ROOKIE', agentId: 'AGT_T6', location: 'MUNTILAN' }],
];
const env = await initializeTestEnvironment({ projectId: 'demo-kpm-rules', firestore: { rules: RULES, host: '127.0.0.1', port: 8080 } });
await env.clearFirestore();
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  for (const [e, d] of DIR) await setDoc(doc(db, `artifacts/${APP_ID}/employee_directory`, e), d);
  await setDoc(doc(db, A('appSettings'), 'tierRules'), { rules: { Bronze: { type: 'omset', target: 1, days: 30 } } });
  await setDoc(doc(db, A('customers'), 's1'), { name: 'TOKO SATU', priceTier: 'Retail', tier: 'Unranked', province: 'JAWA TENGAH', region: 'MAGELANG', city: 'MUNTILAN' });
});
const who = { owner: ['ownerA', 'owner@test.com'], T3: ['u3', 't3@test.com'], T4: ['u4', 't4@test.com'], T5: ['u5', 't5@test.com'], T6: ['u6', 't6@test.com'] };
const tryIt = async (p) => { try { await p; return 'ok'; } catch (e) { return 'REFUSED'; } };
const out = {};
for (const [k, [uid, email]] of Object.entries(who)) {
  const db = env.authenticatedContext(uid, { email }).firestore();
  out[k] = {
    readTierRules: await tryIt(getDoc(doc(db, A('appSettings'), 'tierRules'))),
    visitPlusLevel: await tryIt(updateDoc(doc(db, A('customers'), 's1'), { lastVisit: '2026-11-09', lastVisitedBy: k, updatedAt: serverTimestamp(), tier: 'Bronze' })),
  };
}
console.log(JSON.stringify(out, null, 1));
await env.cleanup();
