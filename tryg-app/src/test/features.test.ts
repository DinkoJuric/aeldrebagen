// Tests for feature flags
import { describe, it, expect } from 'vitest'
import { FEATURES, isFeatureEnabled } from '../config/features'

describe('Feature Flags', () => {
    it('FEATURES object exists and has expected structure', () => {
        expect(FEATURES).toBeDefined()
        expect(typeof FEATURES).toBe('object')
    })

    it('all feature values are booleans', () => {
        Object.entries(FEATURES).forEach(([key, value]) => {
            expect(typeof value).toBe('boolean')
        })
    })

    it('isFeatureEnabled returns correct value for existing features', () => {
        Object.entries(FEATURES).forEach(([key, value]) => {
            expect(isFeatureEnabled(key as keyof typeof FEATURES)).toBe(value)
        })
    })

    it('isFeatureEnabled returns true for unknown features (safe default)', () => {
        // @ts-ignore - Testing fallback for unknown keys
        expect(isFeatureEnabled('unknownFeature')).toBe(true)
    })

    it('critical features are defined', () => {
        // These features must exist - breaking if removed
        const criticalFeatures = [
            'tabbedLayout',
            'thinkingOfYou',
            'weeklyQuestion',
            'helpExchange',
            'familyStatusCard'
        ]

        criticalFeatures.forEach(feature => {
            expect(FEATURES).toHaveProperty(feature)
        })
    })
})
