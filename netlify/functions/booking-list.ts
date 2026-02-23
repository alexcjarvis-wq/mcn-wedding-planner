import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./shared/auth";
import { listBookings } from "./shared/storage";

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  try {
    const limitRaw = Number(event.queryStringParameters?.limit || 50);
    const limit = Number.isFinite(limitRaw) ? limitRaw : 50;
    const items = await listBookings(limit);
    return json(200, { ok: true, items });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "SERVER_ERROR" });
  }
};
