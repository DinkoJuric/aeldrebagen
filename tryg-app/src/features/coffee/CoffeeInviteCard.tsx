import { Coffee } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { usePings } from '../thinkingOfYou/usePings';
import { useTranslation } from 'react-i18next';

export const CoffeeInviteCard = () => {
    const {
        careCircleId,
        currentUserId,
        userName,
        seniorStatus,
        setMyStatus,
        seniorName
    } = useCareCircleContext();
    const { t } = useTranslation();
    const { sendPing } = usePings(careCircleId, currentUserId);

    if (seniorStatus?.status !== 'coffee_ready') return null;

    const handleAcceptInvite = async () => {
        // Update relative's status to notify the circle they are coming
        await setMyStatus('traveling');
        // Send a response ping to the senior
        await sendPing('senior', 'coffee_coming', t('coffee_coming_msg', { name: userName }));
    };

    return (
        <div className="glass-panel-warm rounded-2xl p-4 flex items-center gap-4 mb-4 relative overflow-hidden">
            <div className="bg-amber-100/80 p-3 rounded-full shrink-0 relative z-10">
                <Coffee className="w-8 h-8 text-amber-600 animate-wiggle" />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
                <h3 className="font-bold text-lg text-amber-950 leading-tight">{t('coffee_invite_title', { name: seniorName })}</h3>
                <p className="text-amber-800/70 text-sm truncate">{t('coffee_invite_sub')}</p>
            </div>
            <Button
                size="small"
                variant="primary"
                onClick={handleAcceptInvite}
                className="shrink-0 relative z-10 bg-teal-500 hover:bg-teal-600 text-white border-none shadow-[0_0_20px_rgba(20,184,166,0.5)]"
            >
                {t('coffee_invite_accept')}
            </Button>
        </div>
    );
};

export default CoffeeInviteCard;
