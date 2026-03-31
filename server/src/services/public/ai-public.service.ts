import { AISymptomRequest, AISymptomResponse } from "../../types/public";

export class PublicAIService {
  static async analyzeSymptoms(input: AISymptomRequest): Promise<AISymptomResponse> {
    const suggestions = [];

    if (input.symptoms.toLowerCase().includes("fever")) {
      suggestions.push({
        title: "Fever",
        description: "Rest and stay hydrated. Monitor temperature.",
        severity: "medium" as const,
        recommendedAction: "Consult a general physician if fever persists >3 days",
      });
    }

    if (input.symptoms.toLowerCase().includes("cough")) {
      suggestions.push({
        title: "Cough",
        description: "Warm fluids and rest may help.",
        severity: "low" as const,
        recommendedAction: "Consult a pulmonologist if cough persists >7 days",
      });
    }

    if (input.symptoms.toLowerCase().includes("chest pain")) {
      suggestions.push({
        title: "Chest Pain",
        description: "This could be serious. Seek immediate medical attention.",
        severity: "high" as const,
        recommendedAction: "Visit emergency room immediately",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        title: "General Symptoms",
        description: "Based on your symptoms, a general consultation is recommended.",
        severity: "low" as const,
        recommendedAction: "Book an appointment with a general physician",
      });
    }

    return {
      suggestions,
      disclaimer: "This AI-generated information is for guidance only and not a medical diagnosis. Please consult a qualified healthcare professional.",
    };
  }
}