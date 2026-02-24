// app/(dashboard)/page.tsx

import StatsGrid from '@/components/dashboard/StatsGrid';
import LiveActivity from '@/components/dashboard/LiveActivity';
import ThreatChart from '@/components/dashboard/ThreatChart';
import TopDomains from '@/components/dashboard/TopDomains';
import RecentScans from '@/components/dashboard/RecentScans';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-display text-terminal-green mb-2">
          {'> DASHBOARD'}
        </h1>
        <p className="text-terminal-green/60 font-mono text-sm">
          Real-time system overview and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatChart />
        <LiveActivity />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopDomains />
        <RecentScans />
      </div>
    </div>
  );
}
