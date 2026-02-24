import React from 'react';
import type { URLAnalysisResult } from '@shared/types/url.types';
import { THREAT_STYLES } from '../config/threatConfig';
import { tooltipStyles } from '../styles/tooltipStyles';

interface TooltipResultProps {
  url: string;
  result: URLAnalysisResult;
}

export const TooltipResult: React.FC<TooltipResultProps> = ({ url, result }) => {
  const threatStyle = THREAT_STYLES[result.threatLevel];
  const displayUrl = url.length > 50 ? `${url.substring(0, 50)}...` : url;

  return (
    <div style={tooltipStyles.result}>
      {/* Header with Badge */}
      <div style={tooltipStyles.header}>
        <div style={tooltipStyles.badge(threatStyle.color)}>
          <span style={{ fontSize: '14px' }}>{threatStyle.icon}</span>
          <span>{result.threatLevel.toUpperCase()}</span>
        </div>
        <div style={tooltipStyles.score}>
          Score: <strong>{result.score}/100</strong>
        </div>
      </div>

      {/* URL Display */}
      <div style={tooltipStyles.url}>{displayUrl}</div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <div style={tooltipStyles.reasons}>
          <div style={tooltipStyles.reasonsTitle}>Detection reasons:</div>
          <ul style={tooltipStyles.reasonsList}>
            {result.reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div style={tooltipStyles.footer}>
        <span style={tooltipStyles.time}>
          Analyzed in {result.analysisTime}ms
        </span>
      </div>
    </div>
  );
};
