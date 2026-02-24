'use client';

import { useState, useEffect } from 'react';
import { type Locale } from './config';
import en from './messages/en';
import vi from './messages/vi';
import ja from './messages/ja';

const messages = { en, vi, ja };

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('en');
  const [t, setT] = useState(messages['en']);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && messages[savedLocale]) {
      setLocale(savedLocale);
      setT(messages[savedLocale]);
    }

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>;
      setLocale(customEvent.detail);
      setT(messages[customEvent.detail]);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  useEffect(() => {
    // Listen for locale changes
    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>;
      setLocale(customEvent.detail);
      setT(messages[customEvent.detail]);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  return { t, locale };
}
