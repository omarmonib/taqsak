'use client';

import { Sun, Moon, Locate, Loader2, Thermometer } from 'lucide-react';
import { Language, Theme, TemperatureUnit } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface HeaderProps {
  language: Language;
  theme: Theme;
  unit: TemperatureUnit;
  onToggleTheme: () => void;
  onCycleLanguage: () => void;
  onToggleUnit: () => void;
  onGeolocate: () => void;
  geoLoading: boolean;
  isRTL: boolean;
  languageLabel: string;
  onLogoClick?: () => void;
}

export function Header({
  language,
  theme,
  unit,
  onToggleTheme,
  onCycleLanguage,
  onToggleUnit,
  onGeolocate,
  geoLoading,
  isRTL,
  languageLabel,
  onLogoClick,
}: HeaderProps) {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 12px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <button
            onClick={onLogoClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '16px' }}>🌤</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isRTL ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {t.appName}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight hidden sm:block">
                {t.appTagline}
              </span>
            </div>
          </button>
        </div>

        {/* Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
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
            className="flex items-center h-8 px-2 rounded-xl text-xs font-bold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Thermometer className="w-3 h-3 mr-0.5" />
            {unit === 'metric' ? '°C' : '°F'}
          </button>

          {/* Language Toggle — cycles EN → AR → FR → ES */}
          <button
            onClick={onCycleLanguage}
            aria-label="Toggle language"
            className="flex items-center h-8 px-2.5 rounded-xl text-xs font-bold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {languageLabel}
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
