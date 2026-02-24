'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-16 h-8 
        bg-dark-700 dark:bg-dark-700 light:bg-light-200
        border-2 border-terminal-green/30
        rounded-full
        flex items-center
        transition-colors
      "
    >
      <motion.div
        className="
          absolute w-6 h-6 
          bg-terminal-green 
          rounded-full
          flex items-center justify-center
        "
        animate={{
          x: theme === 'dark' ? 2 : 34,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-dark-900" />
        ) : (
          <Sun className="w-4 h-4 text-dark-900" />
        )}
      </motion.div>
    </button>
  );
}
