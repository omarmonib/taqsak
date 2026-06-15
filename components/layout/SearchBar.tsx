'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import { SearchResult, Language } from '@/types/weather';
import { searchLocations } from '@/lib/api';
import { debounce, cn } from '@/lib/utils';

interface SearchBarProps {
  onSelect: (result: SearchResult) => void;
  language: Language;
  isRTL: boolean;
}

export function SearchBar({ onSelect, language, isRTL }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<((q: string) => void) | null>(null);

  useEffect(() => {
    searchRef.current = debounce(async (q: string) => {
      if (q.trim().length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const data = await searchLocations(q, language);
        setResults(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [language]);

  useEffect(() => {
    searchRef.current?.(query);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function getDisplayName(result: SearchResult): string {
    if (language === 'ar' && result.local_names?.ar) {
      return result.local_names.ar;
    }
    return result.name;
  }

  function handleSelect(result: SearchResult) {
    const displayName = getDisplayName(result);
    onSelect(result);
    setQuery(`${displayName}, ${result.country}`);
    setOpen(false);
    setResults([]);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function clearQuery() {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  const translations = {
    en: { searchPlaceholder: 'Search city, country or province...' },
    ar: { searchPlaceholder: 'ابحث عن مدينة، دولة أو محافظة...' },
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-slate-400',
            isRTL ? 'right-4' : 'left-4'
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={translations[language].searchPlaceholder}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={cn(
            'w-full h-12 sm:h-14 rounded-2xl border border-slate-200 dark:border-slate-700',
            'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
            'shadow-sm transition-all text-sm font-medium',
            isRTL ? 'pr-11 pl-10' : 'pl-11 pr-10'
          )}
        />

        {query && (
          <button
            onClick={clearQuery}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
              isRTL ? 'left-3' : 'right-3'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
          <ul role="listbox" className="py-2">
            {results.map((result, index) => {
              const displayName = getDisplayName(result);
              const subText = [result.state, result.country].filter(Boolean).join(', ');
              return (
                <li
                  key={`${result.lat}-${result.lon}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={() => handleSelect(result)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm',
                    isRTL && 'flex-row-reverse',
                    index === activeIndex
                      ? 'bg-sky-50 dark:bg-sky-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  )}
                >
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  <div className={cn('flex flex-col min-w-0', isRTL && 'items-end')}>
                    <span className="font-medium text-slate-800 dark:text-slate-100 truncate">
                      {displayName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {subText}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
