import { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { PromptVersion } from "../../../../src/models/ai/prompt-version";

jest.setTimeout(20000);

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

describe("AI Seeds", () => {
  it("should seed default global prompt", async () => {
    const prompt = await PromptVersion.create({
      name: "default-chat",
      scope: "global",
      version: 1,
      status: "active",
      prompt: "You are a medical AI",
      createdBy: new Types.ObjectId(),
    });

    expect(prompt.status).toBe("active");
  });

  it("should not allow duplicate active global prompt", async () => {
    await PromptVersion.create({
      name: "triage",
      scope: "global",
      version: 1,
      status: "active",
      prompt: "v1",
      createdBy: new Types.ObjectId(),
    });

    await expect(
      PromptVersion.create({
        name: "triage",
        scope: "global",
        version: 2,
        status: "active",
        prompt: "v2",
        createdBy: new Types.ObjectId(),
      })
    ).rejects.toThrow();
  });
});
