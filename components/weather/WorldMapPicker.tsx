'use client';

import { useState, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import { Language } from '@/types/weather';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface WorldMapPickerProps {
  lat: number;
  lon: number;
  language: Language;
  isRTL: boolean;
  onSelect: (lat: number, lon: number) => void;
}

// Convert lon/lat to SVG x/y on an equirectangular projection (viewBox 0 0 1000 500)
function lonLatToXY(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

// Convert SVG x/y back to lon/lat
function xyToLonLat(x: number, y: number): { lon: number; lat: number } {
  const lon = (x / 1000) * 360 - 180;
  const lat = 90 - (y / 500) * 180;
  return { lon: Math.round(lon * 100) / 100, lat: Math.round(lat * 100) / 100 };
}

export function WorldMapPicker({ lat, lon, language, isRTL, onSelect }: WorldMapPickerProps) {
  const t = translations[language];
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverCoord, setHoverCoord] = useState<{ lat: number; lon: number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const pin = lonLatToXY(lon, lat);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    const coords = xyToLonLat(x, y);
    onSelect(coords.lat, coords.lon);
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    setHoverCoord(xyToLonLat(x, y));
  }

  return (
    <div
      className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}
    >
      <div style={{ padding: '16px', boxSizing: 'border-box' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginBottom: '12px',
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
                  : 'Click to select location'}
          </span>
        </div>

        {/* World map SVG */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0c1e3e, #1e3a5f)',
            cursor: 'crosshair',
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 1000 500"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="rgba(56,189,248,0.08)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#grid)" />

            {/* Simplified continents as rough shapes */}
            <g fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.3)" strokeWidth="1">
              {/* North America */}
              <path d="M 130 110 L 280 90 L 310 160 L 290 220 L 240 260 L 180 240 L 120 180 Z" />
              {/* South America */}
              <path d="M 250 280 L 310 270 L 330 360 L 300 440 L 260 420 L 240 340 Z" />
              {/* Europe */}
              <path d="M 470 100 L 550 90 L 570 140 L 540 170 L 480 160 Z" />
              {/* Africa */}
              <path d="M 470 180 L 570 170 L 600 280 L 560 380 L 500 370 L 460 280 Z" />
              {/* Asia */}
              <path d="M 580 80 L 800 70 L 850 180 L 780 250 L 650 230 L 590 150 Z" />
              {/* Australia */}
              <path d="M 760 330 L 850 320 L 870 380 L 810 400 L 760 370 Z" />
            </g>

            {/* Equator line */}
            <line
              x1="0"
              y1="250"
              x2="1000"
              y2="250"
              stroke="rgba(56,189,248,0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Selected pin */}
            <g style={{ pointerEvents: 'none' }}>
              <circle cx={pin.x} cy={pin.y} r="14" fill="rgba(56,189,248,0.25)">
                <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.5;0.1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={pin.x} cy={pin.y} r="6" fill="#38bdf8" stroke="white" strokeWidth="2" />
            </g>
          </svg>

          {/* Hover coordinates tooltip */}
          {hoverCoord && (
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                [isRTL ? 'right' : 'left']: '8px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                pointerEvents: 'none',
              }}
            >
              {hoverCoord.lat.toFixed(2)}°, {hoverCoord.lon.toFixed(2)}°
            </div>
          )}
        </div>

        {/* Selected coordinates display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '12px',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              {language === 'ar'
                ? 'خط العرض'
                : language === 'fr'
                  ? 'Latitude'
                  : language === 'es'
                    ? 'Latitud'
                    : 'Latitude'}
            </div>
            <div
              className="text-sky-500 dark:text-sky-400"
              style={{ fontSize: '16px', fontWeight: 700 }}
            >
              {lat.toFixed(2)}°
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              {language === 'ar'
                ? 'خط الطول'
                : language === 'fr'
                  ? 'Longitude'
                  : language === 'es'
                    ? 'Longitud'
                    : 'Longitude'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#6366f1' }}>
              {lon.toFixed(2)}°
            </div>
          </div>
        </div>

        {/* Open in Google Maps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <a
            href={`https://www.google.com/maps?q=${lat},${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 dark:text-sky-400"
            style={{
              padding: '6px 16px',
              borderRadius: '10px',
              background: 'rgba(56,189,248,0.1)',
              fontSize: '11px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MapPin size={12} />
            {language === 'ar'
              ? 'فتح في خرائط جوجل'
              : language === 'fr'
                ? 'Ouvrir dans Google Maps'
                : language === 'es'
                  ? 'Abrir en Google Maps'
                  : 'Open in Google Maps'}
          </a>
        </div>
      </div>
    </div>
  );
}
