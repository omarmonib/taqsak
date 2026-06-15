'use client';

interface WeatherIconProps {
  icon: string;
  description: string;
  className?: string;
}

const ICON_MAP: Record<string, string> = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '⛅',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};

export function WeatherIcon({ icon, description, className = 'text-4xl' }: WeatherIconProps) {
  const emoji = ICON_MAP[icon] ?? '🌡️';
  return (
    <span className={className} role="img" aria-label={description} title={description}>
      {emoji}
    </span>
  );
}
