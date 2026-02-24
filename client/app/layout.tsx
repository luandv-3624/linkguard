// app/layout.tsx

import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './provider';

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: 'LinkGuard - Military-Grade URL Protection',
  description: 'Real-time threat detection and protection from malicious links',
  keywords: ['security', 'url protection', 'malware', 'phishing'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className="font-mono bg-dark-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
