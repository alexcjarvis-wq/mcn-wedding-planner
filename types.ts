export enum View {
  LANDING = 'LANDING',
  GUEST_LOGIN = 'GUEST_LOGIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ENQUIRY_MANAGER = 'ENQUIRY_MANAGER',
  COUPLE_PORTAL = 'COUPLE_PORTAL',
  BRIDE_GROOM = 'BRIDE_GROOM',
  MENU_SELECTION = 'MENU_SELECTION',
  KITCHEN_OPS = 'KITCHEN_OPS',
  GUEST_LIST_PLANNER = 'GUEST_LIST_PLANNER',
  SEATING_PLANNER = 'SEATING_PLANNER',
  ADD_WEDDING = 'ADD_WEDDING',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION'
}

export interface AuditEntry {
  at: number;
  by: string;
  reason: string;
  changes: string;
}

export interface WeddingBooking {
  id: string;
  reference: string;
  surname: string;
  coupleName1: string;
  coupleName2: string;
  weddingDate: string;
  venue: string;
  email?: string;
  passwordHash: string;
  status: 'active' | 'cancelled' | 'APPROVED';
  locked: boolean;
  approvedAt?: number;
  approvedBy?: string;
  audit?: AuditEntry[];
  createdAt: number;
  lastLoginAt?: number;
  failedLoginCount: number;
  lockedUntil?: number;
  welcomeMessage: string;
  heroImage: string;
  coordinator: { name: string; img: string } | null;
  showCountdown: boolean;
  totalValue: number;
  paidValue: number;
  published: boolean;
  guests: Guest[];
  menuSelections: MenuSelections;
  documents: any[];
  tablePlan: any;
  menuApproved?: boolean;
  menuApprovedAt?: number;
  hasCanapes?: boolean;
  hasChildren?: boolean;
}

export interface MenuSelections {
  canapesSelectedIds: string[];
  startersSelectedIds: string[];
  mainsSelectedIds: string[];
  dessertsSelectedIds: string[];
  childrenStarterId: string | null;
  childrenMainId: string | null;
  childrenDessertId: string | null;
  eveningFoodId: string | null;
  selectedPizzaIds: string[];
  selectedStreetFoodIds: string[];
  selectedHogRoastSideIds: string[];
}

export interface GuestSession {
  bookingId: string;
  token: string;
  expiresAt: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  revenue: string;
  status: string;
  leads: number;
  image: string;
}

export interface Enquiry {
  id: string;
  couple: string;
  email: string;
  date: string;
  status: string;
  source: string;
  lastContact: string;
  guests: number;
  initials: string;
}

export interface Guest {
  id: string;
  name: string;
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
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
  side: 'Bride' | 'Groom' | 'Mutual';
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  type: 'Round' | 'Long';
}