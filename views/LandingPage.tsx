import React from 'react';
import { View, WeddingBooking } from '../types';

interface LandingPageProps {
  onNavigate: (view: View) => void;
  isAdminAuthenticated: boolean;
  activeBooking: WeddingBooking | null;
  onLogout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isAdminAuthenticated, activeBooking, onLogout }) => {
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-secondary/10 flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-tr-lg rounded-bl-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="font-bold text-2xl tracking-tight text-cocoa">MCN<span className="font-light text-secondary">Manager</span></span>
        </div>
        {activeBooking && (
          <button onClick={onLogout} className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:text-primary transition-colors">
            Logout
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold text-cocoa leading-tight">
            Premium Venue<br/>
            <span className="text-primary italic">Management System</span>
          </h1>
          <p className="text-xl text-secondary max-w-xl mx-auto">
            Manage your entire wedding journey or venue operations with elegance and precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button 
              onClick={() => onNavigate(activeBooking ? View.COUPLE_PORTAL : View.GUEST_LOGIN)}
              className="px-12 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 hover:bg-primary/90 flex flex-col items-center gap-1 group"
            >
              <span className="material-icons text-3xl">favorite</span>
              <span className="uppercase tracking-[0.2em] text-[10px]">
                {activeBooking ? 'Welcome Back' : 'Couples Login'}
              </span>
              <span className="text-lg">
                {activeBooking ? 'Continue to Portal' : 'Guest Portal'}
              </span>
            </button>

            <button 
              onClick={() => isAdminAuthenticated ? onNavigate(View.ADMIN_DASHBOARD) : onNavigate(View.ADMIN_LOGIN)}
              className="px-12 py-5 bg-cocoa text-white rounded-2xl font-bold shadow-xl shadow-cocoa/20 transition-all transform hover:-translate-y-1 hover:bg-cocoa/90 flex flex-col items-center gap-1 group"
            >
              <span className="material-icons text-3xl">admin_panel_settings</span>
              <span className="uppercase tracking-[0.2em] text-[10px]">Staff Access</span>
              <span className="text-lg">Admin Dashboard</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-[10px] text-secondary font-bold uppercase tracking-[0.4em] opacity-50">
        MCN Events Portfolio Management &copy; 2024
      </footer>
    </div>
  );
};

export default LandingPage;