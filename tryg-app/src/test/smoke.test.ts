// Smoke tests for Firebase configuration
// These tests verify the app can initialize without crashing
import { describe, it, expect } from 'vitest'

describe('Firebase Configuration', () => {
    it('firebase config module exports required objects', async () => {
        // Dynamic import to catch initialization errors
        const firebase = await import('../config/firebase')

        expect(firebase.auth).toBeDefined()
        expect(firebase.db).toBeDefined()
        expect(firebase.storage).toBeDefined()
    })

    it('FEATURES config exports expected flags', async () => {
        const { FEATURES } = await import('../config/features')

        // Firebase flag must exist
        expect(FEATURES).toHaveProperty('useFirebase')
        expect(typeof FEATURES.useFirebase).toBe('boolean')
    })
})

describe('App Entry Points', () => {
    it('AppWithAuth module can be imported', async () => {
        // This catches any top-level import errors
        try {
            const module = await import('../AppWithAuth')
            expect(module.default).toBeDefined()
        } catch (error) {
            console.error('Failed to import AppWithAuth:', error)
            throw error
        }
    }, 20000)

    it('main hooks can be imported without error', async () => {
        // Import all critical hooks - catches missing dependencies
        const [useAuth, useCareCircle, useTasks, useSettings] = await Promise.all([
            import('../hooks/useAuth'),
            import('../hooks/useCareCircle'),
            import('../features/tasks'),
            import('../hooks/useSettings'),
        ])

        expect(useAuth.useAuth).toBeDefined()
        expect(useCareCircle.useCareCircle).toBeDefined()
        expect(useTasks.useTasks).toBeDefined()
        expect(useSettings.useSettings).toBeDefined()
    })
})
