import request from "supertest";
import mongoose, { Types } from "mongoose";
import app from "../../../src/app";
import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import { AISuggestionModel } from "../../../src/models/ai/suggestion";

describe("AI Suggestion Controller", () => {
  const hospitalId = new Types.ObjectId();
  const userId = new Types.ObjectId();

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    await disconnectDB();
  });

  it("returns suggestions for logged-in role", async () => {
    await AISuggestionModel.create([
      {
        hospitalId,
        code: "ADMIN_ALERT",
        targetRole: "hospital_admin",
        category: "alert",
        priority: "high",
        title: "Alert",
        message: "Something needs attention",
        source: "rule_engine",
      },
      {
        hospitalId,
        code: "DOCTOR_TIP",
        targetRole: "doctor",
        category: "education",
        priority: "low",
        title: "Tip",
        message: "Helpful tip",
        source: "system_default",
      },
    ]);

    const res = await request(app)
      .get("/api/v1/ai/suggestions")
      .set("x-test-user", JSON.stringify({
        id: userId.toString(),
        role: "hospital_admin",
        hospitalId: hospitalId.toString(),
      }));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].code).toBe("ADMIN_ALERT");
  });
});
