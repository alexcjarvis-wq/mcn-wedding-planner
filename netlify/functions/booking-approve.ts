import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./shared/auth";
import { getBooking, upsertBooking, appendAudit } from "./shared/storage";

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const id = String(body?.id || body?.bookingId || "").trim();
    const approvedBy = String(body?.approvedBy || "admin").trim();

    if (!id) {
      return json(400, { ok: false, error: "MISSING_ID" });
    }

    const existing = await getBooking(id);
    if (!existing) {
      return json(404, { ok: false, error: "NOT_FOUND" });
    }

    const patch = {
      status: "APPROVED",
      locked: true,
      approvedAt: Date.now(),
      approvedBy,
    };

    const updated = await upsertBooking(id, patch);

    await appendAudit({
      bookingId: id,
      actorType: "admin",
      actorId: approvedBy,
      action: "approve",
      diff: patch,
      ip: event.headers?.["x-forwarded-for"] || "",
    });

    return json(200, { ok: true, booking: updated });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "SERVER_ERROR" });
  }
};
