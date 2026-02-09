// src/services/public/public-ai.api.ts

import { httpClient } from "../api/http.client";

export type AiSymptomRequest = {
  symptoms: string;
};

export type AiSymptomResponse = {
  summary: string;
  suggestedSpecialities: string[];
};

export const publicAiApi = {
  async analyzeSymptoms(payload: AiSymptomRequest) {
    const res = await httpClient.post<AiSymptomResponse>(
      "/public/ai/symptom-check",
      payload
    );
    return res.data;
  },
};
