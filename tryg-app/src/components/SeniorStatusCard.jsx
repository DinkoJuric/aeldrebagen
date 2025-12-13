import React from 'react';
import { User, Clock, Pill } from 'lucide-react';

// Senior status card - displayed in RelativeView to show senior's status
// Mirrors the structure of FamilyStatusCard for consistency
export const SeniorStatusCard = ({
    seniorName = 'Senior',
    lastCheckIn,
    completionRate = 0,
    className = ''
}) => {
    // Determine status based on check-in recency and completion rate
    const getStatus = () => {
        if (!lastCheckIn) return { label: 'Venter...', color: 'bg-stone-100 text-stone-600 border-stone-200' };
        if (completionRate >= 80) return { label: 'Alt er vel', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
        if (completionRate >= 50) return { label: 'God dag', color: 'bg-teal-100 text-teal-700 border-teal-200' };
        return { label: 'Tjek ind', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    };

    const status = getStatus();

    return (
        <div className={`bg-white p-4 rounded-2xl shadow-sm border-2 border-teal-100 ${className}`}>
            <div className="flex justify-between items-center">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-stone-800">{seniorName}</h3>
                        <div className="flex items-center gap-1 text-xs text-stone-500">
                            <Clock className="w-3 h-3" />
                            <span>Sidst: {lastCheckIn || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Status badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                    {status.label}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-stone-50 p-3 rounded-xl">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-0.5">Tjekket ind</p>
                    <div className="flex items-center gap-1.5 text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-sm font-medium">{lastCheckIn || 'Venter...'}</span>
                    </div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-0.5">Medicin</p>
                    <div className="flex items-center gap-1.5 text-stone-700">
                        <Pill className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-sm font-medium">{completionRate}% taget</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeniorStatusCard;
