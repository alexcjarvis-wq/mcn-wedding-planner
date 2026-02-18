
import React, { useState, useEffect } from 'react';
import { View, Guest, Table, WeddingBooking } from '../types';

interface GuestListPlannerProps {
  onNavigate: (v: View) => void;
  wedding: WeddingBooking | null;
  onSave?: (updated: WeddingBooking) => void;
}

const GuestListPlanner: React.FC<GuestListPlannerProps> = ({ onNavigate, wedding, onSave }) => {
  const [guests, setGuests] = useState<Guest[]>(wedding?.guests || []);
  const [tables] = useState<Table[]>(wedding?.tablePlan?.tables || []);
  const [activeTab, setActiveTab] = useState<'List' | 'Tables'>('List');
  const [searchQuery, setSearchQuery] = useState('');

  // Individual Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuest, setNewGuest] = useState<{
    name: string;
    side: 'Bride' | 'Groom' | 'Mutual';
    rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    allergyNotes: string;
  }>({
    name: '',
    side: 'Mutual',
    rsvpStatus: 'Pending',
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    allergyNotes: '',
  });

  // Bulk Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [bulkSide, setBulkSide] = useState<'Bride' | 'Groom' | 'Mutual'>('Mutual');

  const isLocked = wedding?.locked;

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (!newGuest.name.trim()) return;

    const guestToAdd: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGuest.name,
      side: newGuest.side,
      rsvpStatus: newGuest.rsvpStatus,
      dietary: {
        vegetarian: newGuest.vegetarian,
        vegan: newGuest.vegan,
        glutenFree: newGuest.glutenFree,
        allergyNotes: newGuest.allergyNotes,
      },
      tableId: null,
    };

    const updatedGuests = [...guests, guestToAdd];
    setGuests(updatedGuests);
    if (wedding && onSave) {
      onSave({ ...wedding, guests: updatedGuests });
    }
    setIsModalOpen(false);
    setNewGuest({ 
      name: '', 
      side: 'Mutual', 
      rsvpStatus: 'Pending', 
      vegetarian: false, 
      vegan: false, 
      glutenFree: false, 
      allergyNotes: '' 
    });
  };

  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (names.length === 0) return;

    const newGuests: Guest[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      side: bulkSide,
      rsvpStatus: 'Pending',
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        allergyNotes: '',
      },
      tableId: null,
    }));

    const updatedGuests = [...guests, ...newGuests];
    setGuests(updatedGuests);
    if (wedding && onSave) {
      onSave({ ...wedding, guests: updatedGuests });
    }
    setIsBulkModalOpen(false);
    setBulkNames('');
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvpStatus === 'Confirmed').length,
    pending: guests.filter(g => g.rsvpStatus === 'Pending').length,
    seated: guests.filter(g => g.tableId !== null).length,
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-work">
      {/* Header */}
      <header className="bg-white border-b border-primary/20 px-8 py-6 sticky top-0 z-40 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(View.COUPLE_PORTAL)} className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors"><span className="material-icons">arrow_back</span></button>
          <div>
            <h1 className="text-2xl font-light text-cocoa tracking-tight">Guest List & Table Planner</h1>
            {isLocked && <span className="inline-block bg-green-50 text-green-700 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-green-200 tracking-widest mt-1">LOCKED & SUBMITTED</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-ivory rounded-xl border border-primary/10 p-1 flex shadow-sm">
            <button onClick={() => setActiveTab('List')} className={`px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'List' ? 'bg-primary text-deep-cocoa' : 'text-secondary'}`}>List View</button>
            <button onClick={() => onNavigate(View.SEATING_PLANNER)} className="px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-secondary hover:text-primary transition-all flex items-center gap-2"><span className="material-icons text-sm">grid_goldenratio</span>Seating Studio</button>
          </div>
          {!isLocked && (
            <div className="flex gap-2">
              <button onClick={() => setIsBulkModalOpen(true)} className="bg-ivory border border-cocoa text-cocoa px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-cocoa hover:text-white transition-all">Bulk Add</button>
              <button onClick={() => setIsModalOpen(true)} className="bg-deep-cocoa text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-deep-cocoa/90 transition-all">Add Guest</button>
            </div>
          )}
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-ivory/50 border-b border-primary/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6">
          <div className="flex items-center gap-12">
            {[
              { label: 'Total Guests', value: stats.total, icon: 'people' },
              { label: 'Confirmed', value: stats.confirmed, icon: 'check_circle', color: 'text-green-600' },
              { label: 'Seated', value: `${stats.seated}/${stats.confirmed}`, icon: 'chair' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`material-icons text-sm ${stat.color || 'text-primary'}`}>{stat.icon}</span>
                <div className="flex flex-col"><span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{stat.label}</span><span className="text-sm font-bold text-deep-cocoa">{stat.value}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 overflow-hidden flex flex-col">
        <div className="bg-white rounded-2xl shadow-soft border border-primary/10 flex flex-col flex-1 overflow-hidden">
          <div className="p-6 border-b border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
              <input type="text" placeholder="Search guests..." className="w-full pl-10 pr-4 py-3 bg-background-light border-none rounded-xl text-sm placeholder-secondary/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-background-light/30 sticky top-0 z-10 backdrop-blur-sm">
                <tr className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] border-b border-primary/10"><th className="px-8 py-4">Name</th><th className="px-8 py-4">Status</th><th className="px-8 py-4">Side</th><th className="px-8 py-4">Dietary</th><th className="px-8 py-4">Table</th></tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-8 py-5"><div className="font-bold text-deep-cocoa text-sm">{guest.name}</div></td>
                    <td className="px-8 py-5"><span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-green-100 text-green-700">{guest.rsvpStatus}</span></td>
                    <td className="px-8 py-5 text-[10px] font-bold text-secondary uppercase">{guest.side}</td>
                    <td className="px-8 py-5"><div className="flex flex-wrap gap-1">{guest.dietary.vegan && <span className="bg-green-50 text-green-600 text-[8px] font-bold px-2 py-0.5 rounded border border-green-200">VEGAN</span>}</div></td>
                    <td className="px-8 py-5 text-xs font-bold">{guest.tableId ? (tables.find(t => t.id === guest.tableId)?.name || 'Table') : 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals... */}
    </div>
  );
};

export default GuestListPlanner;