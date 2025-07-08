import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Generating your quiz.." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <div className="absolute inset-0 h-12 w-12 border-4 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 text-lg font-medium animate-pulse">{message}</p>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
};
