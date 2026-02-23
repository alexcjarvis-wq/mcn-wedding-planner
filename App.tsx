import React, { useEffect, useMemo, useState } from "react";
import type { View, WeddingBooking, GuestSession } from "./types";

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

import { saveBooking } from "./services/bookingService";

const ADMIN_TOKEN_KEY = "adminToken";
const GUEST_SESSION_KEY = "mcn_guest_session";

function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function setAdminToken(token: string) {
  if (!token) {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function newEmptyWedding(id: string): WeddingBooking {
  return {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    locked: false,
    status: "draft",
    data: {},
  } as WeddingBooking;
}

export default function App() {
  const [view, setView] = useState<View>("LANDING" as View);
  const [selectedWedding, setSelectedWedding] = useState<WeddingBooking | null>(null);

  const [guestSession, setGuestSession] = useState<GuestSession | null>(() =>
    safeJsonParse<GuestSession | null>(localStorage.getItem(GUEST_SESSION_KEY), null)
  );

  const [adminCode, setAdminCode] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => !!getAdminToken());

  const [busy, setBusy] = useState(false);

  const bookingIdForTest = useMemo(() => selectedWedding?.id || guestSession?.weddingId || "test", [
    selectedWedding?.id,
    guestSession?.weddingId,
  ]);

  useEffect(() => {
    if (guestSession) localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestSession));
    else localStorage.removeItem(GUEST_SESSION_KEY);
  }, [guestSession]);

  function go(v: View) {
    setView(v);
  }

  function requireAdmin(next: View) {
    if (!getAdminToken()) {
      setIsAdminAuthenticated(false);
      alert("Admin session missing. Please log in again.");
      go("LANDING" as View);
      return false;
    }
    return true;
  }

  async function adminVerify(code: string) {
    const res = await fetch("/.netlify/functions/admin-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok || !json?.token) {
      return { ok: false, error: json?.error || "Admin login failed" };
    }
    return { ok: true, token: String(json.token) };
  }

  async function onAdminLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = adminCode.trim();
    if (!code) return;

    setBusy(true);
    try {
      const r = await adminVerify(code);
      if (!r.ok) {
        alert(r.error || "Login failed");
        return;
      }

      setAdminToken(r.token);
      setIsAdminAuthenticated(true);
      setAdminCode("");
      go("ADMIN_DASHBOARD" as View);
    } finally {
      setBusy(false);
    }
  }

  function onAdminLogout() {
    setAdminToken("");
    setIsAdminAuthenticated(false);
    setSelectedWedding(null);
    go("LANDING" as View);
  }

  function onGuestLogin(weddingId: string) {
    const id = (weddingId || "").trim();
    if (!id) {
      alert("Missing wedding id");
      return;
    }

    setGuestSession({ weddingId: id } as GuestSession);
    setSelectedWedding(newEmptyWedding(id));
    go("COUPLE_PORTAL" as View);
  }

  function onSelectWedding(w: WeddingBooking) {
    setSelectedWedding(w);
  }

  async function onSaveWedding(updated: WeddingBooking) {
    setSelectedWedding(updated);

    const bookingId = updated?.id || guestSession?.weddingId;
    if (!bookingId) {
      alert("Missing booking id");
      return;
    }

    const r = await saveBooking(bookingId, updated, "GUEST");
    if (!r.ok) {
      alert(r.error || "Save failed");
      return;
    }
  }

  async function testSave() {
    setBusy(true);
    try {
      const payload = {
        id: bookingIdForTest,
        locked: false,
        status: "draft",
        data: {
          test: true,
          at: new Date().toISOString(),
        },
      };

      const r = await saveBooking(bookingIdForTest, payload, isAdminAuthenticated ? "ADMIN" : "GUEST");
      if (!r.ok) {
        alert(r.error || "Save failed");
        return;
      }

      alert("Saved OK. Check console.");
      // eslint-disable-next-line no-console
      console.log("save result", r);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f0ea] text-[#2f2622]">
      {view === ("LANDING" as View) && (
        <LandingPage
          onNavigate={(v: View) => {
            // If user clicks Admin areas, require a real token first
            if (
              v === ("ADMIN_DASHBOARD" as View) ||
              v === ("ENQUIRY_MANAGER" as View) ||
              v === ("KITCHEN_OPS" as View)
            ) {
              if (!getAdminToken()) {
                alert("Enter staff code first.");
                return;
              }
            }
            go(v);
          }}
        />
      )}

      {view === ("ADMIN_DASHBOARD" as View) && (
        <>
          {!getAdminToken() ? (
            <div className="max-w-md mx-auto p-6">
              <h2 className="text-xl font-semibold mb-3">Staff Login</h2>
              <form onSubmit={onAdminLoginSubmit} className="space-y-3">
                <input
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter staff code"
                  className="w-full p-3 rounded-lg border border-black/10"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full p-3 rounded-lg bg-[#3d332f] text-white disabled:opacity-50"
                >
                  {busy ? "Signing in..." : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => go("LANDING" as View)}
                  className="w-full p-3 rounded-lg border border-black/10"
                >
                  Back
                </button>
              </form>
            </div>
          ) : (
            <AdminDashboard
              onNavigate={(v: View) => {
                if (!requireAdmin(v)) return;
                go(v);
              }}
              weddings={[]}
              onSelectWedding={onSelectWedding}
              onAddWedding={() => go("ADD_WEDDING" as View)}
              onLogout={onAdminLogout}
            />
          )}
        </>
      )}

      {view === ("ENQUIRY_MANAGER" as View) && (
        <>
          {requireAdmin(view) && (
            <EnquiryManager
              onNavigate={(v: View) => {
                if (!requireAdmin(v)) return;
                go(v);
              }}
            />
          )}
        </>
      )}

      {view === ("COUPLE_PORTAL" as View) && (
        <CouplePortal
          onNavigate={(v: View) => go(v)}
          wedding={selectedWedding}
          onSave={onSaveWedding}
          guestSession={guestSession}
          onGuestLogin={onGuestLogin}
        />
      )}

      {view === ("BRIDE_GROOM_PORTAL" as View) && (
        <BrideGroomPortal
          onNavigate={(v: View) => go(v)}
          wedding={selectedWedding}
          onSave={onSaveWedding}
          isAdminAccess={!!getAdminToken()}
        />
      )}

      {view === ("MENU_SELECTION" as View) && (
        <MenuSelection
          onNavigate={(v: View) => go(v)}
          wedding={selectedWedding}
          onSave={onSaveWedding}
        />
      )}

      {view === ("KITCHEN_OPS" as View) && (
        <>
          {requireAdmin(view) && (
            <KitchenOps
              onNavigate={(v: View) => {
                if (!requireAdmin(v)) return;
                go(v);
              }}
              wedding={selectedWedding}
            />
          )}
        </>
      )}

      {view === ("GUEST_LIST_PLANNER" as View) && (
        <GuestListPlanner
          onNavigate={(v: View) => go(v)}
          wedding={selectedWedding}
          onSave={onSaveWedding}
        />
      )}

      {view === ("SEATING_PLANNER" as View) && (
        <SeatingPlanner
          onNavigate={(v: View) => go(v)}
          wedding={selectedWedding}
          onSave={onSaveWedding}
        />
      )}

      {view === ("ADD_WEDDING" as View) && (
        <>
          {requireAdmin(view) && (
            <AddWedding
              onNavigate={(v: View) => {
                if (!requireAdmin(v)) return;
                go(v);
              }}
            />
          )}
        </>
      )}

      {view === ("BOOKING_CONFIRMATION" as View) && (
        <BookingConfirmation onNavigate={(v: View) => go(v)} wedding={selectedWedding} />
      )}

      <button
        type="button"
        onClick={testSave}
        disabled={busy}
        className="fixed bottom-4 right-4 bg-white border border-black/10 shadow-lg rounded-xl px-4 py-3 text-sm disabled:opacity-50"
      >
        Test Save
      </button>
    </div>
  );
}