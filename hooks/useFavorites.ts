'use client';

import { useState, useCallback } from 'react';
import { FavoriteLocation } from '@/types/weather';
import { generateLocationId } from '@/lib/utils';

const STORAGE_KEY = 'taqsak_favorites';

const getInitialFavorites = (): FavoriteLocation[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(getInitialFavorites);

  const persist = (list: FavoriteLocation[]) => {
    setFavorites(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addFavorite = useCallback(
    (location: Omit<FavoriteLocation, 'id' | 'addedAt'>) => {
      const id = generateLocationId(location.lat, location.lon);
      const already = favorites.some((f) => f.id === id);
      if (already) return;
      persist([...favorites, { ...location, id, addedAt: Date.now() }]);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      persist(favorites.filter((f) => f.id !== id));
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (lat: number, lon: number): boolean => {
      const id = generateLocationId(lat, lon);
      return favorites.some((f) => f.id === id);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (location: Omit<FavoriteLocation, 'id' | 'addedAt'>) => {
      const id = generateLocationId(location.lat, location.lon);
      if (favorites.some((f) => f.id === id)) {
        removeFavorite(id);
      } else {
        addFavorite(location);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
