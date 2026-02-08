import type { ISODateString } from "../shared";

/**
 * AI usage counters
 * Window-based aggregation friendly
 */
export interface AIUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;

  readonly requestCount: number;
}

/**
 * Usage snapshot for a given window
 */
export interface AIUsageWindow {
  readonly from: ISODateString;
  readonly to: ISODateString;

  readonly usage: AIUsage;
}
