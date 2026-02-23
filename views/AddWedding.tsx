
import React, { useState, useEffect } from 'react';
import { View, WeddingBooking } from '../types';
import { createBooking } from '../services/bookingService';

const AddWedding: React.FC<{ onNavigate: (v: View) => void }> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    coupleName1: '',
    coupleName2: '',
    surname: '',
    weddingDate: '',
    venue: '',
    published: false,
    customPassword: ''
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
  };

  useEffect(() => {
    // Set initial auto-generated password
    setFormData(prev => ({ ...prev, customPassword: generatePassword() }));
  }, []);

  const steps = [
    { number: 1, label: 'Names' },
    { number: 2, label: 'Logistics' },
    { number: 3, label: 'Access' },
    { number: 4, label: 'Confirm' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Fix: Added missing 'locked' property to new WeddingBooking object
    const newWedding: WeddingBooking = {
      id: Math.random().toString(36).substring(7),
      reference: Math.random().toString(36).substring(2, 8).toUpperCase(),
      surname: formData.surname,
      coupleName1: formData.coupleName1,
      coupleName2: formData.coupleName2,
      weddingDate: formData.weddingDate,
      venue: formData.venue,
      passwordHash: `hash_${formData.customPassword}`, // Using the custom or generated password
      status: 'active',
      locked: false,
      createdAt: Date.now(),
      failedLoginCount: 0,
      welcomeMessage: '',
      heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
      coordinator: null,
      showCountdown: true,
      totalValue: 0,
      paidValue: 0,
      published: formData.published,
      guests: [],
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
      tablePlan: {}
    };

    const adminToken = sessionStorage.getItem('mcn_admin_token') || '';
    if (!adminToken) {
      alert('Admin session missing. Please log in again.');
      onNavigate(View.ADMIN_DASHBOARD);
      return;
    }

    createBooking({ ...newWedding, createdBy: 'admin' }, adminToken)
      .then((res: any) => {
        if (!res?.ok) {
          alert(res?.error || 'Create failed');
          return;
        }

        sessionStorage.setItem('last_created_wedding', JSON.stringify(res.booking));
        sessionStorage.setItem('temp_access_pass', formData.customPassword);
        onNavigate(View.BOOKING_CONFIRMATION);
      })
      .catch((err) => alert(err?.message || 'Create failed'));
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-work text-cocoa">
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary/20 h-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(View.ADMIN_DASHBOARD)} className="text-secondary hover:text-cocoa p-2 rounded-full hover:bg-primary/10 transition-all">
            <span className="material-icons">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold">New Wedding Booking</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {steps.map(s => (
            <div key={s.number} className={`flex items-center gap-2 ${s.number <= currentStep ? 'text-primary' : 'text-secondary/50'}`}>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${s.number === currentStep ? 'bg-primary text-white border-primary' : 'border-current'}`}>{s.number}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
              {s.number < 4 && <span className="h-px w-6 bg-current opacity-20"></span>}
            </div>
          ))}
        </nav>
      </header>

      <main className="max-w-xl mx-auto w-full py-16 px-4">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-soft border border-primary/10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl font-light text-cocoa">The Couple</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Booking Surname</label>
                  <input required value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className="w-full bg-background-light border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all" placeholder="e.g. Jenkins" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">First Name (Partner 1)</label>
                    <input value={formData.coupleName1} onChange={e => setFormData({...formData, coupleName1: e.target.value})} className="w-full bg-background-light border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">First Name (Partner 2)</label>
                    <input value={formData.coupleName2} onChange={e => setFormData({...formData, coupleName2: e.target.value})} className="w-full bg-background-light border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all" placeholder="Optional" />
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl font-light text-cocoa">Logistics</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Wedding Date</label>
                  <input type="date" required value={formData.weddingDate} onChange={e => setFormData({...formData, weddingDate: e.target.value})} className="w-full bg-background-light border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Venue Name</label>
                  <div className="relative">
                    <select 
                      required 
                      value={formData.venue} 
                      onChange={e => setFormData({...formData, venue: e.target.value})} 
                      className="w-full bg-background-light border-none rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary transition-all appearance-none pr-10"
                    >
                      <option value="" disabled>Select a venue...</option>
                      <option value="Marshall Meadows Manor">Marshall Meadows Manor</option>
                      <option value="Shotton Grange">Shotton Grange</option>
                      <option value="The Parlour at Blagdon">The Parlour at Blagdon</option>
                    </select>
                    <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-light text-cocoa">Access Security</h2>
                <button 
                  type="button" 
                  onClick={() => setFormData(f => ({ ...f, customPassword: generatePassword() }))}
                  className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:text-cocoa transition-colors"
                >
                  <span className="material-icons text-xs">refresh</span> Regenerate
                </button>
              </div>
              <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 text-center space-y-6 shadow-inner">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Guest Access Password</label>
                <input 
                  required
                  type="text"
                  value={formData.customPassword}
                  onChange={e => setFormData({...formData, customPassword: e.target.value.toUpperCase()})}
                  className="w-full bg-white border-primary/20 rounded-2xl py-4 px-6 text-center text-3xl font-mono font-bold tracking-[0.3em] text-cocoa focus:ring-2 focus:ring-primary shadow-sm"
                  placeholder="PASSWORD"
                />
                <button 
                  type="button" 
                  onClick={() => { navigator.clipboard.writeText(formData.customPassword); alert("Copied to clipboard"); }}
                  className="text-[10px] font-bold text-primary uppercase border-b border-primary hover:text-cocoa hover:border-cocoa transition-colors"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background-light rounded-2xl">
                <input 
                  type="checkbox" 
                  id="published" 
                  checked={formData.published} 
                  onChange={e => setFormData({...formData, published: e.target.checked})}
                  className="w-5 h-5 rounded text-primary focus:ring-primary border-primary/20"
                />
                <label htmlFor="published" className="text-[10px] font-bold text-secondary uppercase tracking-widest cursor-pointer select-none">Publish portal immediately (Live Mode)</label>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6 py-4">
              <span className="material-icons text-primary text-6xl animate-bounce">verified</span>
              <h2 className="text-3xl font-light">Confirm Booking?</h2>
              <p className="text-sm text-secondary leading-relaxed">This will create the booking and generate the unique portal reference. Guests will see the "Template Mode" unless Published is enabled.</p>
            </div>
          )}

          <div className="pt-6 border-t border-primary/10 flex gap-4">
            <button type="button" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate(View.ADMIN_DASHBOARD)} className="flex-1 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest hover:text-cocoa transition-all">
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <button type="submit" className="flex-2 bg-primary text-white font-bold py-4 px-12 rounded-xl text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              {currentStep === 4 ? 'Confirm & Create' : 'Continue'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddWedding;
