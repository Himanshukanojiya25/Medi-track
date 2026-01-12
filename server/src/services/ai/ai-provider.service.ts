// src/services/ai/ai-provider.service.ts

import { v4 as uuidv4 } from "uuid";

/**
 * AI input structure
 * This is the FINAL input that goes to any LLM provider
 */
export interface AIProviderInput {
  role: "patient" | "doctor" | "hospital-admin" | "super-admin" | "hospital";
  language: "en" | "hi";
  prompt: string;
  context?: Record<string, unknown>;
  metadata?: {
    sessionId?: string;
    hospitalId?: string;
    userId?: string;
  };
}

/**
 * AI output structure
 * This is what orchestrator will consume
 */
export interface AIProviderOutput {
  id: string;
  text: string;
  tokensUsed: number;
  model: string;
  createdAt: Date;
}

/**
 * Provider contract
 * Any AI engine (OpenAI, Azure, Claude, Mock) MUST follow this
 */
export interface AIProvider {
  generateResponse(
    input: AIProviderInput
  ): Promise<AIProviderOutput>;
}

/**
 * Mock AI Provider
 * ----------------------------------
 * - Deterministic
 * - Predictable
 * - Safe for tests
 * - NO external dependency
 */
export class MockAIProvider implements AIProvider {
  private readonly modelName = "mock-ai-v1";

  async generateResponse(
    input: AIProviderInput
  ): Promise<AIProviderOutput> {
    if (!input || !input.prompt) {
      throw new Error("AIProviderInput.prompt is required");
    }

    const rolePrefix = this.getRolePrefix(input.role);
    const languageSuffix =
      input.language === "hi"
        ? " (Hindi Response)"
        : " (English Response)";

    const textResponse = `${rolePrefix} ${input.prompt}${languageSuffix}`;

    return {
      id: uuidv4(),
      text: textResponse,
      tokensUsed: this.estimateTokens(input.prompt),
      model: this.modelName,
      createdAt: new Date(),
    };
  }

  /**
   * Adds role-aware tone
   */
  private getRolePrefix(role: AIProviderInput["role"]): string {
    switch (role) {
      case "patient":
        return "🩺 Care Assistant:";
      case "doctor":
        return "👨‍⚕️ Doctor Copilot:";
      case "hospital-admin":
        return "🏥 Operations Assistant:";
      case "super-admin":
        return "👑 System Intelligence:";
      case "hospital":
        return "📊 Hospital AI:";
      default:
        return "🤖 AI:";
    }
  }

  /**
   * Very rough token estimation
   * Used ONLY for mock & cost simulations
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
