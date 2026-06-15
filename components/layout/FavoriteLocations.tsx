'use client';

import { MapPin, Trash2, Star } from 'lucide-react';
import { FavoriteLocation, Language } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface FavoriteLocationsProps {
  favorites: FavoriteLocation[];
  onSelect: (lat: number, lon: number, name: string) => void;
  onRemove: (id: string) => void;
  language: Language;
  isRTL: boolean;
  activeLat?: number;
  activeLon?: number;
}

export function FavoriteLocations({
  favorites,
  onSelect,
  onRemove,
  language,
  isRTL,
  activeLat,
  activeLon,
}: FavoriteLocationsProps) {
  const t = translations[language];

  return (
    <div className="w-full">
      <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.favorites}</h2>
      </div>

      {favorites.length === 0 ? (
        <div
          className={cn(
            'rounded-2xl border border-dashed border-slate-200 dark:border-slate-700',
            'bg-slate-50 dark:bg-slate-800/50 px-4 py-6 text-center'
          )}
        >
          <Star className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.noFavorites}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.noFavoritesDesc}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {favorites.map((fav) => {
            const isActive =
              activeLat !== undefined &&
              activeLon !== undefined &&
              Math.abs(fav.lat - activeLat) < 0.01 &&
              Math.abs(fav.lon - activeLon) < 0.01;

            return (
              <li
                key={fav.id}
                className={cn(
                  'group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all min-w-0',
                  isRTL && 'flex-row-reverse',
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-700'
                )}
                onClick={() => onSelect(fav.lat, fav.lon, fav.name)}
              >
                <MapPin
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    isActive ? 'text-sky-500' : 'text-slate-400'
                  )}
                />
                <div className={cn('flex-1 min-w-0 overflow-hidden', isRTL && 'text-right')}>
                  <p className="text-sm font-medium truncate text-slate-700 dark:text-slate-300">
                    {language === 'ar' && fav.nameAr ? fav.nameAr : fav.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{fav.country}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(fav.id);
                  }}
                  className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
