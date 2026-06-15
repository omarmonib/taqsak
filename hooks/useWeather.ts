'use client';

import { useState, useCallback } from 'react';
import { CurrentWeather, ForecastResponse, TemperatureUnit, Language } from '@/types/weather';
import { fetchCurrentWeather, fetchForecast } from '@/lib/api';

interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastResponse | null;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: null,
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(
    async (lat: number, lon: number, unit: TemperatureUnit = 'metric', lang: Language = 'en') => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const [current, forecast] = await Promise.all([
          fetchCurrentWeather(lat, lon, unit, lang),
          fetchForecast(lat, lon, unit, lang),
        ]);
        setState({ current, forecast, loading: false, error: null });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState((prev) => ({ ...prev, loading: false, error: message }));
      }
    },
    []
  );

  const clearWeather = useCallback(() => {
    setState({ current: null, forecast: null, loading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchWeather,
    clearWeather,
    clearError,
  };
}
