import type { Handler } from "@netlify/functions";
import { getBooking, upsertBooking, appendAudit } from "./shared/storage";
import { verifyAdmin } from "./shared/auth";

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" });
    }

    const body = JSON.parse(event.body || "{}");
    const { id, patch, actorType = "guest", actorId = "unknown" } = body;

    if (!id) {
      return json(400, { ok: false, error: "MISSING_ID" });
    }

    const isAdmin = verifyAdmin(event).ok;

    const existing = await getBooking(id);

    if (existing?.locked && !isAdmin) {
      return json(403, { ok: false, error: "LOCKED" });
    }

    const updated = await upsertBooking(id, { ...patch });

    await appendAudit({
      bookingId: id,
      actorType: isAdmin ? "admin" : actorType,
      actorId,
      action: "save",
      diff: patch,
      ip: event.headers["x-forwarded-for"] || "",
    });

    return json(200, { ok: true, booking: updated });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "SERVER_ERROR" });
  }
};