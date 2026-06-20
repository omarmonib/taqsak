'use client';

import { useState, useCallback } from 'react';
import { SavedLocation, TemperatureUnit, Language } from '@/types/weather';
import { fetchCurrentWeather } from '@/lib/api';
import { generateLocationId } from '@/lib/utils';

const MAX_LOCATIONS = 4;
const STORAGE_KEY = 'taqsak_multi_locations';

export function useMultiLocation() {
  const [locations, setLocations] = useState<SavedLocation[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  const persist = (list: SavedLocation[]) => {
    setLocations(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addLocation = useCallback(
    async (
      name: string,
      country: string,
      lat: number,
      lon: number,
      unit: TemperatureUnit = 'metric',
      lang: Language = 'en'
    ) => {
      const id = generateLocationId(lat, lon);
      if (locations.some((l) => l.id === id)) return;
      if (locations.length >= MAX_LOCATIONS) return;

      setLoading(true);
      try {
        const current = await fetchCurrentWeather(lat, lon, unit, lang);
        const newLocation: SavedLocation = {
          id,
          name,
          country,
          lat,
          lon,
          addedAt: Date.now(),
          current,
        };
        persist([...locations, newLocation]);
      } catch {
        const newLocation: SavedLocation = {
          id,
          name,
          country,
          lat,
          lon,
          addedAt: Date.now(),
        };
        persist([...locations, newLocation]);
      } finally {
        setLoading(false);
      }
    },
    [locations]
  );

  const removeLocation = useCallback(
    (id: string) => {
      persist(locations.filter((l) => l.id !== id));
    },
    [locations]
  );

  const refreshAll = useCallback(
    async (unit: TemperatureUnit = 'metric', lang: Language = 'en') => {
      setLoading(true);
      try {
        const updated = await Promise.all(
          locations.map(async (loc) => {
            try {
              const current = await fetchCurrentWeather(loc.lat, loc.lon, unit, lang);
              return { ...loc, current };
            } catch {
              return loc;
            }
          })
        );
        persist(updated);
      } finally {
        setLoading(false);
      }
    },
    [locations]
  );

  const hasLocation = useCallback(
    (lat: number, lon: number) => {
      const id = generateLocationId(lat, lon);
      return locations.some((l) => l.id === id);
    },
    [locations]
  );

  const canAdd = locations.length < MAX_LOCATIONS;

  return {
    locations,
    loading,
    addLocation,
    removeLocation,
    refreshAll,
    hasLocation,
    canAdd,
    count: locations.length,
    max: MAX_LOCATIONS,
  };
}
