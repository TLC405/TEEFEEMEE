import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-text-primary p-4 text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
            <p className="text-text-secondary mb-6">We've encountered an unexpected error. Please try refreshing the page.</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-accent text-background font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-colors"
            >
                Refresh
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}