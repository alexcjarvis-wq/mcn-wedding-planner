import React, { useState } from 'react';
import { View } from '../types';

const MenuSelection: React.FC<{ onNavigate: (v: View) => void }> = ({ onNavigate }) => {
  const [selectedStarters, setSelectedStarters] = useState<string[]>(['1']);
  
  const STARTERS = [
    { id: '1', name: 'Classic Minestrone Soup', desc: 'A hearty, traditional Italian vegetable soup with basil oil.', tags: ['V', 'VEGAN'], supplement: 0 },
    { id: '2', name: 'Chicken Liver Parfait', desc: 'Smooth pâté with red onion marmalade and brioche.', tags: ['GF AVAILABLE'], supplement: 0 },
    { id: '3', name: 'Seared King Scallops', desc: 'Pan-seared with pea purée and lemon butter sauce.', tags: ['GF'], supplement: 3 },
    { id: '4', name: 'Goats Cheese Tartlet', desc: 'Warm caramelized red onion and goats cheese.', tags: ['V'], supplement: 0 },
    { id: '5', name: 'Smoked Salmon & Prawns', desc: 'Marie rose sauce and buttered brown bread.', tags: ['GF AVAILABLE'], supplement: 0 },
    { id: '6', name: 'Duck Liver Terrine', desc: 'Infused with orange and cognac, fruit chutney.', tags: ['GF AVAILABLE'], supplement: 2 },
  ];

  const toggleStarter = (id: string) => {
    if (selectedStarters.includes(id)) {
      setSelectedStarters(prev => prev.filter(i => i !== id));
    } else if (selectedStarters.length < 2) {
      setSelectedStarters(prev => [...prev, id]);
    }
  };

  const totalSupplement = selectedStarters.reduce((acc, id) => {
    const item = STARTERS.find(s => s.id === id);
    return acc + (item?.supplement || 0);
  }, 0);

  return (
    <div className="flex flex-col h-screen bg-background-light font-work overflow-hidden">
      <header className="bg-white border-b border-primary/20 h-20 flex-shrink-0 z-30 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">SG</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-cocoa">Menu Selection</h1>
              <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold">Shotton Grange Wedding Portal</p>
            </div>
          </div>
          <div className="flex flex-col items-end w-1/3 max-w-md">
            <div className="flex justify-between w-full text-[10px] font-bold text-secondary mb-2 uppercase tracking-widest">
              <span>Step 1 of 3: Wedding Breakfast</span>
              <span className="text-primary">33% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-64 bg-white border-r border-primary/10 flex-none hidden lg:flex flex-col overflow-y-auto py-8">
          <div className="px-6 mb-8">
            <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Courses</h3>
            <ul className="space-y-2">
              {['Canapés', 'Starters', 'Main Courses', 'Roasts', 'Desserts'].map((item, i) => (
                <li key={item}>
                  <button className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${i === 1 ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-cocoa hover:bg-background-light'}`}>
                    <span>{item}</span>
                    <span className="material-icons text-sm">chevron_right</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 mt-auto">
            <div className="bg-background-light p-4 rounded-xl">
              <p className="text-[10px] font-bold text-secondary uppercase mb-2">Need assistance?</p>
              <button className="text-xs font-bold text-cocoa hover:text-primary flex items-center gap-2">
                <span className="material-icons text-sm">mail</span> CONTACT PLANNER
              </button>
            </div>
          </div>
        </nav>

        {/* Menu Grid */}
        <main className="flex-1 overflow-y-auto p-10 relative no-scrollbar">
          <div className="max-w-5xl mx-auto pb-32">
            <div className="mb-10">
              <h2 className="text-3xl font-light text-cocoa mb-2">Starters</h2>
              <p className="text-secondary text-sm">Please select up to two options for your guests to choose from.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STARTERS.map((item) => {
                const isSelected = selectedStarters.includes(item.id);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleStarter(item.id)}
                    className={`relative bg-white rounded-xl p-6 border-2 transition-all cursor-pointer group hover:shadow-md ${isSelected ? 'border-primary shadow-sm' : 'border-transparent shadow-sm'}`}
                  >
                    <div className="absolute top-4 right-4">
                      <div className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-200 group-hover:border-primary'}`}>
                        {isSelected && <span className="material-icons text-sm font-bold">check</span>}
                      </div>
                    </div>
                    <div className="pr-8">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-cocoa">{item.name}</h3>
                        {item.supplement > 0 && (
                          <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-widest">+£{item.supplement}.00 SUPPL</span>
                        )}
                      </div>
                      <p className="text-secondary text-xs leading-relaxed mb-4">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-3 py-0.5 bg-cocoa text-white text-[9px] rounded-full font-bold tracking-widest">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/90 backdrop-blur border-t border-primary/20 flex justify-between items-center z-40">
            <div className="text-xs font-bold uppercase tracking-widest text-secondary">
              Total Supplements: <span className="text-cocoa text-xl ml-2 tracking-tight">£{totalSupplement.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => onNavigate(View.KITCHEN_OPS)}
              className="bg-primary hover:bg-primary/90 text-cocoa font-bold py-4 px-10 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
            >
              Save & Continue <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </main>

        {/* Sidebar Dietary */}
        <aside className="w-80 bg-white border-l border-primary/10 hidden xl:flex flex-col p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><span className="material-icons">restaurant_menu</span></div>
            <h3 className="text-sm font-bold text-cocoa uppercase tracking-widest">Dietaries</h3>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
            {['Sarah Jenkins', 'Uncle Mike'].map(name => (
              <div key={name} className="bg-background-light p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-cocoa">{name}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors"><span className="material-icons text-sm">delete</span></button>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                </div>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-primary/30 rounded-xl text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary/5 transition-all">
              + Add Requirement
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MenuSelection;