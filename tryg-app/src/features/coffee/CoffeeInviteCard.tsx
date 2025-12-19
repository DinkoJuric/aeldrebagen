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
        <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-1 shadow-xl animate-slide-in mb-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                    <Coffee className="w-8 h-8 text-amber-600 animate-wiggle" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-amber-950">{t('coffee_invite_title', { name: seniorName })}</h3>
                    <p className="text-amber-800/80 text-sm">{t('coffee_invite_sub')}</p>
                </div>
                <Button size="small" variant="primary" onClick={handleAcceptInvite}>
                    {t('coffee_invite_accept')}
                </Button>
            </div>
        </div>
    );
};

export default CoffeeInviteCard;
