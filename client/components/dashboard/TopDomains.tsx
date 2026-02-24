'use client';

import { TrendingUp, AlertTriangle } from 'lucide-react';
import { useGetTopDomains } from '@/lib/api-hooks/use-get-top-domains';

interface Domain {
  domain: string;
  totalScans: number;
  threatCount: number;
}

export default function TopDomains() {
  const { data: domains, isLoading } = useGetTopDomains();

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
        <h3 className="text-lg font-bold text-terminal-green mb-1">
          TOP SCANNED DOMAINS
        </h3>
        <p className="text-xs text-terminal-green/60 font-mono">
          Most frequently analyzed domains
        </p>
      </div>

      <div className="space-y-2">
        {domains?.map((domain: Domain, i: number) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg border border-terminal-green/10 hover:border-terminal-green/30 transition-colors"
          >
            <div className="text-terminal-green font-bold text-sm w-8">#{i + 1}</div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono text-terminal-green truncate">
                {domain.domain}
              </div>
              <div className="text-xs text-terminal-green/50 font-mono">
                {domain.totalScans} scans • {domain.threatCount} threats
              </div>
            </div>

            {domain.threatCount > 0 ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
          </div>
        ))}
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
