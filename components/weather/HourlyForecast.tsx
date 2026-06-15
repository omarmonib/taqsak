'use client';

import { ForecastResponse, Language, TemperatureUnit } from '@/types/weather';
import { translations, formatHour } from '@/lib/i18n';
import { formatTemp, cn } from '@/lib/utils';
import { getWeatherIconUrl } from '@/lib/api';

interface HourlyForecastProps {
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

export function HourlyForecast({ forecast, language, unit, isRTL }: HourlyForecastProps) {
  const t = translations[language];
  const hourly = forecast.list.slice(0, 8);
  const timezone = forecast.city.timezone;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className={cn('px-5 pt-5 pb-3 flex items-center gap-2', isRTL && 'flex-row-reverse')}>
        <span className="text-lg">🕐</span>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t.hourlyForecast}
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div
          className={cn('flex gap-2 px-5 pb-5', isRTL && 'flex-row-reverse')}
          style={{ minWidth: 'max-content' }}
        >
          {hourly.map((item, index) => {
            const isNow = index === 0;
            const iconUrl = getWeatherIconUrl(item.weather[0].icon, '2x');
            const pop = Math.round(item.pop * 100);

            return (
              <div
                key={item.dt}
                className={cn(
                  'flex flex-col items-center gap-2 px-4 py-3 rounded-2xl min-w-18 transition-colors',
                  isNow
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-200 dark:shadow-sky-900/30'
                    : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-semibold',
                    isNow ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {isNow ? t.now : formatHour(item.dt, timezone, language)}
                </span>

                <div className="relative w-10 h-10">
                  <span className="text-3xl" role="img" aria-label={item.weather[0].description}>
                    {ICON_MAP[item.weather[0].icon] ?? '🌡️'}
                  </span>
                </div>

                <span className="text-sm font-bold">{formatTemp(item.main.temp, unit)}</span>

                {pop > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      isNow ? 'text-blue-100' : 'text-sky-500 dark:text-sky-400'
                    )}
                  >
                    💧 {pop}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
