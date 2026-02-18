import jwt from "jsonwebtoken"

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }
}

function getToken(event: any): string | null {
  const auth = event.headers?.authorization || event.headers?.Authorization
  if (!auth) return null
  if (!auth.startsWith("Bearer ")) return null
  return auth.replace("Bearer ", "")
}

function isAdmin(event: any): boolean {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) return false

  const token = getToken(event)
  if (!token) return false

  try {
    const decoded: any = jwt.verify(token, secret)
    return decoded.role === "admin"
  } catch {
    return false
  }
}

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false })
  }

  const body = event.body ? JSON.parse(event.body) : null
  const data = body?.data

  if (!data) {
    return json(400, { ok: false, error: "NO_DATA" })
  }

  const locked = Boolean(data.locked)
  const admin = isAdmin(event)

  if (locked && !admin) {
    return json(403, { ok: false, error: "LOCKED" })
  }

  return json(200, {
    ok: true,
    adminOverride: admin
  })
}
