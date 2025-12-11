import React from 'react';
import { Briefcase, Home, Car, Coffee, Moon } from 'lucide-react';

// Family member status options
const STATUS_OPTIONS = [
    { id: 'work', label: 'På arbejde', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'home', label: 'Hjemme', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'traveling', label: 'Undervejs', icon: Car, color: 'bg-amber-100 text-amber-600' },
    { id: 'available', label: 'Har tid til en snak', icon: Coffee, color: 'bg-teal-100 text-teal-600' },
    { id: 'busy', label: 'Optaget', icon: Moon, color: 'bg-stone-100 text-stone-500' },
];

// What the SENIOR sees about their family member
export const FamilyStatusCard = ({ familyStatus, familyName = 'Louise' }) => {
    const status = STATUS_OPTIONS.find(s => s.id === familyStatus) || STATUS_OPTIONS[0];
    const StatusIcon = status.icon;

    // Format current time for "last updated"
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-indigo-100 mb-4">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {familyName.charAt(0)}
                </div>

                {/* Status info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">{familyName}</span>
                        <div className={`p-1 rounded-lg ${status.color}`}>
                            <StatusIcon className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-stone-500 text-sm">{status.label}</p>
                </div>

                {/* Time indicator */}
                <div className="text-right">
                    <p className="text-xs text-stone-400">Opdateret</p>
                    <p className="text-sm font-medium text-stone-600">{timeString}</p>
                </div>
            </div>
        </div>
    );
};

// Status selector for RELATIVE to set their status
export const StatusSelector = ({ currentStatus, onStatusChange }) => {
    return (
        <div className="grid grid-cols-5 gap-2">
            {STATUS_OPTIONS.map(status => {
                const StatusIcon = status.icon;
                const isActive = currentStatus === status.id;

                return (
                    <button
                        key={status.id}
                        onClick={() => onStatusChange(status.id)}
                        className={`
                            flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                            ${isActive
                                ? `${status.color} ring-2 ring-offset-1 ring-indigo-400`
                                : 'bg-white hover:bg-stone-50 border border-stone-200'
                            }
                        `}
                    >
                        <StatusIcon className={`w-5 h-5 ${isActive ? '' : 'text-stone-400'}`} />
                        <span className={`text-[10px] font-medium ${isActive ? '' : 'text-stone-500'}`}>
                            {status.label.split(' ')[0]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export { STATUS_OPTIONS };
export default FamilyStatusCard;
