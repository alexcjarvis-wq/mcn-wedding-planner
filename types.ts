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

export type BookingStatus = "draft" | "submitted" | "approved" | "cancelled";

export type GuestSession = {
  weddingId: string;
  guestName?: string;
  guestEmail?: string;
};

export type Guest = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  diet?: string;
  notes?: string;
  tableId?: string;
};

export type Table = {
  id: string;
  name: string;
  seats: number;
  x?: number;
  y?: number;
  rotation?: number;
  shape?: "round" | "rect" | "top" | "other";
};

export type AuditEntry = {
  id?: string;
  bookingId: string;
  actorType: "ADMIN" | "GUEST" | "SYSTEM";
  actorId?: string;
  action: string;
  at?: string;
  diff?: any;
  meta?: any;
};

export type WeddingBooking = {
  id: string;
  reference?: string;
  referenceLower?: string;

  createdAt: string;
  updatedAt: string;

  locked: boolean;
  status: BookingStatus;

  venue?: string;

  data: Record<string, any>;

  guests?: Guest[];
  tables?: Table[];
};

export const defaultBookingData: WeddingBooking["data"] = {
  venue: "",
  couple: {
    name1: "",
    name2: "",
  },
  date: "",
  email: "",
  phone: "",
};