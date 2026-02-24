import React from 'react';
import { ThreatLevel } from '@shared/types/url.types';
import './RecentScans.css';

interface RecentScansProps {
  scans: any[];
}

const RecentScans: React.FC<RecentScansProps> = ({ scans }) => {
  const getThreatColor = (level: ThreatLevel): string => {
    switch (level) {
      case ThreatLevel.SAFE:
        return '#10b981';
      case ThreatLevel.SUSPICIOUS:
        return '#f59e0b';
      case ThreatLevel.DANGEROUS:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="recent-scans">
      <h3 className="recent-scans-title">Recent Activity</h3>
      <div className="recent-scans-list">
        {scans.map((scan, idx) => (
          <div key={idx} className="recent-scan-item">
            <div
              className="recent-scan-indicator"
              style={{ backgroundColor: getThreatColor(scan.result.threatLevel) }}
            ></div>
            <div className="recent-scan-content">
              <div className="recent-scan-url">
                {scan.url.length > 35 ? scan.url.substring(0, 35) + '...' : scan.url}
              </div>
              <div className="recent-scan-meta">
                <span className="recent-scan-level">
                  {scan.result.threatLevel}
                </span>
                <span className="recent-scan-time">
                  {formatTime(scan.timestamp)}
                </span>
              </div>
            </div>
            <div className="recent-scan-score">
              {scan.result.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentScans;
