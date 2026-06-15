'use client';

import { useState, useEffect, useCallback } from 'react';
import { Language } from '@/types/weather';
import { translations } from '@/lib/i18n';

const STORAGE_KEY = 'taqsak_language';

function applyLanguage(lang: Language) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    const initial: Language = stored ?? 'en';
    setLanguageState(initial);
    applyLanguage(initial);
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  const t = useCallback(
    (key: keyof typeof translations.en): string => {
      return (translations[language][key] as string) ?? key;
    },
    [language]
  );

  return { language, setLanguage, toggleLanguage, t, isRTL: language === 'ar', mounted };
}
