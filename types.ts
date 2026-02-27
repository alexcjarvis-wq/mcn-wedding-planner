export type View =
| "LANDING"
| "ADMIN_DASHBOARD"
| "ENQUIRY_MANAGER"
| "COUPLE_PORTAL"
| "BRIDE_GROOM_PORTAL"
| "MENU_SELECTION"
| "KITCHEN_OPS"
| "GUEST_LIST_PLANNER"
| "SEATING_PLANNER"
| "ADD_WEDDING"
| "BOOKING_CONFIRMATION";

export type WeddingBooking = {
id: string;
createdAt: string;
updatedAt: string;
locked: boolean;
status: "draft" | "submitted" | "approved" | "cancelled";
venue?: string;
data: Record<string, any>;
};

export const defaultBookingData: WeddingBooking["data"] = {
venue: "",
couple: { name1: "", name2: "" },
date: "",
email: "",
phone: "",
};