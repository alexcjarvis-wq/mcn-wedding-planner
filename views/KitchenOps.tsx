import React from 'react';
import { View } from '../types';

const KitchenOps: React.FC<{ onNavigate: (v: View) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light min-h-screen font-display flex flex-col transition-colors">
      <div className="h-2 bg-primary w-full"></div>
      <div className="max-w-[1400px] mx-auto w-full p-8 lg:p-12 flex-grow flex flex-col gap-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-primary/20 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/20 text-cocoa px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">Kitchen Ops Pack</span>
              <span className="text-secondary text-xs font-bold flex items-center gap-1">
                <span className="material-icons text-sm">place</span> Shotton Grange
              </span>
            </div>
            <h1 className="text-4xl font-bold text-cocoa mb-3">Sarah & James Wedding</h1>
            <div className="flex items-center gap-8 text-secondary text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><span className="material-icons text-primary">calendar_today</span> Sat, 14th Sept</div>
              <div className="flex items-center gap-2"><span className="material-icons text-primary">group</span> 120 Guests</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-secondary/20 rounded-xl text-xs font-bold hover:border-primary transition-all shadow-sm">
              <span className="material-icons text-sm">cloud_download</span> DOWNLOAD PDF
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95">
              <span className="material-icons text-sm">print</span> PRINT FOR KITCHEN
            </button>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 overflow-hidden flex-1">
              <div className="bg-primary/10 p-5 border-b border-primary/20">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-icons text-primary">schedule</span> Timeline
                </h2>
              </div>
              <div className="p-6 relative">
                <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gray-100"></div>
                {[
                  { time: '14:00', title: 'Canapés Service', desc: 'Terrace / Lounge' },
                  { time: '16:30', title: 'Wedding Breakfast', desc: 'Main Hall - 3 Courses' },
                  { time: '18:30', title: 'Speeches & Toast', desc: 'Staff Standby' },
                  { time: '21:00', title: 'Evening Food', desc: 'Wood Fired Pizza' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 mb-8 last:mb-0">
                    <div className="w-16 text-right font-mono font-bold text-sm text-cocoa pt-0.5">{item.time}</div>
                    <div className="relative z-10 w-3 h-3 rounded-full bg-primary mt-1.5 border-2 border-white shadow-sm"></div>
                    <div>
                      <h3 className="text-sm font-bold text-cocoa">{item.title}</h3>
                      <p className="text-[10px] text-secondary font-bold uppercase mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-cocoa text-white rounded-2xl p-6 shadow-xl border border-cocoa">
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Staffing</h3>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Head Chef</span><span className="text-primary">Michael R.</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Sous Chefs</span><span>3</span></div>
                <div className="flex justify-between"><span>KP / Porters</span><span>2</span></div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 flex-1 flex flex-col">
              <div className="p-5 border-b border-secondary/10 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-cocoa">
                  <span className="material-icons text-primary">restaurant_menu</span> Final Menu
                </h2>
                <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-1 rounded">SIGNED OFF</span>
              </div>
              <div className="p-6 space-y-8">
                {['Starter', 'Main Course', 'Dessert'].map((course, i) => (
                  <div key={course}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{course}</span>
                      <span className="text-lg font-mono font-bold text-primary tracking-tighter">115</span>
                    </div>
                    <div className="p-4 bg-background-light rounded border border-gray-100">
                      <h3 className="text-base font-bold text-cocoa">{i === 0 ? 'Garden Pea Soup' : i === 1 ? 'Chicken Supreme' : 'Sticky Toffee Pudding'}</h3>
                      <p className="text-[10px] font-bold text-secondary uppercase mt-1 tracking-wider">Kitchen prep priority A</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dietaries */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-primary/20 flex-1 flex flex-col overflow-hidden">
              <div className="bg-primary/10 p-5 border-b border-primary/20 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-icons text-red-600">warning</span> Critical Dietaries
                </h2>
                <span className="text-[10px] font-bold bg-primary/30 px-2 py-1 rounded">CRITICAL</span>
              </div>
              <div className="flex-1 overflow-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-light text-secondary font-bold uppercase text-[10px] tracking-widest sticky top-0">
                    <tr>
                      <th className="px-5 py-4">Guest</th>
                      <th className="px-5 py-4 text-center">Table</th>
                      <th className="px-5 py-4">Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold">
                    <tr className="bg-red-50"><td className="px-5 py-4">Emily Thompson</td><td className="px-5 py-4 text-center">04</td><td className="px-5 py-4 text-red-600">Severe Nut Allergy</td></tr>
                    <tr><td className="px-5 py-4">Mark Wilson</td><td className="px-5 py-4 text-center">02</td><td className="px-5 py-4 text-cocoa">Vegan - No Dairy</td></tr>
                    <tr className="bg-orange-50"><td className="px-5 py-4">James Peterson</td><td className="px-5 py-4 text-center">07</td><td className="px-5 py-4 text-orange-600">Gluten Free (Coeliac)</td></tr>
                    <tr><td className="px-5 py-4">Linda Grey</td><td className="px-5 py-4 text-center">08</td><td className="px-5 py-4 text-cocoa">Pescatarian</td></tr>
                    <tr className="bg-red-50"><td className="px-5 py-4">Baby Oliver</td><td className="px-5 py-4 text-center">11</td><td className="px-5 py-4 text-red-600">Dairy Allergy</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-background-light border-t border-gray-100 text-[10px] text-secondary font-bold italic text-center uppercase tracking-widest">
                * Cross-reference with FoH before plating
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-auto border-t border-primary/10 py-6 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
          <p>Generated by MCN Events Manager • Updated 14 Sept 09:30 AM</p>
          <div className="flex gap-6 mt-4 lg:mt-0">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Kitchen Copy</span>
            <span className="flex items-center gap-1 opacity-40"><span className="w-2 h-2 rounded-full border border-secondary"></span> FoH Copy</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default KitchenOps;