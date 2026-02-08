/**
 * AI System Types
 * ---------------
 * Used in AI bootstrap, providers, guards
 */

export interface AIConfig {
  enabled: boolean;
  mode: "mock" | "live";
  dailyLimit: number;
}

export interface AIUsage {
  usedToday: number;
  remainingToday: number;
}
