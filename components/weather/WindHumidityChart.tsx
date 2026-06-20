'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ForecastResponse, Language, TemperatureUnit } from '@/types/weather';
import { translations, formatHour } from '@/lib/i18n';
import { formatWindSpeed, cn } from '@/lib/utils';

interface WindHumidityChartProps {
  forecast: ForecastResponse;
  language: Language;
  unit: TemperatureUnit;
  isRTL: boolean;
}

export function WindHumidityChart({ forecast, language, unit, isRTL }: WindHumidityChartProps) {
  const t = translations[language];
  const timezone = forecast.city.timezone;

  const data = forecast.list.slice(0, 8).map((item) => ({
    time: formatHour(item.dt, timezone, language),
    wind: Math.round(item.wind.speed * 3.6),
    humidity: item.main.humidity,
  }));

  return (
    <div
      className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ width: '100%', boxSizing: 'border-box', padding: '20px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <span style={{ fontSize: '18px' }}>💨</span>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t.windHumidityChart}
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            reversed={isRTL}
          />
          <YAxis
            yAxisId="wind"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
            orientation={isRTL ? 'right' : 'left'}
            width={30}
          />
          <YAxis
            yAxisId="humidity"
            orientation={isRTL ? 'left' : 'right'}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={35}
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
              const numVal = typeof value === 'number' ? value : Number(value);
              if (name === 'wind')
                return [
                  `${numVal} km/h`,
                  language === 'ar'
                    ? 'الرياح'
                    : language === 'fr'
                      ? 'Vent'
                      : language === 'es'
                        ? 'Viento'
                        : 'Wind',
                ];
              return [
                `${numVal}%`,
                language === 'ar'
                  ? 'الرطوبة'
                  : language === 'fr'
                    ? 'Humidité'
                    : language === 'es'
                      ? 'Humedad'
                      : 'Humidity',
              ];
            }}
          />
          <Bar yAxisId="wind" dataKey="wind" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.8} />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#8b5cf6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '12px',
          justifyContent: 'center',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#38bdf8' }}
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">{t.windChart} (km/h)</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{ width: '12px', height: '3px', borderRadius: '2px', background: '#8b5cf6' }}
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">{t.humidityChart} (%)</span>
        </div>
      </div>
    </div>
  );
}
