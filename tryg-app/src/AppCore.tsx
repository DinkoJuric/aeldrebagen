import React, { useState, useEffect } from 'react';
import { CareCircleProvider } from './contexts/CareCircleContext';
import { LivingBackground } from './components/ui/LivingBackground';
import { Share2, LogOut, Settings } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { PingNotification } from './features/thinkingOfYou';
import { PrivacySettings } from './components/PrivacySettings';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateToast } from './components/UpdateToast';
import { PhotoCaptureButton, PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge } from './features/photos';
import { useTasks } from './features/tasks';
import { useSymptoms } from './features/symptoms';
// import { useSettings } from './hooks/useSettings';
import { useWeeklyQuestions } from './features/weeklyQuestion';
import { usePings } from './features/thinkingOfYou';
import { useCheckIn } from './hooks/useCheckIn';
import { usePhotos } from './features/photos';
import { useMemberStatus, FamilyConstellation } from './features/familyPresence';
// import { SENIOR_PROFILE } from './data/constants'; // Unused
import { playCompletionSound, playSuccessSound, playPingSound } from './utils/sounds';
import { FEATURES } from './config/features';
import './index.css';
import { User } from 'firebase/auth'; // Or your custom user type
import { UserProfile, Member, CareCircle } from './types';
import { Task } from './features/tasks/useTasks';

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
    // View is determined by user role - no toggle allowed
    const isRelative = userProfile?.role === 'relative';
    const isSenior = userProfile?.role === 'senior';
    // const [activePing, setActivePing] = useState(null); // Unused?
    const [notification, setNotification] = useState<any | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacySettings, setShowPrivacySettings] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    // Firebase hooks for real-time data
    const { tasks, toggleTask, addTask } = useTasks(careCircle?.id);
    const { symptoms, addSymptom } = useSymptoms(careCircle?.id);
    // const { settings } = useSettings(careCircle?.id); // Unused
    // Per-member status tracking (each member has their own status)
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(careCircle?.id, user?.uid, userProfile?.displayName, userProfile?.role);
    const {
        answers: weeklyAnswers,
        addAnswer: addWeeklyAnswer,
        toggleLike: onToggleLike,
        addReply: onReply
    } = useWeeklyQuestions(careCircle?.id);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid);
    // HelpExchange removed from here - moved to CoordinationTab and SeniorView
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);
    const { latestPhoto, uploading, uploadPhoto, deletePhoto } = usePhotos(careCircle?.id, user?.uid);

    // HelpExchange filtering removed


    // Handle incoming pings from Firestore
    useEffect(() => {
        if (latestPing && FEATURES.pingSound) {
            playPingSound();
        }
    }, [latestPing]);

    // Clear notification after 4 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleToggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id || t.id === `task_${id}`);
        const willBeCompleted = task && !task.completed;

        // Wait for Firestore update to complete
        await toggleTask(id);

        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async (status: string) => {
        // Record check-in to Firestore for real-time sync
        await recordCheckIn(); // status arg removed from hook? assuming it toggles/sets 'checked-in'
        // recordCheckIn likely takes no args or specific args. Based on usage in previous file, recordCheckIn() was called.
        // Actually line 96 in AppCore.jsx called recordCheckIn() with no args.
        if (status === 'checked-in' && FEATURES.completionSounds) {
            playSuccessSound();
        }
    };

    const handleAddSymptom = async (symptomType: any) => {
        await addSymptom(symptomType);
    };

    const handleAddTaskFromRelative = async (newTask: Partial<Task>) => {
        // Include social attribution for tasks created by relatives
        await addTask({
            ...newTask,
            createdByRole: 'relative',
            createdByName: relativeName || userProfile?.displayName || 'Familie',
            createdByUserId: user?.uid
        });
    };

    const handleSendPing = async (fromName: string, toRole: string) => {
        // Send ping via Firestore for real-time sync
        await sendPing(fromName, user?.uid, toRole);
    };

    const handleWeeklyAnswer = async (answer: string) => {
        await addWeeklyAnswer(answer);
    };

    // Get display names
    const seniorName = careCircle?.seniorName || (userProfile?.role === 'senior' ? userProfile?.displayName : 'Senior');

    // For relatives, use the LOGGED-IN user's name, not just any relative in the circle
    const relativeName = userProfile?.role === 'relative'
        ? userProfile?.displayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

    // const profile = { ...SENIOR_PROFILE, name: seniorName }; // Unused

    return (
        <CareCircleProvider
            careCircleId={careCircle?.id}
            seniorId={careCircle?.seniorId}
            seniorName={seniorName}
            currentUserId={user?.uid}
            userRole={userProfile?.role}
            userName={isSenior ? seniorName : relativeName}
            memberStatuses={memberStatuses}
            relativeStatuses={relativeStatuses}
            seniorStatus={seniorStatus}
            myStatus={myStatus}
            setMyStatus={setMyStatus}
        >
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

                    {/* Header - COMPACT: Share / Settings / Logout */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-black/5 z-50 flex justify-between items-center backdrop-blur-sm px-3">
                        {/* Left: Share (opens invite panel) */}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Del familie-kode"
                        >
                            <Share2 className="w-4 h-4 text-stone-600" />
                        </button>

                        {/* Center: Settings gear (opens Privacy & Data directly) */}
                        <button
                            onClick={() => setShowPrivacySettings(true)}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Indstillinger"
                        >
                            <Settings className="w-5 h-5 text-stone-600" />
                        </button>

                        {/* Right: Sign out */}
                        <button
                            onClick={onSignOut}
                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Log ud"
                        >
                            <LogOut className="w-4 h-4 text-stone-600" />
                        </button>
                    </div>

                    {/* Settings panel (invite code + privacy) */}
                    {showSettings && (
                        <div className="absolute top-10 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 z-40 border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">Familie-cirkel</h3>
                            {inviteCode ? (
                                <div className="bg-stone-100 rounded-xl p-3 text-center mb-3">
                                    <p className="text-xs text-stone-500 mb-1">Invitationskode</p>
                                    <p className="text-2xl font-mono font-bold tracking-widest">{inviteCode}</p>
                                </div>
                            ) : (
                                <button
                                    onClick={onGetInviteCode}
                                    className="w-full py-2 bg-teal-100 text-teal-700 rounded-xl font-medium mb-3"
                                >
                                    Vis invitationskode
                                </button>
                            )}

                            <p className="text-xs text-stone-400 mt-3">
                                Logget ind som: {user?.email}
                            </p>

                            {/* Family Constellation - Orbit Visualization */}
                            {memberStatuses.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-stone-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm font-medium text-stone-600">Familiens Hjerte</span>
                                    </div>
                                    <FamilyConstellation
                                        members={memberStatuses as any}
                                        centerMemberName={seniorName}
                                        currentUserId={user?.uid}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Privacy Settings Modal */}
                    {showPrivacySettings && (
                        <PrivacySettings
                            user={user}
                            careCircle={careCircle}
                            onClose={() => setShowPrivacySettings(false)}
                        />
                    )}

                    <div className="h-full relative z-10">
                        {/* LivingBackground temporarily disabled - using fixed gradient */}
                        <div className="h-full bg-gradient-to-b from-sky-100 via-sky-50 to-stone-100">
                            <div className="h-full overflow-y-auto">
                                {/* Ping Notification from Firestore */}
                                {latestPing && (
                                    <PingNotification
                                        ping={latestPing}
                                        onDismiss={dismissPing}
                                    />
                                )}

                                {isSenior ? (
                                    <SeniorView
                                        tasks={tasks}
                                        toggleTask={handleToggleTask}
                                        updateStatus={handleCheckIn}
                                        addSymptom={handleAddSymptom}
                                        statusLastUpdated={null}
                                        onSendPing={(type: string) => handleSendPing(seniorName, 'relative')}
                                        weeklyAnswers={weeklyAnswers}
                                        onWeeklyAnswer={handleWeeklyAnswer}
                                        members={members}
                                        memberStatuses={memberStatuses}
                                        currentUserId={user?.uid ?? null}
                                        relativeStatuses={relativeStatuses}
                                        userName={seniorName}
                                        relativeName={relativeName}
                                        careCircleId={careCircle?.id ?? null}
                                        symptomLogs={symptoms}
                                        onAddTask={addTask}
                                        onToggleLike={onToggleLike}
                                        onReply={onReply}
                                    />
                                ) : (
                                    <RelativeView
                                        tasks={tasks}
                                        onAddTask={handleAddTaskFromRelative}
                                        profile={userProfile}
                                        lastCheckIn={lastCheckIn}
                                        symptomLogs={symptoms}
                                        myStatus={myStatus}
                                        onMyStatusChange={setMyStatus}
                                        memberStatuses={memberStatuses}
                                        currentUserId={user?.uid}
                                        onSendPing={(type) => handleSendPing(relativeName, 'senior')}
                                        weeklyAnswers={weeklyAnswers}
                                        onWeeklyAnswer={handleWeeklyAnswer}
                                        onToggleLike={onToggleLike}
                                        onReply={onReply}
                                        onOpenSettings={() => setShowPrivacySettings(true)}
                                        userName={relativeName}
                                        seniorName={seniorName}
                                        careCircleId={careCircle?.id}
                                    />
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
                        </div>
                        {/* End of temporary fixed background */}
                    </div>

                    {/* Photo upload modal */}
                    <PhotoUploadModal isOpen={uploading} />

                    {/* Photo viewer modal */}
                    {showPhotoViewer && latestPhoto && (
                        <PhotoViewerModal
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
