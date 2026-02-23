
import React, { useState, useEffect } from 'react';
import { View, WeddingBooking } from '../types';
import { listBookings, saveBooking, createBooking } from '../services/bookingService';

interface AdminDashboardProps {
  onNavigate: (v: View) => void;
  onLogout: () => void;
  onSelectWedding: (w: WeddingBooking) => void;
  onViewHub: (w: WeddingBooking) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout, onSelectWedding, onViewHub }) => {
  const [allBookings, setAllBookings] = useState<WeddingBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Password Change Modal State
  const [passwordModal, setPasswordModal] = useState<{ isOpen: boolean; bookingId: string; surname: string; newPass: string }>({
    isOpen: false,
    bookingId: '',
    surname: '',
    newPass: ''
  });

  useEffect(() => {
    const adminToken = sessionStorage.getItem('mcn_admin_token') || '';
    if (!adminToken) {
      alert('Admin session missing. Please log in again.');
      onLogout();
      return;
    }

    listBookings(adminToken, 200)
      .then((res: any) => {
        if (!res?.ok) {
          alert(res?.error || 'Failed to load bookings');
          return;
        }
        setAllBookings(res.items || []);
      })
      .catch((err) => alert(err?.message || 'Failed to load bookings'));
  }, []);

  const seedDemoWedding = () => {
    const demoId = 'demo-' + Math.random().toString(36).substring(7);
    // Fix: Added missing 'locked' property to WeddingBooking object
    const demoWedding: WeddingBooking = {
      id: demoId,
      reference: 'ALICE-DEMO',
      surname: 'Wonderland',
      coupleName1: 'Alice',
      coupleName2: 'Bob',
      weddingDate: '2025-09-20',
      venue: 'Shotton Grange',
      passwordHash: 'hash_demo123',
      status: 'active',
      locked: false,
      createdAt: Date.now(),
      failedLoginCount: 0,
      welcomeMessage: 'Welcome to your magical wedding portal! We are so excited to host your special day at Shotton Grange.',
      heroImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
      coordinator: { name: 'Sarah Sparkle', img: 'https://i.pravatar.cc/150?u=sarah' },
      showCountdown: true,
      totalValue: 15000,
      paidValue: 5000,
      published: true,
      guests: [
        { id: 'g1', name: 'Mad Hatter', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: 'No Tea Bags' }, side: 'Bride', tableId: 't1', seatNumber: 0 },
        { id: 'g2', name: 'March Hare', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: 'Carrot-free' }, side: 'Bride', tableId: 't1', seatNumber: 1 },
        { id: 'g3', name: 'Cheshire Cat', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: '' }, side: 'Mutual', tableId: 't1', seatNumber: 2 },
        { id: 'g4', name: 'Queen of Hearts', rsvpStatus: 'Pending', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: 'Everything Red' }, side: 'Groom', tableId: null },
        { id: 'g5', name: 'White Rabbit', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: true, allergyNotes: '' }, side: 'Bride', tableId: 't2', seatNumber: 0 },
        { id: 'g6', name: 'Caterpillar', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: true, glutenFree: false, allergyNotes: '' }, side: 'Groom', tableId: 't2', seatNumber: 1 },
        { id: 'g7', name: 'Dormouse', rsvpStatus: 'Pending', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: '' }, side: 'Mutual', tableId: null },
        { id: 'g8', name: 'Tweedle Dee', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: '' }, side: 'Groom', tableId: 't3', seatNumber: 0 },
        { id: 'g9', name: 'Tweedle Dum', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: '' }, side: 'Groom', tableId: 't3', seatNumber: 1 },
        { id: 'g10', name: 'Alice Sr.', rsvpStatus: 'Confirmed', dietary: { vegetarian: false, vegan: false, glutenFree: false, allergyNotes: 'Nut Allergy' }, side: 'Bride', tableId: 't3', seatNumber: 2 },
      ],
      menuSelections: {
        canapesSelectedIds: [],
        startersSelectedIds: [],
        mainsSelectedIds: [],
        dessertsSelectedIds: [],
        childrenStarterId: null,
        childrenMainId: null,
        childrenDessertId: null,
        eveningFoodId: null,
        selectedPizzaIds: [],
        selectedStreetFoodIds: [],
        selectedHogRoastSideIds: []
      },
      documents: [],
      tablePlan: {
        tables: [
          { id: 't1', name: 'The Tea Party', capacity: 8, type: 'round', rotation: 0, x: 400, y: 300 },
          { id: 't2', name: 'Wonderland Adults', capacity: 10, type: 'round', rotation: 0, x: 400, y: 700 },
          { id: 't3', name: 'Top Table', capacity: 6, type: 'oblong', rotation: 0, x: 900, y: 150 },
        ],
        lastUpdated: Date.now()
      }
    };

    const adminToken = sessionStorage.getItem('mcn_admin_token') || '';
    if (!adminToken) {
      alert('Admin session missing. Please log in again.');
      onLogout();
      return;
    }

    createBooking({ ...demoWedding, createdBy: 'admin' }, adminToken)
      .then((res: any) => {
        if (!res?.ok) {
          alert(res?.error || 'Create failed');
          return;
        }
        setAllBookings((prev) => [res.booking, ...prev]);
        alert('Demo Wedding "Alice & Bob" added successfully at Shotton Grange. Password is "demo123"');
      })
      .catch((err) => alert(err?.message || 'Create failed'));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModal.newPass.trim()) return;

    const adminToken = sessionStorage.getItem('mcn_admin_token') || '';
    if (!adminToken) {
      alert('Admin session missing. Please log in again.');
      onLogout();
      return;
    }

    const patch = {
      passwordHash: `hash_${passwordModal.newPass}`,
      failedLoginCount: 0,
      lockedUntil: null,
    };

    saveBooking(passwordModal.bookingId, patch, 'admin', 'admin', adminToken)
      .then((res: any) => {
        if (!res?.ok) {
          alert(res?.error || 'Save failed');
          return;
        }
        setAllBookings((prev) => prev.map((b) => (b.id === passwordModal.bookingId ? res.booking : b)));
        setPasswordModal({ ...passwordModal, isOpen: false, newPass: '' });
        alert(`Password updated for ${passwordModal.surname} booking.`);
      })
      .catch((err) => alert(err?.message || 'Save failed'));
  };

  const handleToggleStatus = (bookingId: string) => {
    const adminToken = sessionStorage.getItem('mcn_admin_token') || '';
    if (!adminToken) {
      alert('Admin session missing. Please log in again.');
      onLogout();
      return;
    }

    const current = allBookings.find((w) => w.id === bookingId);
    if (!current) return;
    const cur = String(current.status || '').toLowerCase();
    const nextStatus = cur === 'active' ? 'cancelled' : 'active';

    saveBooking(bookingId, { status: nextStatus }, 'admin', 'admin', adminToken)
      .then((res: any) => {
        if (!res?.ok) {
          alert(res?.error || 'Save failed');
          return;
        }
        setAllBookings((prev) => prev.map((b) => (b.id === bookingId ? res.booking : b)));
      })
      .catch((err) => alert(err?.message || 'Save failed'));
  };

  const filteredBookings = allBookings.filter(b => 
    b.surname.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background-light overflow-hidden font-work text-deep-cocoa">
      <aside className="w-64 bg-deep-cocoa flex flex-col h-full flex-shrink-0 z-50">
        <div className="p-8 flex items-center justify-center border-b border-white/5">
          <div className="flex flex-col items-center">
            <span className="material-icons text-primary text-4xl mb-2">diamond</span>
            <h1 className="text-white font-medium tracking-widest text-[10px] uppercase">MCN Events</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/20 text-primary border-l-4 border-primary transition-all text-left">
            <span className="material-icons text-xl">dashboard</span>
            <span className="font-medium text-sm">Bookings</span>
          </button>
          <button onClick={() => onNavigate(View.ENQUIRY_MANAGER)} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-warm-taupe hover:bg-white/5 hover:text-primary transition-all text-left group">
            <span className="material-icons text-xl group-hover:text-primary">mark_email_unread</span>
            <span className="font-medium text-sm">Enquiries</span>
          </button>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-warm-taupe hover:text-primary transition-colors py-2 px-1">
            <span className="material-icons text-xl">logout</span>
            <span className="font-medium text-sm">Logout Admin</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto bg-background-light p-8 lg:p-12 relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-deep-cocoa mb-1">Wedding Bookings</h2>
            <p className="text-warm-taupe text-sm">Create and manage access for your couples.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={seedDemoWedding}
              className="border-2 border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all transform active:scale-95 text-xs tracking-widest uppercase"
            >
              <span className="material-icons text-sm">auto_awesome</span> Seed Demo Wedding
            </button>
            <button 
              onClick={() => onNavigate(View.ADD_WEDDING)}
              className="bg-primary hover:bg-primary/90 text-deep-cocoa px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-bold transition-all transform active:scale-95 text-xs tracking-widest uppercase"
            >
              <span className="material-icons text-sm">add</span> New Booking
            </button>
          </div>
        </header>

        <div className="bg-ivory rounded-xl border border-primary/20 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative flex-1 max-w-md">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-warm-taupe text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Search surnames or venues..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background-light border-none rounded-lg text-sm focus:ring-1 focus:ring-primary placeholder-warm-taupe/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{filteredBookings.length} Bookings found</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-light/50 text-[10px] uppercase tracking-widest text-warm-taupe font-bold">
                  <th className="px-8 py-5">Couple / Surname</th>
                  <th className="px-8 py-5">Venue & Date</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5">Portal Ref</th>
                  <th className="px-8 py-5 text-right pr-12">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((wedding) => (
                  <tr key={wedding.id} className="hover:bg-background-light/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {wedding.surname.charAt(0)}
                        </div>
                        <div>
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-deep-cocoa">{wedding.coupleName1} & {wedding.coupleName2 || '...'}</p>
                             </div>
                             {wedding.menuApproved && (
                                <div className="flex">
                                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary-vibrant text-[7px] font-black uppercase px-2.5 py-1 rounded-md border-2 border-primary/30 shadow-sm animate-in fade-in slide-in-from-left-2 transition-all">
                                    <span className="material-icons text-[10px]">verified</span> 
                                    FINAL NUMBERS & CHOICES SUBMITTED
                                  </span>
                                </div>
                             )}
                          </div>
                          <p className="text-[10px] text-warm-taupe uppercase tracking-widest font-medium mt-1">Surname: {wedding.surname}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium">{wedding.venue || 'TBC'}</p>
                      <p className="text-[10px] text-warm-taupe">{wedding.weddingDate || 'No date set'}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${wedding.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {wedding.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <code className="bg-primary/5 px-2 py-1 rounded text-primary font-bold text-xs">{wedding.reference}</code>
                    </td>
                    <td className="px-8 py-5 text-right pr-12">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onViewHub(wedding)}
                          title="Open Hub"
                          className="p-2 text-warm-taupe hover:text-primary transition-colors"
                        >
                          <span className="material-icons text-sm">rocket_launch</span>
                        </button>
                        <button 
                          onClick={() => onSelectWedding(wedding)}
                          title="Seating Studio"
                          className="p-2 text-warm-taupe hover:text-primary transition-colors"
                        >
                          <span className="material-icons text-sm">grid_goldenratio</span>
                        </button>
                        <button 
                          onClick={() => setPasswordModal({ isOpen: true, bookingId: wedding.id, surname: wedding.surname, newPass: '' })}
                          title="Change Password"
                          className="p-2 text-warm-taupe hover:text-primary transition-colors"
                        >
                          <span className="material-icons text-sm">key</span>
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(wedding.id)}
                          title={wedding.status === 'active' ? "Disable" : "Enable"}
                          className={`p-2 ${wedding.status === 'active' ? 'text-warm-taupe hover:text-red-500' : 'text-red-500 hover:text-green-500'} transition-colors`}
                        >
                          <span className="material-icons text-sm">{wedding.status === 'active' ? 'block' : 'check_circle'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center opacity-40 italic">
                      No bookings found. Try seeding a demo wedding.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Change Password Modal */}
        {passwordModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cocoa/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl border border-primary/20 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
              <div className="bg-primary/5 px-8 py-6 border-b border-primary/10 text-center">
                <h3 className="text-xl font-bold text-deep-cocoa tracking-tight">Change Access Password</h3>
                <p className="text-[10px] text-warm-taupe font-bold uppercase tracking-widest mt-1">Wedding: {passwordModal.surname}</p>
              </div>
              <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">New Portal Password</label>
                  <input 
                    autoFocus 
                    required 
                    type="text" 
                    value={passwordModal.newPass} 
                    onChange={e => setPasswordModal({ ...passwordModal, newPass: e.target.value.toUpperCase() })} 
                    className="w-full bg-background-light border-none rounded-xl py-4 px-4 text-center text-2xl font-mono font-bold tracking-[0.2em] focus:ring-2 focus:ring-primary shadow-inner" 
                    placeholder="NEWPASS" 
                  />
                  <p className="text-[9px] text-warm-taupe italic mt-2 text-center">This will immediately update the couple's login credentials.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })} 
                    className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-deep-cocoa transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-primary text-white font-bold py-3 rounded-xl text-[10px] tracking-widest uppercase shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
