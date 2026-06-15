'use client';

import { cn } from '@/lib/utils';

interface WeatherBackgroundProps {
  conditionId: number;
  isDay: boolean;
  className?: string;
}

function getGradient(id: number, isDay: boolean) {
  if (id === 800)
    return isDay
      ? 'from-sky-400 via-blue-400 to-indigo-500'
      : 'from-slate-900 via-indigo-950 to-slate-900';
  if (id >= 200 && id < 300) return 'from-slate-800 via-slate-900 to-slate-950';
  if (id >= 500 && id < 600) return 'from-slate-600 via-slate-700 to-slate-800';
  if (id >= 600 && id < 700) return 'from-blue-100 via-blue-200 to-slate-300';
  return 'from-sky-400 via-blue-500 to-indigo-600';
}

export function WeatherBackground({ conditionId, isDay, className }: WeatherBackgroundProps) {
  return (
    <div
      className={cn('absolute inset-0 bg-linear-to-br', getGradient(conditionId, isDay), className)}
    />
  );
}
