'use client';

import { useState } from 'react';
import { Plus, X, MapPin, Loader2, Search } from 'lucide-react';
import { SavedLocation, Language, TemperatureUnit } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { formatTemp, formatWindSpeed, cn } from '@/lib/utils';
import { searchLocations } from '@/lib/api';

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

interface MultiLocationViewProps {
  locations: SavedLocation[];
  onAdd: (name: string, country: string, lat: number, lon: number) => void;
  onRemove: (id: string) => void;
  onSelect: (lat: number, lon: number) => void;
  loading: boolean;
  canAdd: boolean;
  max: number;
  language: Language;
  unit: TemperatureUnit;
  isRTL: boolean;
}

export function MultiLocationView({
  locations,
  onAdd,
  onRemove,
  onSelect,
  loading,
  canAdd,
  max,
  language,
  unit,
  isRTL,
}: MultiLocationViewProps) {
  const t = translations[language];
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchLocations>>>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await searchLocations(q, language);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleAdd(result: (typeof results)[0]) {
    const displayName =
      language === 'ar' && result.local_names?.ar ? result.local_names.ar : result.name;
    onAdd(displayName, result.country, result.lat, result.lon);
    setShowSearch(false);
    setQuery('');
    setResults([]);
  }

  if (locations.length === 0 && !showSearch) {
    return (
      <div
        className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
        style={{ width: '100%', boxSizing: 'border-box', padding: '20px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginBottom: '16px',
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
            <span style={{ fontSize: '18px' }}>📍</span>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.multiLocation}
            </h2>
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.addLocation}
          </button>
        </div>
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
          {language === 'ar'
            ? 'أضف مواقع لمقارنة الطقس'
            : language === 'fr'
              ? 'Ajoutez des lieux pour comparer'
              : language === 'es'
                ? 'Añade lugares para comparar'
                : 'Add locations to compare weather'}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ width: '100%', boxSizing: 'border-box', padding: '20px' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: isRTL ? 'row-reverse' : 'row',
          marginBottom: '16px',
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
          <span style={{ fontSize: '18px' }}>📍</span>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.multiLocation}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {locations.length}/{max}
          </span>
        </div>
        {canAdd && (
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.addLocation}
          </button>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              style={{ padding: isRTL ? '0 36px 0 12px' : '0 12px 0 36px' }}
              autoFocus
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isRTL ? 'right' : 'left']: '10px',
              }}
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div className="mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
              {results.map((result, i) => {
                const displayName =
                  language === 'ar' && result.local_names?.ar ? result.local_names.ar : result.name;
                return (
                  <button
                    key={i}
                    onClick={() => handleAdd(result)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                    style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {[result.state, result.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Location cards grid */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      )}

      {!loading && locations.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {locations.map((loc) => {
            const icon = loc.current?.weather[0]?.icon ?? '01d';
            const temp = loc.current?.main?.temp;
            const condition = loc.current?.weather[0]?.description;
            const wind = loc.current?.wind?.speed;
            const humidity = loc.current?.main?.humidity;

            return (
              <div
                key={loc.id}
                onClick={() => onSelect(loc.lat, loc.lon)}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  position: 'relative',
                  boxSizing: 'border-box',
                  color: 'white',
                }}
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(loc.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    [isRTL ? 'left' : 'right']: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={12} />
                </button>

                {/* Icon */}
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>
                  {ICON_MAP[icon] ?? '🌡️'}
                </div>

                {/* City name */}
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '2px',
                    textAlign: isRTL ? 'right' : 'left',
                    paddingRight: isRTL ? '0' : '20px',
                    paddingLeft: isRTL ? '20px' : '0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {loc.name}
                </p>
                <p
                  style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}
                >
                  {loc.country}
                </p>

                {/* Temperature */}
                {temp !== undefined && (
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}
                  >
                    {formatTemp(temp, unit)}
                  </p>
                )}

                {/* Condition */}
                {condition && (
                  <p
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.8)',
                      textTransform: 'capitalize',
                      marginBottom: '8px',
                    }}
                  >
                    {condition}
                  </p>
                )}

                {/* Wind & Humidity */}
                {wind !== undefined && humidity !== undefined && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <span>💨 {Math.round(wind * 3.6)} km/h</span>
                    <span>💧 {humidity}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
