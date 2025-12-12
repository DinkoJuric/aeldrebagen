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
    const { familyStatus, setFamilyStatus } = useSettings(careCircle?.id);
    const { answers: weeklyAnswers, addAnswer: addWeeklyAnswer } = useWeeklyQuestions(careCircle?.id);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid);
    const { helpOffers, helpRequests, addOffer, addRequest } = useHelpExchange(careCircle?.id);
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);
    const { latestPhoto, uploading, uploadPhoto, deletePhoto } = usePhotos(careCircle?.id, user?.uid);

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

    // Get display names from care circle and user profile
    const seniorName = careCircle?.seniorName || userProfile?.displayName || 'Senior';
    const relativeName = userProfile?.displayName || 'Pårørende';
    const profile = {
        ...SENIOR_PROFILE,
        name: seniorName,
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-800 p-4 font-sans">

            {/* Phone Frame Simulator */}
            <div className="relative w-full max-w-md h-[850px] bg-white rounded-[3rem] overflow-hidden border-8 border-zinc-900 shadow-2xl ring-1 ring-zinc-400/50">

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

                {/* Header with role indicator */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-black/5 z-50 flex justify-center items-center backdrop-blur-sm px-2">
                    {/* Settings button (left) */}
                    <div className="absolute left-4 flex items-center gap-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Indstillinger"
                        >
                            <Share2 className="w-5 h-5 text-stone-600" />
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

                    {/* Role indicator (center) - no toggle */}
                    <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${isSenior ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'
                        }`}>
                        {isSenior ? `👤 ${seniorName}` : `👥 ${relativeName}`}
                    </div>

                    {/* Sign out button (right) */}
                    <button
                        onClick={onSignOut}
                        className="absolute right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
                        aria-label="Log ud"
                    >
                        <LogOut className="w-5 h-5 text-stone-600" />
                    </button>
                </div>

                {/* Settings panel (invite code + privacy) */}
                {showSettings && (
                    <div className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 z-40 border border-stone-200">
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

                        {/* Circle members list */}
                        {members.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-stone-500" />
                                    <span className="text-sm font-medium text-stone-600">Medlemmer</span>
                                </div>
                                <div className="space-y-2">
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center gap-2 text-sm">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${member.role === 'senior' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                {member.displayName?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-stone-700">{member.displayName || 'Ukendt'}</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${member.role === 'senior' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'
                                                }`}>
                                                {member.role === 'senior' ? 'Senior' : 'Pårørende'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
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

                <div className="pt-14 h-full">
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
                            familyStatus={familyStatus}
                            onSendPing={() => handleSendPing(seniorName, 'relative')}
                            weeklyAnswers={weeklyAnswers}
                            onWeeklyAnswer={handleWeeklyAnswer}
                            helpOffers={helpOffers}
                            helpRequests={helpRequests}
                            onHelpOffer={handleHelpOffer}
                            onHelpRequest={handleHelpRequest}
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
                            familyStatus={familyStatus}
                            onFamilyStatusChange={setFamilyStatus}
                            onSendPing={() => handleSendPing(relativeName, 'senior')}
                            weeklyAnswers={weeklyAnswers}
                            onWeeklyAnswer={handleWeeklyAnswer}
                            helpOffers={helpOffers}
                            helpRequests={helpRequests}
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
        </div>
    );
}
