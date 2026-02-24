'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, Check } from 'lucide-react';
import { useLogin } from '@/lib/api-hooks/use-login';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { mutate, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          console.log('Login successful');
          setSuccess(true);

          setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
          }, 1500);
        },
      },
    );
  };

  /* eslint-disable react-hooks/purity */
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);
  /* eslint-enable react-hooks/purity */

  return (
    <div className="min-h-screen bg-light-100 dark:bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500 dark:bg-terminal-green rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="terminal-window">
              <div className="p-8">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-terminal-green/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-emerald-600 dark:text-terminal-green" />
                  </div>
                  <div>
                    <div className="text-2xl font-display text-emerald-700 dark:text-terminal-green dark:neon-text">
                      LINKGUARD
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-terminal-green/60 font-mono">
                      ADMIN_PORTAL
                    </div>
                  </div>
                </div>

                {/* Welcome */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-emerald-700 dark:text-terminal-green mb-2">
                    {'> SYSTEM_ACCESS'}
                  </h2>
                  <p className="text-sm text-emerald-600 dark:text-terminal-green/60 font-mono">
                    Enter credentials to proceed
                  </p>
                </div>

                {/* Error */}
                {isError && error instanceof Error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg"
                  >
                    <p className="text-red-500 text-sm font-mono">
                      {'> '} {error.message}
                    </p>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-2">
                      EMAIL_ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 dark:text-terminal-green/60" />
                      <input
                        type="email"
                        required
                        disabled={isPending}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 bg-light-50 dark:bg-dark-700 border border-light-300 dark:border-terminal-green/30 rounded-lg text-emerald-700 dark:text-terminal-green font-mono text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-2">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 dark:text-terminal-green/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={isPending}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full pl-11 pr-11 py-3 bg-light-50 dark:bg-dark-700 border border-light-300 dark:border-terminal-green/30 rounded-lg text-emerald-700 dark:text-terminal-green font-mono text-sm disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-terminal-green/60 disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 px-4 bg-emerald-600 dark:bg-terminal-green text-white dark:text-dark-900 font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        AUTHENTICATING...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        ACCESS SYSTEM
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="terminal-window">
              <div className="p-12 flex flex-col items-center">
                <Check className="w-12 h-12 text-emerald-600 dark:text-terminal-green mb-4" />
                <h2 className="text-2xl font-bold text-emerald-700 dark:text-terminal-green mb-2">
                  ACCESS GRANTED
                </h2>
                <p className="text-emerald-600 dark:text-terminal-green/60 font-mono text-sm">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
