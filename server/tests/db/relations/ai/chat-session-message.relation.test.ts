import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { ChatSession } from "../../../../src/models/ai/chat-session";
import { ChatMessage } from "../../../../src/models/ai/chat-message";

beforeAll(async () => {
  await connectDB();
  await ChatMessage.syncIndexes();
});

beforeEach(async () => {
  await ChatSession.deleteMany({});
  await ChatMessage.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
});

describe("AI Relations: ChatSession ↔ ChatMessage", () => {
  it("should create chat message linked to chat session", async () => {
    const hospitalId = new Types.ObjectId();
    const actorId = new Types.ObjectId();

    const session = await ChatSession.create({
      hospitalId,
      actorId,
      actorRole: "patient",
      createdBy: actorId,
    });

    const message = await ChatMessage.create({
      hospitalId,
      sessionId: session._id,
      role: "user",
      content: "Hello AI",
      sequence: 1,
      createdBy: actorId,
    });

    expect(message.sessionId.toString()).toBe(session._id.toString());
  });

  it("should not allow duplicate sequence in same session", async () => {
    const hospitalId = new Types.ObjectId();
    const sessionId = new Types.ObjectId();

    await ChatMessage.create({
      hospitalId,
      sessionId,
      role: "user",
      content: "First",
      sequence: 1,
      createdBy: new Types.ObjectId(),
    });

    await expect(
      ChatMessage.create({
        hospitalId,
        sessionId,
        role: "assistant",
        content: "Duplicate",
        sequence: 1,
        createdBy: new Types.ObjectId(),
      })
    ).rejects.toThrow();
  });

  it("should allow same sequence for different sessions", async () => {
    const hospitalId = new Types.ObjectId();

    const msg = await ChatMessage.create({
      hospitalId,
      sessionId: new Types.ObjectId(),
      role: "user",
      content: "ok",
      sequence: 1,
      createdBy: new Types.ObjectId(),
    });

    expect(msg.sequence).toBe(1);
  });
});
