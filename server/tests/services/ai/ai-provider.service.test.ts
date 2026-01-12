// tests/services/ai/ai-provider.service.test.ts

import {
  MockAIProvider,
  AIProviderInput,
} from "../../../src/services/ai/ai-provider.service";

describe("MockAIProvider", () => {
  let provider: MockAIProvider;

  beforeEach(() => {
    provider = new MockAIProvider();
  });

  it("should generate a response for patient role in English", async () => {
    const input: AIProviderInput = {
      role: "patient",
      language: "en",
      prompt: "Explain my prescription",
    };

    const result = await provider.generateResponse(input);

    expect(result).toHaveProperty("id");
    expect(result.text).toContain("🩺 Care Assistant:");
    expect(result.text).toContain("Explain my prescription");
    expect(result.text).toContain("English Response");
    expect(result.tokensUsed).toBeGreaterThan(0);
    expect(result.model).toBe("mock-ai-v1");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("should generate a response for doctor role in Hindi", async () => {
    const input: AIProviderInput = {
      role: "doctor",
      language: "hi",
      prompt: "Patient summary do",
    };

    const result = await provider.generateResponse(input);

    expect(result.text).toContain("👨‍⚕️ Doctor Copilot:");
    expect(result.text).toContain("Hindi Response");
  });

  it("should throw error if prompt is missing", async () => {
    const input = {
      role: "patient",
      language: "en",
    } as AIProviderInput;

    await expect(
      provider.generateResponse(input)
    ).rejects.toThrow("AIProviderInput.prompt is required");
  });
});
