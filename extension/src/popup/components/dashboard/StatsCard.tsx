import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'red' | 'green' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  console.log("Rendering StatsCard with value:", value);
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <div className="stats-card-value">{value.toLocaleString()}</div>
        <div className="stats-card-title">{title}</div>
      </div>
    </div>
  );
};

export default StatsCard;
