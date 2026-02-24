import React from 'react';
import { ThreatLevel } from '@shared/types/url.types';
import { modalStyles } from '../styles/modalStyles';

export type UserChoice = 'cancel' | 'proceed' | 'whitelist';

interface ModalFooterProps {
  threatLevel: ThreatLevel;
  domain: string;
  isLoading: boolean;
  onChoice: (choice: UserChoice) => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  threatLevel,
  domain,
  isLoading,
  onChoice,
}) => {
  return (
    <>
      <div style={modalStyles.footer}>
        <button
          style={{ ...modalStyles.button, ...modalStyles.buttonSecondary }}
          onClick={() => onChoice('cancel')}
          disabled={isLoading}
        >
          ← Go Back (Recommended)
        </button>

        {threatLevel === ThreatLevel.SUSPICIOUS && (
          <button
            style={{ ...modalStyles.button, ...modalStyles.buttonWhitelist }}
            onClick={() => onChoice('whitelist')}
            disabled={isLoading}
          >
            Trust {domain} & Continue
          </button>
        )}

        <button
          style={{ ...modalStyles.button, ...modalStyles.buttonDanger }}
          onClick={() => onChoice('proceed')}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Proceed Anyway (Not Recommended)'}
        </button>
      </div>

      <div style={modalStyles.branding}>
        Protected by LinkGuard
      </div>
    </>
  );
};
