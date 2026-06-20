'use client';

import { Search, Cloud, MapPin, Sparkles } from 'lucide-react';
import { Language } from '@/types/weather';
import { translations } from '@/lib/i18n';

interface HeroProps {
  language: Language;
  isRTL: boolean;
  onQuickSelect: (lat: number, lon: number, name: string) => void;
}

const POPULAR_CITIES = [
  {
    name: 'Cairo',
    nameAr: 'القاهرة',
    nameFr: 'Le Caire',
    nameEs: 'El Cairo',
    lat: 30.0444,
    lon: 31.2357,
    country: 'EG',
  },
  {
    name: 'Dubai',
    nameAr: 'دبي',
    nameFr: 'Dubaï',
    nameEs: 'Dubái',
    lat: 25.2048,
    lon: 55.2708,
    country: 'AE',
  },
  {
    name: 'London',
    nameAr: 'لندن',
    nameFr: 'Londres',
    nameEs: 'Londres',
    lat: 51.5072,
    lon: -0.1276,
    country: 'GB',
  },
  {
    name: 'Paris',
    nameAr: 'باريس',
    nameFr: 'Paris',
    nameEs: 'París',
    lat: 48.8566,
    lon: 2.3522,
    country: 'FR',
  },
  {
    name: 'New York',
    nameAr: 'نيويورك',
    nameFr: 'New York',
    nameEs: 'Nueva York',
    lat: 40.7128,
    lon: -74.006,
    country: 'US',
  },
  {
    name: 'Riyadh',
    nameAr: 'الرياض',
    nameFr: 'Riyad',
    nameEs: 'Riad',
    lat: 24.7136,
    lon: 46.6753,
    country: 'SA',
  },
];

export function Hero({ language, isRTL, onQuickSelect }: HeroProps) {
  const t = translations[language];

  function getCityName(city: (typeof POPULAR_CITIES)[0]) {
    if (language === 'ar') return city.nameAr;
    if (language === 'fr') return city.nameFr;
    if (language === 'es') return city.nameEs;
    return city.name;
  }

  const heroTitle =
    language === 'ar'
      ? 'اعرف طقسك، في أي مكان'
      : language === 'fr'
        ? 'Connaissez votre météo, partout'
        : language === 'es'
          ? 'Conoce tu clima, en cualquier lugar'
          : 'Know your weather, anywhere';

  const heroSubtitle =
    language === 'ar'
      ? 'بيانات طقس دقيقة في الوقت الفعلي، توقعات لمدة 7 أيام، وخرائط تفاعلية — كل ذلك بلغتك.'
      : language === 'fr'
        ? 'Données météo précises en temps réel, prévisions sur 7 jours et cartes interactives — tout dans votre langue.'
        : language === 'es'
          ? 'Datos meteorológicos precisos en tiempo real, pronósticos de 7 días y mapas interactivos, todo en tu idioma.'
          : 'Accurate real-time weather, 7-day forecasts, and interactive maps — all in your language.';

  const popularLabel =
    language === 'ar'
      ? 'مدن شائعة'
      : language === 'fr'
        ? 'Villes populaires'
        : language === 'es'
          ? 'Ciudades populares'
          : 'Popular cities';

  const features = [
    {
      icon: '🌡️',
      label:
        language === 'ar'
          ? 'طقس حي'
          : language === 'fr'
            ? 'Météo en direct'
            : language === 'es'
              ? 'Clima en vivo'
              : 'Live weather',
    },
    {
      icon: '📅',
      label:
        language === 'ar'
          ? 'توقعات 7 أيام'
          : language === 'fr'
            ? '7 jours'
            : language === 'es'
              ? '7 días'
              : '7-day forecast',
    },
    {
      icon: '🗺️',
      label:
        language === 'ar'
          ? 'خرائط تفاعلية'
          : language === 'fr'
            ? 'Cartes'
            : language === 'es'
              ? 'Mapas'
              : 'Interactive maps',
    },
    {
      icon: '🌍',
      label:
        language === 'ar'
          ? '4 لغات'
          : language === 'fr'
            ? '4 langues'
            : language === 'es'
              ? '4 idiomas'
              : '4 languages',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Hero card */}
      <div
        style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0c4a6e, #0369a1, #0ea5e9, #6366f1)',
          padding: '40px 24px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {/* Decorative floating icons */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            fontSize: '28px',
            opacity: 0.25,
          }}
        >
          ☀️
        </div>
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '30px',
            fontSize: '22px',
            opacity: 0.2,
          }}
        >
          ☁️
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '40px',
            fontSize: '20px',
            opacity: 0.2,
          }}
        >
          🌧️
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '60px',
            fontSize: '24px',
            opacity: 0.2,
          }}
        >
          ❄️
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '999px',
              padding: '6px 14px',
              marginBottom: '16px',
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
          >
            <Sparkles size={12} color="#fde68a" />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}>
              {language === 'ar'
                ? 'طقسك — طقسك الموثوق'
                : language === 'fr'
                  ? 'Taqsak — Météo de confiance'
                  : language === 'es'
                    ? 'Taqsak — Clima de confianza'
                    : 'Taqsak — Trusted weather'}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 5vw, 40px)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.2,
              margin: '0 0 12px 0',
            }}
          >
            {heroTitle}
          </h1>

          <p
            style={{
              fontSize: 'clamp(13px, 2vw, 16px)',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '560px',
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            {heroSubtitle}
          </p>

          {/* Feature chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {features.map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: '999px',
                  padding: '6px 12px',
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                }}
              >
                <span style={{ fontSize: '14px' }}>{f.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular cities quick access */}
      <div
        className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
        style={{ padding: '20px', boxSizing: 'border-box' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <MapPin size={16} className="text-sky-500" />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {popularLabel}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px',
          }}
        >
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => onQuickSelect(city.lat, city.lon, getCityName(city))}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isRTL ? 'flex-end' : 'flex-start',
                gap: '2px',
                padding: '12px 14px',
                borderRadius: '14px',
                border: '1px solid transparent',
                cursor: 'pointer',
                textAlign: isRTL ? 'right' : 'left',
              }}
              className="bg-slate-50 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-200 dark:hover:border-sky-700 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {getCityName(city)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{city.country}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
