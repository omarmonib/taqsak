'use client';

import { ForecastResponse, Language, TemperatureUnit } from '@/types/weather';
import { translations, getDayName } from '@/lib/i18n';
import { groupForecastByDay, cn } from '@/lib/utils';

interface DailyForecastProps {
  forecast: ForecastResponse;
  language: Language;
  unit: TemperatureUnit;
  isRTL: boolean;
}

const ICON_MAP: Record<string, string> = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '⛅',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};

export function DailyForecast({ forecast, language, unit, isRTL }: DailyForecastProps) {
  const t = translations[language];
  const daily = groupForecastByDay(forecast);

  const allTemps = daily.flatMap((d) => [d.tempMin, d.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className={cn('px-4 pt-4 pb-2 flex items-center gap-2', isRTL && 'flex-row-reverse')}>
        <span className="text-lg">📅</span>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t.dailyForecast}
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700/50 px-2 pb-3">
        {daily.map((day, index) => {
          const isToday = index === 0;
          const pop = day.pop;
          const minOffset = ((day.tempMin - globalMin) / range) * 100;
          const barWidth = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div
              key={day.date}
              className={cn(
                'flex items-center gap-2 px-2 py-3 rounded-2xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30',
                isRTL && 'flex-row-reverse'
              )}
            >
              {/* Day name */}
              <div className={cn('w-12 shrink-0', isRTL && 'text-right')}>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    isToday ? 'text-sky-500' : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  {isToday ? t.today : getDayName(language, day.date)}
                </span>
              </div>

              {/* Icon + Pop */}
              <div className="flex items-center gap-1 w-10 shrink-0">
                <span className="text-xl">{ICON_MAP[day.weather.icon] ?? '🌡️'}</span>
                {pop > 0 && <span className="text-[9px] font-medium text-sky-500">{pop}%</span>}
              </div>

              {/* Temp range bar */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium text-slate-400 w-7 text-right shrink-0">
                  {Math.round(day.tempMin)}°
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-linear-to-r from-sky-400 to-orange-400"
                    style={{ left: `${minOffset}%`, width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 w-7 shrink-0">
                  {Math.round(day.tempMax)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
