
// P0 Smoke Tests for View Components
// These tests ensure components render without crashing with minimal props
// Critical: Would have caught the PWA crash from undefined familyStatus

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { renderWithContext } from './test-utils'
import type { MemberStatus } from '../types'

// Mock Firebase modules before importing components
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

// Mock all hooks that use Firebase
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
        hasMatches: false,
        topMatch: null,
        match: null,
        dismissMatch: vi.fn()
    }),
    MatchBanner: () => <div data-testid="match-banner">MatchBanner</div>,
    MatchCelebration: () => <div data-testid="match-celebration">MatchCelebration</div>,
    // Add constants used by CoordinationTab
    RELATIVE_OFFERS: [],
    RELATIVE_REQUESTS: [],
    MATCH_PAIRS: [],
    STATUS_MATCHES: []
}))

// Mock child components to isolate View testing
vi.mock('../components/shared/AmbientTab', () => ({ AmbientTab: () => <div /> }))
vi.mock('../components/senior/FamilyTab', () => ({ FamilyTab: () => <div /> }))
vi.mock('../components/shared/HealthTab', () => ({ HealthTab: () => <div /> }))
vi.mock('../components/shared/SpilTab', () => ({ SpilTab: () => <div /> }))
vi.mock('../components/senior/modals/SeniorModals', () => ({ SeniorModals: () => <div /> }))

describe('SeniorView Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { SeniorView } = await import('../components/SeniorView')
        expect(SeniorView).toBeDefined()
        expect(typeof SeniorView).toBe('function')
    })

    it('renders without crashing with minimal props', async () => {
        const { SeniorView } = await import('../components/SeniorView')

        // This should NOT crash - if it does, we have an undefined variable issue
        const { container } = renderWithContext(<SeniorView />, {
            tasks: [],
            toggleTask: vi.fn(),
            updateStatus: vi.fn(),
            addSymptom: vi.fn(),
            onSendPing: vi.fn(),
        })
        expect(container).toBeTruthy()
    })

    it('renders with memberStatuses prop (FamilyPresence)', async () => {
        const { SeniorView } = await import('../components/SeniorView')

        const { container } = renderWithContext(<SeniorView />, {
            tasks: [],
            toggleTask: vi.fn(),
            updateStatus: vi.fn(),
            addSymptom: vi.fn(),
            onSendPing: vi.fn(),
            memberStatuses: [
                { docId: 'user1', displayName: 'Louise', status: 'home', role: 'relative' as const }
            ],
            currentUserId: 'user1'
        })
        expect(container).toBeTruthy()
    })
})

describe('RelativeView Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { RelativeView } = await import('../components/RelativeView')
        expect(RelativeView).toBeDefined()
        expect(typeof RelativeView).toBe('function')
    })

    it('renders without crashing with minimal props', async () => {
        const { RelativeView } = await import('../components/RelativeView')

        const { container } = renderWithContext(<RelativeView />, {
            tasks: [],
            symptomLogs: [],
            onAddTask: vi.fn(),
        })
        expect(container).toBeTruthy()
    })

    it('renders with memberStatuses prop (FamilyPresence)', async () => {
        const { RelativeView } = await import('../components/RelativeView')

        const { container } = renderWithContext(<RelativeView />, {
            tasks: [],
            symptomLogs: [],
            onAddTask: vi.fn(),
            memberStatuses: [
                { docId: 'user1', displayName: 'Brad', status: 'good', role: 'senior' as const }
            ],
            currentUserId: 'user2'
        })
        expect(container).toBeTruthy()
    })
})

describe('FamilyPresence Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')
        expect(FamilyPresence).toBeDefined()
    })

    it('renders with empty memberStatuses', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')

        const { container } = render(
            <FamilyPresence memberStatuses={[]} currentUserId="user1" seniorName="Brad" />
        )
        expect(container).toBeTruthy()
    })

    it('renders with populated memberStatuses', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')

        const memberStatuses: MemberStatus[] = [
            { docId: 'brad', displayName: 'Brad', status: 'good', role: 'senior' as const },
            { docId: 'louise', displayName: 'Louise', status: 'home', role: 'relative' as const }
        ]

        const { container } = render(
            <FamilyPresence memberStatuses={memberStatuses} currentUserId="louise" seniorName="Brad" />
        )
        expect(container).toBeTruthy()
    })
})
