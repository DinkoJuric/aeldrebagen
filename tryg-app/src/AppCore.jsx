// Core Tryg App with Firebase data hooks
// This is the main app UI that receives Firebase state from AppWithAuth

import React, { useState, useEffect } from 'react';
import { Activity, LogOut, Share2, Settings, Users } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { PingNotification } from './components/ThinkingOfYou';
import { PrivacySettings } from './components/PrivacySettings';
import { PhotoCaptureButton, PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge } from './components/PhotoShare';
import { useTasks } from './hooks/useTasks';
import { useSymptoms } from './hooks/useSymptoms';
import { useSettings } from './hooks/useSettings';
import { useWeeklyQuestions } from './hooks/useWeeklyQuestions';
import { usePings } from './hooks/usePings';
import { useHelpExchange } from './hooks/useHelpExchange';
import { useCheckIn } from './hooks/useCheckIn';
import { usePhotos } from './hooks/usePhotos';
import { useMemberStatus } from './hooks/useMemberStatus';
import { SENIOR_PROFILE } from './data/constants';
import { playCompletionSound, playSuccessSound, playPingSound } from './utils/sounds';
import { FEATURES } from './config/features';
import './index.css';

export default function TrygAppCore({
    user,
    userProfile,
    careCircle,
    onSignOut,
    inviteCode,
    onGetInviteCode,
    members = []
}) {
    // View is determined by user role - no toggle allowed
    const isRelative = userProfile?.role === 'relative';
    const isSenior = userProfile?.role === 'senior';
    const [activePing, setActivePing] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacySettings, setShowPrivacySettings] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    // Firebase hooks for real-time data
    const { tasks, toggleTask, addTask } = useTasks(careCircle?.id);
    const { symptoms, addSymptom } = useSymptoms(careCircle?.id);
    const { settings } = useSettings(careCircle?.id);
    // Per-member status tracking (each member has their own status)
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(careCircle?.id, user?.uid, userProfile?.displayName, userProfile?.role);
    const { answers: weeklyAnswers, addAnswer: addWeeklyAnswer } = useWeeklyQuestions(careCircle?.id);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid);
    const {
        helpOffers: allOffers,
        helpRequests: allRequests,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircle?.id, user?.uid, userProfile?.role, userProfile?.displayName);
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);
    const { latestPhoto, uploading, uploadPhoto, deletePhoto } = usePhotos(careCircle?.id, user?.uid);

    // Filter offers/requests by role for the Match System
    // Senior's items: created by senior
    const helpOffers = allOffers.filter(o => o.createdByRole === 'senior');
    const helpRequests = allRequests.filter(r => r.createdByRole === 'senior');
    // Relative's items: created by relatives
    const relativeOffers = allOffers.filter(o => o.createdByRole === 'relative');
    const relativeRequests = allRequests.filter(r => r.createdByRole === 'relative');


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

    const handleToggleTask = async (id) => {
        const task = tasks.find(t => t.id === id || t.id === `task_${id}`);
        const willBeCompleted = task && !task.completed;

        // Wait for Firestore update to complete
        await toggleTask(id);

        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async (status) => {
        // Record check-in to Firestore for real-time sync
        await recordCheckIn();
        if (status === 'checked-in' && FEATURES.completionSounds) {
            playSuccessSound();
        }
    };

    const handleAddSymptom = async (symptomType) => {
        await addSymptom(symptomType);
    };

    const handleAddTaskFromRelative = async (newTask) => {
        await addTask(newTask);
    };

    const handleSendPing = async (fromName, toRole) => {
        // Send ping via Firestore for real-time sync
        await sendPing(fromName, user?.uid, toRole);
    };

    const handleWeeklyAnswer = async (answer) => {
        await addWeeklyAnswer(answer);
    };

    const handleHelpOffer = async (offer) => {
        await addOffer(offer);
    };

    const handleHelpRequest = async (request) => {
        await addRequest(request);
    };

    // Get display names
    const seniorName = careCircle?.seniorName || (userProfile?.role === 'senior' ? userProfile?.displayName : 'Senior');

    // For relatives, use the LOGGED-IN user's name, not just any relative in the circle
    const relativeName = userProfile?.role === 'relative'
        ? userProfile?.displayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

    const profile = {
        ...SENIOR_PROFILE,
        name: seniorName,
    };

    return (
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

                {/* Header with role indicator - COMPACT */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-black/5 z-50 flex justify-center items-center backdrop-blur-sm px-2">
                    {/* Settings button (left) */}
                    <div className="absolute left-3 flex items-center gap-1">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Indstillinger"
                        >
                            <Share2 className="w-4 h-4 text-stone-600" />
                        </button>
                        {FEATURES.photoSharing && (
                            <PhotoCaptureButton
                                onCapture={async (file) => {
                                    await uploadPhoto(file, userProfile?.displayName || 'Familie');
                                }}
                                disabled={uploading}
                            />
                        )}
                    </div>

                    {/* Role indicator (center) - compact */}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${isSenior ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'
                        }`}>
                        {isSenior ? `👤 ${seniorName}` : `👥 ${relativeName}`}
                    </div>

                    {/* Sign out button (right) */}
                    <button
                        onClick={onSignOut}
                        className="absolute right-3 p-1.5 rounded-full hover:bg-white/50 transition-colors"
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

                        <button
                            onClick={() => {
                                setShowSettings(false);
                                setShowPrivacySettings(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Privatliv & Data
                        </button>

                        <p className="text-xs text-stone-400 mt-3">
                            Logget ind som: {user?.email}
                        </p>

                        {/* Circle members list - Elder first */}
                        {members.length > 0 && (() => {
                            // Sort senior to top
                            const senior = members.find(m => m.role === 'senior');
                            const relatives = members.filter(m => m.role !== 'senior');

                            return (
                                <div className="mt-4 pt-4 border-t border-stone-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="w-4 h-4 text-stone-500" />
                                        <span className="text-sm font-medium text-stone-600">Vores Familie</span>
                                    </div>

                                    {/* The Elder - Distinguished at top */}
                                    {senior && (
                                        <div className="bg-gradient-to-r from-amber-50 to-teal-50 rounded-xl p-3 mb-3 border border-amber-200/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                    {senior.displayName?.charAt(0) || '👴'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-stone-800">{senior.displayName || 'Vores Elder'}</p>
                                                    <p className="text-xs text-amber-600 flex items-center gap-1">
                                                        <span>👑</span> Familiens hjerte
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pårørende - Simpler styling */}
                                    {relatives.length > 0 && (
                                        <div className="space-y-2 pl-2">
                                            {relatives.map((member) => (
                                                <div key={member.id} className="flex items-center gap-2 text-sm">
                                                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                        {member.displayName?.charAt(0) || '?'}
                                                    </div>
                                                    <span className="text-stone-700">{member.displayName || 'Ukendt'}</span>
                                                    <span className="text-xs text-indigo-500">Pårørende</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
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

                <div className="pt-10 h-full">
                    {/* Ping Notification from Firestore */}
                    {latestPing && (
                        <PingNotification
                            ping={{
                                fromName: latestPing.fromName,
                                toView: latestPing.toRole,
                                time: latestPing.sentAt?.toLocaleTimeString?.('da-DK', { hour: '2-digit', minute: '2-digit' }) || ''
                            }}
                            onDismiss={dismissPing}
                        />
                    )}

                    {isSenior ? (
                        <SeniorView
                            tasks={tasks}
                            toggleTask={handleToggleTask}
                            updateStatus={handleCheckIn}
                            addSymptom={handleAddSymptom}
                            statusLastUpdated={settings?.lastUpdated}
                            onSendPing={() => handleSendPing(seniorName, 'relative')}
                            weeklyAnswers={weeklyAnswers}
                            onWeeklyAnswer={handleWeeklyAnswer}
                            helpOffers={helpOffers}
                            helpRequests={helpRequests}
                            relativeOffers={relativeOffers}
                            relativeRequests={relativeRequests}
                            onHelpOffer={handleHelpOffer}
                            onHelpRequest={handleHelpRequest}
                            onRemoveOffer={removeOffer}
                            onRemoveRequest={removeRequest}
                            members={members}
                            memberStatuses={memberStatuses}
                            currentUserId={user?.uid}
                            relativeStatuses={relativeStatuses}
                            userName={seniorName}
                            relativeName={relativeName}
                        />
                    ) : (
                        <RelativeView
                            tasks={tasks}
                            profile={profile}
                            lastCheckIn={lastCheckIn}
                            symptomLogs={symptoms}
                            onAddTask={handleAddTaskFromRelative}
                            myStatus={myStatus}
                            onMyStatusChange={setMyStatus}
                            memberStatuses={memberStatuses}
                            currentUserId={user?.uid}
                            onSendPing={() => handleSendPing(relativeName, 'senior')}
                            weeklyAnswers={weeklyAnswers}
                            onWeeklyAnswer={handleWeeklyAnswer}
                            helpOffers={helpOffers}
                            helpRequests={helpRequests}
                            relativeOffers={relativeOffers}
                            relativeRequests={relativeRequests}
                            onAddRelativeOffer={addOffer}
                            onRemoveRelativeOffer={removeOffer}
                            onAddRelativeRequest={addRequest}
                            onRemoveRelativeRequest={removeRequest}
                            onOpenSettings={() => setShowPrivacySettings(true)}
                            userName={relativeName}
                            seniorName={seniorName}
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

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
            </div>
        </div >
    );
}
