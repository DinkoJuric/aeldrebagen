
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Anchor, Heart, Coffee, Leaf, Hexagon, Star, Network } from 'lucide-react';


/* --- MOCK DATA --- */
const FAMILY = [
  { id: 1, name: 'Mor (Dig)', role: 'senior', status: 'active', relation: 'self' },
  { id: 2, name: 'Louise', role: 'caregiver', status: 'active', relation: 'daughter' },
  { id: 3, name: 'Peter', role: 'relative', status: 'busy', relation: 'son' },
  { id: 4, name: 'Emma', role: 'joy', status: 'active', relation: 'grandchild', parentId: 2 },
  { id: 5, name: 'Noah', role: 'joy', status: 'offline', relation: 'grandchild', parentId: 2 },
  { id: 6, name: 'Sofie', role: 'caregiver', status: 'active', relation: 'niece', parentId: 3 },
];



/* --- 6. TRADITIONAL TREE (Stamtræ) --- */
const TraditionalTree = React.forwardRef(({ members }, ref) => {
  return (
    <div ref={ref} className="relative h-64 w-full bg-stone-50 rounded-xl flex flex-col items-center justify-center p-4">
       {/* Level 1: Senior */}
       <div className="z-10 mb-8 relative">
          <div className="w-16 h-16 bg-teal-100 rounded-lg border-2 border-teal-200 shadow-sm flex items-center justify-center">
             <span className="text-3xl">👵</span>
          </div>
          {/* Connector Line Down */}
          <div className="absolute top-16 left-1/2 w-0.5 h-8 bg-stone-300 -translate-x-1/2" />
       </div>

       {/* Level 2: Children (Horizontal Bar) */}
       <div className="relative w-full flex justify-center gap-12">
          {/* Horizontal Connector */}
          <div className="absolute -top-4 left-[25%] right-[25%] h-0.5 bg-stone-300" />
          
          <div className="flex flex-col items-center">
             <div className="absolute -top-4 w-0.5 h-4 bg-stone-300" />
             <div className="w-12 h-12 bg-white rounded-lg border-2 border-stone-200 shadow-sm flex items-center justify-center font-bold text-stone-600">L</div>
             {/* Branch to Grandchild */}
             <div className="w-0.5 h-4 bg-stone-300" />
             <div className="flex gap-2 mt-1">
                <div className="w-8 h-8 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-xs">E</div>
                <div className="w-8 h-8 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-xs">N</div>
             </div>
          </div>

          <div className="flex flex-col items-center">
             <div className="absolute -top-4 w-0.5 h-4 bg-stone-300" />
             <div className="w-12 h-12 bg-white rounded-lg border-2 border-stone-200 shadow-sm flex items-center justify-center font-bold text-stone-600">P</div>
             <div className="w-0.5 h-4 bg-stone-300" />
             <div className="w-8 h-8 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-xs mt-1">S</div>
          </div>
       </div>
    </div>
  );
});

/* --- 7. THE TREE CROWN (Livstræet) --- */
const TreeCrown = React.forwardRef(({ members }, ref) => {
  const relatives = members.filter(m => m.role !== 'senior');
  
  return (
    <div ref={ref} className="relative h-72 w-full bg-gradient-to-b from-sky-50 to-white rounded-xl overflow-hidden flex items-end justify-center">
       {/* The Trunk (Senior) */}
       <div className="relative z-20 flex flex-col items-center">
          <div className="w-24 h-32 bg-[#8B5E3C] rounded-t-lg flex items-end justify-center pb-4 relative overflow-hidden">
             {/* Bark texture */}
             <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_6px)]" />
             <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-inner border-4 border-[#6F4E37] z-30">
                <span className="text-3xl">👵</span>
             </div>
          </div>
       </div>

       {/* The Crown (Canopy) */}
       <div className="absolute bottom-24 w-full h-48 flex justify-center">
          {/* Main Canopy Shape */}
          <div className="absolute bottom-0 w-64 h-48 bg-green-100/80 rounded-full filter blur-sm scale-110" />
          <div className="absolute bottom-2 w-56 h-40 bg-green-200/50 rounded-full" />
          
          {/* Branches & Leaves (Relatives) */}
          {relatives.map((m, i) => {
             // Distribute them in an arc
             const angle = (Math.PI) + (i * (Math.PI / (relatives.length - 1 + 2))) + 0.5; // Arc from 9 o'clock to 3 o'clock
             const radius = 90;
             const x = Math.cos(angle) * radius * 1.2;
             const y = Math.sin(angle) * radius;

             return (
                <motion.div
                   key={m.id}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="absolute bottom-0 left-1/2 origin-bottom"
                   style={{ transform: `translateX(-50%) translate(${x}px, ${y}px)` }}
                >
                   {/* Connection Line to Trunk */}
                   <div 
                     className="absolute top-1/2 left-1/2 w-1 h-24 bg-[#8B5E3C] origin-top -z-10"
                     style={{ 
                        transform: `rotate(${angle + Math.PI / 2}rad)`, 
                        height: '100px',
                        top: '10px'
                     }} 
                   />
                   
                   <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-50 rounded-full border-2 border-green-200 shadow-sm flex items-center justify-center relative z-20">
                         <span className="text-sm font-bold text-green-800">{m.name[0]}</span>
                         <Leaf size={12} className="absolute -top-2 -right-1 text-green-500 fill-green-200" />
                      </div>
                      <span className="text-[9px] font-bold text-green-800 bg-white/80 px-1 rounded mt-1">{m.name}</span>
                   </div>
                </motion.div>
             );
          })}
       </div>
    </div>
  );
});

/* --- 2. COFFEE TABLE (Kaffebordet) --- */
const CoffeeTable = React.forwardRef(({ members }, ref) => {
  const relatives = members.filter(m => m.role !== 'senior');
  
  // Calculate positions
  const getPos = (i, total) => {
      const angle = (i * (360 / total)) * (Math.PI / 180);
      const radius = 100;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  return (
    <div ref={ref} className="relative h-72 w-full bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center">
       {/* Table Surface */}
       <div className="w-48 h-48 bg-amber-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 rounded-full" />
          
          {/* Subtle Connection Lines on Table */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
             {/* Connect siblings (simulated logic: index 0 and 1 are siblings, etc) */}
             <path d="M 30,50 Q 96,96 160,50" fill="none" stroke="#92400e" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

          <div className="text-center relative z-20">
             <Coffee className="w-8 h-8 text-amber-800 mx-auto mb-1 opacity-50" />
             <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Familien</span>
          </div>
       </div>

       {/* The Seats */}
       {relatives.map((m, i) => {
          const { x, y } = getPos(i, relatives.length);
          return (
             <motion.div
               key={m.id}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="absolute w-12 h-12 z-20"
               style={{ transform: `translate(${x}px, ${y}px)` }}
             >
                <div className="w-full h-full bg-white rounded-full shadow-md border-2 border-stone-100 flex items-center justify-center relative group">
                   <span className="font-bold text-stone-700">{m.name[0]}</span>
                   {m.status === 'active' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                   )}
                   
                   {/* Name Tag */}
                   <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white/80 px-2 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {m.name} ({m.relation})
                   </div>
                </div>
             </motion.div>
          );
       })}
    </div>
  );
});

/* --- MAIN CONTROLLER --- */
export default function FamilyVisualizer() {
  const [activeTab, setActiveTab] = useState(0);
  const TABS = [
    { title: 'Kaffebord', component: CoffeeTable },
    { title: 'Stamtræ', component: TraditionalTree },
    { title: 'Livstræ', component: TreeCrown },
  ];

  // Helper to render current component with ref passing
  const ActiveComponent = TABS[activeTab].component;

  return (
    <div className="max-w-md mx-auto p-4 bg-stone-50 min-h-screen font-sans">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-stone-800">Familie Visualisering</h1>
        <p className="text-stone-500 text-sm">Design Eksperimenter</p>
      </div>

      <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100 flex gap-1 mb-6 overflow-x-auto hide-scrollbar">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0
              ${activeTab === i ? 'bg-teal-500 text-white shadow-sm' : 'text-stone-400 hover:bg-stone-50'}
            `}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-2xl p-1 shadow-lg border border-stone-100">
             <ActiveComponent members={FAMILY} />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-stone-600">
             <p className="font-bold text-blue-800 mb-1">Analyse:</p>
             {activeTab === 0 && "Kaffebordet: Det stærkeste sociale symbol i Danmark. Fokus på mødet."}
             {activeTab === 1 && "Stamtræet: Struktureret og logisk. Men føles det 'koldt' og bureaukratisk?"}
             {activeTab === 2 && "Livstræet: Smuk 'Krone' metafor. Senior som stammen, familien som beskyttende blade."}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}