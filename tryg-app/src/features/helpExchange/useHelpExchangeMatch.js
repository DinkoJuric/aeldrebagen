// @ts-check
import { useMemo } from 'react';
import { MATCH_PAIRS, STATUS_MATCHES } from './config';

/**
 * Hook to detect matches between offers, requests, and status
 * Returns array of active matches with celebration data
 */
export const useHelpExchangeMatch = ({
    offers = [],
    requests = [],
    familyStatus = null,
    memberStatuses = []
}) => {
    const matches = useMemo(() => {
        const activeMatches = [];

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

