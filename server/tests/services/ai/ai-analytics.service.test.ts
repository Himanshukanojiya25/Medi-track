import { AIAnalyticsService } from "../../../src/services/ai/ai-analytics.service";

// Mock dependent models
jest.mock("../../../src/models/ai/usage-counter", () => ({
  AIUsageCounterModel: {
    aggregate: jest.fn(),
  },
}));

jest.mock("../../../src/models/ai/suggestion", () => ({
  AISuggestionModel: {
    aggregate: jest.fn(),
  },
}));

jest.mock("../../../src/models/ai/ai-audit-log", () => ({
  AIAuditLogModel: {
    aggregate: jest.fn(),
  },
}));

import { AIUsageCounterModel } from "../../../src/models/ai/usage-counter";
import { AISuggestionModel } from "../../../src/models/ai/suggestion";
import { AIAuditLogModel } from "../../../src/models/ai/ai-audit-log";

describe("AIAnalyticsService", () => {
  const baseQuery = {
    scope: "system" as const,
    from: new Date("2026-01-01"),
    to: new Date("2026-01-31"),
    granularity: "day" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return aggregated dashboard data", async () => {
    (AIUsageCounterModel.aggregate as jest.Mock).mockResolvedValue([
      { totalRequests: 100, uniqueUsers: 25 },
    ]);

    (AISuggestionModel.aggregate as jest.Mock).mockResolvedValue([
      { generated: 40, viewed: 30, actioned: 10 },
    ]);

    (AIAuditLogModel.aggregate as jest.Mock)
      // enhancements
      .mockResolvedValueOnce([
        { requested: 20, succeeded: 15, failed: 5 },
      ])
      // errors
      .mockResolvedValueOnce([
        { _id: "AI_RATE_LIMIT_EXCEEDED", count: 3 },
        { _id: "AI_SAFETY_BLOCKED", count: 2 },
      ]);

    const res =
      await AIAnalyticsService.getDashboard(
        baseQuery
      );

    expect(res.usage.totalRequests).toBe(100);
    expect(res.usage.uniqueUsers).toBe(25);

    expect(res.suggestions.generated).toBe(40);
    expect(res.suggestions.viewed).toBe(30);
    expect(res.suggestions.actioned).toBe(10);

    expect(res.enhancements.requested).toBe(20);
    expect(res.enhancements.succeeded).toBe(15);
    expect(res.enhancements.failed).toBe(5);

    expect(res.errors.rateLimitHits).toBe(3);
    expect(res.errors.safetyBlocked).toBe(2);
  });

  it("should throw when hospital scope is missing hospitalId", async () => {
    await expect(
      AIAnalyticsService.getDashboard({
        ...baseQuery,
        scope: "hospital",
      } as any)
    ).rejects.toThrow(
      "hospitalId required for hospital scope"
    );
  });
});
