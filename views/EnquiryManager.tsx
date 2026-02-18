import React, { useState } from 'react';
import { View, Enquiry } from '../types';

const ENQUIRIES: Enquiry[] = [
  { id: '1', couple: 'Sarah & James', initials: 'S&J', email: 'sarah.w@example.com', date: 'Aug 14, 2025', status: 'Site Visit Scheduled', source: 'Instagram', lastContact: '2 days ago', guests: 120 },
  { id: '2', couple: 'Emily & Tom', initials: 'E&T', email: 'emily.t@gmail.com', date: 'Jun 22, 2025', status: 'New Enquiry', source: 'Website', lastContact: '5 hours ago', guests: 80 },
  { id: '3', couple: 'Mia & David', initials: 'M&D', email: 'mia.d@outlook.com', date: 'Sep 05, 2025', status: 'In Progress', source: 'Referral', lastContact: '1 week ago', guests: 150 },
  { id: '4', couple: 'Lucas & Kate', initials: 'L&K', email: 'lucas.k@domain.com', date: 'Jul 10, 2025', status: 'Contract Sent', source: 'The Knot', lastContact: '3 days ago', guests: 100 },
];

const EnquiryManager: React.FC<{ onNavigate: (v: View) => void }> = ({ onNavigate }) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry>(ENQUIRIES[0]);

  return (
    <div className="flex h-screen bg-background-light overflow-hidden">
      {/* Platform Sidebar */}
      <aside className="w-64 bg-deep-cocoa flex flex-col h-full transition-all duration-300 shadow-xl flex-shrink-0 z-50">
        <div className="p-8 flex items-center justify-center border-b border-primary/20">
          <div className="flex flex-col items-center">
            <span className="material-icons text-primary text-4xl mb-2">diamond</span>
            <h1 className="text-white font-medium tracking-widest text-xs uppercase" onClick={() => onNavigate(View.LANDING)}>MCN Events</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          <button onClick={() => onNavigate(View.ADMIN_DASHBOARD)} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-warm-taupe hover:bg-white/5 hover:text-primary transition-all text-left group">
            <span className="material-icons text-xl group-hover:text-primary">dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-warm-taupe hover:bg-white/5 hover:text-primary transition-all text-left group">
            <span className="material-icons text-xl group-hover:text-primary">apartment</span>
            <span className="font-medium text-sm">Venues</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-primary/20 text-primary border-l-4 border-primary transition-all text-left">
            <span className="material-icons text-xl">mark_email_unread</span>
            <span className="font-medium text-sm">Enquiries</span>
            <span className="ml-auto bg-primary text-deep-cocoa text-[10px] font-bold px-2 py-0.5 rounded-full">8</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-warm-taupe hover:bg-white/5 hover:text-primary transition-all text-left group">
            <span className="material-icons text-xl group-hover:text-primary">calendar_month</span>
            <span className="font-medium text-sm">Calendar</span>
          </button>
        </nav>
        <div className="p-6 border-t border-primary/20">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/50 relative">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZptpY140TGkewE-rNSPotLYnUjpjFSM8PT05PpyQ0dGx3Qi54qClbUm4WtNqcSJz8kV9AsHIzo7y7-nH3rWcwAqru85jH_TbyI0M8cPNNfLd5wqnOlal-OJR_bkZysWO7v9fXWDbP0DW6nLLD-1G3MYv2p45YPqZ_L96u4dONKqt23IIuljv2zeRYVZENZJeX1qbzREQkn3Xb4vY3hMfUt9mBqOIlPAmv3zYf8dXfbmiQxJhUG2DnJlQUmSRo9nI8LS6TIM-2wTZn" className="h-full w-full rounded-full object-cover" />
               <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-deep-cocoa"></span>
            </div>
            <div className="flex flex-col">
              <p className="text-white text-sm font-medium">Eleanor P.</p>
              <p className="text-warm-taupe text-[10px]">Admin Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden px-8 py-8 relative">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <nav className="flex text-[10px] font-bold text-warm-taupe uppercase tracking-widest mb-2">
              <span className="hover:text-primary cursor-pointer">Venues</span>
              <span className="mx-2 opacity-50">/</span>
              <span className="hover:text-primary cursor-pointer">Marshall Meadows</span>
              <span className="mx-2 opacity-50">/</span>
              <span className="text-primary">Enquiries</span>
            </nav>
            <h1 className="text-3xl font-light text-deep-cocoa tracking-wide">Enquiry Management</h1>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* List Area */}
          <div className="flex-1 bg-ivory rounded-2xl shadow-soft border border-primary/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-primary/10 flex items-center gap-4">
              <div className="relative flex-1">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-warm-taupe text-sm">search</span>
                <input className="w-full pl-10 pr-4 py-2.5 bg-background-light/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary placeholder-warm-taupe/50" placeholder="Search couples..." />
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-full bg-primary text-deep-cocoa text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">All</button>
                <button className="px-4 py-1.5 rounded-full text-warm-taupe text-[10px] font-bold uppercase tracking-widest border border-primary/20">New (3)</button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 no-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-background-light/50 sticky top-0 z-10">
                  <tr className="text-[10px] font-bold text-warm-taupe uppercase tracking-widest">
                    <th className="py-4 px-6">Couple</th>
                    <th className="py-4 px-6">Proposed Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Source</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {ENQUIRIES.map((enq) => (
                    <tr 
                      key={enq.id} 
                      onClick={() => setSelectedEnquiry(enq)}
                      className={`cursor-pointer transition-colors ${selectedEnquiry?.id === enq.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-primary/5 border-l-4 border-transparent'}`}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary italic font-serif text-lg border border-primary/20">
                            {enq.initials}
                          </div>
                          <div>
                            <div className="font-bold text-deep-cocoa text-sm">{enq.couple}</div>
                            <div className="text-[10px] text-warm-taupe">{enq.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-1 text-sm text-deep-cocoa">
                          {enq.date}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${enq.status === 'New Enquiry' ? 'bg-blue-100 text-blue-800' : enq.status === 'Site Visit Scheduled' ? 'bg-primary/20 text-deep-cocoa' : 'bg-orange-100 text-orange-800'}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-[10px] font-bold text-warm-taupe uppercase tracking-widest">
                        {enq.source}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="material-icons text-warm-taupe">chevron_right</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Sidebar */}
          <aside className="w-[380px] bg-ivory rounded-2xl shadow-soft border border-primary/10 flex flex-col overflow-hidden flex-shrink-0">
            <div className="h-24 bg-primary/10 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-ivory"></div>
            </div>
            <div className="px-6 pb-6 -mt-8 relative z-10 flex-1 overflow-y-auto no-scrollbar">
              <div className="bg-ivory rounded-xl p-6 shadow-soft border border-primary/10 mb-6 text-center">
                <div className="w-20 h-20 mx-auto bg-ivory rounded-full flex items-center justify-center text-3xl font-serif text-primary mb-3 border-4 border-white shadow-sm overflow-hidden">
                   <img src={`https://picsum.photos/200/200?random=${selectedEnquiry.id}`} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-deep-cocoa">{selectedEnquiry.couple}</h2>
                <div className="text-xs text-warm-taupe mt-1 flex justify-center items-center gap-2 font-medium">
                  <span className="material-icons text-xs">calendar_today</span> {selectedEnquiry.date}
                  <span className="w-1 h-1 bg-warm-taupe/30 rounded-full"></span>
                  {selectedEnquiry.guests} Guests
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <button className="p-2.5 rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"><span className="material-icons text-sm">mail</span></button>
                  <button className="p-2.5 rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"><span className="material-icons text-sm">phone</span></button>
                  <button className="p-2.5 rounded-lg border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"><span className="material-icons text-sm">edit</span></button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[10px] font-bold text-warm-taupe uppercase tracking-widest mb-2 px-1">Wedding Notes</h3>
                <div className="bg-background-light/50 p-4 rounded-xl border border-primary/10 text-xs text-deep-cocoa leading-relaxed font-medium">
                  Interested in the Gold Package. They loved the coastal view from the terrace. Groom is gluten-free.
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-warm-taupe uppercase tracking-widest mb-4 px-1">Pipeline Progress</h3>
                <div className="relative pt-2 px-2">
                  <div className="h-1 bg-background-light absolute w-full left-0 top-3.5 rounded-full"></div>
                  <div className="h-1 bg-primary absolute left-0 top-3.5 rounded-full" style={{ width: '60%' }}></div>
                  <div className="flex justify-between relative">
                    {['New', 'Intro', 'Visit', 'Quote', 'Paid'].map((step, i) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 ${i <= 2 ? 'bg-primary' : 'bg-background-light'}`}></div>
                        <span className="text-[9px] font-bold text-warm-taupe mt-2">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => onNavigate(View.KITCHEN_OPS)} className="w-full bg-deep-cocoa text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-xs tracking-widest">GENERATE QUOTE</button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onNavigate(View.COUPLE_PORTAL)} className="bg-ivory border border-primary/30 text-deep-cocoa font-bold py-3 rounded-xl text-[10px] tracking-widest hover:border-primary transition-all">VIEW PORTAL</button>
                  <button className="bg-ivory border border-primary/30 text-deep-cocoa font-bold py-3 rounded-xl text-[10px] tracking-widest hover:border-primary transition-all">SEND BROCHURE</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default EnquiryManager;