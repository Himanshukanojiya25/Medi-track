import { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { PromptVersion } from "../../../../src/models/ai/prompt-version";

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

describe("AI Relations: PromptVersion scope & constraints", () => {
  it("should allow global prompt without hospitalId", async () => {
    const doc = await PromptVersion.create({
      name: "global-default",
      scope: "global",
      version: 1,
      prompt: "Global AI",
      createdBy: new Types.ObjectId(),
    });

    expect(doc.scope).toBe("global");
  });

  it("should allow only one active prompt per hospital", async () => {
    const hospitalId = new Types.ObjectId();

    await PromptVersion.create({
      name: "chat",
      scope: "hospital",
      hospitalId,
      version: 1,
      status: "active",
      prompt: "v1",
      createdBy: new Types.ObjectId(),
    });

    await expect(
      PromptVersion.create({
        name: "chat",
        scope: "hospital",
        hospitalId,
        version: 2,
        status: "active",
        prompt: "v2",
        createdBy: new Types.ObjectId(),
      })
    ).rejects.toThrow();
  });
});
