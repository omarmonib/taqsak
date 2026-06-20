'use client';

import { useState, useCallback } from 'react';
import { fetchUVIndex } from '@/lib/api';

export function useUVIndex() {
  const [uvi, setUvi] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const value = await fetchUVIndex(lat, lon);
      setUvi(value);
    } catch {
      setUvi(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => setUvi(0), []);

  return { uvi, loading, fetch, clear };
}
