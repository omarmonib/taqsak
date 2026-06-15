'use client';

import { useState, useCallback } from 'react';
import { TemperatureUnit } from '@/types/weather';

const STORAGE_KEY = 'taqsak_unit';

export function useUnit() {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => {
    if (typeof window === 'undefined') return 'metric';
    return (localStorage.getItem(STORAGE_KEY) as TemperatureUnit) ?? 'metric';
  });

  const setUnit = useCallback((u: TemperatureUnit) => {
    setUnitState(u);
    localStorage.setItem(STORAGE_KEY, u);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  }, [unit, setUnit]);

  return { unit, setUnit, toggleUnit };
}
