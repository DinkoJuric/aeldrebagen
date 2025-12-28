// P3 Integration Tests - End-to-end feature validation
// Tests for CoordinationTab

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithContext } from './test-utils'
import type { MemberStatus, Member } from '../types'

// Mock Firebase and hooks
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

// Mock all hooks that use Firebase
vi.mock('../features/helpExchange', () => ({
    useHelpExchange: () => ({
        helpOffers: [],
        helpRequests: [],
        addOffer: vi.fn(),
        addRequest: vi.fn(),
        removeOffer: vi.fn(),
        removeRequest: vi.fn()
    }),
    useHelpExchangeMatch: () => ({
        topMatch: null,
        hasMatches: false,
        match: null,
        dismissMatch: vi.fn()
    }),
    HelpExchange: () => <div data-testid="help-exchange">HelpExchange Mock</div>,
    MatchBanner: () => <div data-testid="match-banner">MatchBanner Mock</div>,
    MatchCelebration: () => <div data-testid="match-celebration">MatchCelebration Mock</div>,
    RELATIVE_OFFERS: [],
    RELATIVE_REQUESTS: [],
    MATCH_PAIRS: [],
    STATUS_MATCHES: ['mock']
}))

// Mock deep dependencies of CoordinationTab to prevent Firebase calls
vi.mock('../features/symptoms', () => ({
    SymptomSummary: () => <div data-testid="symptom-summary">SymptomSummary</div>
}))
vi.mock('../features/memories/MemoriesGallery', () => ({
    MemoriesGallery: () => <div data-testid="memories-gallery">MemoriesGallery</div>
}))
vi.mock('../features/visualizations/FamilyTree', () => ({
    FamilyTree: () => <div data-testid="family-tree">FamilyTree</div>
}))
vi.mock('../features/onboarding/RelationshipMatrix', () => ({
    RelationshipMatrix: () => <div data-testid="relationship-matrix">RelationshipMatrix</div>
}))
vi.mock('../features/familyPresence', () => ({
    FamilyPresence: () => <div>Familien nu (Mock)</div>,
    StatusSelector: () => <div>StatusSelector</div>,
    STATUS_OPTIONS: [{ id: 'home', icon: 'div' }]
}))

describe('CoordinationTab Integration', () => {
    it('can be imported without error', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')
        expect(CoordinationTab).toBeDefined()
    })

    it('renders with minimal props', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        const { container } = renderWithContext(
            <CoordinationTab
                onMatchAction={vi.fn()}
            />, {
            seniorName: 'Brad',
            userName: 'Louise',
            setMyStatus: vi.fn()
        })
        expect(container).toBeTruthy()
    })

    it('renders FamilyPresence when members provided', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        const memberStatuses: MemberStatus[] = [
            { docId: 'brad', displayName: 'Brad', status: 'good', role: 'senior' as const }
        ]
        const members: Member[] = [
            { docId: 'brad', displayName: 'Brad', role: 'senior', userId: 'brad' }
        ]

        const { container } = renderWithContext(
            <CoordinationTab
                onMatchAction={vi.fn()}
            />, {
            seniorName: 'Brad',
            userName: 'Louise',
            memberStatuses: memberStatuses,
            members: members,
            currentUserId: 'louise',
            setMyStatus: vi.fn()
        })

        expect(container).toBeTruthy()
        // FamilyPresence render condition depends on members.length > 0
        // Mock renders "Familien nu (Mock)"
        expect(screen.getByText(/Familien nu/i)).toBeTruthy()
    })

    it('shows status selector for user', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        renderWithContext(
            <CoordinationTab
                onMatchAction={vi.fn()}
            />, {
            seniorName: 'Brad',
            userName: 'Louise',
            myStatus: 'home',
            setMyStatus: vi.fn()
        })

        // Should show status section header. Mock t() returns keys.
        // Expect "din_status"
        expect(screen.getByText(/din_status/i)).toBeTruthy()
    })
})
