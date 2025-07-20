'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Environment validation error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-red-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Configuration Error
                </h3>
              </div>
            </div>
            <div className="text-sm text-red-700 mb-4">
              <p className="mb-2">The application could not start due to missing or invalid environment variables.</p>
              {this.state.error && (
                <pre className="bg-red-100 p-3 rounded text-xs overflow-auto whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">To fix this issue:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
                <li>Add the required environment variables:</li>
              </ol>
              <pre className="bg-gray-100 p-3 rounded text-xs mt-2 overflow-auto">
{`NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_api_key`}
              </pre>
              <p className="mt-2">
                <span className="font-medium">Note:</span> The contract address must be a valid Ethereum address (42 characters starting with 0x).
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}