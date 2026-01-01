import React, { ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to console in development
        console.error('App Error:', error, errorInfo);

        // Send to Sentry for production monitoring
        Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-8 text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-orange-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-stone-800 mb-2">
                        Ups! Noget gik galt
                    </h1>

                    <p className="text-stone-500 mb-8 max-w-xs">
                        Der opstod en fejl. Prøv at genstarte appen.
                    </p>

                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-teal-700 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Prøv igen
                    </button>

                    {import.meta.env.DEV && this.state.error && (
                        <details className="mt-8 text-left bg-stone-100 p-4 rounded-xl max-w-sm">
                            <summary className="text-sm text-stone-600 cursor-pointer">
                                Tekniske detaljer
                            </summary>
                            <pre className="text-xs text-red-600 mt-2 overflow-auto">
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
