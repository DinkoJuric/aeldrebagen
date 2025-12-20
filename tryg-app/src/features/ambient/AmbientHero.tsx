import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Heart, Clock, Activity, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

export interface AmbientHeroProps {
    role: 'senior' | 'relative';
    onCheckIn?: () => void;
    onOpenSymptomModal?: () => void;
}

/**
 * AmbientHero - The emotional centerpiece of the AmbientTab.
 * - Senior Mode: Interactive check-in buttons ("I'm okay" / "I have pain")
 * - Relative Mode: Ambient status visualization (rings, pulse, gradient)
 *   → Bursts with celebratory animation when Senior checks in!
 */
export const AmbientHero: React.FC<AmbientHeroProps> = ({
    role,
    onCheckIn,
    onOpenSymptomModal
}) => {
    const { t } = useTranslation();
    const {
        seniorName,
        tasks = [],
        symptoms = [],
        lastCheckIn
    } = useCareCircleContext();

    // ========== BURST ANIMATION STATE (Relative Mode) ==========
    const [isBursting, setIsBursting] = useState(false);
    const prevCheckInRef = useRef<string | null>(null);

    // Detect check-in changes and trigger burst animation
    useEffect(() => {
        if (role !== 'relative') return;

        // If lastCheckIn changed to a new value
        if (lastCheckIn && lastCheckIn !== prevCheckInRef.current) {
            // Trigger celebratory burst!
            setIsBursting(true);

            // Reset after 3 seconds
            const timer = setTimeout(() => setIsBursting(false), 3000);

            prevCheckInRef.current = lastCheckIn;
            return () => clearTimeout(timer);
        }
    }, [lastCheckIn, role]);

    // Calculate today's symptom count
    const todaySymptomCount = symptoms.filter(s => {
        const date = (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any);
        return date.toDateString() === new Date().toDateString();
    }).length;

    // Calculate completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    // Derived status for Relative mode
    const status = React.useMemo(() => {
        if (todaySymptomCount > 0) return 'symptom';
        if (completionRate < 50 && totalTasks > 0) return 'warning';
        if (completionRate >= 80) return 'calm';
        return 'neutral';
    }, [todaySymptomCount, completionRate, totalTasks]);

    // Theme mapping
    const theme = React.useMemo(() => {
        switch (status) {
            case 'symptom':
                return {
                    gradient: 'from-rose-400 to-orange-500',
                    blob: 'fill-rose-200/40',
                    pulseScale: [1, 1.15, 1],
                    label: t('dashboard_symptoms'),
                    icon: AlertCircle,
                    shadow: 'shadow-rose-200/50'
                };
            case 'warning':
                return {
                    gradient: 'from-amber-400 to-orange-400',
                    blob: 'fill-amber-200/40',
                    pulseScale: [1, 1.05, 1],
                    label: t('dashboard_tasks_missing'),
                    icon: Clock,
                    shadow: 'shadow-amber-100/50'
                };
            case 'calm':
                return {
                    gradient: 'from-teal-400 to-emerald-500',
                    blob: 'fill-teal-100/40',
                    pulseScale: [1, 1.02, 1],
                    label: t('peace_all_well'),
                    icon: CheckCircle,
                    shadow: 'shadow-teal-100/50'
                };
            default:
                return {
                    gradient: 'from-stone-400 to-stone-500',
                    blob: 'fill-stone-200/40',
                    pulseScale: [1, 1, 1],
                    label: t('peace_good_day'),
                    icon: Activity,
                    shadow: 'shadow-stone-100/50'
                };
        }
    }, [status, t]);

    // ========== SENIOR MODE ==========
    if (role === 'senior') {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-teal-100 mb-8">
                <h2 className="text-xl font-semibold theme-text mb-4">{t('pain_question')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="primary"
                        size="large"
                        className="w-full min-h-32 py-4"
                        onClick={onCheckIn}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <CheckCircle className="w-10 h-10 shrink-0" />
                            <span className="text-sm leading-tight">{t('i_feel_good')}</span>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        size="large"
                        className="w-full min-h-32 py-4 bg-orange-50 text-orange-800 border-2 border-orange-100 hover:bg-orange-100"
                        onClick={onOpenSymptomModal}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Heart className="w-10 h-10 text-orange-500 shrink-0" />
                            <span className="text-sm leading-tight">{t('i_feel_pain')}</span>
                        </div>
                    </Button>
                </div>
            </div>
        );
    }

    // ========== RELATIVE MODE ==========
    return (
        <motion.div
            layout
            className={`
                relative overflow-hidden rounded-[2rem] p-8 shadow-2xl border border-white/30
                bg-gradient-to-br ${theme.gradient}
                ${theme.shadow}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden blur-3xl opacity-60">
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute -top-1/4 -left-1/4 w-full h-full"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <path
                        className={theme.blob}
                        d="M33,-47.1C43.3,-40.3,52.5,-30.9,57.1,-19.5C61.7,-8,61.7,5.5,57.9,18C54,30.5,46.3,42,35.3,49.8C24.3,57.6,10.1,61.7,-3.4,66.4C-16.9,71.1,-29.7,76.4,-40.7,71.7C-51.7,67,-61,52.3,-66.2,37.3C-71.4,22.3,-72.6,7,-67.7,-5.7C-62.8,-18.3,-51.8,-28.3,-40.3,-35.1C-28.8,-41.8,-16.8,-45.3,-4.2,-39.5C8.3,-33.7,19.9,-18.6,33,-47.1Z"
                        transform="translate(50 50)"
                    />
                </motion.svg>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center text-center">

                {/* Senior Presence Heartbeat - Bursts when check-in detected! */}
                <div className="relative mb-6">
                    <motion.div
                        className="absolute inset-0 bg-white/40 rounded-full blur-xl"
                        animate={{
                            scale: isBursting ? [1, 1.5, 1, 1.3, 1] : theme.pulseScale,
                            opacity: isBursting ? [0.5, 1, 0.5, 0.8, 0.3] : [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: isBursting ? 0.6 : (status === 'calm' ? 4 : status === 'warning' ? 2 : 1.5),
                            repeat: isBursting ? 5 : Infinity,
                            ease: isBursting ? "easeOut" : "easeInOut"
                        }}
                    />
                    <motion.div
                        className="p-1.5 bg-white/20 rounded-full backdrop-blur-xl border border-white/40"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Avatar id="senior" size="xl" className="border-4 border-white shadow-xl" />
                    </motion.div>
                </div>

                {/* Status Messaging */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-2"
                    >
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {theme.label}
                        </h2>
                        <p className="text-white/80 font-medium text-lg drop-shadow-sm px-4">
                            {status === 'calm'
                                ? t('peace_sub_all_well', { name: seniorName })
                                : status === 'symptom'
                                    ? t('dashboard_symptoms_sub', { count: todaySymptomCount })
                                    : t('dashboard_tasks_missing_sub')}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Secondary Info Pills */}
                <div className="mt-8 flex gap-3">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Clock className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                        {typeof lastCheckIn === 'string' ? lastCheckIn : '-'}
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Activity className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                        {completionRate}% {t('taken')}
                    </div>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </motion.div>
    );
};

export default AmbientHero;
