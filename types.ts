// types.ts

// Runtime view map (so code like View.LANDING works)
export const View = {
  LANDING: "LANDING",
  GUEST_LOGIN: "GUEST_LOGIN",
  ADMIN_DASHBOARD: "ADMIN_DASHBOARD",
  ENQUIRY_MANAGER: "ENQUIRY_MANAGER",
  COUPLE_PORTAL: "COUPLE_PORTAL",
  BRIDE_GROOM_PORTAL: "BRIDE_GROOM_PORTAL",
  MENU_SELECTION: "MENU_SELECTION",
  KITCHEN_OPS: "KITCHEN_OPS",
  GUEST_LIST_PLANNER: "GUEST_LIST_PLANNER",
  SEATING_PLANNER: "SEATING_PLANNER",
  ADD_WEDDING: "ADD_WEDDING",
  BOOKING_CONFIRMATION: "BOOKING_CONFIRMATION",
} as const;

// Type for View values
export type View = (typeof View)[keyof typeof View];

export type RSVPStatus = "Confirmed" | "Pending" | "Declined";
export type GuestSide = "Bride" | "Groom" | "Mutual";
export type TableType = "Round" | "Long";
export type BookingStatus = "draft" | "submitted" | "approved";

export interface DietaryInfo {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  allergyNotes: string;
}

export interface Guest {
  id: string;
  name: string;
  rsvpStatus: RSVPStatus;
  isChild?: boolean;
  starterChoice?: string;
  mealChoice?: string;
  dessertChoice?: string;
  dietary: DietaryInfo;
  tableId: string | null;
  seatNumber?: number;
  side: GuestSide;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  type: TableType;
}

// What the front end saves.
// Keep it flexible so your UI can evolve without type fights.
export interface BookingData {
  [key: string]: unknown;
}

export interface WeddingBooking {
  id: string;

  locked: boolean;
  status: BookingStatus;

  // App data blob (menu picks, guests, tables, notes, etc)
  data: BookingData;

  createdAt?: string;
  updatedAt?: string;

  // Optional fields some screens may use
  coupleName?: string;
  venue?: string;
  weddingDate?: string;
}

// Guest session stored in localStorage for couples/guests
export interface GuestSession {
  bookingId: string;
  guestName?: string;
  role?: "GUEST" | "COUPLE";
  createdAt?: string;
}

// Your app imports this in App.tsx.
// Keep it minimal. Server fills id and timestamps.
export const defaultBookingData: Pick<WeddingBooking, "locked" | "status" | "data"> = {
  locked: false,
  status: "draft",
  data: {
    guests: [],
    tables: [],
    menu: {},
    notes: "",
  },
};