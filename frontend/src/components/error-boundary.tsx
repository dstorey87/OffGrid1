'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
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
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log DOM manipulation errors specifically
    if (error.message?.includes('removeChild') || error.message?.includes('Node')) {
      console.warn('DOM manipulation error caught:', error.message);
      // Don't log to external services for known hydration issues
      return;
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  // Don't show error UI for DOM manipulation errors - just retry
  if (error.message?.includes('removeChild') || error.message?.includes('Node')) {
    React.useEffect(() => {
      const timer = setTimeout(reset, 100);
      return () => clearTimeout(timer);
    }, [reset]);

    return null; // Render nothing while retrying
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-destructive">Something went wrong!</h2>
        <p className="mb-4 text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
