import type { Handler } from "@netlify/functions";
import { findBookingByReference } from "./shared/storage";

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  try {
    const reference = String(event.queryStringParameters?.reference || "").trim();
    if (!reference) return json(400, { ok: false, error: "MISSING_REFERENCE" });

    const booking = await findBookingByReference(reference);
    if (!booking) return json(404, { ok: false, error: "NOT_FOUND" });

    return json(200, { ok: true, booking });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "SERVER_ERROR" });
  }
};
