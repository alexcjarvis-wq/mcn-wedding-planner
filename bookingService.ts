export type ApiOk<T> = { ok: true } & T;
export type ApiErr = { ok: false; error: string };

async function apiGet<T>(path: string, token?: string): Promise<ApiOk<T> | ApiErr> {
  const res = await fetch(path, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json().catch(() => null);
  return json || { ok: false, error: "Bad response" };
}

async function apiPost<T>(path: string, body: any, token?: string): Promise<ApiOk<T> | ApiErr> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return json || { ok: false, error: "Bad response" };
}

export async function verifyAdmin(code: string) {
  return apiPost<{ token: string }>("/.netlify/functions/admin-verify", { code });
}

export async function getBooking(id: string) {
  return apiGet<{ booking: any }>(`/.netlify/functions/booking-get?id=${encodeURIComponent(id)}`);
}

export async function findBookingByReference(reference: string) {
  return apiGet<{ booking: any }>(
    `/.netlify/functions/booking-find?reference=${encodeURIComponent(reference)}`
  );
}

export async function saveBooking(id: string, patch: any, actorType: string, actorId: string, adminToken?: string) {
  return apiPost<{ booking: any }>(
    "/.netlify/functions/booking-save",
    { id, patch, actorType, actorId },
    adminToken
  );
}

export async function approveBooking(id: string, approvedBy: string, adminToken: string) {
  return apiPost<{ booking: any }>("/.netlify/functions/booking-approve", { id, approvedBy }, adminToken);
}

export async function unlockBooking(id: string, unlockedBy: string, adminToken: string) {
  return apiPost<{ booking: any }>("/.netlify/functions/booking-unlock", { id, unlockedBy }, adminToken);
}

export async function listBookings(adminToken: string, limit = 50) {
  return apiGet<{ items: any[] }>(`/.netlify/functions/booking-list?limit=${limit}`, adminToken);
}

export async function createBooking(payload: any, adminToken: string) {
  return apiPost<{ booking: any }>("/.netlify/functions/booking-create", payload, adminToken);
}

export async function listAudit(adminToken: string, bookingId?: string, limit = 100) {
  const q = new URLSearchParams();
  if (bookingId) q.set("id", bookingId);
  q.set("limit", String(limit));
  return apiGet<{ items: any[] }>(`/.netlify/functions/booking-audit-list?${q.toString()}`, adminToken);
}
