// src/styles/themes/high-contrast.theme.ts
import { colors, radii } from '../tokens';

export const highContrastTheme = {
  name: 'high-contrast',
  vars: {
    '--bg-page': '#000000',
    '--bg-surface': '#000000',
    '--bg-elevated': '#000000',

    '--text-primary': '#FFFFFF',
    '--text-secondary': '#E5E7EB',
    '--text-muted': '#D1D5DB',

    '--brand-primary': '#FFFFFF',
    '--brand-primary-hover': '#E5E7EB',
    '--brand-accent': '#FFFFFF',

    '--border-subtle': '#FFFFFF',
    '--border-default': '#FFFFFF',
    '--border-strong': '#FFFFFF',
    '--border-focus': '#FFFFFF',

    '--shadow-sm': 'none',
    '--shadow-md': 'none',
    '--shadow-lg': 'none',

    '--radius-sm': radii.none,
    '--radius-md': radii.none,
    '--radius-lg': radii.none,
  },
} as const;

export type HighContrastTheme = typeof highContrastTheme;
