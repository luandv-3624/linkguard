export const tooltipStyles = {
  container: (x: number, y: number) => ({
    position: 'absolute' as const,
    left: `${x}px`,
    top: `${y + 10}px`,
    zIndex: 2147483647,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
  }),

  content: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '12px',
    maxWidth: '320px',
    pointerEvents: 'auto' as const,
  },

  arrow: {
    position: 'absolute' as const,
    top: '-6px',
    left: '20px',
    width: '12px',
    height: '12px',
    background: 'white',
    borderLeft: '1px solid #e5e7eb',
    borderTop: '1px solid #e5e7eb',
    transform: 'rotate(45deg)',
  },

  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
  },

  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'linkguard-spin 0.6s linear infinite',
  },

  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ef4444',
  },

  result: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },

  badge: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    fontSize: '12px',
    backgroundColor: color,
  }),

  score: {
    color: '#6b7280',
    fontSize: '12px',
  },

  url: {
    color: '#374151',
    fontSize: '12px',
    wordBreak: 'break-all' as const,
    background: '#f9fafb',
    padding: '6px 8px',
    borderRadius: '4px',
  },

  reasons: {
    marginTop: '4px',
  },

  reasonsTitle: {
    fontWeight: '600',
    fontSize: '12px',
    color: '#374151',
    marginBottom: '4px',
  },

  reasonsList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '12px',
    color: '#6b7280',
  },

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '4px',
    borderTop: '1px solid #f3f4f6',
  },

  time: {
    fontSize: '11px',
    color: '#9ca3af',
  },
} as const;

export const TOOLTIP_ANIMATIONS = `
  @keyframes linkguard-spin {
    to { transform: rotate(360deg); }
  }
`;
