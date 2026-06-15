'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
  });

  const locate = useCallback((onSuccess: (lat: number, lon: number) => void) => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Geolocation is not supported by your browser.' });
      return;
    }

    setState({ loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({ loading: false, error: null });
        onSuccess(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setState({
          loading: false,
          error:
            err.code === 1
              ? 'Location access denied. Please allow location permission.'
              : 'Unable to determine your location.',
        });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, locate };
}
