'use client';

import { Cloud } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading weather data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-sky-200 dark:border-sky-800 border-t-sky-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cloud className="w-8 h-8 text-sky-500 animate-pulse" />
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
        {message}
      </p>
    </div>
  );
}
