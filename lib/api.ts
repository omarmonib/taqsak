import { CurrentWeather, ForecastResponse, SearchResult, TemperatureUnit } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

function buildUrl(path: string, params: Record<string, string>): string {
  const url = new URL(path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('appid', API_KEY!);
  return url.toString();
}

async function apiFetch<T>(url: string): Promise<T> {
  if (!API_KEY) throw new Error('OpenWeatherMap API key is missing.');
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'metric',
  lang = 'en'
): Promise<CurrentWeather> {
  const url = buildUrl(`${BASE_URL}/weather`, {
    lat: String(lat),
    lon: String(lon),
    units: unit,
    lang,
  });
  return apiFetch<CurrentWeather>(url);
}

export async function fetchForecast(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'metric',
  lang = 'en'
): Promise<ForecastResponse> {
  const url = buildUrl(`${BASE_URL}/forecast`, {
    lat: String(lat),
    lon: String(lon),
    units: unit,
    cnt: '40',
    lang,
  });
  return apiFetch<ForecastResponse>(url);
}

export async function searchLocations(query: string, lang = 'en'): Promise<SearchResult[]> {
  const url = buildUrl(`${GEO_URL}/direct`, {
    q: query,
    limit: '5',
    lang,
  });
  return apiFetch<SearchResult[]>(url);
}

export async function reverseGeocode(lat: number, lon: number): Promise<SearchResult[]> {
  const url = buildUrl(`${GEO_URL}/reverse`, {
    lat: String(lat),
    lon: String(lon),
    limit: '1',
  });
  return apiFetch<SearchResult[]>(url);
}

export function getWeatherIconUrl(icon: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

// Open-Meteo UV index — free, no API key required
export async function fetchUVIndex(lat: number, lon: number): Promise<number> {
  const url = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=uv_index`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.current?.uv_index ?? 0;
}

export function calculateHeatIndex(tempC: number, humidity: number): number {
  const T = (tempC * 9) / 5 + 32;
  const R = humidity;
  if (T < 80) return Math.round(tempC);

  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  return Math.round(((HI - 32) * 5) / 9);
}

export function getUVCategory(uvi: number, lang: string): { label: string; color: string } {
  if (uvi <= 2)
    return {
      label: lang === 'ar' ? 'منخفض' : lang === 'fr' ? 'Faible' : lang === 'es' ? 'Bajo' : 'Low',
      color: '#22c55e',
    };
  if (uvi <= 5)
    return {
      label:
        lang === 'ar'
          ? 'متوسط'
          : lang === 'fr'
            ? 'Modéré'
            : lang === 'es'
              ? 'Moderado'
              : 'Moderate',
      color: '#eab308',
    };
  if (uvi <= 7)
    return {
      label: lang === 'ar' ? 'عالي' : lang === 'fr' ? 'Élevé' : lang === 'es' ? 'Alto' : 'High',
      color: '#f97316',
    };
  if (uvi <= 10)
    return {
      label:
        lang === 'ar'
          ? 'عالي جداً'
          : lang === 'fr'
            ? 'Très élevé'
            : lang === 'es'
              ? 'Muy alto'
              : 'Very High',
      color: '#ef4444',
    };
  return {
    label:
      lang === 'ar' ? 'خطير' : lang === 'fr' ? 'Extrême' : lang === 'es' ? 'Extremo' : 'Extreme',
    color: '#9333ea',
  };
}
