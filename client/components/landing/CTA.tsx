// components/landing/CTA.tsx

'use client';

import { motion } from 'framer-motion';
import { Download, Github } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';

export default function CTA() {
  const { t } = useTranslations();

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, #00ff41 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="terminal-window"
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500" />
            <div className="terminal-dot bg-yellow-500" />
            <div className="terminal-dot bg-green-500" />
            <span className="ml-2 text-xs text-terminal-green/60">deploy.sh</span>
          </div>

          <div className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-5xl font-display mb-6 neon-text">
                {`> ${t.cta.title}`}
              </h2>
              <p className="text-lg text-terminal-green/80 mb-8 max-w-2xl mx-auto">
                {t.cta.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Link href="https://chrome.google.com/webstore" target="_blank">
                <button className="group relative px-10 py-5 bg-terminal-green text-dark-900 font-bold rounded-lg overflow-hidden transition-all hover:scale-105 shadow-lg hover:shadow-terminal-green/50">
                  <span className="relative z-10 flex items-center gap-3">
                    <Download size={24} />
                    <span>
                      <div className="text-left">
                        <div className="text-xs opacity-70">{t.cta.free}</div>
                        <div className="text-lg">{t.cta.installExtension}</div>
                      </div>
                    </span>
                  </span>
                </button>
              </Link>

              <Link href="https://github.com/linkguard" target="_blank">
                <button className="px-10 py-5 bg-transparent border-2 border-terminal-green text-terminal-green font-bold rounded-lg hover:bg-terminal-green/10 transition-all flex items-center gap-3">
                  <Github size={24} />
                  <span>
                    <div className="text-left">
                      <div className="text-xs opacity-70">{t.cta.openSource}</div>
                      <div className="text-lg">{t.cta.viewGithub}</div>
                    </div>
                  </span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-6 text-sm text-terminal-green/60"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                <span>{t.cta.features.free}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                <span>{t.cta.features.noRegistration}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                <span>{t.cta.features.privacyFirst}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { value: '15K+', label: t.cta.stats.activeUsers },
            { value: '1M+', label: t.cta.stats.threatsBlocked },
            { value: '4.9★', label: t.cta.stats.userRating },
          ].map((stat, i) => (
            <div key={i} className="terminal-window p-4 text-center">
              <div className="text-2xl font-bold neon-text mb-1">{stat.value}</div>
              <div className="text-xs text-terminal-green/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
