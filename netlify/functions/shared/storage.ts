import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function initFirebaseAdmin() {
  if (getApps().length) return;

  const b64 = requireEnv("FIREBASE_SERVICE_ACCOUNT_B64");
  const json = Buffer.from(b64, "base64").toString("utf8");
  const svc = JSON.parse(json);

  initializeApp({
    credential: cert({
      projectId: svc.project_id,
      clientEmail: svc.client_email,
      privateKey: svc.private_key,
    }),
  });
}

export function db() {
  initFirebaseAdmin();
  return getFirestore();
}

export async function getBooking(id: string) {
  const snap = await db().collection("bookings").doc(id).get();
  if (!snap.exists) return null;
  return snap.data();
}

export async function upsertBooking(id: string, record: any) {
  const ref = db().collection("bookings").doc(id);
  const now = new Date().toISOString();

  const existing = await ref.get();
  const createdAt =
    existing.exists && existing.data()?.createdAt
      ? existing.data()?.createdAt
      : now;

  const merged = {
    id,
    createdAt,
    updatedAt: now,
    ...record,
  };

  await ref.set(merged, { merge: true });
  return merged;
}

export async function appendAudit(entry: any) {
  await db().collection("audit").add({
    ...entry,
    at: new Date().toISOString(),
    ts: Timestamp.now(),
  });
}