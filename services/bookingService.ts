// services/bookingService.ts

type SaveActor = "GUEST" | "ADMIN";

function getAdminToken() {
  return sessionStorage.getItem("adminToken") || "";
}

export async function saveBooking(
  bookingId: string,
  data: unknown,
  actor: SaveActor = "GUEST"
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (actor === "ADMIN") {
      const token = getAdminToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("/api/booking/save", {
      method: "POST",
      headers,
      body: JSON.stringify({
        bookingId,
        data,
        actor,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result?.ok) {
      return { ok: false, error: result?.error || "Save failed", code: result?.code };
    }

    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function approveBooking(bookingId: string, approvedBy: string) {
  try {
    const response = await fetch("/api/booking/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, approvedBy }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result?.ok) {
      return { ok: false, error: result?.error || "Approve failed" };
    }

    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error };
  }
}
