// FamilyPresence - "Familien Nu" section showing all family members' statuses
// Reusable on both Connection (Min Dag) and Koordinering (Familie) tabs
// Now uses CareCircleContext for shared data (props are optional overrides)

import React from 'react';
import { Users, Home, Briefcase, Car, Coffee, Moon, Heart } from 'lucide-react';
// @ts-ignore - Context not yet converted
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Avatar } from '../../components/ui/Avatar';
import { MemberStatus } from './useMemberStatus';

// Status display configuration
interface StatusConfigItem {
    label: string;
    icon: React.ElementType;
    color: string;
}

const STATUS_CONFIG: Record<string, StatusConfigItem> = {
    home: { label: 'Hjemme', icon: Home, color: 'text-green-600' },
    work: { label: 'På arbejde', icon: Briefcase, color: 'text-indigo-600' },
    traveling: { label: 'Undervejs', icon: Car, color: 'text-amber-600' },
    available: { label: 'Har tid til en snak', icon: Coffee, color: 'text-teal-600' },
    busy: { label: 'Optaget', icon: Moon, color: 'text-stone-500' },
};

// Senior status display (different from relatives)
const SENIOR_STATUS: Record<string, StatusConfigItem> = {
    good: { label: 'Har det godt', icon: Heart, color: 'text-green-600' },
    default: { label: 'Aktiv', icon: Heart, color: 'text-stone-500' },
};

interface MemberStatusRowProps {
    name: string;
    status: string;
    role: string;
    timestamp?: any; // Firestore timestamp or Date
    isCurrentUser?: boolean;
}

/**
 * Compact status display row for a family member
 */
const MemberStatusRow: React.FC<MemberStatusRowProps> = ({ name, status, role, timestamp, isCurrentUser = false }) => {
    // Determine avatar ID based on name or role
    const avatarId = role === 'senior' ? 'senior' :
        (name.includes('Fatima') || name === 'Test User') ? 'fatima' :
            name === 'Brad' ? 'brad' : 'louise';

    // Status mapping for sprite IDs
    const statusIdMapping: Record<string, string> = {
        'home': 'home',
        'work': 'work',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon',
        'good': 'home', // Fallback for senior
        'default': 'home'
    };

    const statusIconId = statusIdMapping[status] || 'home';
    const config = role === 'senior'
        ? (SENIOR_STATUS[status] || SENIOR_STATUS.default)
        : (STATUS_CONFIG[status] || STATUS_CONFIG.home);

    // Format timestamp
    let timeString = '';
    if (timestamp) {
        const date = (timestamp && typeof timestamp.toDate === 'function')
            ? timestamp.toDate()
            : new Date(timestamp);

        const now = new Date();
        const diffMs = now.getTime() - date.getTime(); // Use getTime() to ensure number arithmetic
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) {
            timeString = `${diffMins}m`;
        } else if (diffMins < 1440) {
            timeString = `${Math.floor(diffMins / 60)}t`;
        } else {
            timeString = date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
        }
    }

    return (
        <div className={`
            flex items-center justify-between p-3 rounded-xl transition-all
            ${isCurrentUser ? 'bg-indigo-50/50 border border-indigo-100/50' : 'hover:bg-stone-50 border border-transparent hover:border-stone-100'}
        `}>
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar id={avatarId} size="md" className="shadow-sm border-2 border-white" />
                    {/* Tiny status indicator dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'available' ? 'bg-teal-500' :
                        status === 'home' ? 'bg-green-500' :
                            status === 'work' ? 'bg-indigo-500' :
                                status === 'traveling' ? 'bg-amber-500' : 'bg-stone-400'
                        }`} />
                </div>

                <div>
                    <span className={`text-sm font-bold block text-left ${isCurrentUser ? 'text-indigo-900' : 'text-stone-700'}`}>
                        {name} {isCurrentUser && <span className="opacity-50 text-xs font-normal">(dig)</span>}
                    </span>
                    <span className={`text-xs font-medium block text-left ${config.color || 'text-stone-500'}`}>
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Right: Pictogram + Time */}
            <div className="flex flex-col items-end gap-1">
                {/* Status Pictogram - Subtle glass feel */}
                <div className="bg-stone-100/80 p-1.5 rounded-lg backdrop-blur-sm">
                    <Avatar id={statusIconId} size="sm" />
                </div>

                {timeString && (
                    <span className="text-[10px] font-medium text-stone-400 tabular-nums">
                        {timeString}
                    </span>
                )}
            </div>
        </div>
    );
};

interface FamilyPresenceProps {
    memberStatuses?: MemberStatus[];
    currentUserId?: string;
    seniorName?: string;
    compact?: boolean;
}


/**
 * Family Presence section - "Familien Nu"
 * Shows all family members' current statuses
 */
export const FamilyPresence: React.FC<FamilyPresenceProps> = ({
    memberStatuses: propsMembers,
    currentUserId: propsUserId,
    seniorName: propsSeniorName,
    compact = false
}) => {
    // Get from context, use props as override if provided
    const context = useCareCircleContext() as any;
    const memberStatuses = propsMembers ?? context?.memberStatuses ?? [];
    const currentUserId = propsUserId ?? context?.currentUserId;
    const seniorName = propsSeniorName ?? context?.seniorName ?? 'Far/Mor';

    if (memberStatuses.length === 0) {
        return (
            <div className={`bg-stone-50 rounded-xl ${compact ? 'p-3' : 'p-4'} border border-stone-200`}>
                <p className="text-stone-400 text-sm text-center">Ingen familiemedlemmer endnu</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl ${compact ? 'p-3' : 'p-4'} border border-stone-100 shadow-sm overflow-hidden`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                        <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                        Familien nu
                    </h4>
                </div>
            </div>

            {/* Always show list view - orbit moved to Settings panel */}
            <div className="space-y-1">
                {memberStatuses.map((member: MemberStatus, index: number) => (
                    <MemberStatusRow
                        key={member.docId || index}
                        name={member.displayName || (member.role === 'senior' ? seniorName : 'Pårørende')}
                        status={member.status}
                        role={member.role}
                        timestamp={member.updatedAt}
                        isCurrentUser={member.docId === currentUserId}
                    />
                ))}
            </div>
        </div>
    );
};

export default FamilyPresence;
