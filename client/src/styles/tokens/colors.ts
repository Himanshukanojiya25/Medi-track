// src/styles/tokens/colors.ts

export const colors = {
  // =========================
  // BRAND COLORS - CONSISTENT
  // =========================
  brand: {
    primary: '#2563EB',      // ✅ Consistent - Footer & Header
    primaryHover: '#1D4ED8',
    primaryActive: '#1E40AF',

    secondary: '#7209b7',    // ✅ Updated to match footer
    secondaryHover: '#5b0892',

    accent: '#4cc9f0',       // ✅ Updated
    accentHover: '#3aa8c7',
    
    success: '#06d6a0',
    successHover: '#05b588',

    danger: '#ef476f',
    dangerHover: '#d43b5e',
    
    warning: '#ffd166',
    emergency: '#EF4444',
  },

  // =========================
  // DARK THEME COLORS - FOR FOOTER
  // =========================
  dark: {
    bg: '#0A0C10',
    bgLighter: '#1A1E24',
    bgLight: '#2D2D2D',
    surface: '#1E1E2E',
    surfaceLighter: '#2D3748',
    
    text: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB',
      muted: '#D1D5DB',
      disabled: '#9CA3AF',
    },
    
    border: {
      subtle: '#2D3748',
      default: '#4A5568',
      strong: '#718096',
    }
  },

  // =========================
  // LIGHT THEME COLORS
  // =========================
  light: {
    bg: '#FFFFFF',
    bgSoft: '#F9FAFB',
    surface: '#FFFFFF',
    
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      muted: '#6B7280',
    },
    
    border: {
      subtle: '#E5E7EB',
      default: '#D1D5DB',
      strong: '#9CA3AF',
    }
  },

  // =========================
  // NEUTRALS (COMMON)
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
  // STATUS COLORS
  // =========================
  status: {
    success: '#06d6a0',
    warning: '#ffd166',
    error: '#ef476f',
    info: '#4cc9f0',
    emergency: '#EF4444',
  },

  // =========================
  // ACCENT COLORS
  // =========================
  accent: {
    blue: '#4361ee',
    purple: '#7209b7',
    teal: '#4cc9f0',
    green: '#06d6a0',
    red: '#ef476f',
    yellow: '#ffd166',
  },
} as const;

export type ColorTokens = typeof colors;