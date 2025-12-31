import { useState } from 'react';
import { resolvePath } from '../../utils/assetUtils';
import { useTranslation } from 'react-i18next';
import { WelcomeLayout } from './WelcomeLayout';
import { AudioProvider, useAudio } from './AudioContext';
import { useVideoAutoplay } from './useVideoAutoplay';


export const RelativeWelcome = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <AudioProvider>
            <RelativeWelcomeContent onComplete={onComplete} />
        </AudioProvider>
    );
};

const RelativeWelcomeContent = ({ onComplete }: { onComplete: () => void }) => {
    const { t } = useTranslation();
    const { isMuted } = useAudio();
    const [step, setStep] = useState(0);
    const totalSteps = 6;

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

    const { videoRef, handleToggleMute } = useVideoAutoplay(isMuted, step);

    const renderContent = () => {
        switch (step) {
            case 0: // Captain Point
                return (
                    <>
                        <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-sky-200/50 shadow-2xl border-4 border-white bg-sky-50 flex items-center justify-center">
                            <img src={resolvePath('onboarding/captain-point.png')} alt="Captain Point" className="w-[90%] h-[90%] object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-sky-900 mb-3">{t('onboarding_relative_0_title')}</h2>
                            <p className="text-lg text-sky-800/80 leading-relaxed">{t('onboarding_relative_0_body')}</p>
                        </div>
                    </>
                );
            case 1: // Family Connect
                return (
                    <>
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white flex items-center justify-center p-4">
                            <img src={resolvePath('onboarding/family-connect.png')} alt="Family Connection" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-sky-900 mb-3">{t('onboarding_relative_1_title')}</h2>
                            <p className="text-lg text-sky-800/80 leading-relaxed">{t('onboarding_relative_1_body')}</p>
                        </div>
                    </>
                );
            case 2: // HelpExchange (New)
                return (
                    <>
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white flex items-center justify-center p-4">
                            <img src={resolvePath('onboarding/help-exchange.png')} alt="Help Exchange" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-sky-900 mb-3">{t('onboarding_tutorial_helpexchange_title')}</h2>
                            <p className="text-lg text-sky-800/80 leading-relaxed">{t('onboarding_tutorial_helpexchange_body')}</p>
                        </div>
                    </>
                );
            case 3: // Match Celebration (New)
                return (
                    <>
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white flex items-center justify-center p-4">
                            <img src={resolvePath('onboarding/match-celebration.png')} alt="Match Celebration" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-sky-900 mb-3">{t('onboarding_tutorial_match_title')}</h2>
                            <p className="text-lg text-sky-800/80 leading-relaxed">{t('onboarding_tutorial_match_body')}</p>
                        </div>
                    </>
                );
            case 4: // The Ship (Relative Perspective)
                return (
                    <>
                        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-blue-50">
                            <video
                                ref={videoRef}
                                src={resolvePath('onboarding/video-ship.mp4')}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-sky-900 mb-3">{t('onboarding_relative_2_title')}</h2>
                            <p className="text-lg text-sky-800/80 leading-relaxed">{t('onboarding_relative_2_body')}</p>
                        </div>
                    </>
                );
            case 5: // Unity (Result)
                return (
                    <>
                        <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white">
                            <video
                                ref={videoRef}
                                src={resolvePath('onboarding/video-unity.mp4')}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-sky-900 mb-3">{t('onboarding_relative_3_title')}</h2>
                            <p className="text-lg text-sky-800/80 leading-relaxed">{t('onboarding_relative_3_body')}</p>
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
            theme="cool"
            onToggleMute={handleToggleMute}
        >
            {renderContent()}
        </WelcomeLayout>
    );
};
