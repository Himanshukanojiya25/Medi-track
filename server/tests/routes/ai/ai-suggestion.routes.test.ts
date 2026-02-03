import request from "supertest";
import app from "../../../src/app";

describe("AI Suggestion Routes", () => {
  it("blocks unauthenticated access", async () => {
    const res = await request(app).get(
      "/api/v1/ai/suggestions"
    );

    expect(res.status).toBe(401);
  });
});
