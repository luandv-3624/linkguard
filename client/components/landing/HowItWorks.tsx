// components/landing/HowItWorks.tsx

'use client';

import { motion } from 'framer-motion';
import { MousePointer, Search, Shield, CheckCircle } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';

export default function HowItWorks() {
  const { t } = useTranslations();

  const steps = [
    {
      icon: MousePointer,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.description,
      detail: t.howItWorks.step1.detail,
    },
    {
      icon: Search,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.description,
      detail: t.howItWorks.step2.detail,
    },
    {
      icon: Shield,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.description,
      detail: t.howItWorks.step3.detail,
    },
    {
      icon: CheckCircle,
      title: t.howItWorks.step4.title,
      description: t.howItWorks.step4.description,
      detail: t.howItWorks.step4.detail,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display mb-4 neon-text">
            {`> ${t.howItWorks.title}`}
          </h2>
          <p className="text-terminal-green/60 font-mono">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-terminal-green/0 via-terminal-green/50 to-terminal-green/0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="terminal-window p-6 hover:scale-105 transition-transform">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-dark-900 border-2 border-terminal-green rounded-full flex items-center justify-center neon-text font-bold">
                    {i + 1}
                  </div>

                  <div className="mb-6 w-16 h-16 mx-auto bg-terminal-green/10 rounded-lg flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-terminal-green" />
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-terminal-green">
                    {step.title}
                  </h3>
                  <p className="text-terminal-green/70 text-sm mb-2">
                    {step.description}
                  </p>
                  <p className="text-terminal-green/50 text-xs">{`> ${step.detail}`}</p>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-terminal-green">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 terminal-window max-w-3xl mx-auto"
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500" />
            <div className="terminal-dot bg-yellow-500" />
            <div className="terminal-dot bg-green-500" />
            <span className="ml-2 text-xs text-terminal-green/60">
              {t.howItWorks.demo.title}
            </span>
          </div>

          <div className="p-6 font-mono text-sm space-y-2">
            <div className="text-terminal-green/70">{`> ${t.howItWorks.demo.line1}`}</div>
            <div className="text-terminal-green">{`> ${t.howItWorks.demo.line2}`}</div>
            <div className="text-terminal-green">{`> ${t.howItWorks.demo.line3}`}</div>
            <div className="text-terminal-green">{`> ${t.howItWorks.demo.line4}`}</div>
            <div className="text-terminal-amber">{`> ${t.howItWorks.demo.line5}`}</div>
            <div className="text-terminal-pink">{`> ${t.howItWorks.demo.line6}`}</div>
            <div className="text-terminal-green">{`> ${t.howItWorks.demo.line7}`}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
