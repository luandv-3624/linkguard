import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { URLAnalysisResult } from '@shared/types/url.types';
import { THREAT_CONFIG } from '../config/threatConfig';
import { modalStyles } from '../styles/modalStyles';
import { ModalHeader } from '../components/ModalHeader';
import { URLSection } from '../components/URLSection';
import { ThreatSection } from '../components/ThreatSection';
import { ReasonsSection } from '../components/ReasonsSection';
import { RedirectSection } from '../components/RedirectSection';
import { ModalFooter } from '../components/ModalFooter';

export type UserChoice = 'cancel' | 'proceed' | 'whitelist';

interface WarningModalProps {
  url: string;
  result: URLAnalysisResult;
  onChoice: (choice: UserChoice) => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ url, result, onChoice }) => {
  const [isLoading, setIsLoading] = useState(false);

  const info = THREAT_CONFIG[result.threatLevel];
  const domain = new URL(url).hostname;

  const handleChoice = (choice: UserChoice) => {
    setIsLoading(true);
    onChoice(choice);
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <ModalHeader info={info} />

        <div style={modalStyles.body}>
          <URLSection url={url} />
          
          <ThreatSection
            info={info}
            threatLevel={result.threatLevel}
            score={result.score}
          />
          
          <ReasonsSection reasons={result.reasons} />
          
          <RedirectSection redirectChain={result.details?.redirectChain} />
        </div>

        <ModalFooter
          threatLevel={result.threatLevel}
          domain={domain}
          isLoading={isLoading}
          onChoice={handleChoice}
        />
      </div>
    </div>
  );
};

// Modal Manager (Singleton)
class WarningModalManager {
  private modalRoot: Root | null = null;
  private modalContainer: HTMLDivElement | null = null;
  private hostElement: HTMLDivElement | null = null; // Thêm host element 

  show(props: { url: string; result: URLAnalysisResult }): Promise<UserChoice> {
    return new Promise((resolve) => {
      console.log('[WarningModal] Showing modal for:', props.url);

      try {
        this.createContainer();
        this.renderModal(props, resolve);
      } catch (err) {
        console.error('[WarningModal] Failed to render modal:', err);
        this.fallbackToConfirm(props, resolve);
      }
    });
  }

  hide() {
    if (this.hostElement) {
      try {
        this.hostElement.remove(); // Xóa nguyên cụm Shadow DOM
      } catch (err) {
        console.error('[WarningModal] Failed to remove modal:', err);
      }

      this.modalRoot = null;
      this.modalContainer = null;
      this.hostElement = null;
    }
  }

  private createContainer() {
    if (!this.modalContainer) {
      // 1. Tạo Host Element
      this.hostElement = document.createElement('div');
      this.hostElement.id = 'linkguard-warning-modal-host';
      document.body.appendChild(this.hostElement);

      // 2. Tạo Shadow Root
      const shadowRoot = this.hostElement.attachShadow({ mode: 'open' });

      // 3. Gắn Container vào trong Shadow DOM
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'linkguard-warning-modal-root';
      shadowRoot.appendChild(this.modalContainer);

      // 4. Khởi tạo React Root
      this.modalRoot = createRoot(this.modalContainer);
    }
  }

  private renderModal(
    props: { url: string; result: URLAnalysisResult },
    resolve: (choice: UserChoice) => void
  ) {
    if (!this.modalRoot) {
      throw new Error('Modal root not initialized');
    }

    const handleChoice = (choice: UserChoice) => {
      this.hide();
      resolve(choice);
    };

    this.modalRoot.render(
      <WarningModal {...props} onChoice={handleChoice} />
    );
  }

  private fallbackToConfirm(
    props: { url: string; result: URLAnalysisResult },
    resolve: (choice: UserChoice) => void
  ) {
    try {
      const message = `LinkGuard detected ${props.result.threatLevel} link:\n${props.url}\n\nProceed?`;
      const proceed = window.confirm(message);
      resolve(proceed ? 'proceed' : 'cancel');
    } catch (err) {
      console.error('[WarningModal] Fallback confirm failed:', err);
      resolve('cancel');
    }
  }
}

// Export singleton instance
const modalManager = new WarningModalManager();

export const showWarningModal = (props: {
  url: string;
  result: URLAnalysisResult;
}): Promise<UserChoice> => modalManager.show(props);

export const hideWarningModal = () => modalManager.hide();
