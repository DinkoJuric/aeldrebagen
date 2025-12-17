import React from 'react';
import { Calendar, Heart } from 'lucide-react';

// Tab definitions for SeniorView navigation
export const TABS = [
    { id: 'daily', label: 'Min dag', icon: Calendar, emoji: '📋' },
    { id: 'family', label: 'Familie', icon: Heart, emoji: '💜' },
];

export interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex gap-2 p-2 bg-stone-100 rounded-2xl">
            {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                            font-semibold text-lg transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
                            ${isActive
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-stone-500 hover:bg-stone-200'
                            }
                        `}
                        aria-label={tab.label}
                        aria-selected={isActive}
                        role="tab"
                    >
                        <span className="text-xl">{tab.emoji}</span>
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TabNavigation;
