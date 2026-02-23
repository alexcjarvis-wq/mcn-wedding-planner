import React, { useEffect, useState } from "react";
import type { View, WeddingBooking, GuestSession } from "./types";
import { defaultBookingData } from "./types";

import LandingPage from "./views/LandingPage";
import AdminDashboard from "./views/AdminDashboard";
import EnquiryManager from "./views/EnquiryManager";
import CouplePortal from "./views/CouplePortal";
import BrideGroomPortal from "./views/BrideGroomPortal";
import MenuSelection from "./views/MenuSelection";
import KitchenOps from "./views/KitchenOps";
import GuestListPlanner from "./views/GuestListPlanner";
import SeatingPlanner from "./views/SeatingPlanner";
import AddWedding from "./views/AddWedding";
import BookingConfirmation from "./views/BookingConfirmation";

import { verifyAdmin, findBookingByReference, getBooking } from "./services/bookingService";

const mockHash = (str: string) => `hash_${str}`;

type StoredGuestSession = {
  bookingId: string;
  guestName: string;
  role: string;
};

function normalizeBooking(b: any): WeddingBooking {
  const base: any = defaultBookingData as any;
  const baseData = base && base.data ? base.data : { guests: [], tables: [], menu: {}, notes: "" };

  return {
    ...(base as any),
    ...(b || {}),
    data: {
      guests: [],
      tables: [],
      menu: {},
      notes: "",
      ...(baseData || {}),
      ...((b && b.data) ? b.data : {}),
    },
  } as WeddingBooking;
}

export default function App() {
  const [view, setView] = useState<View>("LANDING" as any);
  const [selectedBooking, setSelectedBooking] = useState<WeddingBooking | null>(null);
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [isAdminAccess, setIsAdminAccess] = useState(false);

  useEffect(() => {
    const adminToken = sessionStorage.getItem("mcn_admin_token");
    if (adminToken) setIsAdminAccess(true);

    const raw = sessionStorage.getItem("mcn_guest_session");
    if (!raw) return;

    let s: StoredGuestSession | null = null;
    try {
      s = JSON.parse(raw);
    } catch {
      s = null;
    }
    if (!s?.bookingId) return;

    getBooking(s.bookingId)
      .then((res: any) => {
        if (!res?.ok || !res?.booking) return;
        setSelectedBooking(normalizeBooking(res.booking));
        setGuestSession({ guestName: s!.guestName, role: s!.role } as any);
        setView("BRIDE_GROOM_PORTAL" as any);
      })
      .catch(() => {
        sessionStorage.removeItem("mcn_guest_session");
      });
  }, []);

  const onNavigate = (v: View) => setView(v);

  const onLogoutAdmin = () => {
    sessionStorage.removeItem("mcn_admin_token");
    setIsAdminAccess(false);
    setSelectedBooking(null);
    setView("LANDING" as any);
  };

  const handleAdminLogin = async (code: string) => {
    const res: any = await verifyAdmin(code);
    if (!res?.ok || !res?.token) throw new Error(res?.error || "Login failed");
    sessionStorage.setItem("mcn_admin_token", res.token);
    setIsAdminAccess(true);
    setView("ADMIN_DASHBOARD" as any);
  };

  const handleGuestLogin = async (reference: string, surname: string, password: string) => {
    const res: any = await findBookingByReference(reference);
    if (!res?.ok || !res?.booking) throw new Error(res?.error || "Booking not found");

    const booking = res.booking as WeddingBooking;

    const surnameOk =
      String((booking as any).surname || "").trim().toLowerCase() ===
      String(surname || "").trim().toLowerCase();
    const passOk = (booking as any).passwordHash === mockHash(password);

    if (!surnameOk || !passOk) throw new Error("Incorrect details");

    const session: StoredGuestSession = {
      bookingId: booking.id,
      guestName: (booking as any).coupleName1 || "Guest",
      role: "couple",
    };

    sessionStorage.setItem("mcn_guest_session", JSON.stringify(session));
    setSelectedBooking(normalizeBooking(booking));
    setGuestSession({ guestName: session.guestName, role: session.role } as any);
    setView("BRIDE_GROOM_PORTAL" as any);
  };

  const handleAdminSelectBooking = (booking: WeddingBooking) => {
    setSelectedBooking(normalizeBooking(booking));
    setView("BRIDE_GROOM_PORTAL" as any);
  };

  if ((view as any) === "LANDING") {
    return <LandingPage onAdminLogin={handleAdminLogin} onGuestLogin={handleGuestLogin} onNavigate={onNavigate} />;
  }

  if ((view as any) === "ADMIN_DASHBOARD") {
    return <AdminDashboard onNavigate={onNavigate} onSelectBooking={handleAdminSelectBooking} onLogout={onLogoutAdmin} />;
  }

  if ((view as any) === "ADD_WEDDING") {
    return <AddWedding onNavigate={onNavigate} />;
  }

  if ((view as any) === "BOOKING_CONFIRMATION") {
    return <BookingConfirmation onNavigate={onNavigate} />;
  }

  if (!selectedBooking) {
    return <LandingPage onAdminLogin={handleAdminLogin} onGuestLogin={handleGuestLogin} onNavigate={onNavigate} />;
  }

  if ((view as any) === "ENQUIRY_MANAGER") {
    return <EnquiryManager onNavigate={onNavigate} />;
  }

  if ((view as any) === "COUPLE_PORTAL") {
    return <CouplePortal onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} />;
  }

  if ((view as any) === "BRIDE_GROOM_PORTAL") {
    return <BrideGroomPortal onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} isAdminAccess={isAdminAccess} />;
  }

  if ((view as any) === "MENU_SELECTION") {
    return <MenuSelection onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} isAdminAccess={isAdminAccess} />;
  }

  if ((view as any) === "KITCHEN_OPS") {
    return <KitchenOps onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} isAdminAccess={isAdminAccess} />;
  }

  if ((view as any) === "GUEST_LIST_PLANNER") {
    return <GuestListPlanner onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} isAdminAccess={isAdminAccess} />;
  }

  if ((view as any) === "SEATING_PLANNER") {
    return <SeatingPlanner onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} isAdminAccess={isAdminAccess} />;
  }

  return <BrideGroomPortal onNavigate={onNavigate} wedding={selectedBooking} onSave={setSelectedBooking} isAdminAccess={isAdminAccess} />;
}