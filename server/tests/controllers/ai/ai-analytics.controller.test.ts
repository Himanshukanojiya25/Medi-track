import { Request, Response } from "express";
import { AIAnalyticsController } from "../../../src/controllers/ai/ai-analytics.controller";
import { AIAnalyticsService } from "../../../src/services/ai/ai-analytics.service";

jest.mock(
  "../../../src/services/ai/ai-analytics.service"
);

describe("AIAnalyticsController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should allow super_admin to access system analytics", async () => {
    (AIAnalyticsService.getDashboard as jest.Mock).mockResolvedValue(
      { mock: "data" }
    );

    req.user = { role: "super_admin" } as any;
    req.query = {};

    await AIAnalyticsController.getDashboard(
      req as Request,
      res as Response
    );

    expect(
      AIAnalyticsService.getDashboard
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: "system",
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { mock: "data" },
    });
  });

  it("should allow hospital_admin to access hospital analytics", async () => {
    (AIAnalyticsService.getDashboard as jest.Mock).mockResolvedValue(
      { mock: "data" }
    );

    req.user = {
      role: "hospital_admin",
      hospitalId: "h1",
    } as any;
    req.query = {};

    await AIAnalyticsController.getDashboard(
      req as Request,
      res as Response
    );

    expect(
      AIAnalyticsService.getDashboard
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: "hospital",
        hospitalId: "h1",
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should deny access for non-admin roles", async () => {
    req.user = { role: "doctor" } as any;

    await AIAnalyticsController.getDashboard(
      req as Request,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
