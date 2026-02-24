'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Zap, TrendingUp, Eye, Activity } from 'lucide-react';
import { useGetOverview } from '@/lib/api-hooks/use-get-overview';

export default function StatsGrid() {
  const { data: stats, isLoading } = useGetOverview();

  if (isLoading) {
    return <StatsGridSkeleton />;
  }

  const statCards = [
    {
      icon: Shield,
      label: 'Total Scans',
      value: stats?.totalScans || 0,
      change: '+12%',
      color: 'blue',
    },
    {
      icon: Eye,
      label: 'Threats Blocked',
      value: stats?.totalThreats || 0,
      change: '+8%',
      color: 'red',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      change: '+24%',
      color: 'green',
    },
    {
      icon: Activity,
      label: 'Active Sessions',
      value: stats?.activeSessions || 0,
      change: '+16%',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      label: 'Threat Rate',
      value: `${stats?.threatRate?.toFixed(1) || 0}%`,
      change: '-5%',
      color: 'amber',
    },
    {
      icon: Zap,
      label: 'Avg Analysis Time',
      value: `${stats?.avgAnalysisTime?.toFixed(0) || 0}ms`,
      change: '-3ms',
      color: 'cyan',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="terminal-window p-5 hover:scale-[1.02] transition-transform cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                bg-terminal-green/10 group-hover:bg-terminal-green/20 transition-colors
              `}
              >
                <Icon className="w-6 h-6 text-terminal-green" />
              </div>

              <div
                className={`
                px-2 py-1 rounded text-xs font-mono
                ${
                  stat.change.startsWith('+')
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }
              `}
              >
                {stat.change}
              </div>
            </div>

            <div className="text-3xl font-bold text-terminal-green mb-1 neon-text">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>

            <div className="text-sm text-terminal-green/60 font-mono">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="terminal-window p-5 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-terminal-green/10" />
            <div className="w-12 h-6 rounded bg-terminal-green/10" />
          </div>
          <div className="w-20 h-8 rounded bg-terminal-green/10 mb-2" />
          <div className="w-32 h-4 rounded bg-terminal-green/10" />
        </div>
      ))}
    </div>
  );
}
