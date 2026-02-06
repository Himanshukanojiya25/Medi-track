import { Request, Response } from "express";
import { AIEnhancementController } from "../../../src/controllers/ai/ai-enhancement.controller";
import { AISuggestionModel } from "../../../src/models/ai/suggestion";
import { AIEnhancementResolverService } from "../../../src/services/ai/ai-enhancement-resolver.service";

jest.mock("../../../src/models/ai/suggestion");
jest.mock("../../../src/services/ai/ai-enhancement-resolver.service");

describe("AIEnhancementController.listEnhanced", () => {
  const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockUser = {
    id: "user-1",
    role: "doctor",
    hospitalId: "hospital-1",
  };

  const mockSuggestions = [
    {
      _id: "sug-1",
      code: "TEST_CODE_1",
      message: "Suggestion message 1",
      targetRole: "doctor",
      metadata: { a: 1 },
      createdAt: new Date(),
    },
    {
      _id: "sug-2",
      code: "TEST_CODE_2",
      message: "Suggestion message 2",
      targetRole: "doctor",
      metadata: {},
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is missing", async () => {
    const req = {
      user: null,
      query: {},
    } as unknown as Request;

    const res = mockRes();

    await AIEnhancementController.listEnhanced(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
  });

  it("should return enhanced suggestions when resolver succeeds", async () => {
    const req = {
      user: mockUser,
      query: {},
    } as unknown as Request;

    const res = mockRes();

    // Mock DB
    (AISuggestionModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockSuggestions),
    });

    // Mock resolver
    (AIEnhancementResolverService.resolve as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        enhancedMessage: "Enhanced text",
        confidenceScore: 0.9,
      },
    });

    await AIEnhancementController.listEnhanced(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data).toHaveLength(2);
    expect(payload.data[0].enhancement).toBeDefined();
    expect(payload.data[0].enhancement.enhancedMessage).toBe(
      "Enhanced text"
    );
  });

  it("should return original suggestion if enhancement fails", async () => {
    const req = {
      user: mockUser,
      query: {},
    } as unknown as Request;

    const res = mockRes();

    (AISuggestionModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockSuggestions[0]]),
    });

    (AIEnhancementResolverService.resolve as jest.Mock).mockResolvedValue({
      success: false,
      error: { code: "AI_FAIL", message: "fail" },
    });

    await AIEnhancementController.listEnhanced(req, res);

    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload.data[0].enhancement).toBeUndefined();
    expect(payload.data[0].message).toBe(
      mockSuggestions[0].message
    );
  });

  it("should be fail-safe if resolver throws", async () => {
    const req = {
      user: mockUser,
      query: {},
    } as unknown as Request;

    const res = mockRes();

    (AISuggestionModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockSuggestions[0]]),
    });

    (AIEnhancementResolverService.resolve as jest.Mock).mockRejectedValue(
      new Error("boom")
    );

    await AIEnhancementController.listEnhanced(req, res);

    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data[0].enhancement).toBeUndefined();
  });
});
