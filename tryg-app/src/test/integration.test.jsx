// P3 Integration Tests - End-to-end feature validation
// Tests for CoordinationTab, HelpExchange flow, MatchCelebration

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock Firebase and hooks
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

vi.mock('../features/helpExchange/useHelpExchangeMatch', () => ({
    useHelpExchangeMatch: () => ({
        topMatch: null,
        hasMatches: false,
        match: null,
        dismissMatch: vi.fn()
    })
}))

describe('CoordinationTab Integration', () => {
    it('can be imported without error', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')
        expect(CoordinationTab).toBeDefined()
    })

    it('renders with minimal props', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        const { container } = render(
            <CoordinationTab
                seniorName="Brad"
                userName="Louise"
                onMyStatusChange={vi.fn()}
            />
        )
        expect(container).toBeTruthy()
    })

    it('renders FamilyPresence when memberStatuses provided', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        const memberStatuses = [
            { docId: 'brad', displayName: 'Brad', status: 'good', role: 'senior' }
        ]

        const { container } = render(
            <CoordinationTab
                seniorName="Brad"
                userName="Louise"
                memberStatuses={memberStatuses}
                currentUserId="louise"
                onMyStatusChange={vi.fn()}
            />
        )

        expect(container).toBeTruthy()
        // FamilyPresence should render with header
        expect(screen.getByText(/Familien nu/i)).toBeTruthy()
    })

    it('shows status selector for user', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        render(
            <CoordinationTab
                seniorName="Brad"
                userName="Louise"
                myStatus="home"
                onMyStatusChange={vi.fn()}
            />
        )

        // Should show status section header
        expect(screen.getByText(/Din status/i)).toBeTruthy()
    })
})

describe('HelpExchange Component', () => {
    it('can be imported without error', async () => {
        const { HelpExchange } = await import('../features/helpExchange')
        expect(HelpExchange).toBeDefined()
    })

    it('renders with minimal props', async () => {
        const { HelpExchange } = await import('../features/helpExchange')

        const { container } = render(
            <HelpExchange
                onOffer={vi.fn()}
                onRequest={vi.fn()}
            />
        )
        expect(container).toBeTruthy()
    })

    it('shows active offers when provided', async () => {
        const { HelpExchange } = await import('../features/helpExchange')

        const activeOffers = [
            { id: 'listen', label: 'Jeg kan hjælpe med at lytte', emoji: '👂' }
        ]

        render(
            <HelpExchange
                activeOffers={activeOffers}
                onOffer={vi.fn()}
                onRequest={vi.fn()}
                onRemoveOffer={vi.fn()}
            />
        )

        // Should show the active offer
        expect(screen.getByText(/lytte/)).toBeTruthy()
    })
})

describe('MatchCelebration Component', () => {
    it('can be imported without error', async () => {
        const { MatchCelebration, MatchBanner } = await import('../features/helpExchange')
        expect(MatchCelebration).toBeDefined()
        expect(MatchBanner).toBeDefined()
    })

    it('MatchBanner renders with match data', async () => {
        const { MatchBanner } = await import('../features/helpExchange')

        const mockMatch = {
            celebration: {
                emoji: '🍽️',
                title: 'Match!',
                message: 'I kan lave mad sammen'
            }
        }

        const { container } = render(
            <MatchBanner match={mockMatch} onClick={vi.fn()} />
        )

        expect(container).toBeTruthy()
        expect(screen.getByText('Match!')).toBeTruthy()
    })

    it('MatchCelebration renders null when no match', async () => {
        const { MatchCelebration } = await import('../features/helpExchange')

        const { container } = render(
            <MatchCelebration match={null} onDismiss={vi.fn()} />
        )

        // Should render empty
        expect(container.innerHTML).toBe('')
    })
})

describe('Match Detection Logic', () => {
    it('detects cook-shop match pair', async () => {
        const { MATCH_PAIRS } = await import('../features/helpExchange')

        const cookShopMatch = MATCH_PAIRS.find(
            p => p.offerId === 'cook' && p.requestId === 'shop'
        )

        expect(cookShopMatch).toBeDefined()
        expect(cookShopMatch.celebration.emoji).toBe('🍽️')
    })

    it('detects visit-company match pair', async () => {
        const { MATCH_PAIRS } = await import('../features/helpExchange')

        const visitMatch = MATCH_PAIRS.find(
            p => p.offerId === 'visit' && p.requestId === 'company'
        )

        expect(visitMatch).toBeDefined()
        expect(visitMatch.celebration.emoji).toBe('☕')
    })

    it('has status-based matches defined', async () => {
        const { STATUS_MATCHES } = await import('../features/helpExchange')

        expect(STATUS_MATCHES).toBeDefined()
        expect(Array.isArray(STATUS_MATCHES)).toBe(true)
        expect(STATUS_MATCHES.length).toBeGreaterThan(0)
    })
})
