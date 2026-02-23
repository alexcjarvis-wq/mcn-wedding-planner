export type ApiOk<T> = { ok: true } & T;
export type ApiErr = { ok: false; error: string };

type AnyObj = Record<string, any>;

const ADMIN_TOKEN_KEY = "adminToken";

function getStoredAdminToken(): string {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

async function readJson(res: Response): Promise<any> {
  const json = await res.json().catch(() => null);
  return json || null;
}

async function apiGet<T>(path: string, token?: string): Promise<ApiOk<T> | ApiErr> {
  const res = await fetch(path, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const json = await readJson(res);
  if (!res.ok) return { ok: false, error: json?.error || `HTTP ${res.status}` };
  if (!json) return { ok: false, error: "Bad response" };
  return json;
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

  const json = await readJson(res);
  if (!res.ok) return { ok: false, error: json?.error || `HTTP ${res.status}` };
  if (!json) return { ok: false, error: "Bad response" };
  return json;
}

export async function verifyAdmin(code: string) {
  return apiPost<{ token: string }>("/.netlify/functions/admin-verify", { code });
}

export async function getBooking(id: string) {
  return apiGet<{ booking: AnyObj }>(`/.netlify/functions/booking-get?id=${encodeURIComponent(id)}`);
}

export async function findBookingByReference(reference: string) {
  return apiGet<{ booking: AnyObj }>(
    `/.netlify/functions/booking-find?reference=${encodeURIComponent(reference)}`
  );
}

/*
Backwards compatible.
Supports:
saveBooking(id, patch, actorType)
saveBooking(id, patch, actorType, actorId)
saveBooking(id, patch, actorType, actorId, adminToken)
*/
export async function saveBooking(
  id: string,
  patch: AnyObj,
  actorType: "ADMIN" | "GUEST" | "SYSTEM",
  actorId?: string,
  adminToken?: string
) {
  const token = actorType === "ADMIN" ? adminToken || getStoredAdminToken() : undefined;
  const resolvedActorId =
    actorId ||
    (actorType === "ADMIN" ? "admin" : actorType === "GUEST" ? "guest" : "system");

  return apiPost<{ booking: AnyObj }>(
    "/.netlify/functions/booking-save",
    { id, patch, actorType, actorId: resolvedActorId },
    token
  );
}

export async function approveBooking(id: string, approvedBy: string, adminToken?: string) {
  const token = adminToken || getStoredAdminToken();
  return apiPost<{ booking: AnyObj }>(
    "/.netlify/functions/booking-approve",
    { id, approvedBy },
    token
  );
}

export async function unlockBooking(id: string, unlockedBy: string, adminToken?: string) {
  const token = adminToken || getStoredAdminToken();
  return apiPost<{ booking: AnyObj }>(
    "/.netlify/functions/booking-unlock",
    { id, unlockedBy },
    token
  );
}

export async function listBookings(limit = 50, adminToken?: string) {
  const token = adminToken || getStoredAdminToken();
  return apiGet<{ items: AnyObj[] }>(`/.netlify/functions/booking-list?limit=${limit}`, token);
}

export async function createBooking(payload: AnyObj, adminToken?: string) {
  const token = adminToken || getStoredAdminToken();
  return apiPost<{ booking: AnyObj }>("/.netlify/functions/booking-create", payload, token);
}

export async function listAudit(bookingId?: string, limit = 100, adminToken?: string) {
  const token = adminToken || getStoredAdminToken();
  const q = new URLSearchParams();
  if (bookingId) q.set("id", bookingId);
  q.set("limit", String(limit));
  return apiGet<{ items: AnyObj[] }>(`/.netlify/functions/booking-audit-list?${q.toString()}`, token);
}