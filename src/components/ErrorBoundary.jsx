import React from 'react';
import { BRAND_COLORS } from '../utils/theme';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service here
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: BRAND_COLORS.light }}>
                    <h1 className="text-4xl font-bold mb-4" style={{ color: BRAND_COLORS.dark }}>
                        Something went wrong.
                    </h1>
                    <p className="text-lg text-brand-ink-body mb-8 max-w-md">
                        The page encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-lg text-white font-bold transition-transform active:scale-95"
                        style={{ backgroundColor: BRAND_COLORS.orange }}
                    >
                        Refresh Page
                    </button>

                    {/* Optional: Show technical error details for development */}
                    <details className="mt-8 text-left p-4 bg-gray-200 rounded text-xs font-mono text-red-800 max-w-2xl overflow-auto w-full">
                        <summary className="cursor-pointer font-bold mb-2">Technical Details</summary>
                        {this.state.error && this.state.error.toString()}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
