import jwt from "jsonwebtoken";

export type AdminClaims = {
  role?: string;
};

export function getBearerToken(event: any): string | null {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (!auth) return null;
  const v = String(auth);
  if (!v.startsWith("Bearer ")) return null;
  return v.slice("Bearer ".length).trim() || null;
}

export function verifyAdmin(event: any): { ok: boolean; claims?: AdminClaims } {
  try {
    const token = getBearerToken(event);
    if (!token) return { ok: false };

    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return { ok: false };

    const decoded = jwt.verify(token, secret) as AdminClaims;
    if (decoded?.role !== "admin") return { ok: false };
    return { ok: true, claims: decoded };
  } catch {
    return { ok: false };
  }
}

export function requireAdmin(event: any) {
  const v = verifyAdmin(event);
  if (!v.ok) {
    return {
      ok: false,
      response: {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "UNAUTHORIZED" }),
      },
    };
  }
  return { ok: true, claims: v.claims };
}
