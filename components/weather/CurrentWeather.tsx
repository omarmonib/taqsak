'use client';

import { MapPin, Star, StarOff } from 'lucide-react';
import { CurrentWeather as CurrentWeatherType, Language, TemperatureUnit } from '@/types/weather';
import { translations, formatTime } from '@/lib/i18n';
import { formatTemp, formatWindSpeed, formatVisibility, formatPressure, cn } from '@/lib/utils';
import { WeatherIcon } from '@/components/weather/WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  language: Language;
  unit: TemperatureUnit;
  isRTL: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CurrentWeather({
  data,
  language,
  unit,
  isRTL,
  isFavorite,
  onToggleFavorite,
}: CurrentWeatherProps) {
  const t = translations[language];
  const condition = data.weather[0];

  const details = [
    { label: t.feelsLike, value: formatTemp(data.main.feels_like, unit) },
    { label: t.humidity, value: `${data.main.humidity}%` },
    { label: t.windSpeed, value: formatWindSpeed(data.wind.speed, unit, isRTL) },
    { label: t.visibility, value: formatVisibility(data.visibility, isRTL) },
    { label: t.pressure, value: formatPressure(data.main.pressure, isRTL) },
    { label: t.sunrise, value: formatTime(data.sys.sunrise, data.timezone, language) },
    { label: t.sunset, value: formatTime(data.sys.sunset, data.timezone, language) },
    { label: t.cloudCover, value: `${data.clouds.all}%` },
  ];

  return (
    <div
      style={{
        borderRadius: '1.5rem',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #38bdf8, #3b82f6, #6366f1)',
        color: 'white',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top section */}
      <div style={{ padding: '20px 16px 16px', boxSizing: 'border-box' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                color: '#bfdbfe',
                fontSize: '12px',
              }}
            >
              <MapPin size={12} />
              <span>{data.sys.country}</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1, margin: 0 }}>
              {data.name}
            </h1>
            <p
              style={{ fontSize: '13px', color: '#bfdbfe', margin: 0, textTransform: 'capitalize' }}
            >
              {condition.description}
            </p>
          </div>
          <button
            onClick={onToggleFavorite}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '12px',
              padding: '8px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {isFavorite ? (
              <Star size={20} fill="#fcd34d" color="#fcd34d" />
            ) : (
              <StarOff size={20} color="#bfdbfe" />
            )}
          </button>
        </div>

        {/* Temperature + Icon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <div>
            <div style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1 }}>
              {Math.round(data.main.temp)}°
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                fontSize: '13px',
                color: '#bfdbfe',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              }}
            >
              <span>
                {t.high} {Math.round(data.main.temp_max)}°
              </span>
              <span>|</span>
              <span>
                {t.low} {Math.round(data.main.temp_min)}°
              </span>
            </div>
          </div>
          <WeatherIcon
            icon={condition.icon}
            description={condition.description}
            className="text-6xl"
          />
        </div>
      </div>

      {/* Details grid */}
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '12px 16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {details.map((detail) => (
            <div
              key={detail.label}
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                alignItems: isRTL ? 'flex-end' : 'flex-start',
                boxSizing: 'border-box',
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: '10px', color: '#bfdbfe', fontWeight: 500 }}>
                {detail.label}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
