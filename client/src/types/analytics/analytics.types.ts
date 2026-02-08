import type { ISODateString } from "../shared";

/**
 * Supported analytics time ranges
 */
export enum AnalyticsRange {
  TODAY = "TODAY",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  CUSTOM = "CUSTOM",
}

/**
 * Generic analytics query filter
 */
export interface AnalyticsQuery {
  readonly range: AnalyticsRange;
  readonly from?: ISODateString; // required when range = CUSTOM
  readonly to?: ISODateString;
}

/**
 * Key-value metric
 */
export interface Metric {
  readonly key: string;    // e.g. "TOTAL_APPOINTMENTS"
  readonly value: number;
}

/**
 * Analytics summary response
 */
export interface AnalyticsSummary {
  readonly metrics: readonly Metric[];
  readonly generatedAt: ISODateString;
}
