// P2 Component Tests - Feature robustness
// Tests for ProgressRing, InlineGatesIndicator, SeniorStatusCard

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('ProgressRing Component', () => {
    it('can be imported without error', async () => {
        const { ProgressRing } = await import('../components/ProgressRing')
        expect(ProgressRing).toBeDefined()
    })

    it('renders with empty tasks', async () => {
        const { ProgressRing } = await import('../components/ProgressRing')

        const { container } = render(<ProgressRing tasks={[]} />)
        expect(container).toBeTruthy()
    })

    it('renders with tasks in different periods', async () => {
        const { ProgressRing } = await import('../components/ProgressRing')

        const tasks = [
            { id: 1, title: 'Morning Med', period: 'morgen', completed: true },
            { id: 2, title: 'Lunch Med', period: 'eftermiddag', completed: false },
            { id: 3, title: 'Evening Med', period: 'aften', completed: false }
        ]

        const { container } = render(<ProgressRing tasks={tasks} />)
        expect(container).toBeTruthy()
    })

    it('shows correct percentage in center', async () => {
        const { ProgressRing } = await import('../components/ProgressRing')

        const tasks = [
            { id: 1, period: 'morgen', completed: true },
            { id: 2, period: 'morgen', completed: true },
            { id: 3, period: 'morgen', completed: false },
            { id: 4, period: 'morgen', completed: false }
        ]

        render(<ProgressRing tasks={tasks} />)
        // 2 of 4 = 50%
        expect(screen.getByText('50%')).toBeTruthy()
    })
})

describe('InlineGatesIndicator Component', () => {
    it('can be imported without error', async () => {
        const { InlineGatesIndicator } = await import('../components/ProgressRing')
        expect(InlineGatesIndicator).toBeDefined()
    })

    it('renders with empty tasks', async () => {
        const { InlineGatesIndicator } = await import('../components/ProgressRing')

        const { container } = render(<InlineGatesIndicator tasks={[]} />)
        expect(container).toBeTruthy()
    })

    it('shows all three period labels', async () => {
        const { InlineGatesIndicator } = await import('../components/ProgressRing')

        render(<InlineGatesIndicator tasks={[]} />)

        // Should show abbreviated period labels
        expect(screen.getByText(/Mor/)).toBeTruthy() // Morgen
        expect(screen.getByText(/Eft/)).toBeTruthy() // Eftermiddag
        expect(screen.getByText(/Aft/)).toBeTruthy() // Aften
    })
})

describe('SeniorStatusCard Component', () => {
    it('can be imported without error', async () => {
        const { SeniorStatusCard } = await import('../components/SeniorStatusCard')
        expect(SeniorStatusCard).toBeDefined()
    })

    it('renders with minimal props', async () => {
        const { SeniorStatusCard } = await import('../components/SeniorStatusCard')

        const { container } = render(<SeniorStatusCard />)
        expect(container).toBeTruthy()
    })

    it('shows inline gates when tasks provided', async () => {
        const { SeniorStatusCard } = await import('../components/SeniorStatusCard')

        const tasks = [
            { id: 1, title: 'Med', period: 'morgen', completed: true }
        ]

        const { container } = render(
            <SeniorStatusCard
                seniorName="Brad"
                tasks={tasks}
                lastCheckIn="kl. 09:00"
                completionRate={100}
            />
        )

        expect(container).toBeTruthy()
        expect(screen.getByText('Brad')).toBeTruthy()
    })

    it('shows symptom indicator when symptomCount > 0', async () => {
        const { SeniorStatusCard } = await import('../components/SeniorStatusCard')

        render(
            <SeniorStatusCard
                seniorName="Brad"
                symptomCount={3}
            />
        )

        expect(screen.getByText(/3 symptomer/)).toBeTruthy()
    })
})

describe('useHelpExchangeMatch Hook', () => {
    it('can be imported without error', async () => {
        const { useHelpExchangeMatch } = await import('../hooks/useHelpExchangeMatch')
        expect(useHelpExchangeMatch).toBeDefined()
    })

    it('returns expected shape with no matches', async () => {
        const { useHelpExchangeMatch } = await import('../hooks/useHelpExchangeMatch')
        const { renderHook } = await import('@testing-library/react')

        const { result } = renderHook(() =>
            useHelpExchangeMatch({
                offers: [],
                requests: [],
                familyStatus: null
            })
        )

        expect(result.current).toHaveProperty('topMatch')
        expect(result.current).toHaveProperty('hasMatches')
        expect(result.current.hasMatches).toBe(false)
    })
})
