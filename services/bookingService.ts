// services/bookingService.ts

type SaveActor = "GUEST" | "ADMIN";

function getAdminToken() {
  return sessionStorage.getItem("adminToken") || "";
}

function functionUrl(name: string) {
  return `/.netlify/functions/${name}`;
}

export async function saveBooking(
  bookingId: string,
  patch: unknown,
  actor: SaveActor = "GUEST",
  actorId: string = "guest"
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = getAdminToken();

    // If caller says ADMIN, attach token if present.
    if (actor === "ADMIN" && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(functionUrl("booking-save"), {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: bookingId,
        patch,
        actorType: actor === "ADMIN" ? "admin" : "guest",
        actorId: actorId || (actor === "ADMIN" ? "admin" : "guest"),
      }),
    });

    let result: any = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok || result?.ok !== true) {
      return {
        ok: false,
        error: result?.error || `Save failed (HTTP ${response.status})`,
        code: result?.code,
        status: response.status,
      };
    }

    return { ok: true, booking: result.booking, data: result };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Network error" };
  }
}

export async function approveBooking(bookingId: string, approvedBy: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(functionUrl("booking-approve"), {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: bookingId,
        approvedBy,
      }),
    });

    let result: any = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok || result?.ok !== true) {
      return {
        ok: false,
        error: result?.error || `Approve failed (HTTP ${response.status})`,
        status: response.status,
      };
    }

    return { ok: true, booking: result.booking, data: result };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Network error" };
  }
}