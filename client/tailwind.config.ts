// client/tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e12',
          800: '#151b23',
          700: '#1f2937',
          600: '#374151',
        },
        terminal: {
          green: '#00ff41',
          amber: '#ffb000',
          cyan: '#00f0ff',
          pink: '#ff007f',
        },
        neon: {
          blue: '#0af',
          purple: '#a0f',
          pink: '#f0a',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
        display: ['Press Start 2P', 'monospace'],
      },
      animation: {
        'scan-line': 'scan-line 8s linear infinite',
        flicker: 'flicker 0.15s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'terminal-blink': 'terminal-blink 1s step-end infinite',
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          from: { textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' },
          to: { textShadow: '0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41' },
        },
        'terminal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(#00ff4110 1px, transparent 1px), linear-gradient(90deg, #00ff4110 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '50px 50px',
      },
    },
  },
  plugins: [],
};

export default config;
