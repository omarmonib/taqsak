'use client';

import { Github } from 'lucide-react';
import { Language } from '@/types/weather';

interface FooterProps {
  language: Language;
  isRTL: boolean;
}

export function Footer({ language, isRTL }: FooterProps) {
  const tagline =
    language === 'ar'
      ? 'صُنع بـ ❤️ للناطقين بالعربية والإنجليزية'
      : language === 'fr'
        ? 'Fait avec ❤️ pour les locuteurs multilingues'
        : language === 'es'
          ? 'Hecho con ❤️ para hablantes multilingües'
          : 'Made with ❤️ for multilingual speakers';

  const dataCredit =
    language === 'ar'
      ? 'بيانات الطقس من'
      : language === 'fr'
        ? 'Données météo par'
        : language === 'es'
          ? 'Datos meteorológicos por'
          : 'Weather data by';

  return (
    <footer
      style={{
        width: '100%',
        marginTop: '32px',
        padding: '24px 16px',
        borderTop: '1px solid rgba(148,163,184,0.15)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isRTL ? 'row-reverse' : 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
            }}
          >
            🌤
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Taqsak</span>
          <span className="text-xs text-slate-400 dark:text-slate-600">·</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{tagline}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {dataCredit}{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline"
            >
              OpenWeatherMap
            </a>
            {' & '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline"
            >
              Open-Meteo
            </a>
          </span>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
