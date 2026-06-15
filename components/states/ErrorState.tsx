'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to fetch weather data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-6 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
