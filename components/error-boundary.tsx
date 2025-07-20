'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

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
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center mb-6"
            >
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </motion.div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                  Configuration Error
                </h3>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-red-700 dark:text-red-300 mb-6"
            >
              <p className="mb-3 font-medium">The application could not start due to missing or invalid environment variables.</p>
              {this.state.error && (
                <motion.pre
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-red-100 dark:bg-red-900/30 p-4 rounded-2xl text-xs overflow-auto whitespace-pre-wrap border border-red-200 dark:border-red-800"
                >
                  {this.state.error.message}
                </motion.pre>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              <p className="font-semibold mb-3 text-gray-800 dark:text-gray-200">To fix this issue:</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Create a <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg font-mono text-xs">.env.local</code> file in your project root</li>
                <li>Add the required environment variables:</li>
              </ol>
              <motion.pre
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl text-xs overflow-auto border border-gray-200 dark:border-gray-600 font-mono"
              >
{`NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_api_key`}
              </motion.pre>
              <p className="mt-3 text-xs">
                <span className="font-semibold">Note:</span> The contract address must be a valid Ethereum address (42 characters starting with 0x).
              </p>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Retry
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}