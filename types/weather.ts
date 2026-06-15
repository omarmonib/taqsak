export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface HourlyForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  weather: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pop: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: HourlyForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface FavoriteLocation {
  id: string;
  name: string;
  nameAr?: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

export interface SearchResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type TemperatureUnit = 'metric' | 'imperial';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  language: Language;
  theme: Theme;
  unit: TemperatureUnit;
}

export interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastResponse | null;
  loading: boolean;
  error: string | null;
}
