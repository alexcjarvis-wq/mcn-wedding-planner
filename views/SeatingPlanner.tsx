
import React, { useState, useRef, useEffect } from 'react';
import { View, WeddingBooking } from '../types';

interface GuestData {
  id: string;
  name: string;
  initials: string;
  category: 'Bride Family' | 'Groom Family' | 'Friends';
  tableId: string | null;
  seatNumber?: number;
}

interface TableData {
  id: string;
  name: string;
  capacity: number;
  type: 'oblong' | 'round' | 'top';
  rotation: number; 
  x: number;
  y: number;
}

interface TableServiceConfig {
  tableId: string;
  startSeat: number | null;
  direction: 'cw' | 'ccw';
}

interface SeatingPlannerProps {
  onNavigate: (v: View) => void;
  wedding: WeddingBooking | null;
  onSave: (updated: WeddingBooking) => void;
  isAdminAccess: boolean;
}

const SeatingPlanner: React.FC<SeatingPlannerProps> = ({ onNavigate, wedding, onSave, isAdminAccess }) => {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [scale, setScale] = useState(1);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLayoutLockedState, setIsLayoutLockedState] = useState(true);
  const [isServiceFlowActive, setIsServiceFlowActive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [serviceConfigs, setServiceConfigs] = useState<Record<string, TableServiceConfig>>({});
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const ADMIN_PASSCODE = "0000";

  const isUserAdmin = isAdminMode || isAdminAccess;
  const isLockedBySubmission = wedding?.locked && !isAdminAccess;
  const isLayoutLocked = isLayoutLockedState || isLockedBySubmission;

  useEffect(() => {
    if (wedding) {
      const mappedGuests: GuestData[] = (wedding.guests || []).map((g, idx) => {
        const initials = g.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        return {
          id: g.id,
          name: g.name,
          initials: initials,
          category: g.side === 'Bride' ? 'Bride Family' : g.side === 'Groom' ? 'Groom Family' : 'Friends',
          tableId: g.tableId || null,
          seatNumber: g.seatNumber
        };
      });
      setGuests(mappedGuests);

      if (wedding.tablePlan && Array.isArray(wedding.tablePlan.tables)) {
        setTables(wedding.tablePlan.tables);
      }
      if (wedding.tablePlan?.serviceConfigs) {
        setServiceConfigs(wedding.tablePlan.serviceConfigs);
      }
    }
  }, [wedding]);

  const handleSavePlan = () => {
    if (!wedding) return;
    if (isLockedBySubmission) return;
    
    const updatedWeddingGuests = (wedding.guests || []).map(wg => {
      const sg = guests.find(g => g.id === wg.id);
      if (sg) {
        return { ...wg, tableId: sg.tableId, seatNumber: sg.seatNumber };
      }
      return wg;
    });

    onSave({
      ...wedding,
      guests: updatedWeddingGuests,
      tablePlan: {
        tables: tables,
        serviceConfigs: serviceConfigs,
        lastUpdated: Date.now()
      }
    });
    setIsLayoutLockedState(true);
    alert("Plan saved successfully.");
  };

  const addTable = (type: 'round' | 'oblong' | 'top') => {
    if (isLockedBySubmission) return;
    const id = `t${Date.now()}`;
    setTables(prev => [...prev, {
      id,
      name: type === 'top' ? 'Top Table' : `Table ${tables.length + 1}`,
      capacity: type === 'top' ? 6 : 8,
      type,
      rotation: 0,
      x: (900 - panOffset.x) / scale,
      y: (700 - panOffset.y) / scale,
    }]);
  };

  const handleTableMouseDown = (e: React.MouseEvent, table: TableData) => {
    if (e.button !== 2 || isLayoutLocked) return;
    e.preventDefault(); e.stopPropagation();
    setDraggingTableId(table.id);
    setDragOffset({ x: e.clientX - (table.x * scale + panOffset.x), y: e.clientY - (table.y * scale + panOffset.y) });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (draggingTableId) {
      setTables(prev => prev.map(t => t.id === draggingTableId ? { ...t, x: (e.clientX - panOffset.x - dragOffset.x) / scale, y: (e.clientY - panOffset.y - dragOffset.y) / scale } : t));
    }
  };

  const renderCircularSeats = (table: TableData, radius: number) => {
    return Array.from({ length: table.capacity }).map((_, i) => {
      const angle = (i / table.capacity) * 360;
      const guestAtSeat = guests.find(g => g.tableId === table.id && g.seatNumber === i);
      return (
        <div key={i} className="seat-circle absolute w-10 h-10 rounded-full border bg-white flex items-center justify-center text-[10px] font-bold"
          style={{ left: '50%', top: '50%', margin: '-20px 0 0 -20px', transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)` }}
          onDragOver={(e) => !isLockedBySubmission && e.preventDefault()}
          onDrop={(e) => {
            const guestId = e.dataTransfer.getData('guestId');
            if (guests.some(g => g.tableId === table.id && g.seatNumber === i)) return;
            setGuests(prev => prev.map(g => g.id === guestId ? { ...g, tableId: table.id, seatNumber: i } : g));
          }}
          onClick={() => {
            if (isLockedBySubmission) return;
            const guest = guests.find(g => g.tableId === table.id && g.seatNumber === i);
            if (guest) setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, tableId: null, seatNumber: undefined } : g));
          }}
        >
          {guestAtSeat ? guestAtSeat.initials : i + 1}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background-light font-work overflow-hidden">
      <div className="h-20 border-b border-taupe/10 bg-white flex items-center justify-between px-8 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(isAdminAccess ? View.ADMIN_DASHBOARD : View.COUPLE_PORTAL)} className="p-2 hover:bg-primary/10 rounded-full text-primary"><span className="material-icons">arrow_back</span></button>
          <h1 className="text-lg font-bold italic text-cocoa">MCN Seating Studio</h1>
          {isLockedBySubmission && <span className="bg-green-50 text-green-700 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-green-200 tracking-widest">SUBMITTED & LOCKED</span>}
        </div>
        <div className="flex items-center gap-3">
          {!isLockedBySubmission && isUserAdmin && (
            <div className="flex gap-2 bg-white p-1 rounded-full border border-primary/50">
              <button onClick={() => addTable('round')} className="px-4 py-2 text-[10px] font-bold">ROUND</button>
              <button onClick={() => addTable('oblong')} className="px-4 py-2 text-[10px] font-bold">OBLONG</button>
            </div>
          )}
          {/* Fix: Changed handleSaveAll to handleSavePlan */}
          {!isLockedBySubmission && <button onClick={handleSavePlan} className="px-8 py-2.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">SAVE PLAN</button>}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`bg-white border-r border-taupe/20 w-80 flex flex-col z-30 ${isLockedBySubmission ? 'grayscale' : ''}`}>
          <div className="p-6 border-b border-taupe/10 bg-ivory/30 flex items-center justify-between">
            <h2 className="text-lg font-bold text-cocoa">Unseated</h2>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full">{guests.filter(g => !g.tableId).length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
            {guests.filter(g => !g.tableId).map(guest => (
              <div key={guest.id} draggable={!isLockedBySubmission} onDragStart={(e) => e.dataTransfer.setData('guestId', guest.id)} className="bg-white p-4 rounded-xl border border-taupe/10 flex items-center justify-between cursor-grab">
                <span className="text-sm font-semibold">{guest.name}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 relative bg-background-light overflow-hidden" 
          onMouseDown={(e) => { setIsPanning(true); setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }); }}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={() => setIsPanning(false)}
        >
          <div className="absolute top-0 left-0 w-[2000px] h-[1500px]" style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`, transformOrigin: '0 0' }}>
            <div className="absolute inset-0 bg-[radial-gradient(#d5b37b_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.05]"></div>
            {tables.map(table => (
              <div key={table.id} className="absolute z-10" style={{ left: table.x, top: table.y, transform: 'translate(-50%, -50%)' }} onMouseDown={(e) => handleTableMouseDown(e, table)}>
                <div style={{ transform: `rotate(${table.rotation}deg)` }} className="relative">
                   <div className="relative w-40 h-40 flex items-center justify-center">
                    {renderCircularSeats(table, 110)}
                    <div className="w-full h-full rounded-full bg-white border-2 shadow-xl flex flex-col items-center justify-center text-center p-4">
                      <span className="text-[11px] font-black uppercase text-cocoa">{table.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeatingPlanner;
