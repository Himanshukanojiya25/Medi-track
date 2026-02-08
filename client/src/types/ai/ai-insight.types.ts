import type { ISODateString } from "../shared";

/**
 * AI-generated insight / summary
 */
export interface AIInsight {
  readonly key: string;        // e.g. "SYMPTOM_SUMMARY"
  readonly content: string;    // plain text or markdown

  readonly generatedAt: ISODateString;
}
