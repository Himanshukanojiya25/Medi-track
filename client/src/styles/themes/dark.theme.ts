// src/styles/themes/dark.theme.ts
import { colors, shadows, radii } from '../tokens';

export const darkTheme = {
  name: 'dark',
  vars: {
    '--bg-page': colors.neutral[900],
    '--bg-surface': colors.neutral[800],
    '--bg-elevated': colors.neutral[700],

    '--text-primary': colors.neutral[50],
    '--text-secondary': colors.neutral[200],
    '--text-muted': colors.neutral[400],

    '--brand-primary': colors.brand.primary,
    '--brand-primary-hover': colors.brand.primaryHover,
    '--brand-accent': colors.brand.accent,

    '--border-subtle': colors.neutral[700],
    '--border-default': colors.neutral[600],
    '--border-strong': colors.neutral[500],
    '--border-focus': colors.brand.primary,

    '--shadow-sm': shadows.xs,
    '--shadow-md': shadows.sm,
    '--shadow-lg': shadows.md,

    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
  },
} as const;

export type DarkTheme = typeof darkTheme;
