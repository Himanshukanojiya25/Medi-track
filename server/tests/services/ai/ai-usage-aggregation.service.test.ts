/// <reference types="jest" />

import mongoose, { Types } from "mongoose";
import { AIUsageAggregationService } from "../../../src/services/ai/ai-usage-aggregation.service";
import { AIAuditLogModel } from "../../../src/models/ai/ai-audit-log/ai-audit-log.model";

describe("AI Usage Aggregation Service", () => {
  beforeAll(async () => {
    /**
     * Ensure model is registered
     * (important for aggregation tests)
     */
    expect(AIAuditLogModel).toBeDefined();
  });

  beforeEach(async () => {
    /**
     * Clean slate before each test
     * Aggregation tests MUST be isolated
     */
    await AIAuditLogModel.deleteMany({});
  });

  it("aggregates hospital usage grouped by actorRole", async () => {
    const hospitalId = new Types.ObjectId();

    await AIAuditLogModel.create([
      {
        hospitalId,
        actorRole: "doctor",
        actorId: new Types.ObjectId(),
        aiMode: "mock",
        actionType: "CHAT",
        action: "AI_RESPONSE_GENERATED",
        metadata: {},
      },
      {
        hospitalId,
        actorRole: "doctor",
        actorId: new Types.ObjectId(),
        aiMode: "mock",
        actionType: "CHAT",
        action: "AI_RESPONSE_GENERATED",
        metadata: {},
      },
      {
        hospitalId,
        actorRole: "patient",
        actorId: new Types.ObjectId(),
        aiMode: "mock",
        actionType: "CHAT",
        action: "AI_RESPONSE_GENERATED",
        metadata: {},
      },
    ]);

    const result =
      await AIUsageAggregationService.getHospitalUsage(
        hospitalId.toString()
      );

    expect(result).toEqual(
      expect.arrayContaining([
        { role: "doctor", total: 2 },
        { role: "patient", total: 1 },
      ])
    );
  });

  it("returns empty array for invalid hospitalId", async () => {
    const result =
      await AIUsageAggregationService.getHospitalUsage(
        "invalid-id"
      );

    expect(result).toEqual([]);
  });
});
