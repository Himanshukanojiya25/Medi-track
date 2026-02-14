// src/styles/themes/light.theme.ts

import { colors, shadows, radii } from '../tokens';

export const lightTheme = {
  name: 'light',
  vars: {
    // =========================
    // BACKGROUNDS
    // =========================
    '--bg-page': colors.light.bgSoft,
    '--bg-surface': colors.light.surface,
    '--bg-elevated': colors.light.surface,
    '--bg-overlay': 'rgba(17, 24, 39, 0.6)',

    // =========================
    // TEXT COLORS
    // =========================
    '--text-primary': colors.light.text.primary,
    '--text-secondary': colors.light.text.secondary,
    '--text-muted': colors.light.text.muted,
    '--text-inverse': colors.dark.text.primary,
    '--text-disabled': colors.neutral[400],

    // =========================
    // BRAND COLORS
    // =========================
    '--brand-primary': colors.brand.primary,
    '--brand-primary-hover': colors.brand.primaryHover,
    '--brand-primary-active': colors.brand.primaryActive,
    
    '--brand-secondary': colors.brand.secondary,
    '--brand-secondary-hover': colors.brand.secondaryHover,
    
    '--brand-accent': colors.brand.accent,
    '--brand-accent-hover': colors.brand.accentHover,
    
    '--brand-success': colors.brand.success,
    '--brand-success-hover': colors.brand.successHover,
    
    '--brand-danger': colors.brand.danger,
    '--brand-danger-hover': colors.brand.dangerHover,
    
    '--brand-warning': colors.brand.warning,
    '--brand-emergency': colors.brand.emergency,

    // =========================
    // GRADIENTS
    // =========================
    '--gradient-primary': `linear-gradient(135deg, ${colors.brand.primary}, ${colors.brand.secondary}, ${colors.brand.accent})`,
    '--gradient-success': `linear-gradient(135deg, ${colors.brand.success}, ${colors.brand.accent})`,
    '--gradient-danger': `linear-gradient(135deg, ${colors.brand.danger}, ${colors.brand.warning})`,
    '--gradient-dark': `linear-gradient(135deg, ${colors.dark.bg}, ${colors.dark.bgLighter}, ${colors.dark.bgLight})`,

    // =========================
    // BORDERS
    // =========================
    '--border-subtle': colors.light.border.subtle,
    '--border-default': colors.light.border.default,
    '--border-strong': colors.light.border.strong,
    '--border-focus': colors.brand.primary,

    // =========================
    // SHADOWS - ✅ FIXED: 2xl and 3xl added
    // =========================
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--shadow-xl': shadows.xl,
    '--shadow-2xl': shadows['2xl'],
    '--shadow-3xl': shadows['3xl'],
    '--shadow-focus': shadows.focus,
    '--shadow-inner': shadows.inner,

    // =========================
    // RADIUS - ✅ FIXED: 2xl, 3xl, 4xl added
    // =========================
    '--radius-xs': radii.xs,
    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
    '--radius-xl': radii.xl,
    '--radius-2xl': radii['2xl'],
    '--radius-3xl': radii['3xl'],
    '--radius-4xl': radii['4xl'],
    '--radius-full': radii.full,

    // =========================
    // SPACING
    // =========================
    '--container-max-width': '1440px',
    '--container-padding': 'clamp(1.5rem, 5vw, 4rem)',
    '--section-spacing': 'clamp(4rem, 8vw, 8rem)',

    // =========================
    // TRANSITIONS
    // =========================
    '--transition-fast': 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
    '--transition-smooth': 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '--transition-bounce': 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // =========================
    // GLASS EFFECTS
    // =========================
    '--glass-bg': 'rgba(255, 255, 255, 0.08)',
    '--glass-bg-dark': 'rgba(0, 0, 0, 0.08)',
    '--glass-border': 'rgba(255, 255, 255, 0.12)',
    '--glass-border-dark': 'rgba(0, 0, 0, 0.08)',
    '--glass-blur': 'blur(20px) saturate(180%)',
  },
} as const;

export type LightTheme = typeof lightTheme;