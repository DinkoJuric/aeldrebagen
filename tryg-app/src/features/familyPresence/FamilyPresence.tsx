import React from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// @ts-ignore - Context not yet converted
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Avatar } from '../../components/ui/Avatar';
import { MemberStatus } from './useMemberStatus';

interface MemberStatusRowProps {
    name: string;
    status: string;
    role: string;
    timestamp?: any;
    isCurrentUser?: boolean;
}

const MemberStatusRow: React.FC<MemberStatusRowProps> = ({ name, status, role, timestamp, isCurrentUser = false }) => {
    const { t } = useTranslation();
    const avatarId = role === 'senior' ? 'senior' :
        name.toLowerCase().includes('louise') ? 'louise' :
            (name.toLowerCase().includes('brad') || name.toLowerCase().includes('senior')) ? 'brad' : 'fatima';

    const statusIdMapping: Record<string, string> = {
        'home': 'home',
        'work': 'work',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon',
        'good': 'home',
        'default': 'home'
    };

    const statusIconId = statusIdMapping[status] || 'home';
    const config = role === 'senior'
        ? { label: t('peace_all_well'), color: 'text-green-600' }
        : { label: t(`status_${status}`), color: 'text-stone-500' };

    let timeString = '';
    if (timestamp) {
        const date = (timestamp && typeof timestamp.toDate === 'function')
            ? timestamp.toDate()
            : new Date(timestamp);

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.max(0, Math.floor(diffMs / 60000)); // Prevent negative values

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
            <div className="flex items-center gap-3">
                {/* Avatar with connection glow when available */}
                <div className={`relative ${status === 'available' ? 'animate-glow' : ''}`}>
                    <Avatar id={avatarId} size="md" className="shadow-sm border-2 border-white" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'available' ? 'bg-teal-500' :
                        status === 'home' ? 'bg-green-500' :
                            status === 'work' ? 'bg-indigo-500' :
                                status === 'traveling' ? 'bg-amber-500' : 'bg-stone-400'
                        }`} />
                </div>
                <div>
                    <span className={`text-sm font-bold block text-left ${isCurrentUser ? 'text-indigo-900' : 'text-stone-700'}`}>
                        {name} {isCurrentUser && <span className="opacity-50 text-xs font-normal">({t('you')})</span>}
                    </span>
                    <span className={`text-xs font-medium block text-left ${config.color || 'text-stone-500'}`}>
                        {config.label}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
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

export const FamilyPresence: React.FC<FamilyPresenceProps> = ({
    memberStatuses: propsMembers,
    currentUserId: propsUserId,
    seniorName: propsSeniorName,
    compact = false
}) => {
    const { t } = useTranslation();
    const context = useCareCircleContext() as any;
    const memberStatuses = propsMembers ?? context?.memberStatuses ?? [];
    const currentUserId = propsUserId ?? context?.currentUserId;
    const seniorName = propsSeniorName ?? context?.seniorName ?? 'Far/Mor';

    if (memberStatuses.length === 0) {
        return (
            <div className={`bg-stone-50 rounded-xl ${compact ? 'p-3' : 'p-4'} border border-stone-200`}>
                <p className="text-stone-400 text-sm text-center">{t('no_relatives')}</p>
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
                        {t('family_circle')}
                    </h4>
                </div>
            </div>
            <div className="space-y-1">
                {context.members.map((member: any) => {
                    // Normalize: find status by userId (memberStatus docId IS the userId)
                    const statusObj = memberStatuses.find((s: any) => s.docId === member.userId);
                    // Name source of truth: THE MEMBER RECORD
                    const displayName = member.displayName || (member.role === 'senior' ? seniorName : 'Pårørende');

                    return (
                        <MemberStatusRow
                            key={member.userId}
                            name={displayName}
                            status={statusObj?.status || 'home'}
                            role={member.role}
                            timestamp={statusObj?.updatedAt}
                            isCurrentUser={member.userId === currentUserId}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FamilyPresence;
