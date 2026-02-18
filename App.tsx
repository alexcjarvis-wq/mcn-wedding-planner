import React, { useState, useEffect } from 'react';
import { View, WeddingBooking, GuestSession } from './types';
import LandingPage from './views/LandingPage';
import AdminDashboard from './views/AdminDashboard';
import EnquiryManager from './views/EnquiryManager';
import CouplePortal from './views/CouplePortal';
import BrideGroomPortal from './views/BrideGroomPortal';
import MenuSelection from './views/MenuSelection';
import KitchenOps from './views/KitchenOps';
import GuestListPlanner from './views/GuestListPlanner';
import SeatingPlanner from './views/SeatingPlanner';
import AddWedding from './views/AddWedding';
import BookingConfirmation from './views/BookingConfirmation';
import { saveBooking } from "./services/bookingService";

const mockHash = (str: string) => `hash_${str}`;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [activeBooking, setActiveBooking] = useState<WeddingBooking | null>(null);
  
  const [loginReference, setLoginReference] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('mcn_guest_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt > Date.now()) {
        setGuestSession(parsed);
        const weddings = JSON.parse(localStorage.getItem('mcn_weddings') || '[]');
        const booking = weddings.find((w: WeddingBooking) => w.id === parsed.bookingId);
        if (booking && booking.status === 'active') {
          setActiveBooking(booking);
          // If a guest is logged in and we are at the landing/login pages, go to portal
          if (currentView === View.LANDING || currentView === View.GUEST_LOGIN) {
            setCurrentView(View.COUPLE_PORTAL);
          }
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleNavigate = (view: View) => {
    const ADMIN_ONLY = [View.ADMIN_DASHBOARD, View.ENQUIRY_MANAGER, View.ADD_WEDDING, View.BOOKING_CONFIRMATION];
    const GUEST_ONLY = [View.COUPLE_PORTAL, View.BRIDE_GROOM, View.GUEST_LIST_PLANNER, View.SEATING_PLANNER, View.MENU_SELECTION, View.KITCHEN_OPS];

    if (ADMIN_ONLY.includes(view) && !isAdminAuthenticated) {
      setCurrentView(View.ADMIN_LOGIN);
      return;
    }
    
    if (GUEST_ONLY.includes(view) && !activeBooking && !isAdminAuthenticated) {
      setCurrentView(View.GUEST_LOGIN);
      return;
    }

    setCurrentView(view);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setGuestSession(null);
    setActiveBooking(null);
    localStorage.removeItem('mcn_guest_session');
    setCurrentView(View.LANDING);
  };

  const updateWeddingData = async (updated: WeddingBooking) => {
  if (activeBooking && activeBooking.id === updated.id) {
    setActiveBooking(updated);
  }

  // Keep localStorage for now as a backup
 const weddings = JSON.parse(localStorage.getItem("mcn_weddings") || "[]");



  const updatedWeddings = weddings.map((w: WeddingBooking) =>
    w.id === updated.id ? updated : w
  );
  localStorage.setItem("mcn_weddings", JSON.stringify(updatedWeddings));

  // New: save to backend
  const res = await saveBooking(updated.id, updated);

  if (!res.ok) {
    console.error("Backend save failed:", res.error);
    alert("Save failed. Please try again.");
  } else {
    console.log("Backend save OK:", res.data);
  }
};


  const handleAdminEnterPlanner = (wedding: WeddingBooking) => {
    setActiveBooking(wedding);
    handleNavigate(View.SEATING_PLANNER);
  };

  const handleAdminViewHub = (wedding: WeddingBooking) => {
    setActiveBooking(wedding);
    handleNavigate(View.BRIDE_GROOM);
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const weddings = JSON.parse(localStorage.getItem('mcn_weddings') || '[]');
    const booking = weddings.find((w: WeddingBooking) => 
      w.reference.toLowerCase() === loginReference.toLowerCase() || 
      w.surname.toLowerCase() === loginReference.toLowerCase()
    );
    if (!booking) { setLoginError("Booking not found"); return; }
    if (booking.status === 'cancelled') { setLoginError("This booking is inactive."); return; }
    if (booking.passwordHash === mockHash(loginPassword)) {
      const session: GuestSession = {
        bookingId: booking.id,
        token: Math.random().toString(36).substring(7),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      };
      const updatedBooking = { ...booking, failedLoginCount: 0, lastLoginAt: Date.now(), lockedUntil: undefined };
      const updatedWeddings = weddings.map((w: WeddingBooking) => w.id === booking.id ? updatedBooking : w);
      localStorage.setItem('mcn_weddings', JSON.stringify(updatedWeddings));
      localStorage.setItem('mcn_guest_session', JSON.stringify(session));
      setGuestSession(session);
      setActiveBooking(updatedBooking);
      setLoginPassword('');
      setLoginReference('');
      setCurrentView(View.COUPLE_PORTAL);
    } else {
      setLoginError("Incorrect password");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === '0000') {
      setIsAdminAuthenticated(true);
      setCurrentView(View.ADMIN_DASHBOARD);
      setLoginPassword('');
    } else {
      setLoginError("Invalid Admin PIN");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING: return <LandingPage onNavigate={handleNavigate} isAdminAuthenticated={isAdminAuthenticated} activeBooking={activeBooking} onLogout={handleLogout} />;
      case View.GUEST_LOGIN:
        return (
          <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-primary/10">
              <div className="text-center mb-8">
                <span className="material-icons text-primary text-5xl mb-2">favorite</span>
                <h2 className="text-2xl font-light text-cocoa">Guest Portal</h2>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Unlock your wedding dashboard</p>
              </div>
              <form onSubmit={handleGuestLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Booking Reference / Surname</label>
                  <input required value={loginReference} onChange={e => setLoginReference(e.target.value)} className="w-full bg-background-light border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary" placeholder="e.g. Jenkins" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Access Password</label>
                  <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-background-light border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary" placeholder="••••••••" />
                </div>
                {loginError && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{loginError}</p>}
                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl text-xs tracking-widest uppercase shadow-lg shadow-primary/20 transition-all active:scale-95">Login to Portal</button>
              </form>
            </div>
            <button onClick={() => setCurrentView(View.LANDING)} className="mt-8 text-secondary flex items-center gap-2 hover:text-cocoa font-bold text-[10px] uppercase tracking-widest">
              <span className="material-icons text-sm">arrow_back</span> Return to Main Menu
            </button>
          </div>
        );
      case View.ADMIN_LOGIN:
        return (
          <div className="min-h-screen bg-cocoa flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-primary/10">
              <div className="text-center mb-8">
                <span className="material-icons text-primary text-5xl mb-2">admin_panel_settings</span>
                <h2 className="text-2xl font-light text-cocoa">Admin Access</h2>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Authorized Personnel Only</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Admin Security PIN</label>
                  <input required autoFocus type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-background-light border-none rounded-xl py-4 px-4 text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-primary" placeholder="••••" />
                </div>
                {loginError && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{loginError}</p>}
                <button type="submit" className="w-full bg-cocoa text-white font-bold py-4 rounded-xl text-xs tracking-widest uppercase transition-all active:scale-95">Verify PIN</button>
              </form>
            </div>
            <button onClick={() => setCurrentView(View.LANDING)} className="mt-8 text-primary flex items-center gap-2 hover:text-white font-bold text-[10px] uppercase tracking-widest">
              <span className="material-icons text-sm">arrow_back</span> Return to Main Menu
            </button>
          </div>
        );
      case View.ADMIN_DASHBOARD: return <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} onSelectWedding={handleAdminEnterPlanner} onViewHub={handleAdminViewHub} />;
      case View.ENQUIRY_MANAGER: return <EnquiryManager onNavigate={handleNavigate} />;
      case View.COUPLE_PORTAL: return <CouplePortal onNavigate={handleNavigate} wedding={activeBooking} onLogout={handleLogout} />;
      case View.BRIDE_GROOM: return <BrideGroomPortal onNavigate={handleNavigate} wedding={activeBooking} onSave={updateWeddingData} isAdminAccess={isAdminAuthenticated} />;
      case View.MENU_SELECTION: return <MenuSelection onNavigate={handleNavigate} />;
      case View.KITCHEN_OPS: return <KitchenOps onNavigate={handleNavigate} />;
      case View.GUEST_LIST_PLANNER: return <GuestListPlanner onNavigate={handleNavigate} wedding={activeBooking} onSave={updateWeddingData} />;
      case View.SEATING_PLANNER: return <SeatingPlanner onNavigate={handleNavigate} wedding={activeBooking} onSave={updateWeddingData} isAdminAccess={isAdminAuthenticated} />;
      case View.ADD_WEDDING: return <AddWedding onNavigate={handleNavigate} />;
      case View.BOOKING_CONFIRMATION: return <BookingConfirmation onNavigate={handleNavigate} />;
      default: return <LandingPage onNavigate={handleNavigate} isAdminAuthenticated={isAdminAuthenticated} activeBooking={activeBooking} onLogout={handleLogout} />;
    }
  };

 return (
  <div className="min-h-screen relative">
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <button
        onClick={async () => {
          const res = await saveBooking("test123", {
            fromApp: true,
            at: new Date().toISOString(),
          });
          console.log("saveBooking result:", res);
          alert(res.ok ? "Saved OK. Check console." : "Save failed.");
        }}
        style={{
          padding: 12,
          border: "1px solid #ccc",
          borderRadius: 8,
          background: "white",
          cursor: "pointer",
        }}
      >
        Test Save
      </button>
    </div>

    {renderView()}
  </div>
);

};

export default App;