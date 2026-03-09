// components/landing/Hero.tsx

'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Eye, Download, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Hero() {
  const { t } = useTranslations();
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const fullText = t.hero.title;
    let index = 0;
    setDisplayText('');

    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [t]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Rest of Hero content */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-terminal-green rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="terminal-window mb-12"
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500" />
            <div className="terminal-dot bg-yellow-500" />
            <div className="terminal-dot bg-green-500" />
            <span className="ml-2 text-xs text-terminal-green/60">root@linkguard:~$</span>
          </div>

          <div className="p-8">
            <motion.h1
              className="text-3xl md:text-5xl lg:text-7xl font-display mb-6 neon-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {displayText}
              <span className="animate-terminal-blink">_</span>
            </motion.h1>

            <motion.div
              className="text-lg md:text-xl text-terminal-green/80 mb-8 font-mono max-w-3xl mx-auto space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>
                {'> '} {t.hero.subtitle1}
              </p>
              <p>
                {'> '} {t.hero.subtitle2}
              </p>
              <p>
                {'> '} {t.hero.subtitle3}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Link href="https://chromewebstore.google.com/detail/linkguard-malicious-url-p/lpbppbibepbdgamcflmecpjjaellioii" target="_blank">
                <button className="group relative px-8 py-4 bg-transparent border-2 border-terminal-green text-terminal-green font-bold rounded-lg overflow-hidden transition-all hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    <Download size={20} />
                    {t.hero.installButton}
                  </span>
                  <div className="absolute inset-0 bg-terminal-green/10 transform -skew-x-12 group-hover:skew-x-12 transition-transform" />
                </button>
              </Link>

              <Link href="#features">
                <button className="px-8 py-4 bg-transparent border border-terminal-green/50 text-terminal-green/70 font-mono rounded-lg hover:border-terminal-green hover:text-terminal-green transition-all flex items-center gap-2">
                  {t.hero.learnMore}
                  <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[
            { icon: Shield, label: t.hero.stats.protected, value: '99.9%' },
            { icon: Zap, label: t.hero.stats.fastScan, value: '<50ms' },
            { icon: Eye, label: t.hero.stats.threats, value: '1M+' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="terminal-window p-6 hover:scale-105 transition-transform cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <item.icon className="w-8 h-8 mx-auto mb-3 text-terminal-green" />
              <div className="text-2xl font-bold neon-text mb-1">{item.value}</div>
              <div className="text-xs text-terminal-green/60">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Hexagon Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="hexagons"
              width="50"
              height="43.4"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(2)"
            >
              <polygon
                points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#hexagons)"
            className="text-terminal-green"
          />
        </svg>
      </div>
    </section>
  );
}
