import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-slate-800 bg-red-50 h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h1>
          <p className="mb-4 text-slate-600">Please refresh the page. If the issue persists, check the console.</p>
          <div className="bg-white p-4 rounded shadow text-left text-sm overflow-auto max-w-2xl border border-red-200 w-full">
            <p className="font-mono text-red-500 break-all whitespace-pre-wrap">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}