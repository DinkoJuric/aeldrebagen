// FamilyPresence - "Familien Nu" section showing all family members' statuses
// Reusable on both Connection (Min Dag) and Koordinering (Familie) tabs
// Now uses CareCircleContext for shared data (props are optional overrides)

import React from 'react';
import { Users, Home, Briefcase, Car, Coffee, Moon, Heart } from 'lucide-react';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { Avatar } from './ui/Avatar';

// Status display configuration
const STATUS_CONFIG = {
    home: { label: 'Hjemme', icon: Home, color: 'text-green-600' },
    work: { label: 'På arbejde', icon: Briefcase, color: 'text-indigo-600' },
    traveling: { label: 'Undervejs', icon: Car, color: 'text-amber-600' },
    available: { label: 'Har tid til en snak', icon: Coffee, color: 'text-teal-600' },
    busy: { label: 'Optaget', icon: Moon, color: 'text-stone-500' },
};

// Senior status display (different from relatives)
const SENIOR_STATUS = {
    good: { label: 'Har det godt', icon: Heart, color: 'text-green-600' },
    default: { label: 'Aktiv', icon: Heart, color: 'text-stone-500' },
};

/**
 * Compact status display row for a family member
 */
const MemberStatusRow = ({ name, status, role, timestamp, isCurrentUser = false }) => {
    // Determine avatar ID based on name or role
    const avatarId = role === 'senior' ? 'senior' :
        name === 'Test User' ? 'fatima' :
            name === 'Brad' ? 'brad' : 'louise';

    // Status mapping for sprite IDs
    const statusIdMapping = {
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
        const date = typeof timestamp.toDate === 'function'
            ? timestamp.toDate()
            : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
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
        <div className={`flex items-center justify-between py-3 ${isCurrentUser ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3">
                <Avatar id={avatarId} size="md" className="bg-stone-200" />
                <div>
                    <span className="text-sm font-bold text-stone-700 block text-left">
                        {name}{isCurrentUser ? ' (dig)' : ''}
                    </span>
                    <span className={`text-xs ${config.color} block text-left`}>{config.label}</span>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <Avatar id={statusIconId} size="sm" className="" />
                {timeString && (
                    <span className="text-[10px] text-stone-400 mt-0.5">{timeString}</span>
                )}
            </div>
        </div>
    );
};

/**
 * Family Presence section - "Familien Nu"
 * Shows all family members' current statuses
 * 
 * Uses CareCircleContext for data, with props as optional overrides.
 * @param {boolean} compact - If true, uses smaller padding (for Min Dag tab)
 */
export const FamilyPresence = ({
    memberStatuses: propsMembers,
    currentUserId: propsUserId,
    seniorName: propsSeniorName,
    compact = false
}) => {
    // Get from context, use props as override if provided
    const context = useCareCircleContext();
    const memberStatuses = propsMembers ?? context.memberStatuses ?? [];
    const currentUserId = propsUserId ?? context.currentUserId;
    const seniorName = propsSeniorName ?? context.seniorName ?? 'Far/Mor';
    if (memberStatuses.length === 0) {
        return (
            <div className={`bg-stone-50 rounded-xl ${compact ? 'p-3' : 'p-4'} border border-stone-200`}>
                <p className="text-stone-400 text-sm text-center">Ingen familiemedlemmer endnu</p>
            </div>
        );
    }

    return (
        <div className={`bg-stone-50 rounded-xl ${compact ? 'p-3' : 'p-4'} border border-stone-200`}>
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                    Familien nu
                </h4>
            </div>
            <div className="divide-y divide-stone-200">
                {memberStatuses.map((member, index) => (
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
