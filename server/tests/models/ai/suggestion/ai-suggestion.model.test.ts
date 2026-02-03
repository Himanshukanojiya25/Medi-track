import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { AISuggestionModel } from "../../../../src/models/ai/suggestion";

describe("AI Suggestion Model", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    await disconnectDB();
  });

  it("should create a valid AI suggestion", async () => {
    const doc = await AISuggestionModel.create({
      hospitalId: new Types.ObjectId(),
      code: "DOCTOR_OVERLOAD",
      targetRole: "hospital_admin",
      category: "workload",
      priority: "high",
      title: "Doctor workload high",
      message: "One or more doctors are overloaded",
      source: "rule_engine",
    });

    expect(doc._id).toBeDefined();
    expect(doc.createdAt).toBeDefined();
  });

  it("should not allow update (immutable)", async () => {
    const doc = await AISuggestionModel.create({
      hospitalId: new Types.ObjectId(),
      code: "FOLLOW_UP_PENDING",
      targetRole: "doctor",
      category: "follow_up",
      priority: "medium",
      title: "Pending follow-ups",
      message: "You have pending follow-ups",
      source: "rule_engine",
    });

    await expect(
      AISuggestionModel.updateOne(
        { _id: doc._id },
        { title: "UPDATED" }
      )
    ).rejects.toThrow();
  });
});
