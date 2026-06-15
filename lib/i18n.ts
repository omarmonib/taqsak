import { Language } from '@/types/weather';

export const translations = {
  en: {
    appName: 'Taqsak',
    appTagline: 'Your Weather, Anywhere',
    search: 'Search',
    searchPlaceholder: 'Search city, country or province...',
    currentWeather: 'Current Weather',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    pressure: 'Pressure',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    hourlyForecast: 'Hourly Forecast',
    dailyForecast: '7-Day Forecast',
    favorites: 'Favorites',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    noFavorites: 'No favorite locations yet',
    noFavoritesDesc: 'Search for a city and save it to your favorites.',
    map: 'Weather Map',
    loading: 'Loading weather data...',
    errorTitle: 'Something went wrong',
    errorDesc: 'Unable to fetch weather data. Please try again.',
    emptyTitle: 'No location selected',
    emptyDesc: 'Search for a city, country, or province to see the weather.',
    retry: 'Try Again',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'العربية',
    today: 'Today',
    now: 'Now',
    high: 'H',
    low: 'L',
    precipitation: 'Precipitation',
    cloudCover: 'Cloud Cover',
    uvIndex: 'UV Index',
    wind: 'Wind',
    km: 'km',
    kmh: 'km/h',
    hPa: 'hPa',
    celsius: '°C',
    fahrenheit: '°F',
    days: {
      Sun: 'Sun',
      Mon: 'Mon',
      Tue: 'Tue',
      Wed: 'Wed',
      Thu: 'Thu',
      Fri: 'Fri',
      Sat: 'Sat',
    },
    weatherConditions: {
      'clear sky': 'Clear Sky',
      'few clouds': 'Few Clouds',
      'scattered clouds': 'Scattered Clouds',
      'broken clouds': 'Broken Clouds',
      'shower rain': 'Shower Rain',
      rain: 'Rain',
      thunderstorm: 'Thunderstorm',
      snow: 'Snow',
      mist: 'Mist',
      overcast: 'Overcast',
    },
  },
  ar: {
    appName: 'طقسك',
    appTagline: 'طقسك في أي مكان',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن مدينة، دولة أو محافظة...',
    currentWeather: 'الطقس الحالي',
    feelsLike: 'الإحساس الحراري',
    humidity: 'الرطوبة',
    windSpeed: 'سرعة الرياح',
    visibility: 'مدى الرؤية',
    pressure: 'الضغط الجوي',
    sunrise: 'شروق الشمس',
    sunset: 'غروب الشمس',
    hourlyForecast: 'توقعات كل ساعة',
    dailyForecast: 'توقعات 7 أيام',
    favorites: 'المفضلة',
    addToFavorites: 'إضافة إلى المفضلة',
    removeFromFavorites: 'إزالة من المفضلة',
    noFavorites: 'لا توجد مواقع مفضلة بعد',
    noFavoritesDesc: 'ابحث عن مدينة واحفظها في مفضلتك.',
    map: 'خريطة الطقس',
    loading: 'جارٍ تحميل بيانات الطقس...',
    errorTitle: 'حدث خطأ ما',
    errorDesc: 'تعذّر جلب بيانات الطقس. يرجى المحاولة مرة أخرى.',
    emptyTitle: 'لم يتم اختيار موقع',
    emptyDesc: 'ابحث عن مدينة أو دولة أو محافظة لعرض حالة الطقس.',
    retry: 'حاول مرة أخرى',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    language: 'English',
    today: 'اليوم',
    now: 'الآن',
    high: 'أعلى',
    low: 'أدنى',
    precipitation: 'هطول الأمطار',
    cloudCover: 'الغيوم',
    uvIndex: 'مؤشر الأشعة فوق البنفسجية',
    wind: 'الرياح',
    km: 'كم',
    kmh: 'كم/س',
    hPa: 'هكتوباسكال',
    celsius: '°م',
    fahrenheit: '°ف',
    days: {
      Sun: 'الأحد',
      Mon: 'الاثنين',
      Tue: 'الثلاثاء',
      Wed: 'الأربعاء',
      Thu: 'الخميس',
      Fri: 'الجمعة',
      Sat: 'السبت',
    },
    weatherConditions: {
      'clear sky': 'سماء صافية',
      'few clouds': 'غيوم خفيفة',
      'scattered clouds': 'غيوم متفرقة',
      'broken clouds': 'غيوم متقطعة',
      'shower rain': 'زخات مطر',
      rain: 'مطر',
      thunderstorm: 'عاصفة رعدية',
      snow: 'ثلج',
      mist: 'ضباب',
      overcast: 'غائم',
    },
  },
};

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return (translations[lang][key] as string) ?? key;
}

export function getDayName(lang: Language, dateStr: string): string {
  const date = new Date(dateStr);
  const dayKey = date.toLocaleDateString('en-US', {
    weekday: 'short',
  }) as keyof typeof translations.en.days;
  return translations[lang].days[dayKey] ?? dayKey;
}

export function formatTime(timestamp: number, timezone: number, lang: Language): string {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  if (lang === 'ar') {
    const h12 = hours % 12 || 12;
    const period = hours < 12 ? 'ص' : 'م';
    return `${h12}:${minutes} ${period}`;
  }

  const h12 = hours % 12 || 12;
  const period = hours < 12 ? 'AM' : 'PM';
  return `${h12}:${minutes} ${period}`;
}

export function formatHour(timestamp: number, timezone: number, lang: Language): string {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();

  if (lang === 'ar') {
    const h12 = hours % 12 || 12;
    const period = hours < 12 ? 'ص' : 'م';
    return `${h12} ${period}`;
  }

  const h12 = hours % 12 || 12;
  const period = hours < 12 ? 'AM' : 'PM';
  return `${h12} ${period}`;
}
