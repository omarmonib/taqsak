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
import { useUVIndex } from '@/hooks/useUVIndex';
import { useMultiLocation } from '@/hooks/useMultiLocation';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { isDay } from '@/lib/utils';

import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/layout/SearchBar';
import { FavoriteLocations } from '@/components/layout/FavoriteLocations';
import { Footer } from '@/components/layout/Footer';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { TemperatureChart } from '@/components/weather/TemperatureChart';
import { WindHumidityChart } from '@/components/weather/WindHumidityChart';
import { UVIndexCard } from '@/components/weather/UVIndexCard';
import { WeatherBackground } from '@/components/weather/WeatherBackground';
import { MultiLocationView } from '@/components/weather/MultiLocationView';
import { Hero } from '@/components/home/Hero';
import { RecentSearches } from '@/components/home/RecentSearches';
import { LoadingState } from '@/components/states/LoadingState';
import { ErrorState } from '@/components/states/ErrorState';

const InteractiveMap = dynamic(
  () => import('@/components/weather/InteractiveMap').then((m) => m.InteractiveMap),
  { ssr: false }
);

export default function HomePage() {
  const { language, cycleLanguage, isRTL, t, mounted: langMounted, languageLabel } = useLanguage();
  const { theme, toggleTheme, mounted: themeMounted } = useTheme();
  const { unit, toggleUnit } = useUnit();
  const { current, forecast, loading, error, fetchWeather, clearError, clearWeather } =
    useWeather();
  const { favorites, toggleFavorite, removeFavorite, isFavorite } = useFavorites();
  const { loading: geoLoading, locate } = useGeolocation();
  const { uvi, fetch: fetchUVIndex } = useUVIndex();
  const { recent, addRecent } = useRecentSearches();
  const {
    locations: multiLocations,
    addLocation,
    removeLocation: removeMultiLocation,
    loading: multiLoading,
    canAdd,
    max: maxLocations,
  } = useMultiLocation();

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
      fetchUVIndex(lat, lon);
    },
    [fetchWeather, fetchUVIndex, unit, language]
  );

  const handleClear = useCallback(() => {
    setActiveCoords(null);
    clearError();
  }, [clearError]);

  const handleSearch = useCallback(
    (result: SearchResult) => {
      const displayName =
        language === 'ar' && result.local_names?.ar ? result.local_names.ar : result.name;
      addRecent(displayName, result.country, result.lat, result.lon);
      loadWeather(result.lat, result.lon);
    },
    [loadWeather, addRecent, language]
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
      fetchUVIndex(activeCoords.lat, activeCoords.lon);
    }
  }, [toggleUnit, unit, activeCoords, fetchWeather, fetchUVIndex, language]);

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <RecentSearches
            recent={recent}
            language={language}
            isRTL={isRTL}
            onSelect={(lat, lon) => loadWeather(lat, lon)}
          />
          <Hero
            language={language}
            isRTL={isRTL}
            onQuickSelect={(lat, lon) => loadWeather(lat, lon)}
          />
        </div>
      )}

      {!loading && !error && current && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Current weather */}
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

          {/* UV Index & Heat Index */}
          <UVIndexCard
            uvi={uvi}
            temp={current.main.temp}
            humidity={current.main.humidity}
            language={language}
            unit={unit}
            isRTL={isRTL}
          />

          {forecast && (
            <>
              <TemperatureChart forecast={forecast} language={language} unit={unit} isRTL={isRTL} />
              <WindHumidityChart
                forecast={forecast}
                language={language}
                unit={unit}
                isRTL={isRTL}
              />
              <HourlyForecast forecast={forecast} language={language} unit={unit} isRTL={isRTL} />
              <DailyForecast forecast={forecast} language={language} unit={unit} isRTL={isRTL} />
            </>
          )}

          {/* Multi location */}
          <MultiLocationView
            locations={multiLocations}
            onAdd={(name, country, lat, lon) =>
              addLocation(name, country, lat, lon, unit, language)
            }
            onRemove={removeMultiLocation}
            onSelect={(lat, lon) => loadWeather(lat, lon)}
            loading={multiLoading}
            canAdd={canAdd}
            max={maxLocations}
            language={language}
            unit={unit}
            isRTL={isRTL}
          />

          <InteractiveMap
            lat={current.coord.lat}
            lon={current.coord.lon}
            language={language}
            isRTL={isRTL}
            onSelect={(lat, lon) => loadWeather(lat, lon)}
          />
        </div>
      )}
    </>
  );

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Header
        language={language}
        theme={theme}
        unit={unit}
        onToggleTheme={toggleTheme}
        onCycleLanguage={cycleLanguage}
        onToggleUnit={handleToggleUnit}
        onGeolocate={handleGeolocate}
        geoLoading={geoLoading}
        isRTL={isRTL}
        languageLabel={languageLabel}
        onLogoClick={handleClear}
      />

      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: isMobile ? '16px 12px' : '32px 24px',
          flex: 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: isMobile ? '16px' : '32px' }}>
          <SearchBar
            onSelect={handleSearch}
            onClear={handleClear}
            language={language}
            isRTL={isRTL}
          />
        </div>

        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weatherContent}
            {favoritesPanel}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: '80px' }}>
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

      <Footer language={language} isRTL={isRTL} />
    </div>
  );
}
