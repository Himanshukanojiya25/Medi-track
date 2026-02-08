// src/styles/tokens/spacing.ts

export const spacing = {
  none: '0px',

  xxxs: '2px',
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',

  section: '80px',
  page: '120px',
} as const;

export type SpacingTokens = typeof spacing;
