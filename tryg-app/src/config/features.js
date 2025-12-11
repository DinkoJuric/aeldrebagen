// Feature flags for toggling features on/off
// Set to false to temporarily disable a feature

export const FEATURES = {
    // Layout
    tabbedLayout: true,        // Use tabs instead of scrolling (experimental)

    // Phase 5: Emotional Connection
    weeklyQuestion: true,      // Weekly Question of the Week card
    memoryTriggers: false,      // "Husker du da...?" memories
    helpExchange: true,        // Dignity-preserving help offers/requests

    // Phase 4: Polish
    morningAnimation: true,    // Sun pulse animation in header
    reassuringCopy: true,      // "Alt er vel ✨" message

    // Phase 3: Health Tracking
    painSeverity: true,        // 3-level pain scale after body location

    // Phase 2: Connection
    familyStatusCard: true,    // Show relative's status to senior
    thinkingOfYou: true,       // One-tap ping button

    // Sounds
    completionSounds: true,    // Task completion chimes
    pingSound: true,           // Ping notification sound

    // Demo/Testing
    demoNotification: false,   // Water reminder notification (5s after load)

    // Backend
    useFirebase: true,         // Use Firebase for multi-user sync (false = localStorage demo mode)
};

// Helper to check if feature is enabled
export const isFeatureEnabled = (featureName) => {
    return FEATURES[featureName] ?? true;
};

export default FEATURES;
