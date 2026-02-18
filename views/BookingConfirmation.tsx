import React, { useEffect, useState } from 'react';
import { View, WeddingBooking } from '../types';

const BookingConfirmation: React.FC<{ onNavigate: (v: View) => void }> = ({ onNavigate }) => {
  const [wedding, setWedding] = useState<WeddingBooking | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('last_created_wedding');
    const pass = sessionStorage.getItem('temp_access_pass');
    if (saved && pass) {
      setWedding(JSON.parse(saved));
      setPassword(pass);
    }
  }, []);

  if (!wedding) return null;

  return (
    <div className="min-h-screen bg-cocoa flex items-center justify-center p-4 font-work">
      <div className="w-full max-w-xl bg-champagne rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="relative h-48">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Confetti" />
          <div className="absolute inset-0 bg-cocoa/40 flex flex-col items-center justify-center text-white">
            <span className="material-icons text-5xl mb-2 text-primary">stars</span>
            <h1 className="text-3xl font-light uppercase tracking-widest">It’s Official!</h1>
          </div>
        </div>

        <div className="p-10 text-center space-y-8">
          <div>
            <h2 className="text-2xl font-light text-cocoa leading-snug">
              Congratulations,<br/>
              <span className="italic text-primary font-medium">{wedding.coupleName1} & {wedding.coupleName2}</span>
            </h2>
            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-2">
              Your wedding at {wedding.venue} is confirmed.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-primary/20 shadow-lg text-left space-y-6">
            <h3 className="text-secondary uppercase text-[10px] font-bold tracking-[0.3em] border-b border-primary/10 pb-2">Guest Portal Access</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-secondary uppercase text-[8px] font-bold tracking-[0.2em] mb-1">Booking Surname</p>
                <p className="text-cocoa text-xl font-bold">{wedding.surname}</p>
              </div>
              <div>
                <p className="text-secondary uppercase text-[8px] font-bold tracking-[0.2em] mb-1">Portal Reference</p>
                <p className="text-cocoa text-xl font-bold">{wedding.reference}</p>
              </div>
              <div className="col-span-2 bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
                <p className="text-primary uppercase text-[8px] font-bold tracking-[0.2em] mb-2">Access Password (One Time View)</p>
                <p className="text-cocoa text-4xl font-mono font-bold tracking-[0.4em]">{password}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate(View.ADMIN_DASHBOARD)}
              className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold tracking-widest uppercase px-10 py-5 rounded-2xl transition-all shadow-xl shadow-primary/20"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => {
                sessionStorage.clear(); // Clear temp sensitive info
                onNavigate(View.LANDING);
              }}
              className="bg-transparent text-secondary hover:text-cocoa text-[10px] font-bold tracking-widest uppercase px-8 py-5 transition-all"
            >
              Finish Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;