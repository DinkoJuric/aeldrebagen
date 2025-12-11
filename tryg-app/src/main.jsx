import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TrygApp from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Global error handlers for unhandled errors
window.onerror = (msg, src, line, col, err) => {
  console.error('Global error:', { msg, src, line, col, err });
  // TODO: Send to Sentry in production
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // TODO: Send to Sentry in production
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <TrygApp />
    </ErrorBoundary>
  </StrictMode>,
)

