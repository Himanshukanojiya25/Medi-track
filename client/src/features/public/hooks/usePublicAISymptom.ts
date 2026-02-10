import { useState } from "react";
import { submitPublicSymptoms } from "../services/public-ai.service";
import {
  AISymptomRequest,
  AISymptomResponse,
} from "../../../types/public/ai-public.types";

export type AISymptomStep = "intro" | "chat" | "result";

export function usePublicAISymptom() {
  // 🔹 FLOW STATE
  const [step, setStep] = useState<AISymptomStep>("intro");
  const [symptomText, setSymptomText] = useState("");

  // 🔹 API STATE
  const [data, setData] = useState<AISymptomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // user submits initial symptoms
  function startAnalysis(text: string) {
    setSymptomText(text);
    setStep("chat");
  }

  // chat completed → submit to API
  async function submit(input: AISymptomRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await submitPublicSymptoms(input);
      setData(result);
      setStep("result");
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  // restart entire flow
  function resetFlow() {
    setSymptomText("");
    setData(null);
    setError(null);
    setStep("intro");
  }

  return {
    // flow
    step,
    symptomText,

    // api
    data,
    isLoading,
    error,

    // actions
    startAnalysis,
    submit,
    resetFlow,
  };
}
