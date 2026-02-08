/**
 * Core App Types
 * --------------
 * Used across bootstrap, lifecycle, providers, routing
 */

export type AppMode = "development" | "staging" | "production";

export interface AppEnvironment {
  MODE: AppMode;
  API_BASE_URL: string;
  ENABLE_ANALYTICS: boolean;
  ENABLE_AI: boolean;
}

export interface AppMeta {
  name: string;
  version: string;
  buildTime: string;
}
