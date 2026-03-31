/**
 * AI Symptom Request
 * EXACT MATCH with client
 */
export interface AISymptomRequest {
  symptoms: string;
  age?: number;
  gender?: "male" | "female" | "other";
}

/**
 * AI Symptom Suggestion
 */
export interface AISymptomSuggestion {
  title: string;
  description?: string;
  severity?: "low" | "medium" | "high";
  recommendedAction?: string;
}

/**
 * AI Symptom Response
 * EXACT MATCH with client
 */
export interface AISymptomResponse {
  suggestions: AISymptomSuggestion[];
  disclaimer?: string;
}