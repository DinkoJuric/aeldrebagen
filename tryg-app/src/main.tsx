import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import AppWithAuth from './AppWithAuth'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// ============================================================================
// CRASH LOOP DETECTION - Self-healing mechanism
// ============================================================================
// If the app crashes 3+ times within 5 minutes, automatically reset state
// to prevent seniors from getting stuck with a "broken" app.

const CRASH_THRESHOLD = 3;
const CRASH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const checkCrashLoop = () => {
    const crashes = parseInt(localStorage.getItem('crash_count') || '0');
    const lastCrash = parseInt(localStorage.getItem('last_crash_time') || '0');
    const now = Date.now();

    // If 3+ crashes within 5 minutes, reset app state
    if (crashes >= CRASH_THRESHOLD && (now - lastCrash) < CRASH_WINDOW_MS) {
        console.warn('🔧 Crash loop detected. Auto-resetting app state to recover...');
        Sentry.captureMessage('Crash loop detected - auto-reset triggered', 'warning');

        // Clear problematic state but preserve auth
        const keysToKeep = ['firebase:authUser']; // Keep auth-related keys
        const authData: Record<string, string> = {};
        keysToKeep.forEach(key => {
            const match = Object.keys(localStorage).find(k => k.includes(key.split(':')[1] || key));
            if (match) {
                const val = localStorage.getItem(match);
                if (val) authData[match] = val;
            }
        });

        localStorage.clear();

        // Restore auth data
        Object.entries(authData).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
        });

        localStorage.setItem('crash_count', '0');
        localStorage.setItem('app_reset_time', now.toString());

        return true; // Indicate reset happened
    }
    return false;
};

const recordCrash = () => {
    const crashes = parseInt(localStorage.getItem('crash_count') || '0');
    localStorage.setItem('crash_count', (crashes + 1).toString());
    localStorage.setItem('last_crash_time', Date.now().toString());
};

// Check for crash loop on startup
const wasReset = checkCrashLoop();
if (wasReset) {
    console.log('✅ App state has been reset. Starting fresh.');
}

// ============================================================================
// SENTRY INITIALIZATION
// ============================================================================

Sentry.init({
    dsn: "https://b2835d041b4b45c69260083398ea6814@o4510541870465024.ingest.de.sentry.io/4510541878919248",
    // Only enable in production
    enabled: import.meta.env.PROD,
    // Set sample rate for performance monitoring (optional, can enable later)
    // tracesSampleRate: 1.0,
});

// ============================================================================
// GLOBAL ERROR HANDLERS
// ============================================================================

window.onerror = (msg, src, line, col, err) => {
    console.error('Global error:', { msg, src, line, col, err });
    recordCrash(); // Track for crash loop detection
    if (err) Sentry.captureException(err);
};

window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    recordCrash(); // Track for crash loop detection
    Sentry.captureException(event.reason);
};

// ============================================================================
// APP RENDER
// ============================================================================

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <AppWithAuth />
        </ErrorBoundary>
    </StrictMode>,
)
