import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DailyForecast, ForecastResponse, TemperatureUnit } from '@/types/weather';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTemp(temp: number, unit: TemperatureUnit): string {
  const rounded = Math.round(temp);
  return unit === 'metric' ? `${rounded}°C` : `${rounded}°F`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit, isRTL = false): string {
  const val = Math.round(speed * 3.6);
  return isRTL ? `${val} كم/س` : `${val} km/h`;
}

export function formatVisibility(meters: number, isRTL = false): string {
  const val = meters >= 1000 ? `${(meters / 1000).toFixed(1)}` : `${meters}`;
  const unit = meters >= 1000 ? (isRTL ? 'كم' : 'km') : 'm';
  return `${val} ${unit}`;
}

export function formatPressure(hPa: number, isRTL = false): string {
  return isRTL ? `${hPa} هكتوباسكال` : `${hPa} hPa`;
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function groupForecastByDay(forecast: ForecastResponse): DailyForecast[] {
  const grouped: Record<string, typeof forecast.list> = {};

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  return Object.entries(grouped)
    .slice(0, 7)
    .map(([date, items]) => {
      const temps = items.map((i) => i.main.temp);
      const midday =
        items.find((i) => i.dt_txt.includes('12:00:00')) ?? items[Math.floor(items.length / 2)];
      return {
        date,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        weather: midday.weather[0],
        humidity: Math.round(items.reduce((a, i) => a + i.main.humidity, 0) / items.length),
        windSpeed: Math.round(items.reduce((a, i) => a + i.wind.speed, 0) / items.length),
        pop: Math.round(Math.max(...items.map((i) => i.pop)) * 100),
      };
    });
}

export function generateLocationId(lat: number, lon: number): string {
  return `${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

export function isDay(sunrise: number, sunset: number, current: number): boolean {
  return current >= sunrise && current <= sunset;
}

export function getUVLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
