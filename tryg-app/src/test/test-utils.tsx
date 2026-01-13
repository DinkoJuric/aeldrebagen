import React from 'react';
import { render } from '@testing-library/react';
import { CareCircleContext } from '../contexts/CareCircleContext';
import { FamilyProvider } from '../contexts/FamilyContext';
import { vi } from 'vitest';

import { CareCircleContextValue } from '../types';

export const mockCareCircleContextValue = {
    careCircleId: 'test-circle',
    seniorId: 'senior-1',
    seniorName: 'Senior',
    currentUserId: 'user-1',
    userRole: 'relative',
    userName: 'Relative',
    relativeName: 'Relative',
    memberStatuses: [],
    members: [],
    relativeStatuses: [],
    seniorStatus: null,
    myStatus: 'home',
    setMyStatus: vi.fn(),
    activeTab: 'daily',
    setActiveTab: vi.fn(),
    tasks: [],
    toggleTask: vi.fn(),
    addTask: vi.fn(),
    symptoms: [],
    addSymptom: vi.fn(),
    weeklyAnswers: [],
    addWeeklyAnswer: vi.fn(),
    toggleLike: vi.fn(),
    addReply: vi.fn(),
    latestPing: null,
    sendPing: vi.fn(),
    dismissPing: vi.fn(),
    lastCheckIn: null,
    recordCheckIn: vi.fn(),
    updateMember: vi.fn(),
    updateAnyMember: vi.fn(),
} as unknown as CareCircleContextValue;

export const renderWithContext = (ui: React.ReactElement, contextOverrides = {}) => {
    return render(
        <CareCircleContext.Provider value={{ ...mockCareCircleContextValue, ...contextOverrides }}>
            {ui}
        </CareCircleContext.Provider>
    );
};

export const renderWithFamilyContext = (ui: React.ReactElement, contextOverrides = {}) => {
    return render(
        <CareCircleContext.Provider value={{ ...mockCareCircleContextValue, ...contextOverrides }}>
            <FamilyProvider
                careCircleId="test-circle"
                userId="test-user"
                userDisplayName="Test User"
                userRole="relative"
                members={[]}
            >
                {ui}
            </FamilyProvider>
        </CareCircleContext.Provider>
    );
};
