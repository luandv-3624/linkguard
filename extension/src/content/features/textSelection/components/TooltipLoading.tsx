import React from 'react';
import { tooltipStyles } from '../styles/tooltipStyles';

export const TooltipLoading: React.FC = () => {
  return (
    <div style={tooltipStyles.loading}>
      <div style={tooltipStyles.spinner} />
      <span>Analyzing URL...</span>
    </div>
  );
};
