import { useMemo } from 'react';
import { MATCH_PAIRS, STATUS_MATCHES, Celebration } from './config';
import { HelpOffer, HelpRequest } from './useHelpExchange';
import { MemberStatus } from '../familyPresence/useMemberStatus';

interface MatchProps {
    offers?: HelpOffer[];
    requests?: HelpRequest[];
    familyStatus?: string | null;
    memberStatuses?: MemberStatus[];
}

export interface ActiveMatch {
    type: 'offer-request' | 'status-request';
    offer?: HelpOffer;
    request?: HelpRequest;
    celebration: Celebration;
    isCrossFamily?: boolean;
    isStatusMatch?: boolean;
}

/**
 * Hook to detect matches between offers, requests, and status
 * Returns array of active matches with celebration data
 */
export const useHelpExchangeMatch = ({
    offers = [],
    requests = [],
    familyStatus = null,
    memberStatuses = []
}: MatchProps) => {
    const matches = useMemo(() => {
        const activeMatches: ActiveMatch[] = [];

        // Check offer-request pairs
        MATCH_PAIRS.forEach(pair => {
            const matchingOffer = offers.find(o => o.id === pair.offerId);
            const matchingRequest = requests.find(r => r.id === pair.requestId);

            if (matchingOffer && matchingRequest) {
                // Check if from different roles (true cross-family match!)
                const fromDifferentRoles = matchingOffer.createdByRole !== matchingRequest.createdByRole;

                activeMatches.push({
                    type: 'offer-request',
                    offer: matchingOffer,
                    request: matchingRequest,
                    celebration: pair.celebration,
                    isCrossFamily: fromDifferentRoles
                });
            }
        });

        // Check status-request pairs
        STATUS_MATCHES.forEach(pair => {
            // Check if any family member's status matches
            const hasMatchingStatus = memberStatuses.some(m => m.status === pair.statusId) ||
                familyStatus === pair.statusId;
            const matchingRequest = requests.find(r => r.id === pair.requestId);

            if (hasMatchingStatus && matchingRequest) {
                activeMatches.push({
                    type: 'status-request',
                    request: matchingRequest,
                    celebration: pair.celebration,
                    isStatusMatch: true
                });
            }
        });

        if (activeMatches.length > 0) {
            console.debug('🧩 [useHelpExchangeMatch] Matches detected:', activeMatches);
        }

        return activeMatches;
    }, [offers, requests, familyStatus, memberStatuses]);

    // Prioritize cross-family matches (real connections!)
    const prioritizedMatches = useMemo(() => {
        return [...matches].sort((a, b) => {
            // Cross-family matches first
            if (a.isCrossFamily && !b.isCrossFamily) return -1;
            if (!a.isCrossFamily && b.isCrossFamily) return 1;
            return 0;
        });
    }, [matches]);

    return {
        matches: prioritizedMatches,
        hasMatches: matches.length > 0,
        topMatch: prioritizedMatches[0] || null
    };
};

export default useHelpExchangeMatch;
