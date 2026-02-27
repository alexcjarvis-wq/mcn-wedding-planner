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

export enum View {
LANDING = "LANDING",
ADMIN_DASHBOARD = "ADMIN_DASHBOARD",
COUPLE_PORTAL = "COUPLE_PORTAL",
ADD_WEDDING = "ADD_WEDDING",
BOOKING_CONFIRMATION = "BOOKING_CONFIRMATION",
}

export const defaultBookingData: WeddingBooking["data"] = {
venue: "",
couple: { name1: "", name2: "" },
date: "",
email: "",
phone: "",
};