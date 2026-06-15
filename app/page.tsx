'use client';

import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SearchResult, TemperatureUnit } from '@/types/weather';
import { useWeather } from '@/hooks/useWeather';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import { useUnit } from '@/hooks/useUnit';
import { useGeolocation } from '@/hooks/useGeolocation';
import { isDay } from '@/lib/utils';

import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/layout/SearchBar';
import { FavoriteLocations } from '@/components/layout/FavoriteLocations';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { TemperatureChart } from '@/components/weather/TemperatureChart';
import { WeatherBackground } from '@/components/weather/WeatherBackground';
import { LoadingState } from '@/components/states/LoadingState';
import { ErrorState } from '@/components/states/ErrorState';
import { EmptyState } from '@/components/states/EmptyState';

const WeatherMap = dynamic(
  () => import('@/components/weather/WeatherMap').then((m) => m.WeatherMap),
  { ssr: false }
);

export default function HomePage() {
  const { language, toggleLanguage, isRTL, t, mounted: langMounted } = useLanguage();
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();
  const { unit, toggleUnit } = useUnit();
  const { current, forecast, loading, error, fetchWeather, clearError } = useWeather();
  const { favorites, toggleFavorite, removeFavorite, isFavorite } = useFavorites();
  const { loading: geoLoading, locate } = useGeolocation();
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const loadWeather = useCallback(
    (lat: number, lon: number) => {
      setActiveCoords({ lat, lon });
      fetchWeather(lat, lon, unit, language);
    },
    [fetchWeather, unit, language]
  );

  const handleSearch = useCallback(
    (result: SearchResult) => loadWeather(result.lat, result.lon),
    [loadWeather]
  );

  const handleFavoriteSelect = useCallback(
    (lat: number, lon: number) => loadWeather(lat, lon),
    [loadWeather]
  );

  const handleGeolocate = useCallback(() => {
    locate((lat, lon) => loadWeather(lat, lon));
  }, [locate, loadWeather]);

  const handleToggleFavorite = useCallback(() => {
    if (!current) return;
    toggleFavorite({
      name: current.name,
      country: current.sys.country,
      lat: current.coord.lat,
      lon: current.coord.lon,
    });
  }, [current, toggleFavorite]);

  const handleRetry = useCallback(() => {
    clearError();
    if (activeCoords) loadWeather(activeCoords.lat, activeCoords.lon);
  }, [activeCoords, clearError, loadWeather]);

  const handleToggleUnit = useCallback(() => {
    toggleUnit();
    if (activeCoords) {
      const newUnit: TemperatureUnit = unit === 'metric' ? 'imperial' : 'metric';
      fetchWeather(activeCoords.lat, activeCoords.lon, newUnit, language);
    }
  }, [toggleUnit, unit, activeCoords, fetchWeather, language]);

  const dayTime = current ? isDay(current.sys.sunrise, current.sys.sunset, current.dt) : true;

  if (!langMounted || !themeMounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900" />;
  }

  const favoritesPanel = (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-4">
      <FavoriteLocations
        favorites={favorites}
        onSelect={handleFavoriteSelect}
        onRemove={removeFavorite}
        language={language}
        isRTL={isRTL}
        activeLat={activeCoords?.lat}
        activeLon={activeCoords?.lon}
      />
    </div>
  );

  const weatherContent = (
    <>
      {loading && <LoadingState message={t('loading')} />}

      {!loading && error && (
        <ErrorState
          title={t('errorTitle')}
          message={t('errorDesc')}
          onRetry={handleRetry}
          retryLabel={t('retry')}
        />
      )}

      {!loading && !error && !current && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <EmptyState title={t('emptyTitle')} description={t('emptyDesc')} />
        </div>
      )}

      {!loading && !error && current && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden' }}>
            <WeatherBackground
              conditionId={current.weather[0].id}
              isDay={dayTime}
              className="rounded-3xl"
            />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <CurrentWeather
                data={current}
                language={language}
                unit={unit}
                isRTL={isRTL}
                isFavorite={isFavorite(current.coord.lat, current.coord.lon)}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>

          {forecast && (
            <>
              <TemperatureChart forecast={forecast} language={language} unit={unit} isRTL={isRTL} />
              <HourlyForecast forecast={forecast} language={language} unit={unit} isRTL={isRTL} />
              <DailyForecast forecast={forecast} language={language} unit={unit} isRTL={isRTL} />
              <WeatherMap
                lat={current.coord.lat}
                lon={current.coord.lon}
                language={language}
                isRTL={isRTL}
              />
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header
        language={language}
        theme={theme}
        unit={unit}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
        onToggleUnit={handleToggleUnit}
        onGeolocate={handleGeolocate}
        geoLoading={geoLoading}
        isRTL={isRTL}
      />

      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: isMobile ? '16px 12px' : '32px 24px',
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: isMobile ? '16px' : '32px' }}>
          <SearchBar onSelect={handleSearch} language={language} isRTL={isRTL} />
        </div>

        {isMobile ? (
          /* Mobile layout */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weatherContent}
            {favoritesPanel}
          </div>
        ) : (
          /* Desktop layout */
          <div
            style={{
              display: 'flex',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: '96px' }}>
              {favoritesPanel}
            </aside>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {weatherContent}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
