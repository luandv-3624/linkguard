'use client';

import { useState, useEffect } from 'react';
import { type Locale } from './config';
import en from './messages/en';
import vi from './messages/vi';
import ja from './messages/ja';

// Tạo Type chuẩn dựa trên file tiếng Anh
type TranslationType = typeof en;

// Ép kiểu cho object messages để TypeScript hiểu chúng có chung cấu trúc
const messages: Record<Locale, TranslationType> = { 
  en, 
  vi: vi as unknown as TranslationType, 
  ja: ja as unknown as TranslationType 
};

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('en');
  // Truyền Type vào useState
  const [t, setT] = useState<TranslationType>(messages['en']);

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

  return { t, locale };
}