'use client';

import { useState, useEffect, useCallback } from 'react';
import { Language } from '@/types/weather';
import { translations } from '@/lib/i18n';

const STORAGE_KEY = 'taqsak_language';

const RTL_LANGUAGES: Language[] = ['ar'];

function applyLanguage(lang: Language) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr');
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

  const cycleLanguage = useCallback(() => {
    const languages: Language[] = ['en', 'ar', 'fr', 'es'];
    const currentIndex = languages.indexOf(language);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    setLanguage(nextLanguage);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: keyof typeof translations.en): string => {
      const langData = translations[language] ?? translations.en;
      return (langData[key] as string) ?? (translations.en[key] as string) ?? key;
    },
    [language]
  );

  const isRTL = RTL_LANGUAGES.includes(language);

  const languageLabel: Record<Language, string> = {
    en: 'EN',
    ar: 'ع',
    fr: 'FR',
    es: 'ES',
  };

  return {
    language,
    setLanguage,
    cycleLanguage,
    t,
    isRTL,
    mounted,
    languageLabel: languageLabel[language],
  };
}
