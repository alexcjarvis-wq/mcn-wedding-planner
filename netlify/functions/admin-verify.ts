import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const json = (statusCode: number, body: any) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
})

const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" })
  }

  const body = JSON.parse(event.body || "{}")
  const code = body.code

  if (!code) {
    return json(400, { ok: false, error: "MISSING_CODE" })
  }

  const hash = process.env.ADMIN_CODE_HASH
  const secret = process.env.ADMIN_JWT_SECRET

  if (!hash || !secret) {
    return json(500, { ok: false, error: "SERVER_MISCONFIG" })
  }

  const valid = await bcrypt.compare(String(code), hash)

  if (!valid) {
    return json(401, { ok: false, error: "INVALID_CODE" })
  }

  const token = jwt.sign(
    { role: "admin" },
    secret,
    { expiresIn: "15m" }
  )

  return json(200, { ok: true, token })
}

exports.handler = handler
