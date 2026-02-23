import type { Handler } from "@netlify/functions";
import { getBooking, upsertBooking } from "./shared/storage";

export const handler: Handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Missing id" }),
      };
    }

    // If booking doesn't exist yet, create an empty one.
    booking = await upsertBooking(id, {
  id,
  locked: false,
  status: "draft",
  data: {
    guests: [],
    tables: [],
    menu: {},
    notes: "",
  },
});

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, booking }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: err?.message || "Server error",
      }),
    };
  }
};