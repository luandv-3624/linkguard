import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { URLAnalysisResult } from '@shared/types/url.types';
import { tooltipStyles, TOOLTIP_ANIMATIONS } from '../styles/tooltipStyles';
import { TooltipLoading } from '../components/TooltipLoading';
import { TooltipError } from '../components/TooltipError';
import { TooltipResult } from '../components/TooltipResult';

export interface TooltipProps {
  position: { x: number; y: number };
  status: 'loading' | 'success' | 'error';
  url: string;
  result?: URLAnalysisResult;
  message?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ position, status, url, result, message }) => {
  return (
    <div style={tooltipStyles.container(position.x, position.y)}>
      <style>{TOOLTIP_ANIMATIONS}</style>

      <div style={tooltipStyles.content}>
        {status === 'loading' && <TooltipLoading />}
        {status === 'error' && <TooltipError message={message} />}
        {status === 'success' && result && <TooltipResult url={url} result={result} />}
      </div>

      {/* Arrow */}
      <div style={tooltipStyles.arrow} />
    </div>
  );
};

// Tooltip Manager (Singleton)
class TooltipManager {
  private root: Root | null = null;
  private container: HTMLDivElement | null = null;
  private hostElement: HTMLDivElement | null = null; // Thêm host element cho Shadow DOM

  show(props: TooltipProps): void {
    console.log('[Tooltip] Showing tooltip for:', props.url, props.status);

    try {
      this.createContainer();
      this.render(props);
    } catch (err) {
      console.error('[Tooltip] Failed to render:', err);
    }
  }

  update(props: TooltipProps): void {
    try {
      if (this.root && this.container) {
        this.render(props);
      } else {
        this.show(props);
      }
    } catch (err) {
      console.error('[Tooltip] Failed to update:', err);
    }
  }

  hide(): void {
    if (this.hostElement) {
      try {
        this.hostElement.remove(); // Xóa host element thay vì container
      } catch (err) {
        console.error('[Tooltip] Failed to remove:', err);
      }

      this.root = null;
      this.container = null;
      this.hostElement = null;
    }
  }

  private createContainer(): void {
    if (!this.container) {
      // 1. Tạo một Host Element bám vào body của trang web
      this.hostElement = document.createElement('div');
      this.hostElement.id = 'linkguard-tooltip-host';
      document.body.appendChild(this.hostElement);

      // 2. Tạo Shadow Root từ Host Element (mode open để React có thể gắn event)
      const shadowRoot = this.hostElement.attachShadow({ mode: 'open' });

      // 3. Tạo Container thực sự cho React bên trong Shadow Root
      this.container = document.createElement('div');
      this.container.id = 'linkguard-tooltip-root';
      shadowRoot.appendChild(this.container);

      // 4. Khởi tạo React Root
      this.root = createRoot(this.container);
    }
  }

  private render(props: TooltipProps): void {
    if (!this.root) {
      throw new Error('Tooltip root not initialized');
    }
    this.root.render(<Tooltip {...props} />);
  }
}

// Export singleton instance
const tooltipManager = new TooltipManager();

export const showTooltip = (props: TooltipProps): void => tooltipManager.show(props);
export const updateTooltip = (props: TooltipProps): void => tooltipManager.update(props);
export const hideTooltip = (): void => tooltipManager.hide();
