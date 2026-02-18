import React, { useState } from 'react';
import { View, WeddingBooking } from '../types';

interface CouplePortalProps {
  onNavigate: (v: View) => void;
  wedding: WeddingBooking | null;
  onLogout: () => void;
}

const CouplePortal: React.FC<CouplePortalProps> = ({ onNavigate, wedding, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!wedding) return null;

  const isLive = wedding.published;
  const coupleNames = (wedding.coupleName1 && wedding.coupleName2) 
    ? `${wedding.coupleName1} & ${wedding.coupleName2}` 
    : "";
    
  const displayTitle = isLive && coupleNames ? coupleNames : "Welcome to your Portal";
  const venueStr = isLive && wedding.venue ? wedding.venue : "";
  const dateStr = isLive && wedding.weddingDate 
    ? new Date(wedding.weddingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : "";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl p-10 shadow-soft border border-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-icons text-7xl text-primary">auto_fix_high</span>
              </div>
              <h2 className="text-2xl font-light text-cocoa mb-4">
                {(isLive && wedding.welcomeMessage) ? 'Message from your Venue' : 'Start Your Journey'}
              </h2>
              <p className="text-lg text-secondary italic leading-relaxed max-w-2xl">
                {(isLive && wedding.welcomeMessage) 
                  ? wedding.welcomeMessage 
                  : `Welcome to your official wedding dashboard. Use the sections below to manage your guests, choose your menu, and plan every detail of your celebration.`}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="bg-cocoa rounded-3xl p-8 shadow-soft border border-primary/5 flex flex-col group hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1" onClick={() => onNavigate(View.BRIDE_GROOM)}>
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-icons text-3xl">celebration</span>
                </div>
                <h3 className="text-xl font-light text-white mb-2">Bride & Groom Hub</h3>
                <p className="text-xs text-taupe leading-relaxed mb-8">
                  The primary workspace for your wedding planning. Pick your menu, manage dietaries, and approve final selections.
                </p>
                <button className="mt-auto text-primary font-bold text-[10px] flex items-center gap-2 tracking-widest uppercase">
                  ENTER HUB <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-soft border border-primary/5 flex flex-col group hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1" onClick={() => onNavigate(View.SEATING_PLANNER)}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-icons text-3xl">grid_goldenratio</span>
                </div>
                <h3 className="text-xl font-light text-cocoa mb-2">Seating Studio</h3>
                <p className="text-xs text-secondary leading-relaxed mb-8">
                  Design your interactive floor plan and assign your guest seats visually.
                </p>
                <button className="mt-auto text-primary font-bold text-[10px] flex items-center gap-2 tracking-widest uppercase">
                  OPEN STUDIO <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'Documents':
        return (
          <div className="bg-white rounded-3xl p-20 shadow-soft border border-primary/5 text-center flex flex-col items-center">
            <span className="material-icons text-primary/20 text-6xl mb-4">description</span>
            <h2 className="text-xl font-light text-cocoa mb-2">No documents yet.</h2>
            <p className="text-sm text-secondary mb-8">Once uploaded by your coordinator, your contracts and brochures will appear here.</p>
          </div>
        );
      case 'Guest List':
        return (
          <div className="bg-white rounded-3xl p-20 shadow-soft border border-primary/5 text-center flex flex-col items-center">
            <span className="material-icons text-primary/20 text-6xl mb-4">people_outline</span>
            <h2 className="text-xl font-light text-cocoa mb-2">No guests added yet.</h2>
            <p className="text-sm text-secondary mb-8">Start adding your guests to manage RSVPs and dietary requirements.</p>
            <button 
              onClick={() => onNavigate(View.GUEST_LIST_PLANNER)}
              className="bg-primary text-white font-bold py-4 px-10 rounded-xl text-xs tracking-widest uppercase shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95">
              Add Guest
            </button>
          </div>
        );
      default:
        return <div className="p-10 text-center text-secondary uppercase font-bold text-[10px] tracking-widest">Select a tab from above</div>;
    }
  };

  return (
    <div className="bg-background-light min-h-screen pb-20 font-work">
      <header className="relative h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={wedding.heroImage} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-cocoa/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/40 to-background-light"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center pt-20">
          <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-white mb-6 bg-primary/80 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm">Welcome to your Portal</span>
          <h1 className="text-4xl lg:text-7xl font-light text-cocoa mb-4 drop-shadow-sm tracking-tight leading-tight">
            {displayTitle}
          </h1>
          {(venueStr || dateStr) && (
            <p className="text-sm text-cocoa uppercase tracking-[0.2em] font-medium mb-10 bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full border border-white/50">
              {venueStr} {venueStr && dateStr && "•"} {dateStr}
            </p>
          )}
        </div>
        <button onClick={onLogout} className="absolute top-8 right-8 z-50 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all">
          Logout
        </button>
      </header>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 h-16 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center space-x-12">
          {['Overview', 'Documents', 'Guest List'].map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary py-5 border-b-2 ${activeTab === item ? 'text-primary border-primary' : 'text-secondary border-transparent'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {renderTabContent()}
        </div>
        <aside className="lg:col-span-4 space-y-10">
          {isLive && wedding.coordinator ? (
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-primary/10 text-center relative overflow-hidden animate-in fade-in slide-in-from-right-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <img src={wedding.coordinator.img} className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 border-background-light shadow-lg" alt="Coordinator" />
              <h3 className="text-xl font-bold text-cocoa mb-1">{wedding.coordinator.name}</h3>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Your Wedding Coordinator</p>
              <button className="w-full bg-background-light text-cocoa font-bold border border-primary/20 px-6 py-4 rounded-2xl text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white hover:border-primary transition-all uppercase">
                <span className="material-icons text-primary text-base">mail_outline</span> Send Message
              </button>
            </div>
          ) : (
            <div className="bg-white/40 rounded-3xl p-8 shadow-soft border border-primary/5 text-center relative overflow-hidden grayscale opacity-60">
              <div className="w-20 h-20 rounded-full bg-secondary/20 mx-auto mb-4 flex items-center justify-center">
                <span className="material-icons text-secondary/40 text-3xl">person</span>
              </div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Coordinator Pending</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default CouplePortal;