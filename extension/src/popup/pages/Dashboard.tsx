import React from 'react';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentScans from '../components/dashboard/RecentScans';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useApp();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Protection Overview</h2>
        <p className="dashboard-subtitle">Your browsing security at a glance</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Scans"
          value={stats.totalScans}
          icon="🔍"
          color="blue"
        />
        <StatsCard
          title="Threats Blocked"
          value={stats.threatsBlocked}
          icon="🛡️"
          color="red"
        />
        <StatsCard
          title="Safe Links"
          value={stats.safeLinks}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Today's Scans"
          value={stats.todayScans}
          icon="📊"
          color="purple"
        />
      </div>

      {stats.recentScans && stats.recentScans.length > 0 && (
        <RecentScans scans={stats.recentScans} />
      )}
    </div>
  );
};

export default Dashboard;
