import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./shared/auth";
import { upsertBooking, appendAudit } from "./shared/storage";

function json(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeRef() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const auth = requireAdmin(event);
  if (!auth.ok) return auth.response;

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const createdBy = String(body?.createdBy || "admin").trim();

    const id = String(body?.id || "").trim() || makeId();
    const reference = String(body?.reference || "").trim() || makeRef();
    const surname = String(body?.surname || "").trim();
    const coupleName1 = String(body?.coupleName1 || "").trim();
    const coupleName2 = String(body?.coupleName2 || "").trim();
    const weddingDate = String(body?.weddingDate || "").trim();
    const venue = String(body?.venue || "").trim();
    const passwordHash = String(body?.passwordHash || "").trim();
    const published = Boolean(body?.published);

    if (!surname || !weddingDate || !venue || !passwordHash) {
      return json(400, { ok: false, error: "MISSING_FIELDS" });
    }

    const record = {
      id,
      reference,
      referenceLower: reference.toLowerCase(),
      surname,
      surnameLower: surname.toLowerCase(),
      coupleName1,
      coupleName2,
      weddingDate,
      venue,
      passwordHash,
      status: "ACTIVE",
      locked: false,
      failedLoginCount: 0,
      published,
      guests: [],
      menuSelections: body?.menuSelections || {
        canapesSelectedIds: [],
        startersSelectedIds: [],
        mainsSelectedIds: [],
        dessertsSelectedIds: [],
        childrenStarterId: null,
        childrenMainId: null,
        childrenDessertId: null,
        eveningFoodId: null,
        selectedPizzaIds: [],
        selectedStreetFoodIds: [],
        selectedHogRoastSideIds: [],
      },
      documents: body?.documents || [],
      tablePlan: body?.tablePlan || {},
      welcomeMessage: body?.welcomeMessage || "",
      heroImage:
        body?.heroImage ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
      coordinator: body?.coordinator || null,
      showCountdown: body?.showCountdown !== false,
      totalValue: Number(body?.totalValue || 0),
      paidValue: Number(body?.paidValue || 0),
    };

    const booking = await upsertBooking(id, record);

    await appendAudit({
      bookingId: id,
      actorType: "admin",
      actorId: createdBy,
      action: "create",
      diff: { reference, surname, weddingDate, venue, published },
      ip: event.headers?.["x-forwarded-for"] || "",
    });

    return json(200, { ok: true, booking });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "SERVER_ERROR" });
  }
};
