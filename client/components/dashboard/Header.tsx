'use client';

import { Bell, Menu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="h-16 bg-light-50 dark:bg-dark-800 border-b border-light-300 dark:border-terminal-green/20 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-emerald-600 dark:text-terminal-green">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 hover:bg-emerald-100 dark:hover:bg-terminal-green/10 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-emerald-600 dark:text-terminal-green" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* System Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-terminal-green/10 rounded-lg">
          <div className="w-2 h-2 bg-emerald-500 dark:bg-terminal-green rounded-full animate-pulse" />
          <span className="text-emerald-700 dark:text-terminal-green text-xs font-mono">
            ONLINE
          </span>
        </div>
      </div>
    </header>
  );
}
