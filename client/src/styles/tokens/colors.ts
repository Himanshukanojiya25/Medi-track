// src/styles/tokens/colors.ts

export const colors = {
  // =========================
  // BRAND COLORS
  // =========================
  brand: {
    primary: '#2563EB',      // Trust blue (healthcare + SaaS)
    primaryHover: '#1D4ED8',
    primaryActive: '#1E40AF',

    secondary: '#0EA5E9',
    secondaryHover: '#0284C7',

    accent: '#22C55E',       // Success / positive actions
    accentHover: '#16A34A',
  },

  // =========================
  // NEUTRALS (UI BACKBONE)
  // =========================
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#020617',
  },

  // =========================
  // TEXT COLORS
  // =========================
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#6B7280',
    inverse: '#FFFFFF',
    disabled: '#9CA3AF',
  },

  // =========================
  // BACKGROUND COLORS
  // =========================
  background: {
    page: '#F9FAFB',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(17, 24, 39, 0.6)',
  },

  // =========================
  // FEEDBACK / STATUS
  // =========================
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // =========================
  // BORDERS & DIVIDERS
  // =========================
  border: {
    subtle: '#E5E7EB',
    default: '#D1D5DB',
    strong: '#9CA3AF',
    focus: '#2563EB',
  },
} as const;

export type ColorTokens = typeof colors;
