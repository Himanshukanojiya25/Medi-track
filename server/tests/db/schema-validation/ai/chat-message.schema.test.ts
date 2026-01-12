import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { ChatMessage } from "../../../../src/models/ai/chat-message";

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

describe("Schema Validation: ChatMessage", () => {
  const basePayload = {
    hospitalId: new Types.ObjectId(),
    sessionId: new Types.ObjectId(),
    role: "user",
    content: "Hello AI",
    sequence: 1,
    createdBy: new Types.ObjectId(),
  };

  it("should create valid chat message", async () => {
    const msg = await ChatMessage.create(basePayload);
    expect(msg.status).toBe("sent");
  });

  it("should fail without content", async () => {
    await expect(
      ChatMessage.create({
        ...basePayload,
        content: "",
      })
    ).rejects.toThrow();
  });

  it("should fail with invalid role", async () => {
    await expect(
      ChatMessage.create({
        ...basePayload,
        role: "bot",
      })
    ).rejects.toThrow();
  });

  it("should fail with sequence < 1", async () => {
    await expect(
      ChatMessage.create({
        ...basePayload,
        sequence: 0,
      })
    ).rejects.toThrow();
  });
});
