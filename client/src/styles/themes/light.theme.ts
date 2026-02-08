// src/styles/themes/light.theme.ts
import { colors, shadows, radii } from '../tokens';

export const lightTheme = {
  name: 'light',
  vars: {
    '--bg-page': colors.background.page,
    '--bg-surface': colors.background.surface,
    '--bg-elevated': colors.background.elevated,

    '--text-primary': colors.text.primary,
    '--text-secondary': colors.text.secondary,
    '--text-muted': colors.text.muted,

    '--brand-primary': colors.brand.primary,
    '--brand-primary-hover': colors.brand.primaryHover,
    '--brand-accent': colors.brand.accent,

    '--border-subtle': colors.border.subtle,
    '--border-default': colors.border.default,
    '--border-strong': colors.border.strong,
    '--border-focus': colors.border.focus,

    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,

    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
  },
} as const;

export type LightTheme = typeof lightTheme;
