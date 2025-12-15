import React from 'react';
import { Home, Users, FileText, Gamepad2 } from 'lucide-react';

export const BottomNavigation = ({ activeTab, onTabChange, onViewReport }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-3 pb-6 safe-area-bottom z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                {/* Min dag */}
                <button
                    onClick={() => onTabChange('daily')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'daily' ? 'text-teal-600' : 'text-stone-400 hover:text-stone-600'
                        }`}
                >
                    <Home className={`w-6 h-6 ${activeTab === 'daily' ? 'fill-teal-100' : ''}`} />
                    <span className="text-xs font-bold">Min dag</span>
                </button>

                {/* Familie */}
                <button
                    onClick={() => onTabChange('family')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'family' ? 'text-indigo-600' : 'text-stone-400 hover:text-stone-600'
                        }`}
                >
                    <Users className={`w-6 h-6 ${activeTab === 'family' ? 'fill-indigo-100' : ''}`} />
                    <span className="text-xs font-bold">Familie</span>
                </button>

                {/* Spil */}
                <button
                    onClick={() => onTabChange('spil')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'spil' ? 'text-purple-600' : 'text-stone-400 hover:text-stone-600'
                        }`}
                >
                    <Gamepad2 className={`w-6 h-6 ${activeTab === 'spil' ? 'fill-purple-100' : ''}`} />
                    <span className="text-xs font-bold">Spil</span>
                </button>

                {/* Rapport */}
                <button
                    onClick={onViewReport}
                    className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-bold">Rapport</span>
                </button>
            </div>
        </div>
    );
};
