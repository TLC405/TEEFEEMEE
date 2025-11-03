import React, { ErrorInfo, ReactNode } from 'react';

interface EBProps {
  children?: ReactNode;
}
interface EBState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<EBProps, EBState> {
  // FIX: Switched from a class property to a constructor for state initialization.
  // This resolves type errors where `this.setState` and `this.props` were not
  // being correctly recognized on the component instance.
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false };
  }

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
            onClick={() => this.setState({ hasError: false })}
            className="font-cartoon bg-red-500 text-white py-2 px-6 rounded-md border-2 border-black hover:bg-red-600 transition-all shadow-[4px_4px_0px_#000]"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
