export enum MessageType {
  // Content → Background
  ANALYZE_URL = 'ANALYZE_URL',
  CHECK_URL_SAFETY = 'CHECK_URL_SAFETY',
  
  // Background → Content
  ANALYSIS_RESULT = 'ANALYSIS_RESULT',
  SAFETY_CHECK_RESULT = 'SAFETY_CHECK_RESULT',
  
  // Popup ↔ Background
  GET_STATS = 'GET_STATS',
  GET_HISTORY = 'GET_HISTORY',
  GET_SETTINGS = 'GET_SETTINGS',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  MANUAL_SCAN = 'MANUAL_SCAN',
  CLEAR_HISTORY = 'CLEAR_HISTORY'
}

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
  requestId?: string;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
