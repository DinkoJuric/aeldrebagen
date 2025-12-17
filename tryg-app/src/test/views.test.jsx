// P0 Smoke Tests for View Components
// These tests ensure components render without crashing with minimal props
// Critical: Would have caught the PWA crash from undefined familyStatus

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock Firebase modules before importing components
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

// Mock all hooks that use Firebase
vi.mock('../features/helpExchange/useHelpExchangeMatch', () => ({
    useHelpExchangeMatch: () => ({ match: null, dismissMatch: vi.fn() })
}))

describe('SeniorView Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { SeniorView } = await import('../components/SeniorView')
        expect(SeniorView).toBeDefined()
        expect(typeof SeniorView).toBe('function')
    })

    it('renders without crashing with minimal props', async () => {
        const { SeniorView } = await import('../components/SeniorView')

        // These are the minimum required props
        const minimalProps = {
            tasks: [],
            toggleTask: vi.fn(),
            updateStatus: vi.fn(),
            addSymptom: vi.fn(),
            onSendPing: vi.fn(),
        }

        // This should NOT crash - if it does, we have an undefined variable issue
        const { container } = render(<SeniorView {...minimalProps} />)
        expect(container).toBeTruthy()
    })

    it('renders with memberStatuses prop (FamilyPresence)', async () => {
        const { SeniorView } = await import('../components/SeniorView')

        const propsWithMemberStatuses = {
            tasks: [],
            toggleTask: vi.fn(),
            updateStatus: vi.fn(),
            addSymptom: vi.fn(),
            onSendPing: vi.fn(),
            memberStatuses: [
                { docId: 'user1', displayName: 'Louise', status: 'home', role: 'relative' }
            ],
            currentUserId: 'user1'
        }

        const { container } = render(<SeniorView {...propsWithMemberStatuses} />)
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

        const minimalProps = {
            tasks: [],
            profile: {},
            symptomLogs: [],
            onAddTask: vi.fn(),
        }

        const { container } = render(<RelativeView {...minimalProps} />)
        expect(container).toBeTruthy()
    })

    it('renders with memberStatuses prop (FamilyPresence)', async () => {
        const { RelativeView } = await import('../components/RelativeView')

        const propsWithMemberStatuses = {
            tasks: [],
            profile: {},
            symptomLogs: [],
            onAddTask: vi.fn(),
            memberStatuses: [
                { docId: 'user1', displayName: 'Brad', status: 'good', role: 'senior' }
            ],
            currentUserId: 'user2'
        }

        const { container } = render(<RelativeView {...propsWithMemberStatuses} />)
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
            <FamilyPresence memberStatuses={[]} currentUserId="user1" />
        )
        expect(container).toBeTruthy()
    })

    it('renders with populated memberStatuses', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')

        const memberStatuses = [
            { docId: 'brad', displayName: 'Brad', status: 'good', role: 'senior' },
            { docId: 'louise', displayName: 'Louise', status: 'home', role: 'relative' }
        ]

        const { container } = render(
            <FamilyPresence memberStatuses={memberStatuses} currentUserId="louise" />
        )
        expect(container).toBeTruthy()
    })
})
