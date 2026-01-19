import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CareCircleProvider } from './contexts/CareCircleContext';
import { LogOut, Settings, Users, X } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavigation } from './components/BottomNavigation';
import { PingNotification } from './features/thinkingOfYou';
import { ShareModal } from './components/ShareModal';
import { Onboarding, SeniorWelcome, RelativeWelcome } from './features/onboarding';
import { PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge, usePhotos } from './features/photos';
import { LivingBackground } from './components/ui/LivingBackground';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateToast } from './components/UpdateToast';
import { useTasks } from './features/tasks/useTasks';
import { useSymptoms } from './features/symptoms/useSymptoms';
import { useMemberStatus } from './features/familyPresence/useMemberStatus';
import { useWeeklyQuestions } from './features/weeklyQuestion/useWeeklyQuestions';
import { usePings } from './features/thinkingOfYou/usePings';
import { useCheckIn } from './hooks/useCheckIn';
import { FEATURES } from './config/features';
import { playPingSound, playCompletionSound, playSuccessSound } from './utils/sounds';
import './index.css';
import { User } from 'firebase/auth';
import { AppTab, UserProfile, Member, Task, SymptomLog, CareCircle, WeeklyAnswer } from './types';

interface NotificationType {
    title: string;
    body: string;
    icon: React.ElementType;
}


export interface AppCoreProps {
    user: User | null;
    userProfile: UserProfile | null;
    careCircle: CareCircle | null; // CareCircle but mapped from hook which might differ slightly
    onSignOut: () => Promise<void>;
    inviteCode: string | null;
    onGetInviteCode: () => Promise<void>;
    members?: Member[];
    updateMember: (data: Partial<Member>) => Promise<void>;
    updateAnyMember: (memberId: string, data: Partial<Member>) => Promise<void>;
}

export default function TrygAppCore({
    user,
    userProfile,
    careCircle,
    onSignOut,
    inviteCode,
    onGetInviteCode,
    members = [],
    updateMember,
    updateAnyMember,
}: AppCoreProps) {
    const { t, i18n } = useTranslation();
    // View is determined by user role - no toggle allowed
    const isSenior = userProfile?.role === 'senior';
    // const [activePing, setActivePing] = useState(null); // Unused?
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [activeTab, setActiveTab] = useState<AppTab>('daily');
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSecretScreen, setShowSecretScreen] = useState(false);

    const handleStartOnboarding = () => {
        setShowSettings(false);
        setShowOnboarding(true);
    };

    // 🇧🇦 JUZU EXCEPTION: Force Bosnian (Requested by User)
    useEffect(() => {
        const nameToCheck = (userProfile?.displayName || user?.displayName || '').toLowerCase();
        if (nameToCheck.includes('juzu')) {
            if (i18n.language !== 'bs') {
                i18n.changeLanguage('bs');
            }
        }
    }, [userProfile, user, i18n]);

    // Force Onboarding logic
    useEffect(() => {
        const hasSeen = localStorage.getItem('tryg_welcome_seen_v2');
        if (!hasSeen) {
            setTimeout(() => setShowOnboarding(true), 0);
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

    // Firebase hooks for real-time data
    const { tasks, toggleTask, addTask } = useTasks(careCircle?.id ?? null);
    const { symptoms, addSymptom } = useSymptoms(careCircle?.id ?? null);
    // Per-member status tracking
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(
        careCircle?.id ?? null,
        user?.uid ?? null,
        userProfile?.displayName ?? null,
        (userProfile?.role as 'senior' | 'relative') ?? 'relative'
    );
    const {
        answers: weeklyAnswers,
        addAnswer: addWeeklyAnswer,
        toggleLike: onToggleLike,
        addReply: onReply
    } = useWeeklyQuestions(careCircle?.id ?? null);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id ?? null, user?.uid ?? null);
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id ?? undefined);
    const { latestPhoto, uploading, deletePhoto } = usePhotos(careCircle?.id ?? null, user?.uid ?? null);

    // Live update: prefer real-time member data over static user profile
    const currentMember = members.find(m => m.userId === user?.uid);
    const seniorMember = members.find(m => m.role === 'senior');

    const effectiveDisplayName = currentMember?.displayName || userProfile?.displayName;

    // Get display names - Source of Truth is ALWAYS the membership record
    const seniorName = seniorMember?.displayName || careCircle?.seniorName || (userProfile?.role === 'senior' ? effectiveDisplayName : 'Senior') || 'Senior';

    // Relative name logic
    const relativeName = (userProfile?.role === 'relative'
        ? effectiveDisplayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende') || 'Pårørende';

    // 🚀 TURBO: Use ref to track tasks for stable handler functions
    const tasksRef = useRef<Task[]>([]);
    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    // Incoming pings logic
    useEffect(() => {
        if (latestPing && FEATURES.pingSound) {
            playPingSound();
        }
    }, [latestPing]);

    // Notification clear logic
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleToggleTask = useCallback(async (id: string) => {
        // Use ref to avoid dependency on 'tasks'
        const task = tasksRef.current.find(t => t.id === id || t.id === `task_${id}`);
        const willBeCompleted = task && !task.completed;
        await toggleTask(id);
        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    }, [toggleTask]);

    const handleCheckIn = useCallback(async () => {
        await recordCheckIn();
        if (FEATURES.completionSounds) {
            playSuccessSound();
        }
    }, [recordCheckIn]);

    const handleAddSymptom = useCallback(async (symptomData: Partial<SymptomLog>) => {
        return await addSymptom(symptomData);
    }, [addSymptom]);

    const handleAddTaskFromRelative = useCallback(async (newTask: Partial<Task>) => {
        return await addTask({
            ...newTask,
            createdByRole: 'relative',
            createdByName: relativeName || userProfile?.displayName || 'Familie',
            createdByUserId: user?.uid
        });
    }, [addTask, relativeName, userProfile, user]);

    const handleSendPing = useCallback(async (toRole: 'senior' | 'relative') => {
        return await sendPing(toRole);
    }, [sendPing]);

    const handleWeeklyAnswer = useCallback(async (answer: string | Partial<WeeklyAnswer>) => {
        const baseAnswer = typeof answer === 'string' ? { text: answer } : answer;
        return await addWeeklyAnswer({
            ...baseAnswer,
            userId: user?.uid,
            userName: isSenior ? seniorName : (relativeName || 'Pårørende')
        });
    }, [addWeeklyAnswer, isSenior, seniorName, relativeName, user]);

    // 🚀 TURBO: Memoize the context value to prevent unnecessary re-renders of consumers.
    // This is a critical performance optimization for context-heavy applications.
    const contextValue = useMemo(() => ({
        careCircleId: careCircle?.id ?? null,
        seniorId: careCircle?.seniorId ?? null,
        seniorName: seniorName,
        currentUserId: user?.uid ?? null,
        userRole: (userProfile?.role as 'senior' | 'relative') ?? null,
        userName: isSenior ? seniorName : relativeName,
        relativeName: relativeName,
        memberStatuses,
        members,
        relativeStatuses,
        seniorStatus: seniorStatus || null,
        myStatus: myStatus,
        setMyStatus: setMyStatus,
        activeTab: activeTab as AppTab,
        setActiveTab: setActiveTab,
        tasks,
        toggleTask: handleToggleTask,
        addTask: isSenior ? addTask : handleAddTaskFromRelative,
        symptoms,
        addSymptom: handleAddSymptom,
        weeklyAnswers,
        addWeeklyAnswer: handleWeeklyAnswer,
        toggleLike: (answerId: string, userId: string, isLiked: boolean) => onToggleLike(answerId, userId, isLiked),
        addReply: onReply,
        latestPing,
        sendPing: handleSendPing,
        dismissPing: dismissPing,
        lastCheckIn,
        recordCheckIn: handleCheckIn,
        updateMember: updateMember,
        updateAnyMember: updateAnyMember
    }), [
        careCircle, seniorName, user, userProfile, isSenior, relativeName, memberStatuses, members,
        relativeStatuses, seniorStatus, myStatus, setMyStatus, activeTab, tasks, handleToggleTask,
        addTask, handleAddTaskFromRelative, symptoms, handleAddSymptom, weeklyAnswers,
        handleWeeklyAnswer, onToggleLike, onReply, latestPing, handleSendPing, dismissPing,
        lastCheckIn, handleCheckIn, updateMember, updateAnyMember
    ]);

    return (
        <CareCircleProvider value={contextValue}>
            <div className="flex justify-center items-center min-h-screen bg-stone-50 dark:bg-zinc-950 sm:bg-zinc-800 sm:p-4">

                {/* Phone Frame Simulator (Responsive) */}
                {/* Mobile: Full screen, no border. Desktop: Phone frame with border. */}
                <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[3rem] overflow-hidden sm:border-8 sm:border-zinc-900 shadow-2xl sm:ring-1 sm:ring-zinc-400/50 flex flex-col">

                    {/* Push Notification Banner */}
                    <div className={`
          absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-[60]
          transform transition-all duration-500 ease-out border border-stone-200
          ${notification ? 'translate-y-12 opacity-100' : '-translate-y-40 opacity-0'}
        `}>
                        {notification && (
                            <div className="flex gap-3 items-center">
                                <div className="bg-teal-100 p-2 rounded-xl">
                                    <notification.icon className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold theme-text text-sm">{notification.title}</h4>
                                    <p className="theme-text-muted text-xs opacity-80">{notification.body}</p>
                                </div>
                            </div>
                        )}
                    </div>

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
                            onGetInviteCode={onGetInviteCode}
                            seniorName={seniorName ?? 'Senior'}
                            currentUserId={user?.uid ?? undefined}
                            onClose={() => setShowShare(false)}
                        />
                    )}

                    {/* Unified Settings Modal */}
                    {showSettings && (
                        <SettingsModal
                            user={user}
                            careCircle={careCircle}
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

                    <div className="flex-1 min-h-0 relative z-10">
                        {/* LivingBackground for circadian atmosphere (Living Design 🏠) */}
                        {FEATURES.livingDesign ? (
                            <LivingBackground>
                                <div className="h-full overflow-hidden">
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
                                </div>
                            </LivingBackground>
                        ) : (
                            /* Fallback: Static gradient when Living Design is disabled */
                            <div className="h-full bg-gradient-to-b from-sky-100 via-sky-50 to-stone-100 overflow-hidden">
                                <div className="h-full">
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
                                    {latestPhoto && !showOnboarding && (
                                        <div className="absolute bottom-24 left-4 right-4 z-40 flex justify-center">
                                            <PhotoNotificationBadge
                                                photo={latestPhoto}
                                                onClick={() => setShowPhotoViewer(true)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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

                    {/* iOS PWA Install Prompt */}
                    <InstallPrompt />

                    {/* PWA Update Toast */}
                    <UpdateToast />



                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
                </div>
            </div>
        </CareCircleProvider>
    );
}
