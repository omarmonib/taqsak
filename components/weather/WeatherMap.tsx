'use client';

import { Language } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { MapPin, Navigation } from 'lucide-react';

interface WeatherMapProps {
  lat: number;
  lon: number;
  language: Language;
  isRTL: boolean;
}

export function WeatherMap({ lat, lon, language, isRTL }: WeatherMapProps) {
  const t = translations[language];

  return (
    <div
      className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}
    >
      <div style={{ padding: '16px', boxSizing: 'border-box' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '18px' }}>🗺️</span>
          <h2
            style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}
            className="text-slate-700 dark:text-slate-300"
          >
            {t.map}
          </h2>
        </div>

        {/* Location display */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a, #1e3a5f, #0f172a)',
            borderRadius: '16px',
            padding: '32px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid lines decoration */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              backgroundImage:
                'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Ping animation */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(56,189,248,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(56,189,248,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MapPin size={20} color="#38bdf8" fill="#38bdf8" />
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                marginBottom: '8px',
              }}
            >
              <Navigation size={14} color="#94a3b8" />
              <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
              </span>
            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>
                  {language === 'ar' ? 'خط العرض' : 'Latitude'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8' }}>
                  {lat.toFixed(2)}°
                </div>
              </div>
              <div style={{ width: '1px', background: '#1e3a5f' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>
                  {language === 'ar' ? 'خط الطول' : 'Longitude'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#6366f1' }}>
                  {lon.toFixed(2)}°
                </div>
              </div>
            </div>
          </div>

          {/* Open in maps button */}

          <a
            href={`https://www.google.com/maps?q=${lat},${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              zIndex: 1,
              padding: '8px 20px',
              borderRadius: '12px',
              background: 'rgba(56,189,248,0.15)',
              border: '1px solid rgba(56,189,248,0.3)',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MapPin size={12} />

            {language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
          </a>
        </div>
      </div>
    </div>
  );
}
