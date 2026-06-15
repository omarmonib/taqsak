'use client';

import { MapPin } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No location selected',
  description = 'Search for a city, country, or province to see the weather.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-6 px-4 text-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center">
          <MapPin className="w-10 h-10 text-sky-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold">
          ?
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{description}</p>
      </div>
    </div>
  );
}
