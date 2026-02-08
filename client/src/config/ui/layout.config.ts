/**
 * Layout-related constants
 * Used by layouts / guards / shell components
 */
export const LAYOUT_CONFIG = {
  headerHeight: 64, // px
  sidebarWidth: 260, // px

  /**
   * Z-index layers (centralized)
   */
  zIndex: {
    HEADER: 1000,
    SIDEBAR: 900,
    MODAL: 1100,
    TOAST: 1200,
  },

  /**
   * Common spacing scale (px)
   */
  spacing: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
} as const;
