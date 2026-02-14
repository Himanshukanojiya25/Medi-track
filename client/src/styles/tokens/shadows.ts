// src/styles/tokens/shadows.ts

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.15)',
  '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)', // ✅ Added 2xl
  '3xl': '0 35px 60px -15px rgba(37, 99, 235, 0.3)', // ✅ Added 3xl
  focus: '0 0 0 3px rgba(37, 99, 235, 0.4)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.05)',
} as const;

export type ShadowTokens = typeof shadows;