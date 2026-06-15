'use client';

import { Sun, Moon, Globe, Locate, Loader2, Thermometer } from 'lucide-react';
import { Language, Theme, TemperatureUnit } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface HeaderProps {
  language: Language;
  theme: Theme;
  unit: TemperatureUnit;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onToggleUnit: () => void;
  onGeolocate: () => void;
  geoLoading: boolean;
  isRTL: boolean;
}

export function Header({
  language,
  theme,
  unit,
  onToggleTheme,
  onToggleLanguage,
  onToggleUnit,
  onGeolocate,
  geoLoading,
  isRTL,
}: HeaderProps) {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className={cn('flex items-center gap-2 shrink-0', isRTL && 'flex-row-reverse')}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-base sm:text-lg">🌤</span>
          </div>
          <div className={cn('flex-col hidden sm:flex', isRTL && 'items-end')}>
            <span className="text-base font-bold text-slate-800 dark:text-white leading-tight">
              {t.appName}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              {t.appTagline}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className={cn('flex items-center gap-1 sm:gap-2', isRTL && 'flex-row-reverse')}>
          {/* Geolocate */}
          <button
            onClick={onGeolocate}
            disabled={geoLoading}
            aria-label="Detect my location"
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
              'hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-500',
              geoLoading && 'opacity-60 cursor-not-allowed'
            )}
          >
            {geoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Locate className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Unit Toggle */}
          <button
            onClick={onToggleUnit}
            aria-label="Toggle temperature unit"
            className="flex items-center h-8 px-2 rounded-xl text-xs font-bold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Thermometer className="w-3 h-3 mr-0.5" />
            {unit === 'metric' ? '°C' : '°F'}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            aria-label="Toggle language"
            className="flex items-center gap-1 h-8 px-2 rounded-xl text-xs font-semibold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Globe className="w-3 h-3 shrink-0" />
            <span>{language === 'en' ? 'ع' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
