// node db-check.mjs - LOCAL demo emulator only (127.0.0.1:8080): Dika's EOD reports, newest first
import { createRequire } from 'node:module';
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
const require = createRequire(REPO + 'package.json');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { APP_ID, OWNER_UID } = await import('file:///' + REPO + 'api/_demoCompany.js');
if (!getApps().length) initializeApp({ projectId: 'kpm-demo-f4d74' });
const snap = await getFirestore().collection(`artifacts/${APP_ID}/users/${OWNER_UID}/eod_reports`).get();
const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  .filter((r) => JSON.stringify([r.agentId, r.agentName, r.submittedBy, r.uid]).includes('demo-agent-2') || /dika/i.test(String(r.agentName)))
  .map((r) => ({ id: r.id, type: r.reportType, day: r.dayKey, status: r.status, by: r.submittedByUid || r.realUid || r.uid || null,
    at: r.timestamp?.toDate?.().toISOString?.() || r.submittedAt?.toDate?.().toISOString?.() || null }))
  .sort((a, b) => String(b.at).localeCompare(String(a.at)));
console.log(JSON.stringify({ total: snap.size, dika: rows.slice(0, 5) }, null, 1));
process.exit(0);
