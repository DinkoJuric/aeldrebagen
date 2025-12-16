import React from 'react';
import { Briefcase, Home, Car, Coffee, Moon } from 'lucide-react';
import { Avatar } from './ui/Avatar';

// Family member status options
const STATUS_OPTIONS = [
    { id: 'work', label: 'På arbejde', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'home', label: 'Hjemme', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'traveling', label: 'Undervejs', icon: Car, color: 'bg-amber-100 text-amber-600' },
    { id: 'available', label: 'Har tid til en snak', icon: Coffee, color: 'bg-teal-100 text-teal-600' },
    { id: 'busy', label: 'Optaget', icon: Moon, color: 'bg-stone-100 text-stone-500' },
];

// What the SENIOR sees about their family member
export const FamilyStatusCard = ({ familyStatus, familyName = 'Louise', lastUpdated }) => {
    const status = STATUS_OPTIONS.find(s => s.id === familyStatus) || STATUS_OPTIONS[0];

    // Map status ID to Avatar ID
    const avatarId = {
        'work': 'work',
        'home': 'home',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon'
    }[familyStatus] || 'home';

    // Format timestamp
    let timeString = '';
    if (lastUpdated) {
        const date = typeof lastUpdated.toDate === 'function' ? lastUpdated.toDate() : new Date(lastUpdated);
        timeString = date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
    } else {
        timeString = '-';
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar id={familyName === 'Brad' ? 'brad' : familyName.includes('Fatima') ? 'fatima' : 'louise'} size="md" />

                {/* Status info */}
                <div>
                    <h4 className="font-bold text-stone-800 text-sm">{familyName}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            {status.label}
                        </span>
                        <span className="text-[10px] text-stone-400">• {timeString}</span>
                    </div>
                </div>
            </div>

            {/* Status Icon */}
            <div className="bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                <Avatar id={avatarId} size="sm" />
            </div>
        </div>
    );
};

// Status selector for RELATIVE to set their status
export const StatusSelector = ({ currentStatus, onStatusChange, compact = false }) => {
    return (
        <div className="flex gap-2 justify-between">
            {STATUS_OPTIONS.map(status => {
                const isActive = currentStatus === status.id;

                // Map status ID to Avatar ID
                const avatarId = {
                    'work': 'work',
                    'home': 'home',
                    'traveling': 'car',
                    'available': 'coffee',
                    'busy': 'moon'
                }[status.id] || 'home';

                return (
                    <button
                        key={status.id}
                        onClick={() => onStatusChange(status.id)}
                        className={`
                            group relative flex items-center justify-center p-2 rounded-xl transition-all duration-200
                            ${isActive
                                ? 'bg-white shadow-md ring-2 ring-indigo-500 scale-110 z-10'
                                : 'bg-white/50 hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-200'
                            }
                        `}
                        title={status.label}
                    >
                        <Avatar
                            id={avatarId}
                            size="md"
                            className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                        />

                        {/* Status Label Tooltip (visible on hover or active) */}
                        <div className={`
                            absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-bold bg-stone-800 text-white
                            pointer-events-none transition-all duration-200 z-20
                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}
                        `}>
                            {status.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

// List of family members with their status - for SeniorView with multiple relatives
// Now uses relativeStatuses array for per-member status tracking
export const FamilyStatusList = ({
    members = [],
    relativeStatuses = [],
    lastUpdated,
    maxDisplay = 3
}) => {
    // Filter to only relatives (not the senior themselves)
    const relatives = members.filter(m => m.role === 'relative');

    if (relatives.length === 0 && relativeStatuses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-stone-100 mb-4">
                <p className="text-stone-400 text-sm text-center">Ingen pårørende endnu</p>
            </div>
        );
    }

    // Prefer relativeStatuses if available (per-member), fall back to members list
    const statusData = relativeStatuses.length > 0
        ? relativeStatuses
        : relatives.map(m => ({ displayName: m.displayName, status: 'home', updatedAt: null }));

    const displayedMembers = statusData.slice(0, maxDisplay);
    const hiddenCount = Math.max(0, statusData.length - maxDisplay);

    return (
        <div className="space-y-2 mb-4">
            {displayedMembers.map((member, index) => (
                <FamilyStatusCard
                    key={member.docId || member.userId || index}
                    familyName={member.displayName || 'Pårørende'}
                    familyStatus={member.status}
                    lastUpdated={member.updatedAt || lastUpdated}
                />
            ))}
            {hiddenCount > 0 && (
                <div className="text-center py-2">
                    <span className="text-sm text-stone-400">
                        +{hiddenCount} {hiddenCount === 1 ? 'mere' : 'andre'}
                    </span>
                </div>
            )}
        </div>
    );
};

export { STATUS_OPTIONS };
export default FamilyStatusCard;
