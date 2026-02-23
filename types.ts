// types.ts

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

export interface Guest {
  id: string;
  name: string;
  rsvpStatus: "Confirmed" | "Pending" | "Declined";
  isChild?: boolean;
  starterChoice?: string;
  mealChoice?: string;
  dessertChoice?: string;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    allergyNotes: string;
  };
  tableId: string | null;
  seatNumber?: number;
  side: "Bride" | "Groom" | "Mutual";
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  type: "Round" | "Long";
}

export interface WeddingBooking {
  id: string;
  coupleName?: string;
  venue?: string;
  weddingDate?: string;
  locked: boolean;
  lockedAt?: string | null;
  lockedBy?: string | null;
  status: string;
  data: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuestSession {
  bookingId: string;
  guestId?: string;
}

export const defaultBookingData = {
id: "",
coupleName: "",
venue: "",
weddingDate: "",
locked: false,
status: "draft",
data: {},
createdAt: "",
updatedAt: "",
};