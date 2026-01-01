import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { CoffeeToggle } from '../../features/coffee';
import { ThinkingOfYouButton } from '../../features/thinkingOfYou';
import { FamilyPresence, StatusList } from '../../features/familyPresence';
import { MemoryTrigger } from '../../features/weeklyQuestion';
import { HelpExchange } from '../../features/helpExchange';
import { FEATURES } from '../../config/features';
import { useHelpExchange } from '../../features/helpExchange';
import { HelpOffer, HelpRequest } from '../../types';

export const FamilyTab: React.FC = () => {

    const {
        userName,
        careCircleId,
        currentUserId,
        memberStatuses,
        members,
        relativeStatuses,

        sendPing
    } = useCareCircleContext();

    // Fetch HelpExchange data directly in the tab
    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'senior', userName);

    // Filter offers/requests by role
    const helpOffers = allOffersFetched.filter((o: HelpOffer) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: HelpRequest) => r.createdByRole === 'senior');
    const relativeOffers = allOffersFetched.filter((o: HelpOffer) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: HelpRequest) => r.createdByRole === 'relative');

    return (
        <div className="tab-content animate-fade-in space-y-4">
            {/* Spontan Kaffe Signal */}
            <CoffeeToggle />

            {/* Thinking of You */}
            {FEATURES.thinkingOfYou && (
                <ThinkingOfYouButton
                    onSendPing={() => sendPing('relative')}
                    fromName={userName}
                />
            )}

            {/* Family Presence */}
            {memberStatuses.length > 0 && (
                <FamilyPresence
                    memberStatuses={memberStatuses}
                    currentUserId={currentUserId || ''}
                    seniorName={userName}
                />
            )}

            {/* Legacy Family Status List */}
            {FEATURES.familyStatusCard && memberStatuses.length === 0 && (
                <StatusList
                    members={members as any}
                    relativeStatuses={relativeStatuses}
                    lastUpdated={null} // statusLastUpdated was passed before, but it was just 'null' in AppCore call mostly
                />
            )}

            {/* Memory Trigger */}
            {FEATURES.memoryTriggers && <MemoryTrigger />}

            {/* Help Exchange */}
            {FEATURES.helpExchange && (
                <HelpExchange
                    onOffer={addOffer}
                    onRequest={addRequest}
                    onRemoveOffer={removeOffer}
                    onRemoveRequest={removeRequest}
                    activeOffers={helpOffers}
                    activeRequests={helpRequests}
                    relativeOffers={relativeOffers}
                    relativeRequests={relativeRequests}
                    seniorName={userName}
                />
            )}
        </div>
    );
};
