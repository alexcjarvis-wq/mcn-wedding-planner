import type { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { getBooking, upsertBooking, appendAudit } from "./shared/storage";

function getBearerToken(event: any): string | null {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (!auth) return null;
  if (!auth.startsWith("Bearer ")) return null;
  return auth.replace("Bearer ", "");
}

function verifyAdminToken(event: any): boolean {
  try {
    const token = getBearerToken(event);
    if (!token) return false;

    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return false;

    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const { id, patch, actorType = "guest", actorId = "unknown" } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Missing booking id" }),
      };
    }

    const isAdmin = verifyAdminToken(event);

    const existing = await getBooking(id);

    if (existing?.locked && !isAdmin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ ok: false, error: "Booking is locked" }),
      };
    }

    const updated = await upsertBooking(id, {
      ...existing,
      ...patch,
    });

    await appendAudit({
      bookingId: id,
      actorType: isAdmin ? "admin" : actorType,
      actorId,
      action: "save",
      diff: patch,
      ip: event.headers["x-forwarded-for"] || "",
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, booking: updated }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: err?.message || "Server error",
      }),
    };
  }
};