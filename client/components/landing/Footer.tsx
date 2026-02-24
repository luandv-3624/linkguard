// components/landing/Footer.tsx

'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, Shield } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';

export default function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="relative border-t border-terminal-green/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-terminal-green" />
              <span className="text-2xl font-display neon-text">LINKGUARD</span>
            </div>

            <p className="text-terminal-green/60 text-sm mb-4">{t.footer.description}</p>

            <div className="flex gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                className="text-terminal-green/60 hover:text-terminal-green transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-terminal-green/60 hover:text-terminal-green transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="mailto:support@linkguard.io"
                className="text-terminal-green/60 hover:text-terminal-green transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-terminal-green mb-4">{t.footer.product}</h3>

            <ul className="space-y-2 text-sm text-terminal-green/60">
              <li>
                <Link
                  href="#features"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.features}
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.howItWorks}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.documentation}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-terminal-green mb-4">{t.footer.company}</h3>

            <ul className="space-y-2 text-sm text-terminal-green/60">
              <li>
                <Link
                  href="/about"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-terminal-green transition-colors"
                >
                  {t.footer.links.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-terminal-green/20 pt-8 text-center">
          <p className="text-terminal-green/60 text-sm font-mono">
            {`> ${t.footer.copyright}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
