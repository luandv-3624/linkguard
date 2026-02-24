import React from 'react';
import { modalStyles } from '../styles/modalStyles';

interface ReasonsSectionProps {
  reasons: string[];
}

export const ReasonsSection: React.FC<ReasonsSectionProps> = ({ reasons }) => {
  if (reasons.length === 0) return null;

  return (
    <div style={modalStyles.section}>
      <div style={modalStyles.label}>Why this link is flagged:</div>
      <ul style={modalStyles.reasonsList}>
        {reasons.map((reason, idx) => (
          <li key={idx} style={modalStyles.reasonItem}>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
};
