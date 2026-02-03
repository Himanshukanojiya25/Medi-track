import { AIRateLimiterService } from "../../../src/services/ai/ai-rate-limiter.service";
import { AIUsageCounterModel } from "../../../src/models/ai/usage-counter/ai-usage-counter.model";

jest.mock("../../../src/models/ai/usage-counter/ai-usage-counter.model");

describe("AIRateLimiterService", () => {
  afterEach(() => jest.clearAllMocks());

  it("allows request under limit", async () => {
    (AIUsageCounterModel.findOneAndUpdate as any).mockResolvedValue({
      count: 1,
      resetAt: new Date(),
    });

    const result = await AIRateLimiterService.checkAndConsume(
      "user",
      "u1",
      "daily"
    );

    expect(result.allowed).toBe(true);
  });

  it("blocks when limit exceeded", async () => {
    (AIUsageCounterModel.findOneAndUpdate as any).mockResolvedValue({
      count: 9999,
      resetAt: new Date(),
    });

    const result = await AIRateLimiterService.checkAndConsume(
      "user",
      "u1",
      "daily"
    );

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
