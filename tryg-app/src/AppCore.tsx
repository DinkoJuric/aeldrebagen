import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CareCircleProvider } from './contexts/CareCircleContext';
import { LogOut, Settings, Users } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavigation } from './components/BottomNavigation';
import { PingNotification } from './features/thinkingOfYou';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateToast } from './components/UpdateToast';
import { PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge } from './features/photos';
import { ShareModal } from './components/ShareModal';
import { useTasks } from './features/tasks';
import { useSymptoms } from './features/symptoms';
// import { useSettings } from './hooks/useSettings';
import { useWeeklyQuestions } from './features/weeklyQuestion';
import { usePings } from './features/thinkingOfYou';
import { useCheckIn } from './hooks/useCheckIn';
import { usePhotos } from './features/photos';
import { useMemberStatus } from './features/familyPresence';
import { playCompletionSound, playSuccessSound, playPingSound } from './utils/sounds';
import { FEATURES } from './config/features';
import { LivingBackground } from './components/ui/LivingBackground';
import './index.css';
import { User } from 'firebase/auth'; // Or your custom user type
import { AppTab, UserProfile, Member, Task, SymptomLog } from './types';


export interface AppCoreProps {
    user: User | null;
    userProfile: UserProfile | null;
    careCircle: any; // CareCircle but mapped from hook which might differ slightly
    onSignOut: () => Promise<void>;
    inviteCode: string | null;
    onGetInviteCode: () => Promise<void>;
    members?: Member[];
}

export default function TrygAppCore({
    user,
    userProfile,
    careCircle,
    onSignOut,
    inviteCode,
    onGetInviteCode,
    members = []
}: AppCoreProps) {
    const { t } = useTranslation();
    // View is determined by user role - no toggle allowed
    const isSenior = userProfile?.role === 'senior';
    // const [activePing, setActivePing] = useState(null); // Unused?
    const [notification, setNotification] = useState<any | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [activeTab, setActiveTab] = useState<AppTab>('daily');
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    // Firebase hooks for real-time data
    const { tasks, toggleTask, addTask } = useTasks(careCircle?.id);
    const { symptoms, addSymptom } = useSymptoms(careCircle?.id);
    // Per-member status tracking
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(careCircle?.id, user?.uid ?? null, (userProfile?.displayName ?? undefined) as string | null, userProfile?.role ?? 'relative');
    const {
        answers: weeklyAnswers,
        addAnswer: addWeeklyAnswer,
        toggleLike: onToggleLike,
        addReply: onReply
    } = useWeeklyQuestions(careCircle?.id);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid ?? null);
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);
    const { latestPhoto, uploading, deletePhoto } = usePhotos(careCircle?.id, user?.uid ?? null);

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

    const handleToggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id || t.id === `task_${id}`);
        const willBeCompleted = task && !task.completed;
        await toggleTask(id);
        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async () => {
        await recordCheckIn();
        if (FEATURES.completionSounds) {
            playSuccessSound();
        }
    };

    const handleAddSymptom = async (symptomData: Partial<SymptomLog>) => {
        return await addSymptom(symptomData);
    };

    const handleAddTaskFromRelative = async (newTask: Partial<Task>) => {
        return await addTask({
            ...newTask,
            createdByRole: 'relative',
            createdByName: relativeName || userProfile?.displayName || 'Familie',
            createdByUserId: user?.uid
        });
    };

    const handleSendPing = async (toRole: 'senior' | 'relative') => {
        const fromName = isSenior ? seniorName : relativeName;
        return await sendPing(fromName, (user?.uid ?? undefined) as string, toRole);
    };

    const handleWeeklyAnswer = async (answer: string) => {
        return await addWeeklyAnswer({
            text: answer,
            userId: user?.uid,
            userName: isSenior ? seniorName : (relativeName || 'Pårørende')
        });
    };

    // Get display names
    const seniorName = careCircle?.seniorName || (userProfile?.role === 'senior' ? userProfile?.displayName : 'Senior');
    const relativeName = userProfile?.role === 'relative'
        ? userProfile?.displayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

    return (
        <CareCircleProvider value={{
            careCircleId: careCircle?.id ?? null,
            seniorId: careCircle?.seniorId || null,
            seniorName: seniorName,
            currentUserId: user?.uid ?? null,
            userRole: userProfile?.role ?? null,
            userName: isSenior ? seniorName : relativeName,
            relativeName: relativeName,
            memberStatuses,
            members,
            relativeStatuses,
            seniorStatus: seniorStatus || null,
            myStatus: myStatus as any,
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
            recordCheckIn: handleCheckIn
        }}>
            <div className="flex justify-center items-center min-h-screen bg-stone-50 sm:bg-zinc-800 sm:p-4 font-sans">

                {/* Phone Frame Simulator (Responsive) */}
                {/* Mobile: Full screen, no border. Desktop: Phone frame with border. */}
                <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[3rem] overflow-hidden sm:border-8 sm:border-zinc-900 shadow-2xl sm:ring-1 sm:ring-zinc-400/50">

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
                                    <h4 className="font-bold text-stone-800 text-sm">{notification.title}</h4>
                                    <p className="text-stone-500 text-xs">{notification.body}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Header - COMPACT: Care Circle / Settings / Logout - now theme-aware */}
                    <div className="absolute top-0 left-0 right-0 h-10 z-50 flex justify-between items-center backdrop-blur-sm px-3 bg-black/5 theme-dark:bg-white/5">
                        {/* Care Circle button - Top Left */}
                        <button
                            onClick={() => setShowShare(true)}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Care Circle"
                        >
                            <Users className="w-5 h-5 theme-text" />
                        </button>

                        {/* Center: Settings gear (Unified Settings) */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            aria-label={t('settings')}
                        >
                            <Settings className="w-5 h-5 theme-text" />
                        </button>

                        {/* Sign out - Top Right */}
                        <button
                            onClick={onSignOut}
                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                            aria-label={t('sign_out')}
                        >
                            <LogOut className="w-4 h-4 theme-text" />
                        </button>
                    </div>

                    {/* Care Circle & Family Share Modal */}
                    {showShare && (
                        <ShareModal
                            members={memberStatuses}
                            inviteCode={inviteCode}
                            onGetInviteCode={onGetInviteCode}
                            seniorName={seniorName}
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
                        />
                    )}

                    <div className="h-full relative z-10">
                        {/* LivingBackground for circadian atmosphere (Living Design 🏠) */}
                        {FEATURES.livingDesign ? (
                            <LivingBackground>
                                <div className="h-full overflow-y-auto">
                                    {/* Ping Notification from Firestore */}
                                    {latestPing && (
                                        <PingNotification
                                            ping={latestPing}
                                            onDismiss={dismissPing}
                                        />
                                    )}

                                    {isSenior ? (
                                        <SeniorView />
                                    ) : (
                                        <RelativeView />
                                    )}
                                    {/* Photo notification badge */}
                                    {latestPhoto && (
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
                            <div className="h-full bg-gradient-to-b from-sky-100 via-sky-50 to-stone-100">
                                <div className="h-full overflow-y-auto">
                                    {latestPing && (
                                        <PingNotification
                                            ping={latestPing}
                                            onDismiss={dismissPing}
                                        />
                                    )}
                                    {isSenior ? (
                                        <SeniorView />
                                    ) : (
                                        <RelativeView />
                                    )}
                                    {latestPhoto && (
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

                        {/* Global Bottom Navigation */}
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
