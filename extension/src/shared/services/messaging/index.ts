import browser from 'webextension-polyfill';
import type { Message, MessageResponse } from '@shared/types/message.types';

export async function sendMessage<T = any>(
  message: Message
): Promise<MessageResponse<T>> {
  try {
    const response = await browser.runtime.sendMessage(message);
    return response as MessageResponse<T>;
  } catch (error) {
    console.error('[Messaging] Send failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Xử lý lỗi đặc thù của Chrome Extension
    if (errorMessage.includes('Extension context invalidated')) {
      return {
        success: false,
        error: 'Tiện ích LinkGuard vừa được cập nhật. Vui lòng tải lại trang web (F5) để tiếp tục sử dụng.'
      };
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

export function onMessage(
  callback: (
    message: Message,
    sender: browser.Runtime.MessageSender
  ) => void | Promise<MessageResponse>
) {
  browser.runtime.onMessage.addListener(callback as any);
}

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
