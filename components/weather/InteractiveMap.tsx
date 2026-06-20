'use client';

import { useEffect, useRef, useState } from 'react';
import { Language } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  lat: number;
  lon: number;
  language: Language;
  isRTL: boolean;
  onSelect: (lat: number, lon: number) => void;
}

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const LAYERS = [
  {
    id: 'precipitation_new',
    labelEn: 'Precipitation',
    labelAr: 'هطول',
    labelFr: 'Précipitation',
    labelEs: 'Precipitación',
  },
  { id: 'clouds_new', labelEn: 'Clouds', labelAr: 'غيوم', labelFr: 'Nuages', labelEs: 'Nubes' },
  { id: 'wind_new', labelEn: 'Wind', labelAr: 'رياح', labelFr: 'Vent', labelEs: 'Viento' },
  {
    id: 'temp_new',
    labelEn: 'Temperature',
    labelAr: 'حرارة',
    labelFr: 'Température',
    labelEs: 'Temperatura',
  },
];

export function InteractiveMap({ lat, lon, language, isRTL, onSelect }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);
  const weatherLayerRef = useRef<import('leaflet').TileLayer | null>(null);
  const initializedRef = useRef(false);
  const [activeLayer, setActiveLayer] = useState<string | null>('precipitation_new');
  const t = translations[language];
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  useEffect(() => {
    if (!mapRef.current || initializedRef.current) return;
    initializedRef.current = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        center: [lat, lon],
        zoom: 10,
        zoomControl: true,
        attributionControl: true,
      });

      // Mapbox street tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Weather overlay
      if (API_KEY) {
        const weatherLayer = L.tileLayer(
          `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
          { opacity: 0.6, maxZoom: 19 }
        );
        weatherLayer.addTo(map);
        weatherLayerRef.current = weatherLayer;
      }

      const markerIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          background:linear-gradient(135deg,#38bdf8,#6366f1);
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          transform:rotate(-45deg);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([lat, lon], { icon: markerIcon }).addTo(map);
      markerRef.current = marker;

      map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        onSelect(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        initializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.setView([lat, lon], mapInstanceRef.current.getZoom());
    markerRef.current.setLatLng([lat, lon]);
  }, [lat, lon]);

  async function switchLayer(layerId: string) {
    if (!mapInstanceRef.current) return;
    const L = (await import('leaflet')).default;

    if (weatherLayerRef.current) {
      mapInstanceRef.current.removeLayer(weatherLayerRef.current);
    }

    if (activeLayer === layerId) {
      setActiveLayer(null);
      weatherLayerRef.current = null;
      return;
    }

    setActiveLayer(layerId);
    const newLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${API_KEY}`,
      { opacity: 0.6, maxZoom: 19 }
    );
    newLayer.addTo(mapInstanceRef.current);
    weatherLayerRef.current = newLayer;
  }

  function getLabel(layer: (typeof LAYERS)[0]) {
    if (language === 'ar') return layer.labelAr;
    if (language === 'fr') return layer.labelFr;
    if (language === 'es') return layer.labelEs;
    return layer.labelEn;
  }

  return (
    <div
      className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}
    >
      <div style={{ padding: '16px 16px 12px', boxSizing: 'border-box' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginBottom: '8px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
          >
            <span style={{ fontSize: '18px' }}>🗺️</span>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.map}</h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {language === 'ar'
              ? 'اضغط لتحديد موقع'
              : language === 'fr'
                ? 'Cliquez pour sélectionner'
                : language === 'es'
                  ? 'Haz clic para seleccionar'
                  : 'Click map to select location'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => switchLayer(layer.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: activeLayer === layer.id ? '#0ea5e9' : undefined,
                color: activeLayer === layer.id ? 'white' : undefined,
              }}
              className={
                activeLayer === layer.id
                  ? ''
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }
            >
              {getLabel(layer)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
        <div
          ref={mapRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
