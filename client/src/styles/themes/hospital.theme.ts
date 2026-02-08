// src/styles/themes/hospital.theme.ts
import { colors, shadows, radii } from '../tokens';

export const hospitalTheme = {
  name: 'hospital',
  vars: {
    '--bg-page': '#F7FBFF',
    '--bg-surface': '#FFFFFF',
    '--bg-elevated': '#FFFFFF',

    '--text-primary': colors.text.primary,
    '--text-secondary': colors.text.secondary,
    '--text-muted': colors.text.muted,

    '--brand-primary': '#0EA5E9', // calming blue
    '--brand-primary-hover': '#0284C7',
    '--brand-accent': '#22C55E',

    '--border-subtle': '#E6F0FA',
    '--border-default': '#D6E6F5',
    '--border-strong': '#BFD8EE',
    '--border-focus': '#0EA5E9',

    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,

    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
  },
} as const;

export type HospitalTheme = typeof hospitalTheme;
