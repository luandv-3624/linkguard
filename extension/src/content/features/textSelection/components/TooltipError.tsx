import React from 'react';
import { tooltipStyles } from '../styles/tooltipStyles';

interface TooltipErrorProps {
  message?: string;
}

export const TooltipError: React.FC<TooltipErrorProps> = ({ message }) => {
  return (
    <div style={tooltipStyles.error}>
      <span style={{ fontSize: '16px' }}>⚠</span>
      <span>{message || 'Failed to analyze URL'}</span>
    </div>
  );
};
