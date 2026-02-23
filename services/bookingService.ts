const ADMIN_TOKEN_KEY = "adminToken";

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

function authHeaders(role: "ADMIN" | "GUEST") {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (role === "ADMIN") {
    const token = getAdminToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function saveBooking(
  id: string,
  booking: any,
  role: "ADMIN" | "GUEST"
) {
  const res = await fetch("/.netlify/functions/booking-save", {
    method: "POST",
    headers: authHeaders(role),
    body: JSON.stringify({ id, booking }),
  });

  return res.json();
}

export async function listBookings() {
  const res = await fetch("/.netlify/functions/booking-list", {
    headers: authHeaders("ADMIN"),
  });

  return res.json();
}

export async function createBooking(data: any) {
  const res = await fetch("/.netlify/functions/booking-create", {
    method: "POST",
    headers: authHeaders("ADMIN"),
    body: JSON.stringify(data),
  });

  return res.json();
}