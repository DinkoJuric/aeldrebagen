import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from './contexts/CareCircleContext';
import { LogOut, Settings, Users, X } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavigation } from './components/BottomNavigation';
import { PingNotification } from './features/thinkingOfYou';
import { ShareModal } from './components/ShareModal';
import { Onboarding, SeniorWelcome, RelativeWelcome } from './features/onboarding';
import { PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge, usePhotos } from './features/photos';
import './index.css';
import { User } from 'firebase/auth';

export interface AppCoreProps {
    user: User | null;
    onSignOut: () => Promise<void>;
}

export default function TrygAppCore({
    user,
    onSignOut,
}: AppCoreProps) {
    const { t, i18n } = useTranslation();
    const {
        currentUserId,
        userRole,
        userName,
        careCircleId,
        activeTab,
        setActiveTab,
        latestPing,
        dismissPing,
        members,
        seniorName,
        inviteCode,
        getInviteCode
    } = useCareCircleContext();

    // View is determined by user role - no toggle allowed
    const isSenior = userRole === 'senior';

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSecretScreen, setShowSecretScreen] = useState(false);

    const { latestPhoto, uploading, deletePhoto } = usePhotos(careCircleId, currentUserId);

    const handleStartOnboarding = () => {
        setShowSettings(false);
        setShowOnboarding(true);
    };

    // 🇧🇦 JUZU EXCEPTION: Force Bosnian (Requested by User)
    useEffect(() => {
        const nameToCheck = (userName || '').toLowerCase();
        if (nameToCheck.includes('juzu')) {
            if (i18n.language !== 'bs') {
                i18n.changeLanguage('bs');
            }
        }
    }, [userName, i18n]);

    // Force Onboarding logic
    useEffect(() => {
        const hasSeen = localStorage.getItem('tryg_welcome_seen_v2');
        if (!hasSeen) {
            setShowOnboarding(true);
        }
    }, []);

    // Secret Screen Listener
    useEffect(() => {
        const handleSecret = () => setShowSecretScreen(true);
        window.addEventListener('trigger-secret-unicorn', handleSecret);
        return () => window.removeEventListener('trigger-secret-unicorn', handleSecret);
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('tryg_welcome_seen_v2', 'true');
        setShowOnboarding(false);
        setShowSecretScreen(false);
    };

    return (
        <>
            {/* Header - COMPACT - Moved to Relative to push content down */}
            <div className="relative h-10 z-50 flex justify-between items-center px-3 glass-panel border-b-0 rounded-none bg-transparent shadow-none shrink-0">
                <button
                    onClick={() => setShowShare(true)}
                    className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    aria-label="Care Circle"
                >
                    <Users className="w-5 h-5 theme-text" />
                </button>

                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    aria-label={t('settings')}
                >
                    <Settings className="w-5 h-5 theme-text" />
                </button>

                <button
                    onClick={onSignOut}
                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    aria-label={t('sign_out')}
                >
                    <LogOut className="w-4 h-4 theme-text" />
                </button>
            </div>

            {/* Care Circle & Family Share Modal */}
            {showShare && (
                <ShareModal
                    members={members}
                    inviteCode={inviteCode}
                    onGetInviteCode={getInviteCode}
                    seniorName={seniorName}
                    currentUserId={currentUserId ?? undefined}
                    onClose={() => setShowShare(false)}
                />
            )}

            {/* Unified Settings Modal */}
            {showSettings && (
                <SettingsModal
                    user={user}
                    careCircle={{ id: careCircleId }}
                    onClose={() => setShowSettings(false)}
                    onSignOut={onSignOut}
                    onStartOnboarding={handleStartOnboarding}
                />
            )}

            {/* SECRET SCREEN OVERLAY */}
            {showSecretScreen && (
                <div className="absolute inset-0 z-[100] bg-zinc-900">
                    <button
                        onClick={() => setShowSecretScreen(false)}
                        className="absolute top-6 right-6 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    {isSenior ? (
                        <SeniorWelcome onComplete={() => setShowSecretScreen(false)} />
                    ) : (
                        <RelativeWelcome onComplete={() => setShowSecretScreen(false)} />
                    )}
                </div>
            )}

            {/* Ping Notification from Firestore */}
            {latestPing && (
                <PingNotification
                    ping={latestPing}
                    onDismiss={dismissPing}
                />
            )}

            {showOnboarding ? (
                <Onboarding show={showOnboarding} onComplete={handleOnboardingComplete} />
            ) : (
                isSenior ? (
                    <SeniorView />
                ) : (
                    <RelativeView />
                )
            )}

            {/* Photo notification badge */}
            {latestPhoto && !showOnboarding && (
                <div className="absolute bottom-24 left-4 right-4 z-40 flex justify-center">
                    <PhotoNotificationBadge
                        photo={latestPhoto}
                        onClick={() => setShowPhotoViewer(true)}
                    />
                </div>
            )}

            {/* Global Bottom Navigation (Shrink-0) */}
            <div className="shrink-0">
                <BottomNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Photo upload modal */}
            <PhotoUploadModal isOpen={uploading} />

            {/* Photo viewer modal */}
            {showPhotoViewer && latestPhoto && (
                <PhotoViewerModal
                    isOpen={showPhotoViewer}
                    onClose={() => setShowPhotoViewer(false)}
                    photo={latestPhoto}
                    onDelete={async (id, path) => {
                        await deletePhoto(id, path);
                        setShowPhotoViewer(false);
                    }}
                />
            )}
        </>
    );
}
