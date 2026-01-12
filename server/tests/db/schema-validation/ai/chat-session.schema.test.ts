import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { ChatSession } from "../../../../src/models/ai/chat-session";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    const db = mongoose.connection.db;
    if (db) {
      await db.dropDatabase();
    }
  }

  await disconnectDB();
});

describe("Schema Validation: ChatSession", () => {
  const basePayload = {
    hospitalId: new Types.ObjectId(),
    actorId: new Types.ObjectId(),
    actorRole: "patient",
    createdBy: new Types.ObjectId(),
  };

  it("should create valid chat session", async () => {
    const session = await ChatSession.create(basePayload);
    expect(session.status).toBe("active");
    expect(session.startedAt).toBeDefined();
  });

  it("should fail without hospitalId", async () => {
    await expect(
      ChatSession.create({
        ...basePayload,
        hospitalId: undefined,
      })
    ).rejects.toThrow();
  });

  it("should fail with invalid actorRole", async () => {
    await expect(
      ChatSession.create({
        ...basePayload,
        actorRole: "random",
      })
    ).rejects.toThrow();
  });

  it("should auto-set endedAt when status is closed", async () => {
    const session = await ChatSession.create({
      ...basePayload,
      status: "closed",
    });

    expect(session.endedAt).toBeDefined();
  });
});
