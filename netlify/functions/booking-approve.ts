import type { Handler } from "@netlify/functions";

type ApprovePayload = {
  bookingId: string;
  approvedBy?: string;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  try {
    const body: ApprovePayload = event.body ? JSON.parse(event.body) : (null as any);

    const bookingId = body?.bookingId;
    const approvedBy = body?.approvedBy || "Guest";

    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Missing bookingId" }),
      };
    }

    const approvedAt = Date.now();

    // TEMP: We are not persisting yet, we are returning what approval would set.
    // Next step: load existing booking from storage, update it, then save.
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        bookingId,
        patch: {
          status: "APPROVED",
          locked: true,
          approvedAt,
          approvedBy,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Server error" }),
    };
  }
};
