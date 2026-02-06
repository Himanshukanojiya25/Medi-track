import { AIEnhancementResolverService } from "../../../src/services/ai/ai-enhancement-resolver.service";
import * as Constants from "../../../src/constants/ai/ai-enhancement.constants";
import { AIEnhancementCacheService } from "../../../src/services/ai/ai-enhancement-cache.service";
import { AIEnhancementInput } from "../../../src/types/ai/ai-enhancement.types";

describe("AIEnhancementResolverService", () => {
  const baseInput: AIEnhancementInput = {
    suggestionId: "sug-1",
    suggestionCode: "TEST_CODE",
    originalMessage: "Original suggestion message",
    targetRole: "doctor",
    modes: ["text_rewrite"],
  };

  beforeEach(async () => {
    await AIEnhancementCacheService.clear();
    jest.restoreAllMocks();
  });

  it("should return enhanced data for valid input", async () => {
    const res = await AIEnhancementResolverService.resolve(baseInput);

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.enhancedMessage).toBe(
      baseInput.originalMessage
    );
  });

  it("should apply default modes when modes are missing", async () => {
    const input: AIEnhancementInput = {
      ...baseInput,
      modes: undefined,
    };

    const res = await AIEnhancementResolverService.resolve(input);

    expect(res.success).toBe(true);
    expect(res.data?.enhancedMessage).toBeDefined();
  });

  it("should return cached result on second call", async () => {
    const first =
      await AIEnhancementResolverService.resolve(baseInput);
    const second =
      await AIEnhancementResolverService.resolve(baseInput);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(second.data).toEqual(first.data);
  });

  it("should fail safely when enhancement is disabled", async () => {
    jest
      .spyOn(Constants, "AI_ENHANCEMENT_ENABLED", "get")
      .mockReturnValue(false as any);

    const res = await AIEnhancementResolverService.resolve(
      baseInput
    );

    expect(res.success).toBe(false);
    expect(res.error?.code).toBe(
      "AI_ENHANCEMENT_DISABLED"
    );
  });

  it("should fail safely on invalid input", async () => {
    const badInput = {
      ...baseInput,
      originalMessage: "",
    } as AIEnhancementInput;

    const res = await AIEnhancementResolverService.resolve(
      badInput
    );

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("should timeout safely without throwing", async () => {
    jest
      .spyOn<any, any>(
        AIEnhancementResolverService as any,
        "resolveInternal"
      )
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(resolve, 2000)
          )
      );

    const res = await AIEnhancementResolverService.resolve(
      baseInput
    );

    expect(res.success).toBe(false);
    expect(res.error?.code).toBe(
      "AI_ENHANCEMENT_TIMEOUT"
    );
  });
});
