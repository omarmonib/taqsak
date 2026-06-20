'use client';

import { useState, useEffect, useCallback } from 'react';

interface RecentSearch {
  name: string;
  country: string;
  lat: number;
  lon: number;
  searchedAt: number;
}

const STORAGE_KEY = 'taqsak_recent_searches';
const MAX_RECENT = 4;

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {
      setRecent([]);
    }
  }, []);

  const addRecent = useCallback((name: string, country: string, lat: number, lon: number) => {
    setRecent((prev) => {
      const filtered = prev.filter(
        (r) => !(Math.abs(r.lat - lat) < 0.01 && Math.abs(r.lon - lon) < 0.01)
      );
      const updated = [{ name, country, lat, lon, searchedAt: Date.now() }, ...filtered].slice(
        0,
        MAX_RECENT
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recent, addRecent };
}
