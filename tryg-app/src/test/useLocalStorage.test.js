// Tests for useLocalStorage hook
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('returns initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
        expect(result.current[0]).toBe('initial')
    })

    it('stores value in localStorage when updated', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

        act(() => {
            result.current[1]('new value')
        })

        expect(result.current[0]).toBe('new value')
        expect(JSON.parse(localStorage.getItem('test-key'))).toBe('new value')
    })

    it('retrieves existing value from localStorage', () => {
        localStorage.setItem('existing-key', JSON.stringify('stored value'))

        const { result } = renderHook(() => useLocalStorage('existing-key', 'initial'))

        expect(result.current[0]).toBe('stored value')
    })

    it('handles objects correctly', () => {
        const testObject = { name: 'Birthe', tasks: [1, 2, 3] }
        const { result } = renderHook(() => useLocalStorage('object-key', {}))

        act(() => {
            result.current[1](testObject)
        })

        expect(result.current[0]).toEqual(testObject)
    })

    it('handles arrays correctly', () => {
        const testArray = [{ id: 1, completed: false }, { id: 2, completed: true }]
        const { result } = renderHook(() => useLocalStorage('array-key', []))

        act(() => {
            result.current[1](testArray)
        })

        expect(result.current[0]).toEqual(testArray)
    })
})
