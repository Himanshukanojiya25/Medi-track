// src/features/public/services/public-ai.service.ts

import {
  AISymptomRequest,
  AISymptomResponse,
} from "../../../types/public/ai-public.types";

export async function submitPublicSymptoms(
  _input: AISymptomRequest
): Promise<AISymptomResponse> {
  return {
    suggestions: [],
    disclaimer:
      "This AI-generated information is for guidance only and not a medical diagnosis.",
  };
}
