import React from 'react';
import { modalStyles } from '../styles/modalStyles';
import type { ThreatInfo } from '../config/threatConfig';

interface ThreatSectionProps {
  info: ThreatInfo;
  threatLevel: string;
  score: number;
}

export const ThreatSection: React.FC<ThreatSectionProps> = ({ info, threatLevel, score }) => {
  return (
    <div style={modalStyles.section}>
      <div style={modalStyles.label}>Threat Level:</div>
      <div style={modalStyles.threatContainer}>
        <span style={modalStyles.badge(info.color)}>
          {threatLevel.toUpperCase()}
        </span>
        <span style={modalStyles.score}>
          Risk Score: {score}/100
        </span>
      </div>
    </div>
  );
};
