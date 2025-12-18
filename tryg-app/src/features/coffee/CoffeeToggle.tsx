import { Coffee } from 'lucide-react';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { usePings } from '../thinkingOfYou/usePings';
import { useTranslation } from 'react-i18next';

/**
 * Coffee availability toggle for seniors.
 * Broadcasts "coffee_ready" status to relatives and sends a ping notification.
 * Uses amber color palette intentionally to evoke coffee warmth.
 * @returns {JSX.Element} Coffee toggle button component
 */
export const CoffeeToggle = () => {
    const {
        careCircleId,
        currentUserId,
        userName,
        myStatus,
        setMyStatus,
        seniorStatus
    } = useCareCircleContext();
    const { t } = useTranslation();
    const { sendPing } = usePings(careCircleId, currentUserId);

    const isCoffeeTime = myStatus?.status === 'coffee_ready';
    const isCoffeeComing = myStatus?.status === 'coffee_coming' || seniorStatus?.status === 'coffee_coming';

    const toggleCoffee = async () => {
        if (isCoffeeTime) {
            // Turn it off (back to normal home)
            await setMyStatus('home');
        } else {
            // Turn it on
            await setMyStatus('coffee_ready');
            // Send a ping to relatives
            await sendPing(userName, currentUserId!, 'relative', 'coffee_invite', t('coffee_coming_msg', { name: userName }));
        }
    };

    return (
        <button
            onClick={toggleCoffee}
            className={`
                relative w-full p-6 rounded-3xl transition-all duration-500 border-2
                flex items-center justify-between overflow-hidden
                ${isCoffeeTime
                    ? 'bg-amber-100 border-amber-400 shadow-amber-200 shadow-lg scale-[1.02]'
                    : 'bg-stone-50 border-stone-200 grayscale-[0.5]'}
                ${isCoffeeComing ? 'ring-4 ring-green-400' : ''}
            `}
        >
            <div className="z-10 text-left">
                <h3 className={`text-xl font-bold ${isCoffeeTime ? 'text-amber-900' : 'text-stone-500'}`}>
                    {isCoffeeTime ? t('status_coffee_ready') : t('coffee_give_button')}
                </h3>
                <p className={`text-sm ${isCoffeeTime ? 'text-amber-800' : 'text-stone-400'}`}>
                    {isCoffeeTime
                        ? (isCoffeeComing ? t('coffee_coming_title') : t('coffee_ready_desc'))
                        : t('coffee_off_desc')}
                </p>
            </div>

            {/* The Icon */}
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                ${isCoffeeTime ? 'bg-amber-500 text-white animate-bounce-slow' : 'bg-stone-200 text-stone-400'}
            `}>
                <Coffee size={32} />
            </div>

            {/* Background Steam Effect (CSS Decoration) */}
            {isCoffeeTime && (
                <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
            )}
        </button>
    );
};

export default CoffeeToggle;
