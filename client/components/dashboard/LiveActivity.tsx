'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useGetLiveActivities } from '@/lib/api-hooks/use-get-live-activities';

export default function LiveActivity() {
  const { data: activities, isLoading } = useGetLiveActivities();

  if (isLoading) {
    return <LiveActivitySkeleton />;
  }

  return (
    <div className="terminal-window p-6">
      <div className="terminal-header mb-6">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-red-500" />
          <div className="terminal-dot bg-yellow-500" />
          <div className="terminal-dot bg-green-500" />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-emerald-700 dark:text-terminal-green mb-1">
          LIVE ACTIVITY
        </h3>
        <p className="text-xs text-emerald-600 dark:text-terminal-green/60 font-mono">
          Real-time threat monitoring
        </p>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {activities && activities.length > 0 ? (
            activities.map((activity) => {
              const config = {
                scan: {
                  icon: Shield,
                  color: 'text-cyan-500 dark:text-terminal-cyan',
                  bg: 'bg-cyan-100 dark:bg-terminal-cyan/10',
                  border: 'border-cyan-200 dark:border-terminal-cyan/20',
                },
                blocked: {
                  icon: AlertTriangle,
                  color: 'text-red-500',
                  bg: 'bg-red-100 dark:bg-red-500/10',
                  border: 'border-red-200 dark:border-red-500/20',
                },
                safe: {
                  icon: CheckCircle,
                  color: 'text-green-500',
                  bg: 'bg-green-100 dark:bg-green-500/10',
                  border: 'border-green-200 dark:border-green-500/20',
                },
              }[activity.type];

              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border transition-all
                    hover:border-emerald-400 dark:hover:border-terminal-green/60
                    ${config.bg} ${config.border}
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${config.color}`} />

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-emerald-700 dark:text-terminal-green/80 truncate">
                      {activity.url}
                    </div>
                    <div className="text-xs text-emerald-500 dark:text-terminal-green/50 font-mono">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                      {' • Score: '}
                      {activity.score}/100
                      {activity.feature && ` • ${activity.feature}`}
                    </div>
                  </div>

                  <div
                    className={`
                      px-2 py-1 rounded text-xs font-bold uppercase flex-shrink-0
                      ${config.color} ${config.bg}
                    `}
                  >
                    {activity.type}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-emerald-500 dark:text-terminal-green/60 font-mono text-sm">
              No recent activity
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LiveActivitySkeleton() {
  return (
    <div className="terminal-window p-6 animate-pulse">
      <div className="mb-6">
        <div className="h-6 w-32 bg-emerald-500/10 dark:bg-terminal-green/10 rounded mb-2" />
        <div className="h-4 w-48 bg-emerald-500/10 dark:bg-terminal-green/10 rounded" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-emerald-500/10 dark:bg-terminal-green/10 rounded"
          />
        ))}
      </div>
    </div>
  );
}
