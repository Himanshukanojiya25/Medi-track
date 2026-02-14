// src/styles/tokens/radii.ts

export const radii = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px', // ✅ Added 2xl
  '3xl': '32px', // ✅ Added 3xl
  '4xl': '40px', // ✅ Added 4xl
  full: '9999px',
} as const;

export type RadiiTokens = typeof radii;