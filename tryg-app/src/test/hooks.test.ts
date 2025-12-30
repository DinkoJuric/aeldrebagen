// P1 Hook Tests - Core functionality verification
// Tests for useMemberStatus, useHelpExchange, useTasks

import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

// Mock Firebase
vi.mock('../config/firebase', () => ({
    db: {},
    auth: { currentUser: { uid: 'test-user' } },
    storage: {}
}))

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn((_query, callback) => {
        // Simulate empty snapshot
        // @ts-ignore
        callback({ docs: [] })
        return vi.fn() // unsubscribe
    }),
    setDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    serverTimestamp: vi.fn(() => new Date()),
    Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })) }
}))

describe('useMemberStatus Hook', () => {
    it('can be imported without error', async () => {
        const { useMemberStatus } = await import('../features/familyPresence')
        expect(useMemberStatus).toBeDefined()
        expect(typeof useMemberStatus).toBe('function')
    })

    it('returns expected shape with empty data', async () => {
        const { useMemberStatus } = await import('../features/familyPresence')

        const { result } = renderHook(() =>
            useMemberStatus('circle123', 'user123', 'TestUser', 'relative')
        )

        // Should return the expected object shape
        expect(result.current).toHaveProperty('memberStatuses')
        expect(result.current).toHaveProperty('myStatus')
        expect(result.current).toHaveProperty('setMyStatus')
        expect(result.current).toHaveProperty('relativeStatuses')
        expect(result.current).toHaveProperty('seniorStatus')
    })

    it('handles null circleId gracefully', async () => {
        const { useMemberStatus } = await import('../features/familyPresence')

        const { result } = renderHook(() =>
            useMemberStatus(null, 'user123', 'TestUser', 'relative')
        )

        expect(result.current.memberStatuses).toEqual([])
        expect(result.current.myStatus).toBe('home')
    })
})

describe('useHelpExchange Hook', () => {
    it('can be imported without error', async () => {
        const { useHelpExchange } = await import('../features/helpExchange')
        expect(useHelpExchange).toBeDefined()
    })

    it('returns expected shape', async () => {
        const { useHelpExchange } = await import('../features/helpExchange')

        const { result } = renderHook(() =>
            useHelpExchange('circle123', 'user123', 'relative', 'TestUser')
        )

        expect(result.current).toHaveProperty('helpOffers')
        expect(result.current).toHaveProperty('helpRequests')
        expect(result.current).toHaveProperty('addOffer')
        expect(result.current).toHaveProperty('addRequest')
        expect(result.current).toHaveProperty('removeOffer')
        expect(result.current).toHaveProperty('removeRequest')
    })

    it('handles null circleId gracefully', async () => {
        const { useHelpExchange } = await import('../features/helpExchange')

        const { result } = renderHook(() =>
            useHelpExchange(null, 'user123', 'relative', 'TestUser')
        )

        expect(result.current.helpOffers).toEqual([])
        expect(result.current.helpRequests).toEqual([])
    })
})

describe('useTasks Hook', () => {
    it('can be imported without error', async () => {
        const { useTasks } = await import('../features/tasks')
        expect(useTasks).toBeDefined()
    })

    it('returns expected shape', async () => {
        const { useTasks } = await import('../features/tasks')

        const { result } = renderHook(() => useTasks('circle123'))

        expect(result.current).toHaveProperty('tasks')
        expect(result.current).toHaveProperty('toggleTask')
        expect(result.current).toHaveProperty('addTask')
        expect(Array.isArray(result.current.tasks)).toBe(true)
    })

    it('falls back to INITIAL_TASKS when no circleId', async () => {
        const { useTasks } = await import('../features/tasks')

        const { result } = renderHook(() => useTasks(null))

        // Should have default tasks
        expect(result.current.tasks.length).toBeGreaterThan(0)
    })
})
