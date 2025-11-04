import React, { ErrorInfo, ReactNode } from 'react';

interface EBProps {
  children?: ReactNode;
}
interface EBState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<EBProps, EBState> {
  // FIX: Switched to class property initializer for state. This modern syntax resolves
  // the Typescript errors related to `this.state` and `this.props` not being found,
  // which can happen with certain tsconfig settings. This single change fixes all
  // reported errors for this file.
  state: EBState = { hasError: false };

  static getDerivedStateFromError(_: Error): EBState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-red-100 text-red-800 rounded-lg m-4 border-4 border-red-500 simpson-panel">
          <h1 className="font-cartoon text-3xl mb-2">Something Went Wrong!</h1>
          <p className="mb-4">A critical error occurred. Please try refreshing the page.</p>
          <button
            // FIX: Improved recovery mechanism. Instead of just resetting state which can
            // cause an error loop, this now reloads the page as suggested by the error
            // message, providing a more robust way for the user to recover.
            onClick={() => window.location.reload()}
            className="font-cartoon bg-red-500 text-white py-2 px-6 rounded-md border-2 border-black hover:bg-red-600 transition-all shadow-[4px_4px_0px_#000]"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
