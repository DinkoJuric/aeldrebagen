import React from 'react';
import { Heart, Users, FileText } from 'lucide-react';

// Bottom navigation for RelativeView - peace of mind vs coordination
export const RelativeBottomNavigation = ({ activeTab, onTabChange, onShowReport }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-3 pb-6 safe-area-bottom z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                {/* Min Dag - Peace of Mind */}
                <button
                    onClick={() => onTabChange('daily')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'daily' ? 'text-teal-600' : 'text-stone-400 hover:text-stone-600'
                        }`}
                >
                    <Heart className={`w-7 h-7 ${activeTab === 'daily' ? 'fill-teal-100' : ''}`} />
                    <span className="text-xs font-bold">Min dag</span>
                </button>

                {/* Familie - Coordination */}
                <button
                    onClick={() => onTabChange('family')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'family' ? 'text-indigo-600' : 'text-stone-400 hover:text-stone-600'
                        }`}
                >
                    <Users className={`w-7 h-7 ${activeTab === 'family' ? 'fill-indigo-100' : ''}`} />
                    <span className="text-xs font-bold">Familie</span>
                </button>

                {/* Health Report shortcut */}
                <button
                    onClick={onShowReport}
                    className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <div className="bg-stone-100 p-1.5 rounded-xl">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Rapport</span>
                </button>
            </div>
        </div>
    );
};

export default RelativeBottomNavigation;
