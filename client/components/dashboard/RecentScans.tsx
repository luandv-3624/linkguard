'use client';

import { ExternalLink, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useGetOverview } from '@/lib/api-hooks/use-get-overview';

export default function RecentScans() {
  // get recent scans from data
  const { data: { recentScans } = {}, isLoading } = useGetOverview();

  if (isLoading) {
    return <TableSkeleton />;
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
        <h3 className="text-lg font-bold text-terminal-green mb-1">RECENT SCANS</h3>
        <p className="text-xs text-terminal-green/60 font-mono">
          Latest URL analysis results
        </p>
      </div>

      <div className="space-y-2">
        {recentScans?.map((scan, i: number) => {
          const threatConfigs = {
            safe: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
            suspicious: {
              icon: AlertTriangle,
              color: 'text-yellow-500',
              bg: 'bg-yellow-500/10',
            },
            dangerous: {
              icon: AlertTriangle,
              color: 'text-red-500',
              bg: 'bg-red-500/10',
            },
          };
          const threatLevel = (scan.result.threatLevel ||
            'safe') as keyof typeof threatConfigs;
          const threatConfig = threatConfigs[threatLevel] || {
            icon: Shield,
            color: 'text-gray-500',
            bg: 'bg-gray-500/10',
          };

          const Icon = threatConfig.icon;

          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg border border-terminal-green/10 hover:border-terminal-green/30 transition-colors group cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg ${threatConfig.bg} flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${threatConfig.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-terminal-green truncate">
                  {scan.url}
                </div>
                <div className="text-xs text-terminal-green/50 font-mono">
                  {new Date(scan.timestamp).toLocaleString()} • Score: {scan.result.score}
                  /100
                </div>
              </div>

              <ExternalLink className="w-4 h-4 text-terminal-green/50 group-hover:text-terminal-green transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="terminal-window p-6 animate-pulse">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-terminal-green/10 rounded" />
        ))}
      </div>
    </div>
  );
}
