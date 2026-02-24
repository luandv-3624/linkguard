'use client';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useGetTimeSeries } from '@/lib/api-hooks/use-get-time-series';

export default function ThreatChart() {
  const { data: chartData, isLoading } = useGetTimeSeries();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const formattedData =
    chartData?.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      scans: item.totalScans,
      threats: item.threats,
      safe: item.safe,
    })) || [];

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
        <h3 className="text-lg font-bold text-terminal-green mb-1">THREAT TIMELINE</h3>
        <p className="text-xs text-terminal-green/60 font-mono">Last 7 days activity</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ff4120" />
          <XAxis
            dataKey="date"
            stroke="#00ff4160"
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <YAxis
            stroke="#00ff4160"
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #00ff4140',
              borderRadius: '8px',
              fontFamily: 'monospace',
            }}
            labelStyle={{ color: '#00ff41' }}
          />
          <Area
            type="monotone"
            dataKey="scans"
            stroke="#00ff41"
            fillOpacity={1}
            fill="url(#colorScans)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="threats"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorThreats)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
          <span className="text-xs text-terminal-green/80 font-mono">Total Scans</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-terminal-green/80 font-mono">Threats</span>
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="terminal-window p-6 animate-pulse">
      <div className="h-64 bg-terminal-green/10 rounded" />
    </div>
  );
}
