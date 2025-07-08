import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-semibold text-red-800">Oops! Something went wrong</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};