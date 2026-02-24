import React from 'react';
import { modalStyles } from '../styles/modalStyles';

interface RedirectSectionProps {
  redirectChain?: string[];
}

export const RedirectSection: React.FC<RedirectSectionProps> = ({ redirectChain }) => {
  if (!redirectChain || redirectChain.length === 0) return null;

  return (
    <div style={modalStyles.section}>
      <div style={modalStyles.label}>Redirect chain detected:</div>
      <div style={modalStyles.redirectContainer}>
        {redirectChain.map((redirect, idx) => (
          <div key={idx} style={modalStyles.redirectItem}>
            {idx + 1}. {redirect}
          </div>
        ))}
      </div>
    </div>
  );
};
