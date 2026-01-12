import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { PromptVersion } from "../../../../src/models/ai/prompt-version";

/**
 * NOTE:
 * - No dropDatabase() here ❌
 * - Only clean this collection
 * - syncIndexes BEFORE duplicate tests
 */

beforeAll(async () => {
  await connectDB();
  await PromptVersion.syncIndexes();
});

beforeEach(async () => {
  await PromptVersion.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
});

describe("Schema Validation: PromptVersion", () => {
  const hospitalId = new Types.ObjectId();

  const basePayload = {
    name: "chat-default",
    scope: "hospital",
    hospitalId,
    version: 1,
    prompt: "You are a medical assistant",
    createdBy: new Types.ObjectId(),
  };

  it("should create valid prompt version", async () => {
    const doc = await PromptVersion.create(basePayload);
    expect(doc).toBeDefined();
    expect(doc.status).toBe("inactive");
  });

  it("should require hospitalId for hospital scope", async () => {
    await expect(
      PromptVersion.create({
        ...basePayload,
        hospitalId: undefined,
      })
    ).rejects.toThrow();
  });

  it("should allow global scope without hospitalId", async () => {
    const doc = await PromptVersion.create({
      name: "global-chat",
      scope: "global",
      version: 1,
      prompt: "Global AI",
      createdBy: new Types.ObjectId(),
    });

    expect(doc.scope).toBe("global");
    expect(doc.hospitalId).toBeUndefined();
  });

  it("should reject duplicate version for same name + scope + hospital", async () => {
    await PromptVersion.create(basePayload);

    // 🔑 critical: ensure index is ready before duplicate insert
    await PromptVersion.syncIndexes();

    await expect(
      PromptVersion.create(basePayload)
    ).rejects.toThrow();
  });
});
