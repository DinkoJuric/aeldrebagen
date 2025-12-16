import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import AppWithAuth from './AppWithAuth.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Initialize Sentry for error tracking
Sentry.init({
  dsn: "https://b2835d041b4b45c69260083398ea6814@o4510541870465024.ingest.de.sentry.io/4510541878919248",
  // Only enable in production
  enabled: import.meta.env.PROD,
  // Set sample rate for performance monitoring (optional, can enable later)
  // tracesSampleRate: 1.0,
});

// Global error handlers for unhandled errors
window.onerror = (msg, src, line, col, err) => {
  console.error('Global error:', { msg, src, line, col, err });
  if (err) Sentry.captureException(err);
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  Sentry.captureException(event.reason);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppWithAuth />
    </ErrorBoundary>
  </StrictMode>,
)
