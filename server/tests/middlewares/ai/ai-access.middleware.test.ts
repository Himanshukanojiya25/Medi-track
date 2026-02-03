import { aiAccessMiddleware } from "../../../src/middlewares/ai/ai-access.middleware";

describe("aiAccessMiddleware", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalKey;
  });

  it("does nothing when AI is disabled (safe no-op)", () => {
    delete process.env.OPENAI_API_KEY; // AI disabled

    const req: any = { user: { role: "doctor" } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    aiAccessMiddleware(req, res, next);

    // ✅ ACTUAL CONTRACT
    expect(next).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
