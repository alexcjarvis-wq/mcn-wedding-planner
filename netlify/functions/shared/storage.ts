// netlify/functions/shared/storage.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function initFirebaseAdmin() {
  if (getApps().length) return;

  const projectId = requireEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");

  // Netlify stores this as a single line with \n inside it.
  const privateKeyRaw = requireEnv("FIREBASE_PRIVATE_KEY");
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function db() {
  initFirebaseAdmin();
  return getFirestore();
}

export type BookingRecord = {
  id: string;
  coupleName?: string;
  venue?: string;
  weddingDate?: string;
  locked?: boolean;
  lockedAt?: string | null;
  lockedBy?: string | null;
  status?: string;
  data?: any;
  updatedAt?: string;
  createdAt?: string;
};

export async function getBooking(bookingId: string): Promise<BookingRecord | null> {
  const snap = await db().collection("bookings").doc(bookingId).get();
  if (!snap.exists) return null;
  return snap.data() as BookingRecord;
}

export async function upsertBooking(bookingId: string, record: Partial<BookingRecord>): Promise<BookingRecord> {
  const ref = db().collection("bookings").doc(bookingId);
  const nowIso = new Date().toISOString();

  const existing = await ref.get();
  const createdAt =
    existing.exists && (existing.data() as any)?.createdAt ? (existing.data() as any).createdAt : nowIso;

  const merged: BookingRecord = {
    id: bookingId,
    createdAt,
    updatedAt: nowIso,
    ...record,
    id: bookingId,
    createdAt,
    updatedAt: nowIso,
  };

  await ref.set(merged, { merge: true });
  return merged;
}

export type AuditEntry = {
  bookingId: string;
  actorType: "admin" | "guest";
  actorId: string;
  action: string;
  diff?: any;
  ip?: string;
  at?: string;
};

export async function appendAudit(entry: AuditEntry): Promise<void> {
  const nowIso = new Date().toISOString();
  await db().collection("audit").add({
    ...entry,
    at: entry.at || nowIso,
    ts: Timestamp.now(),
  });
}