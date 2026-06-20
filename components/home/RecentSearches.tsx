'use client';

import { Clock, MapPin } from 'lucide-react';
import { Language } from '@/types/weather';

interface RecentSearchItem {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface RecentSearchesProps {
  recent: RecentSearchItem[];
  language: Language;
  isRTL: boolean;
  onSelect: (lat: number, lon: number) => void;
}

export function RecentSearches({ recent, language, isRTL, onSelect }: RecentSearchesProps) {
  if (recent.length === 0) return null;

  const label =
    language === 'ar'
      ? 'البحث الأخير'
      : language === 'fr'
        ? 'Recherches récentes'
        : language === 'es'
          ? 'Búsquedas recientes'
          : 'Recent searches';

  return (
    <div
      className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ padding: '16px 20px', boxSizing: 'border-box' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        <Clock size={14} className="text-slate-400" />
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</h2>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
        className="scrollbar-hide"
      >
        {recent.map((item, i) => (
          <button
            key={`${item.lat}-${item.lon}-${i}`}
            onClick={() => onSelect(item.lat, item.lon)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer',
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
            className="bg-slate-50 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
          >
            <MapPin size={12} className="text-sky-500 shrink-0" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {item.name}
            </span>
            <span className="text-xs text-slate-400">{item.country}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
