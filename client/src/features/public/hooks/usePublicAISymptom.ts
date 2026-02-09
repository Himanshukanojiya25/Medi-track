// src/features/public/hooks/usePublicAISymptom.ts

import { useState } from "react";
import { submitPublicSymptoms } from "../services/public-ai.service";
import {
  AISymptomRequest,
  AISymptomResponse,
} from "../../../types/public/ai-public.types";

export function usePublicAISymptom() {
  const [data, setData] = useState<AISymptomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function submit(input: AISymptomRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await submitPublicSymptoms(input);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    data,
    isLoading,
    error,
    submit,
  };
}
