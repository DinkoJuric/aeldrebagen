import React, { useState, useCallback, useMemo } from 'react';
import { CareCircleContext } from '../../contexts/CareCircleContext';
import { useTasks } from '../../features/tasks';
import { useSymptoms } from '../../features/symptoms';
import { useMemberStatus } from '../../features/familyPresence';
import { useWeeklyQuestions } from '../../features/weeklyQuestion';
import { usePings } from '../../features/thinkingOfYou';
import { useCheckIn } from '../../hooks/useCheckIn';
import { AppTab, UserProfile, Member, Task, WeeklyAnswer } from '../../types';
import { User } from 'firebase/auth';

interface CareCircleProviderProps {
    children: React.ReactNode;
    user: User | null;
    userProfile: UserProfile | null;
    careCircle: any;
    members?: Member[];
    inviteCode: string | null;
    onGetInviteCode: () => Promise<void>;
    updateMember: (data: Partial<Member>) => Promise<void>;
    updateAnyMember: (memberId: string, data: Partial<Member>) => Promise<void>;
}

export function CareCircleProvider({
    children,
    user,
    userProfile,
    careCircle,
    members = [],
    inviteCode,
    onGetInviteCode,
    updateMember,
    updateAnyMember,
}: CareCircleProviderProps) {
    const [activeTab, setActiveTab] = useState<AppTab>('daily');

    // View is determined by user role - no toggle allowed
    const isSenior = userProfile?.role === 'senior';

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
    } = useMemberStatus(
        careCircle?.id,
        user?.uid ?? null,
        (userProfile?.displayName ?? undefined) as string | null,
        userProfile?.role ?? 'relative'
    );

    const {
        answers: weeklyAnswers,
        addAnswer: addWeeklyAnswer,
        toggleLike: onToggleLike,
        addReply: onReply
    } = useWeeklyQuestions(careCircle?.id);

    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid ?? null);
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);

    // Business Logic Handlers (Moved from AppCore)

    const handleAddTaskFromRelative = useCallback(async (newTask: Partial<Task>) => {
        // Relative name logic for task creation
        const currentMember = members.find(m => m.userId === user?.uid);
        const effectiveDisplayName = currentMember?.displayName || userProfile?.displayName;
        const relativeName = userProfile?.role === 'relative'
            ? effectiveDisplayName || 'Pårørende'
            : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

        return await addTask({
            ...newTask,
            createdByRole: 'relative',
            createdByName: relativeName,
            createdByUserId: user?.uid
        });
    }, [members, user, userProfile, addTask]);

    const handleSendPing = useCallback(async (toRole: 'senior' | 'relative') => {
        // Name logic
        const currentMember = members.find(m => m.userId === user?.uid);
        const seniorMember = members.find(m => m.role === 'senior');
        const effectiveDisplayName = currentMember?.displayName || userProfile?.displayName;

        const seniorName = seniorMember?.displayName || careCircle?.seniorName || (userProfile?.role === 'senior' ? effectiveDisplayName : 'Senior');
        const relativeName = userProfile?.role === 'relative'
            ? effectiveDisplayName || 'Pårørende'
            : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

        const fromName = isSenior ? seniorName : relativeName;
        return await sendPing(fromName, (user?.uid ?? undefined) as string, toRole);
    }, [members, user, userProfile, careCircle, isSenior, sendPing]);

    const handleWeeklyAnswer = useCallback(async (answer: string | Partial<WeeklyAnswer>) => {
        // Name logic
        const currentMember = members.find(m => m.userId === user?.uid);
        const seniorMember = members.find(m => m.role === 'senior');
        const effectiveDisplayName = currentMember?.displayName || userProfile?.displayName;

        const seniorName = seniorMember?.displayName || careCircle?.seniorName || (userProfile?.role === 'senior' ? effectiveDisplayName : 'Senior');
        const relativeName = userProfile?.role === 'relative'
            ? effectiveDisplayName || 'Pårørende'
            : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

        const baseAnswer = typeof answer === 'string' ? { text: answer } : answer;

        return await addWeeklyAnswer({
            ...baseAnswer,
            userId: user?.uid,
            userName: isSenior ? seniorName : (relativeName || 'Pårørende')
        });
    }, [members, user, userProfile, careCircle, isSenior, addWeeklyAnswer]);

    // 🚀 TURBO: Wrap the toggleLike handler in useCallback to stabilize its reference
    const toggleLike = useCallback((answerId: string, userId: string, isLiked: boolean) => {
        return onToggleLike(answerId, userId, isLiked);
    }, [onToggleLike]);

    // Calculate derived names for Context Value
    const currentMember = members.find(m => m.userId === user?.uid);
    const seniorMember = members.find(m => m.role === 'senior');
    const effectiveDisplayName = currentMember?.displayName || userProfile?.displayName;
    const seniorName = seniorMember?.displayName || careCircle?.seniorName || (userProfile?.role === 'senior' ? effectiveDisplayName : 'Senior');
    const relativeName = userProfile?.role === 'relative'
        ? effectiveDisplayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

    // 🚀 TURBO: Memoize the context value to prevent unnecessary re-renders
    // of consumers. The value object is only recreated when one of its
    // dependencies changes, which is far less frequent than on every render.
    const contextValue = useMemo(() => ({
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
        toggleTask: toggleTask,
        addTask: isSenior ? addTask : handleAddTaskFromRelative,
        symptoms,
        addSymptom: addSymptom,
        weeklyAnswers,
        addWeeklyAnswer: handleWeeklyAnswer,
        toggleLike: toggleLike,
        addReply: onReply,
        latestPing,
        sendPing: handleSendPing,
        dismissPing: dismissPing,
        lastCheckIn,
        recordCheckIn: recordCheckIn,
        updateMember: updateMember,
        updateAnyMember: updateAnyMember,
        // Extended context
        inviteCode,
        getInviteCode: onGetInviteCode
    }), [
        careCircle, user, userProfile, isSenior, seniorName, relativeName,
        memberStatuses, members, relativeStatuses, seniorStatus, myStatus,
        setMyStatus, activeTab, setActiveTab, tasks, toggleTask, addTask,
        handleAddTaskFromRelative, symptoms, addSymptom, weeklyAnswers,
        handleWeeklyAnswer, toggleLike, onReply, latestPing,
        handleSendPing, dismissPing, lastCheckIn, recordCheckIn,
        updateMember, updateAnyMember, inviteCode, onGetInviteCode, sendPing
    ]);

    return (
        <CareCircleContext.Provider value={contextValue as any}>
            {/* Cast to any temporarily until types.ts is updated in next step */}
            {children}
        </CareCircleContext.Provider>
    );
}
