import type { Handler } from "@netlify/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const code = String(body?.code || "").trim();

    if (!code) {
      return json(400, { ok: false, error: "MISSING_CODE" });
    }

    const hash = process.env.ADMIN_CODE_HASH;
    const secret = process.env.ADMIN_JWT_SECRET;

    if (!hash || !secret) {
      return json(500, { ok: false, error: "SERVER_MISCONFIG" });
    }

    const valid = await bcrypt.compare(code, hash);
    if (!valid) {
      return json(401, { ok: false, error: "INVALID_CODE" });
    }

    const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "15m" });
    return json(200, { ok: true, token });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "SERVER_ERROR" });
  }
};
