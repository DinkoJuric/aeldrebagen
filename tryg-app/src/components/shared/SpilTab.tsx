import React from 'react';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Spillehjoernet } from '../../features/wordGame';
import { FEATURES } from '../../config/features';

export const SpilTab: React.FC = () => {
    const { careCircleId, currentUserId, userName, userRole } = useCareCircleContext();

    if (!FEATURES.spillehjoernet) return null;

    return (
        <div className="tab-content animate-fade-in">
            <Spillehjoernet
                circleId={careCircleId || ''}
                userId={currentUserId || ''}
                displayName={userName || (userRole === 'senior' ? 'Senior' : 'Pårørende')}
            />
        </div>
    );
};
