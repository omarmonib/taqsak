'use client';

import { Sun, Thermometer } from 'lucide-react';
import { Language, TemperatureUnit } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { getUVCategory, calculateHeatIndex } from '@/lib/api';
import { formatTemp } from '@/lib/utils';

interface UVIndexCardProps {
  uvi: number;
  temp: number;
  humidity: number;
  language: Language;
  unit: TemperatureUnit;
  isRTL: boolean;
}

export function UVIndexCard({ uvi, temp, humidity, language, unit, isRTL }: UVIndexCardProps) {
  const t = translations[language];
  const uvCategory = getUVCategory(uvi, language);
  const heatIndex = calculateHeatIndex(temp, humidity);
  const uvPercent = Math.min((uvi / 11) * 100, 100);

  const uvGradient = 'linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #9333ea)';

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
        <span style={{ fontSize: '18px' }}>☀️</span>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t.uvIndex} & {t.heatIndex}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* UV Index */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '16px',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Sun size={16} color="#d97706" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>{t.uvIndex}</span>
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              color: uvCategory.color,
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {Math.round(uvi)}
          </div>
          <div
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '999px',
              background: uvCategory.color,
              color: 'white',
              fontSize: '11px',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            {uvCategory.label}
          </div>

          {/* UV bar */}
          <div
            style={{
              height: '6px',
              borderRadius: '999px',
              background: uvGradient,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${uvPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'white',
                border: `3px solid ${uvCategory.color}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '9px', color: '#92400e' }}>0</span>
            <span style={{ fontSize: '9px', color: '#92400e' }}>11+</span>
          </div>
        </div>

        {/* Heat Index */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            borderRadius: '16px',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Thermometer size={16} color="#dc2626" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b' }}>
              {t.heatIndex}
            </span>
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#dc2626',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {formatTemp(heatIndex, unit)}
          </div>
          <div style={{ fontSize: '11px', color: '#991b1b', marginBottom: '12px' }}>
            {language === 'ar'
              ? 'الحرارة المحسوسة'
              : language === 'fr'
                ? 'Chaleur ressentie'
                : language === 'es'
                  ? 'Calor percibido'
                  : 'Perceived heat'}
          </div>
          <div
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: 'rgba(220,38,38,0.1)',
              fontSize: '10px',
              color: '#991b1b',
              lineHeight: 1.4,
            }}
          >
            {language === 'ar'
              ? `الرطوبة ${humidity}% تزيد من الإحساس بالحرارة`
              : language === 'fr'
                ? `Humidité ${humidity}% amplifie la chaleur`
                : language === 'es'
                  ? `Humedad ${humidity}% amplifica el calor`
                  : `${humidity}% humidity makes it feel hotter`}
          </div>
        </div>
      </div>
    </div>
  );
}
