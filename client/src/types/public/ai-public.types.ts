// src/types/public/ai-public.types.ts

export interface AISymptomRequest {
  symptoms: string;
  age?: number;
  gender?: "male" | "female" | "other";
}

export interface AISymptomSuggestion {
  title: string;
  description?: string;
  severity?: "low" | "medium" | "high";
  recommendedAction?: string;
}

export interface AISymptomResponse {
  suggestions: AISymptomSuggestion[];
  disclaimer?: string;
}
