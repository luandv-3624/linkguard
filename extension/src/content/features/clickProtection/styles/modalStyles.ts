// src/content/features/clickProtection/styles/modalStyles.ts

export const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2147483647,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },

  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  header: (color: string, bgColor: string) => ({
    padding: '32px 24px',
    textAlign: 'center' as const,
    borderBottom: `2px solid ${color}`,
    backgroundColor: bgColor,
  }),

  title: (color: string) => ({
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    color,
  }),

  description: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
    lineHeight: 1.5,
  },

  body: {
    padding: '24px',
  },

  section: {
    marginBottom: '20px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },

  urlDisplay: {
    background: '#f9fafb',
    padding: '12px',
    borderRadius: '6px',
    wordBreak: 'break-all' as const,
    fontSize: '14px',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
  },

  threatContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  badge: (bgColor: string) => ({
    display: 'inline-block' as const,
    padding: '6px 12px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: bgColor,
  }),

  score: {
    fontSize: '14px',
    color: '#6b7280',
  },

  reasonsList: {
    listStyle: 'none' as const,
    padding: 0,
    margin: 0,
  },

  reasonItem: {
    padding: '8px 12px',
    background: '#fef2f2',
    borderLeft: '3px solid #dc2626',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#991b1b',
    borderRadius: '4px',
  },

  redirectContainer: {
    background: '#f9fafb',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },

  redirectItem: {
    fontSize: '13px',
    color: '#6b7280',
    padding: '4px 0',
    wordBreak: 'break-all' as const,
  },

  footer: {
    display: 'flex',
    gap: '12px',
    padding: '20px 24px',
    background: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    flexWrap: 'wrap' as const,
  },

  button: {
    flex: 1,
    minWidth: '140px',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  buttonSecondary: {
    background: '#f3f4f6',
    color: '#374151',
  },

  buttonWhitelist: {
    background: '#3b82f6',
    color: 'white',
  },

  buttonDanger: {
    background: 'white',
    color: '#dc2626',
    border: '2px solid #dc2626',
  },

  branding: {
    textAlign: 'center' as const,
    padding: '12px',
    fontSize: '12px',
    color: '#9ca3af',
    borderTop: '1px solid #f3f4f6',
  },
} as const;
