'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ForecastResponse, Language, TemperatureUnit } from '@/types/weather';
import { translations, formatHour } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface TemperatureChartProps {
  forecast: ForecastResponse;
  language: Language;
  unit: TemperatureUnit;
  isRTL: boolean;
}

export function TemperatureChart({ forecast, language, unit, isRTL }: TemperatureChartProps) {
  const t = translations[language];
  const timezone = forecast.city.timezone;

  const data = forecast.list.slice(0, 8).map((item) => ({
    time: formatHour(item.dt, timezone, language),
    temp: Math.round(item.main.temp),
    feels: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
  }));

  const unitLabel = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-5">
      <div className={cn('flex items-center gap-2 mb-6', isRTL && 'flex-row-reverse')}>
        <span className="text-lg">📊</span>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {language === 'ar' ? 'مخطط درجات الحرارة' : 'Temperature Trend'}
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            reversed={isRTL}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
            orientation={isRTL ? 'right' : 'left'}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '12px',
              color: '#f1f5f9',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              const numVal = Number(value) || 0;
              const label =
                name === 'temp'
                  ? language === 'ar'
                    ? 'الحرارة'
                    : 'Temperature'
                  : language === 'ar'
                    ? 'الإحساس'
                    : 'Feels Like';
              return [`${numVal}${unitLabel}`, label] as [string, string];
            }}
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#tempGradient)"
            dot={{ fill: '#0ea5e9', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#0ea5e9' }}
          />
          <Area
            type="monotone"
            dataKey="feels"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="url(#feelsGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div
        className={cn('flex items-center gap-4 mt-3 justify-center', isRTL && 'flex-row-reverse')}
      >
        <div className={cn('flex items-center gap-1.5', isRTL && 'flex-row-reverse')}>
          <div className="w-3 h-0.5 bg-sky-500 rounded" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'درجة الحرارة' : 'Temperature'}
          </span>
        </div>
        <div className={cn('flex items-center gap-1.5', isRTL && 'flex-row-reverse')}>
          <div className="w-3 h-0.5 bg-violet-500 rounded border-dashed" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'الإحساس الحراري' : 'Feels Like'}
          </span>
        </div>
      </div>
    </div>
  );
}
