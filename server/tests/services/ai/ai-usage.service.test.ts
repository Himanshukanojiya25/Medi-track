import { AIUsageService } from "../../../src/services/ai/ai-usage.service";
import { AIUsageCounterModel } from "../../../src/models/ai/usage-counter/ai-usage-counter.model";

jest.mock("../../../src/models/ai/usage-counter/ai-usage-counter.model");

describe("AIUsageService", () => {
  it("records usage without throwing", async () => {
    (AIUsageCounterModel.updateOne as any).mockResolvedValue({});

    await expect(
      AIUsageService.recordUsage({
        scope: "user",
        scopeId: "u1",
        window: "daily",
      })
    ).resolves.not.toThrow();
  });
});
