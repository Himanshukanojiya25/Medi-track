/**
 * Build-time configuration
 * Used for debugging, versioning, support
 */
export const BUILD_CONFIG = {
  /**
   * Injected by Vite during build
   */
  version: import.meta.env.VITE_APP_VERSION ?? "dev",
  buildTime: import.meta.env.VITE_BUILD_TIME ?? "local",

  /**
   * Flags useful for diagnostics
   */
  isProdBuild: import.meta.env.PROD,
} as const;
