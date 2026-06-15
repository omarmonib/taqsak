import { CurrentWeather, ForecastResponse, SearchResult, TemperatureUnit } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

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
