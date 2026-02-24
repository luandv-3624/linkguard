'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';

function getInitialLocale(): Locale {
  const savedLocale = localStorage.getItem('locale') as Locale;
  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale;
  }
  return 'en';
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(getInitialLocale);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    setIsOpen(false);

    // Trigger re-render (you'll implement actual locale switching later)
    window.dispatchEvent(new CustomEvent('localeChange', { detail: locale }));
    router.refresh();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 border border-terminal-green/30 rounded-lg hover:border-terminal-green/60 transition-all group"
      >
        <Globe className="w-4 h-4 text-terminal-green group-hover:rotate-12 transition-transform" />
        <span className="text-terminal-green font-mono text-sm">
          {localeFlags[currentLocale]} {localeNames[currentLocale]}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-terminal-green transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 terminal-window overflow-hidden z-50"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="ml-2 text-xs text-terminal-green/60">lang.select</span>
            </div>

            <div className="p-2">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded
                    transition-all font-mono text-sm
                    ${
                      currentLocale === locale
                        ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/50'
                        : 'text-terminal-green/70 hover:bg-terminal-green/10 hover:text-terminal-green'
                    }
                  `}
                >
                  <span className="text-lg">{localeFlags[locale]}</span>
                  <span className="flex-1 text-left">{localeNames[locale]}</span>
                  {currentLocale === locale && (
                    <span className="text-terminal-green">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
