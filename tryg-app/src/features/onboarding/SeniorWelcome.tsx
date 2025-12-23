import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WelcomeLayout } from './WelcomeLayout';
import { motion } from 'framer-motion';
import { resolvePath } from '../../utils/assetUtils';
import { AudioProvider, useAudio } from './AudioContext';


export const SeniorWelcome = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <AudioProvider>
            <SeniorWelcomeContent onComplete={onComplete} />
        </AudioProvider>
    );
};

const SeniorWelcomeContent = ({ onComplete }: { onComplete: () => void }) => {
    const { t } = useTranslation();
    const { isMuted } = useAudio();
    const [step, setStep] = useState(0);
    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const videoRef = useRef<HTMLVideoElement>(null);

    // Effect 1: Handle Lifecycle & Autoplay (Run only when step changes)
    useEffect(() => {
        if (videoRef.current) {
            // iOS Critical: Always reset to muted before attempting autoplay
            // This ensures the "clean slate" the OS expects
            videoRef.current.muted = isMuted;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Critical fallback: Ensure it's muted and try again if it wasn't
                    if (!videoRef.current!.muted) {
                        videoRef.current!.muted = true;
                        videoRef.current!.play().catch(e => console.error("Retry failed", e));
                    }
                });
            }
        }
    }, [step]); // Intentionally removed isMuted dependency

    // Effect 2: Handle Audio Toggle (User Interaction)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const renderContent = () => {
        switch (step) {
            case 0: // Porch Light
                return (
                    <>
                        <motion.div className="relative w-64 h-64 rounded-full overflow-hidden shadow-orange-200/50 shadow-2xl border-4 border-white mb-6">
                            <img src={resolvePath('onboarding/porch-light.png')} alt="Porch Light" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
                        </motion.div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-3">{t('onboarding_senior_0_title')}</h2>
                            <p className="text-lg text-amber-800/80 leading-relaxed max-w-[280px] mx-auto">{t('onboarding_senior_0_body')}</p>
                        </div>
                    </>
                );
            case 1: // Captain Wave
                return (
                    <>
                        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white mb-6">
                            <video
                                ref={videoRef}
                                src={resolvePath('onboarding/video-wave.mp4')}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-3">{t('onboarding_senior_1_title')}</h2>
                            <p className="text-lg text-amber-800/80 leading-relaxed">{t('onboarding_senior_1_body')}</p>
                        </div>
                    </>
                );
            case 2: // The Ship
                return (
                    <>
                        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-blue-50 mb-6">
                            <video
                                ref={videoRef}
                                src={resolvePath('onboarding/video-ship.mp4')}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-3">{t('onboarding_senior_2_title')}</h2>
                            <p className="text-lg text-amber-800/80 leading-relaxed">{t('onboarding_senior_2_body')}</p>
                        </div>
                    </>
                );
            case 3: // Unity
                return (
                    <>
                        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-blue-50 mb-6 aspect-ratio:auto relative">
                            <video
                                ref={videoRef}
                                src={resolvePath('onboarding/video-unity.mp4')}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-auto h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-3">{t('onboarding_senior_3_title')}</h2>
                            <p className="text-lg text-amber-800/80 leading-relaxed">{t('onboarding_senior_3_body')}</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <WelcomeLayout
            step={step}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
            theme="warm"
        >
            {renderContent()}
        </WelcomeLayout>
    );
};
