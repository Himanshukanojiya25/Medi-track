/**
 * Theme tokens
 * Actual styling lives in styles/
 */
export const THEME_CONFIG = {
  mode: "light" as "light" | "dark",

  colors: {
    primary: "#2563eb",
    secondary: "#64748b",
    success: "#16a34a",
    warning: "#f59e0b",
    error: "#dc2626",

    background: "#ffffff",
    surface: "#f8fafc",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
  },

  /**
   * Typography scale
   */
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",

    fontSize: {
      SM: 12,
      MD: 14,
      LG: 16,
      XL: 20,
      XXL: 24,
    },

    fontWeight: {
      REGULAR: 400,
      MEDIUM: 500,
      BOLD: 700,
    },
  },

  /**
   * Border radius scale (px)
   */
  radius: {
    SM: 4,
    MD: 8,
    LG: 12,
  },
} as const;
